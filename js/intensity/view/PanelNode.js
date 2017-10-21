// Copyright 2014-2015, University of Colorado Boulder

/**
 * Scenery node to show a panel using "faked" 3d perspective instead of real 3d projections.
 * Also draws its own handle and the light projected onto it.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var HeatMap = require( 'SEASONS/intensity/model/HeatMap' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var knobImage = require( 'image!SEASONS/knob.png' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var seasons = require( 'SEASONS/seasons' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants
  var FRAME_LINE_WIDTH = 3;

  function PanelNode( panelModel, playAreaCenter, sendOtherPanelsHome, flashlightOnProperty, setLightTipAndTail, options ) {
    this.panelModel = panelModel;
    this.setLightProjection = setLightTipAndTail;
    this.playAreaCenter = playAreaCenter;
    var self = this;
    options = _.extend( {
      fill: null,
      cursor: 'pointer',
      stroke: null,
      numberHorizontalGridLines: 0,
      numberVerticalGridLines: 0
    }, options );

    //The handle
    this.knobNode = new Image( knobImage, { scale: 0.5 } );

    //Separate background and frame into separate layers so the grid lines (if any) can intervene
    //TODO: to improve performance, join these layers if no gridlines?
    this.background = new Path( null, { fill: options.fill } );
    this.frame = new Path( null, { stroke: options.stroke, lineWidth: FRAME_LINE_WIDTH } );

    var gridLineStroke = 'white';
    var s = 0.7;
    this.verticalGridLineWidth = 2.8 * s;
    this.horizontalGridLineWidth = 4 * s;

    this.horizontalGridLines = [];
    var i;
    for ( i = 0; i < options.numberHorizontalGridLines; i++ ) {
      this.horizontalGridLines.push( new Line( 0, 0, 0, 0, {
        lineWidth: this.horizontalGridLineWidth,
        stroke: gridLineStroke
      } ) );
    }

    this.verticalGridLines = [];
    for ( i = 0; i < options.numberVerticalGridLines; i++ ) {
      this.verticalGridLines.push( new Line( 0, 0, 0, 0, {
        lineWidth: this.verticalGridLineWidth,
        stroke: gridLineStroke
      } ) );
    }

    this.lightPath = new Path( null, { fill: 'white' } );

    var linearFunction = new LinearFunction( 0, 1, 0.5, 1 );

    //For the intensity panel, show opacity
    if ( panelModel.type === 'intensity' ) {
      panelModel.intensityProperty.link( function( intensity ) {
        self.lightPath.opacity = linearFunction( intensity );
      } );
    }

    //Link heat map intensity to color
    if ( panelModel.type === 'heat' ) {
      panelModel.timeAveragedIntensityProperty.link( function( intensity ) {
        self.lightPath.fill = HeatMap.intensityToColor( intensity );
      } );
    }

    new DerivedProperty( [ flashlightOnProperty, panelModel.stateProperty, panelModel.animatingProperty ],
      function( flashlightOn, state, animating ) {
        return flashlightOn && state === 'center' && !animating;
      } ).linkAttribute( this.lightPath, 'visible' );

    //Location where objects can be put in front of the flashlight.
    //Account for the size of the knob here so the panel will still be centered
    this.comparePosition = playAreaCenter;

    //Update the knob location when the panel arrives in the center
    panelModel.stateProperty.link( function( state ) {
      if ( state === 'center' ) {
        self.updateShape();
      }
    } );

    var tmp = new DerivedProperty( [ panelModel.animatingProperty, panelModel.stateProperty ],
      function( animating, state ) {
        return !animating && state === 'center';
      } );
    tmp.linkAttribute( this.knobNode, 'visible' );

    // Update the knob location after the panel animates to the center
    panelModel.animatingProperty.link( function( animating ) {
      if ( !animating ) {
        self.updateShape();
      }
    } );

    //TODO: separate the background and border but only where grid lines applied (for performance)
    var children = [ this.background ];
    for ( i = 0; i < this.horizontalGridLines.length; i++ ) {
      children.push( this.horizontalGridLines[ i ] );
    }
    for ( i = 0; i < this.verticalGridLines.length; i++ ) {
      children.push( this.verticalGridLines[ i ] );
    }
    children.push( this.frame, this.knobNode, this.lightPath );
    Node.call( this, { children: children } );

    // click in the track to change the value, continue dragging if desired
    var translate = function( event ) {
      panelModel.positionProperty.value = self.globalToParentPoint( event.pointer.point );//TODO: GC
    };

    var rotate = function( event ) {
      var point = self.globalToParentPoint( event.pointer.point );
      //TODO bad name, x is a Vector2
      var x = point.minus( panelModel.positionProperty.value );
      panelModel.unclampedAngleProperty.value = originalAngle + x.angle() - angleRelativeToPivot;
//      console.log( point.x, point.y, x.x, x.y, panelModel.unclampedAngleProperty.value, panelModel.angleProperty.value );
//      console.log( panelModel.positionProperty.value, x );
    };

    var angleRelativeToPivot = 0;
    var originalAngle = 0;

    //TODO: Drag based on deltas
    this.addInputListener( new SimpleDragHandler( {

      //When starting the drag, animate to full size (if it was small in the toolbox)
      start: function( event ) {

        //TODO: cancel all tweens

        if ( panelModel.stateProperty.value === 'toolbox' ) {
          self.moveToFront();
          panelModel.stateProperty.value = 'dragging';
          translate( event );

          new TWEEN.Tween( { scale: panelModel.scaleProperty.value } )
            .to( { scale: 1 }, 500 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() { panelModel.scaleProperty.value = this.scale; } )
            .start( phet.joist.elapsedTime );
        }
        else {
          //TODO bad name, dx is a Vector2
          var dx = self.globalToParentPoint( event.pointer.point ).minus( panelModel.positionProperty.value );
          angleRelativeToPivot = dx.angle();
          originalAngle = panelModel.angleProperty.value;
          console.log( 'angleRelativeToPivot', angleRelativeToPivot, 'originalAngle', panelModel.angleProperty.value );
        }
      },

      //Release the panel and let it fly to whichever is closer, the toolbox or the target region
      //Reduce size if going to the toolbox

      drag: function( event ) {

        if ( panelModel.stateProperty.value === 'center' ) {


          //If the user dragged far enough from the center of the panel, it should snap to the touch event and become translation again
          var position = self.globalToParentPoint( event.pointer.point );
          var home = self.panelModel.positionProperty.initialValue;
          var distanceToHome = home.distance( position );
          if ( distanceToHome < 50 ) {
            panelModel.stateProperty.value = 'dragging';
          }
          else {
            rotate( event );
          }
        }
        else {
          translate( event );
        }
      },

      end: function( event ) {
        if ( panelModel.stateProperty.value === 'dragging' ) {
          //Move to the start position or compare position, whichever is closer.
          var position = self.panelModel.positionProperty.value;
          var distToStart = self.panelModel.positionProperty.initialValue.distance( position );
          var distToCenter = self.comparePosition.distance( position );

          if ( distToStart < distToCenter ) {
            self.animateToToolbox();
          }
          else {
            sendOtherPanelsHome( self );
            self.animateToCenter();
          }
        }
      }
    } ) );

    this.mutate( options );

    Property.multilink( [ panelModel.positionProperty, panelModel.angleProperty, panelModel.scaleProperty ],
      function() {
        self.updateShape();
      } );
  }

  seasons.register( 'PanelNode', PanelNode );

  return inherit( Node, PanelNode, {

    //Animate the PanelNode to move to the target region
    animateToCenter: function() {
      this.panelModel.animatingProperty.value = true;
      var self = this;
      new TWEEN.Tween( { x: self.panelModel.positionProperty.value.x, y: self.panelModel.positionProperty.value.y } )
        .to( { x: this.comparePosition.x, y: this.comparePosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() {
          self.panelModel.positionProperty.value = new Vector2( this.x, this.y );
        } )
        .onComplete( function() {
          self.panelModel.stateProperty.value = 'center';
          self.panelModel.animatingProperty.value = false;
        } )
        .start( phet.joist.elapsedTime );
    },

    //Animate the panel to its starting location in the toolbox
    animateToToolbox: function() {
      var self = this;

      //Shrink & Move to the toolbox
      this.panelModel.animatingProperty.value = true;
      new TWEEN.Tween( {
        angle: self.panelModel.angleProperty.value,
        scale: self.panelModel.scaleProperty.value,
        x: self.panelModel.positionProperty.value.x,
        y: self.panelModel.positionProperty.value.y
      } )
        .to( {
          angle: self.panelModel.angleProperty.initialValue,
          scale: 0.5,
          x: self.panelModel.positionProperty.initialValue.x,
          y: self.panelModel.positionProperty.initialValue.y
        }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() {
          self.panelModel.positionProperty.value = new Vector2( this.x, this.y );
          self.panelModel.scaleProperty.value = this.scale;
          self.panelModel.unclampedAngleProperty.value = this.angle;
        } )
        .onComplete( function() {
          self.panelModel.stateProperty.value = 'toolbox';
          self.panelModel.animatingProperty.value = false;
        } )
        .start( phet.joist.elapsedTime );
    },

    //TODO: Performance on iPad3
    updateShape: function() {
      //Layout dimensions
      var HEIGHT = 240 * 0.85;

      var scale = (this.panelModel.type === 'solar') ? this.panelModel.scaleProperty.value * 0.4275 : this.panelModel.scaleProperty.value;

      var x = this.panelModel.positionProperty.value.x;
      var y = this.panelModel.positionProperty.value.y;
      var up = Vector2.createPolar( HEIGHT, this.panelModel.angleProperty.value + Math.PI / 2 );
      var centerLeft = new Vector2( x, y );
      var bottomLeft = centerLeft.plus( up.times( -0.5 * scale ) );
      var topLeft = bottomLeft.plus( up.times( scale ) );

      //TODO: Should be a function of the angle
      var extensionLength = 60 * 0.9 * scale;
      var topRight = topLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( topLeft ).normalized().times( extensionLength ) );
      var bottomRight = bottomLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( bottomLeft ).normalized().times( extensionLength ) );

      //Translating the knob slows performance considerably (on iPad3), so only do it when the knob is visible
      //TODO: Rotate the knob
      if ( this.panelModel.stateProperty.value !== 'dragging' && !this.panelModel.animatingProperty.value ) {
        this.knobNode.centerTop = bottomLeft;
      }
      var shape = new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close();

      //TODO: is it safe in scenery to assign same shape to two objects?
      this.background.shape = shape;
      this.frame.shape = shape;

      var centerRight = topRight.blend( bottomRight, 0.5 );

      if ( this.horizontalGridLines.length ) {
        var nearTopLeft = bottomLeft.blend( topLeft, 3 / 4 );
        var nearTopRight = bottomRight.blend( topRight, 3 / 4 );
        var nearBottomLeft = bottomLeft.blend( topLeft, 1 / 4 );
        var nearBottomRight = bottomRight.blend( topRight, 1 / 4 );
        this.horizontalGridLines[ 0 ].setLine( nearTopLeft.x, nearTopLeft.y, nearTopRight.x, nearTopRight.y );
        this.horizontalGridLines[ 1 ].setLine( centerLeft.x, centerLeft.y, centerRight.x, centerRight.y );
        this.horizontalGridLines[ 2 ].setLine( nearBottomLeft.x, nearBottomLeft.y, nearBottomRight.x, nearBottomRight.y );

        this.horizontalGridLines[ 0 ].lineWidth = this.horizontalGridLineWidth * scale;
        this.horizontalGridLines[ 1 ].lineWidth = this.horizontalGridLineWidth * scale;
        this.horizontalGridLines[ 2 ].lineWidth = this.horizontalGridLineWidth * scale;
      }

      if ( this.verticalGridLines.length ) {
        var a = topLeft.blend( topRight, 3 / 4 );
        var b = bottomLeft.blend( bottomRight, 3 / 4 );
        var c = topLeft.blend( topRight, 1 / 4 );
        var d = bottomLeft.blend( bottomRight, 1 / 4 );
        var e = topLeft.blend( topRight, 0.5 );
        var f = bottomLeft.blend( bottomRight, 0.5 );
        this.verticalGridLines[ 0 ].setLine( a.x, a.y, b.x, b.y );
        this.verticalGridLines[ 1 ].setLine( c.x, c.y, d.x, d.y );
        this.verticalGridLines[ 2 ].setLine( e.x, e.y, f.x, f.y );

        this.verticalGridLines[ 0 ].lineWidth = this.verticalGridLineWidth * scale;
        this.verticalGridLines[ 1 ].lineWidth = this.verticalGridLineWidth * scale;
        this.verticalGridLines[ 2 ].lineWidth = this.verticalGridLineWidth * scale;
      }

      var center = centerRight.blend( centerLeft, 0.5 );

      if ( this.panelModel.stateProperty.value === 'center' ) {
        var ry = this.guessY( center, this.panelModel.angleProperty.value );
        //guess the light shape that gives the correct cross section

        //Meh, it's a heuristic that seems to work
        var ellipseWidth = centerRight.distance( centerLeft ) * 0.4 * Math.pow( Math.abs( Math.cos( this.panelModel.angleProperty.value ) ), 1.5 );

        this.lightPath.shape = Shape.ellipse( center.x, center.y, ellipseWidth, ry, this.panelModel.angleProperty.value );
        var ellipseTail = new Vector2( 0, ry ).rotated( this.panelModel.angleProperty.value ).plus( center );
        var ellipseTip = new Vector2( 0, -ry ).rotated( this.panelModel.angleProperty.value ).plus( center );
        this.setLightProjection( ellipseTip.x, ellipseTail.x, center.x, center.y, ellipseWidth, ry, this.panelModel.angleProperty.value, bottomLeft.y, topLeft.y, this.panelModel.type );

        // extend shape bounds a bit to account for the stroke.
        // another alternative would be to make the background all pink and add the content on top with a slightly smaller size.
        // I didn't use this approach because the current code overlaps the frame shape over the grid, which wouldn't
        // work if the frame was on the bottom
        var frameOffset = FRAME_LINE_WIDTH / 2;
        this.lightPath.clipArea = new Shape().moveToPoint( bottomLeft.plusXY( -frameOffset, frameOffset ) ).lineToPoint( topLeft.plusXY( -frameOffset, -frameOffset ) ).lineToPoint( topRight.plusXY( frameOffset, -frameOffset ) ).lineToPoint( bottomRight.plusXY( frameOffset, frameOffset ) ).close();
      }
    },

    //Try to guess the y parameter for the ellipse that will match perfectly with the flashlight area
    // could generate a table if that's better
    guessY: function( center ) {

      //Use a binary search to find a good y-value
      var lowerBound = 10;
      var upperBound = 100;

      var guess = (upperBound + lowerBound) / 2;
      for ( var i = 0; i < 100; i++ ) {
        guess = (upperBound + lowerBound) / 2;
        var result = this.calculateY( center, guess );
        if ( result > 152 ) {
          lowerBound = guess;
        }
        else {
          upperBound = guess;
        }
      }
      return guess;
    },

    calculateY: function( center, guessY ) {
      var ellipse = Shape.ellipse( center.x, center.y, 10, guessY, this.panelModel.angleProperty.value );
      return ellipse.bounds.top;
    }
  } );
} );
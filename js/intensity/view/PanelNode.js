// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node to show a panel using "faked" 3d perspective instead of real 3d projections.
 * Also draws its own handle and the light projected onto it.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var knobImage = require( 'image!SEASONS/knob.png' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function PanelNode( panelModel, playAreaCenter, sendOtherPanelsHome, flashlightOnProperty, setLightTipAndTail, options ) {
    this.panelModel = panelModel;
    this.setLightTipAndTail = setLightTipAndTail;
    this.playAreaCenter = playAreaCenter;
    var panelNode = this;
    options = _.extend( {
      fill: null,
      cursor: 'pointer',
      stroke: null
    }, options );

    //The handle
    this.knobNode = new Image( knobImage, {scale: 0.5} );

    this.path = new Path( null, {fill: options.fill, stroke: options.stroke, lineWidth: 3} );

    this.lightPath = new Path( null, {fill: 'white'} );

    var linearFunction = new LinearFunction( 0, 1, 0.5, 1 );
    panelModel.intensityProperty.link( function( intensity ) {
      panelNode.lightPath.opacity = linearFunction( intensity );
    } );

    flashlightOnProperty.and( panelModel.stateProperty.valueEquals( 'center' ) ).and( panelModel.animatingProperty.valueEquals( false ) ).linkAttribute( this.lightPath, 'visible' );

    //Location where objects can be put in front of the flashlight.
    //Account for the size of the knob here so the panel will still be centered
    this.comparePosition = playAreaCenter;

    //Update the knob location when the panel arrives in the center
    panelModel.property( 'state' ).onValue( 'center', function() {panelNode.updateShape();} );

    panelModel.animatingProperty.derivedNot().and( panelModel.property( 'state' ).valueEquals( 'center' ) ).linkAttribute( this.knobNode, 'visible' );

    //Update the knob location after the panel animates to the center
    panelModel.property( 'animating' ).onValue( false, function() {panelNode.updateShape();} );

    Node.call( this, {children: [this.path, this.knobNode, this.lightPath]} );

    // click in the track to change the value, continue dragging if desired
    var translate = function( event ) {
      panelModel.position = panelNode.globalToParentPoint( event.pointer.point );//TODO: GC
    };

    var rotate = function( event ) {
      var point = panelNode.globalToParentPoint( event.pointer.point );
      var x = point.minus( panelModel.position );
      panelModel.unclampedAngle = originalAngle + x.angle() - angleRelativeToPivot;
//      console.log( point.x, point.y, x.x, x.y, panelModel.unclampedAngle, panelModel.angle );
//      console.log( panelModel.position, x );
    };

    var angleRelativeToPivot = 0;
    var originalAngle = 0;

    //TODO: Drag based on deltas
    this.addInputListener( new SimpleDragHandler( {

      //When starting the drag, animate to full size (if it was small in the toolbox)
      start: function( event ) {

        //TODO: cancel all tweens

        if ( panelModel.state === 'toolbox' ) {
          panelNode.moveToFront();
          panelModel.property( 'state' ).set( 'dragging' );
          translate( event );

          new TWEEN.Tween( {scale: panelModel.scale} )
            .to( {scale: 1}, 500 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() { panelModel.scale = this.scale; } )
            .start();
        }
        else {

          var dx = panelNode.globalToParentPoint( event.pointer.point ).minus( panelModel.position );
          angleRelativeToPivot = dx.angle();
          originalAngle = panelModel.angle;
          console.log( 'angleRelativeToPivot', angleRelativeToPivot, 'originalAngle', panelModel.angle );
        }
      },

      //Release the panel and let it fly to whichever is closer, the toolbox or the target region
      //Reduce size if going to the toolbox

      drag: function( event ) {

        if ( panelModel.state === 'center' ) {


          //If the user dragged far enough from the center of the panel, it should snap to the touch event and become translation again
          var position = panelNode.globalToParentPoint( event.pointer.point );
          var home = panelNode.panelModel.positionProperty.initialValue;
          var distanceToHome = home.distance( position );
          if ( distanceToHome < 50 ) {
            panelModel.state = 'dragging';
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
        if ( panelModel.state === 'dragging' ) {
          //Move to the start position or compare position, whichever is closer.
          var position = panelNode.panelModel.position;
          var distToStart = panelNode.panelModel.positionProperty.initialValue.distance( position );
          var distToCenter = panelNode.comparePosition.distance( position );

          if ( distToStart < distToCenter ) {
            panelNode.animateToToolbox();
          }
          else {
            sendOtherPanelsHome( panelNode );
            panelNode.animateToCenter();
          }
        }
      }
    } ) );

    this.mutate( options );

    panelModel.multilink( ['position', 'angle', 'scale'], function() {
      panelNode.updateShape();
    } );
  }

  return inherit( Node, PanelNode, {

    //Animate the PanelNode to move to the target region
    animateToCenter: function() {
      this.panelModel.animating = true;
      var panelNode = this;
      new TWEEN.Tween( {x: panelNode.panelModel.position.x, y: panelNode.panelModel.position.y} )
        .to( {x: this.comparePosition.x, y: this.comparePosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() {
          panelNode.panelModel.position = new Vector2( this.x, this.y );
        } )
        .onComplete( function() {
          panelNode.panelModel.state = 'center';
          panelNode.panelModel.animating = false;
        } )
        .start();
    },

    //Animate the panel to its starting location in the toolbox
    animateToToolbox: function() {
      var panelNode = this;

      //Shrink & Move to the toolbox
      this.panelModel.animating = true;
      new TWEEN.Tween( {angle: panelNode.panelModel.angle, scale: panelNode.panelModel.scale, x: panelNode.panelModel.position.x, y: panelNode.panelModel.position.y} )
        .to( {angle: panelNode.panelModel.angleProperty.initialValue, scale: 0.5, x: panelNode.panelModel.positionProperty.initialValue.x, y: panelNode.panelModel.positionProperty.initialValue.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() {
          panelNode.panelModel.position = new Vector2( this.x, this.y );
          panelNode.panelModel.scale = this.scale;
          panelNode.panelModel.unclampedAngle = this.angle;
        } )
        .onComplete( function() {
          panelNode.panelModel.state = 'toolbox';
          panelNode.panelModel.animating = false;
        } )
        .start();
    },

    //TODO: Performance on iPad3
    updateShape: function() {
      //Layout dimensions
      var HEIGHT = 240 * 0.85;

      var scale = this.panelModel.scale;

      var x = this.panelModel.position.x;
      var y = this.panelModel.position.y;
      var up = Vector2.createPolar( HEIGHT, this.panelModel.angle + Math.PI / 2 );
      var centerLeft = new Vector2( x, y );
      var bottomLeft = centerLeft.plus( up.times( -0.5 * scale ) );
      var topLeft = bottomLeft.plus( up.times( scale ) );

      //TODO: Should be a function of the angle
      var extensionLength = 60 * 0.9 * scale;
      var topRight = topLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( topLeft ).normalized().times( extensionLength ) );
      var bottomRight = bottomLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( bottomLeft ).normalized().times( extensionLength ) );

      //Translating the knob slows performance considerably (on iPad3), so only do it when the knob is visible
      //TODO: Rotate the knob
      if ( this.panelModel.state !== 'dragging' && !this.panelModel.animating ) {
        this.knobNode.centerTop = bottomLeft;
      }
      this.path.shape = new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close();

      var centerRight = topRight.blend( bottomRight, 0.5 );
      var center = centerRight.blend( centerLeft, 0.5 );

      if ( this.panelModel.state === 'center' ) {
        var ry = this.guessY( center, this.panelModel.angle );
        //guess the light shape that gives the correct cross section

        //Meh, it's a heuristic that seems to work
        var ellipseWidth = centerRight.distance( centerLeft ) * 0.4 * Math.pow( Math.abs( Math.cos( this.panelModel.angle ) ), 1.5 );

        this.lightPath.shape = Shape.ellipse( center.x, center.y, ellipseWidth, ry, this.panelModel.angle );
        var ellipseTail = new Vector2( 0, ry ).rotated( this.panelModel.angle ).plus( center );
        var ellipseTip = new Vector2( 0, -ry ).rotated( this.panelModel.angle ).plus( center );
        this.setLightTipAndTail( ellipseTip.x, ellipseTail.x, center.x, center.y, ellipseWidth, ry, this.panelModel.angle );
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
      var ellipse = Shape.ellipse( center.x, center.y, 10, guessY, this.panelModel.angle );
      return ellipse.bounds.top;
    }
  } );
} );
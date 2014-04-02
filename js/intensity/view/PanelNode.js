// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node to show a panel using "faked" 3d perspective instead of real 3d projections.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var NodeDragHandler = require( 'SEASONS/intensity/view/NodeDragHandler' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var knobImage = require( 'image!SEASONS/knob.png' );

  function PanelNode( panelModel, playAreaCenter, sendOtherPanelsHome, options ) {
    this.panelModel = panelModel;
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

    //Location where objects can be put in front of the flashlight.
    //Account for the size of the knob here so the panel will still be centered
    this.comparePosition = playAreaCenter;

    panelModel.property( 'state' ).valueEquals( 'center' ).link( function( visible ) {

      //redraw the knob
      panelNode.updateShape();
    } );

    panelModel.animatingProperty.derivedNot().and( panelModel.property( 'state' ).valueEquals( 'center' ) ).linkAttribute( this.knobNode, 'visible' );

    //Update the knob location after the panel animates to the center
    panelModel.property( 'animating' ).link( function( animating ) {
      if ( !animating ) {
        panelNode.updateShape();
      }
    } );

    Node.call( this, {children: [this.path, this.knobNode]} );

    // click in the track to change the value, continue dragging if desired
    var translate = function( event ) {
      panelModel.position = panelNode.globalToParentPoint( event.pointer.point );//TODO: GC
    };

    var rotate = function( event ) {
      var point = panelNode.globalToParentPoint( event.pointer.point );
      var x = point.minus( panelModel.position );
      panelModel.unclampedAngle = x.angle() + Math.PI / 2;
    };

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

        }
      },

      //Release the panel and let it fly to whichever is closer, the toolbox or the target region
      //Reduce size if going to the toolbox

      drag: function( event ) {

        if ( panelModel.state === 'center' ) {
          rotate( event );
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

    panelModel.on( 'reset', function() {
      //TODO: cancel all tweens

      panelNode.setScaleMagnitude( 0.5, 0.5 );

      //Update the position again after the scale has changed
//      panelNode.translation = panelModel.position;
    } );

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
      var HEIGHT = 120;

      var scale = this.panelModel.scale;

      var x = this.panelModel.position.x;
      var y = this.panelModel.position.y;
      var up = Vector2.createPolar( HEIGHT, this.panelModel.angle + Math.PI / 2 );
      var centerLeft = new Vector2( x, y );
      var bottomLeft = centerLeft.plus( up.times( -0.5 * scale ) );
      var topLeft = bottomLeft.plus( up.times( scale ) );

      //TODO: Should be a function of the angle
      var extensionLength = 50 * scale;
      var topRight = topLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( topLeft ).normalized().times( extensionLength ) );
      var bottomRight = bottomLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( bottomLeft ).normalized().times( extensionLength ) );

      //Translating the knob slows performance considerably (on iPad3), so only do it when the knob is visible
      //TODO: Rotate the knob
      if ( this.panelModel.state !== 'dragging' && !this.panelModel.animating ) {
        this.knobNode.centerTop = bottomLeft;
      }
      this.path.shape = new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close();
    }
  } );
} );
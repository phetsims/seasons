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
//      scale: 0.5
    }, options );

    //The handle
    this.knobNode = new Image( knobImage, {scale: 0.25} );

    this.path = new Path( this.createShape(), {fill: options.fill, stroke: options.stroke, lineWidth: 3} );

    //Location where objects can be put in front of the flashlight.
    //Account for the size of the knob here so the panel will still be centered
    this.comparePosition = playAreaCenter;

    panelModel.property( 'state' ).valueEquals( 'center' ).linkAttribute( this.knobNode, 'visible' );

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

    panelModel.angleProperty.debug( 'angle' );
    panelModel.positionProperty.debug( 'position' );

    //TODO: Drag based on deltas
    this.addInputListener( new SimpleDragHandler( {

      //When starting the drag, animate to full size (if it was small in the toolbox)
      start: function( event ) {

        //TODO: cancel all tweens

        if ( panelModel.state === 'toolbox' ) {
          panelNode.moveToFront();
          panelModel.property( 'state' ).set( 'dragging' );
          translate( event );

//          new TWEEN.Tween( {scale: panelNode.getScaleVector().x} )
//            .to( {scale: 1}, 500 )
//            .easing( TWEEN.Easing.Cubic.InOut )
//            .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
//            .start();
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
          var center = panelNode.center;
          var distToStart = panelNode.panelModel.positionProperty.initialValue.distance( center );
          var distToCompare = panelNode.comparePosition.distance( center );

          if ( distToStart < distToCompare ) {
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

    panelModel.property( 'position' ).link( function( position ) {
      panelNode.path.shape = panelNode.createShape();
    } );
    panelModel.on( 'reset', function() {
      //TODO: cancel all tweens

      panelNode.setScaleMagnitude( 0.5, 0.5 );

      //Update the position again after the scale has changed
//      panelNode.translation = panelModel.position;
    } );

    panelModel.property( 'angle' ).link( function( angle ) {
      panelNode.path.shape = panelNode.createShape();
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
        .onComplete( function() {panelNode.panelModel.state = 'center';} )
        .start();
    },

    //Animate the panel to its starting location in the toolbox
    animateToToolbox: function() {
      var panelNode = this;

      //Shrink down
//      new TWEEN.Tween( {scale: this.getScaleVector().x} )
//        .to( {scale: 0.5}, 500 )
//        .easing( TWEEN.Easing.Cubic.Out )
//        .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
//        .start();

      //Move to the toolbox
      this.panelModel.animating = true;
      new TWEEN.Tween( {x: panelNode.panelModel.position.x, y: panelNode.panelModel.position.y} )
        .to( {x: panelNode.panelModel.positionProperty.initialValue.x, y: panelNode.panelModel.positionProperty.initialValue.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { panelNode.panelModel.position = new Vector2( this.x, this.y ); } )
        .onComplete( function() {panelNode.panelModel.state = 'toolbox';} )
        .start();
    },

    createShape: function() {
      //Layout dimensions
      var HEIGHT = 120;

      var x = this.panelModel.position.x;
      var y = this.panelModel.position.y;
      var up = Vector2.createPolar( HEIGHT, this.panelModel.angle + Math.PI / 2 );
      var centerLeft = new Vector2( x, y );
      var bottomLeft = centerLeft.plus( up.times( -0.5 ) );
      var topLeft = bottomLeft.plus( up );

      //TODO: Should be a function of the angle
      var extensionLength = 50;
      var topRight = topLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( topLeft ).normalized().times( extensionLength ) );
      var bottomRight = bottomLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( bottomLeft ).normalized().times( extensionLength ) );

      //TODO: Rotate the knob
      this.knobNode.centerTop = bottomLeft;
      return new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close()
    }
  } );
} );
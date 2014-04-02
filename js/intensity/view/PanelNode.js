// Copyright 2002-2013, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button.
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

  function PanelNode( model, playAreaCenter, sendOtherPanelsHome, options ) {
    var panelNode = this;
    options = _.extend( {fill: 'green', cursor: 'pointer', scale: 0.5}, options );
    var HEIGHT = 120;
    var bottomLeft = new Vector2( 0, 0 );
    var topLeft = new Vector2( 0, HEIGHT );
    var VERTICAL_INSET = 0.9;
    var topRight = new Vector2( 30, HEIGHT * VERTICAL_INSET );
    var bottomRight = new Vector2( 30, HEIGHT * (1 - VERTICAL_INSET) );

    Path.call( this, new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close(), {fill: options.fill} );

    this.stateProperty = new Property( 'start' );
    this.animatingProperty = new Property( false );
    this.comparePosition = playAreaCenter;

    this.addInputListener( new NodeDragHandler( this, {
      startDrag: function() {
        panelNode.stateProperty.set( 'dragging' );

        new TWEEN.Tween( {scale: panelNode.getScaleVector().x} )
          .to( {scale: 1}, 500 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
          .start();

      },
      drag: function() {
        //TODO: is 'changed' still used now that overlay is gone?
//        panelNode.events.trigger( 'changed' );
      },
      endDrag: function() {
        //Move to the start position or compare position, whichever is closer.
        var center = panelNode.center;
        var distToStart = panelNode.startPosition.distance( center );
        var distToCompare = panelNode.comparePosition.distance( center );

        if ( distToStart < distToCompare ) {
          panelNode.animateToStart();
        }
        else {
          sendOtherPanelsHome( panelNode );
          panelNode.animateToComparison();
        }
      }
    } ) );

    this.mutate( options );
    this.startPosition = this.center;//TODO: do I have to make a copy of this in scenery 2
  }

  return inherit( Path, PanelNode, {

    animateToComparison: function() {
      this.animatingProperty.value = true;
      var horizontalBarContainerNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.comparePosition.x, y: this.comparePosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { horizontalBarContainerNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {horizontalBarContainerNode.stateProperty.value = 'center';} )
        .start();
    },
    animateToStart: function() {
      var panelNode = this;

      new TWEEN.Tween( {scale: this.getScaleVector().x} )
        .to( {scale: 0.5}, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
        .start();

      this.animatingProperty.value = true;
      var horizontalBarContainerNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.startPosition.x, y: this.startPosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { horizontalBarContainerNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {horizontalBarContainerNode.stateProperty.value = 'start';} )
        .start();
    }

  } );
} );
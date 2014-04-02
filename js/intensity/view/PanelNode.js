// Copyright 2002-2013, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var NodeDragHandler = require( 'SEASONS/intensity/view/NodeDragHandler' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  function PanelNode( model, playAreaCenter, options ) {
    var panelNode = this;
    options = _.extend( {fill: 'green', cursor: 'pointer'}, options );
    Rectangle.call( this, 0, 0, 50, 50, {fill: options.fill} );
    this.stateProperty = new Property( 'start' );
    this.animatingProperty = new Property( false );
    this.comparePosition = playAreaCenter;

    this.addInputListener( new NodeDragHandler( this, {
      startDrag: function() {
        panelNode.stateProperty.set( 'dragging' );
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
          panelNode.animateToComparison();
        }
      }
    } ) );

    this.mutate( options );
    this.startPosition = this.center;//TODO: do I have to make a copy of this in scenery 2
  }

  return inherit( Rectangle, PanelNode, {

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
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

  function PanelNode( model, playAreaCenter, sendOtherPanelsHome, options ) {
    var panelNode = this;
    options = _.extend( {
      fill: null,
      cursor: 'pointer',
      stroke: null,
      scale: 0.5
    }, options );

    //Layout dimensions
    var HEIGHT = 120;
    var VERTICAL_INSET = 0.9;

    var bottomLeft = new Vector2( 0, 0 );
    var topLeft = new Vector2( 0, HEIGHT );
    var topRight = new Vector2( 30, HEIGHT * VERTICAL_INSET );
    var bottomRight = new Vector2( 30, HEIGHT * (1 - VERTICAL_INSET) );

    Path.call( this, new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close(), {fill: options.fill, stroke: options.stroke, lineWidth: 3} );

    //State: whether dragging, in the toolbox or in the center
    this.stateProperty = new Property( 'toolbox' );

    this.animatingProperty = new Property( false );
    this.comparePosition = playAreaCenter;

    this.addInputListener( new NodeDragHandler( this, {

      //When starting the drag, animate to full size (if it was small in the toolbox)
      startDrag: function() {
        panelNode.moveToFront();
        panelNode.stateProperty.set( 'dragging' );

        new TWEEN.Tween( {scale: panelNode.getScaleVector().x} )
          .to( {scale: 1}, 500 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
          .start();

      },

      //TODO: is this function needed?
      drag: function() {
        //TODO: is 'changed' still used now that overlay is gone?
//        panelNode.events.trigger( 'changed' );
      },

      //Release the panel and let it fly to whichever is closer, the toolbox or the target region
      //Reduce size if going to the toolbox
      endDrag: function() {

        //Move to the start position or compare position, whichever is closer.
        var center = panelNode.center;
        var distToStart = panelNode.startPosition.distance( center );
        var distToCompare = panelNode.comparePosition.distance( center );

        if ( distToStart < distToCompare ) {
          panelNode.animateToToolbox();
        }
        else {
          sendOtherPanelsHome( panelNode );
          panelNode.animateToCenter();
        }
      }
    } ) );

    this.mutate( options );
    this.startPosition = this.center;//TODO: do I have to make a copy of this in scenery 2
  }

  return inherit( Path, PanelNode, {

    //Animate the PanelNode to move to the target region
    animateToCenter: function() {
      this.animatingProperty.value = true;
      var horizontalBarContainerNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.comparePosition.x, y: this.comparePosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { horizontalBarContainerNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {horizontalBarContainerNode.stateProperty.value = 'center';} )
        .start();
    },

    //Animate the panel to its starting location in the toolbox
    animateToToolbox: function() {
      var panelNode = this;

      //Shrink down
      new TWEEN.Tween( {scale: this.getScaleVector().x} )
        .to( {scale: 0.5}, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
        .start();

      //Move to the toolbox
      this.animatingProperty.value = true;
      var horizontalBarContainerNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.startPosition.x, y: this.startPosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { horizontalBarContainerNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {horizontalBarContainerNode.stateProperty.value = 'toolbox';} )
        .start();
    }
  } );
} );
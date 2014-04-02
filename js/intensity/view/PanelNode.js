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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function PanelNode( panelModel, playAreaCenter, sendOtherPanelsHome, options ) {
    this.panelModel = panelModel;
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

    var path = new Path( new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close(), {fill: options.fill, stroke: options.stroke, lineWidth: 3} );

    //Location where objects can be put in front of the flashlight.
    //Account for the size of the knob here so the panel will still be centered
    this.comparePosition = playAreaCenter.plusXY( 0, 10 );

    //The handle
    var handleNode = new Rectangle( -2, path.height - 2, 18, 18, {fill: 'yellow'} );
    panelModel.property( 'state' ).valueEquals( 'center' ).linkAttribute( handleNode, 'visible' );

    Node.call( this, {children: [path, handleNode]} );

    // click in the track to change the value, continue dragging if desired
    var handleEvent = function( event ) {
      var point = panelNode.globalToParentPoint( event.pointer.point );
      panelModel.position = point;//TODO: GC
    };

    //TODO: Drag based on deltas
    this.addInputListener( new SimpleDragHandler( {

      //When starting the drag, animate to full size (if it was small in the toolbox)
      start: function( event ) {
        handleEvent( event );

        panelNode.moveToFront();
        panelModel.property( 'state' ).set( 'dragging' );

        new TWEEN.Tween( {scale: panelNode.getScaleVector().x} )
          .to( {scale: 1}, 500 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() { panelNode.setScaleMagnitude( this.scale, this.scale ); } )
          .start();
      },

      //Release the panel and let it fly to whichever is closer, the toolbox or the target region
      //Reduce size if going to the toolbox

      drag: function( event ) {
        handleEvent( event );
      },

      end: function( event ) {
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

    //Overwrite the initial position so it will reset there, since the model was populated with dummy values before the view layout was produced
    panelModel.property( 'position' ).storeInitialValue( this.center.plusXY( 0, 10 ) );
    panelModel.property( 'position' ).reset();

    this.startPosition = this.center.plusXY( 0, 10 );//TODO: do I have to make a copy of this in scenery 2
    this.center = this.startPosition;

    panelModel.property( 'position' ).link( function( position ) {
      panelNode.center = position;
    } );
    panelModel.on( 'reset', function() {
      //TODO: cancel all tweens

      panelNode.setScaleMagnitude( 0.5, 0.5 );

      //Update the position again after the scale has changed
      panelNode.center = panelModel.position;
    } );
  }

  return inherit( Node, PanelNode, {

    //Animate the PanelNode to move to the target region
    animateToCenter: function() {
      this.panelModel.animating = true;
      var panelNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.comparePosition.x, y: this.comparePosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { panelNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {panelNode.panelModel.state = 'center';} )
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
      this.panelModel.animating = true;
      var panelNode = this;
      new TWEEN.Tween( {x: this.center.x, y: this.center.y} )
        .to( {x: this.startPosition.x, y: this.startPosition.y }, 500 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function() { panelNode.center = new Vector2( this.x, this.y ); } )
        .onComplete( function() {panelNode.panelModel.state = 'toolbox';} )
        .start();
    }
  } );
} );
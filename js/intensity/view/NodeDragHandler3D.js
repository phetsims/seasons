// Copyright 2002-2013, University of Colorado Boulder

/**
 * Copied from fractions-intro, should be factored out//TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  function NodeDragHandler( node, options ) {

    options = _.extend( {
      startDrag: function() {},
      drag: function() {},
      endDrag: function() { /* do nothing */ }  // use this to do things at the end of dragging, like 'snapping'
    }, options );

    var startOffset; // where the drag started, relative to the Movable's origin, in parent view coordinates

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      // note where the drag started
      start: function( event ) {
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minusXY( node.x3, node.y3 );
        options.startDrag();
      },

      // change the location, adjust for starting offset, constrain to drag bounds
      drag: function( event ) {
        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var location = parentPoint;
        var constrainedLocation = constrainBounds( location, options.dragBounds );
//        node.setTranslation( constrainedLocation );
        var scale = 10;
        node.setTranslation3D( constrainedLocation.x * scale, constrainedLocation.y * scale );
        options.drag( event );
      },

      end: function( event ) {
        options.endDrag( event );
      }
    } );
  }

  inherit( SimpleDragHandler, NodeDragHandler );

  /**
   * Constrains a point to some bounds.
   * @param {Vector2} point
   * @param {Bounds2} bounds
   */
  var constrainBounds = function( point, bounds ) {
    if ( _.isUndefined( bounds ) || bounds.containsCoordinates( point.x, point.y ) ) {
      return point;
    }
    else {
      var xConstrained = Math.max( Math.min( point.x, bounds.maxX ), bounds.x );
      var yConstrained = Math.max( Math.min( point.y, bounds.maxY ), bounds.y );
      return new Vector2( xConstrained, yConstrained );
    }
  };

  return NodeDragHandler;
} );
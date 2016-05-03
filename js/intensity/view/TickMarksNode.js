// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that shows the radial tick marks in the play area, which indicate the angle of the panel.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Vector2} centroid the location the ticks radiate from (but do not touch)
   * @param {Object} [options]
   * @constructor
   */
  function TickMarksNode( centroid, options ) {
    Node.call( this );
    var totalAngleToSubtend = 60 * Math.PI / 180;//60 degrees in radians
    var tickSpacing = totalAngleToSubtend / 6;
    for ( var i = 0; i <= 6; i++ ) {
      var angle = -i * tickSpacing - Math.PI / 2;
      var startDistance = 110;
      var tickLength = (i === 0 || i === 6) ? 16 : 10;
      var lineWidth = (i === 0 || i === 6) ? 1.5 : 1;
      var pt1 = Vector2.createPolar( startDistance, angle ).plus( centroid );
      var pt2 = Vector2.createPolar( startDistance + tickLength, angle ).plus( centroid );
      var line = new Line( pt1.x, pt1.y, pt2.x, pt2.y, { stroke: 'white', lineWidth: lineWidth } );
      this.addChild( line );
    }
    this.mutate( options );
  }

  return inherit( Node, TickMarksNode );
} );
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Vector2} centroid the location the ticks radiate from (but do not touch)
   * @param options
   * @constructor
   */
  function TargetOutlineNode( options ) {
    Node.call( this );

    var HEIGHT = 120;
    var bottomLeft = new Vector2( 0, 0 );
    var topLeft = new Vector2( 0, HEIGHT );
    var VERTICAL_INSET = 0.9;
    var topRight = new Vector2( 30, HEIGHT * VERTICAL_INSET );
    var bottomRight = new Vector2( 30, HEIGHT * (1 - VERTICAL_INSET) );
    var fullDash = [10, 4];
    var partialDash = [10 / 3, 4 / 3];

    this.addChild( new Line( bottomLeft, topLeft, {stroke: 'white', lineDash: fullDash} ) );
    this.addChild( new Line( topLeft, topRight, {stroke: 'white', lineDash: partialDash} ) );
    this.addChild( new Line( topRight, bottomRight, {stroke: 'white', lineDash: fullDash} ) );
    this.addChild( new Line( bottomRight, bottomLeft, {stroke: 'white', lineDash: partialDash} ) );
    this.mutate( options );
  }

  return inherit( Node, TargetOutlineNode );
} );
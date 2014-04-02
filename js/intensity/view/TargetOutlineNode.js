// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shows the panel target outline in the center of the play area as a cue to drag panels there.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  function TargetOutlineNode( visibleProperty, options ) {
    Node.call( this );

    //TODO: factor out this geometry with geometry in PanelNode
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

    visibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, TargetOutlineNode );
} );
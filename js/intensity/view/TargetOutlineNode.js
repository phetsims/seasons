// Copyright 2014-2015, University of Colorado Boulder

/**
 * Shows the panel target outline in the center of the play area as a cue to drag panels there.
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

  function TargetOutlineNode( visibleProperty, playAreaCenter ) {
    this.playAreaCenter = playAreaCenter;
    Node.call( this );

    var fullDash = [ 10, 4 ];
    var partialDash = [ 10 / 3, 4 / 3 ];

    //TODO: factor out this geometry with geometry in PanelNode
    var HEIGHT = 240 * 0.85;

    var scale = 1;

    var x = playAreaCenter.x;
    var y = playAreaCenter.y;
    var up = Vector2.createPolar( HEIGHT, Math.PI + Math.PI / 2 );
    var centerLeft = new Vector2( x, y );
    var bottomLeft = centerLeft.plus( up.times( -0.5 * scale ) );
    var topLeft = bottomLeft.plus( up.times( scale ) );

    //TODO: Should be a function of the angle
    var extensionLength = 60 * 0.9 * scale;
    var topRight = topLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( topLeft ).normalized().times( extensionLength ) );
    var bottomRight = bottomLeft.plus( new Vector2( this.playAreaCenter.x * 2 + x, y ).minus( bottomLeft ).normalized().times( extensionLength ) );

    this.addChild( new Line( bottomLeft, topLeft, { stroke: 'white', lineDash: fullDash } ) );
    this.addChild( new Line( topLeft, topRight, { stroke: 'white', lineDash: partialDash } ) );
    this.addChild( new Line( topRight, bottomRight, { stroke: 'white', lineDash: fullDash } ) );
    this.addChild( new Line( bottomRight, bottomLeft, { stroke: 'white', lineDash: partialDash } ) );

    visibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, TargetOutlineNode );
} );
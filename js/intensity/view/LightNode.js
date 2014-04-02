// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that shows the light coming out of the flashlight and hitting the screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function LightNode( flashlightOnProperty, panelInPlayAreaProperty, right, options ) {
    this.rightLayout = right;
    this.panelInPlayAreaProperty = panelInPlayAreaProperty;
    var lightNode = this;
    Node.call( this, {pickable: false} );
    this.beamNode = new Path( new Shape(), {opacity: 0.65, fill: 'white'} );
    this.addChild( this.beamNode );
    panelInPlayAreaProperty.link( function( panelInPlayArea ) {
      var x = panelInPlayArea ? 260 : 0;
      lightNode.setLightTipAndTail( x, x );
    } );
    flashlightOnProperty.linkAttribute( this, 'visible' );
    this.mutate( options );
  }

  return inherit( Node, LightNode, {
    setLightTipAndTail: function( tailX, tipX ) {
      this.beamNode.shape = new Shape().moveTo( tailX, 350 ).lineTo( tipX, 300 ).lineTo( this.rightLayout, 300 ).lineTo( this.rightLayout, 350 ).close();
    }
  } );
} );
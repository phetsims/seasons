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

  function LightNode( flashlightOnProperty, panelInPlayAreaProperty, right, options ) {
    var lightNode = this;
    Node.call( this, {pickable: false} );
    var beamNode = new Rectangle( 0, 0, 300, 60, {opacity: 0.65, fill: 'white'} );
    this.addChild( beamNode );
    panelInPlayAreaProperty.link( function( panelInPlayArea ) {
      beamNode.setRectWidth( panelInPlayArea ? 275 - 15 : 1200 );
      lightNode.right = right;
    } );
    flashlightOnProperty.linkAttribute( this, 'visible' );
    this.mutate( options );
  }

  return inherit( Node, LightNode );
} );
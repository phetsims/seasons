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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function LightNode( flashlightOnProperty, options ) {
    Node.call( this, {pickable: false} );
    this.addChild( new Rectangle( 0, 0, 300, 60, {opacity: 0.65, fill: 'white'} ) );
    flashlightOnProperty.linkAttribute( this, 'visible' );
    this.mutate( options );
  }

  return inherit( Node, LightNode );
} );
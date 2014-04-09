// Copyright 2002-2013, University of Colorado Boulder

/**
 * Bar chart for showing
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundPushButton = require( 'SUN/experimental/buttons/RoundPushButton' );
  var HStrut = require( 'SUN/HStrut' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var flashlightImage = require( 'image!SEASONS/flashlight.png' );

  function FlashlightNode( flashlightOnProperty, options ) {

    var flashlightImageNode = new Image( flashlightImage, {scale: 0.53} );
    Node.call( this, { children: [
      flashlightImageNode,
      new RoundPushButton( new HStrut( 10 ), {

        scale: 1.75,
        //TODO: we should make roundPushButton support css color nicknames
        baseColor: new Color( 255, 0, 0 ),
        listener: flashlightOnProperty.toggleFunction,
        x: 46, y: flashlightImageNode.height / 2
      } )
    ]} );
    this.mutate( options );
  }

  return inherit( Node, FlashlightNode );
} );
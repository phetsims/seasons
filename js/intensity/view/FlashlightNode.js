// Copyright 2014-2015, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button (but doesn't include the light).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRoundStickyToggleButton = require( 'SUN/buttons/BooleanRoundStickyToggleButton' );
  var Color = require( 'SCENERY/util/Color' );
  var flashlightImage = require( 'image!SEASONS/flashlight.png' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var seasons = require( 'SEASONS/seasons' );

  function FlashlightNode( flashlightOnProperty, options ) {
    var flashlightImageNode = new Image( flashlightImage, { scale: 0.53 } );
    Node.call( this, {
      children: [
        flashlightImageNode,
        new BooleanRoundStickyToggleButton( flashlightOnProperty, {

          radius: 17,
          //TODO: we should make roundPushButton support css color nicknames
          baseColor: new Color( 255, 0, 0 ),
          x: 46, y: flashlightImageNode.height / 2
        } )
      ]
    } );
    this.mutate( options );
  }

  seasons.register( 'FlashlightNode', FlashlightNode );
  
  return inherit( Node, FlashlightNode );
} );
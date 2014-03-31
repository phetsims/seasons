// Copyright 2002-2013, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var RoundPushButton = require( 'SUN/experimental/buttons/RoundPushButton' );
  var HStrut = require( 'SUN/HStrut' );
  var Color = require( 'SCENERY/util/Color' );

  function FlashlightNode( model, options ) {
    HBox.call( this, { spacing: 4, children: [
      new Text( 'Flashlight', {fill: 'white'} ),
      new RoundPushButton( new HStrut( 10 ), {baseColor: new Color( 255, 0, 0 )} )
    ]} );
    this.mutate( options );
  }

  return inherit( HBox, FlashlightNode );
} );
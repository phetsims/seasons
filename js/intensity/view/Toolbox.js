// Copyright 2002-2013, University of Colorado Boulder

/**
 * Toolbox from which the user can select different panels.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function Toolbox( options ) {
    var WIDTH = 300;
    var HEIGHT = 100;
    var content = new Rectangle( 0, 0, WIDTH, HEIGHT );
    var fractionToSideLabels = 0.2;
    var solarText = new Text( 'Solar', {fill: 'white', centerX: WIDTH * fractionToSideLabels, bottom: HEIGHT - 5} );
    content.addChild( solarText );
    var heatText = new Text( 'Heat', {fill: 'white', centerX: WIDTH / 2, bottom: HEIGHT - 5} );
    content.addChild( heatText );
    var intensityText = new Text( 'Intensity', {fill: 'white', centerX: WIDTH * (1 - fractionToSideLabels), bottom: HEIGHT - 5} );
    content.addChild( intensityText );

    this.texts = [solarText, heatText, intensityText];

    Panel.call( this, content, {fill: null, stroke: 'white'} );

    this.mutate( options );
  }

  return inherit( Panel, Toolbox, {

    //Get the position each panel should take.  Panels positioned in view coordinates since their model is trivial
    getGlobalPanelPosition: function( index ) {
      var text = this.texts[index];
      return text.parentToGlobalPoint( text.centerTop );
    }
  } );
} );
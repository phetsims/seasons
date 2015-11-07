// Copyright 2014-2015, University of Colorado Boulder

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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 16 );

  function Toolbox( options ) {
    var WIDTH = 355;
    var HEIGHT = 150;
    var content = new Rectangle( 0, 0, WIDTH, HEIGHT );
    var fractionToSideLabels = 0.2;
    var textBottom = HEIGHT - 4;
    var solarText = new Text( 'Solar', { fill: 'white', font: FONT, centerX: WIDTH * fractionToSideLabels, bottom: textBottom } );
    content.addChild( solarText );
    var heatText = new Text( 'Heat', { fill: 'white', font: FONT, centerX: WIDTH / 2, bottom: textBottom } );
    content.addChild( heatText );
    var intensityText = new Text( 'Intensity', { fill: 'white', font: FONT, centerX: WIDTH * (1 - fractionToSideLabels), bottom: textBottom } );
    content.addChild( intensityText );

    this.texts = [ solarText, heatText, intensityText ];

    Panel.call( this, content, { fill: null, stroke: 'white' } );

    this.mutate( options );
  }

  return inherit( Panel, Toolbox, {

    //Get the position each panel should take.  Panels positioned in view coordinates since their model is trivial
    getGlobalPanelPosition: function( index ) {
      var text = this.texts[ index ];
      return text.parentToGlobalPoint( text.centerTop );
    }
  } );
} );
// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var seasons = require( 'SEASONS/seasons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );
  var IntensityModel = require( 'SEASONS/intensity/model/IntensityModel' );
  var IntensityView = require( 'SEASONS/intensity/view/IntensityView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var screenTitle = 'Intensity';

  function IntensityScreen() {
    Screen.call( this,
      screenTitle,
      new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, { fill: 'white' } ),
      function() { return new IntensityModel(); },
      function( model ) { return new IntensityView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: 'black' }
    );
  }

  seasons.register( 'IntensityScreen', IntensityScreen );
  
  return inherit( Screen, IntensityScreen );
} );
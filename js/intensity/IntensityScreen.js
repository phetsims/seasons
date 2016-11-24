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
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  function IntensityScreen() {
    Screen.call( this,
      function() { return new IntensityModel(); },
      function( model ) { return new IntensityView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColorProperty: new Property( Color.toColor( 'black' ) ) }
    );
  }

  seasons.register( 'IntensityScreen', IntensityScreen );
  
  return inherit( Screen, IntensityScreen );
} );
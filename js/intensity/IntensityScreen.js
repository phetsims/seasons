// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Screen = require( 'JOIST/Screen' );
  var IntensityModel = require( 'SEASONS/intensity/model/IntensityModel' );
  var IntensityView = require( 'SEASONS/intensity/view/IntensityView' );
  var Text = require( 'SCENERY/nodes/Text' );

  var screenTitle = 'Intensity';

  function IntensityScreen() {
    Screen.call( this,
      screenTitle,
      new Text( 'hello' ),
      function() { return new IntensityModel(); },
      function( model ) { return new IntensityView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: 'black' }
    );
  }

  return inherit( Screen, IntensityScreen );
} );
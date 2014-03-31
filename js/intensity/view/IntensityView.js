// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  function IntensityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
  }

  return inherit( ScreenView, IntensityView );
} );
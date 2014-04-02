// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  function IntensityModel() {
    PropertySet.call( this, {
      flashlightOn: false
    } );
  }

  inherit( PropertySet, IntensityModel, {
    step: function() {
      //TODO: use dt
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
    }
  } );

  return IntensityModel;
} );
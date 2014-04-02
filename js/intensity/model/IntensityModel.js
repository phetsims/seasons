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
  var PanelModel = require( 'SEASONS/intensity/model/PanelModel' );

  function IntensityModel() {
    PropertySet.call( this, {

      //Boolean property indicating whether the flashlight button has been pressed
      //Whether the light is visible also depends on whether a panel is in the target area
      flashlightOn: false
    } );
    this.solarPanel = new PanelModel();
    this.heatPanel = new PanelModel();
    this.intensityPanel = new PanelModel();
  }

  return inherit( PropertySet, IntensityModel, {
    step: function() {
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.solarPanel.reset();
      this.heatPanel.reset();
      this.intensityPanel.reset();
    }
  } );
} );
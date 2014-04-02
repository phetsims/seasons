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

    //Properties to determine if any panel is dragging or centered, so that the flashlight can be toggled off during dragging
    this.anyPanelDragging = this.solarPanel.property( 'state' ).valueEquals( 'dragging' ).
      or( this.heatPanel.property( 'state' ).valueEquals( 'dragging' ) ).
      or( this.intensityPanel.property( 'state' ).valueEquals( 'dragging' ) );

    this.anyPanelCentered = this.solarPanel.stateProperty.valueEquals( 'center' ).
      or( this.heatPanel.stateProperty.valueEquals( 'center' ) ).
      or( this.intensityPanel.stateProperty.valueEquals( 'center' ) );
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
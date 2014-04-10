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
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  function IntensityModel() {
    var intensityModel = this;
    PropertySet.call( this, {

      //Boolean property indicating whether the flashlight button has been pressed
      //Whether the light is visible also depends on whether a panel is in the target area
      flashlightOn: false
    } );
    this.solarPanel = new PanelModel();
    this.heatPanel = new PanelModel();
    this.intensityPanel = new PanelModel();

    //Properties to determine if any panel is dragging or centered, so that the flashlight can be toggled off during dragging
    this.anyPanelDraggingProperty = this.solarPanel.property( 'state' ).valueEquals( 'dragging' ).
      or( this.heatPanel.property( 'state' ).valueEquals( 'dragging' ) ).
      or( this.intensityPanel.property( 'state' ).valueEquals( 'dragging' ) );

    this.centeredPanelProperty = new DerivedProperty( [this.solarPanel.stateProperty, this.heatPanel.stateProperty, this.intensityPanel.stateProperty], function( solarPanelState, heatPanelState, intensityPanelState ) {
      return solarPanelState === 'center' ? intensityModel.solarPanel :
             heatPanelState === 'center' ? intensityModel.heatPanel :
             intensityPanelState === 'center' ? intensityModel.intensityPanel :
             null;
    } );

    this.anyPanelCenteredProperty = new DerivedProperty( [this.centeredPanelProperty], function( centeredPanel ) {
      return centeredPanel !== null;
    } );
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
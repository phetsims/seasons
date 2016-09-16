// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var seasons = require( 'SEASONS/seasons' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PanelModel = require( 'SEASONS/intensity/model/PanelModel' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  function IntensityModel() {
    var self = this;
    PropertySet.call( this, {

      //Boolean property indicating whether the flashlight button has been pressed
      //Whether the light is visible also depends on whether a panel is in the target area
      flashlightOn: false
    } );
    this.solarPanel = new PanelModel( 'solar' );
    this.heatPanel = new PanelModel( 'heat' );
    this.intensityPanel = new PanelModel( 'intensity' );

    //Properties to determine if any panel is dragging or centered, so that the flashlight can be toggled off during dragging
    this.anyPanelDraggingProperty = new DerivedProperty(
      [ this.solarPanel.property( 'state' ), this.heatPanel.property( 'state' ), this.intensityPanel.property( 'state' ) ],
      function( solarPanelState, heatPanelState, intensityPanelState ) {
        return solarPanelState === 'dragging' || heatPanelState === 'dragging' || intensityPanelState === 'dragging';
      } );

    this.centeredPanelProperty = new DerivedProperty( [ this.solarPanel.stateProperty, this.heatPanel.stateProperty, this.intensityPanel.stateProperty ], function( solarPanelState, heatPanelState, intensityPanelState ) {
      return solarPanelState === 'center' ? self.solarPanel :
             heatPanelState === 'center' ? self.heatPanel :
             intensityPanelState === 'center' ? self.intensityPanel :
             null;
    } );

    this.anyPanelCenteredProperty = new DerivedProperty( [ this.centeredPanelProperty ], function( centeredPanel ) {
      return centeredPanel !== null;
    } );

    //Property for the angle of the panel in the center, or null if no panel is in the center.
    this.centeredPanelAngleProperty = new DerivedProperty( [ this.centeredPanelProperty, this.solarPanel.angleProperty, this.heatPanel.angleProperty, this.intensityPanel.angleProperty ],
      function( centeredPanel ) {
        return centeredPanel ? centeredPanel.angle :
               null;
      } );

    this.intensityProperty = new DerivedProperty( [ this.centeredPanelAngleProperty, this.flashlightOnProperty ], function( centeredPanelAngle, flashlightOn ) {
      return (centeredPanelAngle === null || !flashlightOn) ? 0 : Math.abs( Math.cos( centeredPanelAngle ) );
    } );

    //Forward intensity values to the panels, to update the light view in the panel node.
    this.intensityProperty.link( function( intensity ) {
      if ( intensity !== null && self.centeredPanelProperty.value !== null ) {
        self.centeredPanelProperty.value.intensity = intensity;
      }
    } );

    //Clear the heat from the heat panel when it is removed
    this.centeredPanelProperty.link( function( centeredPanel, oldCenteredPanel ) {
      if ( oldCenteredPanel === self.heatPanel ) {
        self.heatPanel.intensity = 0;
        self.heatPanel.timeAveragedIntensity = 0;
      }
    } );
  }

  seasons.register( 'IntensityModel', IntensityModel );
  
  return inherit( PropertySet, IntensityModel, {
    step: function( dt ) {
      if ( this.centeredPanelProperty.value === this.heatPanel ) {
        this.heatPanel.step( dt );
      }
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.solarPanel.reset();
      this.heatPanel.reset();
      this.intensityPanel.reset();
      this.trigger( 'reset' );
    }
  } );
} );
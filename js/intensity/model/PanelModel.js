// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var seasons = require( 'SEASONS/seasons' );
  var Vector2 = require( 'DOT/Vector2' );

  function PanelModel( type ) {

    //Keep track of whether it is solar, intensity or heat panel

    //TODO: Perhaps change type/if pattern to strategy pattern?
    this.type = type;

    //Track the angle the user tried to drag the panel to, so that the pointer will stay synced with the angle when clamping is accounted for
    this.unclampedAngleProperty = new Property( Math.PI );

    //Animate the size of the panel when dragging out of the toolbox
    this.scaleProperty = new Property( 0.5 );

    //In screen coordinates.  Initial value will be set by the view once it is instantiated
    this.positionProperty = new Property( new Vector2( 0, 0 ) );

    //State: whether dragging, in the toolbox or in the center
    this.stateProperty = new Property( 'toolbox' );

    //TODO document
    this.animatingProperty = new BooleanProperty( false );

    //The intensity of the light (0-1), or null if no light is shining on it.
    this.intensityProperty = new Property( null );

    //Time averaged intensity (over a window of a few seconds) to add some latency to the heat view for the heat panel.
    //Not used for Solar panel and Intensity panel
    this.timeAveragedIntensityProperty = new Property( 0 );

    //TODO document
    this.angleProperty = new DerivedProperty( [ this.unclampedAngleProperty ],
      function( unclampedAngle ) {
        var sixtyDegrees = 60 * Math.PI / 180;

        //TODO: Better clamping code
        while ( unclampedAngle < 0 ) {
          unclampedAngle = unclampedAngle + Math.PI * 2;
        }
        while ( unclampedAngle > Math.PI * 2 ) {
          unclampedAngle = unclampedAngle - Math.PI * 2;
        }

        return unclampedAngle > Math.PI ? Math.PI :
               unclampedAngle < Math.PI - sixtyDegrees ? Math.PI - sixtyDegrees :
               unclampedAngle;
      } );
  }

  seasons.register( 'PanelModel', PanelModel );

  return inherit( Object, PanelModel, {

    //Only for the heat panel, show time average of intensity on heat panel to account for latency of heating up/cooling down
    step: function( dt ) {
      //step toward the new intensity value.
      var intensity = (this.intensityProperty.value === null || typeof this.intensityProperty.value === 'undefined') ? 0 : this.intensityProperty.value;


      //TODO: account for dt
      //Lower alpha means longer latency to heat/cool
      var alpha = 0.04 * dt / 0.016;
      if ( alpha > 1 ) {
        alpha = 1;
      }
      if ( alpha < 0 ) {
        alpha = 0;
      }
      this.timeAveragedIntensityProperty.value = this.timeAveragedIntensityProperty.value  * (1 - alpha) + intensity * alpha;
//      console.log( this.intensityProperty.value, intensity, this.timeAveragedIntensityProperty.value );
    },

    reset: function() {
      this.unclampedAngleProperty.reset();
      this.scaleProperty.reset();
      this.positionProperty.reset();
      this.stateProperty.reset();
      this.animatingProperty.reset();
      this.intensityProperty.reset();
      this.timeAveragedIntensityProperty.reset();
    }
  } );
} );
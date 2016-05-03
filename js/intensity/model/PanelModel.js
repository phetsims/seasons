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
  var Vector2 = require( 'DOT/Vector2' );

  function PanelModel( type ) {

    //Keep track of whether it is solar, intensity or heat panel

    //TODO: Perhaps change type/if pattern to strategy pattern?
    this.type = type;
    PropertySet.call( this, {

      //Track the angle the user tried to drag the panel to, so that the pointer will stay synced with the angle when clamping is accounted for
      unclampedAngle: Math.PI,

      //Animate the size of the panel when dragging out of the toolbox
      scale: 0.5,

      //In screen coordinates.  Initial value will be set by the view once it is instantiated
      position: new Vector2( 0, 0 ),

      //State: whether dragging, in the toolbox or in the center
      state: 'toolbox',
      animating: false,

      //The intensity of the light (0-1), or null if no light is shining on it.
      intensity: null,

      //Time averaged intensity (over a window of a few seconds) to add some latency to the heat view for the heat panel.
      //Not used for Solar panel and Intensity panel
      timeAveragedIntensity: 0
    } );
    this.addDerivedProperty( 'angle', [ 'unclampedAngle' ], function( unclampedAngle ) {
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
  
  return inherit( PropertySet, PanelModel, {

    //Only for the heat panel, show time average of intensity on heat panel to account for latency of heating up/cooling down
    step: function( dt ) {
      //step toward the new intensity value.
      var intensity = (this.intensity === null || typeof this.intensity === 'undefined') ? 0 : this.intensity;


      //TODO: account for dt
      //Lower alpha means longer latency to heat/cool
      var alpha = 0.04 * dt / 0.016;
      if ( alpha > 1 ) {
        alpha = 1;
      }
      if ( alpha < 0 ) {
        alpha = 0;
      }
      this.timeAveragedIntensity = this.timeAveragedIntensity * (1 - alpha) + intensity * alpha;
//      console.log( this.intensity, intensity, this.timeAveragedIntensity );
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.trigger( 'reset' );
    }
  } );
} );
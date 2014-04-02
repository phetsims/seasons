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
  var Vector2 = require( 'DOT/Vector2' );

  function PanelModel() {
    PropertySet.call( this, {

      //Track the angle the user tried to drag the panel to, so that the pointer will stay synced with the angle when clamping is accounted for
      unclampedAngle: Math.PI,

      //Animate the size of the panel when dragging out of the toolbox
      scale: 0.5,

      //In screen coordinates.  Initial value will be set by the view once it is instantiated
      position: new Vector2( 0, 0 ),

      //State: whether dragging, in the toolbox or in the center
      state: 'toolbox',
      animating: false
    } );
    this.addDerivedProperty( 'angle', ['unclampedAngle'], function( unclampedAngle ) {
      var sixtyDegrees = 60 * Math.PI / 180;
      return unclampedAngle > Math.PI ? Math.PI :
             unclampedAngle < Math.PI - sixtyDegrees ? Math.PI - sixtyDegrees :
             unclampedAngle;
    } );
  }

  return inherit( PropertySet, PanelModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.trigger( 'reset' );
    }
  } );
} );
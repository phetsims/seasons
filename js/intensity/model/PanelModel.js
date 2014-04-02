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
      angle: 0,

      //In screen coordinates.  Initial value will be set by the view once it is instantiated
      position: new Vector2( 0, 0 ),

      //State: whether dragging, in the toolbox or in the center
      state: 'toolbox',
      animating: false
    } );
    var length = 120;
    this.addDerivedProperty( 'tail', ['angle', 'position'], function( angle, position ) {
      return Vector2.createPolar( length / 2, angle + Math.PI ).plus( position );
    } );
    this.addDerivedProperty( 'tip', ['angle', 'position'], function( angle, position ) {
      return Vector2.createPolar( length / 2, angle ).plus( position );
    } );
  }

  return inherit( PropertySet, PanelModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.trigger( 'reset' );
    }
  } );
} );
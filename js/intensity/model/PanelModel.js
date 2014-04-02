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
      position: new Vector2( 0, 0 )
    } );
    var length = 120;
    this.addDerivedProperty( 'tail', ['angle', 'position'], function( angle, position ) {
      return Vector2.createPolar( length / 2, angle + Math.PI ).plus( position );
    } );
    this.addDerivedProperty( 'tip', ['angle', 'position'], function( angle, position ) {
      return Vector2.createPolar( length / 2, angle ).plus( position );
    } );
  }

  return inherit( PropertySet, PanelModel );
} );
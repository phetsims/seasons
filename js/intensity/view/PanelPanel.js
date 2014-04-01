// Copyright 2002-2013, University of Colorado Boulder

/**
 * Panel from which the user can select different panels.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function PanelPanel( options ) {
    var content = new Rectangle( 0, 0, 300, 100 );
    content.addChild( new Text( 'Solar', {fill: 'white'} ) );

    Panel.call( this, content, {fill: null, stroke: 'white'} );

    this.mutate( options );
  }

  return inherit( Panel, PanelPanel );
} );
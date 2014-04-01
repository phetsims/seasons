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

    var WIDTH = 300;
    var HEIGHT = 100;
    var content = new Rectangle( 0, 0, WIDTH, HEIGHT );
    var fractionToSideLabels = 0.2;
    content.addChild( new Text( 'Solar', {fill: 'white', centerX: WIDTH * fractionToSideLabels, bottom: HEIGHT - 5} ) );
    content.addChild( new Text( 'Heat', {fill: 'white', centerX: WIDTH / 2, bottom: HEIGHT - 5} ) );
    content.addChild( new Text( 'Intensity', {fill: 'white', centerX: WIDTH * (1 - fractionToSideLabels), bottom: HEIGHT - 5} ) );

    Panel.call( this, content, {fill: null, stroke: 'white'} );

    this.mutate( options );
  }

  return inherit( Panel, PanelPanel );
} );
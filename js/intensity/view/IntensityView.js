// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ResetAllButton2 = require( 'SUN/experimental/buttons/ResetAllButton2' );
  var FlashlightNode = require( 'SEASONS/intensity/view/FlashlightNode' );
  var PanelPanel = require( 'SEASONS/intensity/view/PanelPanel' );
  var PanelNode = require( 'SEASONS/intensity/view/PanelNode' );

  function IntensityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var intensityBox = new AccordionBox( new Text( 'hello' ), {title: 'Intensity', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );

    var secondBox = new AccordionBox( new Text( 'hello again' ), {title: '-', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );

    this.addChild( new HBox( {x: 10, y: 10, children: [intensityBox, secondBox], spacing: 20} ) );

    var resetAllButton = new ResetAllButton2( {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( resetAllButton );

    this.addChild( new FlashlightNode( null, {right: this.layoutBounds.right - 10, centerY: this.layoutBounds.centerY} ) );

    var panelPanel = new PanelPanel( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( panelPanel );

    this.addChild( new PanelNode( null, {fill: 'red', centerBottom: this.globalToParentPoint( panelPanel.getGlobalPanelPosition( 0 ) ).minusXY( 0, 15 )} ) );
    this.addChild( new PanelNode( null, {fill: 'green', centerBottom: this.globalToParentPoint( panelPanel.getGlobalPanelPosition( 1 ) ).minusXY( 0, 15 )} ) );
    this.addChild( new PanelNode( null, {fill: 'blue', centerBottom: this.globalToParentPoint( panelPanel.getGlobalPanelPosition( 2 ) ).minusXY( 0, 15 )} ) );
  }

  return inherit( ScreenView, IntensityView );
} );
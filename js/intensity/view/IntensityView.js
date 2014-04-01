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
  var Toolbox = require( 'SEASONS/intensity/view/Toolbox' );
  var PanelNode = require( 'SEASONS/intensity/view/PanelNode' );
  var TickMarksNode = require( 'SEASONS/intensity/view/TickMarksNode' );
  var TargetOutlineNode = require( 'SEASONS/intensity/view/TargetOutlineNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function IntensityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var playAreaCenterY = this.layoutBounds.centerY - 45;

    var intensityBox = new AccordionBox( new Text( 'hello' ), {title: 'Intensity', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );

    var secondBox = new AccordionBox( new Text( 'hello again' ), {title: '-', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );

    this.addChild( new HBox( {x: 10, y: 10, children: [intensityBox, secondBox], spacing: 20} ) );

    var resetAllButton = new ResetAllButton2( {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( resetAllButton );

    this.addChild( new FlashlightNode( null, {right: this.layoutBounds.right - 10, centerY: playAreaCenterY} ) );

    var toolbox = new Toolbox( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( toolbox );

    var playAreaCenter = new Vector2( this.layoutBounds.centerX, playAreaCenterY );

    this.addChild( new TargetOutlineNode( {leftCenter: playAreaCenter} ) );

    this.addChild( new PanelNode( null, playAreaCenter, {fill: 'red', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 0 ) ).minusXY( 0, 15 )} ) );
    this.addChild( new PanelNode( null, playAreaCenter, {fill: 'green', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 1 ) ).minusXY( 0, 15 )} ) );
    this.addChild( new PanelNode( null, playAreaCenter, {fill: 'blue', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 2 ) ).minusXY( 0, 15 )} ) );

    this.addChild( new TickMarksNode( playAreaCenter ) );
  }

  return inherit( ScreenView, IntensityView );
} );
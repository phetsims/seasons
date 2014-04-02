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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton2 = require( 'SUN/experimental/buttons/ResetAllButton2' );
  var FlashlightNode = require( 'SEASONS/intensity/view/FlashlightNode' );
  var LightNode = require( 'SEASONS/intensity/view/LightNode' );
  var Toolbox = require( 'SEASONS/intensity/view/Toolbox' );
  var PanelNode = require( 'SEASONS/intensity/view/PanelNode' );
  var TickMarksNode = require( 'SEASONS/intensity/view/TickMarksNode' );
  var TargetOutlineNode = require( 'SEASONS/intensity/view/TargetOutlineNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function IntensityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var resetAllButton = new ResetAllButton2( {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10, listener: model.reset.bind( model )} );
    this.addChild( resetAllButton );

    var toolbox = new Toolbox( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( toolbox );

    //Allow some room for the control panel at the bottom
    //Offset down a little bit to account for the accordion box positioning
    var playAreaCenter = new Vector2( this.layoutBounds.centerX, (this.layoutBounds.height - toolbox.height) / 2 + 10 );

    var sendOtherPanelsHome = function( panelNode ) {
      if ( panelNode !== solarPanelNode ) {
        solarPanelNode.animateToToolbox();
      }
      if ( panelNode !== heatPanelNode ) {
        heatPanelNode.animateToToolbox();
      }
      if ( panelNode !== intensityPanelNode ) {
        intensityPanelNode.animateToToolbox();
      }
    };

    //Overwrite the initial position so it will reset there, since the model was populated with dummy values before the view layout was produced
    model.solarPanel.positionProperty.storeInitialValue( this.globalToParentPoint( toolbox.getGlobalPanelPosition( 0 ) ).minusXY( 12, 43 ) );
    model.heatPanel.positionProperty.storeInitialValue( this.globalToParentPoint( toolbox.getGlobalPanelPosition( 1 ) ).minusXY( 12, 43 ) );
    model.intensityPanel.positionProperty.storeInitialValue( this.globalToParentPoint( toolbox.getGlobalPanelPosition( 2 ) ).minusXY( 12, 43 ) );
    model.solarPanel.positionProperty.reset();
    model.heatPanel.positionProperty.reset();
    model.intensityPanel.positionProperty.reset();
    console.log( model.solarPanel.position, ',.p' );

    //Create the different types of panels
    var solarPanelNode = new PanelNode( model.solarPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, {stroke: '#d30e78', fill: '#1b179f'} );
    var heatPanelNode = new PanelNode( model.heatPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, {stroke: '#cccccd', fill: '#0f104a'} );
    var intensityPanelNode = new PanelNode( model.intensityPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, {stroke: '#cccccd', fill: 'black'} );

    var panelInCenter = solarPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ).
      or( heatPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ) ).
      or( intensityPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ) );
    var targetOutlineNode = new TargetOutlineNode( panelInCenter.derivedNot(), {leftCenter: playAreaCenter} );
    this.addChild( targetOutlineNode );

    //Panels should go in front of the target outline
    var panelLayer = new Node( {children: [solarPanelNode, heatPanelNode, intensityPanelNode]} );
    this.addChild( panelLayer );

    //3D Panels (feasibility test)
//    this.panel3DNode = new Panel3DNode( {x: this.layoutBounds.centerX, y: this.layoutBounds.centerY} );
//    this.addChild( this.panel3DNode );

    this.addChild( new LightNode( model.property( 'flashlightOn' ).and( model.anyPanelDragging.derivedNot() ), model.anyPanelCentered, this.layoutBounds.right - 100, {centerY: playAreaCenter.y} ) );

    this.addChild( new FlashlightNode( model.property( 'flashlightOn' ), {right: this.layoutBounds.right - 10, centerY: playAreaCenter.y} ) );

    this.addChild( new TickMarksNode( playAreaCenter ) );

    //Accordion boxes for charts
    var intensityBox = new AccordionBox( new Text( 'hello' ), {title: 'Intensity', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );
    var secondBox = new AccordionBox( new Text( 'hello again' ), {title: '-', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );
    this.addChild( new HBox( {x: 10, y: 10, children: [intensityBox, secondBox], spacing: 20} ) );

//    this.addChild( new Rectangle( playAreaCenter.x, playAreaCenter.y, 2, 2, {fill: 'green'} ) );
//    this.addChild( new Rectangle( model.solarPanel.position.x, model.solarPanel.position.y, 2, 2, {fill: 'yellow'} ) );
  }

  return inherit( ScreenView, IntensityView, {step: function() {
//    this.panel3DNode.step();
  }
  } );
} );
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
  var LightNode = require( 'SEASONS/intensity/view/LightNode' );
  var Toolbox = require( 'SEASONS/intensity/view/Toolbox' );
  var PanelNode = require( 'SEASONS/intensity/view/PanelNode' );
  var TickMarksNode = require( 'SEASONS/intensity/view/TickMarksNode' );
  var TargetOutlineNode = require( 'SEASONS/intensity/view/TargetOutlineNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function IntensityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var resetAllButton = new ResetAllButton2( {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( resetAllButton );

    var toolbox = new Toolbox( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( toolbox );

    //Allow some room for the control panel at the bottom
    //Offset down a little bit to account for the accordion box positioning
    var playAreaCenter = new Vector2( this.layoutBounds.centerX, (this.layoutBounds.height - toolbox.height) / 2 + 10 );

    var sendOtherPanelsHome = function( panelNode ) {
      if ( panelNode !== panel1 ) {
        panel1.animateToToolbox();
      }
      if ( panelNode !== panel2 ) {
        panel2.animateToToolbox();
      }
      if ( panelNode !== panel3 ) {
        panel3.animateToToolbox();
      }
    };

    //Create the different types of panels
    var panel1 = new PanelNode( null, playAreaCenter, sendOtherPanelsHome, {stroke: '#d30e78', fill: '#1b179f', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 0 ) ).minusXY( 0, 15 )} );
    var panel2 = new PanelNode( null, playAreaCenter, sendOtherPanelsHome, {stroke: '#cccccd', fill: '#0f104a', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 1 ) ).minusXY( 0, 15 )} );
    var panel3 = new PanelNode( null, playAreaCenter, sendOtherPanelsHome, {stroke: '#cccccd', fill: 'black', centerBottom: this.globalToParentPoint( toolbox.getGlobalPanelPosition( 2 ) ).minusXY( 0, 15 )} );

    var panelInCenter = panel1.stateProperty.valueEquals( 'center' ).
      or( panel2.stateProperty.valueEquals( 'center' ) ).
      or( panel3.stateProperty.valueEquals( 'center' ) );
    var targetOutlineNode = new TargetOutlineNode( panelInCenter.derivedNot(), {center: playAreaCenter} );
    this.addChild( targetOutlineNode );

    //Panels should go in front of the target outline
    this.addChild( panel1 );
    this.addChild( panel2 );
    this.addChild( panel3 );

    //3D Panels (feasibility test)
//    this.panel3DNode = new Panel3DNode( {x: this.layoutBounds.centerX, y: this.layoutBounds.centerY} );
//    this.addChild( this.panel3DNode );

    //Properties to determine if any panel is dragging or centered, so that the flashlight can be toggled off during dragging
    var anyPanelDragging = panel1.stateProperty.valueEquals( 'dragging' ).or( panel2.stateProperty.valueEquals( 'dragging' ) ).or( panel3.stateProperty.valueEquals( 'dragging' ) );
    var anyPanelCentered = panel1.stateProperty.valueEquals( 'center' ).or( panel2.stateProperty.valueEquals( 'center' ) ).or( panel3.stateProperty.valueEquals( 'center' ) );

    this.addChild( new LightNode( model.property( 'flashlightOn' ).and( anyPanelDragging.derivedNot() ), anyPanelCentered, this.layoutBounds.right - 100, {centerY: playAreaCenter.y} ) );

    this.addChild( new FlashlightNode( model.property( 'flashlightOn' ), {right: this.layoutBounds.right - 10, centerY: playAreaCenter.y} ) );

    this.addChild( new TickMarksNode( playAreaCenter.plusXY( -targetOutlineNode.width / 2, 0 ) ) );

    //Accordion boxes for charts
    var intensityBox = new AccordionBox( new Text( 'hello' ), {title: 'Intensity', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );
    var secondBox = new AccordionBox( new Text( 'hello again' ), {title: '-', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white'} );
    this.addChild( new HBox( {x: 10, y: 10, children: [intensityBox, secondBox], spacing: 20} ) );
  }

  return inherit( ScreenView, IntensityView, {step: function() {
//    this.panel3DNode.step();
  }
  } );
} );
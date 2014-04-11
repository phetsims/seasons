// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var BarChartNode = require( 'SEASONS/intensity/view/BarChartNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var AccordionBox = require( 'SUN/AccordionBox' );
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HeatMap = require( 'SEASONS/intensity/model/HeatMap' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  //For comparing to mockup
//  var mockupImage = require( 'image!SEASONS/app-768.png' );
//  var Image = require( 'SCENERY/nodes/Image' );

  function IntensityView( model ) {
    var intensityView = this;
    ScreenView.call( this, { renderer: 'svg' } );

    var resetAllButton = new ResetAllButton2( {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 10, listener: function() {model.reset();}} );
    this.addChild( resetAllButton );

    var toolbox = new Toolbox( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10} );
    this.addChild( toolbox );

    //Allow some room for the control panel at the bottom
    //Offset down a little bit to account for the accordion box positioning
    var playAreaCenter = new Vector2( this.layoutBounds.centerX + 31, (this.layoutBounds.height - toolbox.height) / 2 + 25 );

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
    var offset = new Vector2( 12, 64 );
    var getPanelPosition = function( index ) { return intensityView.globalToParentPoint( toolbox.getGlobalPanelPosition( index ) ).minus( offset );};
    model.solarPanel.positionProperty.storeInitialValue( getPanelPosition( 0 ) );
    model.heatPanel.positionProperty.storeInitialValue( getPanelPosition( 1 ) );
    model.intensityPanel.positionProperty.storeInitialValue( getPanelPosition( 2 ) );
    model.solarPanel.positionProperty.reset();
    model.heatPanel.positionProperty.reset();
    model.intensityPanel.positionProperty.reset();

    this.addChild( new TickMarksNode( playAreaCenter ) );

    var lightNode = new LightNode( playAreaCenter.y, model.property( 'flashlightOn' ).and( model.anyPanelDraggingProperty.derivedNot() ), model.anyPanelCenteredProperty, this.layoutBounds.right - 20, {centerY: playAreaCenter.y} );

    //Create the different types of panels
    var solarPanelNode = new PanelNode( model.solarPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {stroke: '#d30e78', fill: '#1b179f'} );
    var heatPanelNode = new PanelNode( model.heatPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {stroke: '#cccccd', fill: '#0f104a'} );
    var intensityPanelNode = new PanelNode( model.intensityPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {stroke: '#cccccd', fill: 'black'} );

    var panelInCenter = solarPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ).
      or( heatPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ) ).
      or( intensityPanelNode.panelModel.property( 'state' ).valueEquals( 'center' ) );
    var targetOutlineNode = new TargetOutlineNode( panelInCenter.derivedNot(), playAreaCenter );
    this.addChild( targetOutlineNode );

    //Panels should go in front of the target outline
    var panelLayer = new Node( {children: [solarPanelNode, heatPanelNode, intensityPanelNode]} );
    this.addChild( panelLayer );

    this.addChild( lightNode );

    this.addChild( new FlashlightNode( model.property( 'flashlightOn' ), {left: this.layoutBounds.right - 93, centerY: playAreaCenter.y} ) );

    //Accordion boxes for charts
    var intensityBox = new AccordionBox( new BarChartNode( model.intensityProperty ), {title: 'Intensity', initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white', font: '15px Arial'} );

    //Map the values for the secondary properties for each of the panels
    var temperatureMap = new LinearFunction( 0.5, 1, 0.2, 0.8, true );
    var secondaryProperty = new DerivedProperty( [model.centeredPanelProperty, model.intensityProperty, model.heatPanel.timeAveragedIntensityProperty], function( centeredPanel, intensity, heatPanelIntensity ) {
      return centeredPanel === null ? 0 :
             centeredPanel.type === 'solar' ? intensity / 2 :
             centeredPanel.type === 'heat' ? temperatureMap( heatPanelIntensity ) :
             intensity;
    } );

    var secondaryBarChart = new BarChartNode( secondaryProperty );

    var secondBoxTitleProperty = model.centeredPanelProperty.map( function( centeredPanel ) {
      return centeredPanel === null ? '-' :
             centeredPanel.type === 'intensity' ? 'Light Area' :
             centeredPanel.type === 'heat' ? 'Temperature' :
             'Power';
    } );

    model.centeredPanelProperty.map( function( centeredPanel ) {
      return centeredPanel === null ? '' :
             centeredPanel.type === 'intensity' ? ' m^2' :
             centeredPanel.type === 'heat' ? ' \u2103' :
             '%';
    } ).linkAttribute( secondaryBarChart, 'units' );

    //Update the color of the secondary bar chart
    //TODO: No need to call the heat map twice, if it is too expensive.  Could factor it to a heat panel property
    new DerivedProperty( [model.heatPanel.timeAveragedIntensityProperty, model.centeredPanelProperty], function( heatPanelIntensity, centeredPanel ) {
      secondaryBarChart.barNode.fill = centeredPanel === model.heatPanel ? HeatMap.intensityToColor( heatPanelIntensity ) : 'white';
    } );

    var secondBox = new AccordionBox( secondaryBarChart, {title: secondBoxTitleProperty.value, initiallyOpen: false, fill: 'black', titleFill: 'white', stroke: 'white', font: '15px Arial'} );
    secondBoxTitleProperty.linkAttribute( secondBox, 'title' );

    //Close the accordion boxes on reset
    model.on( 'reset', function() {
      intensityBox.open.reset();
      secondBox.open.reset();
    } );

    this.addChild( new HBox( {x: 10, y: 10, children: [intensityBox, secondBox], spacing: 20} ) );

//    this.addChild( new Rectangle( playAreaCenter.x, playAreaCenter.y, 2, 2, {fill: 'green'} ) );
//    this.addChild( new Rectangle( model.solarPanel.position.x, model.solarPanel.position.y, 2, 2, {fill: 'yellow'} ) );

//    this.addChild( new Image( mockupImage, {center: this.layoutBounds.center, opacity: 0.2, pickable: false} ) );

    var pivot = new Circle( 1, {fill: 'white'} );
    solarPanelNode.panelModel.property( 'position' ).link( function( position ) {
      pivot.setTranslation( position.x, position.y );
    } );
    this.addChild( pivot );
  }

  return inherit( ScreenView, IntensityView );
} );
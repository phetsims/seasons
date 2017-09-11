// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var BarChartNode = require( 'SEASONS/intensity/view/BarChartNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FlashlightNode = require( 'SEASONS/intensity/view/FlashlightNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HeatMap = require( 'SEASONS/intensity/model/HeatMap' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightNode = require( 'SEASONS/intensity/view/LightNode' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelNode = require( 'SEASONS/intensity/view/PanelNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var seasons = require( 'SEASONS/seasons' );
  var TargetOutlineNode = require( 'SEASONS/intensity/view/TargetOutlineNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TickMarksNode = require( 'SEASONS/intensity/view/TickMarksNode' );
  var Toolbox = require( 'SEASONS/intensity/view/Toolbox' );
  var Vector2 = require( 'DOT/Vector2' );

  //For comparing to mockup
//  var Image = require( 'SCENERY/nodes/Image' );
//  var mockupImage = require( 'image!SEASONS/app-768.png' );

  function IntensityView( model ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // var viewProperties = new PropertySet( {
    //   intensityBoxExpanded: false,
    //   secondBoxExpanded: false
    // } );

    var intensityBoxExpandedProperty = new BooleanProperty( false );
    var secondBoxExpandedProperty = new BooleanProperty( false );

    var resetAllButton = new ResetAllButton( {
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10,
      listener: function() {
        model.reset();
        intensityBoxExpandedProperty.reset();
        secondBoxExpandedProperty.reset();
      }
    } );
    this.addChild( resetAllButton );

    var toolbox = new Toolbox( { centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 10 } );
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
    model.solarPanel.positionProperty.reset();
    model.heatPanel.positionProperty.reset();
    model.intensityPanel.positionProperty.reset();

    this.addChild( new TickMarksNode( playAreaCenter ) );

    var flashLightOnAndAnyPanelDraggingProperty = new DerivedProperty( [ model.flashlightOnProperty, model.anyPanelDraggingProperty ],
      function( flashlightOn, anyPanelDragging ) {
        return flashlightOn && !anyPanelDragging;
      } );
    var lightNode = new LightNode( playAreaCenter.y, flashLightOnAndAnyPanelDraggingProperty, model.anyPanelCenteredProperty, this.layoutBounds.right - 20, { centerY: playAreaCenter.y } );

    //Create the different types of panels
    var solarPanelNode = new PanelNode( model.solarPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {
      stroke: '#d30e78',
      fill: '#1b179f',
      numberHorizontalGridLines: 3,
      numberVerticalGridLines: 3
    } );
    var heatPanelNode = new PanelNode( model.heatPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {
      stroke: '#cccccd',
      fill: '#0f104a'
    } );
    var intensityPanelNode = new PanelNode( model.intensityPanel, playAreaCenter, sendOtherPanelsHome, model.flashlightOnProperty, lightNode.setLightProjection.bind( lightNode ), {
      stroke: '#cccccd',
      fill: 'black'
    } );

    var panelInCenter = new DerivedProperty(
      [ solarPanelNode.panelModel.stateProperty, heatPanelNode.panelModel.stateProperty, intensityPanelNode.panelModel.stateProperty ],
      function( solarPanelState, heatPanelState, intensityPanelState ) {
        return solarPanelState === 'center' || heatPanelState === 'center' || intensityPanelState === 'center';
      } );
    var targetOutlineNode = new TargetOutlineNode( new DerivedProperty( [ panelInCenter ],
      function( panelInCenter ) {
        return !panelInCenter;
      } ), playAreaCenter );
    this.addChild( targetOutlineNode );

    //Panels should go in front of the target outline
    var panelLayer = new Node( { children: [ solarPanelNode, heatPanelNode, intensityPanelNode ] } );
    this.addChild( panelLayer );

    this.addChild( lightNode );

    this.addChild( new FlashlightNode( model.flashlightOnProperty, {
      left: this.layoutBounds.right - 93,
      centerY: playAreaCenter.y
    } ) );

    //Accordion boxes for charts
    var intensityBox = new AccordionBox( new BarChartNode( model.intensityProperty ), {
      titleNode: new Text( 'Intensity', { font: new PhetFont( 15 ), fill: 'white' } ),
      expandedProperty: intensityBoxExpandedProperty,
      fill: 'black', stroke: 'white'
    } );

    //Map the values for the secondary properties for each of the panels
    var temperatureMap = new LinearFunction( 0.5, 1, 0.2, 0.8, true );
    var secondaryProperty = new DerivedProperty( [
        model.intensityPanel.angleProperty, model.centeredPanelProperty, model.intensityProperty, model.heatPanel.timeAveragedIntensityProperty ],
      function( intensityPanelAngle, centeredPanel, intensity, heatPanelIntensity ) {
        return centeredPanel === null || intensity === 0 ? 0 :
               centeredPanel.type === 'solar' ? intensity / 2 :
               centeredPanel.type === 'heat' ? temperatureMap( heatPanelIntensity ) :
               0.5 / Math.sin( intensityPanelAngle - Math.PI / 2 );//intensity, see http://mathcentral.uregina.ca/QQ/database/QQ.09.98/connor1.html
      } );

    var secondaryBarChart = new BarChartNode( secondaryProperty, model.centeredPanelProperty );

    var secondBoxTitleProperty = new DerivedProperty( [ model.centeredPanelProperty ], function( centeredPanel ) {
      return centeredPanel === null ? '-' :
             centeredPanel.type === 'intensity' ? 'Light Area' :
             centeredPanel.type === 'heat' ? 'Temperature' :
             'Power';
    } );

    new DerivedProperty( [ model.centeredPanelProperty ], function( centeredPanel ) {
      return centeredPanel === null ? '' :
             centeredPanel.type === 'intensity' ? ' m^2' :
             centeredPanel.type === 'heat' ? ' \u2103' :
             '%';
    } ).linkAttribute( secondaryBarChart, 'units' );

    //Update the color of the secondary bar chart
    //TODO: No need to call the heat map twice, if it is too expensive.  Could factor it to a heat panel property
    Property.multilink( [ model.heatPanel.timeAveragedIntensityProperty, model.centeredPanelProperty ], function( heatPanelIntensity, centeredPanel ) {
      secondaryBarChart.barNode.fill = centeredPanel === model.heatPanel ? HeatMap.intensityToColor( heatPanelIntensity ) : 'white';
    } );

    var secondBox = new AccordionBox( secondaryBarChart, {
      titleNode: new Text( secondBoxTitleProperty.value, { font: new PhetFont( 15 ), fill: 'white' } ),
      expandedProperty: secondBoxExpandedProperty,
      fill: 'black', stroke: 'white'
    } );
    secondBoxTitleProperty.linkAttribute( secondBox, 'title' );

    this.addChild( new HBox( { x: 10, y: 10, children: [ intensityBox, secondBox ], spacing: 20 } ) );

//    this.addChild( new Rectangle( playAreaCenter.x, playAreaCenter.y, 2, 2, {fill: 'green'} ) );
//    this.addChild( new Rectangle( model.solarPanel.positionProperty.value.x, model.solarPanel.positionProperty.value.y, 2, 2, {fill: 'yellow'} ) );

//    this.addChild( new Image( mockupImage, {center: this.layoutBounds.center, opacity: 0.2, pickable: false} ) );
  }

  seasons.register( 'IntensityView', IntensityView );
  
  return inherit( ScreenView, IntensityView );
} );
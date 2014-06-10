// Copyright 2002-2013, University of Colorado Boulder

/**
 * Bar chart for showing
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Line = require( 'SCENERY/nodes/Line' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  var FONT = new PhetFont( 16 );
  var HEIGHT = 200;
  var WIDTH = 75;
  var BAR_WIDTH = 8;

  function BarChartNode( valueProperty, centeredPanelProperty, options ) {

    this.valueProperty = valueProperty;
    //TODO: Move to options
    this._units = '%';
    var barChartNode = this;
    Node.call( this );

    this.barNode = new Rectangle( 0, 0, 0, 0, {fill: 'white'} );
    this.text = new Text( '', {font: FONT} );

    var thermometer = new ThermometerNode( 0, 1, valueProperty, { stroke: 'white', tubeHeight: 120 } );

    // this is a hacky way of handling the thermometer positioning which should probably change
    // there are still a few tweaks needed in thermometerNode to help with this
    thermometer.centerX = 36;
    thermometer.centerY = 100;
    thermometer.visible = false;
    this.addChild( thermometer );

    valueProperty.link( function() {barChartNode.updateReadout();} );

    var graphBorderNode = new Node( {
      children: [
        //The arrow that points up
        new ArrowNode( 0, 0, 0, -HEIGHT, {
          headHeight: 8,
          headWidth: 8,
          tailWidth: 1,
          fill: 'white',
          stroke: null
        } ),

        //The horizontal axis
        new Line( 0, 0, WIDTH, 0, {stroke: 'white'} ),
        barChartNode.barNode
      ]
    } );

    // make either the bar graph or the thermometer visible depending on if we are on temperature mode
    if ( centeredPanelProperty ) {
      var barNode = this.barNode;
      centeredPanelProperty.link( function( centeredPanel ) {
        if ( centeredPanel ) {
          var temperatureMode = centeredPanel.type === 'heat';
          thermometer.visible = temperatureMode;
          barNode.visible = graphBorderNode.visible = !temperatureMode;
        }
      } );
    }

    this.addChild( new VBox( {
        spacing: 5,
        children: [

          graphBorderNode,

          new Node( {
            children: [
              new Rectangle( 0, 0, WIDTH * 0.8, 26, 10, 10, {fill: 'white'} ),
              this.text//TODO: MessageFormat
            ]
          } )
        ]} )
    );
    this.mutate( options );
  }

  return inherit( Node, BarChartNode, {
    set units( u ) { this._units = u; },
    get units() {return this._units;},
    updateReadout: function() {
      var value = this.valueProperty.value;
      var percentage = Math.round( value * 100 );
      this.text.text = percentage + this._units;
      this.text.centerX = WIDTH * 0.8 / 2;
      this.text.centerY = 26 / 2;

      var barHeight = value * HEIGHT;
      this.barNode.setRect( WIDTH / 2 - BAR_WIDTH / 2, -barHeight, BAR_WIDTH, barHeight );
    }
  } );
} );
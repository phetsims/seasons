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

  var FONT = new PhetFont( 16 );
  var HEIGHT = 200;
  var WIDTH = 75;
  var BAR_WIDTH = 8;

  function BarChartNode( valueProperty, options ) {

    this.valueProperty = valueProperty;
    //TODO: Move to options
    this._units = '%';
    var barChartNode = this;
    Node.call( this );

    this.barNode = new Rectangle( 0, 0, 0, 0, {fill: 'white'} );
    this.text = new Text( '', {font: FONT} );

    valueProperty.link( function() {barChartNode.updateReadout();} );

    this.addChild( new VBox( {
        spacing: 5,
        children: [

          new Node( {
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
          } ),

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
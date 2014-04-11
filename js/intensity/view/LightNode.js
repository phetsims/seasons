// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that shows the light coming out of the flashlight and hitting the screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function LightNode( beamCenterY, flashlightOnProperty, panelInPlayAreaProperty, right, options ) {
    this.rightLayout = right;
    var beamWidth = 90;
    this.beamTop = beamCenterY - beamWidth / 2;
    this.beamBottom = beamCenterY + beamWidth / 2;
    this.panelInPlayAreaProperty = panelInPlayAreaProperty;
    var lightNode = this;
    Node.call( this, {pickable: false} );
    this.beamNode = new Path( new Shape(), {opacity: 0.65, fill: 'white'} );
    this.addChild( this.beamNode );
    panelInPlayAreaProperty.onValue( false, function() {lightNode.setLightRect()} );
    flashlightOnProperty.linkAttribute( this, 'visible' );
    this.mutate( options );
  }

  return inherit( Node, LightNode, {

    //The shape of the light when no panel is in the way, and it passes through
    setLightRect: function() {
      this.beamNode.shape = new Shape().
        moveTo( this.rightLayout, this.beamBottom ).
        lineTo( -1000, this.beamBottom ).
        lineTo( -1000, this.beamTop ).
        lineTo( this.rightLayout, this.beamTop ).
        close();
    },

    //The shape of the light when it falls on a panel.  See PanelNode's ellipse rendering to see how the ellipse arcs match up.
    setLightProjection: function( tailX, tipX, centerX, centerY, radiusX, radiusY, rotation ) {
      this.beamNode.shape = new Shape().
        moveTo( this.rightLayout, this.beamBottom ).
        lineTo( tailX, this.beamBottom ).
        ellipticalArc( centerX, centerY, radiusX, radiusY, rotation, 3 * Math.PI / 2, 3 * Math.PI / 2 + Math.PI, true ).
        lineTo( this.rightLayout, this.beamTop ).
        close();
    }
  } );
} );
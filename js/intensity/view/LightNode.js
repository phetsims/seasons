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
    Node.call( this, { pickable: false } );
    this.beamNode = new Path( new Shape(), { opacity: 0.3, fill: '#bdb9b9' } );
    this.addChild( this.beamNode );
    panelInPlayAreaProperty.onValue( false, function() {lightNode.setLightRect();} );
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
    setLightProjection: function( tailX, tipX, centerX, centerY, radiusX, radiusY, rotation, clipBottom, clipTop, panelType ) {
      var offset = rotation - Math.PI;
      this.beamNode.shape = ( panelType === 'solar' && rotation !== Math.PI ) ?
                            new Shape().
                              moveTo( this.rightLayout, this.beamBottom ).
                              lineTo( -1000, this.beamBottom ).
                              lineTo( -1000, clipBottom ).
                              lineTo( centerX + radiusX, clipBottom ).

                              // the difficult calculation to make is which angles to draw the elliptical arc between. The angles need to align
                              // with the clipTop and clipBottom points. This is just an approximation right now
                              ellipticalArc( centerX, centerY, radiusX, radiusY, rotation, -Math.PI / 2 + offset * 0.9, Math.PI / 2 - offset * 1.05, true ).
                              lineTo( -1000, clipTop ).
                              lineTo( -1000, this.beamTop ).
                              lineTo( this.rightLayout, this.beamTop ).
                              close() :
                            new Shape().
                              moveTo( this.rightLayout, this.beamBottom ).
                              lineTo( tailX, this.beamBottom ).
                              ellipticalArc( centerX, centerY, radiusX, radiusY, rotation, 3 * Math.PI / 2, 3 * Math.PI / 2 + Math.PI, true ).
                              lineTo( this.rightLayout, this.beamTop ).
                              close();
    }
  } );
} );
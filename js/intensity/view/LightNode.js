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
    panelInPlayAreaProperty.link( function( panelInPlayArea ) {
      var x = panelInPlayArea ? 260 : 0;
      lightNode.setLightTipAndTail( x, x );
    } );
    flashlightOnProperty.linkAttribute( this, 'visible' );
    this.mutate( options );
  }

  return inherit( Node, LightNode, {
    setLightTipAndTail: function( tailX, tipX, centerX, centerY, radiusX, radiusY, rotation ) {

      this.beamNode.shape = new Shape().
        moveTo( this.rightLayout, this.beamBottom - 152 ).
        lineTo( tailX, this.beamBottom - 152 ).
        ellipticalArc( centerX, centerY - 152, radiusX, radiusY, rotation, 3 * Math.PI / 2, 3 * Math.PI / 2 + Math.PI, true ).
        lineTo( this.rightLayout, this.beamTop - 152 ).
        close();
    }
  } );
} );
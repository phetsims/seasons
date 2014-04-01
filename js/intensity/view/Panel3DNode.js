// Copyright 2002-2013, University of Colorado Boulder

/**
 * Flashlight node, includes the on/off button.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Matrix4 = require( 'DOT/Matrix4' );
  var NodeDragHandler3D = require( 'SEASONS/intensity/view/NodeDragHandler3D' );

  /**
   *
   * @param options
   * @constructor
   */
  function TargetOutlineNode( options ) {
    Node.call( this, {cursor: 'pointer'} );

//    Matrix4.gluPerspective = function( fovYRadians, aspect, zNear, zFar ) {
//      var cotangent = Math.cos( fovYRadians ) / Math.sin( fovYRadians );
//
//      return new Matrix4( cotangent / aspect, 0, 0, 0,
//        0, cotangent, 0, 0,
//        0, 0, ( zFar + zNear ) / ( zNear - zFar ), ( 2 * zFar * zNear ) / ( zNear - zFar ),
//        0, 0, -1, 0 );
//    };
//    var projectionMatrix = Matrix4.gluPerspective( Math.PI / 4, 1, 10, 100 );
//    var a1 = new Vector3( 0, 0, 0 );
//    var a2 = projectionMatrix.timesVector3( a1 );
//
//    var b1 = new Vector3( 0, 10, 0 );
//    var b2 = projectionMatrix.timesVector3( b1 );
//
//    var c1 = new Vector3( 0, 10, 10 );
//    var c2 = projectionMatrix.timesVector3( c1 );
//
//    var d1 = new Vector3( 0, 0, 10 );
//    var d2 = projectionMatrix.timesVector3( d1 );
//    debugger;

//    debugger;


    this.addInputListener( new NodeDragHandler3D( this, {
      startDrag: function() {
//        panelNode.stateProperty.set( 'dragging' );
      },
      drag: function() {
        //TODO: is 'changed' still used now that overlay is gone?
//        panelNode.events.trigger( 'changed' );
      },
      endDrag: function() {
        //Move to the start position or compare position, whichever is closer.
//        var center = panelNode.center;
//        var distToStart = panelNode.startPosition.distance( center );
//        var distToCompare = panelNode.comparePosition.distance( center );
//
//        if ( distToStart < distToCompare ) {
//          panelNode.animateToStart();
//        }
//        else {
//          panelNode.animateToComparison();
//        }
      }
    } ) );

    this.setTranslation3D( 0, 0 );
    this.mutate( options );
  }

  return inherit( Node, TargetOutlineNode, {

    setTranslation3D: function( x, y ) {
      this.x3 = x;
      this.y3 = y;
      console.log( x, y );
      var HEIGHT = 120;
      var bottomLeft = new Vector2( 0, 0 );
      var topLeft = new Vector2( 0, HEIGHT );
      var VERTICAL_INSET = 0.9;
      var topRight = new Vector2( 30, HEIGHT * VERTICAL_INSET );
      var bottomRight = new Vector2( 30, HEIGHT * (1 - VERTICAL_INSET) );
      var fullDash = [10, 4];
      var partialDash = [10 / 3, 4 / 3];

      var u = new Vector3( 0, 0, -1 ).normalized();
      var v = new Vector3( 0, 1, 0 );

      var a = new Vector3( 50 + x, -50 + y, -100 );
      var b = a.plus( v.times( 100 ) );
      var c = b.plus( u.times( 100 ) );
      var d = c.plus( v.times( -100 ) );

      var bottomLeft = this.project( a );
      var topLeft = this.project( b );
      var topRight = this.project( c );
      var bottomRight = this.project( d );
      this.children = [new Path( new Shape().moveToPoint( bottomLeft ).lineToPoint( topLeft ).lineToPoint( topRight ).lineToPoint( bottomRight ).close(), {fill: 'white', opacity: 0.2} ),
        new Line( bottomLeft, topLeft, {stroke: 'red', lineDash: fullDash, lineWidth: 5} ),
        new Line( topLeft, topRight, {stroke: 'green', lineDash: partialDash, lineWidth: 5} ),
        new Line( topRight, bottomRight, {stroke: 'blue', lineDash: fullDash, lineWidth: 5} ),
        new Line( bottomRight, bottomLeft, {stroke: 'white', lineDash: partialDash, lineWidth: 5} )
      ];
    },
    //See http://en.wikipedia.org/wiki/3D_projection
    //assumes camera is at 0,0,0 with angle 0,0,0 and a fixed ez=100 from the viewing screen
    project: function( vector ) {
      var dx = vector.x, dy = vector.y, dz = vector.z;
      var ex = 0;
      var ey = 0;
      var ez = 160;

      var bx = ez / dz * dx - ex;
      var by = ez / dz * dy - ey;
      return new Vector2( bx, by );
    },

//    project: function( ax, ay, az, cx, cy, cz, thetax, thetay, thetaz, ex, ey, ez ) {
//      var cy = Math.cos( thetay );
//      var cz = Math.cos( thetaz );
//      var dx = cy * (sz * y + cz * x) - sy * z;
//      var dy = sx * (cy * z + sy * (sz * y + cz * x)) + cx * (cz * y - sx * x);
//      var dz = cx * (cy * z + sy * (sz * y + cz * x)) - sx * (cz * y - sz * x);
//
//      var bx = ez / dz * dx - ex;
//      var by = ez / dz * dy - ey;
//      return new Vector2( bx, by );
//    }
  } );
} );
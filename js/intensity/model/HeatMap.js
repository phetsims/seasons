// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the 'Intensity' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Util = require( 'DOT/Util' );

  var heatMap = [
    [ 0, 23, 34 ],
    [ 0, 6, 72 ],
    [ 34, 0, 121 ],
    [ 60, 2, 140 ],
    [ 103, 0, 158 ],
    [ 125, 3, 166 ],
    [ 151, 4, 157 ],
    [ 171, 20, 151 ],
    [ 196, 28, 124 ],
    [ 202, 41, 109 ],
    [ 218, 57, 91 ],
    [ 231, 72, 76 ],
    [ 242, 94, 48 ],
    [ 251, 110, 31 ],
    [ 254, 134, 14 ],
    [ 252, 156, 0 ],
    [ 255, 169, 1 ],
    [ 251, 188, 0 ],
    [ 251, 205, 5 ],
    [ 250, 219, 32 ],
    [ 250, 239, 63 ],
    [ 242, 242, 110 ],
    [ 245, 255, 177 ],
    [ 241, 251, 240 ]
  ];

  function HeatMap() {
    Object.call( this );
  }

  return inherit( Object, HeatMap, {},

    //static
    {
      intensityToColor: function( intensity ) {
        //Color values sampled from http://herschel.cf.ac.uk/files/spire_files/IR_0401.jpg every five pixels from bottom totop, see the google doc
        //So the first values here are the "low heat" values

        //For the heat panel, show time average of intensity on heat panel to account for latency of heating up/cooling down
        //TODO: make sure this code only runs when heat panel is active
        var intensityToHeatMapIndex = new LinearFunction( 0.5, 1, 6, heatMap.length - 1, true );

        //Interpolate linearly sampled values from above
        var floatingPointIndex = intensityToHeatMapIndex( intensity );
//        if ( floatingPointIndex < 0 ) {
//          floatingPointIndex = 0.5;
//        }
//        if ( floatingPointIndex >= heatMap.length ) {
//          floatingPointIndex = heatMap.length - 1.5;
//        }
        var floor = Math.floor( floatingPointIndex );
        var ceil = Math.ceil( floatingPointIndex );
        if ( floor === ceil ) {
          floor = ceil - 1;
        }
        var red = Util.linear( floor, ceil, heatMap[ floor ][ 0 ], heatMap[ ceil ][ 0 ], floatingPointIndex );
        var green = Util.linear( floor, ceil, heatMap[ floor ][ 1 ], heatMap[ ceil ][ 1 ], floatingPointIndex );
        var blue = Util.linear( floor, ceil, heatMap[ floor ][ 2 ], heatMap[ ceil ][ 2 ], floatingPointIndex );

        //TODO: Remove this debug code
//        if ( flashlightOnProperty.value ) {
//          console.log( {heatMapLength: heatMap.length, floor: floor, ceil: ceil, floatingPointIndex: floatingPointIndex, red: red, green: green, blue: blue} );
//        }
        return new Color( red, green, blue );
      }
    } );
} );
// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Seasons' sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var IntensityScreen = require( 'SEASONS/intensity/IntensityScreen' );

  // strings
  var simTitle = require( 'string!SEASONS/seasons.title' );

  var screens = [ new IntensityScreen() ];

  var simOptions = {
    credits: {
      leadDesign: 'Bryce Gruneich',
      softwareDevelopment: 'Sam Reid, Aaron Davis',
      team: 'Bryce Gruneich, Trish Loeblein, Ariel Paul, Kathy Perkins'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, screens, simOptions );
    sim.start();
  } );
} );
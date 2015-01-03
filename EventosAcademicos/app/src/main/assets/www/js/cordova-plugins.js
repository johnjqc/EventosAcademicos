#!/usr/bin/env node

(function() {
    'use strict';
    var clc = require('cli-color'),
        exit = require('exit'),
        fs = require('fs'),
        nopt = require('nopt'),
        path = require('path'),
        // prompt = require( 'prompt' ),
        updateNotifier = require('update-notifier'),
        knownOpts = {
            'platforms': String,
            'repo': String
        },
        shortHands = {
            'p': ['--platforms'],
            'r': ['--repo']
        },
        parsed = nopt(knownOpts, shortHands, process.argv, 2),
        plugreg = require('../scripts/plugreg-com'),
        registrycordova = require('../scripts/registry-cordova-io'),
        pkg = require('../package.json'),
        args = process.argv.splice(2);

    if (args.indexOf('--no-update-notifier') === -1) {
        // Checks for available update and returns an instance
        var notifier = updateNotifier( { packageName: pkg.name, 
            packageVersion: pkg.version, updateCheckInterval: 1000 * 60 * 60 * 24 } );
        if (notifier.update) {
            // Notify using the built-in convenience method
            notifier.notify(true);
        }
    }

    if (args.length === 0) {
        console.log( '' );
        console.log( 'cordova-plugins [options] command [term]');
        console.log( '' );
        console.log( '   commands:');
        console.log( '       list       - display all available plugins');
        console.log( '       search     - search plugins for a specfic term/phrase ');
        console.log( '' );
        console.log( '   options:');
        console.log( '       -p         - comma delimited (no spaces) platforms to filter by.');
        console.log('                    Valid platforms are: ' + clc.redBright( 'ios android blackberry10 wp7 wp8 firefoxos' ) + '.' );
        console.log('                    Default is all.');
        console.log( '       -r         - the url/name of the repo to use.');
        console.log('                    Valid urls are: '+ clc.yellowBright( 'http://plugreg.com') + ' or use shortform ' + clc.yellowBright( 'plugreg' ) );
        console.log('                    and ' + clc.yellowBright('http://registry.cordova.io') + ' or use shortform ' + clc.yellowBright( 'cordova' ) + '.');
        console.log('                    Default is http://registry-cordova-io.cordova.io');
        console.log( '' );
        console.log( '   term           - term to use when using the `search` command.');
        console.log('                    Wrap the term in quotes if there are spaces.');
        console.log( '\nexample: cordova-plugins -p ios,android list');
        console.log( '' );
    }
    else {
        var platforms = (parsed.platforms ? parsed.platforms.split(',') : []),
            repo = parsed.repo,
            command = parsed.argv.remain[0] || 'list',
            plugin = parsed.argv.remain[1],
            userconfig = null;

            // userconfig = require(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']+'/.cordova-plugins');
        try {
            userconfig = JSON.parse(fs.readFileSync(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']+'/.cordova-plugins', 'utf8' ));
            repo = repo || (userconfig && userconfig.repo);
        }
        catch(e) {
            console.log( 'Cannot find or parse config file.  Please make sure it exists and is valid json. Using Defaults.\n');
        }

        switch (command.toLowerCase()) {
        case 'list':
        case 'search':
            if( repo && ( repo.toLowerCase().indexOf( 'plugreg' ) !== -1 ) ) {
                plugreg.fetch(plugin,platforms,userconfig);
            }
            else {
                registrycordova.fetch(plugin,platforms,userconfig);
            }
            break;
        // case 'get':
            // break;
        default:
        }
    }
})();
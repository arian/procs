#!/usr/bin/env node

"use strict";

var clint = require('clint')();
var colors = require('colors');
var procs = require('../lib/procs');
var json = require('../package');
var path = require('path');

function bool(value){
	if (value == 'no' || value == 'false') return false;
	if (value == 'yes' || value == 'true') return true;
	return value;
}

clint.command('--help', '-h',
	'usage information');
clint.command('--version', '-v',
	'prints the version number');
clint.command('--file', '-f',
	'file to compile');
clint.command('--template', '-t',
	'template file');
clint.command('--watch', '-w',
	'watch the source files for changes', bool);

var files = [];
var template;
var watch = false;

function help(err){
	console.log(clint.help(2, ' : '.grey));
	process.exit(err);
}

clint.on('chunk', function(){
});

clint.on('command', function(name, value){

	switch (name){
		case '--help':
			help(0);
			break;
		case '--version':
			console.log(json.version);
			process.exit(0);
			break;
		case '--file':
			files.push(path.normalize(process.cwd() + '/' + value));
			break;
		case '--template':
			template = path.normalize(process.cwd() + '/' + value);
			break;
		case '--watch':
			watch = true;
			break;
	}

});

clint.on('complete', function(){

	if (!template || !files.length) help(1);

	files.forEach(function(file){
		procs(file, template, {watch: watch}, function(err){
			if (err) return console.warn((err + '').red);
			console.log((file + " has been compiled\n").green);
		});
	});

});

clint.parse(process.argv.slice(2));

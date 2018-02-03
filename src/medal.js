#!/usr/bin/env node
import program from 'commander';

program
    .version('0.1.0')
    .command('create <target>', 'Creates a new Medal site into the given directory')

program.parse(process.argv);

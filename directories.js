#! /usr/bin/env node
const { program } = require('commander')
program
    .command('list')
    .description('List all the TODO tasks')
    .action(list)
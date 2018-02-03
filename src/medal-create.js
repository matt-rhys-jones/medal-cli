#!/usr/bin/env node
import program from 'commander';
import config from '../config/config';
import git from './services/git';

const create = async (target) => {
    git.verifyGit();
    
    try {
        await git.clone(config.medal.repository.url, config.medal.repository.tag, target);
        console.log(`New Medal site created at ${target}.`)
    } catch (e) {
        console.log(`${e}`);
    }
}

program
    .arguments('<target>')
    .action(create)
    .parse(process.argv)

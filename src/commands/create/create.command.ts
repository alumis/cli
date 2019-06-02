import path from 'path';
import fs from 'fs';
import minimist = require("minimist");
import shell from 'shelljs';
import * as FetchGithubRepo from 'fetch-github-repo';


export function createCommand(args: minimist.ParsedArgs) {

    const option = args._[1];

    switch(option) {

        case 'mvc':
            return createMvcAsync(args);

        default:
            throw Error('unknown option');
    }
}


function createMvcAsync(args: minimist.ParsedArgs) {

    return new Promise((resolve) => {

        let n = args.n ? args.n : 'alumis-mvc';
        let p = args.o ? path.resolve(process.cwd(), args.o, n) : path.resolve(process.cwd(), n);

        if (!fs.existsSync(p)) {
            shell.mkdir('-p', p);
        }

        FetchGithubRepo.download({
            organization: 'alumis',
            repo: 'back-end-scaffold',
            path: p
          }, resolve);
    });
}
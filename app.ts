import * as minimist  from 'minimist';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import * as FetchGithubRepo from 'fetch-github-repo';
import { spawn } from 'child_process';

const args = minimist.default(process.argv.slice(2));
const cmd = args._[0];

let promise: Promise<any>;

switch(cmd) {

    case 'create':
        promise = executeCreateCommand(args);
        break;

    case 'generate':
        promise = executeGenerateCommand(args);
        break;

    default: 
        throw Error('unknown command.');
}

promise
    .then(() => {
        console.log('done');
    })
    .catch(console.error);

function executeCreateCommand(args: minimist.ParsedArgs) {

    if (args._.length < 2)
        throw Error('Missing required option.');

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

function executeGenerateCommand(args: minimist.ParsedArgs) {

    if (args._.length < 2)
        throw Error('Missing required option.');

    const option = args._[1];

    switch(option) {
        
        case 'api':
            return generateApiAsync(args);

        default:
            throw Error('Unknown option');
    }
}

function generateApiAsync(args: minimist.ParsedArgs) {

    return new Promise((resolve) => {

        const processArgs = [path.resolve(path.dirname(__filename),'lib/typeScriptGenerator/Alumis.TypeScript.Generator.dll')];

        if (args.config) {

            processArgs.push('--config');
            processArgs.push(path.resolve(__dirname, args.config));
        }        

        var process = spawn('dotnet', processArgs, { cwd: './' });

        process.stdout.on('data', data => { console.log(data.toString('utf8'))  });
        process.stderr.on('data', data => { console.error('error: ' + data.toString('utf8'))  });
        process.on('close', resolve);
    });
    
}
    
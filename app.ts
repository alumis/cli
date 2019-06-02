import * as minimist  from 'minimist';
import { createCommand } from './src/commands/create/create.command';

const args = minimist.default(process.argv.slice(2));

const cmd = args._[0];

switch(cmd) {

    case 'create':
        createCommand(args);
        break;

    default: 
        throw Error('unknown command.');
}

/*

if (args.c) {

    const options = args.c;

    executeCreateAsync(options, args);
}

function executeCreateAsync(option: string, args: minimist.ParsedArgs) {

    if (option == 'mvc') {

        return new GithubRepositoryService().downloadAsync('alumis', 'back-end-scaffold', './trash');
    }
} */
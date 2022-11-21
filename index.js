import inquirer from 'inquirer';

const fileSystem = {}
const OPERATIONS = {
    CREATE: "Create a folder",
    DELETE: "Delete a folder",
    MOVE: "Move a foler",
    EXIT: "Exit program"
};

function main() {
    console.log('Current file system: ');
    listFolders();
    console.log('\n\n');
    const questions = [{
        type: 'list',
        name: 'operations',
        message: 'Please select an operation:',
        choices: [OPERATIONS.CREATE, OPERATIONS.DELETE, OPERATIONS.MOVE, OPERATIONS.EXIT]
    }];
    inquirer.prompt(questions).then((answers) => {
        switch (answers.operations) {
            case OPERATIONS.CREATE:
                createFolder();
                break;
            case OPERATIONS.DELETE:
                deleteFolder();
                break;
            case OPERATIONS.MOVE:
                moveFolder();
                break;
            case OPERATIONS.EXIT:
            default:
                return;
        }
  });
}

const addPath = (paths) => {
    const pathArray = paths.split("/");
    let currentPath = fileSystem;
    for (let i = 0; i < pathArray.length; i++) {
        const path = pathArray[i];
        if (path in currentPath) {
            if (i === pathArray.length - 1) {
                console.log(`Error: ${paths} exists!`);
                return;
            } else {
                currentPath = currentPath[path];
            }
        } else {
            currentPath[path] = {};
            currentPath = currentPath[path];
        }
    }
    console.log(`${paths} created!`)
}

const createFolder = () => {
    const questions = [{
        type: 'input',
        name: 'path',
    }]
    inquirer.prompt(questions).then((answers) => {
        const paths = answers.path.trim();
        addPath(paths);
        main();
    });
}

const deleteFolder = () => {
    const questions = [{
        type: 'input',
        name: 'path',
    }]
    inquirer.prompt(questions).then((answers) => {
        const paths = answers.path.trim();
        deletePath(paths);
        main();
    });
}

const deletePath = (paths) => {
    const pathArray = paths.split("/")
    let currentPath = fileSystem;
    for (let i = 0; i < pathArray.length; i++) {
        const path = pathArray[i];
        if (!(path in currentPath)) {
            console.log(`Error: ${paths} does not exist!`)
            return;
        }
        if (i === pathArray.length - 1) {
            delete currentPath[path];
            console.log(`${paths} deleted!`);
            return;
        }
        currentPath = currentPath[path];
    }
}

const listFolders = () => {
    const ordered = sortByKey(fileSystem)
    for (const property in ordered) {
       printSubFolders(0, ordered, property)
    }
}

const printSubFolders = (indent, currentPath, key) => {
    let output = key;
    for (let i = indent; i >= 0; i--){
        output = " " + output;
    }
    console.log(output);
    const ordered = sortByKey(currentPath[key])
    for (const property in ordered) {
        printSubFolders(indent + 1, ordered, property);
    }
}

const sortByKey = object => Object.keys(object).sort().reduce(
  (obj, key) => { 
    obj[key] = object[key]; 
    return obj;
  }, 
  {}
)

const moveFolder = () => {
    const questions = [{
        type: 'input',
        name: 'from',
    }, {
        type: 'input',
        name: 'to'
    }]
    inquirer.prompt(questions).then((answers) => {
        const from = answers.from.trim();
        const to = answers.to.trim()
        move(from, to);
        main();
    });
}

const move = (from, to) => {
    const fromArray = from.split("/");
    let currentPath = fileSystem;
    let fromPath;
    let pathKey;
    for (let i = 0; i < fromArray.length; i++) {
        const path = fromArray[i]
        if (!(path in currentPath)) {
            console.log(`Error: ${from} does not exist!`)
            return;
        }
        if (i === fromArray.length - 1) {
            fromPath = JSON.parse(JSON.stringify(currentPath[path]));
            pathKey = path;
            delete currentPath[path];
        }
        currentPath = currentPath[path];
    }
    let movePath = { ...fileSystem };
    const toArray = to.split("/");
    for (let i = 0; i < toArray.length; i++) {
        const path = toArray[i];
        if (!(path in movePath)) {
            movePath[path] = {};
        }
        movePath = movePath[path];
    }
    if (!(pathKey in movePath)) movePath[pathKey] = {};
    Object.assign(movePath[pathKey], fromPath);
}

main();

#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const { join } = require('path');
const fs = require('fs');
const program = require('commander');
const package = require('./package.json');

program.version(package.version);

const init = () => {
    console.log(
      chalk.red(
        figlet.textSync("Juggernaut CLI", {
          horizontalLayout: "default",
          verticalLayout: "default"
        })
      )
    );
}

const insertNameProject = (nameProject) => {
    const packagePath = join(process.cwd(), 'package.json');
    const package = require(packagePath);
    package.name = nameProject;
    fs.writeFileSync(packagePath, JSON.stringify(package, null, '\t'));
}; 

const cloneJuggernaut = (nameProject) => {
    if (!shell.which('git')) {
        console.log('Sorry, this script requires git');
        shell.exit(1);
    }

    const command = shell.exec(`git clone https://github.com/SoftboxLab/juggernaut.git ${nameProject}`, {async:true}, () => {
        if (!command.code) {
            shell.cd(nameProject);
            insertNameProject(nameProject);
            shell.exec(`rm -rf .git`, {async: true});
            shell.exec(`git init`, {async: true});
            const instal = shell.exec('npm install', {async: true}, () => {
                if (!instal.code) {
                    console.log(chalk.green('Juggernaut is here!!!'));
                } else {
                    console.log(command.stderr);
                    console.log(chalk.red('Error to install dependcies.'));
                }
            });
        } else {
            console.log(command.stderr);
            console.log(chalk.red('Error to clone.'));
        }
    });
};

const askQuestions = () => {
    const questions = [
      {
        name: "PROJECTNAME",
        type: "input",
        message: "What is the name of the project?"
      },
    ];
    return inquirer.prompt(questions);
};

const run = async () => {
    // show script introduction
    init();
    // ask questions
    if (!process.argv[2]) {
        const answers = await askQuestions();
        const { PROJECTNAME } = answers;
        cloneJuggernaut(PROJECTNAME);
    } else {
        cloneJuggernaut(process.argv[2]);
    }
    // create the file
    // show success message
};
  
run();

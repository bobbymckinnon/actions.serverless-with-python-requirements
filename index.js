//  Packages
var core = require('@actions/core');
var execSync = require('child_process').execSync;
code = execSync('sudo npm install exeq --save');
var exeq = require('exeq');

//  Environment Vars
var ARGS = core.getInput('args');
var AWS_ACCESS_KEY_ID = core.getInput('aws-access-key-id');
var AWS_SECRET_ACCESS_KEY = core.getInput('aws-secret-access-key');


//  Exeq Vars
var installDocker = exeq([
  'echo Installing docker...',
  'sudo apt-get install docker.io -y',
  'sudo systemctl unmask docker',
  'sudo systemctl start docker'
]);

var installServerlessAndPlugins = exeq([
  'echo Installing Serverless and plugins...',
  'sudo npm i serverless -g',
  'sudo npm i serverless-python-requirements',
  'sudo npm i serverless-plugin-canary-deployments'
]);

var runServerlessDeploy = exeq([
  `echo Running sudo sls deploy ${ARGS}...`,
  `sudo sls config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_ACCESS_KEY} ${ARGS}`,
  `sudo sls deploy ${ARGS}`
]);


//  Main function
if (require.main === module) {
  installDocker.q.on('done', function() {});
  installServerlessAndPlugins.q.on('done', function() {});
  runServerlessDeploy.q.on('done', function() {});
}

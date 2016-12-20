var path = require('path')
var fs = require('fs')

// Fallback for windows backs out of node_modules folder to root of project
process.env.PWD = process.env.PWD || function(){
    var asDependency = (fs.existsSync('../../node_modules/gulp-starter'));
    return path.resolve(process.cwd(), ( asDependency ?'../../':'./'))
}();
global.PATH_CONFIG = require('./lib/get-path-config')
global.TASK_CONFIG = require('./lib/get-task-config')

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulpfile.js/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulpfile.js/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir')

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true })

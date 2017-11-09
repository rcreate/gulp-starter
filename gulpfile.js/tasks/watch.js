var gulp    = require('gulp')
var path    = require('path')
var watch   = require('gulp-watch')
var globExt = require('../lib/globExtension')

var watchTask = function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite', 'html', 'jade', 'pug', 'stylesheets', 'javascripts', 'static']

  function getTaskPathFor(taskName) {
    switch (taskName) {
      case 'iconFont':
        return PATH_CONFIG.icons
      case 'svgSprite':
        return PATH_CONFIG.icons
      case 'html':
        return PATH_CONFIG.html
      case 'pug':
        return PATH_CONFIG.pug
      case 'jade':
        return PATH_CONFIG.jade
      case 'static':
        return PATH_CONFIG.static
      default:
        return PATH_CONFIG[taskName]
    }
  }

    var getGlob = function (taskPath, taskConfig) {
      var paths = [
          path.resolve(process.env.PWD, PATH_CONFIG.src, taskPath.src, '**/*.' + globExt(taskConfig.extensions))
      ];

      if( taskPath.watch ) {
          taskPath.watch.forEach((p)=>{
              paths.push(path.resolve(process.env.PWD, PATH_CONFIG.src, p, '**/*.' + globExt(taskConfig.extensions)));
          });
      }

      return paths;
  }

  watchableTasks.forEach(function(taskName) {
    var taskConfig = TASK_CONFIG[taskName];
    var taskPath = getTaskPathFor(taskName);

    if(taskConfig) {
      if(taskName === 'javascripts') {
        taskName = global.environment === 'development' ? 'webpackDevelopment' : 'webpackProduction'
      }

      var glob = getGlob(taskPath, taskConfig);
      watch(glob, function() {
        require('./' + taskName)()
      })
    }
  })
}

var preTasks = []
if (typeof TASK_CONFIG.browserSync !== "undefined") {
  preTasks.push('browserSync')
} else {
  console.info("BrowserSync must be configured in your config.json file to watch changes in your Browser")
}

gulp.task('watch', preTasks, watchTask)
module.exports = watchTask

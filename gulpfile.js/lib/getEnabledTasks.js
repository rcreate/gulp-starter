var compact = require('lodash/compact')

// Grouped by what can run in parallel
var assetTasks = ['fonts', 'iconFont', 'images', 'svgSprite']
var codeTasks = ['html', 'jade', 'pug', 'css', 'js']

module.exports = function() {

  function matchFilter(task) {
    if(GULP_CONFIG.tasks[task]) {
      if(task === 'js') {
        task = global.environment === 'development' ? 'webpack:development' : 'webpack:production'
      }
      return task
    }
  }

  function exists(value) {
    return !!value
  }

  return {
    assetTasks: compact(assetTasks.map(matchFilter).filter(exists)),
    codeTasks: compact(codeTasks.map(matchFilter).filter(exists))
  }
}

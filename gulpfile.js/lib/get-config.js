var path = require('path')
process.env.PWD = path.resolve(process.cwd(),'../../');

module.exports = function getConfig() {
    // Use provided object
    if (process.env.GULP_CONFIG) {
        return process.env.GULP_CONFIG
    }

    // Load from path
    if (process.env.GULP_CONFIG_PATH) {
        return require(path.resolve(process.env.PWD, process.env.GULP_CONFIG_PATH))
    }

    try {
        // Default Path
        return require(path.resolve(process.env.PWD, 'build_tools/config.json'))

    } catch(e) {
        // Default
        process.env.PWD = process.cwd();
        return require('../config')
    }
}

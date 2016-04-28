var config = require('../lib/getConfig')()
var path = require('path')

module.exports = function () {
    return {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(config.root.src, config.tasks.js.src),
        query: {
            "presets": ["es2015", "stage-1"],
            "plugins": []
        }
    }
};


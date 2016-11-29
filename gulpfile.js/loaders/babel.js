var path = require('path')

module.exports = function () {
    return {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.js.src),
        query: {
            "presets": ["es2015", "stage-1"],
            "plugins": []
        }
    }
};


module.exports = {
  options: {
    cleanFirst: false,
    reportSizes: false,
    watch: true,
    watchProduction: false
  },

  browserSync: {
    server: {
      baseDir: "tmp"
    }
  },

  javascripts: {
    entries: {
      app: ["./app.js"]
    },
    extensions: ["js", "json"],
    extractSharedJs: false,
    hotModuleReplacement: true,
    deployUncompressed: true
  },

  stylesheets: {
    autoprefixer: {
      browsers: ["last 3 version"]
    },
    type: "sass",
    sass: {
      indentedSyntax: true,
      includePaths: [
        "./node_modules/normalize.css"
      ]
    },
    extensions: ["sass", "scss", "css"],
    excludeFolders: ["base", "generated"],
    deployUncompressed: true
  },

  html: {
    dataFile: "data/global.json",
    htmlmin: {
      collapseWhitespace: true
    },
    options: {},
    extensions: ["html", "json"],
    excludeFolders: ["layouts", "shared", "macros", "data"]
  },

  pug: {
    dataFile: "data/global.json",
    htmlmin: {
      collapseWhitespace: true
    },
    options: {},
    extensions: ["pug", "jade", "json"],
    excludeFolders: ["layouts", "shared", "macros", "data"]
  },

  images: {
    extensions: ["jpg", "png", "svg", "gif"]
  },

  fonts: {
    extensions: ["woff2", "woff", "eot", "ttf", "svg"]
  },

  svgSprite: {
    extensions: ["svg"]
  },

  production: {
    rev: true
  }
}

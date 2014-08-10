module.exports = function(grunt) {

  // Grunt config
  grunt.initConfig({
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'bower_static/bootstrap/dist',
            src: ['**/*.min.*', 'fonts/**'],
            dest: 'build/app/public/static/'
          },
          {
            expand: true,
            cwd: 'bower_static/fontawesome/',
            src: ['css/*.min.css', 'fonts/*'],
            dest: 'build/app/public/static/'
          },
          {
            expand: true,
            cwd: 'bower_static/jquery/dist',
            src: ['jquery.min.js'],
            dest: 'build/app/public/static/js/'
          },
          {
            expand: true,
            cwd: 'bower_static/hint.css/',
            src: ['hint.min.css'],
            dest: 'build/app/public/static/css/'
          },
          {
            expand: true,
            cwd: 'bower_static/sugar/release',
            src: ['*.min.js'],
            dest: 'build/app/public/static/js/'
          },
          {
            expand: true,
            cwd: 'bower_static/Keypress',
            src: ['keypress.js'],
            dest: 'build/app/public/static/js/'
          },
          {
            expand: true,
            cwd: 'bower_static/markdown/lib',
            src: ['markdown.js'],
            dest: 'build/app/public/static/js/'
          },
          {
            expand: true,
            cwd: "src/",
            src: ["*.js", "chat/*.js", "routes/*.js", "views/*.html"],
            dest: "build/app/"
          },
          {
            expand: true,
            cwd: "src/static",
            src: ["**"],
            dest: "build/app/public/static"
          },
          {
            expand: true,
            src: ["conf/**"],
            dest: "build/app/"
          },
        ]  
      }
    },
    clean: {
      build: [
          'build'
      ],
      static: [
          'bower_static'
      ],
      modules: [
          'node_modules',
      ]
    },
    // Allows to deploy the app
    run: {
      deploy: {
        options: {
          cwd: "build/app"
        },
        cmd: "node",
        args: [
          'chatjs.js'
        ]
      }
    }
  })

  // Loads the grunt tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-run');
  
  // Task definition
  grunt.registerTask('default', ['copy'])
  grunt.registerTask('deploy', ['default', 'run:deploy'])
}

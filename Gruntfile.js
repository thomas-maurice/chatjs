module.exports = function(grunt) {

  // Grunt config
  grunt.initConfig({
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'bower_static/bootstrap/dist', src: ['**/*.min.*', 'fonts/**'], dest: 'static/'},
					{expand: true, cwd: 'bower_static/jquery/dist', src: ['jquery.min.js'], dest: 'static/js/'},
				]	
			}
		},
		clean: {
			static: [
					'bower_static',
					'static'
				],
			modules: [
					'node_modules',
			]
		}
	})

	// Loads the grunt tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
  
	// Task definition
  grunt.registerTask('default', ['copy'])
}

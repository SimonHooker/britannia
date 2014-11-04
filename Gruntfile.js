module.exports = function(grunt) {
		
	grunt.initConfig({
		bower_concat: {
			all: {
				dest: 'js/_bower.js',
				cssDest: 'css/_bower.less',
				exclude: [],
				dependencies: {
					'ember': 'jquery',
					'bootstrap': 'jquery'
				},
				bowerOptions: {
					relative: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.registerTask('default', ['bower_concat']);

};
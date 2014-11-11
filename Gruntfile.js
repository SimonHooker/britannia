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
		},

		concat: {
				js: {
					src: [
						'js/_bower.js',
						'js/app-init.js',
						'js/data/*.js',
						'js/app-logic.js'
					],
					dest: 'js/britannia.js'
				}
		},
		watch: {
			scripts: {
				files: ['js/*.js'],
				tasks: 'js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('js', ['bower_concat','concat:js']);

	grunt.registerTask('default', ['js']);

};
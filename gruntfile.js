module.exports = function (grunt) {
    grunt.initConfig({

    copy: {
	fonts: {
	    files: [
		{ expand: true, cwd: 'bower_components/bootstrap/fonts', src: ['*'], dest: 'www/fonts/', flatten: true},
		{ expand: true, cwd: 'bower_components/chosen', src: ['*.png'], dest: 'www/css/', flatten: true},
	    ]
	},
	maps: {
	    files: [
		{ expand: true, cwd: 'bower_components/bootstrap/www/css/', src: ['*.map'], dest: 'www/css/', flatten: true}
	    ]
	},
	html: {
	    files: [
		{ expand: true, cwd: 'app', src: ['tpl/*'], dest: 'www/'},
		{ expand: true, cwd: 'app', src: ['*.html'], dest: 'www/'}
	    ]
	}
    },
    concat: {
	style: {
	    src: [
		"bower_components/html5-boilerplate/css/normalize.css",
		"bower_components/html5-boilerplate/css/main.css",
		"bower_components/bootstrap/dist/css/bootstrap.min.css",
		"bower_components/chosen/chosen.min.css",
		"bower_components/angular-chosen-localytics/chosen-spinner.css",
		"app/css/app.css"
	    ],
	    dest: 'www/css/style.css'
	},
	js: {
	    src: [
		"bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js",
		"bower_components/jquery/dist/jquery.min.js",
		"bower_components/bootstrap/dist/js/bootstrap.min.js",
		"bower_components/angular/angular.min.js",
		"bower_components/angular-sanitize/angular-sanitize.min.js",
		"bower_components/angular-ui-router/release/angular-ui-router.min.js",
		"bower_components/angular-bootstrap/ui-bootstrap.min.js",
		"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
		"bower_components/angular-timer/dist/angular-timer.min.js",
		"bower_components/chosen/chosen.jquery.min.js",
		"bower_components/angular-chosen-localytics/chosen.js",
		"bower_components/angular-translate/angular-translate.min.js",
		"bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
		"app/lib/js/*.js",
		"app/js/*.js"
	    ],
	    dest: 'www/js/app.js'
	}
    },
    watch: {
	app: {
	    files: "app/**",
	    tasks: ['concat','copy']
	}
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-watch');

// register at least this one task
grunt.registerTask('default', [  'concat', 'copy' ]);

};

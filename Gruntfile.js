module.exports=function(grunt){

grunt.initConfig({
	pkg:grunt.file.readJSON('package.json'),
	meta: {
		dir: {
			jsSrc: "src",
			jsDev: "dev/ui-assets/v6/js",
			jsBuild: "build/ui-assets/v6/js",
			sassSrc: "stylesheets",
			cssDev: "dev/ui-assets/v6/css",
			cssBuild: "build/ui-assets/v6/css",
			//img: 'img'
		}
	},
	uglify:{
			options:{
				banner:'/*!<%=pkg.name%>-<%=grunt.template.today("dd-mm-yyyy")%>*/\n',
				compress: true
			},
		dist:{
			files:{
				'<%=meta.dir.jsBuild%>/base.min.js':['<%=meta.dir.jsDev%>/base.js'],
				'<%=meta.dir.jsBuild%>/home.min.js':['<%=meta.dir.jsDev%>/home.js'],
			}
		}
	},
	concat:{
		options:{
			separator:';',
		},
		base:{
			files: {
				'<%=meta.dir.jsDev%>/base.js': [	
					'<%=meta.dir.jsSrc%>/_console.js',
					'<%=meta.dir.jsSrc%>/_touch.js',
					'<%=meta.dir.jsSrc%>/vendor/mmenu-js/jquery.mmenu.min.js',
					'<%=meta.dir.jsSrc%>/_modal-dep.js',
					'<%=meta.dir.jsSrc%>/_modal-domready-old.js',
					'<%=meta.dir.jsSrc%>/_modal.js',
					'<%=meta.dir.jsSrc%>/_modal-domready.js',
					'<%=meta.dir.jsSrc%>/_pi-smartresize.js',
					'<%=meta.dir.jsSrc%>/_got-ajax-error.js',
					'<%=meta.dir.jsSrc%>/_cartstuff.js',
					'<%=meta.dir.jsSrc%>/_top.js',
					'<%=meta.dir.jsSrc%>/_scroll-to-anchor.js',
					'<%=meta.dir.jsSrc%> /_check-mobile.js',
					'<%=meta.dir.jsSrc%>/_nav-mobile.js',
					'<%=meta.dir.jsSrc%>/_ajax-footer.js',
					'<%=meta.dir.jsSrc%>/_sli-search.js',
					'<%=meta.dir.jsSrc%>/_sli-init-products.js',
					'<%=meta.dir.jsSrc%>/_promo.js',
					'<%=meta.dir.jsSrc%>/_kaf-time.js',
					'<%=meta.dir.jsSrc%>/_signup-trim.js',
					//'<%=meta.dir.jsSrc%>/_stamps.js',
					'<%=meta.dir.jsSrc%>/_chat.js',
					'<%=meta.dir.jsSrc%>/_rocketfuel.js',
					'<%=meta.dir.jsSrc%>/_basic-domready.js'
					]
			},
		},
		home:{
			files: {
				'<%=meta.dir.jsDev%>/home.js': [	
					'<%=meta.dir.jsSrc%>/home/_home-module-1.js',
					'<%=meta.dir.jsSrc%>/home/_home-module-2.js',
					]
			},
		},
	},
	jshint:{
			files:['Gruntfile.js','<%=meta.dir.jsSrc%>/*.js','test/**/*.js'],
			options:{
			//optionsheretooverrideJSHintdefaults
			globals:{
			jQuery:true,
			console:true,
			module:true,
			document:true
			}
		}
	},
	sass:{
		dev:{
			options:{
				style:'expanded'
			},
			files:{ 
				'<%=meta.dir.cssDev%>/home-ex.css':'<%=meta.dir.sassSrc%>/v6-home.scss'
			}
		},
		build:{
			options:{
				style:'compressed'
			},
			files:{
				'<%=meta.dir.cssBuild%>/home.css':'<%=meta.dir.sassSrc%>/v6-home.scss'
			}
		}
	},
	watch:{
		css:{
			files:'<%=meta.dir.sassSrc%>/**/*.scss',
			tasks:['sass']
		},
		js: {
        files: ['<%=meta.dir.jsSrc%>/**/*.js'],
       // tasks: ['concat']
   }
}

});


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');	


	grunt.registerTask('jsdev',['jshint','watch:js','concat:home']);
	grunt.registerTask('default',['sass:dev','watch:css']);
	grunt.registerTask('cssbuild',['sass']);
	grunt.registerTask('jsbuild',['jshint','concat','uglify']);
	grunt.registerTask('build',['sass:build','concat','uglify']);

};
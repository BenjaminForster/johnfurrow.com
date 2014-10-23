module.exports = function (grunt) {
  grunt.initConfig({
    autoprefixer: {
      build: {
        options: {
          map: true,
          browsers: ['> 1%', 'last 5 versions', 'ff 24', 'opera 12.1']
        },
        files: {
          'stylesheets/screen.css': 'stylesheets/screen.css'
        }
      }
    },
    sass: {
      build: {
        options: {
          sourcemap: true,
          style: 'compressed'
        },
        files: {
          'stylesheets/screen.css': 'sass/screen.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer']
      },
      html: {
        files: ['**/*.html']
      },
      js: {
        files: ['**/*.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('default', ['watch']);
};

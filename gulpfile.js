'use strict'

const browserify = require('browserify')
const exec = require('child_process').exec
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const path = require('path')
const source = require('vinyl-source-stream')

const initUsersTask = (done) => {
  exec('node ./src/scripts/init-users.js', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    done(err)
  })
}

const buildJSTask = () => {
  const files = [
    'src/assets/javascripts/login.js',
    'src/assets/javascripts/register.js',
    'src/assets/javascripts/dashboard.js'
  ]

  return files.map((fileName) => {
    browserify({ entries: [ fileName ] }) // Initalise browserify
    .bundle() // Combine javascripts used by entry
    .pipe(source(fileName)) // Convert the combined javascripts to a text stream
    .pipe(rename({
      // Rename the text stream postfix
      dirname: '.',
      extname: '.bundle.js' 
    }))
    .pipe(gulp.dest('src/public/javascripts')) // Send to the destination
  })
}

const buildCSSTask = () => {
  return gulp.src('./src/assets/stylesheets/index.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'node_modules', 'bootstrap-less') ]
    }))
    .pipe(gulp.dest('src/public/stylesheets'));
}

gulp.task('default', [ 'initUsers', 'buildJS', 'buildCSS' ])
gulp.task('initUsers', initUsersTask)
gulp.task('buildJS', buildJSTask)
gulp.task('buildCSS', buildCSSTask)

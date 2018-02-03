'use strict'

const gulp = require('gulp')
const rename = require('gulp-rename')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

const defaultTask = () => {
  const files = [
    'src/assets/javascripts/login.js',
    'src/assets/javascripts/register.js'
  ]
  files.map(browserifyTask)
}

const browserifyTask = (fileName) => {
  return browserify({ entries: [ fileName ] }) // Initalise browserify
    .bundle() // Combine javascripts used by entry
    .pipe(source(fileName)) // Convert the combined javascripts to a text stream
    .pipe(rename({
      // Rename the text stream postfix
      dirname: '.',
      extname: '.bundle.js' 
    }))
    .pipe(gulp.dest('src/public/javascripts')) // Send to the destination
}

gulp.task('default', defaultTask)

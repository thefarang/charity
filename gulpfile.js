'use strict'

const gulp = require('gulp')
const rename = require('gulp-rename')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const exec = require('child_process').exec

const initUsersTask = (done) => {
  exec('node ./src/scripts/init-users.js', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    done(err)
  })
}

const browserifyTask = () => {
  const files = [
    'src/assets/javascripts/login.js',
    'src/assets/javascripts/register.js'
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

gulp.task('default', [ 'initUsersTask', 'browserifyTask' ])
gulp.task('initUsersTask', initUsersTask)
gulp.task('browserifyTask', browserifyTask)

'use strict'

const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const cleanCSS = require('gulp-clean-css')
const fs = require('fs')
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const path = require('path')
const sitemapBuilder = require('sitemap')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const util = require('gulp-util')

/*
@todo
Repurpose this script to read in the package.json and extract the list of
dev dependencies. This can then be uninstalled from the Dockerfile at the
end of the installation process.
const initUsersTask = (done) => {
  // const exec = require('child_process').exec
  exec('node ./src/scripts/init-users.js', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    done(err)
  })
}
*/

const buildJSTask = () => {
  const files = [
    'src/assets/javascripts/index.js'
  ]

  return files.map((fileName) => {
    browserify({ entries: [ fileName ] }) // Initalise browserify
    .transform('babelify', { presets: ['es2015'] })
    .bundle() // Combine javascripts used by entry
    .pipe(source(fileName)) // Convert the combined javascripts to a text stream
    .pipe(buffer())
    .pipe(process.env.NODE_ENV === 'production' ? util.noop() : sourcemaps.init())
    .pipe(process.env.NODE_ENV === 'production' ? uglify() : util.noop())
    .pipe(process.env.NODE_ENV === 'production' ? util.noop() : sourcemaps.write())
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
      paths: [ path.join(__dirname, 'node_modules') ]
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('src/public/stylesheets'))
}

// @todo
// Build the list dynamically using the ./src/lib/acl
// Include the charity research pages: /charities/charity-name-goes-here
// @How to include the charity links in all running instances of this app?
// sitemap.xml could be an endpoing which runs a query against the database.
// We will need to cache this for up to an hour, to reduce server load
const buildSitemapTask = (done) => {
  const sitemap = sitemapBuilder.createSitemap({
    hostname: process.env.APP_URL,
    cacheTime: 600000, // 600 sec - cache purge period 
    urls: [
      { url: '/',  changefreq: 'daily', priority: 0.1 },
      { url: '/explore', changefreq: 'always', priority: 0.2 },
      { url: '/login',  changefreq: 'weekly',  priority: 0.5 },
      { url: '/register', changefreq: 'weekly',  priority: 0.5 },
      { url: '/reset-password', changefreq: 'weekly',  priority: 0.5 },
      { url: '/terms', changefreq: 'weekly',  priority: 0.5 }
    ]
  })

  fs.writeFile("./src/public/sitemap.xml", sitemap.toString(), (err) => done())
}

const buildRobotsTask = (done) => {

  // @todo
  // Add to the robots.txt:
  // APP_URL/register-confirm
  // APP_URL/javascripts/
  // APP_URL/stylesheets
  // Maybe build this list dynamically using the ./src/lib/acl, and including 'exlusions'
  // in the ACL objects there.

  let siteMapContent = `User-agent: *\n`
  siteMapContent += `Sitemap: ${process.env.APP_URL}/sitemap.xml`
  fs.writeFile("./src/public/robots.txt", siteMapContent, (err) => done())
}

gulp.task('default', [ 'buildJS', 'buildCSS', 'buildSitemap', 'buildRobots' ])
gulp.task('buildJS', buildJSTask)
gulp.task('buildCSS', buildCSSTask)
gulp.task('buildSitemap', buildSitemapTask)
gulp.task('buildRobots', buildRobotsTask)

// @todo setup watchify
// https://www.npmjs.com/package/watchify
// https://stackoverflow.com/questions/36384103/how-to-use-watchify
// gulp.task('watchify', watchifyTask)

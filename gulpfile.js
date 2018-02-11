'use strict'

const browserify = require('browserify')
const exec = require('child_process').exec
const fs = require('fs')
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const path = require('path')
const sitemapBuilder = require('sitemap')
const source = require('vinyl-source-stream')

/*
const initUsersTask = (done) => {
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
    .pipe(gulp.dest('src/public/stylesheets'))
}

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
  let siteMapContent = `User-agent: *\n`
  siteMapContent += `Sitemap: ${process.env.APP_URL}/sitemap.xml`
  fs.writeFile("./src/public/robots.txt", siteMapContent, (err) => done())
}

gulp.task('default', [ 'buildJS', 'buildCSS', 'buildSitemap', 'buildRobots' ])
gulp.task('buildJS', buildJSTask)
gulp.task('buildCSS', buildCSSTask)
gulp.task('buildSitemap', buildSitemapTask)
gulp.task('buildRobots', buildRobotsTask)

// Gulp.js configuration

const
    // modules
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    server = require('gulp-server-livereload'),
    fileinclude = require('gulp-file-include'),

// folders
src = 'src/',
    build = 'build/'
;

// image processing
function images() {

    const out = build + 'images/';

    return gulp.src(src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));

}
exports.images = images;

// HTML processing
function html() {
    const out = build;

    return gulp.src(src + 'html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest(out))
}
exports.html = gulp.series(images, html);

// image processing
function fonts() {

    const out = build + 'fonts/';

    return gulp.src(src + 'fonts/**/*')
        .pipe(newer(out))
        .pipe(gulp.dest(out));
}
exports.fonts = fonts;

// vendors processing
function vendors() {
    const out = build + 'js/';

    return gulp.src(src + 'vendors/**/*')
        .pipe(terser())
        .pipe(gulp.dest(out));
}
exports.vendors = vendors;

// JavaScript processing
function js() {
    const out = build + 'js/';

    return gulp.src(src + 'js/**/*')
        .pipe(concat('main.js'))
        .pipe(terser())
        .pipe(gulp.dest(out));

}
exports.js = js;

// CSS processing
function css() {
    const out = build + 'css/';

    return gulp.src(src + 'scss/main.scss')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: '/images/',
            precision: 3,
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(postcss([
            assets({ loadPaths: ['images/'] }),
            autoprefixer(),
            cssnano
        ]))
        .pipe(gulp.dest(out))
}
exports.css = gulp.series(images, css);

// run all tasks
exports.build = gulp.parallel(exports.html, exports.vendors, exports.fonts, exports.css, exports.js);

// watch for file changes
function watch(done) {

    // image changes
    gulp.watch(src + 'images/**/*', images);

    // html changes
    gulp.watch(src + 'html/**/*', html);

    // css changes
    gulp.watch(src + 'scss/**/*', css);

    // js changes
    gulp.watch(src + 'js/**/*', js);

    gulp.src('./build/')
        .pipe(server({
            livereload: true,
            open: true,
        }));

    done();

}
exports.watch = watch;

exports.default = gulp.series(exports.build, exports.watch);

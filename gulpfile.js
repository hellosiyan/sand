const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const compiler = require('google-closure-compiler-js').gulp();
const fs = require('fs');
const archiver = require('archiver');
const cleanCSS = require('gulp-clean-css');
const  inlinesource = require('gulp-inline-source');
const rename = require('gulp-rename');
const notifier = require('node-notifier');

gulp.task('build', () => {
    return do_rollup('./src/index.js', './dist/library.js')
        .then(() => do_closure_compile('./dist/library.js', './dist/'))
        .then(() => do_clean_css('./src/styles/main.css', 'dist'))
        .then(() => do_inline_source('./src/index.template.html', './dist'))
        .then(() => postbuild());
});

gulp.task('default', () => {
    return do_rollup('./src/index.js', './dist/library.js')
        .then(() => do_clean_css('./src/styles/main.css', 'dist'));
});

gulp.task('build_source', () => {
    return do_rollup('./src/index.js', './dist/library.cjs.js')
        .then(() => do_inline_source('./src/index.template.html', './dist'))
        .then(() => notifier.notify('JS compiled.'));
});

gulp.task('build_styles', () => {
    return do_clean_css('./src/styles/main.css', 'dist')
        .then(() => do_inline_source('./src/index.template.html', './dist'))
        .then(() => notifier.notify('CSS compiled.'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['build_source']);
    gulp.watch('src/styles/main.css', ['build_styles']);
});

function do_rollup(source, destination) {
    return rollup.rollup({
        input: source,
        plugins: [
            resolve(),
            commonjs()
        ]
    })
    .then(bundle => {
        return bundle.write({
            file: destination,
            format: 'iife',
            // name: 'library',
            // sourcemap: true
        });
    });
}

function do_closure_compile(source, destination) {
    return new Promise(function(resolve, reject) {
        gulp.src(source, {base: destination})
            .pipe(compiler({
                // compilationLevel: 'ADVANCED',
                compilationLevel: 'SIMPLE',
                // compilationLevel: 'WHITESPACE_ONLY',
                warningLevel: 'QUIET',
                // outputWrapper: '(function(){\n%output%\n}).call(this)',
                jsOutputFile: 'library.cjs.js',  // outputs single file
                languageIn: 'ECMASCRIPT6',
                languageOut: 'ECMASCRIPT6',
                rewritePolyfills: false,
                // assumeFunctionWrapper: true,
                // createSourceMap: true,
            }))
            .pipe(gulp.dest(destination))
            .on('error', reject)
            .on('end', resolve)
    })
}

function do_clean_css(source, destination) {
    return new Promise(function(resolve, reject) {
        gulp.src(source)
            .pipe(cleanCSS())
            .pipe(gulp.dest(destination))
            .on('error', reject)
            .on('end', resolve)
    })
}

function do_inline_source(source, destination) {
    return new Promise(function(resolve, reject) {
        gulp.src(source)
            .pipe(inlinesource({compress: false}))
            .pipe(rename('index.html'))
            .pipe(gulp.dest(destination))
            .on('error', reject)
            .on('end', resolve)
    })
}

function postbuild() {
    // fs.unlinkSync('./dist/script.js')
    // fs.unlinkSync('./dist/style.css')

    let output = fs.createWriteStream('./dist/build.zip')
    let archive = archiver('zip', {
      zlib: { level: 9 } // set compression to best
    })

    output.on('close', function() {
      let usedBytes = archive.pointer();
      let totalBytes = 13312;

      console.log(usedBytes + '/' + totalBytes + ' total bytes (' + (Math.ceil(usedBytes / totalBytes * 1000000) / 10000) + '%)');
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.warn(err)
      } else {
        throw err;
      }
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);
    archive.append(
      fs.createReadStream('./dist/index.html'), {
        name: 'index.html'
      })

    archive.finalize()
}

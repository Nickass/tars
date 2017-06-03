'use strict';

const $ = tars.packages;
const gulp = $.gulp;

const notifier = tars.helpers.notifier;
const tarsConfig = tars.config;


module.exports = function () {

    gulp.task('injectDep', function (done) {
        var npmfiles = gulp.src($.mainNpmFiles());
        npmfiles.on('error', e =>{console.log(e); return;})
        var bowerfiles = gulp.src('./bower.json').pipe($.mainBowerFiles());

        return gulp.src(['./markup/pages/**/*.{pug,jade,}', '!./markup/pages/_**'])
            .pipe($.plumber({
                errorHandler: function (error) {
                    notifier.error('An error occurred while something.', error);
                }
            }))
            .pipe($.inject($.series(npmfiles,bowerfiles),{addPrefix: './..', addRootSlash:false,}))
            .pipe(gulp.dest('./markup/pages/'))
            .pipe(notifier.success('InjectDep has been finished'));

        // You can return callback, if you can't return pipe
        // done(null);
    });
};

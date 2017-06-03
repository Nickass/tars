'use strict';

const $ = tars.packages;
const gulp = $.gulp;

const notifier = tars.helpers.notifier;
const tarsConfig = tars.config;
const deps = tarsConfig.injectDependencies;


module.exports = function () {

    gulp.task('other:inject-dependencies', function (done) {
        if(!deps && !deps.length) return;

        var series = deps.map((dep)=>{
            if(dep === 'bower') {
                return gulp.src('./bower.json').pipe($.mainBowerFiles());
            }
            else if(dep === 'npm') {
                return gulp.src($.mainNpmFiles());
            } else {
                throw new Error(`I don't know this package manager ${dep}!`)
            }
        });

        return gulp.src(['./markup/pages/**/*.{pug,jade,}', '!./markup/pages/_**'])
            .pipe($.plumber({
                errorHandler: function (error) {
                    notifier.error('An error occurred while something.', error);
                }
            }))
            .pipe(
                $.inject($.series(...series),{
                                                empty: true,
                                                addPrefix: './..',
                                                addRootSlash:false,
                                            }))
            .pipe(gulp.dest('./markup/pages/'))
            .pipe(notifier.success('InjectDep has been finished'));

        // You can return callback, if you can't return pipe
        // done(null);
    });
};

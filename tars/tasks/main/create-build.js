'use strict';

const gulp = tars.packages.gulp;
const plumber = tars.packages.plumber;
const notifier = tars.helpers.notifier;
const resolveDep = tars.packages.resolveDep;
const ifi = tars.packages.if;
/**
 * Copy files from dev to build directory. Create build directory with new build version
 */
const pathsDir = {
    js: `${tars.config.fs.staticFolderName}/js/separate-js/`,
    css: `${tars.config.fs.staticFolderName}/${tars.cssPreproc}/separate-css/`,
};

module.exports = () => {
    return gulp.task('main:create-build', () => {
        return gulp.src(['./dev/**/*.*', '!./dev/temp/**'], { base: './dev/' })
            .pipe(plumber({
                errorHandler(error) {
                    notifier.error('An error occurred while running create-build task.', error);
                }
            }))
            .pipe(ifi('*.html', resolveDep(pathsDir)))
            .pipe(gulp.dest(tars.options.build.path))
            .pipe(
                notifier.success('Pre-build task is finished')
            );
    });
};

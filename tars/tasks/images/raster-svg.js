'use strict';

const gulp = tars.packages.gulp;
const cache = tars.packages.cache;
const changed = tars.packages.changed;
const plumber = tars.packages.plumber;
const notifier = tars.helpers.notifier;
const rename = tars.packages.rename;

const imagesPath = `${tars.config.fs.staticFolderName}/${tars.config.fs.imagesFolderName}`;

/**
 * Raster SVG-files (optional task)
 */
module.exports = () => {
    return gulp.task('images:raster-svg', done => {

        if (tars.config.svg.active && tars.config.svg.workflow === 'sprite' && (tars.flags.ie8 || tars.flags.ie)) {
            return gulp.src([`./markup/${imagesPath}/svg/*.svg`,
                `./markup/${tars.config.fs.componentsFolderName}/**/sprite/*.svg`])
                .pipe(plumber({
                    errorHandler(error) {
                        notifier.error('An error occurred while rastering svg.', error);
                    }
                }))
                .pipe(cache('raster-svg'))
                .pipe(
                    changed(
                        `${imagesPath}/rastered-svg-images`,
                        {
                            hasChanged: changed.compareLastModifiedTime,
                            extension: '.png'
                        }
                    )
                )
                .pipe(tars.require('gulp-svg2png')())
                .pipe(rename(fPath=>{
                    if(!tars.config.prefixGlobalSprite) return fPath;

                    if(fPath.dirname === '.') {
                        fPath.basename = tars.config.prefixGlobalSprite + fPath.basename;
                        return fPath;
                    }

                    if(fPath.dirname !== '.') {
                        fPath.dirname = '.';
                        return fPath;
                    }
                }))
                .pipe(gulp.dest(`./dev/${imagesPath}/rastered-svg-images`))
                .pipe(
                    notifier.success('SVG\'ve been rastered')
                );
        }

        tars.skipTaskLog('images:raster-svg', 'Rastering SVG is not used');
        done(null);
    });
};

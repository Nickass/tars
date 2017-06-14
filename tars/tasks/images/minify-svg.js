'use strict';

const gulp = tars.packages.gulp;
const changed = tars.packages.changed;
const plumber = tars.packages.plumber;
const notifier = tars.helpers.notifier;
const rename = tars.packages.rename;

const svgImagesPath = `${tars.config.fs.staticFolderName}/${tars.config.fs.imagesFolderName}`;

/**
 * Minify svg-images (optional task)
 */
module.exports = () => {
    return gulp.task('images:minify-svg', done => {

        if (tars.config.svg.active) {
            return gulp.src([`./markup/${svgImagesPath}/svg/*.svg`,
                `./markup/${tars.config.fs.componentsFolderName}/**/sprite/*.svg`])
                .pipe(plumber({
                    errorHandler(error) {
                        notifier.error('An error occurred while minifying svg.', error);
                    }
                }))
                .pipe(changed(
                    `dev/${svgImagesPath}/minified-svg`,
                    {
                        hasChanged: changed.compareLastModifiedTime,
                        extension: '.svg'
                    }
                ))
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
                .pipe(tars.require('gulp-imagemin')(
                    {
                        svgoPlugins: [
                            { cleanupIDs: false },
                            { removeViewBox: false },
                            { convertPathData: false },
                            { mergePaths: false }
                        ],
                        use: []
                    }
                ))
                .pipe(gulp.dest(`./dev/${svgImagesPath}/minified-svg/`))
                .pipe(
                    notifier.success('SVG\'ve been minified')
                );
        }

        tars.skipTaskLog('images:minify-svg', 'SVG is not used');
        done(null);
    });
};

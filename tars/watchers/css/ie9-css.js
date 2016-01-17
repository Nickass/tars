'use strict';

const watcherLog = tars.helpers.watcherLog;

/**
 * Watcher for ie9 stylies
 */
module.exports = () => {
    if (tars.flags.ie9 || tars.flags.ie) {
        return tars.packages.chokidar.watch(
            [
                'markup/modules/**/ie9.' + tars.cssPreproc.ext,
                'markup/modules/**/ie9.css'
            ],
            tars.options.watch
        ).on('all', (event, path) => {
            watcherLog(event, path);
            tars.packages.gulp.start('css:compile-css-for-ie9');
        });
    }

    return false;
};
'use strict';

const deps = tars.config.injectDependencies;

/**
 * Watcher for separate Js files files
 */
module.exports = () => {
    if(!deps && !deps.length) return;

    let paths = deps.map((dep)=>{
        if(dep === 'bower') 
            return './bower.json'
        else if(dep === 'npm')
            return './package.json'
        else
            throw new Error(`I don't know this package manager ${dep}!`);
    });

    return tars.packages.chokidar.watch(paths)
    .on('all', (event, watchedPath) => {
        tars.helpers.watcherLog(event, watchedPath);
        tars.packages.gulp.start('other:inject-dependencies');
    });
};

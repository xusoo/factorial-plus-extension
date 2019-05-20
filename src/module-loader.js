const Extension = {
    Modules: {
        __modules: [],
        register(options, instance) {
            console.debug(`Registering ${options.name}`);
            this.__modules.push({ options, instance });
        },
        loadAll() {
            return Promise.all(this.__modules
                    .filter(module => module.options.paths.some(path => location.pathname.match(path) != null))
                    .map(module => this.loadModule(module))
            );
        },
        loadModule(module) {
            console.debug(`Loading ${module.options.name}`);
            if (module.options.stylesheet) {
                injectStyle(`${module.options.name}-stylesheet`, module.options.stylesheet);
            }
            return waitFor(module.options.requiresElement).then($element => {
                module.instance.load($element);
                console.debug(`${module.options.name} loaded`);
                return Promise.resolve(module);
            });
        },
        unloadAll() {
            this.__modules.forEach(module => {
                module.instance.unload && module.instance.unload();
                if (module.options.stylesheet) {
                    uninjectStyle(module);
                }
            });
        }
    },
};

$(document).ready(() => {
    /**
     * We need to unload everything beforehand, because in the event that the extension gets updated while being used, it will
     * be reloaded automatically, causing all the modules to be executed again and maybe duplicating some elements on the page.
     * So by calling the unload() method, each module is responsible to clean up the changes it might have made.
     */
    Extension.Modules.unloadAll();
    Extension.Modules.loadAll().then(() => {
        console.debug('All modules have been loaded');
        this.latestUrl = location.href;
        onTabEvent('tab-updated', () => {
            if (this.latestUrl !== location.href) {
                Extension.Modules.unloadAll();
                Extension.Modules.loadAll();
                this.latestUrl = location.href;
            }
        });
    });

});
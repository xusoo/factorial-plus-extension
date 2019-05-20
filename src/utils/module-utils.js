function waitFor(selector) {

    if (!selector) {
        return Promise.resolve();
    }

    const _waitFor = (selector, callback) => {
        if ($(selector).length) {
            callback($(selector));
        } else {
            setTimeout(() => _waitFor(selector, callback), 50);
        }
    };

    return new Promise(resolve => _waitFor(selector, resolve));
}

function onTabEvent(event, callback) {
    chrome.runtime.onMessage.addListener(message => {
        if (message === event) {
            callback(location);
        }
    });
}

function injectStyle(id, file) {
    const href = chrome.runtime.getURL(file);
    $('head').prepend($(`<link id="${id}" rel="stylesheet">`).attr('href', href));
}

function uninjectStyle(module) {
    $(`link#${module.options.name}-stylesheet`).remove();
}
Extension.Modules.register({
    name: 'show-only-current-week',
    paths: [`/attendance/clock-in/`],
    requiresElement: '[class^="tableContainer__"],[class^="emptyList__"]',
    stylesheet: 'styles/show-only-current-week.css'
}, new class {

    load($container) {

        if (!isCurrentMonth()) {
            return;
        }

        $('.medium[class^=header]').after(`
            <div class="show-only-current-week">
                <label>
                    <input type="checkbox">
                    ${chrome.i18n.getMessage('showonlycurrentweek_checkbox_label')}
                </label>
            </div>
        `);

        const handleEvent = function (value) {
            if (value) {
                $container.find(`tbody > tr:not([data-week=${moment().isoWeek()}])`).hide();
            } else {
                $container.find('tbody > tr').show();
            }
        };

        $('.show-only-current-week input').change(event => {
            handleEvent(event.target.checked);
            chrome.storage.local.set({ showOnlyCurrentWeek: event.target.checked });
        });

        chrome.storage.local.get("showOnlyCurrentWeek", item => {
            $('.show-only-current-week input').attr('checked', item.showOnlyCurrentWeek);
            handleEvent(item.showOnlyCurrentWeek);
        });
    }

    unload() {
        $('.show-only-current-week').remove();
    }
}());
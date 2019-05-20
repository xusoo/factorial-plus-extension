Extension.Modules.register({
    name: 'week-totals',
    paths: [`/attendance/clock-in/`],
    requiresElement: '[class^="tableContainer__"],[class^="emptyList__"]',
    stylesheet: 'styles/week-totals.css'
}, new class {

    load($container) {
        $container.find(`[data-day]:last`).after($(`
            <tr class="month-total-row">
                <td colspan="3">${chrome.i18n.getMessage('weektotals_month_total')}</td>
                <td colspan="2" class="month-total"/>
            </tr>
        `));

        $container.find(`[data-weekday="SUNDAY"], [data-day]:last:not([data-weekday="SUNDAY"])`).each((i, row) => {
            $(row).after($(`
                <tr class="week-total-row" data-week="${row.dataset.week}">
                    <td colspan="3">${chrome.i18n.getMessage('weektotals_week_total')}</td>
                    <td colspan="2" class="week-total"/>
                </tr>
            `));
        });

        this.updateTotals($container);

        $container.on('blur', 'input', () => setTimeout(() => this.updateTotals($container), 500));
        $(document).on('click', () => this.updateTotals($container));
    }

    unload() {
        $('.week-total-row, .month-total-row').remove();
    }

    updateTotals($container) {
        let weekSum = moment.duration();
        let monthSum = moment.duration();

        $container.find('tr.day').each((i, row) => {
            const dayTotal = getDayLoggedTime($(row));
            weekSum.add(dayTotal);
            monthSum.add(dayTotal);

            if (row.dataset.weekday === 'SUNDAY' || $(row).is('.day:last')) {
                $(`.week-total-row[data-week=${row.dataset.week}] > .week-total`).text(formatTime(weekSum));
                weekSum = moment.duration();
            }
        });

        $('.month-total-row > .month-total').text(formatTime(monthSum));
    }

}());
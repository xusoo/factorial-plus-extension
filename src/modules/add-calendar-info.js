/**
 * Adds useful information to each calendar row like:
 * <tr class="day" data-day="13" data-week="20" data-weekday="MONDAY"/>
 * So then, from other modules, we can just do `row.dataset.day` or `$(row).data('weekday')`
 */
Extension.Modules.register({
    name: 'add-calendar-info',
    paths: [`/attendance/clock-in/`],
    requiresElement: 'table'
}, new class {

    load($container) {
        $container.find('tbody > tr').each((i, row) => {
            const day = $(row).addClass('day').find('span')[0].textContent.match(/(\d+) [a-z]{3}/i)[1]; // 19 Sep
            if (day) {
                $(row).addClass('day');
                const moment = selectedMonth().date(day);
                row.dataset.day = moment.date();
                row.dataset.week = moment.isoWeek();
                row.dataset.weekday = moment.format('dddd').toUpperCase();
            }
        });
    }
}());

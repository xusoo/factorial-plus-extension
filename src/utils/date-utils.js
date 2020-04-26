function formatTime(duration) {
    return `${Math.floor(duration.asHours())}h ${duration.minutes()}m`;
}

function formatTimeWithSeconds(duration) {
    const hours = Math.floor(duration.asHours());
    return (hours > 0 ? `${hours}h ` : '') + `${duration.minutes()}m ${duration.seconds()}s`;
}

function parseTime(time) {
    const asMoment = moment(time, 'H[h] m[m]');
    return moment.duration({ hours: asMoment.hours(), minutes: asMoment.minutes() });
}

function selectedMonth() {
    const [, year, month] = /.*(\d{4})\/(\d{1,2})/.exec(window.location.href);
    return moment({ year, month: month - 1, hour: 0, minutes: 0 });
}

function getDayLoggedTime($day) {
    return parseTime($day.find('td:nth-child(4) span').text())
}

function isCurrentMonth() {
    return selectedMonth().isSame(moment(), 'month');
}

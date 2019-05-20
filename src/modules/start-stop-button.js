Extension.Modules.register({
    name: 'start-stop-button',
    paths: [`/attendance/clock-in/`],
    requiresElement: '[class^="tableContainer__"],[class^="emptyList__"]',
    stylesheet: 'styles/start-stop-button.css'
}, new class {

    load($container) {

        if (!isCurrentMonth()) {
            return;
        }

        $('.medium[class^=header]').append($(`
            <div class="start-stop-component">
                <span class="start-stop-label"/>
                <button class="start-stop-button"/>
            </div>
        `));

        $('.start-stop-button').on('click', this.startStop.bind(this));

        this.$todayRow = $container.find('tr[class*="selected__"]');
        this.$todayRow.on('input', 'input', this.updateComponent.bind(this));
        $(document).on('click', this.updateComponent.bind(this));

        this.updateComponent();
        setInterval(this.updateComponent.bind(this), 1000);
    }

    unload() {
        $('.start-stop-component').remove();
    }

    updateComponent() {
        const $component = $('.start-stop-component');
        const $label = $component.find('.start-stop-label');
        const $button = $component.find('.start-stop-button').attr('disabled', false);

        const openShifts = this.findOpenShifts();
        if (openShifts.length) {
            const shiftStart = this.inputAsMoment(openShifts[0].startInput);
            const diff = moment.duration(moment().diff(shiftStart));
            if (diff.asMilliseconds() < 0) {
                $label.text('');
                $button.text(chrome.i18n.getMessage('startstopbutton_invalid')).attr('disabled', true);
                return;
            }
            const time = getDayLoggedTime(this.$todayRow).add(diff);
            $label.text(formatTimeWithSeconds(time));
            $button.addClass('running').text(chrome.i18n.getMessage('startstopbutton_stop'));
        } else {
            $label.text('');
            $button.removeClass('running').text(chrome.i18n.getMessage('startstopbutton_start'));
        }
    }

    findOpenShifts() {
        return this.getShifts(this.$todayRow).filter(shift => shift.startInput.val() && !shift.endInput.val());
    }

    findEmptyShifts() {
        return this.getShifts(this.$todayRow).filter(shift => !shift.startInput.val() && !shift.endInput.val());
    }

    getShifts($row) {
        const shifts = $row.find('[class^=shiftFormLayout__]');
        return $.map(shifts, shift => {
            return {
                startInput: $(shift).find('input:first'),
                endInput: $(shift).find('input:last')
            };
        });
    }

    inputAsMoment(timeInput) {
        return moment(timeInput.val(), 'HH:mm');
    }

    startStop() {
        const value = moment().format('HH:mm');

        const openShifts = this.findOpenShifts();
        const emptyShifts = this.findEmptyShifts();
        if (openShifts.length) {
            this.changeInputValue(openShifts[0].endInput, value);
        } else if (emptyShifts.length) {
            this.changeInputValue(emptyShifts[0].startInput, value);
        } else {
            const shift = this.createNewShift();
            this.changeInputValue(shift.startInput, value);
        }
    }

    createNewShift() {
        this.$todayRow.find('[class^=shift__] button').click();
        return this.getShifts(this.$todayRow).pop();
    }

    changeInputValue($input, value) {
        const nativeInput = $input[0];
        nativeInput.value = value;
        nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Force save event
        nativeInput.dispatchEvent(new Event('blur', { bubbles: true }))
    }

}());
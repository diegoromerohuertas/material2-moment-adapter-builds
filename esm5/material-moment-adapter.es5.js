/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, NgModule, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DATE_LOCALE_PROVIDER } from '@angular/material';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import * as _rollupMoment from 'moment';
import _rollupMoment__default from 'moment';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// TODO(mmalerba): See if we can clean this up at some point.
var moment = _rollupMoment__default || _rollupMoment;
/**
 * Creates an array and fills it with values.
 * @template T
 * @param {?} length
 * @param {?} valueFunction
 * @return {?}
 */
function range(length, valueFunction) {
    var /** @type {?} */ valuesArray = Array(length);
    for (var /** @type {?} */ i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
/**
 * Adapts Moment.js Dates for use with Angular Material.
 */
var MomentDateAdapter = (function (_super) {
    __extends(MomentDateAdapter, _super);
    /**
     * @param {?} dateLocale
     */
    function MomentDateAdapter(dateLocale) {
        var _this = _super.call(this) || this;
        _this.setLocale(dateLocale || moment.locale());
        return _this;
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    MomentDateAdapter.prototype.setLocale = function (locale) {
        var _this = this;
        _super.prototype.setLocale.call(this, locale);
        var /** @type {?} */ momentLocaleData = moment.localeData(locale);
        this._localeData = {
            firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
            longMonths: momentLocaleData.months(),
            shortMonths: momentLocaleData.monthsShort(),
            dates: range(31, function (i) { return _this.createDate(2017, 0, i + 1).format('D'); }),
            longDaysOfWeek: momentLocaleData.weekdays(),
            shortDaysOfWeek: momentLocaleData.weekdaysShort(),
            narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
        };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getYear = function (date) {
        return this.clone(date).year();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getMonth = function (date) {
        return this.clone(date).month();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getDate = function (date) {
        return this.clone(date).date();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getDayOfWeek = function (date) {
        return this.clone(date).day();
    };
    /**
     * @param {?} style
     * @return {?}
     */
    MomentDateAdapter.prototype.getMonthNames = function (style) {
        // Moment.js doesn't support narrow month names, so we just use short if narrow is requested.
        return style == 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
    };
    /**
     * @return {?}
     */
    MomentDateAdapter.prototype.getDateNames = function () {
        return this._localeData.dates;
    };
    /**
     * @param {?} style
     * @return {?}
     */
    MomentDateAdapter.prototype.getDayOfWeekNames = function (style) {
        if (style == 'long') {
            return this._localeData.longDaysOfWeek;
        }
        if (style == 'short') {
            return this._localeData.shortDaysOfWeek;
        }
        return this._localeData.narrowDaysOfWeek;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getYearName = function (date) {
        return this.clone(date).format('YYYY');
    };
    /**
     * @return {?}
     */
    MomentDateAdapter.prototype.getFirstDayOfWeek = function () {
        return this._localeData.firstDayOfWeek;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.getNumDaysInMonth = function (date) {
        return this.clone(date).daysInMonth();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.clone = function (date) {
        return date.clone().locale(this.locale);
    };
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.createDate = function (year, month, date) {
        // Moment.js will create an invalid date if any of the components are out of bounds, but we
        // explicitly check each case so we can throw more descriptive errors.
        if (month < 0 || month > 11) {
            throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
        }
        if (date < 1) {
            throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
        }
        var /** @type {?} */ result = moment.utc({ year: year, month: month, date: date }).locale(this.locale);
        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid()) {
            throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
        }
        return result;
    };
    /**
     * @return {?}
     */
    MomentDateAdapter.prototype.today = function () {
        return moment.utc().locale(this.locale);
    };
    /**
     * @param {?} value
     * @param {?} parseFormat
     * @return {?}
     */
    MomentDateAdapter.prototype.parse = function (value, parseFormat) {
        if (value && typeof value == 'string') {
            return moment.utc(value, parseFormat, this.locale);
        }
        return value ? moment.utc(value).locale(this.locale) : null;
    };
    /**
     * @param {?} date
     * @param {?} displayFormat
     * @return {?}
     */
    MomentDateAdapter.prototype.format = function (date, displayFormat) {
        date = this.clone(date);
        if (!this.isValid(date)) {
            throw Error('MomentDateAdapter: Cannot format invalid date.');
        }
        return date.format(displayFormat);
    };
    /**
     * @param {?} date
     * @param {?} years
     * @return {?}
     */
    MomentDateAdapter.prototype.addCalendarYears = function (date, years) {
        return this.clone(date).add({ years: years });
    };
    /**
     * @param {?} date
     * @param {?} months
     * @return {?}
     */
    MomentDateAdapter.prototype.addCalendarMonths = function (date, months) {
        return this.clone(date).add({ months: months });
    };
    /**
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    MomentDateAdapter.prototype.addCalendarDays = function (date, days) {
        return this.clone(date).add({ days: days });
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.toIso8601 = function (date) {
        return this.clone(date).format();
    };
    /**
     * @param {?} iso8601String
     * @return {?}
     */
    MomentDateAdapter.prototype.fromIso8601 = function (iso8601String) {
        var /** @type {?} */ d = moment.utc(iso8601String, moment.ISO_8601).locale(this.locale);
        return this.isValid(d) ? d : null;
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    MomentDateAdapter.prototype.isDateInstance = function (obj) {
        return moment.isMoment(obj);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    MomentDateAdapter.prototype.isValid = function (date) {
        return this.clone(date).isValid();
    };
    MomentDateAdapter.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    MomentDateAdapter.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_LOCALE,] },] },
    ]; };
    return MomentDateAdapter;
}(DateAdapter));

var MAT_MOMENT_DATE_FORMATS = {
    parse: {
        dateInput: 'l',
    },
    display: {
        dateInput: 'l',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

var MomentDateModule = (function () {
    function MomentDateModule() {
    }
    MomentDateModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        MAT_DATE_LOCALE_PROVIDER,
                        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
                    ],
                },] },
    ];
    /**
     * @nocollapse
     */
    MomentDateModule.ctorParameters = function () { return []; };
    return MomentDateModule;
}());
var MatMomentDateModule = (function () {
    function MatMomentDateModule() {
    }
    MatMomentDateModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MomentDateModule],
                    providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatMomentDateModule.ctorParameters = function () { return []; };
    return MatMomentDateModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MomentDateModule, MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS };
//# sourceMappingURL=material-moment-adapter.es5.js.map

/**
 * Created by ovidiudanielbarba on 27/04/2017.
 */


module.exports = {
    isHourly: function (window) {
        return window === 3600;
    },

    isDaily: function (window) {
        return window === 3600 * 24;
    },

    isWeekly: function (window) {
        return window === 3600 * 24 * 7;
    }

};
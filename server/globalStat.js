
/**
 * Test data to show on dashboard.
 * As new values arrive, the test ones are UPDATED
 * by updateGlobalConsumption
 */
var globalStatLabelsMinutes = ['14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32','14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32',
    '14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32',
    '14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32',
    '14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32',
    '14:22','14:23','14:24','14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32'];
var globalStatDataMinutes = [100,120,130,140,150,160,170,180,190,200,100,120,130,140,150,160,170,180,190,200,100,120,130,140,150,160,170,180,190,200,100,120,180,170,
    100,120,130,140,150,160,170,180,190,200,100,120,130,140,150,160,170,180,190,200,100,120,180,170,120,110,100,100,120,180,80,60];

var globalStatLabelsHours = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
var globalStatDataHours = [100,120,130,140,150,160,170,180,190,200,100,120,130,140,150,160,170,180,190,200,100,120,180,170,100];

var globalStatLabelsDays = ["M","T","W","T","F","S","S"];
var globalStatDataDays = [180,190,200,100,120,130,140];



module.exports = {
    update: updateGlobalConsumption,
    getMinStat: function () {
        return {
            globalDataMin: globalStatDataMinutes,
            globalLabelsMin : globalStatLabelsMinutes
        }
    },
    getHourStat: function () {
        return {
            globalDataHour: globalStatDataHours,
            globalLabelsHour : globalStatLabelsHours
        }
    },
    getDayStat: function () {
        return {
            globalDataDay : globalStatDataDays,
            globalLabelsDay : globalStatLabelsDays
        }
    }
};


/**
 * update (based on window_length),
 * values regarding hourly,daily and weekly
 * consumption values based on new json message
 * statGlobal
 * @param statGlobal json message containing statistics
 *                  about consumption
 */
function updateGlobalConsumption(statGlobal) {

    switch (statGlobal.window_length){
        case 3600: // 1 hour
            updateStatMin(statGlobal);
            break;
        case 3600 * 24: // 1 day
            updateStatHour(statGlobal);
            break;
        case 3600 * 24 * 7: // 1 week
            updateStatDay(statGlobal);
            break;
        default:
            updateStatMin(statGlobal);
            console.log("Window length too small!");
            break;
    }

}

/**
 * removes if necessary last added values
 * as to keep only daily statistics of only
 * the last 7 days
 * @param statGlobal
 */
function updateStatDay(statGlobal) {
    var last = globalStatLabelsDays[globalStatLabelsDays.length - 1];
    if(last === composeDayLabel(statGlobal)){
        return;
    } else {
        if (globalStatLabelsDays.length === 7) {
            globalStatLabelsDays.splice(0, 1);
            globalStatDataDays.splice(0, 1);
        }

        globalStatLabelsDays.push(composeDayLabel(statGlobal));
        globalStatDataDays.push(Number(statGlobal.consumption));
    }

}

function composeDayLabel(statGlobal) {
    return String(statGlobal.timestamp.date.day + '/' + statGlobal.timestamp.date.month);
}


/**
 * removes if necessary last added values
 * as to keep only hourly statistics of only
 * the last 24 hours
 * @param statGlobal json message
 */
function updateStatHour(statGlobal) {
    var last = globalStatLabelsHours[globalStatLabelsHours.length - 1];
    if(last === String(statGlobal.timestamp.time.hour)){ // no change
        return;
    } else {

        if (globalStatLabelsHours.length === 24) {
            globalStatLabelsHours.splice(0, 1);
            globalStatDataHours.splice(0, 1);
        }

        globalStatLabelsHours.push(String(statGlobal.timestamp.time.hour));
        globalStatDataHours.push(Number(statGlobal.consumption));
    }
}


/**
 * removes if necessary last added values
 * as to keep only last hour (last 60 min) statistics
 * about consumption
 * @param statGlobal
 */
function updateStatMin(statGlobal) {
    if(globalStatLabelsMinutes.length === 60){
        // remove first element
        globalStatLabelsMinutes.splice(0,1);
        globalStatDataMinutes.splice(0,1);
    }

    globalStatLabelsMinutes.push(composeMinLabel(statGlobal));
    globalStatDataMinutes.push(Number(statGlobal.consumption));

}

function composeMinLabel(statGlobal) {
    return String(statGlobal.timestamp.time.hour + ':' + statGlobal.timestamp.time.minute);
}

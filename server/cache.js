/**
 * Created by ovidiudanielbarba on 27/04/2017.
 */

var redis = require('redis');
var flow = require('nimble');
var cron = require('cron');

var keys = require('./const/cacheKeys');
var utils = require('./utils');
var config = require('./config/config');
var rk = require('./const/routingKeys');
var stat = require('./lampStatistics');
var globalstat = require('./globalStat');


/* create redis connection */
var db = redis.createClient(config.REDIS_PORT,config.REDIS_HOST);


module.exports = {
    put: putInCache,
    getLampStat: function () {
        return stat.finalLampList();
    },
    getStreetStat: function () {
        return stat.finalStreetList();
    },
    getAnomalyLamps: function () {
      return stat.lampAnomalies();
    },
    getTotalLampsCount: function () {
        return stat.lampsCount().total;
    },
    getAnomalyLampsCount: function () {
        return stat.lampsCount().anomalies;
    },
    getWorkingLampsCount: function () {
        return stat.lampsCount().working;
    },
    getTotalStreetsCount: function () {
        return stat.streetCount().total;
    },
    getRanking: function () {
        return stat.ranking();
    },
    getGlobalMinStat: function () {
        return globalstat.getMinStat();
    },
    getGlobalHourStat: function () {
        return globalstat.getHourStat();
    },
    getGlobalDailyStat: function () {
        return globalstat.getDayStat();
    }
};



/**
 * define and start periodic jobs to update
 * consumption statistics, anomalies, ranking
 * about lamps and related streets
 */
var lampStatJob = cron.job('*/30 * * * * *',updateLampStat,true);
lampStatJob.start();

var lampListFillJob = cron.job('*/50 * * * * *',updateLampList,true);
lampListFillJob.start();

var streetStatJob = cron.job('*/20 * * * * *', updateStreetStat,true);
streetStatJob.start();

var streetListFillJob = cron.job('*/30 * * * * *', updateStreetList,true);
streetListFillJob.start();

var lampAnomalyJob = cron.job('*/10 * * * * *', updateLampAnomalies,true);
lampAnomalyJob.start();


/**
 * update lamps with relative anomalies
 */
function updateLampAnomalies() {

    db.smembers(keys.ANOMALY_LAMPS_ID_KEY,function (err,list) {

        /* update lamps count (working and with anomalies) */
        stat.setAnomalyLampsCount(list.length);

        var tempList = [];

        list.forEach(function (element) {

            db.get(keys.ANOMALY_LAMPS_ID_KEY + String(element),function (err,lamp) {
                tempList.push(lamp);
            });

            /* update list only if last element has been processed */
            if(list.indexOf(element) === list.length - 1){
                stat.setLampAnomalies(list);
            }
        });

    });
}


/**
 * fill (if available) street statistics regarding
 * specific temporal periods (last hour,day,week)
 * and push on a list to update it
 */
function updateStreetList() {

    var strStat = stat.streetStat();

    /* temporary support list */
    var tempList = [];

    strStat.statHour.forEach(function (ele) {
        var street = {
            name: "NO DATA",
            hour: 0,
            day: 0,
            week: 0
        };

        var parsed = JSON.parse(ele);

        var name = parsed.street;
        street.name = name;
        street.hour = parsed.consumption;

        strStat.statDay.filter(function (e) {
            var p1 = JSON.parse(e);
            return p1.street === name;
        }).forEach(function (el) {
            street.day = el.consumption;
        });

        strStat.statWeek.filter(function (e) {
            var p2 = JSON.parse(e);
            return p2.street === name;
        }).forEach(function (el) {
            street.week = el.consumption;
        });
        tempList.push(street);

        /* set updated street list only if only all elements have been processed */
        if(strStat.statHour.indexOf(ele,0) === strStat.statHour.length - 1){
            stat.setStreetList(tempList);
        }
    });
    
}

function updateStreetStat() {

    stat.updateStreetStat( fillStatArrays(keys.STATISTICS_STREET_NAME_KEY) );
}


/**
 * update street or lamp total count
 * @param list to take length from
 * @param key streets or lamps
 */
function updateCount(list, key) {
    switch (key){
        case keys.STATISTICS_LAMPS_ID_KEY:
            /* update total number of lamps */
            stat.setTotalLamps(list.length);
            break;
        case keys.STATISTICS_STREET_NAME_KEY:
            /* update total number of streets */
            stat.setTotalStreets(list.length);
            break;
    }

}
/**
 * fills arrays with periodic statistics (hour,day,week)
 * based on key (LAMP ID, STREET NAME)
 * @param key used in REDIS saving
 * @returns {{statHour: Array, statDay: Array, statWeek: Array}}
 */
function fillStatArrays(key) {

    /* temp arrays to later update statistics */
    var temp = {
        statHour: [],
        statDay: [],
        statWeek: []
    };

    db.smembers(key, function (err, list) {

        updateCount(list,key);

        list.forEach(function(ele){

            db.get(key + keys.HOURLY_KEY + String(ele),function (err,resp) {
                if(resp !== null) {
                    temp.statHour.push(resp);
                }
            });
            db.get(key + keys.DAILY_KEY + String(ele),function (err,resp) {
                if(resp !== null) {
                    temp.statDay.push(resp);
                }
            });

            db.get(key + keys.WEEKLY_KEY + String(ele),function (err,resp) {
                if(resp !== null) {
                    temp.statWeek.push(resp);
                }
            });
        });

    });

    return temp;
}


/**
 * fill (if available) lamp statistics regarding
 * specific temporal periods (last hour,day,week)
 * and push on a list to update it
 */
function updateLampList() {

    var lpStat = stat.lampsStat();

    /* temporary support list */
    var tempList = [];

    lpStat.statHour.forEach(function (eleHour) {
        /* lamp stat template obj */
        var lamp = {
            id: 0, address: "NO DATA",
            hour: 0, day : 0, week: 0};

        var parsed = JSON.parse(eleHour);
        var id = parsed.id;
        lamp.id = id;
        lamp.address = parsed.street;
        lamp.hour = parsed.consumption;


        lpStat.statDay.filter(function (e) {
            var p1 = JSON.parse(e);
            return p1.id === id;
        }).forEach(function (e) {
            lamp.day = e.consumption;
        });

        lpStat.statWeek.filter(function (e) {
            var p2 = JSON.parse(e);
            return p2.id === id;
        }).forEach(function (el) {
            lamp.week = el.consumption;
        });

        tempList.push(lamp);

        /* set updated street list only if only all elements have been processed */
        if(lpStat.statHour.indexOf(eleHour,0) === lpStat.statHour.length - 1){
            stat.setLampList(tempList);
        }
    });

}

/**
 * update lamp statistics
 */
function updateLampStat() {

    stat.updateLampStat( fillStatArrays(keys.STATISTICS_LAMPS_ID_KEY) );
}

/**
 * insert ranking data in Redis
 * @param data parsed ranking obj
 */
function setRanking(data) {

    db.set(keys.STATISTICS_GLOBAL_KEY, JSON.stringify(data), cacheLog);

    /* update in-memory list of lamps ranked by lifetime */
    stat.setRanking(data);
}


/**
 * put message in cache based on its routing key
 * @param msg
 */
function putInCache(msg) {

    var routingKey = msg.fields.routingKey;
    /* parsed message */
    var data = JSON.parse(msg.content.toString());

    switch (routingKey){

        /* dashboard.anomalies */
        case rk.ANOMALIES:
            insertAnomaly(data);
            break;

        /* dashboard.rank */
        case rk.RAKING:
            setRanking(data);
            break;

        /* dashboard.statistics.lamps */
        case rk.STAT_LAMPS:
            insertLampStatistics(data);
            break;

        /* dashboard.statistics.streets */
        case rk.STAT_STREETS:
            insertStreetStatistics(data);
            break;

        /* dashboard.statistics.global */
        case rk.STAT_GLOBAL:
            /* update in memory values
               (latest ones only are kept) */
            globalstat.update(data);
            insertGlobalStatistics(data);
            break;

    }
}

/**
 * insert global statistics into REDIS
 * with relative period key (HOURLY,DAILY,WEEKLY)
 * based on the window (period of statistic calculation)
 * length; if value is already present, UPDATE the value
 * @param data parsed JSON global statistics message
 */
function insertGlobalStatistics(statGlobal) {

    const window = data.window_length;

    if(utils.isHourly(window)){

        db.set(keys.STATISTICS_GLOBAL_KEY + keys.HOURLY_KEY,
            JSON.stringify(data), cacheLog);

    } else if(utils.isDaily(window)){

        db.set(keys.STATISTICS_GLOBAL_KEY + keys.DAILY_KEY,
            JSON.stringify(data), cacheLog);

    } else if(utils.isWeekly(window)){

        db.set(keys.STATISTICS_GLOBAL_KEY + keys.WEEKLY_KEY ,
            JSON.stringify(data), cacheLog);
    }

}


/**
 * insert street statistics into REDIS
 * with relative period key (HOURLY,DAILY,WEEKLY)
 * based on the window (period of statistic calculation)
 * length; if name is already present, UPDATE the value
 * @param data parsed JSON street statistics message
 */
function insertStreetStatistics(data) {

    const name = String(data.street);
    db.sadd(keys.STATISTICS_STREET_NAME_KEY, name, cacheLog);

    const window = data.window_length;

    if(utils.isHourly(window)){

        db.set(keys.STATISTICS_STREET_NAME_KEY + keys.HOURLY_KEY + name,
            JSON.stringify(data), cacheLog);

    } else if(utils.isDaily(window)){

        db.set(keys.STATISTICS_STREET_NAME_KEY + keys.DAILY_KEY + name,
            JSON.stringify(data), cacheLog);

    } else if(utils.isWeekly(window)){

        db.set(keys.STATISTICS_STREET_NAME_KEY + keys.WEEKLY_KEY + name,
            JSON.stringify(data), cacheLog);
    }
}

/**
 * insert lamp statistics into REDIS
 * with relative period key (HOURLY,DAILY,WEEKLY)
 * based on the window (period of statistic calculation)
 * length; if ID is already present, UPDATE the value
 * @param data parsed JSON lamp statistics message
 */
function insertLampStatistics(data) {

    const ID = String(data.id);
    db.sadd(keys.STATISTICS_LAMPS_ID_KEY, ID, cacheLog);

    const window = data.window_length;

    /* insert strigified object with different keys based on window length */
    if(utils.isHourly(window)){

        db.set(keys.STATISTICS_LAMPS_ID_KEY + keys.HOURLY_KEY + ID,
            JSON.stringify(data), cacheLog);

    } else if(utils.isDaily(window)){

        db.set(keys.STATISTICS_LAMPS_ID_KEY + keys.DAILY_KEY + ID,
            JSON.stringify(data), cacheLog);

    } else if(utils.isWeekly(window)){

        db.set(keys.STATISTICS_LAMPS_ID_KEY + keys.DAILY_KEY + ID,
            JSON.stringify(data), cacheLog);

    }
}

/**
 * insert anomaly message into Redis
 * with relative key to allow later retrieval;
 * if already present, it's updated
 * @param data parsed JSON message
 */
function insertAnomaly(data) {

    const ID = String(data.streetLamp.ID);
    /* insert lamp ID into relative set (now allowing duplicates) */
    db.sadd(keys.ANOMALY_LAMPS_ID_KEY, ID, cacheLog);

    /* insert (K,V) with K = const + lamp ID and V = message as String */
    db.set(keys.ANOMALY_LAMPS_ID_KEY + ID, JSON.stringify(data));

}

/**
 * basic logging function for cache
 * putting and getting
 * @param err error
 * @param resp response when operation completed
 */
function cacheLog(err, resp) {
    if(err){
        console.log(err);
        return;
    }
    console.log(resp);
}
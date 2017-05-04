/**
 * Created by ovidiudanielbarba on 27/04/2017.
 */


/**
 * defines topic routing keys for
 * Rabbit pub/sub subscription
 */
module.exports = {
    ANOMALIES: "dashboard.anomalies",
    RAKING: "dashboard.rank",
    STAT_LAMPS: "dashboard.statistics.lamps",
    STAT_STREETS: "dashboard.statistics.streets",
    STAT_GLOBAL: "dashboard.statistics.global"
};
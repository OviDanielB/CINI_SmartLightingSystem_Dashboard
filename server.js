

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create app with express
    var morgan = require('morgan');                         // log requests to the console (express4)
    var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
    var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)


    /**
     * stores values into REDIS
     * and responds to queries (like consumption statistics,
     * lamp anomalies, etc)
     */
    var cache = require('./server/cache');

    /**
     * connects to rabbit queue
     */
    var rabbit = require('./server/rabbit');

    /**
     * start a rabbit consumer which writes to REDIS
     * using the cache module
     */
    rabbit.consume(cache);


    // configuration =================
    app.use(express.static(__dirname + "/dist"));                   // set the static files location /dist for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


    /**
     * Defines routing for various HTTP GET
     * requests for lamps,anomalies,statistics,
     * etc. Response values are taken from cache module
     * and sent in json format
     */
    app.get("/api/lamps",              function (req,res) { res.json( cache.getAnomalyLamps());       });
    app.get("/api/ranking",            function (req,res) { res.json( cache.getRanking());            });
    app.get("/api/totalLamps",         function (req,res) { res.json( cache.getTotalLampsCount());    });
    app.get("/api/statistics/lamps",   function (req,res) { res.json( cache.getLampStat());           });
    app.get("/api/statistics/streets", function (req,res) { res.json( cache.getStreetStat());         });
    app.get('/api/workingLamps',       function (req,res) { res.json( cache.getWorkingLampsCount());  });
    app.get('/api/anomalyLamps',       function (req,res) { res.json( cache.getAnomalyLampsCount());  });
    app.get('/api/totalStreets',       function (req,res) { res.json( cache.getTotalStreetsCount());  });
    app.get('/api/globalStatMin',      function (req,res) { res.json( cache.getGlobalMinStat());      });
    app.get('/api/globalStatHour',     function (req,res) { res.json( cache.getGlobalHourStat());     });
    app.get('/api/globalStatDay',      function (req,res) { res.json( cache.getGlobalDailyStat());    });
    app.get('/api/stat/lamps',         function (req,res) { res.json( cache.getLampStat());           });
    app.get('/api/stat/streets',       function (req,res) { res.json( cache.getStreetStat());         });

    /**
     * start app on port 8080
     */
    app.listen(8080);

# Dashboard for [HELIOS](https://github.com/OviDanielB/CINI_SmartLightingSystem) System
This repository contains a [AngularJS](https://angularjs.org/) dashboard (both server side and client side) for **[HELIOS](https://github.com/OviDanielB/CINI_SmartLightingSystem)**.
The server side is a [NodeJS](https://nodejs.org/en/) app using the [Express](https://expressjs.com/) Framework which listens on a [RabbitMQ](https://www.rabbitmq.com/) queue for messages sent from
the HELIOS System, stores the in [Redis](https://redis.io/) and responds to AJAX calls from the Angular app on the client.The dashboard 
illustrates information on HELIOS such as:
* Lamp count (total, working, with anomalies)
* Total streets count
* Lamps not working correctly with relative anomaly type, position and lamp model (in case substitution is needed)
* Individual lamp consumption statistics over different periods (last hour, day and week)
* Streets consumption statistics over different periods (last hour, day and week)
* Global (entire city) consumption statistics over different periods (last hour, day and week) presented on 3 different charts

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
The following software must be present to install the System and the related links shows how to install them:
###### Back-End
* [NodeJS](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine that uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.
* [npm](https://www.npmjs.com/) - Package manager for JavaScript and the world’s largest software registry


###### Front-End
* [AngularJS](https://angularjs.org/) - A JavaScript-based open-source front-end web application framework for developing single page applications.
* [Bower](https://bower.io/) - A package manager for the web.
* [gulp](http://gulpjs.com/) - An open-source JavaScript toolkit used as a streaming build system in front-end web development.


### Project Structure
Main project structure with relevant content only.
```
Dashboard
   |--bower_components (javascript libraries for front-end)
   |--css (css files)
   |--dist (present only after building for distribution with gulp, main dir for 
   .        serving static web content)
   .
   |--js (Angular controllers)
   .  |--controllers
   .         |--main.js (Angular controllers for index page)
   .
   .
   |--server (nodejs back-end modules like rabbit,redis connections,etc)
        |--config (configuration file)
        |--const (predefined constants like routing keys,cache saving keys)
        |--cache.js (main Redis insertion and retrieval module, used to respond
        .            to AJAX calls with specific queries)
        |--globalStat.js (stores and updates global consumption statistics)
        |--lampStatistics.js (stores and updates individual and aggregates of lamps 
        .                     consumption statistics )
        |--rabbit.js (connects to rabbit queue and passes messages to cache)    
        |--utils.js (utilities)
   |--views (static HTML files)
   .   |--main.html (main page HTML file)
   |--bower.json (front-end packages definition)
   |--gulpfile.js (building system instructions)
   |--index.html (main HTML page)
   .
   |--server.js (nodeJS app for back-end)

```

### Configuration
Configuration file can be found in *./server/config/config.js* and the following 
default connection parameters can be modified:

```
{
    REDIS_HOST: "localhost",
    REDIS_PORT: 6379,
    RABBIT_HOST: "amqp://localhost:5673",
    RABBIT_QUEUE_NAME: "dashboard",
    RABBIT_EXCHANGE_NAME: "dashboard_exchange"
}
```

### Web Page Building
First, download front-end JavaScript libraries and frameworks (AngularJS, CharJS) from the 
*bower.json* package file with
 ```
 bower install
 ```
 and a *bower_components* directory will be created with the relative JS files.
In the present state, the dashboard can't be served as a single web page. However you can start a 
web server offered by gulp by typing
 ```
 gulp serve
 ```
in the root project directory.This way, any change to any of the files of the dashboard are immediatly 
available on the browser at *localhost:3000*.
 If you want to build the entire web page and serve as any static content by any web server (in this case
 a NodeJS one) type
 ```
 gulp build:dist
 ```
 which will create (or overwrite if already present) a *dist* directory in which all the static content 
 will be present.
 
 ### Rabbit and Redis
 Before starting the NodeJS app ensure you have on the local machine a RabbitMQ queue
  listening on port 5673 and a Redis server on port 6379. If you don't start the relative Docker containers with 
  the ports open
   ```
   docker run -d --name redis -p 6379:6379 redis:alpine
   docker run -d --name rabbit_dashboard -p 5673:5672 -p 15673:15672 rabbitmq:alpine
   ```
   
  Use the alpine versions because they are light-weighted than the original versions because run on a 
  simplified and basic distribution of Linux.
 
 ### Node Start
 To start the server, you first need to install all node dependencies with
  ```
  npm install 
 ```
 which will create the  *node_component* directory.
 Then, in the root project directory type
  ```
  node server.js
 ```
and the node app will start listening on *localhost:8080* so the web page is available at that URL.
Alternatively, you can run the node app on a Docker container with
 ```
 docker run -d --name node -v "path/to/server.js:/server.js" node:alpine node /server.js 
 ```
 and can still be accessed on *localhost:8080*.
### Notes
* Once started, the dashboard has some predefined test values inserted (chart data, lamps info, streets info)
that are present only to show how the final values will be presented. Those values will be automatically removed 
by the app once real values are processed from the Rabbit queue on which it listens. Some data may take a while to be 
inserted. For example the global consumption weekly chart will be completely updated after a week because values are processed 
based on their timestamp. Default values can be removed in the file *./js/controllers/main.js* which controls the 
main dashboard page.

* Dashboard has been built from an open-source template [CoreUI](http://coreui.io/).


## Authors                                                                                          
                                                                                                    
* **Ovidiu Daniel Barba** - [OviDanielB](https://github.com/OviDanielB)                             
* **Laura Trivelloni** - [lauratrive](https://github.com/lauratrive)                                
* **Emanuele Vannacci** - [Zanna-94](https://github.com/Zanna-94)                                   
                                                                                                    
## License                                                                                          
                                                                                                    
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details  



 
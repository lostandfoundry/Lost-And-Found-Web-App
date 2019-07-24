## lostandfoundry - Complete End to End solution 

A complete Web Application implementing the lostandfound concept, built using the GrEBoN/NEBoN stack:-

Gr/N - GraphDB/Neo4j
E - ExpressJS
Bo - Bootstrap 
N - NodeJS

[![](https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg)](https://bluemix.net)
![Platform](https://img.shields.io/badge/platform-NODE-lightgrey.svg?style=flat)
![](https://img.shields.io/badge/build-passing-green.svg)

### Table of Contents
* [Requirements](#requirements)
* [Configuration](#configuration)
* [Run](#run)
* [Debug](#debug)



<a name="enablement"></a>
### IBM Cloud Enablement

<a name="requirements"></a>
### Requirements
#### Local Development Tools Setup (optional)

- Install the latest [NodeJS](https://nodejs.org/en/download/) 6+ LTS version.

#### IBM Cloud development tools setup (optional)

1. Install [IBM Cloud Developer Tools](https://console.bluemix.net/docs/cli/idt/setting_up_idt.html#add-cli) on your machine  
2. Install the plugin with: `bx plugin install dev -r bluemix`


#### IBM Cloud DevOps setup (optional)

[![Create Toolchain](https://console.ng.bluemix.net/devops/graphics/create_toolchain_button.png)](https://console.ng.bluemix.net/devops/setup/deploy/)

[IBM Cloud DevOps](https://www.ibm.com/cloud-computing/bluemix/devops) services provides toolchains as a set of tool integrations that support development, deployment, and operations tasks inside IBM Cloud. The "Create Toolchain" button creates a DevOps toolchain and acts as a single-click deploy to IBM Cloud including provisioning all required services. 

***Note** you must publish your project to [Github](https://github.com/) for this to work.



<a name="configuration"></a>
### Configuration

The project contains IBM Cloud specific files that are used to deploy the application as part of an IBM Cloud DevOps flow. The `.bluemix` directory contains files used to define the IBM Cloud toolchain and pipeline for your application. The `manifest.yml` file specifies the name of your application in IBM Cloud, the timeout value during deployment, and which services to bind to.

Service credentials are taken from the VCAP_SERVICES environment variable if running IBM Cloud Cloud Foundry, from individual environment variables per service if running on IBM Cloud Container Service (see ./server/config/mappings.json), or from a config file if running locally, named`./server/config/localdev-config.js`.


<a name="run"></a>
### Run
#### Using IBM Cloud development CLI
The IBM Cloud development plugin makes it easy to compile and run your application if you do not have all of the tools installed on your computer yet. Your application will be compiled with Docker containers. To compile and run your app, run:

```bash
bx dev build
bx dev run
```


#### Using your local development environment

The website can be run on a local server by following the steps given below:-

First, clone the repository in your desired directory, and navigate to it.

```git
git clone https://github.com/nimishbongale/lostandfoundry.git
cd yourdirectory
```
Make sure you have NodeJS installed on your system.
Install the node modules by running:-

```node
npm install
```

If you get an EAuth failure, open the command line/terminal as an adminitrator, or use sudo:-

```bash
sudo npm install
```
Now run the app using:-

```node
npm start
```

OR, alternatively

```node
node app
```
Open localhost:3000 on your preferred browser to view the app running. 


##### Session Store
You may see this warning when running `bx dev run`:
```
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
```
When deploying to production, it is best practice to configure sessions to be stored in an external persistence service.


<a name="debug"></a>
### Debug

#### Using IBM Cloud development CLI
To build and debug your app, run:
```bash
bx dev build --debug
bx dev debug
```


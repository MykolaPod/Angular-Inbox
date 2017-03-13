# `inboxApp` — the example project of building Inbox-like application  based on AngualrJS 1 technology.



## Getting Started

To get you started you can simply clone the `angular-inbox.git` repository and install the dependencies.

In order to use project you should run in from http://localhost:63342 or http://localhost:8000
Ypu can use 
```
#!javascript

 docker-compose build angular
 docker-compose up
```
commands
### Prerequisites

You need git to clone the `angular-inbox` repository. You can get git from [ here ](https://MykolaP@bitbucket.org/MykolaP/angular-inbox.git) .

You must have Node.js
and its package manager (npm) installed. You can get them from [here][node].

### Clone `angular-inbox`

Clone the `angular-inbox` repository using git:

```
git clone https://MykolaP@bitbucket.org/MykolaP/angular-inbox.git
cd angular-inbox
```

### Install Dependencies

There is two kinds of dependencies in this project: tools and Angular framework code. The tools help
 manage and test the application.

* We get the tools we depend upon via `npm`, the [Node package manager][npm].
* We get the Angular code via `bower`, a [client-side code package manager][bower].


We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`. After that, you should find out that you have
two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the Angular framework files



### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start
```

Now browse to the app at [`localhost:8000/index.html`][local-app-url].


### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static HTML, CSS and JavaScript files that need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via XHR or other means, you need to figure out
what is the best way to host the static files to comply with the same origin policy if applicable.
Usually this is done by hosting the files by the backend server or through reverse-proxying the
backend server(s) and web server(s).





## Contact

For more information on AngularJS please check out [angularjs.org][angularjs].


* [angularjs](https://angularjs.org/)
* [bower](http://bower.io/)
* [git](ttps://git-scm.com/)
* [http-server](https://github.com/indexzero/http-server)
* [jasmine](https://jasmine.github.io/)
* [jdk](https://wikipedia.org/wiki/Java_Development_Kit)
* [jdk-download](http://www.oracle.com/technetwork/java/javase/downloads)
* [karma](https://karma-runner.github.io/)
* [local-app-url](http://localhost:8000/index.html)
* [node](https://nodejs.org/)
* [npm](https://www.npmjs.org/)
* [protractor](http://www.protractortest.org/)
* [selenium](http://docs.seleniumhq.org/)
* [travis](https://travis-ci.org/)
* [travis-docs](https://docs.travis-ci.com/user/getting-started)
![logo](https://cdn.rawgit.com/deiwin/luncher-client/2d26172e6474a312618911f4064dbb5e98ddd8a1/public/img/luncher-logo-typo-black.svg "Luncher")

A client
=====
[![Code Climate](https://codeclimate.com/github/deiwin/luncher-client.png)](https://codeclimate.com/github/deiwin/luncher-client) [![Build Status](https://travis-ci.org/deiwin/luncher-client.svg)](https://travis-ci.org/deiwin/luncher-client) [![Coverage Status](https://coveralls.io/repos/deiwin/luncher-client/badge.png)](https://coveralls.io/r/deiwin/luncher-client) [![Selenium Test Status](https://saucelabs.com/buildstatus/deiwin)](https://saucelabs.com/u/deiwin)


## Development setup ##

To run the tests on your own machine you need to first install [node.js](nodejs.org). Once you have it installed just run:

    npm install -g grunt-cli
    git clone git@github.com:deiwin/luncher-client.git
    cd luncher-client
    npm install
    bower install
    grunt test

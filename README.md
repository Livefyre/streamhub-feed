# streamhub-feed

streamhub-feed is a StreamHub App that shows social content like comments, photos, and tweets in a simple feed.

## Getting Started

The quickest way to use streamhub-feed is to use the built version hosted on Livefyre's CDN.

### Dependencies

streamhub-feed depends on [streamhub-sdk](https://github.com/livefyre/streamhub-sdk). Ensure it's been included in your page.

	<script src="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.0.1-build.147/streamhub-sdk.min.gz.js"></script>

Include streamhub-feed too.

	<script src="http://cdn.livefyre.com/libs/apps/Livefyre/streamhub-feed/v0.0.0.build.1/streamhub-feed.min.js"></script>
	
Optionally, include some reasonable default CSS rules for StreamHub Content

    <link rel="stylesheet" href="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.0.1-build.147/streamhub-sdk.gz.css" />

### Usage

1. Require streamhub-sdk and streamhub-feed

        var Hub = Livefyre.require('streamhub-sdk'),
            FeedView = Livefyre.require('streamhub-feed');
    
2. Create a FeedView, passing the DOMElement to render in

        var feedView = new FeedView({
            el: document.getElementById('feed')
        });
    
3. An empty feed is no fun, so use the SDK to create a StreamManager for a Livefyre Collection

        var streamManager = Hub.StreamManager.create.livefyreStreams({
            network: "labs.fyre.co",
            siteId: 315833,
            articleId: 'example'
        });
    
4. And bind the streamManager to your feed and start it up

        streamManager.bind(feedView).start();

You now have a Feed! See this all in action on [this jsfiddle](http://jsfiddle.net/tr2R7/1/).

## Local Development

Instead of using a built version of streamhub-feed from Livefyre's CDN, you may wish to fork, develop on the repo locally, or include it in your existing JavaScript application.

Clone this repo

    git clone https://github.com/Livefyre/streamhub-feed

Development dependencies are managed by [npm](https://github.com/isaacs/npm), which you should install first.

With npm installed, install streamhub-feed's dependencies. This will also download [Bower](https://github.com/bower/bower) and use it to install browser dependencies.

    cd streamhub-feed
    npm install

This repository's package.json includes a helpful script to launch a web server for development

    npm start

You can now visit [http://localhost:8080/](http://localhost:8080/) to see an example feed loaded via RequireJS.

# StreamHub

[Livefyre StreamHub](http://www.livefyre.com/streamhub/) is used by the world's biggest brands and publishers to power their online Content Communities. StreamHub turns your site into a real-time social experience. Curate images, videos, and Tweets from across the social web, right into live blogs, chats, widgets, and dashboards. Want StreamHub? [Contact Livefyre](http://www.livefyre.com/contact/).
# streamhub-feed

[![Build Status](https://travis-ci.org/Livefyre/streamhub-feed.png)](https://travis-ci.org/Livefyre/streamhub-feed)

streamhub-feed is a StreamHub App that shows social content like comments, photos, and tweets in a simple feed.

## Getting Started

The quickest way to use streamhub-feed is to use the built version hosted on Livefyre's CDN.

Add Livefyre.js to your page

```html
<script src="http://cdn.livefyre.com/Livefyre.js"></script>
```

Make sure there is an element for the feed to render in

```html
<div id="feed"></div>
```

Now require Feed, construct, and get a Collection to pipe in

```html
<script>
Livefyre.require(['streamhub-feed#2.1.1', 'streamhub-sdk#2'],
function (Feed, SDK) {
    var feed = new Feed({
        el: document.getElementById('feed'),
    });
    var collection = new SDK.Collection({
        network: "labs.fyre.co",
        environment: "livefyre.com",
        siteId: "315833",
        articleId: 'livefyre-tweets'
    });
    collection.pipe(feed);
});
</script>
```

Check out this [live example](http://codepen.io/gobengo/pen/gIibE)

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

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
Livefyre.require(['streamhub-feed#2.12', 'streamhub-sdk#2'],
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

## Configuration

### `comparator` (Defaults to CREATEDAT_DESCENDING)

The sort order of content in the feed is determined by the comparator. The comparator option expects a comparator function that compares to Content instances.

```
var ListView = require('streamhub-sdk/views/list-view');

var feed = new Feed({
    el: document.getElementById('feed'),
    comparator: ListView.prototype.comparators.CREATEDAT_ASCENDING
});
```

### `queueInitial` (Defaults to 0)

The number of items to display in a thread of replies before being held by queue. In the case of streamhub-feed, new content is always held in queue via a "View more posts" button. This follows the progressive disclosure interaction design pattern. To override this behavior and enable real-time content to stream in dynamically, increase queueInitial.

```
var feed = new Feed({
    el: document.getElementById('feed'),
    queueInitial: 5 // Take 5 new content replies to display before subsequent new content is queued by "View more posts" button.
});
```

### `replying` (Defaults to True)

Whether to enable the ability to reply to content. This effectively makes the Feed application a read-only experience.

```
var feed = new Feed({
    el: document.getElementById('feed'),
    replying: False // Disable replying. Reply button is hidden.
});
```

### `hideReplies` (Defaults to True)

Whether to display replies of root-level content.

```
var feed = new Feed({
    el: document.getElementById('feed'),
    hideReplies: False // Only show root-level content. No replies.
});
```

### `contentViewFactory` (Defaults to streamhub-feed/content-view-factory)

The factory to create views that render each Content instance.

```
var feed = new Feed({
    el: document.getElementById('feed'),
    contentViewFactory: new require('streamhub-sdk/content/content-view-factory')() // Use Base Content View Factory from SDK
});
```

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

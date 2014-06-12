define(function(require) {
    var Collection = require('streamhub-sdk/collection');
    var View = require('streamhub-feed');

    return function(el) {
        var collection = new Collection({
            network: "labs.fyre.co",
            environment: "livefyre.com",
            siteId: "315833",
            articleId: 'livefyre-tweets'
        });
        var view = new View({el: el});
        
        collection.pipe(view);
  
        return view;
    };
});

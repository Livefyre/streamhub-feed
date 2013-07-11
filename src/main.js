define([
    'streamhub-sdk/jquery',
    'streamhub-sdk/stream-manager',
    'streamhub-sdk/clients/livefyre-auth-client',
    'streamhub-sdk/clients/livefyre-bootstrap-client',
    'streamhub-sdk/streams/livefyre-stream',
    'streamhub-sdk/streams/livefyre-reverse-stream'],
function ($, StreamManager, LivefyreAuthClient, LivefyreBootstrapClient, LivefyreStream, LivefyreReverseStream) {

    /**
     * Get a StreamManager that will later be bound to a Livefyre Collection. No HTTP requests
     * will be made until `.start()` is called.
     * @param opts {Object} Options to configure a Livefyre Stream with.
     * @param opts.network {string} The network name to configure.
     * @param opts.siteId {number} The site id to configure.
     * @param opts.articleId {string} The name of the article to configure.
     * @param opts.environment {?string} The name of the environment (prod/dev/uat/etc) to connect
     *        to. 
     * @returns {StreamManager} A stream manager, configured for use with livefyre's streaming
     *          platform.
     */
    var getLivefyreStreamManager = function (opts) {
        var streamManager = new StreamManager({});
        
        if (!opts instanceof Array || opts.length == 0) {
            return streamManager;
        }
        
        LivefyreAuthClient.getAuthData(opts[0], function(authErr, authData) {
            if (authErr) {
                return;
            }
            
            var profileId = authData.data.profile.id;

	        for (var i = 0; i < opts.length; i++) {
	            (function(opts) {
			        LivefyreBootstrapClient.getContent(opts, function(err, data) {
			            if (err) {
			                return;
			            }
	
			            if ($.inArray(profileId, data.meta.headDocument.followers) >= 0) {
				            var pages = data.archiveInfo.pageInfo;
				            var pageKeys = Object.keys(pages);
				            pageKeys.sort();
				            
				            var lastPageNum = pageKeys[pageKeys.length - 1];
				            var collectionId = data.collectionId;
				            var commentId = data.event;
				
				            var mainStream = new LivefyreStream($.extend({
				                collectionId: collectionId,
				                commentId: commentId
				            }, opts));
				            var reverseStream = new LivefyreReverseStream($.extend({
				                page: lastPageNum
				            }, opts));
				            
				            var streams = {};
				            streams["main_" + opts.articleId] = mainStream;
				            streams["reverse_" + opts.articleId] = reverseStream;
				            
				            streamManager.set(streams);
	                    }
			        });
		        })(opts[i]);
	        }
        });

        return streamManager;
    };

    /**
     * @exports streamhub-sdk/stream-helpers/livefyre-helper
     */
    StreamManager.addHelper(function(create) {
        create.livefyrePersonalizedStreamSet = getLivefyreStreamManager;
    });

    return getLivefyreStreamManager;
});


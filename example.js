define(function(require) {
    var Hub = require('streamhub-sdk');
    var StreamHelper = require('streamhub-personalized');
    var StreamManager = require('streamhub-sdk/stream-manager');
    var LivefyreStream = require('streamhub-sdk/streams/livefyre-stream');
    var View = require('streamhub-sdk/views/list-view');
    var LivefyreAuthClient = require('streamhub-sdk/clients/livefyre-auth-client');
    var LivefyreWriteClient = require('streamhub-sdk/clients/livefyre-write-client');

    return function(el) {
        var streamOpts = [{
            network: "labs-t402.fyre.co",
            environment: "t402.livefyre.com",
            siteId: "303827",
            articleId: 'sh_col_51_1366914813',
            title: 'Awesome Conv 1'
        },{
            network: "labs-t402.fyre.co",
            environment: "t402.livefyre.com",
            siteId: "303827",
            articleId: 'labs_demo_fire',
            title: 'Fire Demo'
        },{
            network: "labs-t402.fyre.co",
            environment: "t402.livefyre.com",
            siteId: "303827",
            articleId: 'labs_demo_social_baseball',
            title: 'Social Baseball'
        },{
            network: "labs-t402.fyre.co",
            environment: "t402.livefyre.com",
            siteId: "303827",
            articleId: 'sh_col_54_1367887407',
            title: 'Awesome Conv 2'
        }];
        
        var token = "";
        
        var view = new View({el: el});
        var streamManager = window.streamManager = new StreamManager({}).bind(view);
        var followsDiv = $('#follows');
        
        var followClick = function(ev) {
            var id = $(ev.target).attr('data-streamId');
            var stream = streamManager.get('main_' + id);
            
            if ($(ev.target).hasClass('follow')) {
                follow($(ev.target));
                LivefyreWriteClient.follow($.extend({lftoken: token}, stream.opts));
            } else {
                unfollow($(ev.target));
                LivefyreWriteClient.unfollow($.extend({lftoken: token}, stream.opts));
            }
        };

        var follow = function(link) {
            var id = link.attr('data-streamId');
            var stream = streamManager.get('main_' + id);
            stream.start();

            link.removeClass('follow');
            link.text('Unfollow');
            link.addClass('unfollow');
        };

        var unfollow = function(link) {
            var id = link.attr('data-streamId');
            var stream = streamManager.get('main_' + id);
            stream.stop();

            link.removeClass('unfollow');
            link.text('Follow');
            link.addClass('follow');
        };
        
        LivefyreAuthClient.getAuthData(streamOpts[0], function(authErr, authData) {
            var profileId = (((authData || {}).data || {}).profile || {}).id;
            token = (((authData || {}).data || {}).token || {}).value;
        
	        for (var i = 0; i < streamOpts.length; i++) {
	            var holder = $('<div></div>').text(streamOpts[i].title);
	                
	            var link = $('<a>Follow</a>')
	                .addClass('follow')
	                .click(followClick)
	                .attr('data-streamId', streamOpts[i].articleId)
	                .appendTo(holder);

	            (function(holder, link, opts) {
		            Hub.StreamManager.create.livefyreStreams(opts).on('add', function(name, stream) {
		                var processFollowers = function(streamIn) {
		                    if ($.inArray(profileId, streamIn.followers)) {
		                        follow(link);
		                    } else {
		                        unfollow(link);
		                    }
		                };
		                var followerStream = new LivefyreStream(stream);
		                followerStream.start();
		                followerStream.on('followers', function() {
		                    processFollowers(followerStream);
		                    stream.followers = follwerStream.followers;
		                    followerStream.stop();
		                });
		                stream.on('followers', processFollowers);
		                 
		                holder.appendTo(followsDiv);
		                streamManager.set(name + "_" + opts.articleId, stream);
		                
		                if (name == "main" && $.inArray(profileId, stream.followers)) {
		                   follow(link);
		                } else if (name == "reverse" && $.inArray(profileId, stream.followers)) {
                           stream.start();
                        }
		            });
	            }(holder, link, streamOpts[i]));
	        }
        });
        return view;
    };
});

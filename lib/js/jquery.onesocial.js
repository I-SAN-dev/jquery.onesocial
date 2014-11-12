/**
 * jQuery oneSocial
 * @author: Sebastian Antosch, I-SAN.de Webdesign & Hosting GbR
 * @copyright: Sebastian Antosch, 2014
 * @email: kontakt@i-san.de
 * @web: http://extensions.i-san.de
 * @license: GNU/GPL v2 or later
 */
(function ( $ ) {

    /*
     * Default settings
     */
    var defaults =
    {
        language: "en",
        loadAt: 'load', // 'load' => load APIs on window.onload  // 'ready' => load APIs on document.ready
        greeting: "defaultgreeting"
    };

    var settings = defaults;
    var readytoload = false;

    /*
     *  Saves the current API states
     */
    var apistate =
    {
        facebook: {
            requested: false,
            loading: false,
            loaded: false
        },
        googleplus:
        {
            requested: false,
            loading: false,
            loaded: false
        },
        twitter:
        {
            requested: false,
            loading: false,
            loaded: false
        }
    };

    /*
     * Here all render calls will be stored
     * Automatically add one renderqueue for each api declared in apistate
     */
    var renderQueue = {};
    $.each(apistate, function(key, value){
        renderQueue[key] = [];
    });





/*-------------------------------- This Block defines functionality for $.onesocial functions without dom element------------------------------------------------------*/

    /*
     * Setup - takes any set of settings and updates the settings
     * $.onesocial.setup({'...':'...'});
     */
    var onesocial = function(options)
    {
        // Aliases to default buttons at the end of body
        $('body').onesocial('', options);
    };

    /*
     * Makes it possible to update settings
     */
    onesocial.setup = function(options)
    {
            $.extend(settings, options);
    };

    /*
     * Initializes all APIS ------------------------------------------------
     */
    onesocial.initapi = function(options)
    {
        $.onesocial.initapi.facebook(options);
        $.onesocial.initapi.googleplus(options);
        $.onesocial.initapi.twitter(options);
    };

    /*
     * Initializes Facebook API
     */
    onesocial.initapi.facebook = function(options)
    {
        apistate.facebook.requested = true;
        checkAPIs();
    };

    /*
     * Initializes Google+ API
     */
    onesocial.initapi.googleplus = function(options)
    {
        apistate.googleplus.requested = true;
        checkAPIs();
    };

    /*
     * Initializes Twitter API
     */
    onesocial.initapi.twitter = function(options)
    {
        apistate.twitter.requested = true;
        checkAPIs();
    };

    $.extend({
        onesocial: onesocial
    });

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    /* Holds the element specific functions */
    var elem = {};

    /*
     * Default Button setup
     */
    elem.buttons = function(node, options)
    {
        var ls = localsettings(options);
        render(node, 'facebook', 'like', ls);
        render(node, 'googleplus', 'plusone', ls);
        render(node, 'twitter', 'tweet', ls);

    };

    /*------------------------------------------ Facebook Buttons ------------------------------------*/
    /*
     * Creates a facebook like button
     */
    elem.facebook_like = function(node, options) {
        var ls = localsettings(options);
        render(node, 'facebook', 'like', ls);
    };

    /*------------------------------------------ Googleplusbuttons Buttons ------------------------------------*/
    /*
     * Creates a google plusone button
     */
    elem.google_plusone = function(node, options) {
        var ls = localsettings(options);
        render(node, 'googleplus', 'plusone', ls);
    };

    /*------------------------------------------ Twitter Buttons ------------------------------------*/
    /*
     * Creates a twitter tweet button
     */
    elem.twitter_tweet = function(node, options) {
        var ls = localsettings(options);
        render(node, 'twitter', 'tweet', ls);
    };




    /*
     * onesocial function - aliases to default buttons or chosen buttons (see above)
     */
    $.fn.onesocial = function(identifier, options)    {

        if(identifier=='')
        {
            elem['buttons'](this, options);
        }
        else
        {
            elem[identifier](this, options);
        }
        return this;

    };




/*------------------------------------------------------------ Renderprocessing ---------------------------------------------------------------------------------------*/

    /*
     * Class RenderItem
     */
    var RenderItem = function(node, api, identifier, options)
    {
        this.node = node;
        this.api = api;
        this.identifier = identifier;
        this.options = options;
    };


    /*
     * Adds a new RenderItem to the api specific renderQueue
     */
    var render = function(node, api, identifier, options)
    {
        var ri = new RenderItem(node, api, identifier, options);

        apistate[api].requested = true;
        checkAPIs();
        renderQueue[api].push(ri);

        //Checks if there is something to render and renders it
        processRenderQueue();
    };

    /*
     * Processes the renderQueue
     */
    var processRenderQueue =  function()
    {
        // Loops through all APIs mentioned in renderQueue
        $.each(renderQueue, function(api, queue){
           // Check if somethings in the queue
            if(queue.length > 0)
            {
                //Check if api is loaded
                if(apistate[api].loaded)
                {
                    while(renderQueue[api].length > 0)
                    {
                        processRenderItem(renderQueue[api].shift());
                    }
                }
                else
                {
                    apistate[api].requested = true;
                    checkAPIs();
                }
            }
        });
    };


    /*
     * Processes  Render Items
     */
    processRenderItem = function(ri)
    {
        widget[ri.api][ri.identifier](ri.node, ri.options);
    };



/*------------------------------------------------------------ actually finally insertig the buttons -----------------------------------------------------------------------*/

    var widget = {};
    widget.facebook = {};
    widget.googleplus = {};
    widget.twitter = {};


    /* Facebook Widgets */
    widget.facebook.like = function(node, options)
    {

    };


    /* Googleplus Widgets */
    widget.googleplus.plusone = function(node, options)
    {

    };

    /* Twitter Widgets */
    widget.twitter.tweet = function(node, options)
    {
        var container = $('<div class="osoc osoc-twitter osoc-twitter-tweet"></div>');
        node.append(container);

        var url = 'https://dev.twitter.com';
        var twoptions =
        {

        };

        var button = $('<a class="twitter-share-button" href="https://twitter.com/share">Tweet</a>');
        container.append(button);

        node.each(function(){
            twttr.widgets.load(this);
        });
    };


/*------------------------------------------------------------ anonymous functions ---------------------------------------------------------------------------------------*/



    /*
     * Helper function: returns updated settings for current function
     */
    var localsettings = function(options)
    {
        return $.extend(true, {}, settings, options);
    };


    /*
     * Checks all APIs and loads them if necessary
     */
    var checkAPIs = function()
    {
        // Only will execute when page is ready to load the api
        if(readytoload == true)
        {
            if(apistate.facebook.requested && !apistate.facebook.loading && !apistate.facebook.loaded)
            {
                loadFacebookApi();
            }
            if(apistate.googleplus.requested && !apistate.googleplus.loading && !apistate.googleplus.loaded)
            {
                loadGoogleplusApi();
            }
            if(apistate.twitter.requested && !apistate.twitter.loading && !apistate.twitter.loaded)
            {
                loadTwitterApi();
            }
        }
    };

    /*
     * Loads the Facebook API
     */
    var loadFacebookApi = function()
    {
        /* Set loading */
        apistate.facebook.loading = true;

       //TODO Sprache!!
        var fbJsSrc = '//connect.facebook.net/en_UK/all.js';

        /* Facebook Platform Code */
        $.ajaxSetup({ cache: true });
        $.getScript(fbJsSrc, function(){
           //TODO: APP_ID
            FB.init({
                /*appId: 'YOUR_APP_ID',*/
            });
            $('#loginbutton,#feedbutton').removeAttr('disabled');
            //FB.getLoginStatus(updateStatusCallback);

            /* Set loaded */
            console.log('ONESOCIAL: Loading Facebook API successfull');
            apistate.facebook.loaded = true;
            processRenderQueue();
        });
    };

    /*
     * Loads the Googleplus API
     */
    var loadGoogleplusApi = function()
    {
        /* Set loading */
        apistate.googleplus.loading = true;

        //TODO Sprache!!!

        var gpJsSrc = 'https://apis.google.com/js/plusone.js';

        /* Google+ Platform Code */
        $.ajaxSetup({ cache: true });
        $.getScript(gpJsSrc, function(){

            /* Set loaded */
            console.log('ONESOCIAL: Loading Googleplus API successfull');
            apistate.googleplus.loaded = true;
            processRenderQueue();
        });
    };

    /*
     * Loads the Facebook API
     */
    var loadTwitterApi = function()
    {
        /* Set loading */
        apistate.twitter.loading = true;

        var twJsSrc = 'https://platform.twitter.com/widgets.js';

        /* Twitter platform code */
        $.ajaxSetup({ cache: true });
        $.getScript(twJsSrc, function(){

            /* Set loaded */
            console.log('ONESOCIAL: Loading Twitter API successfull');
            apistate.twitter.loaded = true;
            processRenderQueue();
        });

    };

    /*
     * Initialization function, this finally triggers API loading
     */
    var init = function() {

        //Load at document ready if chosen
        $(document).ready(function () {
            if (settings.loadAt == 'ready') {
                readytoload = true;
                checkAPIs();
            }
        });

        //Load at window.load if chosen
        $(window).load(function(){
            if (settings.loadAt == 'load') {
                readytoload = true;
                checkAPIs();
            }
        });
    };


    init();

}( jQuery ));
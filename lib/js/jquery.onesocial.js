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
            loaded: false
        },
        googleplus:
        {
            requested: false,
            loaded: false
        },
        twitter:
        {
            requested: false,
            loaded: false
        }
    };


    /*
     * Default function - aliases to default buttons
     */
    $.fn.onesocial = function(options)    {

        // Alias to default buttons
        this.onesocial.buttons(options);
    };

/*-------------------------------- This Block defines functionality for $.onesocial functions without dom element------------------------------------------------------*/

    /*
     * Setup - takes any set of settings and updates the settings
     * $.onesocial.setup({'...':'...'});
     */
    var onesocial = function(options)
    {
        // Aliases to default buttons at the end of body
        $('body').onesocial(options);
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


    /*
     * Default Button setup
     */
    $.fn.onesocial.buttons = function(options)
    {
        var ls = localsettings(options);
        alert(ls.greeting);
    }

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
        console.log(apistate);
        // Only will execute when page is ready to load the api
        if(readytoload == true)
        {
            if(apistate.facebook.requested && !apistate.facebook.loaded)
            {
                loadFacebookApi();
            }
            if(apistate.googleplus.requested && !apistate.googleplus.loaded)
            {
                loadGoogleplusApi();
            }
            if(apistate.twitter.requested && !apistate.twitter.loaded)
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
        /* Facebook Platform Code */
       (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/de_DE/sdk.js#xfbml=1&appId=152175308213668&version=v2.0";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        /* Set loaded */
        apistate.facebook.loaded = true;
    };

    /*
     * Loads the Facebook API
     */
    var loadGoogleplusApi = function()
    {
        //TODO Sprache!!!

        /* Google+ Platform Code */
        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();

        /* Set loaded */
        apistate.googleplus.loaded = true;
    };

    /*
     * Loads the Facebook API
     */
    var loadTwitterApi = function()
    {
        /* Twitter platform code */
        window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return}js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,"script","twitter-wjs"));

        /* Set loaded */
        apistate.twitter.loaded = true;
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
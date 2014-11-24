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
        language: 'autodetect', // 'autodetect' for preferred user language, language string/code for specific language, e.g. 'de' or 'de_DE'
        loadAt: 'load', // 'load' => load APIs on window.onload  // 'ready' => load APIs on document.ready


        facebook: {
            language: ''
        },

        googleplus: {
            language: ''
        },

        twitter: {
            language: ''
        }
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



/*------------------------------------------------------------ actually finally inserting the buttons -----------------------------------------------------------------------*/

    var widget = {};
    widget.facebook = {};
    widget.googleplus = {};
    widget.twitter = {};


    /* Facebook Widgets */
    widget.facebook.like = function(node, options)
    {
        var url = 'https://dev.twitter.com';
        var fboptions =
        {

        };

        var button = $('<div class="fb-like" data-href="'+ url +'"></div>');
        addContAndButton(node, 'osoc osoc-facebook osoc-facebook-osoc-facebook-like', button, 'facebook');
    };


    /* Googleplus Widgets */
    widget.googleplus.plusone = function(node, options)
    {
        var url = 'https://dev.twitter.com';
        var gpoptions =
        {

        };

        var button = $('<div class="g-plusone" data-href="'+ url +'"></div>');
        addContAndButton(node, 'osoc osoc-googleplus osoc-googleplus-googleplusone', button, 'googleplus');
    };

    /* Twitter Widgets */
    widget.twitter.tweet = function(node, options)
    {
        var url = 'http://i-san.de';
        var twoptions =
        {

        };

        var button = $('<a class="twitter-share-button" href="https://twitter.com/share" data-url="' + url + '" data-lang="' + settings.twitter.language + '">Tweet</a>');
        addContAndButton(node, 'osoc osoc-twitter osoc-twitter-tweet', button, 'twitter');

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
     * Creates a jquery object with a container with the given classes, adds it to the given node and adds the given buttoncode
     * then calls the api rendering
     */
    var addContAndButton = function(node, classes, button, api)
    {
        var container =  $('<div class="' + classes + '"></div>');
        node.append(container);
        container.append(button);
        renderapi[api](node);
    };

    /*
     * Send render calls to the API
     */
    var renderapi = {};
    renderapi.facebook = function(node)
    {
        node.each(function(){
            FB.XFBML.parse(this);
        });
    };
    renderapi.googleplus = function(node)
    {
        node.each(function(){
            gapi.plusone.go(this);
        });
    };
    renderapi.twitter = function(node)
    {
        node.each(function(){
            twttr.widgets.load(this);
        });
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

        /* Check language */
        if(settings.language == 'autodetect')
        {
            settings.language = getPreferredUserLanguage();
        }
        settings.facebook.language = getSupportedLanguage(settings.language, 'facebook');

        var fbJsSrc = '//connect.facebook.net/'+ settings.facebook.language +'/all.js';

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

        /* Check language */
        if(settings.language == 'autodetect')
        {
            settings.language = getPreferredUserLanguage();
        }
        settings.googleplus.language = getSupportedLanguage(settings.language, 'googleplus');

        var gpJsSrc = 'https://apis.google.com/js/plusone.js';

        /* Google+ Platform Code */
        window.___gcfg = {
            lang: settings.googleplus.language,
            parsetags: 'explicit'
        };

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

        /* Check language */
        if(settings.language == 'autodetect')
        {
            settings.language = getPreferredUserLanguage();
        }
        settings.twitter.language = getSupportedLanguage(settings.language, 'twitter');

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

    /*------------------------------------------------------------ Funky language detection stuff-----------------------------------------------------------------------------*/
    /*
     * This part is actually quite awesome.
     * We have the ability to auto-detect the preferred user language
     * and we can get the supported language strings with fallbacks for nearly every given language code
     * matching the given API
     *
     * The method that gets the suitable string called for each api runs even in worst case for all 3 apis together in under 6ms
     * I think that this is fast enough
     */

    var languages = {};
    languages.facebook =
    {
        'af_ZA': true,
        'ar_AR': true,
        'az_AZ': true,
        'be_BY': true,
        'bg_BG': true,
        'bn_IN': true,
        'bs_BA': true,
        'ca_ES': true,
        'cs_CZ': true,
        'cx_PH': true,
        'cy_GB': true,
        'da_DK': true,
        'de_DE': true,
        'el_GR': true,
        'en_GB': true,
        'en_PI': true,
        'en_UD': true,
        'en_US': true,
        'eo_EO': true,
        'es_ES': true,
        'es_LA': true,
        'et_EE': true,
        'eu_ES': true,
        'fa_IR': true,
        'fb_LT': true,
        'fi_FI': true,
        'fo_FO': true,
        'fr_CA': true,
        'fr_FR': true,
        'fy_NL': true,
        'ga_IE': true,
        'gl_ES': true,
        'gn_PY': true,
        'gu_IN': true,
        'he_IL': true,
        'hi_IN': true,
        'hr_HR': true,
        'hu_HU': true,
        'hy_AM': true,
        'id_ID': true,
        'is_IS': true,
        'it_IT': true,
        'ja_JP': true,
        'ja_KS': true,
        'jv_ID': true,
        'ka_GE': true,
        'kk_KZ': true,
        'km_KH': true,
        'kn_IN': true,
        'ko_KR': true,
        'ku_TR': true,
        'la_VA': true,
        'lt_LT': true,
        'lv_LV': true,
        'mk_MK': true,
        'ml_IN': true,
        'mn_MN': true,
        'mr_IN': true,
        'ms_MY': true,
        'nb_NO': true,
        'ne_NP': true,
        'nl_NL': true,
        'nn_NO': true,
        'pa_IN': true,
        'pl_PL': true,
        'ps_AF': true,
        'pt_BR': true,
        'pt_PT': true,
        'ro_RO': true,
        'ru_RU': true,
        'si_LK': true,
        'sk_SK': true,
        'sl_SI': true,
        'sq_AL': true,
        'sr_RS': true,
        'sv_SE': true,
        'sw_KE': true,
        'ta_IN': true,
        'te_IN': true,
        'tg_TJ': true,
        'th_TH': true,
        'tl_PH': true,
        'tr_TR': true,
        'uk_UA': true,
        'ur_PK': true,
        'uz_UZ': true,
        'vi_VN': true,
        'zh_CN': true,
        'zh_HK': true,
        'zh_TW': true
    };
    languages.googleplus =
    {
        'af': true,
        'am': true,
        'ar': true,
        'eu': true,
        'bn': true,
        'bg': true,
        'ca': true,
        'zh-HK': true,
        'zh-CN': true,
        'zh-TW': true,
        'hr': true,
        'cs': true,
        'da': true,
        'nl': true,
        'en-GB': true,
        'en-US': true,
        'et': true,
        'fil': true,
        'fi': true,
        'fr': true,
        'fr-CA': true,
        'gl': true,
        'de': true,
        'el': true,
        'gu': true,
        'iw': true,
        'hi': true,
        'hu': true,
        'is': true,
        'id': true,
        'it': true,
        'ja': true,
        'kn': true,
        'ko': true,
        'lv': true,
        'lt': true,
        'ms': true,
        'ml': true,
        'mr': true,
        'no': true,
        'fa': true,
        'pl': true,
        'pt-BR': true,
        'pt-PT': true,
        'ro': true,
        'ru': true,
        'sr': true,
        'sk': true,
        'sl': true,
        'es': true,
        'es-419': true,
        'sw': true,
        'sv': true,
        'ta': true,
        'te': true,
        'th': true,
        'tr': true,
        'uk': true,
        'ur': true,
        'vi': true,
        'zu': true
    };
    languages.twitter =
    {
        'en': true,
        'ar': true,
        'de': true,
        'da': true,
        'es': true,
        'fa': true,
        'fi': true,
        'fil': true,
        'fr': true,
        'he': true,
        'hi': true,
        'hu': true,
        'id': true,
        'it': true,
        'ja': true,
        'ko': true,
        'msa': true,
        'no': true,
        'nl': true,
        'pl': true,
        'pt': true,
        'ru': true,
        'sv': true,
        'th': true,
        'tr': true,
        'zh-cn': true,
        'zh-tw': true
    };

    /*
     * Gets the preferred user language
     * WARNING: Format differs across browsers (e.g. 'de' in FF and 'de-DE' in chrome/IE)
     */
    var getPreferredUserLanguage = function()
    {
        return navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    };

    /*
     * Returns a valid language string for a given want and api
     *
     * For example:
     * if we want 'de-CH' it will first check if this is available,
     * if no, it will check if 'de' is available,
     * if no, it will test if some other code starts with 'de',
     * which will result in 'de-DE' for example
     *
     */
    var getSupportedLanguage = function(want, api)
    {
        /* check if want is valid */
        if(languages[api][want] == true)
        {
            return want;
        }

        /* else try the variant with _ instead of - or reverse according to api*/
        var formattedWant;
        if(api == 'facebook')
        {
            formattedWant = want.replace('-','_');
        }
        else
        {
            formattedWant = want.replace('_','-').toLowerCase();
        }
        if(languages[api][formattedWant] == true)
        {
            return formattedWant;
        }


        /* Try once again, now ensure that the second part is in capitals */
        if(formattedWant.length>3)
        {
           if(api == 'facebook')
           {
               var parts = formattedWant.split('_');
               if(parts.length > 1)
               {
                   formattedWant = parts[0].toLowerCase() + '_' + parts[1].toUpperCase();
               }
           }
           else
           {
               var parts = formattedWant.split('-');
               if(parts.length > 1)
               {
                   formattedWant = parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
               }
           }
        }
        if(languages[api][formattedWant] == true)
        {
            return formattedWant;
        }


        /* else try the short version of the want */
        var shortwant = want.substring(0, 2).toLowerCase();
        if(languages[api][shortwant]==true)
        {
            return shortwant;
        }
        /* Else try if something starts with the short want */
        else
        {
            /* $.each somehow fails in this case with 'too much recursion' error- dunno why, so used standard js */
            for(var key in languages[api])
            {
                if (languages[api].hasOwnProperty(key) && (key.slice(0, 2) == shortwant))
                {
                    return key;
                }
            }
            /* If nothing is found, well, let's use english... */
            return getSupportedLanguage('en-US', api);
        }

    };

}( jQuery ));
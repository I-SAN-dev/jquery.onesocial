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
        greeting: "defaultgreeting"
    };

    var settings = defaults;

    /*
     * Helper function: returns updated settings for current function
     */
    var localsettings = function(options)
    {
        return $.extend({}, settings, options);
    }

    /*
     * Default function - aliases to default buttons
     */
    $.fn.onesocial = function(options)    {

        // Alias to default buttons
        this.onesocial.buttons(options);
    }

/*-------------------------------- This Block defines functionality for $.onesocial functions without dom element------------------------------------------------------*/

    /*
     * Setup - takes any set of settings and updates the settings
     * $.onesocial.setup({'...':'...'});
     */
    var onesocial = function(options)
    {
        // Aliases to default buttons at the end of body
        $('body').onesocial(options);
    }
    onesocial.setup = function(options)
    {
            $.extend(settings, options);
    }
    $.extend({
        onesocial: onesocial,
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








}( jQuery ));
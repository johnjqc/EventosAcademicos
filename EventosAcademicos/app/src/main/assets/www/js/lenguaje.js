$(document).on('pagebeforecreate','#globalization',function(e){
    var i18nOpts = {
        resStore: {
            dev: {
                translation: {
                    app: {
                        button: 'Button',
                        home: 'Home',
                        label: 'Label',
                        footer: 'Footer',
                        title: 'i18n Test'
                    }
                }
            },
            es : {
                translation : {
                    app: {
                        name: "i18next Español",
                    },
                    card: {
                        title: "No title"
                    },
                    nav: {
                        home: "Inicio",
                        page1: "Pagina Uno",
                        page2: "Pagina Dos"
                    }
                }
            },
        }
    };
    i18n.init(i18nOpts).done(function() {
        $("html").i18n();
    });

    i18n.init( function() {
        $("html").i18n();
    });
});
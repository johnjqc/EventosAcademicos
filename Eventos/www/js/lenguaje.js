$(document).on('pagebeforecreate','#app_home',function(e){
    i18n.init(i18nOpts).done(function() {
        $("html").i18n();
    });
});

$(document).on('pagebeforecreate','#pageEvento',function(e){
    i18n.init(i18nOpts).done(function() {
        $("html").i18n();
    });
});

var i18nOpts = {
        resStore: {
            dev: {
                translation: {
                    app: {
                        login: 'Login',
                        server: 'Servidor',
                        guardar: 'Guardar',
                        signin: 'Autenticar'
                    },
                    dates: {
                        short1: 'Ene',
                        short2: 'Feb',
                        short3: 'Mar',
                        short4: 'Abr',
                        short5: 'May',
                        short6: 'Jun',
                        short7: 'Jul',
                        short8: 'Ago',
                        short9: 'Sep',
                        short10: 'Oct',
                        short11: 'Nov',
                        short12: 'Dic'
                    }
                }
            },
            es : {
                translation : {
                    app: {
                        login: 'Login',
                        server: 'Servidor',
                        guardar: 'Guardar',
                        sigin: 'Autenticar'
                    },
                    dates: {
                        short1: 'Ene',
                        short2: 'Feb',
                        short3: 'Mar',
                        short4: 'Abr',
                        short5: 'May',
                        short6: 'Jun',
                        short7: 'Jul',
                        short8: 'Ago',
                        short9: 'Sep',
                        short10: 'Oct',
                        short11: 'Nov',
                        short12: 'Dic'
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
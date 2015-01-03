

function updateGlobalization(){
  navigator.globalization.getPreferredLanguage(
          function (language) {document.getElementById("globInfo").innerHTML = 'Preferred Language: '+ language.value;},
          function () {document.getElementById("globInfo").innerHTML = 'Error getting language';}
        );

}

function updateGlobalization1(){
     navigator.globalization.getLocaleName(
        function (locale) {document.getElementById("globInfo").innerHTML = 'Locale: ' + locale.value;
        $("globInfo").html("Locale Name: " + locale.value + "<br/>");},
        function () {document.getElementById("globInfo").innerHTML = 'Error getting locale';}
    );
}

$(document).on('pagebeforecreate','#globalization',function(e){
    i18n.init( function() {
        $("html").i18n();
    });
});

$(document).on('pageinit','#globalization',function(e){
    $('#saveServer').on('tap', function() {
        window.localStorage.setItem('text_ip', $('#text_ip').val());
        window.localStorage.setItem('text_puerto', $('#text_puerto').val());
    });

});

$(document).on('pageshow','#globalization', function(e) {
    var text_ip = window.localStorage.getItem('text_ip');
    var text_puerto = window.localStorage.getItem('text_puerto');

    if (text_ip != null) {
        if(text_ip.length>0){
                $('#text_ip').val(text_ip);
            }
    }

    if (text_puerto != null) {
        if(text_puerto.length>0){
                $('#text_puerto').val(text_puerto);
            }
    }
});

$(function() {
    $('#getLocaleName').bind('tap', function(e) {
        console.log('User tapped1 #myElement');  updateGlobalization1();
    });
    $('#getPreferredLanguage').bind('tap', function(e) {
        console.log('User tapped1 #myElement');  updateGlobalization();
    });

    $( "#popupConnectServer" ).bind( "tap", function(e) {
        var text_ip = window.localStorage.getItem('text_ip');
        var text_puerto = window.localStorage.getItem('text_puerto');

        if (text_ip != null) {
            if(text_ip.length>0){
                $('#text_ip').val(text_ip);
            }
        }

        if (text_puerto != null) {
            if(text_puerto.length>0){
                $('#text_puerto').val(text_puerto);
            }
        }
    } );
    $('#event_1').bind('tap', function(e) {
        alert(1);
    });
});

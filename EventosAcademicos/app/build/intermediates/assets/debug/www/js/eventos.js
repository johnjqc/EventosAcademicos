

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

$(document).on('pageinit','#globalization',function(e){

    $('#saveServer').on('tap', function() {
        window.localStorage.setItem('text_ip', $('#text_ip').val());
        window.localStorage.setItem('text_puerto', $('#text_puerto').val());
        getEvents();
        $('#globalization').trigger('create');
    });
    getEvents();

});

$(document).on('pageshow','#globalization', function(e) {
    showLoading();
});

$(function() {
    $('#getLocaleName').bind('tap', function(e) {
        console.log('User tapped1 #myElement');  updateGlobalization1();
    });
    $('#getPreferredLanguage').bind('tap', function(e) {
        console.log('User tapped1 #myElement');  updateGlobalization();
    });

    $( "#btn_popup_server" ).bind( "tap", function(e) {
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

});

function getEvents() {
    var text_ip = window.localStorage.getItem('text_ip');
    var text_puerto = window.localStorage.getItem('text_puerto');

    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/index.php?jsoncallback=?"
    var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#event_home');

    $.ajax({
        url: archivoValidacion,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 3000,
        success: function(data, status){
            $('#event_home').empty();
            $.each(data, function(i,item){
                if (i != 0) {
                    output = '<br />';
                }
                output += '<div id="evento'+ i +'" class="ui-body ui-body-a ui-corner-all ">';
                if ($.isEmptyObject(item.imagen)) {
                    output += '<div class="banne2">';
                } else {
                    output += '<div class="banner">';
                }
                output += '<div class="date_event">';
                output += '<p>25 <span>May</span></p>';
                output += '</div>';
                output += '</div>';
                if (!$.isEmptyObject(item.imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.imagen + '" />';
                    if (!$.isEmptyObject(item.titulo_imagen)) {
                        output += '<h2>' + item.titulo_imagen + '</h2>';
                    }
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p>' + item.descripcion + '</p>';
                output += '</div>';
                div_output.append(output);
                $("#event_home").load();
                $('#evento' + i).bind('tap', function(e) {
                    alert("click en evento " + i);
                });
            });
        },
        error: function(){
            $('#event_home').empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        }
    });
}

function showLoading() {
    var $this = $( this ),
    theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
    msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
    textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
    textonly = !!$this.jqmData( "textonly" );
    html = $this.jqmData( "html" ) || "";
    $.mobile.loading( "show", {
        text: msgText,
        textVisible: textVisible,
        theme: theme,
        textonly: textonly,
        html: html
    });
}
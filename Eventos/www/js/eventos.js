var mainloaded = false;
var text_ip = '';
var text_puerto = '';

var files;

$(function() {
	
	$('input[type=file]').on('change', prepareUpload);
	
	$('#frm_new_evento').on('submit', uploadFiles);

    $( "#btn_popup_server" ).bind( "tap", function(e) {
        text_ip = window.localStorage.getItem('text_ip');
        text_puerto = window.localStorage.getItem('text_puerto');

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

function prepareUpload(event) {
	files = event.target.files;
}

function uploadFiles(event) {
	event.stopPropagation();
    event.preventDefault();

    var data = new FormData();
    $.each(files, function(key, value) {
        data.append(key, value);
    });
    
    text_ip = window.localStorage.getItem('text_ip');
    text_puerto = window.localStorage.getItem('text_puerto');

    if ($.isEmptyObject(text_puerto)) {
        text_puerto = "80";
    }

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/file.php?files";

    $.ajax({
        url: urlServer,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false, 
		success : function(data, textStatus, jqXHR) {
			if (typeof data.error === 'undefined') {
				alert(data.result);
				submitForm(event, data);
			} else {
				console.log('ERRORS: ' + data.error);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('ERRORS: ' + textStatus);
		}
    });
}

function submitForm(event, data) {
    $form = $(event.target);

    var formData = $form.serialize();

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    text_ip = window.localStorage.getItem('text_ip');
    text_puerto = window.localStorage.getItem('text_puerto');

    if ($.isEmptyObject(text_puerto)) {
        text_puerto = "80";
    }

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/file.php";

    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            if(typeof data.error === 'undefined') {
                console.log('SUCCESS: ' + data.success);
            } else {
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus);
        },
        complete: function() {
            // STOP LOADING SPINNER
        }
    });
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
    if(!mainloaded) {
        showLoading();
    }
});

function getEvents() {
    text_ip = window.localStorage.getItem('text_ip');
    text_puerto = window.localStorage.getItem('text_puerto');

    if ($.isEmptyObject(text_puerto)) {
        text_puerto = "80";
    }

    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/index.php?jsoncallback=?";
    var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#event_home');

    $.ajax({
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        url: archivoValidacion,
        data: {
            'accion': 'queryCrudEvento'
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
            $('#event_home').empty();
            $.each(data, function(i,item){
                if (i != 0) {
                    output = '<br />';
                }
                output += '<div id="evento'+ i +'" class="ui-body ui-body-a ui-corner-all ">';
                if ($.isEmptyObject(item.imagen)) {
                    output += '<div class="banner2">';
                } else {
                    output += '<div class="banner">';
                }
                output += '<div class="date_event">';
                var fecha = new Date(item.fecha_inicio);
                output += '<p>' + fecha.getUTCDate() + ' <span data-i18n>dates.short' + (fecha.getMonth() +1) + '</span></p>';
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
                output += '<p>' + item.nombre + '</p>';
                output += '</div>';
                div_output.append(output);
                $("#event_home").load();
                $('#evento' + i).bind('tap', function(e) {
                    $.mobile.changePage( "evento.html" );
                    //$.mobile.loadPage( "evento.html");
                });
            });
            $("span").i18n();
            mainloaded = true;
        },
        error: function(){
            $('#event_home').empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
}

function showLoading() {
    $.mobile.loading( "show", {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
    });
}

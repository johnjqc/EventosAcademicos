var text_ip = '';
var text_puerto = '';
var activeEncuesta;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
});

$(document).on('pageinit','#page_r_encuesta',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeEncuesta', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#list_encuestas');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_r_encuestas', 'idEvento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron registros en la Base de Datos para mostrar</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            $.each(data, function(i,item){
            	output = '<li id="r_encuesta' + item.idEncuesta + '"><a data-ajax="false" href="g_encuesta_q.html">';
//            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.enc_nombre + '</h2></a>';
    			output += '<a id="delete_r_encuesta' + item.idEncuesta + '" href="#" >Elimina Relacion</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#r_encuesta' + (item.idEncuesta)).bind('tap', function(e) {
                	window.localStorage.setItem('activeEncuesta', item.idEncuesta);
                });
				$('#delete_r_encuesta' + (item.idEncuesta)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'delete_r_encuesta', idEvento: activeEvent, idEncuesta: item.idEncuesta
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de encuesta con evento exitosamente");
				        	location.reload();
				        },
				        beforeSend: function(){
				            showLoading();
				        },
				        complete: function(){
				            $.mobile.loading( "hide" );
				        },
				        error: function(jqXHR, textStatus, errorThrown){
				        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
				        	div_output.empty();
				            $.mobile.loading( "hide" );
				            alert('Error conectando al servidor.');
				        }
				    });
                });
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
        	div_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
});

$(document).on('pageinit','#page_r_encuesta_evento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeEncuesta = localStorage.getItem('activeEncuesta');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listencuestasAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_encuesta_to_add', 'idEvento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="encuesta' + item.idEncuesta + '" data-icon="plus"><a href="#">';
        		output += '' + item.enc_nombre + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#encuesta' + (item.idEncuesta)).bind('tap', function(e) {
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_encuesta_evento', idEvento: activeEvent, idEncuesta: item.idEncuesta},
						cache: false,
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(data, textStatus, jqXHR) {
							if(typeof data.error === 'undefined') {
								alert("Usuario agregado exitosamente");
								window.history.back();
							} else {
								console.log('ERRORS: ' + data.error);
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log('ERRORS: ' + textStatus);
							$.mobile.loading( "hide" );
						},
						complete: function() {
							$.mobile.loading( "hide" );
						}
					});
                });
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(jqXHR, textStatus, errorThrown){
        	div_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor. ' + jqXHR.responseText);
        }
    });
});

function showLoading() {
    $.mobile.loading( "show", {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
    });
}

function getIpPortserver() {
	text_ip = window.localStorage.getItem('text_ip');
    text_puerto = window.localStorage.getItem('text_puerto');
    
    if ($.isEmptyObject(text_puerto)) {
        text_puerto = "80";
    }
}

function security() {
	usu_perfil = window.localStorage.getItem('usu_perfil');
	
	if (!$.isEmptyObject(usu_perfil)) {
		if (usu_perfil != -1) {
			
		}
	}
}



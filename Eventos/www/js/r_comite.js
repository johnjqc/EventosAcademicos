var text_ip = '';
var text_puerto = '';
var activeComite;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
});

$(document).on('pageinit','#page_r_comite',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeComite', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#list_comites');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_r_comites', 'idEvento': activeEvent
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
            	output = '<li id="r_comite' + item.idComite + '"><a data-ajax="false" href="g_comite_q.html">';
//            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.com_nombre + '</h2></a>';
    			output += '<a id="delete_r_comite' + item.idComite + '" href="#" >Elimina Relacion</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#r_comite' + (item.idComite)).bind('tap', function(e) {
                	window.localStorage.setItem('activeComite', item.idComite);
                });
				$('#delete_r_comite' + (item.idComite)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'delete_r_comite', idEvento: activeEvent, idComite: item.idComite
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de comite con evento exitosamente");
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

$(document).on('pageinit','#page_r_comite_evento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeComite = localStorage.getItem('activeComite');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listcomitesAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_comite_to_add', 'idEvento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="asistente' + item.idComite + '" data-icon="plus"><a href="#">';
        		output += '' + item.com_nombre + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#asistente' + (item.idComite)).bind('tap', function(e) {
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_comite_evento', idEvento: activeEvent, idComite: item.idComite},
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



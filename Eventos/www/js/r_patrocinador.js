var text_ip = '';
var text_puerto = '';
var activePatrocinador;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
});

$(document).on('pageinit','#page_r_patrocinador',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activePatrocinador', -1);
	usu_perfil = window.localStorage.getItem('usu_perfil');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#list_patrocinadores');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_r_patrocinadores', 'idEvento': activeEvent
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
            	output = '<li id="r_patrocinador' + item.idPatrocinador + '"><a data-ajax="false" href="g_patrocinador_q.html">';
//            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	if (!$.isEmptyObject(item.pat_imagen)) {
            		output += '<img src="' + httpImagen + item.pat_imagen + '">';
            	}
        		output += '<h2>' + item.pat_nombre + '</h2></a>';
        		if (!$.isEmptyObject(usu_perfil)) {
        			if (usu_perfil != -1 && usu_perfil != 3 && usu_perfil != 4) {
        				output += '<a id="delete_r_patrocinador' + item.idPatrocinador + '" href="#" >Elimina Relacion</a>';
        			}
        		}
    			
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#r_patrocinador' + (item.idPatrocinador)).bind('tap', function(e) {
                	window.localStorage.setItem('activePatrocinador', item.idPatrocinador);
                });
				$('#delete_r_patrocinador' + (item.idPatrocinador)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'delete_r_patrocinador', idEvento: activeEvent, idPatrocinador: item.idPatrocinador
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de patrocinador con evento exitosamente");
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

$(document).on('pageinit','#page_r_patrocinador_evento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activePatrocinador = localStorage.getItem('activePatrocinador');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listpatrocinadoresAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_patrocinador_to_add', 'idEvento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="patrocinador' + item.idPatrocinador + '" data-icon="plus"><a href="#">';
            	if (!$.isEmptyObject(item.pat_imagen)) {
            		output += '<img src="' + httpImagen + item.pat_imagen + '">';
            	}
        		output += '' + item.pat_nombre + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#patrocinador' + (item.idPatrocinador)).bind('tap', function(e) {
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_patrocinador_evento', idEvento: activeEvent, idPatrocinador: item.idPatrocinador},
						cache: false,
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(data, textStatus, jqXHR) {
							if(typeof data.error === 'undefined') {
								alert("Patrocinador agregado exitosamente");
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
		if (usu_perfil == -1) {
			$("#btn_menu_home").hide();
			$("#btn_r_patrocinador").hide();
		}
		if (usu_perfil == 3) {
			$("#btn_r_patrocinador").hide();
			
			$("#menu_invitado").hide();
			$("#menu_organizador").hide();
			$("#menu_coordinador").hide();
			$("#mnuComites").hide();
			$("#mnuEncuestas").hide();
			$("#mnuLugares").hide();
			$("#mnuPatrocinadores").hide();
			$("#mnuPublicaciones").hide();
			$("#mnuUsuarios").hide();
			$("#mnuInscripciones").hide();
		}
		if (usu_perfil == 4) {
			$("#btn_r_patrocinador").hide();
			
			$("#menu_invitado").hide();
			$("#menu_organizador").hide();
			$("#menu_coordinador").hide();
			$("#mnuComites").hide();
			$("#mnuEncuestas").hide();
			$("#mnuLugares").hide();
			$("#mnuPatrocinadores").hide();
			$("#mnuUsuarios").hide();
			$("#mnuInscripciones").hide();
		}
	}
}



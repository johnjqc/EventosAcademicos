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
	usu_perfil = window.localStorage.getItem('usu_perfil');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#list_comites');

    $.ajax({
        url: urlServer,
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
            	output = '<li id="r_comite' + item.idComite + '"><a data-ajax="false" href="r_comite_usuarios.html">';
//            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.com_nombre + '</h2></a>';
        		if (!$.isEmptyObject(usu_perfil)) {
        			if (usu_perfil != -1) {
        				output += '<a id="delete_r_comite' + item.idComite + '" href="#" >Elimina Relacion</a>';
        			}
        		}
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#r_comite' + (item.idComite)).bind('tap', function(e) {
                	window.localStorage.setItem('activeComite', item.idComite);
                });
				$('#delete_r_comite' + (item.idComite)).bind('tap', function(e) {
					$.ajax({
				        url: urlServer,
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

$(document).on('pageinit','#page_comite_usuarios_query',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeComite = localStorage.getItem('activeComite');
	usu_perfil = window.localStorage.getItem('usu_perfil');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	
	if (!$.isEmptyObject(localStorage.getItem('idUsuario'))) {
		window.localStorage.setItem('activeUsuario', localStorage.getItem('idUsuario'));
	}

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_comite', comite: activeComite
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	$('#nombre').append(item.com_nombre);
            	$('#nombre').load();
            	$('#descripcion').append(item.com_descripcion);
            	$('#descripcion').load();
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    var list_output= $('#list_usuarios');
    
    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_r_usuarios_comite', idEvento: activeEvent, idComite: activeComite
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	list_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<li data-role="list-divider">Integrantes</li>';
            	output += '<li> No se encontraron usuarios relacionados</li>';
                list_output.append(output);
                list_output.listview("refresh");
            } else {
            	output = '<li data-role="list-divider" data-theme="f">Integrantes</li>';
            	list_output.append(output);
				list_output.listview("refresh");
            }
            $.each(data, function(i,item){
            	output = '<li id="r_usuario' + item.idUsuario + '"><a data-ajax="false" href="g_usuario_q.html">';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre+ ' ' + item.usu_apellido + '</h2></a>';
        		if (!$.isEmptyObject(usu_perfil)) {
        			if (usu_perfil != -1) {
        				output += '<a id="delete_r_usuario' + item.idUsuario + '" href="#" >Elimina Relacion</a>';
        			}
        		}
				output += '</li>';
				list_output.append(output);
				list_output.listview("refresh");
				$('#r_usuario' + (item.idUsuario)).bind('tap', function(e) {
                	window.localStorage.setItem('activeUsuario', item.idUsuario);
                });
				$('#delete_r_usuario' + (item.idUsuario)).bind('tap', function(e) {
					$.ajax({
				        url: urlServer,
				        data: {
				            accion: 'delete_r_usuario', idComite: activeComite, idUsuario: item.idUsuario
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de usuario con comite exitosamente");
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
        	list_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
});

$(document).on('pageinit','#page_r_usuario_has_evento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeComite = localStorage.getItem('activeComite');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listusuariocomiteAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_usuario_has_evento_to_add', 'idEvento': activeEvent, idComite: activeComite
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="asistente' + item.idUsuario + '" data-icon="plus"><a href="#">';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '' + item.usu_nombre + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#asistente' + (item.idUsuario)).bind('tap', function(e) {
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_usuario_has_comite', idEvento: activeEvent, idUsuario: item.idUsuario, idComite: activeComite},
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
		if (usu_perfil == -1) {
			$("#btn_menu_home").hide();
			$("#btn_r_espacio").hide();
			$("#btn_r_usuario").hide();
			$("#btn_confirm_delete_comite").hide();
			$("#btn_edit_comite").hide();
			
			
		}
	}
}



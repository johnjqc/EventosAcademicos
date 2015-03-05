var text_ip = '';
var text_puerto = '';
var activeComite; //id del comite seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
});

$(document).on('pageinit','#pageInscripcion',function(e) {
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_inscripcion.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var list_output= $('#listInscripciones');
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_inscripciones', idEvento: activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	list_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<li>No se encontraron registros en la Base de Datos para mostrar</li>';
                output += '</div>';
                list_output.append(output);
                list_output.load();
            } 
            
            $.each(data, function(i,item){
            	output = '<li id="usuario' + item.idUsuario + '"><a href="g_usuario_q.html" data-ajax="false" >';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
        		output += '<a id="add_user_event' + item.idUsuario + '" href="#" >Elimina Relacion</a>';
				output += '</li>';
                list_output.append(output);
                list_output.listview("refresh");
                $('#usuario' + item.idUsuario ).bind('tap', function(e) {
                	window.localStorage.setItem('activeUsuario', item.idUsuario);
                });
                $('#add_user_event' + (item.idUsuario)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'add_user_event', idEvento: activeEvent, idUsuario: item.idUsuario
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se activo relacion de usuario con evento exitosamente");
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
        error: function(){
        	list_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    var list_output1= $('#listInscritos');
    output= "";
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_inscritos', idEvento: activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	list_output1.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<li>No se encontraron registros en la Base de Datos para mostrar</li>';
                output += '</div>';
                list_output1.append(output);
                list_output1.listview("refresh");
            } 
            
            $.each(data, function(i,item){
            	output = '<li id="usuario1' + item.idUsuario + '"><a href="g_usuario_q.html" data-ajax="false" >';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
        		output += '<a id="delete_user_event' + item.idUsuario + '" href="#" >Elimina Relacion</a>';
				output += '</li>';
                list_output1.append(output);
                list_output1.listview("refresh");
                $('#usuario1' + item.idUsuario ).bind('tap', function(e) {
                	window.localStorage.setItem('activeUsuario', item.idUsuario);
                });
                $('#delete_user_event' + (item.idUsuario)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'remove_user_event', idEvento: activeEvent, idUsuario: item.idUsuario
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se inactivo usuario con evento exitosamente");
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
        error: function(){
        	list_output1.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
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
	if (!$.isEmptyObject(localStorage.getItem('idUsuario'))) {
		window.localStorage.setItem('activeUsuario', localStorage.getItem('idUsuario'));
	}
	
	if (!$.isEmptyObject(usu_perfil)) {
		if (usu_perfil != -1) {
			
		}
	}
}



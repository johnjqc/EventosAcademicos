var text_ip = '';
var text_puerto = '';
var activeAsistente;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
  $(event.target).remove();
});
	//$('#listAsistentes').listview("refresh");
//	$('#frm_new_comite').on('submit', submitForm_newComite);
});

$(document).on('pageinit','#page_asistentes',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeAsistente', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_asistentes.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listAsistentes');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_asistentes', 'evento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<br />';
            	output += '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron registros en la Base de Datos para mostrar</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            $.each(data, function(i,item){
            	output = '<li id="asistente' + item.idUsuario + '"><a href="asistentes_q.html">';
            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
    			output += '<p>' + item.usu_email + '</p></a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#asistente' + (item.idUsuario)).bind('tap', function(e) {
                	window.localStorage.setItem('activeAsistente', item.idUsuario);
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
        	div_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
});

$(document).on('pageinit','#page_asistentes_query',function(e){
	activeAsistente = localStorage.getItem('activeAsistente');
	activeEvent = window.localStorage.getItem('activeEvent');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_asistentes.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var output = "";
	var div_output= $('#listAsistente');
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_asistente', usuario: activeAsistente
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#listAsistente').empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="asistente' + item.idUsuario + '">';
            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
    			output += '<p>' + item.usu_email + '</p>';
				output += '</li>';
				
                div_output.append(output);
                div_output.listview("refresh");
				
				if (!$.isEmptyObject(item.usu_nacionalidad)) {
					$('#nacionalidad').html("<B>Nacionalidad:</B> " + item.usu_nacionalidad);
					$('#nacionalidad').load();
				}
				
				$('#bio').html("<B>BIO</B>: <br /><br />" + item.usu_bio);
				$('#bio').load();
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(){
        	$('#listAsistente').empty();
			$('#listAsistente').listview("refresh");
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    $('#btn_delete_asistente').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_asistente', idUsuario: activeAsistente, idEvento: activeEvent
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Asistente eliminado exitosamente");
                	window.location = "asistentes.html";
            	} else {
                    console.log('ERRORS: ' + data.error);
                }
           },
            beforeSend: function(){
                showLoading();
            },
            complete: function(){
                $.mobile.loading( "hide" );
            },
            error: function(){
                $.mobile.loading( "hide" );
                alert('Error conectando al servidor.');
            }
       });
    });
});

$(document).on('pageinit','#page_asistentes_new',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeAsistente = localStorage.getItem('activeAsistente');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_asistentes.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listAsistentesAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_asistentes_to_add', 'evento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="asistente' + item.idUsuario + '"><a href="#">';
        		output += '' + item.usu_nombre + ' ' + item.usu_apellido + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#asistente' + (item.idUsuario)).bind('tap', function(e) {
                	//window.localStorage.setItem('activeAsistente', item.idUsuario);
					
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_asistente', idEvento: activeEvent, idUsuario: item.idUsuario},
						cache: false,
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(data, textStatus, jqXHR) {
							if(typeof data.error === 'undefined') {
								alert("Usuario agregado exitosamente");
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
        error: function(){
        	div_output.empty();
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
	
	if (!$.isEmptyObject(usu_perfil)) {
		if (usu_perfil != -1) {
			
		}
	}
}



var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activePublicacion;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	$('input[type=file]').on('change', prepareUpload);
	$('#frm_new_publicacion').on('submit', uploadFiles);
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
});

$(document).on('pageinit','#page_publicaciones',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activePublicacion', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listpublicaciones');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_publicaciones'
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
            	output = '<li id="publicacion' + item.idPublicacion + '"><a data-ajax="false" href="g_publicacion_q.html">';
        		output += '' + item.pub_titulo + '';
    			output += '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#publicacion' + (item.idPublicacion)).bind('tap', function(e) {
                	window.localStorage.setItem('activePublicacion', item.idPublicacion);
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

$(document).on('pageinit','#page_publicacion_query',function(e){
	activePublicacion = localStorage.getItem('activePublicacion');
	activeEvent = window.localStorage.getItem('activeEvent');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var output = "";
	var div_output= $('#publicacion_content');
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_publicacion', idPublicacion: activePublicacion
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
                output += '<p><h1>' + item.pub_titulo + '</h1></p>';
                output += '<p>' + item.pub_resumen + '</p>';
                output += '<p>' + item.pub_otros_autores + '</p>';
                if (!$.isEmptyObject(item.pub_archivo)) {
                	output += '<a href="' + httpImagen + item.pub_archivo + '">Descargar Archivo</a>';
                }
                output += '</div>';
                div_output.append(output);
                div_output.load();
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
    
    $('#btn_delete_publicacion').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_publicacion', idPublicacion: activePublicacion
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("publicacion eliminada exitosamente");
//                	window.location = "asistentes.html";
            		window.history.go(-2);
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

$(document).on('pageinit','#page_publicacion_new',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activePublicacion = localStorage.getItem('activePublicacion');
	
	if (activePublicacion != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?jsoncallback=?";
	    var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	    
	    $.ajax({
	        beforeSend: function(){
	            showLoading();
	        },
	        complete: function(){
	            $.mobile.loading("hide");
	        },
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_publicacion', 'idPublicacion': activePublicacion
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
	        	$.each(data, function(i,item){ 
	        		$("#t_titulo").val(item.pub_titulo);
	        		$("#t_resumen").val(item.pub_resumen);
	        		$("#t_otros_autores").val(item.pub_otros_autores);
	        		$("#t_archivo").val(item.pub_archivo);
	        		
	        		//Falta garantiza carga de estado activo e imagen
//	        		$( "input[type='checkbox']" ).prop( "checked", true ).checkboxradio( "refresh" );
	        	});
	        },
	        error: function(){
	            $.mobile.loading("hide");
	            alert('Error conectando al servidor.');
	        }
	    });
	}
});

function prepareUpload(event) {
	files = event.target.files;
}

function uploadFiles(event) {
	event.stopPropagation();
    event.preventDefault();
    
    var data = new FormData();
    if (!$.isEmptyObject(files)) {
    	$.each(files, function(key, value) {
            data.append(key, value);
        });
    } 
    
    getIpPortserver();
    
    if (activePublicacion != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?&idPublicacion="+ activePublicacion+ "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?files";
    }

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
				submitForm(event, data);
			} else {
				console.log('ERRORS: ' + data.error);
				$.mobile.loading( "hide" );
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('ERRORS: ' + textStatus);
		}
    });
    
    return false;
}

function submitForm(event, data) {
    $form = $(event.target);
    activePublicacion = window.localStorage.getItem('activePublicacion');
    var accion = '&accion=new_publicacion';
    if (activePublicacion != -1) {
    	accion = '&accion=update_publicacion&idPublicacion='+ activePublicacion;
    }
    
    var formData = $form.serialize() + accion;

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_publicacion.php?jsoncallback=?";

    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, textStatus, jqXHR) {
            if(typeof data.error === 'undefined') {
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
    
    return false;
}

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
		if (usu_perfil == 3) {
			$("#btn_edit_publicacion").hide();
			$("#btn_confirm_delete_publicacion").hide();
			
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
		
		if (usu_perfil != -1 && usu_perfil != 0) {
			$("#btnLogin").hide();
		}
	}
}

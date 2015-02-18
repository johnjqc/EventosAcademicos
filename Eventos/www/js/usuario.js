var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activeUsuario;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	$('input[type=file]').on('change', prepareUpload);
	$('#frm_new_usuario').on('submit', uploadFiles);
});

$(document).on('pageinit','#page_usuarios',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeUsuario', -1);
//	if (localStorage.getItem('idUsuario') != -1) {
//		window.localStorage.setItem('activeUsuario', localStorage.getItem('idUsuario'));
//	}
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listusuarios');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_usuarios'
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
            $.each(data, function(i,item) {
            	output = '<li id="usuario' + item.idUsuario + '"><a href="g_usuario_q.html" data-ajax="false" >';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
    			output += '<p>' + item.usu_email + '</p></a>';
				output += '</li>';
                
                div_output.append(output);
                div_output.listview("refresh");
				$('#usuario' + (item.idUsuario)).bind('tap', function(e) {
                	window.localStorage.setItem('activeUsuario', item.idUsuario);
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

$(document).on('pageinit','#page_usuario_query',function(e){
	activeUsuario = localStorage.getItem('activeUsuario');
	activeEvent = window.localStorage.getItem('activeEvent');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var output = "";
	var div_output= $('#usuario_content');
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_usuario', idUsuario: activeUsuario
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
//            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
            	output = '<ul data-role="listview" data-inset="true">';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<li class="ui-field-contain">';
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.usu_imagen + '" />';
                    output += '</div>';
                    output += '</li>';
                }
            	if (!$.isEmptyObject(item.usu_identificacion)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Identificacion:</label>';
            		output += '<spam id="identificacion"><h1>' + item.usu_identificacion + '</h1></spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_nombre)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="name">Nombre:</label>';
            		output += '<spam id="name">' + item.usu_nombre + ' ' + item.usu_apellido + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_email)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="email">Email:</label>';
            		output += '<spam id="email">' + item.usu_email + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_nacionalidad)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="nat">Nacionalidad:</label>';
            		output += '<spam id="nat">' + item.usu_nacionalidad + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_telefono)) {
            		if (item.usu_telefono != 0) {
            			output += '<li class="ui-field-contain">';
                		output += '<label for="phone">Telefono:</label>';
                		output += '<spam id="phone">' + item.usu_telefono + '</spam>';
                        output += '</li>';
            		}
            	}
            	if (!$.isEmptyObject(item.usu_perfil)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="profile">Perfil:</label>';
            		if (item.usu_perfil == 1) {
                    	output += '<spam id="profile">Coordinador</spam>';
                    }
                    if (item.usu_perfil == 2) {
                    	output += '<spam id="profile">Organizador</spam>';
                    }
                    if (item.usu_perfil == 3) {
                    	output += '<spam id="profile">Asistente</spam>';
                    }
                    if (item.usu_perfil == 4) {
                    	output += '<spam id="profile">Ponente</spam>';
                    }
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_institucion)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="institucion">Institucion:</label>';
            		output += '<spam id="institucion">' + item.usu_institucion + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_nivel_academico)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="nivel_academico">Nivel academico:</label>';
            		output += '<spam id="nivel_academico">' + item.usu_nivel_academico + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_profesion)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="profesion">Profesion:</label>';
            		output += '<spam id="profesion">' + item.usu_profesion + '</spam>';
                    output += '</li>';
            	}
            	if (!$.isEmptyObject(item.usu_biografia)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="biografia">Biografia:</label>';
            		output += '<spam id="biografia">' + item.usu_biografia + '</spam>';
                    output += '</li>';
            	}
                output += '</ul>';
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
    
    $('#btn_delete_usuario').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_usuario', idUsuario: activeUsuario
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("usuario eliminada exitosamente");
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

$(document).on('pageinit','#page_usuario_new',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeUsuario = localStorage.getItem('activeUsuario');
	
	if (activeUsuario != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?jsoncallback=?";
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
	            'accion': 'query_usuario', 'idUsuario': activeUsuario
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
	        	$.each(data, function(i,item){ 
	        		$("#t_identificacion").val(item.usu_identificacion);
	        		$("#t_nombre").val(item.usu_nombre);
	        		$("#t_apellido").val(item.usu_apellido);
	        		$("#t_nacionalidad").val(item.usu_nacionalidad);
	        		$("#t_email").val(item.usu_email);
	        		$("#t_telefono").val(item.usu_telefono);
	        		$("#t_contrasena").val(item.usu_contrasena);
	        		$("#t_imagen").val(item.usu_imagen);
	        		$("#t_perfil").val(item.usu_perfil).selectmenu('refresh');
	        		$("#t_estado").val(item.usu_estado);
	        		$("#t_institucion").val(item.usu_institucion);
	        		$("#t_nivel_academico").val(item.usu_nivel_academico);
	        		$("#t_biografia").val(item.usu_biografia);
	        		$("#t_profesion").val(item.usu_profesion);
	        		
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
    
    if (activeUsuario != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?&idUsuario="+ activeUsuario+ "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?files";
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
    activeUsuario = window.localStorage.getItem('activeUsuario');
    var accion = '&accion=new_usuario';
    if (activeUsuario != -1) {
    	accion = '&accion=update_usuario&idUsuario='+ activeUsuario;
    }
    
    var formData = $form.serialize() + accion;

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_usuario.php?jsoncallback=?";

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
		if (usu_perfil == -1) {
			$("#btn_menu_home").hide();
			$("#btn_confirm_delete_usuario").hide();
			$("#btn_edit_comite").hide();
		}
		if (usu_perfil == 3) {
			$("#btn_confirm_delete_usuario").hide();
			if (localStorage.getItem('idUsuario') != localStorage.getItem('activeUsuario')) {
				$("#btn_edit_usuario").hide();
			}
			$("#label_perfil").hide();
			$("#t_perfil").hide().selectmenu('refresh');;
			$("#label_estado").hide();
			$("#t_estado").hide();
		}
		if (usu_perfil == 4) {
			$("#btn_confirm_delete_usuario").hide();
			if (localStorage.getItem('idUsuario') != localStorage.getItem('activeUsuario')) {
				$("#btn_edit_usuario").hide();
			}
			$("#label_perfil").hide();
			$("#t_perfil").hide().selectmenu('refresh');;
			$("#label_estado").hide();
			$("#t_estado").hide();
		}
	}
}

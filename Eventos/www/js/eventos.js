var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activeEvent, activeComite;
var usu_perfil;
var idUsuario;

var files;

$(function() {
	security();
	$('input[type=file]').on('change', prepareUpload);
	$('#frm_new_evento').on('submit', uploadFiles);
	$("#list_menu").listview("refresh");
	
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
	$('#logoutHome').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "index.html";
    });
});

$(document).on('pageinit','#app_home',function(e){
	window.localStorage.setItem('activeEvent', -1);
	
	if ($.isEmptyObject(localStorage.getItem('usu_perfil'))) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
	}
	
    $('#saveServer').on('tap', function() {
        window.localStorage.setItem('text_ip', $('#text_ip').val());
        window.localStorage.setItem('text_puerto', $('#text_puerto').val());
        getEvents();
        $('#app_home').trigger('create');
    });
    $("#btn_popup_server").bind( "tap", function(e) {
    	getIpPortserver();
    	if (!$.isEmptyObject(text_ip)) {
    		$('#text_ip').val(text_ip);
    	}
    	if (!$.isEmptyObject(text_puerto)) {
    		$('#text_puerto').val(text_puerto);
    	}
    });
    
    $("#btn_filtro").bind( "tap", function(e) {
    	getIpPortserver();
    	getMisEvents();
    });

    getEvents();
});

$(document).on('pageshow','#app_home', function(e) {
    if(!mainloaded) {
        showLoading();
    }
});

$(document).on('pageinit','#pageEvento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	idUsuario = window.localStorage.getItem('idUsuario');
	getEvento();
	
	$("#btnSpeaker").bind( "tap", function(e) {
		window.location = "r_ponentes.html";
    });
	$("#btnCalendar").bind( "tap", function(e) {
		window.location = "g_agenda.html";
    });
	$("#btnCalendar0").bind( "tap", function(e) {
		window.location = "g_agenda.html";
    });
	$("#btnCalendar34").bind( "tap", function(e) {
		window.location = "g_agenda.html";
    });
	
	$("#btnCommittee").bind( "tap", function(e) {
		window.location = "r_comite.html";
	});
	$("#btnCommittee0").bind( "tap", function(e) {
		window.location = "r_comite.html";
	});
	$("#btnCommittee34").bind( "tap", function(e) {
		window.location = "r_comite.html";
	});
	
	$("#btnSponsor").bind( "tap", function(e) {
		window.location = "r_patrocinador.html";
	});
	$("#btnSponsor0").bind( "tap", function(e) {
		window.location = "r_patrocinador.html";
	});
	$("#btnSponsor34").bind( "tap", function(e) {
		window.location = "r_patrocinador.html";
	});
	
	$("#btnPlaces").bind( "tap", function(e) {
		window.location = "r_lugar.html";
	});
	$("#btnPlaces0").bind( "tap", function(e) {
		window.location = "r_lugar.html";
	});
	$("#btnPlaces34").bind( "tap", function(e) {
		window.location = "r_lugar.html";
	});
	
	$("#btnAttendees").bind( "tap", function(e) {
		window.location = "r_asistentes.html";
	});
	$("#btnReport").bind( "tap", function(e) {
		
	});
	$("#btnPoll").bind( "tap", function(e) {
		window.location = "r_encuesta.html";
	});
	$("#btnPoll34").bind( "tap", function(e) {
		window.location = "r_encuesta.html";
	});
	
	$("#btnGallery").bind( "tap", function(e) {
		window.location = "g_galeria.html";
	});
	$("#btnGallery0").bind( "tap", function(e) {
		window.location = "g_galeria.html";
	});
	$("#btnGallery34").bind( "tap", function(e) {
		window.location = "g_galeria.html";
	});
	
	$("#btnFiles").bind( "tap", function(e) {
		window.location = "r_publicacion.html";
	});
	$("#btnFiles34").bind( "tap", function(e) {
		window.location = "r_publicacion.html";
	});
	
	$("#btnInfo").bind( "tap", function(e) {
		window.location = "informacion.html";
	});
	$("#btnInfo0").bind( "tap", function(e) {
		window.location = "informacion.html";
	});
	$("#btnInfo34").bind( "tap", function(e) {
		window.location = "informacion.html";
	});
	
	$("#btnContac").bind( "tap", function(e) {
		window.location = "contacto.html";
	});
	$("#btnContac0").bind( "tap", function(e) {
		window.location = "login.html";
	});
	$("#btnContac34").bind( "tap", function(e) {
		window.location = "contacto.html";
	});
	
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
	
	$('#btn_subscribe_evento').bind('tap', function(e) {
		$.ajax({
			url: urlServer,
			type: 'POST',
			data: {'accion': 'subscribir_evento', idEvento: activeEvent, idUsuario: idUsuario},
			cache: false,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			success: function(data, textStatus, jqXHR) {
				if(typeof data.error === 'undefined') {
					$('#btn_subscribe').hide();
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
	
	$('#btn_delete_evento').bind('tap', function(e) {
    	$.ajax({
            url: urlServer,
            data: {
                'accion': 'delete_evento', idEvento: activeEvent
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Evento eliminado exitosamente");
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

$(document).on('pageshow','#crud_evento',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	
	if (activeEvent != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
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
	            'accion': 'queryEvento', 'evento': activeEvent
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
	        	$.each(data, function(i,item){ 
	        		$("#t_nombre").val(item.eve_nombre);
	        		$("#t_fecha_inicio").val(item.eve_fecha_inicio);
	        		$("#t_fecha_fin").val(item.eve_fecha_fin);
	        		$("#t_descripcion").val(item.eve_descripcion);
	        		$("#t_titulo_img").val(item.eve_titulo_imagen);
	        		
	        		$("#t_temas").val(item.eve_temas);
	        		$("#t_costos").val(item.eve_costos);
	        		$("#t_tipo").val(item.eve_tipo);
	        		$("#t_fecha_articulos").val(item.eve_recepcion_articulos);
	        		$("#t_pagina").val(item.eve_pagina_web);
	        		$("#t_facebook").val(item.eve_facebook);
	        		$("#t_twitter").val(item.eve_twitter);
	        		
	        	});
	        },
	        error: function(){
	            $.mobile.loading("hide");
	            alert('Error conectando al servidor.');
	        }
	    });
	}
	
});


$(document).on('pageinit','#page_info',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	
	getIpPortserver();
    
    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
    var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var div_output = $('#contenido');
    
    $.ajax({
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading("hide");
        },
        url: archivoValidacion,
        data: {
            'accion': 'queryEvento', 'evento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();

        	$.each(data, function(i,item){ 
        		if (!$.isEmptyObject(item.eve_facebook) || !$.isEmptyObject(item.eve_facebook) || !$.isEmptyObject(item.eve_pagina_web)) {
	        		output = '<div class="ui-body ui-body-a ui-corner-all ">';
	        		output += '<div data-role="controlgroup" data-type="horizontal">';
	        		if (!$.isEmptyObject(item.eve_facebook)) {
	        			output += '<a id="btnFb" href="' + item.eve_facebook + '" class="ui-corner-all"> \
	        				<img alt="home" src="../images/facebook.png" /></a>';
	        			
	        			
	        		}
	        		if (!$.isEmptyObject(item.eve_twitter)) {
	        			output += '<a href="' + item.eve_twitter + '" class="ui-corner-all"> \
	        				<img alt="home" src="../images/twitter.png" /></a>';
	        		}
	        		if (!$.isEmptyObject(item.eve_pagina_web)) {
	        			output += '<a id="btnWeb" rel="external"  href="' + item.eve_pagina_web + '" class="ui-corner-all"> \
	        				<img alt="home" src="../images/web.png" /></a>';
//	        			output += '<div id="btnWeb1" class="ui-corner-all"> \
//        				<img alt="home" src="../images/web.png" /></div>';
//	        			$('#btnWeb1').bind('tap', function(e) {
//	        				navigator.ChromeLauncher.open(item.eve_pagina_web)
//	        		    });
	        		}
	        		output += '</div>';
	        		output += '</div><br>';
//	        		$(document).on('click','a', function(e) {
//	                    e.preventDefault();
//	                    var elem = $(this);
//	                    var url = elem.attr('href');
//	                    if (url.indexOf('http://') !== -1) {
//	                        window.open(url, '_system');
//	                    }
//	                });
        		} else {
        			output = '';
        		}
        		output += '<div class="ui-body ui-body-a ui-corner-all ">';
				if (!$.isEmptyObject(item.eve_fecha_inicio)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Fecha recepcion de articulos:</label>';
            		output += '<spam id="identificacion">' + item.eve_recepcion_articulos + '</spam>';
                    output += '</li>';
            	}
				if (!$.isEmptyObject(item.eve_fecha_fin)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Fecha Inicio:</label>';
            		output += '<spam id="identificacion">' + item.eve_fecha_inicio + '</spam>';
                    output += '</li>';
            	}
				if (!$.isEmptyObject(item.eve_recepcion_articulos)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Fecha Fin:</label>';
            		output += '<spam id="identificacion">' + item.eve_fecha_fin + '</spam>';
                    output += '</li>';
            	}
				if (!$.isEmptyObject(item.eve_temas)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Temas:</label>';
            		output += '<spam id="identificacion">' + item.eve_temas + '</spam>';
                    output += '</li>';
            	}
				if (!$.isEmptyObject(item.eve_costos)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Costos:</label>';
            		output += '<spam id="identificacion">' + item.eve_costos + '</spam>';
                    output += '</li>';
            	}
				if (!$.isEmptyObject(item.eve_tipo)) {
            		output += '<li class="ui-field-contain">';
            		output += '<label for="identificacion">Tipo Evento:</label>';
            		output += '<spam id="identificacion">' + item.eve_tipo + '</spam>';
                    output += '</li>';
            	}
				output += '</div><br>';
				
				div_output.append(output);
				div_output.load();
        	});
        },
        error: function(){
            $.mobile.loading("hide");
            alert('Error conectando al servidor.');
        }
    });
	
});

$(document).on('pageinit','#signup',function(e){
	getIpPortserver();
    $('#btn-submit').bind('tap', function() {
    	var err = false;
    	var txtFirstName = $("#txt-first-name").val();
    	var txtLastName = $("#txt-last-name").val();
    	var txtEmail = $("#txt-email").val();
    	var txtPassword = $("#txt-password").val();
    	var txtPasswordConfirm = $("#txt-password-confirm").val();
    	
    	if ($.isEmptyObject(txtFirstName)) {
			$('#lblName').addClass('missing');
			err = true;
		} else {
			$('#lblName').removeClass('missing');
		}
    	if ($.isEmptyObject(txtLastName)) {
			$('#lblLastName').addClass('missing');
			err = true;
		} else {
			$('#lblLastName').removeClass('missing');
		}
    	if ($.isEmptyObject(txtEmail)) {
			$('#lblEmail').addClass('missing');
			err = true;
		} else {
			$('#lblEmail').removeClass('missing');
		}
    	if ($.isEmptyObject(txtPassword) || $.isEmptyObject(txtPasswordConfirm) || (txtPassword != txtPasswordConfirm)) {
    		$('#lblClave').addClass('missing');
    		$('#lblConfirmClave').addClass('missing');
    		err = true;
    	} else {
			$('#lblClave').removeClass('missing');
			$('#lblConfirmClave').removeClass('missing');
		}
    	if (!err) {
    	    var accion = '&accion=signup';
    	    var formData = $("#frmSignup").serialize() + accion;
    	    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/login.php?jsoncallback=?";

    	    $.ajax({
    	        url: urlServer,
    	        type: 'POST',
    	        data: formData,
    	        cache: false,
    	        dataType: 'jsonp',
    	        jsonp: 'jsoncallback',
    	        success: function(data, textStatus, jqXHR) {
    	            if(typeof data.error === 'undefined') {
    	            	$( "#dlg-sign-up-sent" ).popup( "open" );
    	            } else {
    	            	$( "#dlg-sign-up-error" ).popup( "open" );
    	                console.log('ERRORS: ' + data.error);
    	            }
    	        },
    	        error: function(jqXHR, textStatus, errorThrown) {
    	            console.log('ERRORS: ' + textStatus);
    	            $.mobile.loading( "hide" );
    	        },
    	        complete: function() {
    	        	$.mobile.loading( "hide" );
    	        },
    	        beforeSend: function() {
    	            showLoading();
    	        }
    	    });
    	}
    });
});

$(document).on('pageinit','#signin',function(e){
	getIpPortserver();
    $('#btn-submit').bind('tap', function() {
    	var accion = '&accion=signin';
	    var formData = $("#frmSignin").serialize() + accion;
	    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/login.php?jsoncallback=?";

	    $.ajax({
	        url: urlServer,
	        type: 'POST',
	        data: formData,
	        cache: false,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        success: function(data, textStatus, jqXHR) {
	            if(typeof data.error === 'undefined') {
	            	usu_perfil = data.usu_perfil;
	            	idUsuario = data.idUsuario;
	            	window.localStorage.setItem('usu_perfil', data.usu_perfil);
	            	window.localStorage.setItem('idUsuario', data.idUsuario);
	            	window.localStorage.setItem('activeUsuario', data.idUsuario);
	            	window.location = "../index.html";
	            } else {
	            	$( "#dlg-invalid-credentials" ).popup( "open" );
	                console.log('ERRORS: ' + data.error);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('ERRORS: ' + textStatus);
	            $.mobile.loading( "hide" );
	        },
	        complete: function() {
	        	$.mobile.loading( "hide" );
	        },
	        beforeSend: function() {
	            showLoading();
	        }
	    });
    });
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
    
    if (activeEvent != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?&id="+ activeEvent+ "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?files";
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
			console.log('ERRORS: ' + textStatus + errorThrown + " " + jqXHR.responseText);
		}
    });
    
    return false;
}

function submitForm(event, data) {
    $form = $(event.target);
    activeEvent = window.localStorage.getItem('activeEvent');
    var accion = '&accion=new_evento';
    if (activeEvent != -1) {
    	accion = '&accion=update_evento&id='+ activeEvent;
    }
    
    var formData = $form.serialize() + accion;

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";

    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, textStatus, jqXHR) {
            if(typeof data.error === 'undefined') {
//                $.mobile.changePage("../index.html");
            	window.history.back();
            } else {
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus+ " " + jqXHR.responseText);
            $.mobile.loading( "hide" );
        },
        complete: function() {
        	$.mobile.loading( "hide" );
        }
    });
    return false;
}

function getEvento() {
	getIpPortserver();
	idUsuario = window.localStorage.getItem('idUsuario');
    
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
    var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#event_content');
    
    $.ajax({
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading("hide");
        },
        url: urlServer,
        data: {
            'accion': 'queryEvento', 'evento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){ 
                output += '<div id="evento'+ (i + 1) +'" class="ui-body ui-body-a">';
                if ($.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="banner2">';
                } else {
                    output += '<div class="banner">';
                }
                output += '<div class="date_event">';
                var fecha = new Date(item.eve_fecha_inicio);
                output += '<p>' + fecha.getUTCDate() + ' <span data-i18n>dates.short' + (fecha.getMonth() +1) + '</span></p>';
                output += '</div>';
                output += '</div>';
                if (!$.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.eve_imagen + '" />';
                    if (!$.isEmptyObject(item.eve_titulo_imagen)) {
                        output += '<h2>' + item.eve_titulo_imagen + '</h2>';
                    }
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p>' + item.eve_nombre + '</p>';
                output += '</div>';
                
                $("#description_content").append(item.eve_descripcion);
                div_output.append(output);
                div_output.load();
            });
            $("span").i18n();
        },
        error: function(){
        	div_output.empty();
            $.mobile.loading("hide");
            alert('Error conectando al servidor.');
        }
    });
    
    $.ajax({
		url: urlServer,
		type: 'POST',
		data: {'accion': 'query_subscribir_evento', idEvento: activeEvent, idUsuario: idUsuario},
		cache: false,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		success: function(data, textStatus, jqXHR) {
			if(typeof data.error === 'undefined') {
				$.each(data, function(i,item){ 
					if (!$.isEmptyObject(item.estado)) {
						$('#btn_subscribe').hide();
					}
				});
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
}

function getEvents() {
	getIpPortserver();

    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
    var httpImagen = "http://" + text_ip + ":" + text_puerto  + "/web/eventos/";
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
            'accion': 'queryEventos'
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
            $('#event_home').empty();
            if ($.isEmptyObject(data)) {
            	output = '<br />';
            	output += '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron Eventos para mostrar en la Base de Datos</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            $.each(data, function(i,item){
                if (i != 0) {
                    output = '<br />';
                }
                output += '<div id="evento'+ item.idEvento +'" class="ui-body ui-body-a ui-corner-all ">';
                if ($.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="banner2">';
                } else {
                    output += '<div class="banner">';
                }
                output += '<div class="date_event">';
                var fecha = new Date(item.eve_fecha_inicio);
                output += '<p>' + fecha.getUTCDate() + ' <span data-i18n>dates.short' + (fecha.getMonth() +1) + '</span></p>';
                output += '</div>';
                output += '</div>';
                if (!$.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.eve_imagen + '" />';
                    if (!$.isEmptyObject(item.eve_titulo_imagen)) {
                        output += '<h2>' + item.eve_titulo_imagen + '</h2>';
                    }
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p>' + item.eve_nombre + '</p>';
                output += '</div>';
                div_output.append(output);
                $("#event_home").load();
                $('#evento' + item.idEvento).bind('tap', function(e) {
                	window.localStorage.setItem('activeEvent', item.idEvento);
//                    $.mobile.changePage( "./pages/evento.html");
                	window.location = "./pages/evento.html";
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

function getMisEvents() {
	getIpPortserver();
	idUsuario = window.localStorage.getItem('idUsuario');
	
    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_evento.php?jsoncallback=?";
    var httpImagen = "http://" + text_ip + ":" + text_puerto  + "/web/eventos/";
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
            'accion': 'query_mis_eventos', idUsuario: idUsuario
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
            $('#event_home').empty();
            if ($.isEmptyObject(data)) {
            	output = '<br />';
            	output += '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron Eventos para mostrar en la Base de Datos</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            $.each(data, function(i,item){
                if (i != 0) {
                    output = '<br />';
                }
                output += '<div id="evento'+ item.idEvento +'" class="ui-body ui-body-a ui-corner-all ">';
                if ($.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="banner2">';
                } else {
                    output += '<div class="banner">';
                }
                output += '<div class="date_event">';
                var fecha = new Date(item.eve_fecha_inicio);
                output += '<p>' + fecha.getUTCDate() + ' <span data-i18n>dates.short' + (fecha.getMonth() +1) + '</span></p>';
                output += '</div>';
                output += '</div>';
                if (!$.isEmptyObject(item.eve_imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.eve_imagen + '" />';
                    if (!$.isEmptyObject(item.eve_titulo_imagen)) {
                        output += '<h2>' + item.eve_titulo_imagen + '</h2>';
                    }
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p>' + item.eve_nombre + '</p>';
                output += '</div>';
                div_output.append(output);
                $("#event_home").load();
                $('#evento' + item.idEvento).bind('tap', function(e) {
                	window.localStorage.setItem('activeEvent', item.idEvento);
                	window.location = "./pages/evento.html";
                });
            });
            output = '<a href="#" id="ver_todos" class="ui-btn ui-btn-b ui-corner-all mc-top-margin-1-5">Ver Todos</a>';
            
            div_output.append(output);
            $("#event_home").load();
            $("#ver_todos").bind( "tap", function(e) {
            	getIpPortserver();
            	getEvents();
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
			$("#menu_asistente_ponente").hide();
			$("#menu_coordinador").hide();
			
			$("#btn_menu_home").hide();
			$("#btnNewEvento").hide();
			$("#btn_edit_evento").hide();
			$("#btn_deleteEvento").hide();
			$("#btn_subscribe").hide();
			$("#btn_inscripcion").hide();
			$("#btn_filtro").hide();
		}
		if (usu_perfil == 1) {
			$("#btn_subscribe").hide();
			$("#menu_invitado").hide();
			$("#menu_asistente_ponente").hide();
		}
		if (usu_perfil == 2) {
			$("#menu_invitado").hide();
			$("#menu_asistente_ponente").hide();
		}
		if (usu_perfil == 3) {
			$("#btnNewEvento").hide();
			$("#btn_edit_evento").hide();
			$("#btn_deleteEvento").hide();
			$("#btn_inscripcion").hide();
			
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
			$("#btnNewEvento").hide();
			$("#btn_edit_evento").hide();
			$("#btn_deleteEvento").hide();
			$("#btn_inscripcion").hide();
			
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



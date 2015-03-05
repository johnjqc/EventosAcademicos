var text_ip = '';
var text_puerto = '';
var activeEncuesta; //id del encuesta seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var idUsuario;
var usu_perfil;

$(function() {
	security();
	$('#frm_new_encuesta').on('submit', submitForm_newencuesta);
	$('#frm_encuesta').on('submit', submitForm_encuesta);
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
});



$(document).on('pageinit','#pageencuesta',function(e) {
	window.localStorage.setItem('activeEncuesta', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listEncuestas');
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_encuestas', 'evento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output += '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron registros en la Base de Datos para mostrar</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            $.each(data, function(i,item){
            	output = '<li><a data-ajax="false" id="encuesta' + item.idEncuesta + '" href="g_encuesta_q.html">' + item.enc_nombre + '</a></li>';
                div_output.append(output);
                div_output.listview("refresh");
                $('#encuesta' + item.idEncuesta).bind('tap', function(e) {
                	window.localStorage.setItem('activeEncuesta', item.idEncuesta);
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

$(document).on('pageinit','#page_encuesta_query',function(e){
	activeEncuesta = localStorage.getItem('activeEncuesta');
	activeEvent = window.localStorage.getItem('activeEvent');
    idUsuario = window.localStorage.getItem('idUsuario');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
	var urlServerPregunta = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_pregunta.php?jsoncallback=?";
	var output = "";
	var div_output= $('#respuestas');
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_encuesta', idEncuesta: activeEncuesta
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	$('#nombre').append(item.enc_nombre);
            	$('#nombre').load();
            	$('#descripcion').append(item.enc_descripcion);
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
    
    $('#btn_delete_encuesta').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_encuesta', id: activeEncuesta
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("encuesta eliminado exitosamente");
//            		$.mobile.navigate("g_encuesta.html");
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
    
    var respuestas;
    
    $.ajax({
        url: urlServerPregunta,
        data: {
            'accion': 'query_respuestas', idEncuesta: activeEncuesta, idEvento: activeEvent, idUsuario: idUsuario
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	if(typeof data.error === 'undefined') {
        		respuestas = data;
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
    
    $.ajax({
        url: urlServerPregunta,
        data: {
            'accion': 'query_preguntas', idEncuesta: activeEncuesta
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	if(typeof data.error === 'undefined') {
        		if ($.isEmptyObject(data)) {
                	output = '<div class="ui-body ui-body-a ui-corner-all ">';
                	output += '<p>No se encontraron registros en la Base de Datos para mostrar</p>';
                    output += '</div>';
                    div_output.append(output);
                    div_output.load();
                }
        		if ($.isEmptyObject(respuestas)) {
        			$.each(data, function(i,item){
        				if (item.pre_tipo == 1) {
                    		output = '<li class="ui-field-contain">';
                    		output += '<label for="identificacion">' + item.pre_pregunta + '</label>';
                    		output += '<spam id="identificacion"><textarea name="t_respuesta_' + item.idPregunta + '" id="t_respuesta_' + item.idPregunta + '" data-enhanced="true" class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all"></textarea>';
                            output += '</spam></li>';
                    	}
        				if (item.pre_tipo == 2) {
                    		output = '<li class="ui-field-contain">';
                    		output += '<label for="identificacion">' + item.pre_pregunta + '</label>';
                    		output += '<spam id="identificacion"><fieldset data-role="controlgroup">';
                    		output += '<input name="t_respuesta_' + item.idPregunta + '" id="radio-choice' + item.idPregunta + '-1" value="1" type="radio">';
                    		output += '<label for="radio-choice' + item.idPregunta + '-1">Si</label>';
                    		output += '<input name="t_respuesta_' + item.idPregunta + '" id="radio-choice' + item.idPregunta + '-2" value="0" type="radio">';
                    		output += '<label for="radio-choice' + item.idPregunta + '-2">No</label>';
                            output += '</fieldset></spam>';
                            output += '</li>';
                    	}
        				div_output.append(output);
                        div_output.load();
                        $("input[type='radio']").checkboxradio().checkboxradio("refresh");
                    });
        			var button = $('<input id="btn_encuesta" type="submit" data-theme="b" name="submit" id="submit_new_contacto" value="Submit">');
                    div_output.append(button);
                    button.button();
        		} else {
        			$.each(respuestas, function(i,item){
        				if (item.pre_tipo == 1) {
                    		output = '<li class="ui-field-contain">';
                    		output += '<label for="identificacion">' + item.pre_pregunta + '</label>';
                    		output += '<spam id="identificacion"><textarea name="t_respuesta_' + item.idPregunta + '" id="t_respuesta_' + item.idPregunta + '" data-enhanced="true" class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all">' + item.res_abierta + '</textarea>';
                            output += '</spam></li>';
                    	}
        				if (item.pre_tipo == 2) {
        					var chk0 = '';
        					var chk2 = '';
        					if (item.res_multiple == 0) {
        						chk0 = 'checked="checked"';
        					} else {
        						chk0 = '';
        					}
        					if (item.res_multiple == 1) {
        						chk1 = 'checked="checked"';
        					} else {
        						chk1 = '';
        					}
                    		output = '<li class="ui-field-contain">';
                    		output += '<label for="identificacion">' + item.pre_pregunta + '</label>';
                    		output += '<spam id="identificacion"><fieldset data-role="controlgroup">';
                    		output += '<input name="t_respuesta_' + item.idPregunta + '" id="radio-choice' + item.idPregunta + '-1" value="1" ' + chk1 + ' disabled="disabled" type="radio">';
                    		output += '<label for="radio-choice' + item.idPregunta + '-1">Si</label>';
                    		output += '<input name="t_respuesta_' + item.idPregunta + '" id="radio-choice' + item.idPregunta + '-2" value="0" ' + chk0 + ' disabled="disabled" type="radio">';
                    		output += '<label for="radio-choice' + item.idPregunta + '-2">No</label>';
                            output += '</fieldset></spam>';
                            output += '</li>';
                    	}
        				div_output.append(output);
                        div_output.load();
                        $("input[type='radio']").checkboxradio().checkboxradio("refresh");
        			});
        		}
        		
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

$(document).on('pageinit','#crud_encuesta',function(e){
	activeEncuesta = window.localStorage.getItem('activeEncuesta');
	
	if (activeEncuesta != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_encuesta', idEncuesta: activeEncuesta
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item){ 
		        		$("#t_nombre").val(item.enc_nombre);
		        		$("#t_descripcion").val(item.enc_descripcion);
		        	});
	        	} else {
	                console.log('ERRORS: ' + data.error);
	            }
	        },
	        beforeSend: function(){
	            showLoading();
	        },
	        complete: function(){
	            $.mobile.loading("hide");
	        },
	        error: function(){
	            $.mobile.loading("hide");
	            alert('Error conectando al servidor.');
	        }
	    });
	}
});

function submitForm_newencuesta(event) {
    activeEncuesta = window.localStorage.getItem('activeEncuesta');
    activeEvent = window.localStorage.getItem('activeEvent');
    var accion = '&accion=new_encuesta&evento=' + activeEvent;
    if (activeEncuesta != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_encuesta&idEncuesta='+ activeEncuesta;
    }
    
    var formData = $('#frm_new_encuesta').serialize() + accion;
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_encuesta.php?jsoncallback=?";
    
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

function submitForm_encuesta(event) {
    activeEncuesta = window.localStorage.getItem('activeEncuesta');
    activeEvent = window.localStorage.getItem('activeEvent');
    idUsuario = window.localStorage.getItem('idUsuario');
    var accion = '&accion=new_encuesta&idEvento=' + activeEvent + '&idEncuesta=' + activeEncuesta + '&idUsuario=' + idUsuario;
        
    var formData = $('#frm_encuesta').serialize() + accion;
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_pregunta.php?jsoncallback=?";
    
    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, textStatus, jqXHR) {
            if(typeof data.error === 'undefined') {
//            	window.history.back();
            	location.reload();
            } else {
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
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
			$("#btn_edit_pregunta").hide();
			$("#btn_edit_encuesta").hide();
			$("#btn_confirm_delete_encuesta").hide();
			
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
			$("#btn_edit_pregunta").hide();
			$("#btn_edit_encuesta").hide();
			$("#btn_confirm_delete_encuesta").hide();
			
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



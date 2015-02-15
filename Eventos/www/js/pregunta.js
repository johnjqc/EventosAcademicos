var text_ip = '';
var text_puerto = '';
var activePregunta; //id del pregunta seleccionado para ver detalles o edicion
var activeEncuesta;
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_pregunta').on('submit', submitForm_newpregunta);
});

$(document).on('pageinit','#pagepregunta',function(e) {
	window.localStorage.setItem('activePregunta', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	activeEncuesta = window.localStorage.getItem('activeEncuesta');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_pregunta.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listpreguntas');
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_preguntas', idEncuesta: activeEncuesta
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
            	output = '<li><a data-ajax="false" id="pregunta' + item.idPregunta + '" href="g_pregunta_q.html">' + item.pre_pregunta + '</a></li>';
                div_output.append(output);
                div_output.listview("refresh");
                $('#pregunta' + item.idPregunta).bind('tap', function(e) {
                	window.localStorage.setItem('activePregunta', item.idPregunta);
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

$(document).on('pageinit','#page_pregunta_query',function(e){
	activePregunta = localStorage.getItem('activePregunta');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_pregunta.php?jsoncallback=?";

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_pregunta', idPregunta: activePregunta
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	$('#nombre').append(item.pre_pregunta);
            	$('#nombre').load();
            	if (item.pre_tipo == 1) {
            		$('#descripcion').append("Tipo de pregunta: Abierta");
            	}
            	if (item.pre_tipo == 2) {
            		$('#descripcion').append("Tipo de pregunta: Verdadero - Falso");
            	}
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
    
    $('#btn_delete_pregunta').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_pregunta', idPregunta: activePregunta
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Pregunta eliminada exitosamente");
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

$(document).on('pageinit','#crud_pregunta',function(e){
	activePregunta = window.localStorage.getItem('activePregunta');
	
	if (activePregunta != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_pregunta.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_pregunta', idPregunta: activePregunta
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item) {
		        		$("#t_pregunta").val(item.pre_pregunta);
		        		$("#t_tipo").val(item.pre_tipo).selectmenu('refresh');;
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

function submitForm_newpregunta(event) {
    activePregunta = window.localStorage.getItem('activePregunta');
    activeEncuesta = window.localStorage.getItem('activeEncuesta');
    var accion = '&accion=new_pregunta&idEncuesta=' + activeEncuesta;
    if (activePregunta != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_pregunta&idPregunta='+ activePregunta;
    }
    
    var formData = $('#frm_new_pregunta').serialize() + accion;
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
		if (usu_perfil != -1) {
			
		}
	}
}



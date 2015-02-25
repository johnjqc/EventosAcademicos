var mainloaded = false;
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
	$('input[type=file]').on('change', prepareUpload);
	$('#frm_new_patrocinador').on('submit', uploadFiles);
});



$(document).on('pageinit','#page_patrocinadores',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activePatrocinador', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listPatrocinadores');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_patrocinadores', 'evento': activeEvent
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
            	output = '<li id="patrocinador' + item.idPatrocinador + '"><a data-ajax="false" href="g_patrocinador_q.html">';
            	if (!$.isEmptyObject(item.pat_imagen)) {
            		output += '<img src="' + httpImagen + item.pat_imagen + '">';
            	}
            	
        		output += '' + item.pat_nombre + '';
    			output += '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#patrocinador' + (item.idPatrocinador)).bind('tap', function(e) {
                	window.localStorage.setItem('activePatrocinador', item.idPatrocinador);
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

$(document).on('pageinit','#page_patrociandor_query',function(e){
	activePatrocinador = localStorage.getItem('activePatrocinador');
	activeEvent = window.localStorage.getItem('activeEvent');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var output = "";
	var div_output= $('#patrocinador_content');
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_patrocinador', idPatrocinador: activePatrocinador
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
                if (!$.isEmptyObject(item.pat_imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.pat_imagen + '" />';
                    
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p><h1>' + item.pat_nombre + '</h1></p>';
                output += '<p>' + item.pat_descripcion + '</p>';
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
    
    $('#btn_delete_patrocinador').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_patrocinador', idPatrocinador: activePatrocinador
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Patrocinador eliminado exitosamente");
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

$(document).on('pageinit','#page_patrocinador_new',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activePatrocinador = localStorage.getItem('activePatrocinador');
	
	if (activePatrocinador != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";
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
	            'accion': 'query_patrocinador', 'idPatrocinador': activePatrocinador
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
	        	$.each(data, function(i,item){ 
	        		$("#t_nombre").val(item.pat_nombre);
	        		$("#t_descripcion").val(item.pat_descripcion);
	        		
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
    
    if (activePatrocinador != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?&idPatrocinador="+ activePatrocinador+ "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?files";
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
    activePatrocinador = window.localStorage.getItem('activePatrocinador');
    var accion = '&accion=new_patrocinador';
    if (activePatrocinador != -1) {
    	accion = '&accion=update_patrocinador&idPatrocinador='+ activePatrocinador;
    }
    
    var formData = $form.serialize() + accion;

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_patrocinador.php?jsoncallback=?";

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
			$("#btn_edit_comite").hide();
			$("#btn_delete_comite").hide();
		}
		if (usu_perfil == 3) {
			$("#btn_edit_comite").hide();
			$("#btn_delete_comite").hide();
		}
		if (usu_perfil == 4) {
			$("#btn_edit_comite").hide();
			$("#btn_delete_comite").hide();
		}
	}
}

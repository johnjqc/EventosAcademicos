var text_ip = '';
var text_puerto = '';
var activeGaleria; //id del galeria seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_galeria').on('submit', submitForm_newgaleria);
});

$(document).on('pageinit','#pagegaleria',function(e) {
	window.localStorage.setItem('activeGaleria', -1);
	window.localStorage.setItem('activeImagen', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_galeria.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listgalerias');
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_galerias', 'evento': activeEvent
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
            	output = '<li><a data-ajax="false" id="galeria' + item.idGaleria + '" href="g_galeria_q.html">' + item.gal_nombre + '</a></li>';
                div_output.append(output);
                div_output.listview("refresh");
                $('#galeria' + item.idGaleria).bind('tap', function(e) {
                	window.localStorage.setItem('activeGaleria', item.idGaleria);
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

$(document).on('pageinit','#page_galeria_query',function(e){
	activeGaleria = localStorage.getItem('activeGaleria');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_galeria.php?jsoncallback=?";
	var urlImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos";

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_galeria', galeria: activeGaleria
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	$('#nombre').append(item.gal_nombre);
            	$('#nombre').load();
            	$('#descripcion').append(item.gal_descripcion);
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
    
    var grid = $("#galleryGrid");
    var output = "";
    
    $.ajax({
        url: urlImagen,
        data: {
            'accion': 'query_imagenes', idGaleria: activeGaleria
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	grid.empty();
//        	grid.append('<div class="ui-grid-b">');
        	
            $.each(data, function(i,item) {
            	var posicionGrid;
            	if ((i+1) % 3 == 1) {
            		posicionGrid = 'a';
            	}
            	if ((i+1) % 3 == 2) {
            		posicionGrid = 'b';
            	}
            	if ((i+1) % 3 == 0) {
            		posicionGrid = 'c';
            	}
//            	if (i % 4 == 0) {
//            		posicionGrid = 'd';
//            	}
            	
        		output = '<div class="ui-block-' + posicionGrid + '" id="imagen' + item.idImagen + '">';
        		output += '<div class="ui-body ui-body-' + posicionGrid + '">';
        		output += '<img alt="speaker" src="' + httpImagen + item.img_imagen + '" style="width: auto; max-width: 100%;" />';
        		output += '</div>';
        		output += '</div>';
        		grid.append(output);
        		grid.load();
				$('#imagen' + item.idImagen).bind('tap', function(e) {
                	window.localStorage.setItem('activeImagen', item.idImagen);
                	window.location = "g_imagen_q.html";
                });
            });
//        	grid.append('</div>');
        	grid.load();
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(){
        	grid.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    $('#btn_delete_galeria').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_galeria', id: activeGaleria
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("galeria eliminado exitosamente");
//            		$.mobile.navigate("g_galeria.html");
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

$(document).on('pageinit','#crud_galeria',function(e){
	activeGaleria = window.localStorage.getItem('activeGaleria');
	
	if (activeGaleria != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_galeria.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_galeria', 'galeria': activeGaleria
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item){ 
		        		$("#t_nombre").val(item.gal_nombre);
		        		$("#t_descripcion").val(item.gal_descripcion);
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

function submitForm_newgaleria(event) {
    activeGaleria = window.localStorage.getItem('activeGaleria');
    activeEvent = window.localStorage.getItem('activeEvent');
    var accion = '&accion=new_galeria&evento=' + activeEvent;
    if (activeGaleria != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_galeria&id='+ activeGaleria;
    }
    
    var formData = $('#frm_new_galeria').serialize() + accion;
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_galeria.php?jsoncallback=?";
    
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
			$("#btn_new_galeria").hide();
			$("#btn_new_imagen").hide();
			$("#btn_confirm_delete_galeria").hide();
			$("#btn_edit_galeria").hide();
			
		}
	}
}



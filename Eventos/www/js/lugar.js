var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activeLugar;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security(); 
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	$('input[type=file]').on('change', prepareUpload);
	$('#frm_new_lugar').on('submit', uploadFiles);
});



$(document).on('pageinit','#page_lugares',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeLugar', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listlugares');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_lugares'
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
            	output = '<li id="lugar' + item.idLugar + '"><a href="g_lugar_q.html">';
            	if (!$.isEmptyObject(item.lug_imagen)) {
            		output += '<img src="' + httpImagen + item.lug_imagen + '">';
            	}
            	
        		output += '' + item.lug_nombre + '';
    			output += '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#lugar' + (item.idLugar)).bind('tap', function(e) {
                	window.localStorage.setItem('activeLugar', item.idLugar);
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

$(document).on('pageinit','#page_lugar_query',function(e){
	activeLugar = localStorage.getItem('activeLugar');
	activeEvent = window.localStorage.getItem('activeEvent');
//	$('#map_canvas').gmap({ 'center': '42.345573,-71.098326' });
//	$('#map_canvas').gmap('option', 'zoom', 12);
//	$('#map_canvas').gmap('addMarker', { /*id:'m_1',*/ 'position': '42.345573,-71.098326', 'bounds': false } );

	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var output = "";
	var div_output= $('#lugar_content');
	var latitud;
    var longitud;
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_lugar', idLugar: activeLugar
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<div class="ui-body ui-body-a ui-corner-all ">';
                if (!$.isEmptyObject(item.lug_imagen)) {
                    output += '<div class="card-image">';
                    output += '<img alt="home" src="' + httpImagen + item.lug_imagen + '" />';
                    
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
                output += '<p><h1>' + item.lug_nombre + '</h1></p>';
                output += '<p>' + item.lug_descripcion + '</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
                
                if (!$.isEmptyObject(item.lug_latitud) && !$.isEmptyObject(item.lug_longitud)) {
                	var location = new google.maps.LatLng(item.lug_latitud, item.lug_longitud);
                    var mapOptions = { zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP, center: location };
                    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                    var marker = new google.maps.Marker({map:map, animation: google.maps.Animation.DROP, position: location });
                } 
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
    
    
    
    
    $('#btn_delete_lugar').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_lugar', idLugar: activeLugar
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("lugar eliminado exitosamente");
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

$(document).on('pageinit','#page_lugar_new',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeLugar = localStorage.getItem('activeLugar');
	
	if (activeLugar != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?jsoncallback=?";
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
	            'accion': 'query_lugar', 'idLugar': activeLugar
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
	        	$.each(data, function(i,item){ 
	        		$("#t_nombre").val(item.lug_nombre);
	        		$("#t_descripcion").val(item.lug_descripcion);
	        		$("#t_direccion").val(item.lug_direccion);
	        		$("#t_latitud").val(item.lug_latitud);
	        		$("#t_longitud").val(item.lug_longitud);
	        		
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
    
    if (activeLugar != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?&idLugar="+ activeLugar+ "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?files";
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
			console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
		}
    });
    
    return false;
}

function submitForm(event, data) {
    $form = $(event.target);
    activeLugar = window.localStorage.getItem('activeLugar');
    var accion = '&accion=new_lugar';
    if (activeLugar != -1) {
    	accion = '&accion=update_lugar&idLugar='+ activeLugar;
    }
    
    var formData = $form.serialize() + accion;

    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();

    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_lugar.php?jsoncallback=?";

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
            console.log('ERRORS: ' + textStatus+ " " + jqXHR.responseText);
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
			$("#btn_new_lugar").hide();
			$("#btn_confirm_delete_lugar").hide();
			$("#btn_edit_lugar").hide();
		}
		if (usu_perfil == 3) {
			$("#btn_new_lugar").hide();
			$("#btn_confirm_delete_lugar").hide();
			$("#btn_edit_lugar").hide();
		}
		if (usu_perfil == 4) {
			$("#btn_new_lugar").hide();
			$("#btn_confirm_delete_lugar").hide();
			$("#btn_edit_lugar").hide();
		}
	}
}

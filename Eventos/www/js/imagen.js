var text_ip = '';
var text_puerto = '';
var activeGaleria; //id del imagen seleccionado para ver detalles o edicion
var activeImagen;
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

var files;

$(function() {
	security();
	$('#frm_new_imagen').on('submit', uploadFiles);
	$('input[type=file]').on('change', prepareUpload);
});

$(document).on('pageinit','#page_imagen_query',function(e){
	activeImagen = localStorage.getItem('activeImagen');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos";
	var div_output= $('#imagen_content');
	var output = "";
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_imagen', idImagen: activeImagen
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
            $.each(data, function(i,item){
                if (!$.isEmptyObject(item.img_imagen)) {
                    output += '<div class="card-image-img">';
                    output += '<img alt="home" src="' + httpImagen + item.img_imagen + '" />';
                    
                    output += '</div>';
                    output += '<div class="card-separator"></div>';
                }
				output += '<div class="ui-body ui-body-a ui-corner-all ">';
                output += '<p><h1>' + item.img_nombre + '</h1></p>';
                output += '<p>' + item.img_descripcion + '</p>';
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
        	div_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
        
    $('#btn_delete_imagen').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_imagen', id: activeImagen
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("imagen eliminada exitosamente");
//            		$.mobile.navigate("g_imagen.html");
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

$(document).on('pageinit','#crud_imagen',function(e){
	activeImagen = window.localStorage.getItem('activeImagen');
	
	if (activeImagen != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_imagen', 'idImagen': activeImagen
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item){ 
		        		$("#t_nombre").val(item.img_nombre);
		        		$("#t_descripcion").val(item.img_descripcion);
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
    
    if (activeImagen != -1) {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?&idImagen="+ activeImagen + "&files";
    } else {
    	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?files";
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
				submitForm_newimagen(event, data);
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

function submitForm_newimagen(event, data) {
    activeImagen = window.localStorage.getItem('activeImagen');
    activeEvent = window.localStorage.getItem('activeEvent');
    activeGaleria = window.localStorage.getItem('activeGaleria');
    
    var accion = '&accion=new_imagen&id=' + activeGaleria;
    if (activeImagen != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_imagen&id='+ activeImagen;
    }
    
    var formData = $('#frm_new_imagen').serialize() + accion;
    
    $.each(data.files, function(key, value) {
        formData = formData + '&filenames[]=' + value;
    });
    
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_imagen.php?jsoncallback=?";
    
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
			$("#btn_confirm_delete_imagen").hide();
			$("#btn_edit_imagen").hide();
		}
	}
}



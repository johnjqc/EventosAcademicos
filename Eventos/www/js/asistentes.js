var text_ip = '';
var text_puerto = '';
var activeAsistente;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
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
            	output = '<li><a href="#">';
            	output += '<img src="' + httpImagen + item.usu_imagen + '">';
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
    			output += '<p>' + item.usu_email + '</p></a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
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

//$(document).on('pageinit','#page_comite_query',function(e){
//	var param = $(this).data("url").split("?")[1];
//	if (!$.isEmptyObject(text_puerto)) {
//		activeComite = param.replace("id=", "");
//    }
//	
//	getIpPortserver();
//	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
//
//    $.ajax({
//        url: archivoValidacion,
//        data: {
//            'accion': 'query_comite', comite: activeComite
//        },
//        dataType: 'jsonp',
//        jsonp: 'jsoncallback',
//        timeout: 6000,
//        success: function(data, status){
//        	$('#nombre').empty();
//        	$('#descripcion').empty();
//        	
//            $.each(data, function(i,item){
//            	$('#nombre').append(item.com_nombre);
//            	
//            	$('#nombre').load();
//            	$('#descripcion').append(item.com_descripcion);
//            	$('#descripcion').load();
//            });
//        },
//        beforeSend: function(){
//            showLoading();
//        },
//        complete: function(){
//            $.mobile.loading( "hide" );
//        },
//        error: function(){
//        	$('#nombre').empty();
//        	$('#descripcion').empty();
//            $.mobile.loading( "hide" );
//            alert('Error conectando al servidor.');
//        }
//    });
//    
//    $('#btn_delete_comite').bind('tap', function(e) {
//    	$.ajax({
//            url: archivoValidacion,
//            data: {
//                'accion': 'delete_comite', id: activeComite
//            },
//            dataType: 'jsonp',
//            jsonp: 'jsoncallback',
//            timeout: 6000,
//            success: function(data, status){
//            	if(typeof data.error === 'undefined') {
//            		alert("Comite eliminado exitosamente");
//                	window.location = "comite.html";
//            	} else {
//                    console.log('ERRORS: ' + data.error);
//                }
//            },
//            beforeSend: function(){
//                showLoading();
//            },
//            complete: function(){
//                $.mobile.loading( "hide" );
//            },
//            error: function(){
//                $.mobile.loading( "hide" );
//                alert('Error conectando al servidor.');
//            }
//        });
//    });
//});
//
//function submitForm_newComite(event) {
//    $form = $(event.target);
//    activeComite = window.localStorage.getItem('activeComite');
//    var accion = '&accion=new_comite';
//    if (activeComite != -1) {
//    	accion = '&accion=update_comite&id='+ activeComite;
//    }
//    
//    var formData = $form.serialize() + accion;
//    getIpPortserver();
//    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
//    
//    $.ajax({
//        url: urlServer,
//        type: 'POST',
//        data: formData,
//        cache: false,
//        dataType: 'jsonp',
//        jsonp: 'jsoncallback',
//        success: function(data, textStatus, jqXHR) {
//            if(typeof data.error === 'undefined') {
//            	window.location = "comite.html";
//            } else {
//                console.log('ERRORS: ' + data.error);
//            }
//        },
//        error: function(jqXHR, textStatus, errorThrown) {
//            console.log('ERRORS: ' + textStatus);
//            $.mobile.loading( "hide" );
//        },
//        complete: function() {
//        	$.mobile.loading( "hide" );
//        }
//    });
//}

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



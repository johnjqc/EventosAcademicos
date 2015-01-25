var text_ip = '';
var text_puerto = '';
var activeComite; //id del comite seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_comite').on('submit', submitForm_newComite);
});

$(document).on('pageinit','#pageComite',function(e) {
	window.localStorage.setItem('activeComite', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listComites');
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_comites', 'evento': activeEvent
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
            	output = '<li><a data-ajax="false" id="comite' + item.idComite + '" href="g_comite_q.html">' + item.com_nombre + '</a></li>';
                div_output.append(output);
                div_output.listview("refresh");
                $('#comite' + item.idComite).bind('tap', function(e) {
                	window.localStorage.setItem('activeComite', item.idComite);
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

$(document).on('pageinit','#page_comite_query',function(e){
	activeComite = localStorage.getItem('activeComite');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_comite', comite: activeComite
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	$('#nombre').append(item.com_nombre);
            	$('#nombre').load();
            	$('#descripcion').append(item.com_descripcion);
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
    
    $('#btn_delete_comite').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_comite', id: activeComite
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Comite eliminado exitosamente");
//            		$.mobile.navigate("g_comite.html");
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

$(document).on('pageinit','#crud_comite',function(e){
	activeComite = window.localStorage.getItem('activeComite');
	
	if (activeComite != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_comite', 'comite': activeComite
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item){ 
		        		$("#t_nombre").val(item.com_nombre);
		        		$("#t_descripcion").val(item.com_descripcion);
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

function submitForm_newComite(event) {
    activeComite = window.localStorage.getItem('activeComite');
    activeEvent = window.localStorage.getItem('activeEvent');
    var accion = '&accion=new_comite&evento=' + activeEvent;
    if (activeComite != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_comite&id='+ activeComite;
    }
    
    var formData = $('#frm_new_comite').serialize() + accion;
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_comite.php?jsoncallback=?";
    
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



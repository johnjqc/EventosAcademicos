var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activeAsistente;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security();
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
});



$(document).on('pageinit','#page_asistentes',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	window.localStorage.setItem('activeAsistente', -1);
	if (localStorage.getItem('idUsuario') != -1) {
		window.localStorage.setItem('activeUsuario', localStorage.getItem('idUsuario'));
	}
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_asistentes.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listAsistentes');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_asistentes', idEvento: activeEvent
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
            	output = '<li id="asistente' + item.idUsuario + '"><a data-ajax="false" href="g_usuario_q.html">';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2>';
    			output += '<p>' + item.usu_email + '</p></a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#asistente' + (item.idUsuario)).bind('tap', function(e) {
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



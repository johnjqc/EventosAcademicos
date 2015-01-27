var text_ip = '';
var text_puerto = '';
var activeAgenda;
var usu_perfil;

var files;

$(function() {
	security();
//	$('#frm_new_comite').on('submit', submitForm_newComite);
});

$(document).on('pageinit','#page_agenda',function(e){
	window.localStorage.setItem('activeAgenda', -1);
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
    var output = "";
    var div_output= $('#listAgenda');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_agenda'
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
            	output = '<li data-role="list-divider">Viernes, Octubre 8, 2015 <span class="ui-li-count">1</span></li>';
            	output += '<li><a href="index.html">';
            	output += '<h2>Recepcion</h2>';
            	output += '<p><strong>Registro de los asistentes</strong></p>';
            	output += '<p>Cafeteria</p>';
            	output += '<p class="ui-li-aside"><strong>10:30</strong>PM</p>';
            	output += '</a></li>';
                
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



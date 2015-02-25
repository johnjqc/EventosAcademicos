var text_ip = '';
var text_puerto = '';
var activeComite; //id del comite seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_contacto').on('submit', submitForm_newComite);
});

function submitForm_newComite(event) {
	getIpPortserver();
    activeEvent = window.localStorage.getItem('activeEvent');
    
    var accion = '&evento=' + activeEvent;
    
    var formData = $('#frm_new_contacto').serialize() + accion;
    
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/contacto.php";
    
    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        success: function(data, textStatus, jqXHR) {
        	alert("Mensaje enviado");
            window.history.back();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus + jqXHR.responseText);
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



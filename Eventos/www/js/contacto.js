var text_ip = '';
var text_puerto = '';
var activeComite; //id del comite seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_contacto').on('submit', submitForm_newComite);
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
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
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, textStatus, jqXHR) {
        	if(typeof data.error === 'undefined') {
        		alert("Mensaje enviado");
                window.history.back();
        	} else {
        		console.log('ERRORS: ' + data.error);
        		alert("Message sent ERROR!");
        	}
        	
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
		if (!$.isEmptyObject(usu_perfil)) {
			if (usu_perfil == 1) {
				$("#menu_invitado").hide();
				$("#menu_asistente_ponente").hide();
			}
			if (usu_perfil == 2) {
				$("#menu_invitado").hide();
				$("#menu_asistente_ponente").hide();
			}
			if (usu_perfil == 3) {
				$("#menu_invitado").hide();
				$("#menu_organizador").hide();
				$("#menu_coordinador").hide();
				$("#mnuComites").hide();
				$("#mnuEncuestas").hide();
				$("#mnuLugares").hide();
				$("#mnuPatrocinadores").hide();
				$("#mnuPublicaciones").hide();
				$("#mnuUsuarios").hide();
				$("#mnuInscripciones").hide();
			}
			if (usu_perfil == 4) {
				$("#menu_invitado").hide();
				$("#menu_organizador").hide();
				$("#menu_coordinador").hide();
				$("#mnuComites").hide();
				$("#mnuEncuestas").hide();
				$("#mnuLugares").hide();
				$("#mnuPatrocinadores").hide();
				$("#mnuUsuarios").hide();
				$("#mnuInscripciones").hide();
			}
		}
	}
}



<?php
	include 'database.php';
	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *'); 
	
	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$rows = array();
			$asunto = $_REQUEST['t_asunto'];
			$mensaje = $_REQUEST['t_mensaje'];
			
			$email_to = "johnquirogac@gmail.com";
			$email_subject = "Contacto de Eventos Academicos: ".$asunto; 
			
			$headers = "From: admin@eventosud.net63.net";
			mail($email_to, $email_subject, $mensaje, $headers);
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		
		
	}
	mysql_close($enlace);
	$enlace = false;
?>

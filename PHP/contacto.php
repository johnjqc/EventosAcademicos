<?php
	error_reporting(0);
	include 'database.php';
	header('Content-type: application/json');	
	date_default_timezone_set('Etc/UTC');
	require 'PHPMailer/PHPMailerAutoload.php';

	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$rows = array();
		$asunto = $_REQUEST['t_asunto'];
		$mensaje = $_REQUEST['t_mensaje'];
				
		$mail = new PHPMailer;
		$mail->isSMTP();
		$mail->SMTPDebug = 0;
		//$mail->Debugoutput = 'html';
		$mail->Host = '';
		$mail->Port = 25;
		$mail->SMTPAuth = true;
		$mail->Username = "";
		$mail->Password = "";
		$mail->setFrom('contacto@eventosud.com', 'Contacto Eventos');
		$mail->addReplyTo('contacto@eventosud.com', 'Contacto Eventos');
		$mail->addAddress('', 'John J');
		$mail->Subject = $asunto;
		$mail->Body    = $mensaje;
		//$mail->msgHTML(file_get_contents('contents.html'), dirname(__FILE__));
		$mail->AltBody = 'This is a plain-text message body';
		if (!$mail->send()) {
			$rows["error"] = $mail->ErrorInfo;
		} else {
			$rows["OK"] = "Message sent!";
		}
		
		
		$resultadosJson= json_encode($rows);
		echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
	}
	mysql_close($enlace);
	$enlace = false;
?>

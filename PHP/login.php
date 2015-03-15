<?php
	error_reporting(0);
	include 'database.php';
	header('Content-type: application/json');
	
	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		
		if ($accion == "signup" ) {
			$rows = array();
			$txtFirstName = $_REQUEST['txt-first-name'];
			$txtLastName = $_REQUEST['txt-last-name'];
			$txtEmail = $_REQUEST['txt-email'];
			$txtPassword = $_REQUEST['txt-password'];
			$perfil = $_REQUEST['perfil'];
			
			$res = mysql_query(" INSERT INTO usuario (usu_nombre, usu_apellido, usu_email , usu_contrasena, usu_perfil , usu_estado )  values ( '".$txtFirstName."', '".$txtLastName."', '".$txtEmail."', md5('".$txtPassword."'),'$perfil','1')") or $rows["error"] =mysql_error(); 
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "signin" ) {
			$rows = array();
			$txtEmail = $_REQUEST['txt-email'];
			$txtPassword = $_REQUEST['txt-password'];
			$res = mysql_query("SELECT * from usuario WHERE usu_email= '$txtEmail' and usu_contrasena=md5('$txtPassword')");
			
			while($r = mysql_fetch_assoc($res)) {
				$rows = $r;
			}
			
			if (empty($rows)){
				$rows["error"] = "not user found";
			}
					
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "resetpwd" ) {
			date_default_timezone_set('Etc/UTC');
			require 'PHPMailer/PHPMailerAutoload.php';
			
			$rows = array();
			$email = $_REQUEST['email'];
			$mensaje = $_REQUEST['t_mensaje'];
			$newpwd = time();
					
			$mail = new PHPMailer;
			$mail->isSMTP();
			$mail->SMTPDebug = 0;
			//$mail->Debugoutput = 'html';
			$mail->Host = 'smtp.alliensoft.com.co';
			$mail->Port = 25;
			$mail->SMTPAuth = true;
			$mail->Username = "pruebas.desarrollo@alliensoft.com.co";
			$mail->Password = "Abcd123456";
			$mail->setFrom('contacto@eventosud.com', 'Contacto Eventos');
			$mail->addReplyTo('contacto@eventosud.com', 'Contacto Eventos');
			$mail->addAddress($email, '');
			$mail->Subject = "Reset password Eventos Academicos";
			$mail->Body    = "Saludos apreciado usuario.<br><br>Tu nuevo password es: $newpwd";
			$mail->AltBody = 'This is a plain-text message body';
			if (!$mail->send()) {
				$rows["error"] = $mail->ErrorInfo;
			} else {
				$rows["OK"] = "Message sent!";
				mysql_query("UPDATE usuario SET usu_contrasena=md5('$newpwd') WHERE usu_email='$email'") or $rows["error"] =mysql_error();
			}
					
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "setnewpwd" ) {
			
		}
	}
	mysql_close($enlace);
	$enlace = false;
?>

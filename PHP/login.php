<?php
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
			
			$res = mysql_query(" INSERT INTO usuario (usu_nombre, usu_apellido, usu_email , usu_contrasena, usu_tipo , usu_perfil , usu_estado )  values ( '".$txtFirstName."', '".$txtLastName."', '".$txtEmail."', '".$txtPassword."','1','1','1')") or $rows["error"] =mysql_error(); 
			
			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "signin" ) {
			$rows = array();
			$txtEmail = $_REQUEST['txt-email'];
			$txtPassword = $_REQUEST['txt-password'];
			$res = mysql_query("SELECT * from usuario WHERE usu_email= '$txtEmail' and usu_contrasena='$txtPassword'");
			
			while($r = mysql_fetch_assoc($res)) {
				$rows = $r;
			}
			
			if (empty($rows)){
			
				$rows["error"] = "not user found";
			}
					
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;
?>
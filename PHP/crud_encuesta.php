<?php

	include 'database.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *'); 

	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		$data = array();
		$rows = array();
		
		if ($accion == "query_encuestas") {
			$sth = mysql_query("SELECT * from encuesta");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_encuesta" ) {
			$idEncuesta = $_GET['idEncuesta'];
			$sth = mysql_query("SELECT * from encuesta WHERE idEncuesta = '$idEncuesta'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
				
		if ($accion == "new_encuesta") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			
			$res = mysql_query("INSERT INTO encuesta (enc_nombre, enc_descripcion) VALUES ('$t_nombre', '$t_descripcion') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_encuesta") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			
			$nextId = $_REQUEST['idEncuesta']; 
			
			$res = mysql_query("UPDATE encuesta SET enc_nombre='$t_nombre', enc_descripcion='$t_descripcion' WHERE idEncuesta='$nextId'") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_encuesta") {
			$rows = array();
			$idEncuesta = $_REQUEST['idEncuesta'];
			
			$res = mysql_query("DELETE FROM encuesta WHERE idEncuesta='$idEncuesta'") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
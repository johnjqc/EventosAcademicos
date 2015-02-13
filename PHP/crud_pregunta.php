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
		
		if ($accion == "query_preguntas") {
			$idEncuesta = $_GET['idEncuesta'];
			$sth = mysql_query("SELECT * from pregunta where encuesta_idEncuesta = $idEncuesta");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_pregunta" ) {
			$idPregunta = $_GET['idPregunta'];
			$sth = mysql_query("SELECT * from pregunta WHERE idPregunta = '$idPregunta'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_pregunta") {
			$rows = array();
			
			$t_pregunta = $_REQUEST['t_pregunta'];
			$t_tipo = $_REQUEST['t_tipo'];
			
			$res = mysql_query("INSERT INTO pregunta (pre_pregunta, pre_tipo) VALUES ('$t_pregunta', '$t_tipo') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_pregunta") {
			$rows = array();
			
			$t_pregunta = $_REQUEST['t_pregunta'];
			$t_tipo = $_REQUEST['t_tipo'];
			
			$idPregunta = $_REQUEST['idPregunta']; 
			
			$res = mysql_query("UPDATE pregunta SET pre_pregunta='$t_pregunta', pre_tipo='$t_tipo' WHERE idPregunta='$idPregunta'") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_pregunta") {
			$rows = array();
			$idPregunta = $_REQUEST['idPregunta'];
			
			$res = mysql_query("DELETE FROM pregunta WHERE idPregunta='$idPregunta'") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
	}
	mysql_close($enlace);
	$enlace = false;

?>
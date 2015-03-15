<?php
	error_reporting(0);
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
		
		if ($accion == "query_inscripciones") {
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM usuario a JOIN usuario_has_evento b ON a.idUsuario = b.usuario_idUsuario AND evento_idEvento =$idEvento AND estado = 'pendiente'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_inscritos") {
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM usuario a JOIN usuario_has_evento b ON a.idUsuario = b.usuario_idUsuario AND evento_idEvento =$idEvento AND estado = 'activo'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
				
		if ($accion == "add_user_event") {
			$rows = array();
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
		
			$res = mysql_query("UPDATE usuario_has_evento SET estado='activo' WHERE usuario_idUsuario= $idUsuario AND evento_idEvento= $idEvento") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
				
		if ($accion == "remove_user_event") {
			$rows = array();
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
			
			$res = mysql_query("UPDATE usuario_has_evento SET estado='pendiente' WHERE usuario_idUsuario= $idUsuario AND evento_idEvento= $idEvento") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
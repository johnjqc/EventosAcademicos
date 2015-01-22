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
		
		if ($accion == "query_asistentes") {
			$rows = array();
			$evento = $_GET['evento'];
			$sth = mysql_query("SELECT * FROM asistente a join usuario b on a.idUsuario = b.idUsuario where idEvento = '$evento'") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_asistentes_to_add") {
			$rows = array();
			$evento = $_GET['evento'];
			$sth = mysql_query("SELECT * FROM usuario a where a.idUsuario not in (select idUsuario from asistente where idEvento = '$evento')") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
				
		if ($accion == "query_asistente" ) {
			$usuario = $_GET['usuario'];
			$rows = array();
			$sth = mysql_query("SELECT * from usuario WHERE idUsuario = '$usuario'") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_asistente") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
			
			$res = mysql_query("INSERT INTO asistente (idEvento, idUsuario)
				VALUES ('$idEvento', '$idUsuario') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
				
		if ($accion == "delete_asistente") {
			$rows = array();
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario']; 
			
			$res = mysql_query("DELETE FROM asistente WHERE idEvento='$idEvento' and idUsuario='$idUsuario'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
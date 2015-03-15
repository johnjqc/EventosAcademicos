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
		
		if ($accion == "query_asistentes") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("select * FROM usuario a JOIN usuario_has_evento b ON a.idUsuario = b.usuario_idUsuario
				AND b.evento_idEvento ='$idEvento' AND b.estado = 'activo' WHERE a.usu_perfil = '3'") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
	}
	mysql_close($enlace);
	$enlace = false;

?>
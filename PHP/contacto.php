<?php
	include 'database.php';
	header('Content-type: application/json');
	
	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		
		if ($accion == "contacto" ) {
			$rows = array();
			$asunto = $_REQUEST['asunto'];
			$mensaje = $_REQUEST['mensaje'];
			$idUsuario = $_REQUEST['idUsuario'];
			
			$res = mysql_query(" SELECT * FROM usuario WHERE idUsuario= $idUsuario") or $rows["error"] =mysql_error(); 
			$r = mysql_fetch_assoc($res);
			echo $r['usu_nombre'];
			
			//while($r = mysql_fetch_assoc($res)) {
				//$rows[] = $r;
			//}
			//print_r($rows);
			//echo $rows[1]['usua_nombre'];
			
			$resultadosJson= json_encode($r);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
	}
	mysql_close($enlace);
	$enlace = false;
?>

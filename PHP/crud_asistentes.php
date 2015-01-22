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
		
		if ($accion == "new_comite") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];

			$result = mysql_query("SHOW TABLE STATUS LIKE 'usuario'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO comite (com_nombre, com_descripcion)
				VALUES ('$t_nombre', '$t_descripcion') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_comite") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$comiteId = $_REQUEST['id']; 
			
			$res = mysql_query("UPDATE comite SET com_nombre='$t_nombre', com_descripcion='$t_descripcion' WHERE idComite=$comiteId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_comite") {
			$rows = array();
			$comiteId = $_REQUEST['id']; 
			
			$res = mysql_query("DELETE FROM comite WHERE idComite=$comiteId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
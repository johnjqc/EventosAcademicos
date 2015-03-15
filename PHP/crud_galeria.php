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
		
		if ($accion == "query_galerias") {
			$idEvento = $_GET['evento'];
			$sth = mysql_query("SELECT * from galeria where evento_idEvento=$idEvento");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_galeria" ) {
			$rows = array();
			$galeria = $_GET['galeria'];
			$sth = mysql_query("SELECT * from galeria WHERE idGaleria = '$galeria'")or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_galeria") {
			$rows = array();
			$evento = $_REQUEST['evento'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];

			$result = mysql_query("SHOW TABLE STATUS LIKE 'galeria'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO galeria (gal_nombre, gal_descripcion, evento_idEvento)
				VALUES ('$t_nombre', '$t_descripcion', '$evento') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_galeria") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$galeriaId = $_REQUEST['id']; 
			
			$res = mysql_query("UPDATE galeria SET gal_nombre='$t_nombre', gal_descripcion='$t_descripcion' WHERE idGaleria=$galeriaId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_galeria") {
			$rows = array();
			$galeriaId = $_REQUEST['id']; 
			
			$res = mysql_query("DELETE FROM galeria WHERE idGaleria=$galeriaId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
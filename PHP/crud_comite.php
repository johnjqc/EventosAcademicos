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
		
		if ($accion == "query_comites") {
			$evento = $_GET['evento'];
			$sth = mysql_query("SELECT * from comite");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_comite" ) {
			$rows = array();
			$comite = $_GET['comite'];
			$sth = mysql_query("SELECT * from comite WHERE idComite = '$comite'")or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_r_comites") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM comite a 
				join comite_has_evento b on a.idComite = b.comite_idComite
				join evento c on c.idEvento = b.evento_idEvento
				WHERE c.idEvento = $idEvento") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_comite_to_add") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM comite a where a.idComite not in (select comite_idComite from comite_has_evento where evento_idEvento = '$idEvento')") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_comite") {
			$rows = array();
			$evento = $_REQUEST['evento'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];

			$result = mysql_query("SHOW TABLE STATUS LIKE 'comite'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO comite (com_nombre, com_descripcion)
				VALUES ('$t_nombre', '$t_descripcion') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_comite_evento") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idComite = $_REQUEST['idComite'];
			
			$res = mysql_query("INSERT INTO comite_has_evento ( comite_idComite, evento_idEvento)
				VALUES ('$idComite', '$idEvento') ") or $rows["error"] =mysql_error();
			
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
		
		if ($accion == "delete_r_comite") {
			$rows = array();
			$idComite = $_REQUEST['idComite'];
			$idEvento = $_REQUEST['idEvento'];
			
			$res = mysql_query("DELETE FROM comite_has_evento WHERE comite_idComite='$idComite' and evento_idEvento='$idEvento'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>
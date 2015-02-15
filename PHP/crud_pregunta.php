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
		
		if ($accion == "query_respuestas" ) {
			$idEvento = $_GET['idEvento'];
			$idEncuesta = $_GET['idEncuesta'];
			$idUsuario = $_GET['idUsuario'];
			
			$sth = mysql_query("SELECT * from respuesta a JOIN pregunta b ON b.idPregunta = a.pregunta_idPregunta WHERE pregunta_encuesta_evento_idEvento = '$idEvento' AND pregunta_encuesta_idEncuesta = '$idEncuesta' AND usuario_idUsuario = '$idUsuario'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_pregunta") {
			$rows = array();
			$idEncuesta = $_GET['idEncuesta'];
			$t_pregunta = $_REQUEST['t_pregunta'];
			$t_tipo = $_REQUEST['t_tipo'];
			
			$res = mysql_query("INSERT INTO pregunta (pre_pregunta, pre_tipo, encuesta_idEncuesta) VALUES ('$t_pregunta', '$t_tipo', '$idEncuesta') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_encuesta") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$idEncuesta = $_GET['idEncuesta'];
			$idUsuario = $_GET['idUsuario'];
			
			//$rows["url"] = $_SERVER['REQUEST_URI'];
			foreach($_GET as $key=>$value){  
				//echo "Input name : $key Value:$value";//add condition to exclude your button or hidden fields
				//$rows["key".$key] = $value;
				if (strpos($key,'t_respuesta_') !== false) {
					$idPregunta = explode("_", $key);
					$sth = mysql_query("SELECT * from pregunta WHERE idPregunta = '$idPregunta[2]'");
					$rows1 = array();
					$pre_tipo= -1;
					while($r = mysql_fetch_assoc($sth)) {
						$pre_tipo = $r['pre_tipo'];
					}
					if ($pre_tipo == 1 ) {
						$res = mysql_query("INSERT INTO respuesta (res_abierta, pregunta_idPregunta, pregunta_encuesta_idEncuesta, pregunta_encuesta_evento_idEvento, usuario_idUsuario) VALUES ('$value','$idPregunta[2]','$idEncuesta','$idEvento','$idUsuario') ") or $rows["error"] =mysql_error();
					}
					if ($pre_tipo == 2 ) {
						$res = mysql_query("INSERT INTO respuesta (res_multiple, pregunta_idPregunta, pregunta_encuesta_idEncuesta, pregunta_encuesta_evento_idEvento, usuario_idUsuario) VALUES ('$value','$idPregunta[2]','$idEncuesta','$idEvento','$idUsuario') ") or $rows["error"] =mysql_error();
					}
					//$rows["idPregunta".$idPregunta[2]] = $value;
					//echo $idPregunta[0];
				
				}
			}
			//$rows["sale"] = "ok";
			
			
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
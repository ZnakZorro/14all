<?php
header("Access-Control-Allow-Origin: *");
$query = explode('&',$_SERVER['QUERY_STRING']);
//print("<pre>");print_r($query);print("</pre>");
$raw_data = file_get_contents($query[0]);
if (isset($query[1])) echo $query[1].'(';
if(substr($raw_data, 0, 15) == "<methodResponse" || substr($raw_data, 0, 5) == "<?xml"){
  $xml = simplexml_load_string($raw_data);
  $json = json_encode($xml);
  echo $json;
} else {
  echo $raw_data;
}
if (isset($query[1])) echo ')';

//exemples:
//https://zszczech.zut.edu.pl/app/DOM/jsons/corsProxy.php?https://www.yr.no/place/Poland/West_Pomerania/Szczecin/forecast_hour_by_hour.xml
//https://zszczech.zut.edu.pl/app/DOM/jsons/corsProxy.php?https://www.yr.no/place/Poland/West_Pomerania/Szczecin/forecast_hour_by_hour.xml&callback
?>

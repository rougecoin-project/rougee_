<?php

/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung


Copyright 2019 by Vanea Young 

--------------------------------
2020 - Modified for WoWonder

*/

require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "config.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "global.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "libraries/Embera/vendor/autoload.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "libraries/emojione/autoload.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "libraries/json-db/json-db.class.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "svgs.php";
require_once "class.cronjob.php";
if (!class_exists("Smarty")) {
    require_once dirname(__DIR__, 1) .
        DIRECTORY_SEPARATOR .
        "libraries/smarty-3.1.34/Smarty.class.php";
}

 /* Twilio disabled, we have already free service 
require_once(getcwd().'/assets/libraries/twilio/vendor/autoload.php');
use Twilio\Rest\Client;
*/


class VY_CORE {

public $db_path;
public $db;
public $USER;
public $cronjob;
public $settings;
public $view_as_json;
public $svgs;
public $language;

// --------------------------- Connect to DATABASE ---------------------------------
private function db_conn($encoding = 'utf8'){
 global $sql_db_host, $sql_db_user, $sql_db_pass, $sql_db_name;
try {  
$this->db = new mysqli($sql_db_host, $sql_db_user, $sql_db_pass, $sql_db_name);

if($this->db->connect_errno > 0){
    die('Unable to connect to database [' . $this->db->connect_error . ']');
} else
$this->db->set_charset('utf8mb4');

//register_shutdown_function([$this, 'autoclean']);

return $this->db;

} catch (Exception $e) {
	return $e->getMessage();
}


} // END db_conn()


// ------------------------------ RUN QUERIES --------------------------
// for select
public function query_select($query) {

    $result_array = array();
    $database = $this->db_conn();
    $result = $database->query($query) or die($database->error);
    if(!$result){
        die("No disponible data to show. [ error: empty ]");
    }
   

    while($row = $result->fetch_assoc())
        $result_array[] = $row;

    return $result_array;


} // END run_query()

// for insert
public function query_insert($query) {

    $database = $this->db_conn('utf8mb4');
    $query = $database->query($query) or die($database->error);
    $insert_id = @mysqli_insert_id($database);
    if(!$insert_id){
        die("An error occurred to insert data into database.");
    }

    return $insert_id;
   

} // END run_query_insert()

// for update
public function query_update($query) {

    $database = $this->db_conn('utf8mb4');
    $query = $database->query($query) or die($database->error);
    if(!$query){
        die("An error occurred to update data.");
    }

   return true;
   

} // END run_query_update()

// for delete
public function query_delete($query) { 

    $database = $this->db_conn();
    $query = $database->query($query) or die($database->error);
    if(!$query){
        die("An error occurred to delete data from database.");
    }

   return true;
   

} // END query_delete()




public function __construct(){

 global $wo,$svgI;

    $this->db_conn();
    $this->USER = array();
    $this->cronjob = new MESSENGER_CRONJOB;

	if (isset($_COOKIE['pwa_login']) && !empty($_COOKIE['pwa_login']) && isset($_COOKIE['pwa_user_id']) && !empty($_COOKIE['pwa_user_id'])) {
        $session_id = $_COOKIE['pwa_user_id'];
    } else {
		
        $session_id = (!empty($_SESSION['user_id']) && isset($_SESSION['user_id'])) ? $_SESSION['user_id'] : $_COOKIE['user_id'];
	 
	}

    $user_session = Wo_GetUserFromSessionID($session_id);
    $this->USER         = Wo_UserData($user_session);
	$this->USER['id'] = $this->USER['user_id'];
	$this->USER['fullname'] = empty($this->USER['fist_name']) ? $this->USER['username'] : $this->USER['first_name'] .' '. $this->USER['last_name'];
	$this->USER['profile_photo'] = $this->USER['avatar'];
	$this->view_as_json = isset($_GET['view_as']) || isset($_POST['view_as']) ? true : false;
    $this->template = new Smarty;
	$this->theme_dir = getcwd() . DIRECTORY_SEPARATOR ."vy-messenger/layout";
	$this->settings = SETTINGS;
	$this->db_path = dirname(__DIR__) . DIRECTORY_SEPARATOR ."lib/db/";
	$this->svgs = $svgI;
	
	// create database folder
	if (!file_exists($this->db_path)) {
		mkdir($this->db_path, 0755, true);
	}
	
	
	// require language file
	$global_language = "en";
	
	switch($wo['user']['language']){
		
		case 'english':		$global_language 	= "en";break;
		case 'arabic':		$global_language	= "ab";break;
		case 'german':		$global_language	= "de";break;
		case 'spanish':		$global_language 	= "es";break;
		case 'french':		$global_language	= "fr";break;
		case 'italian':		$global_language 	= "it";break;
		case 'dutch':		$global_language	= "nl";break;
		case 'portuguese':	$global_language 	= "pg";break;
		case 'russian':		$global_language 	= "ru";break;
		case 'turkish':		$global_language 	= "tr";break;	
		

		
	}
	
	$mess_language = include(dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "lang/{$global_language}.php");
 	$this->language = $global_language;
	
     // get site language
	foreach($mess_language as $key => $value){
      $this->lang[$key] = $value;
	}
	 
	 /* Twilio disabled forever 
			if(!isset($wo['config']['iceserver']))
				$this->getIceServerCredentials();
		*/
		
	
	  
     
    } // END __construct()


 public function im_messenger(){
 return  new MESSENGER;
}
 
 public function cronjob(){
 return  new MESSENGER_CRONJOB;
}
 public function json_db_id($i){
	return hexdec(crc32($i));
}
public function json_db_update($db,$id,$key,$val){
	
			$data = $db->getSingle($id);
			if(count($data) && isset($data[$key])){
				$data[$key] = $val;
				$db->delete($id);
				$db->insert($data, $id);
			}
	
}
// escape input
public function test_input($data,$no_emoji = false, $no_escape = false) {

   $data = trim($data);
   $data = stripslashes($data);
   $data = htmlspecialchars($data);
   
   if($no_emoji) $data = remove_emoji($data);
   
   return $no_escape ? $data : $this->db->real_escape_string($data);
}
// escape for sql
public function sql_escape($str){
	
	return $this->db->real_escape_string($str);
	
}
public function emit_notification_to_socketio(array $data){
         
 
  
	$data['hash'] = md5(mt_rand().mt_rand().mt_rand().mt_rand());
	$data['from_id'] = $this->test_input($this->USER['id']);
	$data_string = json_encode($data);
 
	$ch = curl_init( $this->settings['CHAT_HOSTNAME'].':'.$this->settings['CHAT_PORT'].'/emit-notifications');  
	if($this->isSecure()) curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
		'Content-Type: application/json',                                                                                
		'Content-Length: ' . strlen($data_string))                                                                       
	);                                                                                                                   

	$response = curl_exec($ch) == 'ok' ? true : false;
	curl_close($ch);

 	return $response;
 
 
}

public function socket_id($uid){
	$V_WS_ADDR = str_replace(".","",$_SERVER["SERVER_ADDR"]);
	$id = $uid ? $uid : $this->USER['id'];
	return md5( $V_WS_ADDR .'_'. $id);
}
public function sendResponse($arr){

return json_encode($arr, JSON_UNESCAPED_UNICODE);

}
// replace month name in php datetime
public function gMonthName($str){


$a = array('January', 'February', 'March', 'Aprill', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December');
$b = array($this->lang['january'], $this->lang['february'], $this->lang['march'],$this->lang['aprill'],$this->lang['may'],$this->lang['june'],$this->lang['july'],$this->lang['august'],$this->lang['september'],$this->lang['octomber'],$this->lang['november'],$this->lang['december']);
$mName = str_ireplace($a, $b, $str);

return $mName;
}
// replace short month name in php datetime
public function gMinMonthName($str){


$a = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
$b = array($this->lang['Jan'], $this->lang['Feb'], $this->lang['Mar'],$this->lang['Apr'],$this->lang['May'],$this->lang['Jun'],$this->lang['Jul'],$this->lang['Aug'],$this->lang['Sep'],$this->lang['Oct'],$this->lang['Nov'],$this->lang['Dec']);
$mName = str_ireplace($a, $b, $str);

return $mName;
}
// check if user is online
public function getUserStatus($uid){
	
	
	
	return 1;
	
}
public function isSecure() {
  return
    (isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || $_SERVER['SERVER_PORT'] == 443;
}
public function get_avatar($avatar = ''){
	$m_avatar = Wo_GetMedia($avatar);
	if(!empty($m_avatar))
		return $m_avatar;
	else
	return '/'.$avatar;
}
public function isarray($var){
	
return is_array($var) or ($var instanceof Traversable);
	
}
public function getUserData($uid,$st){
 
	$concat_fullname = "IF(first_name IS NULL OR first_name = '', username, GROUP_CONCAT(CONCAT(first_name,' ',last_name))) as fullname";
	$st_original = $st;

	if(!$uid)
		return array();

	if($this->isarray($st)){
 
		for($x = 0; $x < count($st); $x++):
		
			if($st[$x] == 'fullname')
				$st[$x] = $concat_fullname;
		
		endfor;
		
	} else if(!$this->isarray($st) && $st == 'fullname')
		$st = $concat_fullname;
 
	$st_sql = $this->isarray($st) ? implode(",",$st) : $st;
 
	$q = $this->db->query("select ".$st_sql." from ".tbl_users." where `user_id`='{$uid}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);

 
	if(isset($r['avatar']))
		$r['avatar'] = $this->get_avatar($r['avatar']);
 
	return $this->isarray($st_original) ? $r : $r[$st_original];
}
public function getPage($content,$page = false){


if($this->view_as_json)
return json_encode(array("page" => $page ? $page : '', "content" => $content));
else 
return $content;

}
public function openUser(){
	
	$id = isset($_GET['id']) ? $this->test_input($_GET['id']) : '';
	
	if(is_numeric($id) && $id > 0){
		
		$q = $this->db->query("select `username` from ".tbl_users." where `user_id`='{$id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		$username = $r['username'];
		
		header("location: ".$this->settings['HOST'].'/'.$username);
		
	}
}
public function openPage(){
 
	$id = isset($_GET['id']) ? $this->test_input($_GET['id']) : '';
	
	if(is_numeric($id) && $id > 0){
		
		$q = $this->db->query("select `page_name` from ".tbl_pages." where `page_id`='{$id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		$username = $r['page_name'];
		
		header("location: ".$this->settings['HOST'].'/'.$username);
		
	}
}


public function getIceServerCredentials(){
	global $wo;
	@session_start();
	$q = $this->db->query("select * from ".tbl_iceserver." order by id desc limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if( isset($r['id']) ){
		
		
	$stun_url = $r['stun'];
	$turn_url = $r['turn'];
	$ice_server_username = $r['username'];
	$ice_server_credential = $r['credential'];
	
	
		
	} else {

	// Find your Account Sid and Auth Token at twilio.com/console
	// DANGER! This is insecure. See http://twil.io/secure
	$sid    = $this->settings['TWILIO_SID'];
	$token  = $this->settings['TWILIO_TOKEN'];
	$twilio = new Client($sid, $token);

	$token = $twilio->tokens->create();


	$tw_ice_server = $token->iceServers;

	$stun_url = $tw_ice_server[0]['url'];
	$turn_url = $tw_ice_server[2]['url'];
	$ice_server_username = $tw_ice_server[2]['username'];
	$ice_server_credential = $tw_ice_server[2]['credential'];
	
	$this->db->query("truncate table ".tbl_iceserver);
	$this->query_insert("insert into ".tbl_iceserver." set `stun`='{$stun_url}',`turn`='{$turn_url}',`username`='{$ice_server_username}',`credential`='{$ice_server_credential}'");
	
	}
	
	
	$wo['config']['iceserver']['stun'] = $stun_url;
	$wo['config']['iceserver']['turn'] = $turn_url;
	$wo['config']['iceserver']['username'] = $ice_server_username;
	$wo['config']['iceserver']['credential'] = $ice_server_credential;
	
	$_SESSION['config']['iceserver']['stun'] = $stun_url;
	$_SESSION['config']['iceserver']['turn'] = $turn_url;
	$_SESSION['config']['iceserver']['username'] = $ice_server_username;
	$_SESSION['config']['iceserver']['credential'] = $ice_server_credential;
	
	
	$data = array("stun" => $stun_url,"turn" => $turn_url, "username" => $ice_server_username, "credential" => $ice_server_credential);
	
	//echo json_encode($data);
	
	
	
}

public function createLogin(){
	
	
$this->template->assign(['this' => $this, 'wo' => $wo]);
$this->template->display($this->theme_dir."/standalone/login.html");
	
	
}
public function cMessengerHeader(){
	global $wo;
include($this->theme_dir."/messenger/header.html");


}
public function post_vars($var,$no_test_input = false){
	
	return isset($_POST[$var]) ? ($no_test_input ? $_POST[$var] : $this->test_input($_POST[$var])) : false;
	
}
public function getTurnCredentials(){

        $json_path = glob(getcwd() . DIRECTORY_SEPARATOR ."cr_turnserver". DIRECTORY_SEPARATOR ."*.json");
        $json = file_get_contents($json_path[0]); 
 
        return $json;

}
 public static function _getSmartRepliedDB() {
 	$i = new VY_CORE;
    $json_path = glob(dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "smart_replies/{$i->language}.json");
    $json = file_get_contents($json_path[0]); 
 
    return $json;

}
} // end class



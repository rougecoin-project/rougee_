<?php
session_unset();
if (!empty($_SESSION['user_id'])) {
	$_SESSION['user_id'] = '';
	$query = mysqli_query($sqlConnect, "DELETE FROM " .  T_APP_SESSIONS . " WHERE `session_id` = '" . Wo_Secure($_SESSION['user_id']) . "'");
}
session_destroy();
if (isset($_COOKIE['user_id'])) {
	$query = mysqli_query($sqlConnect, "DELETE FROM " .  T_APP_SESSIONS . " WHERE `session_id` = '" . Wo_Secure($_COOKIE['user_id']) . "'");
	$_COOKIE['user_id'] = '';
    unset($_COOKIE['user_id']);
    setcookie('user_id', null, -1);
    setcookie('user_id', null, -1,'/');
} 

if (isset($_COOKIE['chat_session'])) {
    unset($_COOKIE['chat_session']); 
    setcookie('chat_session', null, -1, '/'); 
 
}  
if (isset($_COOKIE['chattab_minimized'])) {
    unset($_COOKIE['chattab_minimized']); 
    setcookie('chattab_minimized', null, -1, '/'); 
 
} 
if (isset($_SESSION['peer_uniq_id'])) {
    unset($_SESSION['peer_uniq_id']); 
  
} 
if (isset($_SESSION['peer_useragent'])) {
    unset($_SESSION['peer_useragent']); 
  
} 
 


$_SESSION = array();
unset($_SESSION);
header("Location: " . $wo['config']['site_url']);
exit();
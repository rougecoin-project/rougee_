<?php

/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung
instagram: instagram.com/vaneayoung

Copyright 2019 by Vanea Young (Movileanu Ion)

--------------------------------
2020 - Modified for WoWonder

*/


if (session_status() == PHP_SESSION_NONE) {
    @session_start();
}

// website url
$wo['vy-messenger']['site_url'] = $wo['site_url'];
$wo['vy-messenger']['u_scheme'] = $_SERVER['SERVER_PORT'] != 443 ? 'http://' :  'https://';

$c = glob(dirname(__FILE__). DIRECTORY_SEPARATOR ."ini". DIRECTORY_SEPARATOR ."*.ini");
$CONFIG = parse_ini_file($c[0]); 

 
date_default_timezone_set($CONFIG['timezone']);

// wowonder tables
define("tbl_users",$CONFIG['tbl_users']);
define("tbl_followers",$CONFIG['tbl_followers']);
define("tbl_userschat",$CONFIG['tbl_userschat']);
define("tbl_pages",$CONFIG['tbl_pages']);
define("tbl_msg",$CONFIG['tbl_msg']);
define("tbl_blacklist",$CONFIG['tbl_blacklist']);
define("tbl_gchat_users",$CONFIG['tbl_gchat_users']);
define("tbl_gchat",$CONFIG['tbl_gchat']);
define("tbl_notif",$CONFIG['tbl_notif']);
define("tbl_session",$CONFIG['tbl_session']); 


// messenger tables
define("tbl_messenger_settings", $CONFIG['tbl_messenger_settings']);
define("tbl_msg_media", $CONFIG['tbl_msg_media']);
define("tbl_msg_stickers", $CONFIG['tbl_msg_stickers']);
define("tbl_msg_stickers_store", $CONFIG['tbl_msg_stickers_store']);
define("tbl_iceserver", $CONFIG['tbl_iceserver']);
define("tbl_peer_id", $CONFIG['tbl_uqid']);
define("tbl_reactions", $CONFIG['tbl_reactions']);

// server key API
define("SERVER_KEY", $CONFIG['st__SERVER_API_KEY']);
define("WOWONDER_URL",$wo['vy-messenger']['site_url']);

define('SETTINGS',array( 
"HOST" =>  $wo['vy-messenger']['site_url'],
"HTTPS" => $_SERVER['SERVER_PORT'] != 443 ? false : true,
"ASSETS" => WOWONDER_URL . DIRECTORY_SEPARATOR . $CONFIG['st__PLUGIN_ASSETS'],
"PLUGIN_ASSETS" => $CONFIG['st__PLUGIN_ASSETS'],
"PURCHASE_CODE" => $CONFIG['st__PURCHASE_KEY'],
"PM_MESSAGES_LIMIT" => $CONFIG['st__messages_limit'],
"MESSENGER_ATTACHMENTS_LIMIT" => $CONFIG['st__attachments_limit'],
"PM_CONVERSATIONS_LIMIT" => $CONFIG['st__conversation_limit'],
"MESSENGER_DEFAULT_THEME" => isset($_COOKIE['mode']) && $_COOKIE['mode'] == 'night' ? $CONFIG['st__default_theme_night'] : $CONFIG['st__default_theme_day'],
"CHAT_PORT"=> $CONFIG['st__CHAT_PORT'],
"CHAT_HOSTNAME" => $CONFIG['st__CHAT_HOSTNAME'],
"GIPHY_API"=> $CONFIG['st__GLYPHY_API'],
"VERSION" =>  "v1.55"

));
 

define("ROOT",getcwd());
define("MESSENGER_UPLOAD_DIR",$CONFIG['st__STORAGE_DIR']);
define("VOICE_CLIPS_DIR",MESSENGER_UPLOAD_DIR.'/voice-clips/');
define("MEDIA_DIR",MESSENGER_UPLOAD_DIR.'/media/');
define("STICKERS_STORE",'/stickers/');

// WoWonder Ajax Requests file
define('WOWONDER_AJAX_URL', SETTINGS['HOST'].'/requests.php'); 


// s3 storage config
define('S3_ENABLED',$wo['config']['amazone_s3']);
define('S3_BUCKET_NAME', $wo['config']['bucket_name']);
define('S3_KEY',$wo['config']['amazone_s3_key']);
define('S3_SECRET',$wo['config']['amazone_s3_s_key']);
define('AWS_S3_BUCKET_LOCATION',$wo['config']['region']);

define('S3_HTTPS', $_SERVER['SERVER_PORT'] != 443 ? 'http://' : 'https://');

 
 
$wo['vy-messenger']['version'] = SETTINGS['VERSION'];
define("BBCODES", json_encode(["[group-invitation]","[stickerid]", "[missedcall]", "[embera]", "[callended]", "[voice-clip]", "[img]", "[video]", "[vdivstart]", "[gif]", "[sharelocation]", "[url-preview]", "[divstart]"])); 

$wo['vy-messenger']['config']['timezone'] = $CONFIG['timezone'];
$wo['vy-messenger']['config']['p_key'] = SETTINGS['PURCHASE_CODE'];
$wo['vy-messenger']['config']['chat']['default_theme'] = SETTINGS['MESSENGER_DEFAULT_THEME'];

$wo['vy-messenger']['config']['chat']['hostname'] = SETTINGS['CHAT_HOSTNAME'];
$wo['vy-messenger']['config']['chat']['port'] = SETTINGS['CHAT_PORT'];
 
$wo['vy-messenger']['host'] = $wo['vy-messenger']['site_url'];

$wo['vy-messenger']['sounds'] = array( "error" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__error'], 
                                        "contacting" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__contacting'],
                                        "ringing" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__ringing'],
                                        "incoming" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__incoming'],
                                        "busy" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__busy'], 
                                        "req_video_waiting" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__req_video_wait'], 
                                        "click" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__click_sound'], 
                                        "new_msg" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__new_msg'], 
                                        "tap" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__tap'], 
                                        "mob_send_msg" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__mob_send_msg'], 
                                        "noanswer" => SETTINGS['PLUGIN_ASSETS']. DIRECTORY_SEPARATOR . $CONFIG['st__noanswer']);


 
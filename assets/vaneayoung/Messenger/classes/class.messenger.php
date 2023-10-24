<?php

/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung

Copyright 2019 by Vanea Young

--------------------------------
2020 - Modified for WoWonder

*/
 
require_once "class.videostream.php";
require_once "class.S3.php";
require_once "class.openGraph.php";
require_once "class.core.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "colors.php";

use Emojione\Emojione;
use Embera\Cache\Filesystem;
use Embera\Http\HttpClient;
use Embera\Http\HttpClientCache;
use Embera\Embera;
use Emojione\Client as EmojioneClient; 	 

 
class MESSENGER extends VY_CORE {

public $userid = 0;
public $now;
public $room_id;
public $id;
public $action;
public $page_id;
public $group_id;
public $wo;
public $storage_path;
public $s3;
public $cron_add_unmute;
public $cron_remove_unmute;
protected $uploads;
protected $media_dir;
protected $embera_cache_writablePath;
protected $embera_cache_duration;
protected $embera_httpCache;


public function __construct(){
global $wo; 

	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
 
//the old building from parent class
parent::__construct(); 
$this->userid = $this->USER['id'];
$this->now = time();

$this->id = isset($_POST['id']) ? $this->test_input($_POST['id']) : (isset($_GET['id']) ? $this->test_input($_GET['id']) : 0);
$this->room_id = isset($_POST['room_id']) ? $this->test_input($_POST['room_id']) : (isset($_GET['room_id']) ? $this->test_input($_GET['room_id']) : 0);
$this->action = isset($_POST['action']) ? $this->test_input($_POST['action']) : (isset($_GET['action']) ? $this->test_input($_GET['action']) : '');
$this->page_id = isset($_POST['page']) ? $this->test_input($_POST['page']) : (isset($_GET['page']) ? $this->test_input($_GET['page']) : 0);
$this->group_id = isset($_POST['group']) ? $this->test_input($_POST['group']) : (isset($_GET['group']) ? $this->test_input($_GET['group']) : 0);
$this->type = isset($_POST['type']) ? $this->test_input($_POST['type']) : (isset($_GET['type']) ? $this->test_input($_GET['type']) : 0);
$this->recipient = isset($_POST['recipient']) ? $this->test_input($_POST['recipient']) : (isset($_GET['recipient']) ? $this->test_input($_GET['recipient']) : 0);
$this->pagecount = isset($_POST['pagecount']) ? $this->test_input($_POST['pagecount']) : (isset($_GET['pagecount']) ? $this->test_input($_GET['pagecount']) : 0);
$this->reply = isset($_POST['reply']) ? $this->test_input($_POST['reply']) : (isset($_GET['reply']) ? $this->test_input($_GET['reply']) : 0);

//$this->cron_unmute = '"cmd=cron&action=unmute&recipient='.$this->recipient.'&id='.$this->id.'&group='.$this->group_id.'&page='.$this->page_id.'" '.$this->settings['HOST'].'/messenger.php';
$this->cron_add_unmute = "{$this->settings['HOST']}/vy-messenger-cmd.php?cmd=cron\&action=unmute\&recipient={$this->recipient}\&id={$this->userid}\&group={$this->group_id}\&page={$this->page_id}";
$this->cron_remove_unmute = "{$this->settings['HOST']}/vy-messenger-cmd.php?cmd=cron\&action=unmute\&recipient={$this->recipient}\&id={$this->id}\&group={$this->group_id}\&page={$this->page_id}";


$this->wo = $wo;
$this->storage_path = 'upload/messenger/';
$this->s3 = new S3(S3_KEY, S3_SECRET, AWS_S3_BUCKET_LOCATION);
$this->uploads = ROOT;
$this->media_url = S3_ENABLED ? '' : $this->settings['HOST'];

$this->embera_cache_writablePath = getcwd().'/Embera-caches/';
$this->embera_cache_duration = 60; // seconds
$this->embera_httpCache = new HttpClientCache(new HttpClient());
$this->embera_httpCache->setCachingEngine(new Filesystem($this->embera_cache_writablePath, $this->embera_cache_duration));

// generate dir for embera caches
    if (!file_exists($this->embera_cache_writablePath))
    mkdir($this->embera_cache_writablePath, 0777, true);

}
public static function getMLang(){
	$core = new VY_CORE;
	return $core->lang;
}
public static function myGroups(){
	$r = array();
	$core = new VY_CORE;
	$messenger = new MESSENGER;
 
	$i = $core->USER['id'];
	$groups = $core->query_select("select `group_id` from ".tbl_gchat_users." where `user_id`='{$i}' group by `group_id`");
	foreach($groups as $id):
		$r[] = array("a" => $messenger->checkGroupAdmin($i,$id['group_id']), "id" => $id['group_id']);
	endforeach;
	return $r;
}
public static function myPages(){
	$r = array();
	$core = new VY_CORE;
	$messenger = new MESSENGER;
	$i = $core->USER['id'];
	$pages = $core->query_select("select `page_id` from ".tbl_pages." where `user_id`='{$i}' group by `page_id`");
	foreach($pages as $id):
		$page_dt = $messenger->getPageDetails($id['page_id'],1,1);
		$r[] = array("a" => $page_dt[2], "id" => $id['page_id'], "n" => $page_dt[0]);
	endforeach;
	return $r;
}
public static function messColors(){
	global $_messenger_colors;
	return $_messenger_colors;
}
public static function getSvgIcons(){
	global $svgI;
	return $svgI;
}
public function getMyGroups(){

$i = $this->USER['id']; 
$query = $this->query_select("select DISTINCT MAX(m.id) as id, m.text as text, MAX(m.time) as time, gu.last_seen as last_seen, gu.group_id as group_id, g.group_name as group_name, g.avatar as avatar from ".tbl_gchat_users." gu left join ".tbl_gchat." g ON g.group_id = gu.group_id left join ".tbl_msg." m ON m.group_id = gu.group_id where gu.user_id='{$i}' && gu.active='1' group by gu.group_id order by MAX(m.time) desc,MAX(g.group_id) desc");

$this->template->assign(['this' => $this, 'contacts' => $query, 'i' => $i]);
$content = $this->template->fetch($this->theme_dir."/group-markup.html");
 
echo $content;


}


public function get_global_popup(){

$type = isset($_POST['type']) ? $this->test_input($_POST['type']) : '';

switch($type) {
	
	case 'manage-group-members':
	$title = $this->lang['Popup_manage_group_members'];
	if(!$this->checkGroupAdmin($this->USER['id'],$this->group_id)) die();
	break;
	case 'compose-new-message':
	$title = $this->lang['Messenger_new_message'];
	break;
	case 'forward-message':
	$title = $this->lang['Messenger_forward-message_title'];
	break;
}
	
$this->template->assign(['this' => $this, 'type' => $type, 'title' => $title, 'group_id' => $this->group_id]);
$content = $this->template->fetch($this->theme_dir."/global-popup.html");
 
echo $content;
	
}
 
public function group_add_new_admin(){
	
	$group_id = $this->group_id;
	$userid = $this->id;
	$me = $this->USER['id'];
	
	$r = array('s' => 'error','msg' => 'An tehnical error occured.');
	
	if(!$this->checkGroupAdmin($me,$group_id,1)){
		$r['msg'] = "You dont have rights to add new administrators.";

	} else {
		
		// add admin
		$update = $this->query_update("update ".tbl_gchat_users." set `admin`='yes' where `user_id`='{$userid}' and `group_id`='{$group_id}'");
		$r['s'] = 'success';
		
	}
	
	return $this->je($r);
}
public function group_remove_admin(){
	
	$group_id = $this->group_id;
	$userid = $this->id;
	$me = $this->USER['id'];
	
	$r = array('s' => 'error','msg' => 'An tehnical error occured.');
	
	if(!$this->checkGroupAdmin($me,$group_id)){
		$r['msg'] = "You dont have rights to remove administrators.";

	} else {
		
		// add admin
		$update = $this->query_update("update ".tbl_gchat_users." set `admin`='no' where `user_id`='{$userid}' and `group_id`='{$group_id}'");
		$r['s'] = 'success';
		
	}
	
	return $this->je($r);
}
public function clear_group(){
	
	$group_id = $this->group_id;
 
	
	$r = array('s' => 'error','msg' => 'An tehnical error occured.');
	
	if(!$this->checkGroupAdmin($this->USER['id'],$group_id)){
		$r['msg'] = "You dont have rights to clear the group.";

	} else {
		
		// delete messages 
		$clear = $this->query_delete("delete from ".tbl_msg." where `group_id`='{$group_id}'");
		$r['s'] = 'success';
		
	}
	
	return $this->je($r);
	
}
public function ajax_check_group_admin(){
	
	return $this->checkGroupAdmin($this->USER['id'],$this->group_id);
	
	
}
public function delete_group(){
	
	$group_id = $this->group_id;
 
	
	$r = array('s' => 'error','msg' => 'An tehnical error occured.');
	
	if(!$this->checkGroupAdmin($this->USER['id'],$group_id)){
		$r['msg'] = "You dont have rights to delete this group.";

	} else {
		
		// delete all messages
		$d_msgs = $this->query_delete("delete from ".tbl_msg." where `group_id`='{$group_id}'");
		// delete all members
		$d_users = $this->query_delete("delete from ".tbl_gchat_users." where `group_id`='{$group_id}'");

		
		// delete group
		if($d_msgs && $d_users) {
			$d_group = $this->query_delete("delete from ".tbl_gchat." where `group_id`='{$group_id}'");
			// delete notifications
			$d_notif = $this->query_delete("delete from ".tbl_notif." where `group_chat_id`='{$group_id}'");
		}
		
		if($d_group) $r['s'] = 'success';
		
	}
	
	return $this->je($r);
	
}
public function get_my_contacts(){
	
	$limit = isset($_POST['limit']) ? "limit ".$this->test_input($_POST['limit']) : '';
	$filter = isset($_POST['filter']) ? $this->test_input($_POST['filter']) : '';
	$i = $this->USER['id'];
	$statement = "";
	switch($filter){
		
		case 'filter-groups':
		$statement = " && u.user_id NOT IN (select `user_id` from ".tbl_gchat_users." where `group_id`='{$this->group_id}') ";
		break;
		
	}
	$rsp = array('msg' => $this->lang['Messenger_empty_contacts_no_followers']);
	$sql = "select u.user_id,IF(u.first_name IS NULL OR u.first_name = '', u.username, GROUP_CONCAT(CONCAT(u.first_name,' ',u.last_name))) as fullname, u.avatar
			
			from ".tbl_users." u 
			
			where

			u.user_id NOT IN (SELECT `blocked` from ".tbl_blacklist." where `blocker`='{$i}') 
			&&
			u.user_id NOT IN (SELECT `blocker` from ".tbl_blacklist." where `blocked`='{$i}') 
			&&
			(
			u.user_id IN (select s.user_id from ".tbl_userschat." s where ( (s.conversation_user_id='{$i}' && s.user_id = u.user_id) || (s.conversation_user_id=u.user_id && s.user_id = '{$i}') ) && s.page_id='0' )
			|| u.user_id IN (select f.following_id from ".tbl_followers." f where f.follower_id='{$i}'  && f.following_id = u.user_id )
			
			)
			&& u.user_id != '{$i}'
			".$statement."
			group by u.user_id order by u.lastseen desc
			
			".$limit;
	
 
	$query = $this->query_select($sql);

	if(count($query)){
		
		foreach($query as $res)
		$rsp['users'][] = array('id' => $res['user_id'], 'fullname' => $res['fullname'], 'avatar' => $this->get_avatar($res['avatar']), 'online' => $this->getUserStatus($res['user_id']));
	
		$rsp['msg'] = 'done';

	}
	
	echo $this->je($rsp);


}
 
public function get_group_members(){
	$i = $this->USER['id'];
	$res = array("msg"=> $this->lang['Messenger_No_Members_in_Group']);
	$statement = " && g.user_id!='{$i}' ";
	$statement_join = " && u.user_id != '{$i}' ";
	switch($this->action){
		
		
		case 'all':
		$statement = "";
		$statement_join = "";
		break;
		
	}
	

	$q = $this->query_select("select (select group_nicknames from ".tbl_messenger_settings." where group_id = '{$this->group_id}') as nicknames,
	g.admin as admin,
	u.lastseen as lastseen,
	u.user_id as user_id,
	(select `user_id` from ".tbl_gchat." where `group_id`='{$this->group_id}') as glavnii_admin, 
	IF(u.first_name IS NULL OR u.first_name = '', u.username, GROUP_CONCAT(CONCAT(u.first_name,' ',u.last_name))) as fullname, 
	u.avatar as avatar
	from ".tbl_gchat_users." g 
						 
								left join ".tbl_users." u ON u.user_id = g.user_id ".$statement_join."
								where g.group_id='{$this->group_id}' && g.active='1' ".$statement."
								group by g.group_id,u.user_id limit 50");
								
	if(count($q)){
		
		foreach($q as $r):
			$nicknames_data = isset($r['nicknames']) && $r['nicknames'] && $r['nicknames'] != "null" && $r['nicknames'] != NULL && $this->isJson($r['nicknames']) ? json_decode($r['nicknames'],true) : array();
			$nickname = "";
			
			if(count($nicknames_data)){
				
				foreach ($nicknames_data as $userid => $nick):

	 
					if($userid == $r['user_id'] && trim($nick) && !empty($nick))
						$nickname = $nick;
 					
				endforeach;
				
			}
			
			$res['users'][] = array("id" => $r['user_id'], "nickname" => $nickname, "fullname" => $r['fullname'], "avatar" => $this->get_avatar($r['avatar']), "timestamp" => $r['lastseen'], "online_text" => $r['lastseen'] > strtotime("-1 minute") ? $this->lang['active_now'] : $this->time_elapsed($r['lastseen']), "online" => $r['lastseen'] > strtotime("-1 minute") ? 'yes' : $this->time_elapsed($r['lastseen']), "admin"=> $r['glavnii_admin'] == $r['user_id'] ? 'yes' : $r['admin']);
		
		endforeach;
		$res['msg'] = "done";
		
	}
	echo $this->je($res);
}
public function updatePeerId(){
	
	$uid = $this->USER['id']; 
    $useragent = $_SERVER['HTTP_USER_AGENT'];
	$peer_uniq_id = $this->id;
	$sql = $this->query_insert("INSERT INTO ".tbl_peer_id." (`userid`, `useragent`) values ('{$uid}','{$useragent}') ON DUPLICATE KEY UPDATE `userid` = '{$uid}',`useragent`='{$useragent}'");
	 
 
	echo $uid;

}	
public function setPeerStatus(){
	
	$status = $this->action;
	
	$sql = $this->query_insert("UPDATE ".tbl_peer_id." set `status` = '{$status}' where `userid`='{$this->userid}'");
	 
	
}
public function limit_chars($x, $length) {
  if(strlen($x)<=$length)
  {
    return $x;
  }
  else
  {
    $y=mb_substr($x,0,$length, "utf-8") . '...';
    return $y;
  }
}

// last online friends convert timestamp to e.g -> September 27 2015 at 19:04
public function lastMessageConvertTime($time){

if(date('d',$time) == date('d')){
// hour + minutes
$d = date('H:i',$time);
} else if(date('d',$time) == date('d')-1){
$d = $this->lang['yesterday'];
} else if(date('Y',$time) != date('Y')){
$d = $this->gMinMonthName(date("j M, y", $time));
} else {
$d = $this->gMinMonthName(date("j M", $time));
}

return $d;

}

public function run_msg_query($uid,$page = 0,$msg_limit = 0){
 
$i = $this->userid;

$msg_limit = $msg_limit > 0 ? $msg_limit : $this->settings['PM_MESSAGES_LIMIT']; // from settings
$start = ($page * $msg_limit) - $msg_limit;
 

$limit = $page ? "limit {$start},{$msg_limit}" : "limit ".$msg_limit;


$sql = "
		SELECT sub.* FROM (
		select *, NULL as count_group_seen,
		
					(select COUNT(id) from ".tbl_msg." where 
						(`from_id` = '{$i}' and `to_id` = '{$uid}' and `deleteby` != '{$i}'
						OR 
						 `from_id` = '{$uid}' and `to_id` = '{$i}'  and `deleteby` != '{$i}') and `group_id`='0') as c

						  from ".tbl_msg." where 
						 ( `from_id` = '{$i}' and `to_id` = '{$uid}' and `deleteby` != '{$i}'
						  OR 
						 `from_id` = '{$uid}' and `to_id` = '{$i}' and `deleteby` != '{$i}')
						 
						  && `page_id`='{$this->page_id}' &&  `group_id`='0'
						 
						 order by `id` desc {$limit}

		) sub
		 ORDER BY sub.id asc
";

$sql_groups = "
		SELECT sub.* FROM (
		select *, 
					IF(LENGTH(group_seen) > 0, LENGTH(group_seen) - LENGTH(REPLACE(group_seen, ',', '')) + 1, 0)
					as count_group_seen,
					(select COUNT(id) from ".tbl_msg." where 
						`deleteby` != '{$i}' and `group_id`='{$this->group_id}') as c

						  from ".tbl_msg." where 
						 `deleteby` != '{$i}'
						 &&  `group_id`='{$this->group_id}'
						 
						 order by `id` desc {$limit}

		) sub
		 ORDER BY sub.id asc
";
$query = $this->group_id > 0 ? $this->query_select($sql_groups) : $this->query_select($sql);

return $query;

}
private function _gconv_upread($uid,$group,$page){
	
$i = $this->userid;	
$update_sql = "update ".tbl_msg." set `read`='yes' , `seen`='{$this->now}' where `from_id` = '{$uid}' and `to_id`='{$i}' and `read`='no' ".$page;
$groups_updaet_sql = "UPDATE ".tbl_msg." SET `read`='yes' , `seen`='{$this->now}', `group_seen` = CONCAT(`group_seen`,',{$i}') WHERE NOT FIND_IN_SET ('{$i}', `group_seen`) && `from_id`!='{$i}'".$group;

// set messages as read
//if(!$no_update)
$set_read = $this->group_id > 0 ? $this->setMessageAsRead($groups_updaet_sql,$i,0) : $this->setMessageAsRead($update_sql,$i,0);
 
	
}
// get conversation
public function getConversation($uid, $limit = false, $getMessageForCache = false) {
 
$i = $this->userid;
$messages = array();

if($getMessageForCache)
$query = $this->run_msg_query($uid,0,1);
else
$query = $this->run_msg_query($uid);

// do not update messages as read (for shortcuts only)
$no_update = isset($_POST['no_update']) ? $_POST['no_update'] : false;
$no_update = $no_update == 'yes' ? true : false;
$page = "and `page_id`='0'";
$group = "and `group_id`='0'";
$page_avatar_original = "";
$page_admin = "no";
if($this->page_id > 0)
	$page = "and `page_id`='{$this->page_id}'";

if($this->group_id > 0)
	$group = "and `group_id`='{$this->group_id}'";

if(!$getMessageForCache)
	$this->_gconv_upread($uid,$group,$page);

$group_admin = false;
if($this->group_id > 0) {
	
	$group_avatar = $this->getGroupDetails($this->group_id,1,1);
	$group_avatar = isset($group_avatar[2]) ? $group_avatar[2] : '';
	
	$group_admin = $this->checkGroupAdmin($i,$this->group_id);
	
}
if($this->page_id > 0) {
	
	$page_details = $this->getPageDetails($this->page_id,1,1);
	$page_avatar = isset($page_details[2]) ? $page_details[2] : '';
	$page_avatar_original = $page_avatar;
	$page_avatar = $i != $page_details[1] ? $page_avatar : $this->getUserData($uid,'avatar');
	$page_admin = $i == $page_details[1] ? "yes" : "no";
	
}
 
$recipient_avatar = $this->group_id > 0 ? $group_avatar : ($this->page_id > 0 ? $page_avatar : $this->getUserData($uid,'avatar')); 
$blacklist = 0;
// check if the user is in blacklist
$q_blacklist = $this->db->query("select `id` from ".tbl_blacklist." where `blocker` = '{$uid}' and `blocked`='{$i}' limit 1");
$r_blacklist = $q_blacklist->fetch_array(MYSQLI_ASSOC);

if(isset($r_blacklist['id']) && $r_blacklist['id'] > 0)
	$blacklist = 1;
 
	$nickname = '';
	$nick_userid = 0;
	
	if($this->page_id <= 0 && $this->group_id <= 0) {
		
		$curr_settings = array();
		$curr_settings = $this->getConversationSettings($uid);

		if(count($curr_settings)){
			
				foreach($curr_settings as $settings):
						$nick_userid = $settings['userid'];
						$curr_settings = json_decode($settings['settings'],true);
				endforeach;
			
			if($nick_userid != $i)
				$nickname = empty(trim($curr_settings['nicknames']['my'])) ? '' : $curr_settings['nicknames']['my'];
			else
				$nickname = empty(trim($curr_settings['nicknames']['recipient'])) ? '' : $curr_settings['nicknames']['recipient'];
			
			
		}
	}else if($this->group_id > 0){
		$group_nickname = json_decode($this->getMyNicknameInGroup($this->group_id,1),true);
		$nickname = $group_nickname['my'];
	
	} 



foreach($query as $result){

$date = date('j',$result['time']);
$user_data = $result['group_id'] > 0 ? $this->getUserData($result['from_id'],array('avatar','fullname')) : array('avatar' => $recipient_avatar);
$dateMonth = date('Y',$result['time']) == date('Y') ? ($date === date('j') ? $this->lang['today'] : ($date == date('j') -1 ? $this->lang['yesterday'] : date('j F', $result['time']))) : date('j F, Y', $result['time']);
$messages[] = array('id' => $result['id'], 'forwarded' => $result['forwarded'], 'group_admin' => $group_admin, 'group_id' => $result['group_id'], 'user_fullname' => $result['group_id'] > 0 ? $user_data['fullname'] : '', 'page_id' => $result['page_id'], 'unsettled_msg_id' => $result['unsettled_msg_id'], 'bg' => $result['bg'], 'group_seen' => $result['group_seen'], 'count_group_seen' => $result['count_group_seen'], 'seen' => $result['seen'],
'msg' => empty($result['text']) && !empty($result['media']) ? $this->str_messenger_wo_sync_media($result['media'],$result['mediaFileName']) : $this->str_messenger($result['text']), 
 
						 
'recipient' => $uid,
 
'reactions' => $this->getMessageReactions($result['id']),
'from_id' => $result['from_id'],
'reply' => $this->getReplyMessageText($result['replied']),

			 'timestamp' => $result['time'],
		     'to_id' => $result['to_id'], 'time' => $this->pm_time($result['time']), 'lastby' => $result['lastby'], 'count' => $result['c'] > $this->settings['PM_MESSAGES_LIMIT'] ? 1 : '',
		     'read' => $result['read'], 'user_avatar' => $user_data['avatar'], 'showlastseen' => $this->getUserData($uid,'showlastseen'), 'uonline' => $this->getUserStatus($uid), 'date' => $date, 'currDate' => date('j'), 'dateMonth' => $dateMonth);

}

$r_data = count($query) > 0 ? $this->je(["messages" => $messages, "page_admin" => $page_admin, "page_avatar" => $page_avatar_original, "group_admin" => $group_admin, "recipient_avatar" => $recipient_avatar, "blacklist" => $blacklist, "count_messages" => count($messages), "nickname" => $nickname, "count" => 1, "allowsendpm" => 1]) : $this->je([ "page_admin" => $page_admin, "group_admin" => $group_admin, "page_avatar" => $page_avatar_original, "blacklist" => $blacklist, "nickname" => $nickname, "messages" => array(), "count_messages" => 0, "count" => 0, "allowsendpm" => 1, 'exp' => $this->lang['pm_no_msg'], 'sub' => $this->lang['pm_first_move'] ]);
if($getMessageForCache) return isset($messages[0]) && count($messages) ? $messages[0] : new stdClass(); else echo $r_data; 

}
public function getReplyMessageText($message_id = 0){
	
	$m_removed = $this->lang['Messenger_message_removed'];
	
	if(!$message_id || !is_numeric($message_id) || $message_id <= 0)
		return NULL;
	
	$q = $this->db->query("select `unsettled_msg_id`,`text` from ".tbl_msg." where `id`='{$message_id}' || `unsettled_msg_id`='{$message_id}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if(isset($r['text']) && !empty($r['text']))
		return array("id" => $message_id, "unsettled_msg_id" => $r['unsettled_msg_id'], "str" => $this->str_messenger($r['text'],1));
	else
		return array("id" => NULL, "unsettled_msg_id" => NULL, "str" => $m_removed);
	
}
public function getCacheMessage(){
	
	return $this->je($this->getConversation($this->id,1,1));
	
}
public function ajax_check_group_admin_owner(){

	
	return $this->checkGroupAdmin($this->USER['id'],$this->group_id,1);
	
	

}	
public function checkGroupAdmin($userid,$group_id, $glavnii = 0){
	
	$i = $userid;
	$sql = "select SUM(total) FROM ( 
	
								select count(*) as total from ".tbl_gchat." where `group_id`='{$group_id}' && `user_id`='{$i}'  
								UNION ALL
								select count(*) as total from ".tbl_gchat_users." where `group_id`='{$group_id}' && `user_id`='{$i}' && `admin`='yes'
								
								) a";
	$sql_glavnii = "select count(*) as total from ".tbl_gchat." where `group_id`='{$group_id}' && `user_id`='{$i}'";
	$q = $this->db->query($glavnii ? $sql_glavnii : $sql);
	$r = $q->fetch_row();
 
	return $r[0];
 
}


// convert timestamp to hour and minutes
public function pm_time($t){
return date("H:i",$t);
}

// edit message
public function editMessage($text,$rcpid,$msg_id){

// author ID
$i = $this->userid;

// check for message author
$q_check = $this->db->query("select `from_id` from ".tbl_msg." where `id`='{$msg_id}' limit 1");
$c_res = $q_check->fetch_array(MYSQLI_ASSOC);

if($c_res['from_id'] != $i)
die;
else {

$update = $this->query_update("update ".tbl_msg." set `text`='$text' where `id` = '{$msg_id}' and `from_id`='{$i}'");

if($update)
echo $this->je( [ 'response' => 'success', 'text' => $this->str_messenger($text), 'msgid' => $msg_id, 'recipient' => $rcpid ] );
else
echo $this->lang['pm_error_edit'];

} 


}
public function getLastMessage($recipient_id,$page_id = 0,$group_id = 0){
	$i = $this->userid;
	
	$q = "select `seen`,`text`,`time`,`from_id` from ".tbl_msg." where (`from_id` = '{$i}' && `page_id`='{$page_id}' && `to_id` = '{$recipient_id}' OR `from_id` = '{$recipient_id}' && `page_id`='{$page_id}' && `to_id` = '{$i}') && `deleteby`<>'{$i}' order by `time` desc limit 1";
	$q2 = "select `seen`,`group_seen`,`text`,`time`,`from_id` from ".tbl_msg." where `group_id`='{$group_id}' && `deleteby`<>'{$i}' order by time desc limit 1";
	
	$q = $group_id > 0 ? $this->db->query($q2) : $this->db->query($q);
 
	return $q->fetch_array(MYSQLI_ASSOC);
	
	
}
// construct query for dialogs
public function getDialogQuery($page = 0){
 
$i = $this->userid;
 
$app_group_id = isset($_GET['group_id']) ? $this->test_input($_GET['group_id']) : 0;

$t_limit = $this->settings['PM_CONVERSATIONS_LIMIT']; // from settings
$start = ($page * $t_limit) - $t_limit;


$limit = $page ? "limit {$start},{$t_limit}" : "limit ".$t_limit;


/* // Disabled at Doughouz request 
$query = $this->query_select("select u.user_id, u.username, u.first_name,u.last_name, u.avatar, u.lastseen as online from  
".tbl_msg." as m ,".tbl_u7sers." as u

		
									 
				WHERE (
						u.user_id = m.to_id && m.from_id = '{$i}' 
						||
						u.user_id = m.from_id && m.to_id = '{$i}' 
					  )
				&& m.deleteby != '{$i}' && m.hidden = 'no'
				GROUP BY IF( m.from_id = '{$i}', m.to_id, m.from_id ) ,u.user_id
				order by MAX(m.id) desc ".$limit);
*/

$rows = $sort = array();
$query = $this->query_select("
				select DISTINCT MAX(m1.id) as id,'0' as group_id, MAX(m.time) as time, m.page_id, u.user_id, u.username, u.first_name,u.last_name, u.avatar, u.showlastseen, u.status as online_status, u.lastseen as online from  
							".tbl_userschat." as m, ".tbl_msg." m1, ".tbl_users." as u 
							
							 
							 

							where m.user_id='{$i}' && u.user_id = m.conversation_user_id
									 && m1.deleteby != '{$i}' && m1.hidden = 'no' && (
																				u.user_id = m1.to_id && m1.from_id = '{$i}' 
																				||
																				u.user_id = m1.from_id && m1.to_id = '{$i}' 
														 					  ) && u.user_id NOT IN (SELECT `blocked` from ".tbl_blacklist." where `blocker`='{$i}')
																			  
																			  
																	  
							   
							GROUP BY m.page_id, u.user_id 
							order by MAX(m.time) desc ".$limit);

							
$select_group_chats = $this->query_select("select DISTINCT MAX(m.id) as id, m.text as text, MAX(m.time) as time, gu.last_seen as last_seen, gu.group_id as group_id, g.group_name as group_name, g.avatar as avatar from ".tbl_gchat_users." gu
											left join ".tbl_gchat." g ON g.group_id = gu.group_id 
											left join ".tbl_msg." m ON m.group_id = gu.group_id 
											where gu.user_id='{$i}' && gu.group_id!='{$app_group_id}' && gu.active='1' 
											group by gu.group_id order by MAX(m.time) desc ".$limit);
 
 
foreach($query as $key):

$rows[] = $key;

endforeach;

	
foreach($select_group_chats as $key):

$key['page_id'] = 0; 
$key['user_id'] = $key['group_id']; 
$key['username'] = $key['group_name'];
$key['first_name'] = $key['group_name'];
$key['last_name'] = $key['group_name'];
$key['group_name'] = $key['group_name'];
$key['showlastseen'] = 1;
$key['online'] = $key['last_seen'];
$key['online_status'] = $this->is_groupchat_online($key['group_id']);
$rows[] = $key;

endforeach;

foreach($rows as $k=>$v) {
	 
     $sort['time'][$k] = $v['time'];
}

if(count($rows))
array_multisort($sort['time'], SORT_DESC, $rows);

 
return $rows; 

}
public function getAllMyContacts(){
 
	$online_interval = strtotime("-1 minute");
	$res = array("msg"=> $this->lang['Messenger_empty_contacts_no_followers'], "users" => array());
	
	$q = $this->getDialogQuery();
 

	if(count($q)){
		$res['msg'] = "done";
		
		for($i=0;$i<count($q);$i++):
		
			$fullname = empty($q[$i]['first_name']) ? $q[$i]['username'] : $q[$i]['first_name'].' '.$q[$i]['last_name'];
			
			if(isset($q[$i]['avatar']))
				$q[$i]['avatar'] = $this->get_avatar($q[$i]['avatar']);
			

			if(isset($q[$i]['group_id']) && $q[$i]['group_id'] == 0)
				$q[$i]['online_status'] = $q[$i]['online'] > $online_interval;
			
			if(isset($q[$i]['group_id']) &&  $q[$i]['group_id'] > 0)
				$fullname = $q[$i]['group_name'];
			
			if(isset($q[$i]['page_id']) && $q[$i]['page_id'] > 0) {
				
				$page_details = $this->getPageDetails($q[$i]['page_id'],1,1);
				
				if ($page_details[1] == $this->USER['id'])
					$fullname = $fullname." (".$page_details[0].")";
				else {
					$fullname = $page_details[0];
					$q[$i]['avatar'] = $page_details[2];
				}
				
			}
			
			$q[$i]['fullname'] = $fullname;
		
		endfor;
		$res["users"] = $q;
	}
	
	echo $this->je($res);
	
}
public function getAllMyContactsGrouped(){
	
	$loadmore = $this->post_vars('loadmore') ? 1 : 0;
	$res = array("msg" => $this->lang['Messenger_empty_contacts_no_followers'], "end" => "no", "recent" => array(), "contacts" => array(), "groups" => array());
	
	$q = $this->getDialogQuery($this->pagecount,$loadmore);

	if(count($q)){
		
		$res['msg'] = "done";
		
		if(!$loadmore){
			for($i=0;$i<count($q);$i++):
			
				$fullname = empty($q[$i]['first_name']) ? $q[$i]['username'] : $q[$i]['first_name'].' '.$q[$i]['last_name'];
				
				if(isset($q[$i]['avatar']))
					$q[$i]['avatar'] = $this->get_avatar($q[$i]['avatar']);
			
			
				if(isset($q[$i]['group_id']) &&  $q[$i]['group_id'] > 0)
					$fullname = $q[$i]['group_name'];
					
					
				if(isset($q[$i]['page_id']) && $q[$i]['page_id'] > 0)
				 continue;
				 
				 $q[$i]['fullname'] = $fullname;
				 
				 if(isset($q[$i]['group_id']) && $q[$i]['group_id'] > 0)
					$res['groups'][] = $q[$i];
				 else if($i <= 5)
					$res['recent'][] = $q[$i];
				 else
					$res['contacts'][] = $q[$i];
					
					
				
			
			endfor;
		
		} else {
			
			for($i=0;$i<count($q);$i++):
			
			$fullname = empty($q[$i]['first_name']) ? $q[$i]['username'] : $q[$i]['first_name'].' '.$q[$i]['last_name'];
			
			
			if(isset($q[$i]['avatar']))
					$q[$i]['avatar'] = $this->get_avatar($q[$i]['avatar']);
					
			if(isset($q[$i]['group_id']) &&  $q[$i]['group_id'] > 0)
					$fullname = $q[$i]['group_name'];
			
			
			$q[$i]['fullname'] = $fullname;
			
				 if(isset($q[$i]['group_id']) && $q[$i]['group_id'] > 0)
					$res['groups'][] = $q[$i];
				 else
					$res['contacts'][] = $q[$i];
			
			endfor;
			
			 
		}
		
	} else $res['end'] = 'yes';

	
	echo $this->je($res);
	
	
}
public function searchInAllMyContactsQuery($key = ''){
	

$i = $this->userid;
 

$rows = $sort = array();
$query = $this->query_select("
				select u.first_name,u.last_name,u.username,u.avatar as avatar,u.user_id, u.lastseen as last_seen from  ".tbl_users." u
 
		where

		u.user_id NOT IN (SELECT `blocked` from ".tbl_blacklist." where `blocker`='{$i}') 
		&&
		u.user_id NOT IN (SELECT `blocker` from ".tbl_blacklist." where `blocked`='{$i}') 
		&&
		(
		u.user_id IN (select s.user_id from ".tbl_userschat." s where ( (s.conversation_user_id='{$i}' && s.user_id = u.user_id) || (s.conversation_user_id=u.user_id && s.user_id = '{$i}') ) )
		|| u.user_id IN (select f.following_id from ".tbl_followers." f where f.follower_id='{$i}'  && f.following_id = u.user_id )
		
		)
		&&
		(u.first_name LIKE N'%{$key}%' OR u.last_name LIKE N'%{$key}%' OR u.username LIKE N'%{$key}%') 
		group by u.user_id order by u.first_name ASC,u.last_name ASC,u.username ASC limit 100");
							
$select_group_chats = $this->query_select("select gu.group_id as group_id, gu.last_seen as last_seen, g.group_name as group_name, g.avatar as avatar from ".tbl_gchat_users." gu
											left join ".tbl_gchat." g ON g.group_id = gu.group_id 
										
											where gu.user_id='{$i}' && g.group_name LIKE N'%{$key}%'  
											group by gu.group_id order by g.group_name ASC limit 100");
 
 
foreach($query as $key):

$rows[] = $key;

endforeach;

foreach($select_group_chats as $key):

$key['page_id'] = 0; 
$key['user_id'] = $key['group_id']; 
$key['username'] = $key['group_name'];
$key['first_name'] = $key['group_name'];
$key['last_name'] = $key['group_name'];
$key['group_name'] = $key['group_name'];
$key['online'] = $key['last_seen'];
$key['online_status'] = $this->is_groupchat_online($key['group_id']);
$rows[] = $key;

endforeach;
foreach($rows as $k=>$v) {
	 
     $sort['last_seen'][$k] = $v['last_seen'];
}
if(count($rows))
array_multisort($sort['last_seen'], SORT_DESC, $rows);

return $rows;
}
public function searchInAllMyContacts(){
	
	$key = isset($_POST['key']) ? $this->test_input($_POST['key']) : '';
	
	$online_interval = strtotime("-1 minute");
	$res = array("msg"=> $this->lang['Messenger_empty_contacts_no_followers'], "users" => array());
	
	$q = $this->searchInAllMyContactsQuery($key);
 

	if(count($q)){
		$res['msg'] = "done";
		
		for($i=0;$i<count($q);$i++):
		
			$fullname = empty($q[$i]['first_name']) ? $q[$i]['username'] : $q[$i]['first_name'].' '.$q[$i]['last_name'];
			
			if(isset($q[$i]['avatar']))
				$q[$i]['avatar'] = $this->get_avatar($q[$i]['avatar']);
			

			if(isset($q[$i]['group_id']) && $q[$i]['group_id'] == 0)
				$q[$i]['online_status'] = $q[$i]['online'] > $online_interval;
			
			if(isset($q[$i]['group_id']) && $q[$i]['group_id'] > 0)
				$fullname = $q[$i]['group_name'];
			
			if(isset($q[$i]['page_id']) && $q[$i]['page_id'] > 0) {
				
				$page_details = $this->getPageDetails($q[$i]['page_id'],1,1);
				
				if ($page_details[1] == $this->USER['id'])
					$fullname = $fullname." (".$page_details[0].")";
				else {
					$fullname = $page_details[0];
					$q[$i]['avatar'] = $page_details[2];
				}
				
			}
			
			$q[$i]['fullname'] = $fullname;
		
		endfor;
		$res["users"] = $q;
	}
	
	echo $this->je($res);
}
public function getTotalUnreadMsgFromGroups() {
	
	$i = $this->USER['id'];
	$r = $this->db->query("select count(m3.id) as total from ".tbl_msg." as m3 where m3.to_id='0' && m3.group_id IN(select `group_id` from ".tbl_gchat_users." where user_id='{$i}') && m3.page_id='0' && FIND_IN_SET('{$i}', m3.group_seen) = 0 group by m3.group_id");
	$r = $r->fetch_array(MYSQLI_ASSOC);
	return $r['total'];
	
}
public function getTotalGroupsCount() {
	
	$i = $this->USER['id'];
	$r = $this->db->query("select COUNT(*) from ".tbl_gchat_users." where `user_id`='{$i}' && `active`=1");
	$r = $r->fetch_row();
	return $r[0];
	
}
 public static function _getTotalGroupsCount() {
	return (new MESSENGER)->getTotalGroupsCount();
}
public function getCountByUser($userid = 0, $page_id = 0, $group_id = 0){
		$i = $this->USER['id'];
		$page_mc= "&& mc.page_id='0'";

		if($page_id > 0){
			$page_mc= "&& mc.page_id='{$page_id}'";
		}
		
		if($group_id > 0){
			$total_q    =	$this->db->query("select count(*) as total from ".tbl_msg." where to_id='0' && group_id = '{$group_id}' && page_id='0' && FIND_IN_SET('{$i}', group_seen) = 0 && `from_id`!='{$i}'");
		} else {
			$total_q    =	$this->db->query("SELECT count(*) as total from ".tbl_msg." mc where mc.read='no' and mc.seen='0' ". $page_mc ." && mc.group_id='0' and mc.from_id='{$userid}' and mc.to_id='{$i}'");
		}
		
		$total_count	=	$total_q->fetch_array(MYSQLI_ASSOC);
		$total_count = isset($total_count['total']) ? $total_count['total'] : 0;
		return $total_count;
}
public function getAttachments($uid,$page = 0){
	
	$_limit =  $this->settings['MESSENGER_ATTACHMENTS_LIMIT']; // from settings
	$start = ($page * $_limit) - $_limit;
	 

	$limit = $page ? "limit {$start},{$_limit}" : "limit ".$_limit;

	$i = $this->USER['id'];
	$response = array("success" => 0, "info" => "no");
	$room_id = $this->page_id ? $this->generateRoomId($uid,$i,$this->page_id) : ($this->group_id > 0 ? $this->generateRoomId($uid,$i,0,$this->group_id) : $this->generateRoomId($uid,$i));
 
	if($uid > 0){
		
		
		
		$query = $this->query_select("select * from ".tbl_msg_media." where `room_id`='{$room_id}'
										order by added desc ".$limit);
										
										
		if(count($query)){
			
			
			foreach($query as $res):
			
				$response['files'][] = array('id' => $res['id'], 'type' => $res['type'], 'url' => $this->settings['HOST'].'/'.MEDIA_DIR.'/'.$room_id.'/'.$res['file']);
			
			endforeach;
			
			$response['info'] = 'yes';
			
			
		}
		
		
		$response['success'] = 1;
		
		
		
	}
	
	echo $this->je($response);
}

public function getChatCurrentColor($uid){
	global $wo;
	$i = $this->USER['id'];
	$sql_group = "select `settings` from ".tbl_messenger_settings." where `group_id`='{$this->group_id}' limit 1";
	$sql = "select `settings` from ".tbl_messenger_settings." where (`userid`='{$i}' && `recipient`='{$uid}') || (`userid`='{$uid}' && `recipient`='{$i}') limit 1";
	
	$q = $this->db->query($this->group_id > 0 ? $sql_group : $sql);
	$r = $q->fetch_array(MYSQLI_ASSOC);
	$color_theme_original = $this->getThemeColor(); 
	$color = $color_theme_original;
	$theme = $wo['vy-messenger']['config']['chat']['default_theme'];
	if(isset($r['settings'])){
		
		$settings = json_decode($r['settings'],true);
		
		$color = isset($settings['color']) ? $settings['color'] : $color_theme_original;
		$theme = isset($settings['theme']) ? $settings['theme'] : $theme;
	}
	
	if(isset($settings['color']) && $color != $settings['color']){

		$color = $color_theme_original;
	}
	
	return $this->je(["color" => $color,"theme" => $theme]);
	
}

public function getConversationSettings($uid,$count = false){
	
	$i = $this->USER['id'];
	$sql = "select `settings`,`userid` from ".tbl_messenger_settings." where (`userid`='{$i}' && `recipient`='{$uid}') || (`userid`='{$uid}' && `recipient`='{$i}') limit 1";
	$sql_groups = "select `settings`,`userid` from ".tbl_messenger_settings." where `group_id`='{$this->group_id}' limit 1";
	$settings = $this->query_select($this->group_id > 0 ? $sql_groups : $sql);
 
	if($count){
		
		return count($settings);
		exit;
	}
	
	if(count($settings)){
		
		return $settings;
	} else {
 
		return array("0" => array("userid" => 0, "settings" => $this->je($this->defaultConversationSettings())));
	}
}
public function je (array $arr){
	
	return json_encode($arr,JSON_UNESCAPED_UNICODE);
}
public function saveMessengerSettings($settings,$recipient_id){
	
	$settings = $this->je($settings);
	$i = $this->USER['id'];
	$text = $this->USER['name'];
	$sql = "update ".tbl_messenger_settings." set `added`='{$this->now}',`userid`='{$i}',`recipient`='{$recipient_id}',`settings`='{$settings}',`text`='{$text}' where (userid='{$i}' and `recipient`='{$recipient_id}' || userid='{$recipient_id}' and `recipient`='{$i}')";
	$sql_groups = "update ".tbl_messenger_settings." set `added`='{$this->now}',`userid`='0',`recipient`='0',`settings`='{$settings}',`text`='{$text}' where `group_id`='{$this->group_id}'";
	return $this->query_update($this->group_id > 0 ? $sql_groups : $sql);
	
}
public function addMessengerSettings($settings,$recipient_id){
	
	$settings = $this->je($settings);
	$i = $this->USER['id'];
	$text = $this->USER['name'];
	$sql = "insert into ".tbl_messenger_settings." set `added`='{$this->now}',`userid`='{$i}',`recipient`='{$recipient_id}',`settings`='{$settings}',`text`='{$text}'";
	$sql_groups = "insert into ".tbl_messenger_settings." set `added`='{$this->now}',`userid`='0',`recipient`='0',`settings`='{$settings}',`text`='{$text}',`group_id`='{$this->group_id}'";
	return $this->query_insert($this->group_id > 0 ? $sql_groups : $sql);
		
	
}
public function defaultConversationSettings(){
						$default_settings = array();
						$default_settings['color'] = $this->getThemeColor(); 
						$default_settings['nicknames']['recipient'] = '';
						$default_settings['nicknames']['my'] = '';
					
						return $default_settings;
}
public function updateMessengerSettings($recipient_id,$updated_settings){
	

	$response = 0;
	// get settings
	$curr_settings = $this->getConversationSettings($recipient_id,1);
 

				// if settings exists, just update
				if($curr_settings){
 
					
					if($this->saveMessengerSettings($updated_settings,$recipient_id))
						$response = 1;
					
					
					
				} else {
 
					if($this->addMessengerSettings($updated_settings,$recipient_id))
						$response = 1;
					
					
				}
				
				
				
	
	return $response;
}
// set color
public function setTheme($uid = 0){
	
	$theme = isset($_POST['theme']) ? $this->test_input($_POST['theme']) : $this->settings['MESSENGER_DEFAULT_THEME'];	
	$i = $this->USER['id'];
	$r = 0;
 
		if($uid > 0 && $i > 0){
				// get settings
				$curr_settings = array();
				$curr_settings = $this->getConversationSettings($uid);
		 
		
				// if settings exists, just update
				if(count($curr_settings)){
 
					foreach($curr_settings as $settings):
					$curr_settings = json_decode($settings['settings'],true);
					endforeach;
					

				} 
	
	
		$curr_settings['theme'] = $theme;
		$curr_settings['color'] = $this->getThemeColor($theme);
		$r = $this->updateMessengerSettings($uid,$curr_settings);
 
		}
		
		
	return $this->getChatCurrentColor($uid);
}


// get users
public function openBox(){
$i = $this->userid; 
$query = $this->getDialogQuery();

$this->template->assign(['this' => $this, 'query' => $query, 'i' => $i, 'sct' => '1']);
$content = $this->template->fetch($this->theme_dir."/messenger-box.html");

echo $this->getPage($content);
}
public function getUnreadMessagesCount($from_id){
 
$q = $this->db->query("select COUNT(*) from ".tbl_msg." where `to_id`='{$this->userid}' and `from_id`='{$from_id}' and `read`='no' and `seen`='0'");
$q = $q->fetch_row();
$c = $q[0];
return $c;
	
}

public function groupAdmin($group_id){
	$admin_id = 0;
	if($group_id > 0){
		
		$q = $this->db->query("select `user_id` from ".tbl_gchat." where `group_id`='{$group_id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
		if(isset($r['user_id']))
			$admin_id = $r['user_id'];
	}
	
	return $admin_id;
	
}
public function constructPage($uid = 0){
	global $svgI,$wo;
	
$contacts = $this->getDialogQuery();

if (isset($_COOKIE['chat_session'])) {
    unset($_COOKIE['chat_session']); 
    setcookie('chat_session', null, -1, '/'); 
 
}  
if (isset($_COOKIE['chattab_minimized'])) {
    unset($_COOKIE['chattab_minimized']); 
    setcookie('chattab_minimized', null, -1, '/'); 
 
}  
 $page_id = isset($_GET['page_id']) ? $this->test_input($_GET['page_id']) : 0;
 $group_id = isset($_GET['group_id']) ? $this->test_input($_GET['group_id']) : 0;
 
 if(!$this->checking($uid,$page_id,$group_id)){
	header("location: /messenger");
	exit;
 }
 
	$m = $this->phpMutedContacts();
	$muted_contacts = $m[0];
	$muted_groups = $m[1];
	$muted_pages = $m[2];

	$this->template->assign(['wo' => $wo, 'this' => $this, 'svgi' => $svgI, 'muted_arr' => ['contacts' => $muted_contacts, 'groups' => $muted_groups, 'pages' => $muted_pages], 'dark' => isset($_COOKIE['mode']) && $_COOKIE['mode'] == 'night' ? 'h4active' : '', 'contacts' => $contacts, 'page_id' => $page_id, 'userid'=> $uid, 'group_id' => $group_id ]);
	
	$content = $this->template->fetch($this->theme_dir."/messenger.html");
	echo $this->getPage($content);
}
public function checking($uid,$page_id,$group_id){
	$i = $this->USER['id'];
	
	if(!$i || ($uid == $i && !$group_id && !$page_id))
		return false;
	
	if($page_id > 0){
		
		$check = $this->db->query("select count(*) from ".tbl_pages." where `page_id`='{$page_id}' limit 1");
		
	} else if($group_id > 0){
		$check = $this->db->query("select count(*) from ".tbl_gchat_users." where `group_id`='{$group_id}' && `user_id`='{$i}' && `active`='1' limit 1");
	} else if($uid > 0){
		$check = $this->db->query("select count(*) from ".tbl_users." where `user_id`='{$uid}' limit 1");
	} else 
		return true;
	
	$q = $check->fetch_row();
	$c = $q[0];
	
	return $c;
}
public function check_privacy(){
	
	$userid = $this->id;
	$r = array("status" => 200, "privacy" => 0, "msg" => "OK", "group_admin" => 0);
	
	$sql = "select `message_privacy` from ".tbl_users." where `user_id`='{$userid}' limit 1";
	$query = $this->query_select($sql);
	
	if(count($query) && !$this->group_id){
	foreach($query as $result):
	
		switch($result['message_privacy']){
			
			
			case '1':
				$is_follow = Wo_IsFollowing($this->userid, $userid);
				
				if(!$is_follow)
					$r = array("status" => 403, "privacy" => 1, "group_admin" => 0, "msg" => $this->lang['messenger_user_accept_messages_from_flw']);
			break;
			
			case '2':
			$r = array("status" => 403, "privacy" => 2, "group_admin" => 0, "msg" => $this->lang['messenger_user_not_accept_msg']);
			break;
			

			
			
		}
	
	endforeach;
	} else if($this->group_id > 0){
 
		$r['group_admin'] = $this->checkGroupAdmin($this->USER['id'],$this->group_id);
		
	} else 
		$r = array("status" => 404, "privacy" => 0, "group_admin" => 0, "msg" => $this->lang['messenger_user_not_found']);
	
	echo $this->je($r);
	
}
public function checkForBlacklist($userid){
	
$i = $this->USER['id'];	
$q_blacklist = $this->db->query("select `id` from ".tbl_blacklist." where (`blocker` = '{$userid}' and `blocked`='{$i}') || (`blocker` = '{$i}' and `blocked`='{$userid}') limit 1");
$r_blacklist = $q_blacklist->fetch_array(MYSQLI_ASSOC);
	
return isset($r_blacklist['id']) && $r_blacklist['id'] > 0 ? 1 : 0;
	
}
// send message
public function sendMessage($msg,$to_id,$result = true,$shared = false,$no_background = false){

$i = $this->USER['id'];
$msg_to_db = $this->test_input($msg);
$msg = $this->test_input($msg,0,1);
$forwarded = $this->post_vars('forwarded');

$bg = $no_background ? 'no' : (isset($_POST['bg']) ? $this->test_input($_POST['bg']) : 'yes');

 
$msg_to_db =nl2br($msg_to_db);
// stop sending to yourself
if($to_id === $this->userid && ($this->group_id <= 0 || !$this->page_id <= 0)) die("You can not send messages to yourself");

// stop sending messages from 0 id
if(!$i) die("Please login to be able to send messages.");

// check if the user is in blacklist
if($this->checkForBlacklist($to_id)){
	
echo $this->sendResponse(['response' => 'blacklist']);
die;

}

 
$shared = $shared ? 'yes' : 'no';
$page = $this->page_id ? "`page_id`='{$this->page_id}'," : '';
$group = $this->group_id > 0 ? "`group_id`='{$this->group_id}'," : '';
$to_id = $group ? 0 : $to_id;

$now = time();
$insert = $this->query_insert("insert into ".tbl_msg." set ".$page.$group." `replied`='{$this->reply}',`bg`='{$bg}', `forwarded`='{$forwarded}', `text`='{$msg_to_db}', `from_id`='{$i}', `to_id`='{$to_id}', `time`='{$now}', `lastby`='{$i}',`unsettled_msg_id`='{$this->id}'");
$this->addUserToChat($to_id);


if(!$result) return false;

if($insert){
 
echo $this->sendResponse([
							 'response' => 'success',
							 'msg_random_id' => $this->id,
							 'id' => $insert,
							 'curr_date' => date('j'),
							 'bg' => $bg,
							 'min_text' => $this->str_messenger($msg,1),
							 'text' => $this->str_messenger($msg),
							 'shared' => 'no',
							 'timestamp' => $now,
							 'time' => $this->pm_time($now),
							 'group_id' => $this->group_id,
							 'msgid' => $insert,
							 'recipient' => $to_id,
							 'forwarded' => $forwarded,
							 'cache_message' => $this->getConversation($to_id,1,1)
 ]);

} else {

echo $this->sendResponse(['response' => $this->lang['pm_not_delivered']]);

}

}
public function updateMessageAsSeen($id){
	$page = "`page_id`='0' && ";
	if($this->page_id > 0)
		$page = "`page_id`='{$this->page_id}' && ";
	// set messages as read
	$set_read = $this->setMessageAsRead("update ".tbl_msg." set `read`='yes',`seen`='{$this->now}' where ".$page." `id`='{$id}' limit 1",$this->userid,1);
}
public function updateAllMessagesAsRead($from_id){
	
	$i = $this->USER['id'];
	$page = "`page_id`='0' && ";
	if($this->page_id > 0)
		$page = "`page_id`='{$this->page_id}' && ";
	
	if($this->group_id > 0){
		
		// set messages as read
		$set_read = $this->setMessageAsRead("UPDATE ".tbl_msg." SET `read`='yes' , `seen`='{$this->now}', group_seen = CONCAT(group_seen,',{$i}') WHERE FIND_IN_SET ('{$i}', group_seen) = 0 AND `group_id` = '{$this->group_id}'",$this->userid,1);
 
	} else {
	
		// set messages as read
		$set_read = $this->setMessageAsRead("update ".tbl_msg." set  `read`='yes' , `seen`='{$this->now}' where ".$page." (`read`='no' || `seen`='0') and `to_id`='{$this->userid}' and `from_id`='{$from_id}'",$this->userid,1);
		
	}
}
public function nodeLastMessage($userid){
	$i = $this->USER['id'];
	$q = $this->query_select("Select * from ".tbl_msg." where from_id='{$userid}' and `to_id`='{$i}' and `read`='no' and `seen`='0'	order by id desc limit 1");
 
 $message = array();
	if(count($q)){
		
		foreach($q as $r):
			$msg_id = $r['id'];
 
			// set messages as read
			$set_read = $this->setMessageAsRead("update ".tbl_msg." set `read`='yes', `seen`='{$this->now}' where `id`='{$msg_id}' limit 1",$i,1);
 
			$message = array('bg' => $r['bg'], 
			'min_text' => $this->str_messenger($r['text'],1), 
			'text' =>	$this->str_messenger($r['text']),
			'shared' => $r['shared'],  
			'time' => $this->pm_time($r['time']), 
			'msgid' => $msg_id, 
			'from_id' => $r['from_id'],
			'to_id' => $r['to_id']);
		
		endforeach;
		
		
	}
	
	echo count($q) > 0 ? $this->je(["message" => $message, "count" => 1, "allowsendpm" => 1]) : 
	$this->je(["message" => $message, "count" => 0, "allowsendpm" => 1, 'exp' => $this->lang['pm_no_msg'], 'sub' => $this->lang['pm_first_move'] ]);

	
}

 



// report message
public function reportMessage($id){
$i = $this->userid;
$up_m = $this->lang['pm_reported_msg'];
// check if the message exist
$q_check = $this->db->query("select `id`,`deleteby` from ".tbl_msg." where `id` = '{$id}' limit 1");
$r_check = $q_check->fetch_array(MYSQLI_ASSOC);

if($r_check['id'] && $r_check['deleteby'] != $i) {
$delete = $this->query_delete("update ".tbl_msg." set `deleteby`='{$i}' where `id` = '{$id}'");
$insert_in_report = $this->query_insert("insert into ".tbl_report." SET `type` = 'private_messages', `type_id`='".$r_check['id']."', `report_by`='{$i}', `added`='".time()."'");
echo '1';
} else
echo $this->lang['pm_not_found'];

}

// delete message
public function deleteMessage($id){
	
$i = $this->userid;
$group_id = $this->group_id;
$msg_unsettled_id = isset($_POST['msg_unsettled_id']) ? $this->test_input($_POST['msg_unsettled_id']) : 0;
$_from = isset($_POST['foreign_msg']) ? $this->test_input($_POST['foreign_msg']) : '';
 $direct = isset($_POST['direct']) ? $this->test_input($_POST['direct']) : false;

$sql_where = "`id` = '{$id}'";

if(is_numeric($msg_unsettled_id) && $msg_unsettled_id > 0)
$sql_where .= " || `unsettled_msg_id`='{$msg_unsettled_id}' ";

$reactions_db = new DB($this->db_path."reactions.json");
$db_id = $this->json_db_id($id.'-'.$i);


$q = ["unsettled_msg_id" => $msg_unsettled_id];
$q = $reactions_db->getList($q);
if(count($q))
	$db_id = $this->json_db_id($msg_unsettled_id.'-'.$i);
 
// delete message automatically by admin in group
if($group_id > 0 && $this->checkGroupAdmin($i,$group_id)){
	
	$delete = $this->query_delete("delete from ".tbl_msg." where ".$sql_where." && `group_id`='{$group_id}'");
	if($delete){
		$reactions_db->delete($db_id);
		echo '1';
	}
	die();
}
	
 if(!$direct){
if($_from == 'from_me')
	$sql_where .= " && `from_id`='{$i}'";
else if($_from == 'from_they')
	$sql_where .= " && `to_id`='{$i}'";
else {
	
	echo $this->lang['pm_not_found'];
	exit();
}
 }
// check if the message exist
$q_check = $this->db->query("select `id`,`deleteby`,`text` from ".tbl_msg." where ".$sql_where." limit 1 ");
$r_check = $q_check->fetch_array(MYSQLI_ASSOC);
 error_reporting(E_ALL);
 
if(isset($r_check['text']) && (strpos($r_check['text'], '[img]') !== false || strpos($r_check['text'], '[video]') !== false)){
 
	// delete videos
				preg_replace_callback("/\[video\]((\s|.)+?)\[\/video\]/i", function($video_id) {

					$id = $video_id[1];

					if(is_numeric($id) && $id > 0){
						
						
						$q = $this->db->query("select `storage`,`file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
						$r = $q->fetch_array(MYSQLI_ASSOC);
						
						
						if(isset($r['file']) && !empty($r['file'])){
							
								switch($r['storage']){
									
									case 's3':
										$video_file = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$this->storage_path.'media/'.$r['room_id'].'/'.$r['file'];

									$s3_folder = $this->storage_path.'media/'.$r['room_id'];
									if($this->s3->deleteObject(S3_BUCKET_NAME.'/'.$s3_folder, $r['file']))
										$this->db->query("delete from ".tbl_msg_media." where `id`='{$id}'");
									break;
									case 'null':
									case 'NULL':
									case '':
									default:
										$video_file = $_SERVER['DOCUMENT_ROOT'].MEDIA_DIR.$r['room_id'].'/'.$r['file'];
										if(@unlink($video_file))
											$this->db->query("delete from ".tbl_msg_media." where `id`='{$id}'");

									break;
								}
							
						}
 
								
					}
					
					return true;
					
				}, $r_check['text']);


				// delete images
				preg_replace_callback("/\[img\]((\s|.)+?)\[\/img\]/i", function($image_id) {

					$id = $image_id[1];

					if(is_numeric($id) && $id > 0){
						
						
						$q = $this->db->query("select `storage`,`file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
						$r = $q->fetch_array(MYSQLI_ASSOC);
						
			 
						if(isset($r['file']) && !empty($r['file'])){
							
								switch($r['storage']){
									
									case 's3':
										$image_file = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$this->storage_path.'media/'.$r['room_id'].'/'.$r['file'];

									$s3_folder = $this->storage_path.'media/'.$r['room_id'];
									if($this->s3->deleteObject(S3_BUCKET_NAME.'/'.$s3_folder, $r['file']))
										$this->db->query("delete from ".tbl_msg_media." where `id`='{$id}'");
									break;
									case 'null':
									case 'NULL':
									case '':
									default:
										$image_file = $_SERVER['DOCUMENT_ROOT'].MEDIA_DIR.$r['room_id'].'/'.$r['file'];
										if(@unlink($image_file))
											$this->db->query("delete from ".tbl_msg_media." where `id`='{$id}'");

									break;
								}
							
						}
 
								
					}
					
					return true;
					
				}, $r_check['text']);

}

if($this->action == 'everyone'){
$delete = $this->query_delete("delete from ".tbl_msg." where ".$sql_where);
$reactions_db->delete($db_id);
echo '1';
} else 

if($r_check['id'] && $r_check['deleteby']) {
$delete = $this->query_delete("delete from ".tbl_msg." where ".$sql_where);
$reactions_db->delete($db_id);
echo '1';
} else if($r_check['id'] && !$r_check['deleteby']) {
$update = $this->query_update("update ".tbl_msg." set `deleteby` = '{$i}' where ".$sql_where);
echo '1';
} else
echo $this->lang['pm_not_found'];

}
// update user online status
public function updateUserOnlineStatus(){
	
	$q = $this->query_update("update ".tbl_users." set `lastseen`='{$this->now}' where `user_id`='{$this->id}'");
	
}
public function getuserLastActivity(){
	
	$lastseen = '';
	$q = $this->db->query("select `lastseen` from ".tbl_users." where `user_id`='{$this->id}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if(isset($r['lastseen'])){
		
		$lastseen = date(DATE_RFC2822,$r['lastseen']);
	}
	
	return $lastseen;
	
}
// user to blacklist
public function toBlacklist($id){

$i = $this->userid;
$r = '0';
$now = time();
// check if the user exist into blacklist
$check = $this->db->query("select `id` from ".tbl_blacklist." where `blocker`='{$i}' and `blocked`='{$id}' || `blocker`='{$id}' and `blocked`='{$i}'");
$exist = $check->fetch_array(MYSQLI_ASSOC);


if(!$exist['id']){ 

// insert into database
$insert = $this->query_insert("insert into ".tbl_blacklist." set `blocker` = '{$i}', `blocked` = '{$id}'");

$r = '1';
}
else if($exist['id']) $r = $this->lang['pm_us_exist_blacklist'];

echo $r;

}

// hide conversation
public function hideConversation($id){

$i = $this->userid;

// hide 
$q = $this->query_update("update ".tbl_msg." set `hidden`='yes' where `to_id`='{$i}' and `from_id`='{$id}' or `to_id`='{$id}' and `from_id`='{$i}'");

echo 1;
}

// delete conversation
public function delConversation($id){

$i = $this->userid;
 
// check if the exist messages
$q_ch = $this->db->query("select `id` from ".tbl_msg." where `to_id`='{$i}' and `from_id`='{$id}' and `deleteby`!='{$i}' and `page_id`='{$this->page_id}' or `to_id`='{$id}' and `from_id`='{$i}' and `deleteby`!='{$i}' and `page_id`='{$this->page_id}' limit 1");
$r_ch = $q_ch->num_rows;

if($r_ch)
// when the opponent user call this action then delete it from database
$dte = $this->query_delete("delete from ".tbl_msg." where `to_id`='{$i}' and `from_id`='{$id}' and `deleteby` = '{$id}' and `page_id`='{$this->page_id}' OR `to_id`='{$id}' and `from_id`='{$i}' and `deleteby` = '{$id}' and `page_id`='{$this->page_id}'");

// so if one user has called to delete, we have only to hide it from respective user
$uptd = $this->query_update("update ".tbl_msg." set `deleteby`='{$i}' where `to_id`='{$i}' and `from_id`='{$id}' and `deleteby` = '' and `page_id`='{$this->page_id}' OR `to_id`='{$id}' and `from_id`='{$i}' and `deleteby` = '' and `page_id`='{$this->page_id}'");
$delete_dialog = $this->query_delete("delete from ".tbl_userschat." where `user_id`='{$i}' && `conversation_user_id`='{$id}' && `page_id`='{$this->page_id}'");

if($uptd || $dte)
echo '1';
else
echo $this->lang['pm_err_delete_conv'];
}

// search friends
public function PMsearchForFriends(){  
$key = isset($_POST['key']) ? $this->test_input($_POST['key']) : '';
$i = $this->userid;
$rsp = $query = array();

$sql = "select u.first_name,u.last_name,u.username,u.avatar as avatar,u.user_id from  ".tbl_users." u
		 
		where

		u.user_id NOT IN (SELECT `blocked` from ".tbl_blacklist." where `blocker`='{$i}') 
		&&
		u.user_id NOT IN (SELECT `blocker` from ".tbl_blacklist." where `blocked`='{$i}') 
		&&
		(
		u.user_id IN (select s.user_id from ".tbl_userschat." s where ( (s.conversation_user_id='{$i}' && s.user_id = u.user_id) || (s.conversation_user_id=u.user_id && s.user_id = '{$i}') ) )
		|| u.user_id IN (select f.following_id from ".tbl_followers." f where f.follower_id='{$i}'  && f.following_id = u.user_id )
		
		)
		&&
		(u.first_name LIKE N'%{$key}%' OR u.last_name LIKE N'%{$key}%' OR u.username LIKE N'%{$key}%') 
		group by u.user_id order by u.lastseen desc limit 100";

$query = $this->query_select($sql);

foreach($query as $res)
$rsp[] = array('id' => $res['user_id'], 'name' => empty($res['first_name']) ? $res['username'] : $res['first_name'].' '.$res['last_name'], 'photo' => $this->get_avatar($res['avatar']), 'online' => $this->getUserStatus($res['user_id']));

echo $this->je($rsp);
}

// get more conversations
public function getMoreContacts($page){
global $svgI;
$i = $this->userid;
$query = $this->getDialogQuery($page);

 
 
 if(!count($query))
	 $content = "0";
 else {
	$m = $this->phpMutedContacts();
	$muted_contacts = $m[0];
	$muted_groups = $m[1];
	$muted_pages = $m[2];


$this->template->assign(['this' => $this, 'contacts' => $query, 'svgi' => $svgI, 'muted_arr' => ['contacts' => $muted_contacts, 'groups' => $muted_groups, 'pages' => $muted_pages], 'i' => $i,'nullreturn' => 1, 'sct' => false,'group_id' => 0, 'page_id' => 0, 'userid'=> 0]);
$content = $this->template->fetch($this->theme_dir."/contact-markup.html");
 }
 
echo $this->getPage($content);

}
 
public function phpMutedContacts () {
	
	$muted_contacts = $muted_groups = $muted_pages = array();

	if(isset($_SESSION['VY_MS_MUTED_CONTACTS']) && $this->isarray($_SESSION['VY_MS_MUTED_CONTACTS']) && count($_SESSION['VY_MS_MUTED_CONTACTS']) ) {
	
		$_muted = $_SESSION['VY_MS_MUTED_CONTACTS'];
		
		if(count($_muted['contacts']))
		{
			$_muted_contacts = $_muted['contacts'];
			for($j=0;$j<count($_muted_contacts);$j++)
				$muted_contacts[$_muted_contacts[$j]['id']] = $_muted_contacts[$j]['interval'];
		}
		if(count($_muted['groups']))
		{
			$_muted_groups = $_muted['groups'];
			for($j=0;$j<count($_muted_groups);$j++)
				$muted_groups[$_muted_groups[$j]['id']] = $_muted_groups[$j]['interval'];
		}
		if(count($_muted['pages']))
		{
			$_muted_pages = $_muted['pages'];
			for($j=0;$j<count($_muted_pages);$j++)
				$muted_groups[$_muted_pages[$j]['id']] = $_muted_pages[$j]['interval'];
		}
		
	}
 
	return [$muted_contacts,$muted_groups,$muted_pages];
	
}
public function moreAttachments($uid){
	
	$page = isset($_POST['offset']) ? $this->test_input($_POST['offset']) : 0;
	return $this->getAttachments($uid,$page);
	
}
// get previous messages
public function getPrevMessages($uid,$page) {

$i = $this->userid;
$messages = array();
$query = $this->run_msg_query($uid,$page);
 
 
if($this->page_id > 0) {
	
	$page_details = $this->getPageDetails($this->page_id,1,1);
	$page_avatar = isset($page_details[2]) ? $page_details[2] : '';
	$page_name = isset($page_details[0]) ? $page_details[0] : 'unknown name';
	$page_avatar = $i != $page_details[1] ? $page_avatar : $this->getUserData($uid,['avatar','fullname']);
	
}
 
foreach($query as $result){

$date = date('Y-m-d',$result['time']);
$user_data = $this->page_id > 0 ? array("avatar" => $page_avatar, "fullname" => $page_name) : ($result['group_id'] > 0 ? $this->getUserData($result['from_id'],['avatar','fullname']) : $this->getUserData($uid,['avatar','fullname']));
$dateMonth = date('Y',$result['time']) == date('Y') ? ($date === date('Y-m-d') ? $this->lang['today'] : ($date == date('Y-m-d',strtotime("-1 day")) ? $this->lang['yesterday'] : date('j F', $result['time']))) : date('j F, Y', $result['time']);
$messages[] = array('id' => $result['id'], 'forwarded' => $result['forwarded'], 'reactions' => $this->getMessageReactions($result['id']), 'msg' => $this->str_messenger($result['text']), 'from_id' => $result['from_id'],
		     'to_id' => $result['to_id'], 'user_fullname' => $result['group_id'] > 0 ? $user_data['fullname'] : '','user_avatar' => $user_data['avatar'], 'group_id' => $result['group_id'], 'page_id' => $result['page_id'], 'group_seen' => $result['group_seen'], 'count_group_seen' => $result['count_group_seen'], 'seen' => $result['seen'], 'timestamp' => $result['time'], 'time' => $this->pm_time($result['time']), 'lastby' => $result['lastby'], 'exp' => '0', 'count' => $result['c'] > $this->settings['PM_MESSAGES_LIMIT'] ? true : false,
		     'read' => $result['read'], 'unsettled_msg_id' => $result['unsettled_msg_id'], 'uonline' => $this->getUserStatus($uid), 'date' => $date, 'currDate' => date('j'), 'dateMonth' => $dateMonth);

}
echo count($query) > 0 ? $this->je($messages) : $this->je(['exp' => '1']);

}
// get user status
public function getUserStatus($u){

if(!$u) return false;
 
$request = $this->db->query("select `lastseen` from ".tbl_users." where `user_id`='{$u}' limit 1");
$response = $request->fetch_array(MYSQLI_ASSOC);

return isset($response['lastseen']) ? $response['lastseen'] > strtotime("-1 minute") : false;
}

public function setMessageAsRead($sql,$userid,$no_check = false){
	
	if($no_check)	
	    $socketio_data = array("event" => "messages_notif", "userid" => $userid, "aditional_data" => array("no_check" => true));
	else
		$socketio_data = array("event" => "messages_notif", "userid" => $userid);
	
	$update = $this->query_update($sql);
	
	if($update)
		$this->emit_notification_to_socketio($socketio_data);
	
	
	
	
}

public function getNicknames($uid) {
	
	
	
	$i = $this->USER['id'];
	
	
	if($this->group_id > 0)
		return $this->getMyNicknameInGroup($this->group_id);

	// get settings
	$curr_settings = array();
	$curr_settings = $this->getConversationSettings($uid);
	
	$response = array("success" => 1, "count" => 0, "my" => "", "recipient" => "");
 
	$nick_userid = 0;
	$nickname_exists = 0;
	// if settings exists, just update
	if( count($curr_settings) ){
		
 
			foreach($curr_settings as $settings):
				$nick_userid = $settings['userid'];
				$curr_settings = json_decode($settings['settings'],true);
				
				if(  (!empty($curr_settings['nicknames']['my']) && trim($curr_settings['nicknames']['my']) ) || (!empty($curr_settings['nicknames']['recipient']) && trim($curr_settings['nicknames']['recipient'])) )
					$nickname_exists = 1;
				
			endforeach;
			
			
			
			
		if($nick_userid != $i)
			$response = array("success" => 1, "recipient" => $curr_settings['nicknames']['my'], "my" => $curr_settings['nicknames']['recipient']);
		else
			$response = array("success" => 1, "my" => $curr_settings['nicknames']['my'], "recipient" => $curr_settings['nicknames']['recipient']);
			
			
			
		if($nickname_exists)
			$response['count'] = 1;
		else
			$response['count'] = 0;
			
			
	} 
	
 
	
	echo $this->je($response);
	
	
	
}
public function getGroupNicknames($group_id) {
	
		$nicknames = json_encode(array());
		$q = $this->db->query("select `group_nicknames` from ".tbl_messenger_settings." where `group_id`='{$group_id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
		
		if(isset($r['group_nicknames']) && $r['group_nicknames'] && $r['group_nicknames'] != "null" && $r['group_nicknames'] != NULL)
			$nicknames = $r['group_nicknames'];
				

			
		return $nicknames;
		
}
public function checkIfImInGroup($group_id){
	
	$i = $this->USER['id'];
	$itis = false;
	if($group_id > 0)
		$itis = count($this->query_select("select `id` from ".tbl_gchat_users." where `user_id`='{$i}' && `group_id`='{$group_id}' && `active`=1 limit 1"));
		
	return $itis;	
	
}
public function getMyNicknameInGroup($group_id,$return = false){
	
	
	$res = array("count" => 0, "my" => "", "msg" => $this->lang['Messenger_teh_err']);
	
	$i = $this->USER['id'];
	if($group_id > 0){
		
		$dbnicknames = json_decode($this->getGroupNicknames($group_id),true);
		
		
		if(count($dbnicknames) && isset($dbnicknames[$i])){
			
			$res['count'] = 1;
			$res['my'] = $dbnicknames[$i];
			
		}
		
 
 
 
	} 
	if($return) return $this->je($res); else
	echo $this->je($res);
	
	
}
public function groupExists($group_id){
	
	$check = $this->db->query("select count(*) from ".tbl_gchat." where `group_id`='{$group_id}' limit 1");
	$q = $check->fetch_row();
	return $q[0];
	
}
public function _jsonGroupdetails($a,$b = false,$c = false){
	$a = $this->getGroupDetails($a,$b,$c);
	return $this->je(array("group_name" => $a[0], "group_owner" => $a[1], "group_avatar" => $a[2]));
}
public function setNicknameInGroup($nickname,$group_id){
	
	$i = $this->USER['id'];
	$res = array("status" => "error", "msg" => $this->lang['Messenger_teh_err'], "group_data" => array());
	
	
	$nickname_short = trim($nickname) && strlen($nickname) < 2 ? true : false; 
	$nickname_long = trim($nickname) && strlen($nickname) > 25 ? true : false; 
	
	if($group_id > 0 && !$nickname_short && !$nickname_long && $this->groupExists($group_id)){
		
		$res['group_data'] = $this->_jsonGroupdetails($group_id,1,1);
		$nicknames = $this->je(array($i => $nickname));
		$dbnicknames = json_decode($this->getGroupNicknames($group_id),true);

		if(count($dbnicknames)){
 
 
			foreach ($dbnicknames as $userid => $nick):

 
				if($userid == $i && trim($nickname) && !empty($nickname))
					$dbnicknames[$userid] = $nickname;
				else if($userid != $i && trim($nickname) && !empty($nickname))
					$dbnicknames[$i] = $nickname;
				else if(isset($dbnicknames[$i]) && (trim($nickname) || empty($nickname)) )
					unset($dbnicknames[$i]);
			 
			endforeach;
			$nicknames = $this->je($dbnicknames);

		} 
 
		$update = $this->query_update("update ".tbl_messenger_settings." set `group_nicknames`='{$nicknames}' where `group_id`='{$group_id}'");
		if($update)
			$res['status'] = 200;
	} else if($group_id > 0 && $nickname_short)
		$res['msg'] = $this->lang['Messenger_nickname_too_short'];
	else if($group_id > 0 && $nickname_long)
		$res['msg'] = $this->lang['Messenger_nickname_too_long'];
	
	echo $this->je($res);
	
}
public function setNickname($uid){
	$i = $this->USER['id'];
	$recipient_nickname = isset($_POST['nickname_recipient']) ? $this->test_input($_POST['nickname_recipient']) : '';
	$my_nickname = isset($_POST['my_nickname']) ? $this->test_input($_POST['my_nickname']) : '';
	$my_name = $this->USER['name'];
	$r = 0;
	$exist_id = 0;
 
	if($this->group_id > 0)
		return $this->setNicknameInGroup($my_nickname,$this->group_id);
 
	if($uid){
		$r = 1;

				
				// get settings
				$curr_settings = array();
				$curr_settings = $this->getConversationSettings($uid);
		
		
				// if settings exists, just update
				if(count($curr_settings)){
 
					foreach($curr_settings as $settings):
					$curr_settings = json_decode($settings['settings'],true);
					endforeach;
					

				} 
		
 
		
		if( empty($recipient_nickname) ){

			// delete nickname from db
			$curr_settings['nicknames']['recipient'] = "";
 
			$value = array("recipient" => "");
			$delete = $this->updateMessengerSettings($uid,$curr_settings);
		}
		
		if( empty($my_nickname) ){


			$curr_settings['nicknames']['my'] = "";
 
			$value = array("my" => "");
			$delete = $this->updateMessengerSettings($uid,$curr_settings);
			
		} 
		
		if( (trim($recipient_nickname) && strlen($recipient_nickname) < 2) || (trim($my_nickname) && strlen($my_nickname) < 2) ){
			
			$r = $this->lang['Messenger_nickname_too_short'];
			
			
		}else if ( (trim($recipient_nickname) && strlen($recipient_nickname) > 25) || (trim($my_nickname) && strlen($my_nickname) > 25) ) {
			$r = $this->lang['Messenger_nickname_too_long'];
		} else {
			
			if($recipient_nickname){

			$curr_settings['nicknames']['recipient'] = $recipient_nickname;

			$value = array("recipient" => $recipient_nickname);
			$update = $this->updateMessengerSettings($uid,$curr_settings);
			
			}
			if($my_nickname){
				
					$curr_settings['nicknames']['my'] = $my_nickname;
					
					$value = array("my" => $my_nickname);
					$update = $this->updateMessengerSettings($uid,$curr_settings);

				
				
			}
			 $r = 1;
			
		}
		
		
		
		
	}  
		
		
	
	echo $r;
}
public function search_in_conversation($uid){
	
	$key = isset($_POST['key']) ? $this->test_input(urldecode($_POST['key'])) : '';
	$i = $this->USER['id'];
	$response = array("count" => 0,"messages" => array());
	$no_html = implode(" ",array("[img]","[/img]","[video]","[/video]","[divstart]","[divend]","[vdivstart]","[vdivend]","[gif]","[/gif]"));
	
	$sql = "select * from ".tbl_msg." where `text` LIKE N'%{$key}%' &&  
	(
	`text` NOT LIKE '%[sharelocation]%' && `text` NOT LIKE '%[stickerid]%' && `text` NOT LIKE '%[gif]%' && `text` NOT LIKE '%[img]%' && `text` NOT LIKE '%[video]%' && `text` NOT LIKE '%[divstart]%' && `text` NOT LIKE '%[missedcall]%' && `text` NOT LIKE '%[voice-clip]%' && `text` NOT LIKE '%[callended]%' 
	)


	and `deleteby` != '{$i}' and (`from_id`='{$i}' and `to_id`='{$uid}' and `page_id`='{$this->page_id}' or `from_id`='{$uid}' and `to_id`='{$i}' and `page_id`='{$this->page_id}') group by id order by time asc";
	$sql_groups = "select * from ".tbl_msg." where `text` LIKE N'%{$key}%' &&  
	(
	`text` NOT LIKE '%[sharelocation]%' && `text` NOT LIKE '%[stickerid]%' && `text` NOT LIKE '%[gif]%' && `text` NOT LIKE '%[img]%' && `text` NOT LIKE '%[video]%' && `text` NOT LIKE '%[divstart]%' && `text` NOT LIKE '%[missedcall]%' && `text` NOT LIKE '%[voice-clip]%' && `text` NOT LIKE '%[callended]%' 
	)


	and `deleteby` != '{$i}' and (`page_id`='0' and `group_id`='{$this->group_id}') group by id order by time asc";
	$query = $this->group_id > 0 ? $this->query_select($sql_groups) : $this->query_select($sql);
	
	
	if(count($query)){
		 
		foreach($query as $res):
		$date = date('j',$res['time']);
		$user_data = $res['group_id'] > 0 ? $this->getUserData($res['from_id'],['avatar','fullname']) : $this->getUserData($uid,['avatar']);
		$dateMonth = date('Y',$res['time']) == date('Y') ? ($date === date('j') ? $this->lang['today'] : ($date == date('j') -1 ? $this->lang['yesterday'] : date('j F', $res['time']))) : date('j F, Y', $res['time']);
		$response['count'] = count($query);
		$response['messages'][] = array('id' => $res['id'], 'forwarded' => $res['forwarded'], 'reactions' => $this->getMessageReactions($res['id']), 'group_id' => $res['group_id'], 'user_fullname' => $res['group_id'] > 0 ? $user_data['fullname'] : '', 'user_avatar' => $user_data['avatar'],'date' => $date, 'currDate' => date('j'), 'dateMonth' => $dateMonth, "lastby" => $res['lastby'], "from_id" =>  $res['from_id'], "time" => $this->pm_time($res['time']), "msg" => $this->str_messenger($res['text'],1));
		$response['from_id'] = $res['from_id'];
		endforeach;
		
		
	}
	
	echo $this->je($response);
	
}
public function clearMessagesTick(){
	
$this->template->assign(['this' => $this]);
$content = $this->template->fetch($this->theme_dir."/messenger-messages-tick.html");
 
echo $this->getPage($content);

}
public function onlineTab(){
$i = $this->userid;
$arr = array();
$on = strtotime("-1 minute");
 
$query = $this->query_select("select u.first_name,u.last_name,u.username,u.avatar as avatar,u.user_id, u.lastseen from ".tbl_users." u


		where 

		u.user_id != '{$i}' 
		&& u.user_id NOT IN (select `blocked` from ".tbl_blacklist." where `blocker`='{$i}')
		&& u.user_id NOT IN (select `blocker` from ".tbl_blacklist." where `blocked`='{$i}')
		&&
(		u.user_id IN (select s.user_id from ".tbl_userschat." s where ( (s.conversation_user_id='{$i}' && s.user_id = u.user_id) || (s.conversation_user_id=u.user_id && s.user_id = '{$i}') ) )
		|| u.user_id IN (select f.following_id from ".tbl_followers." f where f.follower_id='{$i}'  && f.following_id = u.user_id )
		)
		&& u.lastseen >= '{$on}'
		
		
	
 
		 group by u.user_id order by u.lastseen desc LIMIT 100");

 
foreach($query as $res) 
$arr[] = array('id' => $res['user_id'], 'last_seen' => $this->time_elapsed($res['lastseen']), 'online' => $res['lastseen'], 'name' => empty($res['first_name']) ? $res['username'] : $res['first_name']. ' '.$res['last_name'], 'photo' => $this->get_avatar($res['avatar']));


echo count($arr) > 0 ? $this->je($arr) : 'null';
	
	
}
public function uploadscreen(){
	
	
	if(!S3_ENABLED) $this->uploadScreenToFtp(); else $this->uploadScreenToFtp(true);
	
	
	//$this->uploadScreenToFtp();
	
}
public function uploadScreenToFtp($aws = false){
	
	
	$data = isset($_POST['data']) ? urldecode($_POST['data']) : '';
 
	
	$res = array("success" => 0);
 
	
   
    $max_file_size = 1048576 * 40;
    $dir = $this->uploads.MEDIA_DIR.$this->room_id.'/';



    // generate dir by user id
    if (!file_exists($dir))
    mkdir($dir, 0777, true);






	
	// remove "data:image/png;base64,"
	$uri =  substr($data, strpos($data, ",")+1); 	
	$data = base64_decode($uri);
	$imgRes = imagecreatefromstring($data);

	$filename = md5(uniqid()).'.png';
	$file_dir =  $dir.$filename;
 

	// success added large image
	if( imagepng($imgRes,$file_dir)) { 
	
	
	$image_url_done = MEDIA_DIR.'/'.$this->room_id.'/'.$filename;
	
	
	
	
	
	$fileSize = filesize($file_dir);
 
	$CreatedImage = imagecreatefrompng($file_dir);
 
	list($CurWidth,$CurHeight)=getimagesize($file_dir);

	$time = time();
	
		    $to_id = isset($_POST['to']) && (int)$_POST['to'] > 0 ? $this->test_input($_POST['to']) : '0';
			$userid = $this->USER['id'];
 
	 
	 
	 if($aws){
 
	/* create folders */
	$buckets = array(S3_BUCKET_NAME);
 
	if( !  in_array(S3_BUCKET_NAME, $this->s3->listBuckets()) ) {
	
			//create a new bucket
			$this->s3->putBucket(S3_BUCKET_NAME, S3::ACL_PUBLIC_READ, AWS_S3_BUCKET_LOCATION);
	
	}
	
	 
	 
	 
	  
			$pathtos3 = $this->storage_path.'media/'.$this->room_id.'/';  // path on s3 bucket.
 
			$image_url_done = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$pathtos3.$filename;

	 	      // No error found! Move uploaded files 
                 foreach($buckets as $bucket):
		 
					if($this->s3->putObjectFile($file_dir, S3_BUCKET_NAME, $pathtos3.$filename, S3::ACL_PUBLIC_READ)){
						
						
		    $id = $this->query_insert("insert into ".tbl_msg_media." set `storage`='s3',`room_id`='{$this->room_id}',`file` = '{$filename}', `type`='image', `added`='{$time}'");

			
			unlink($file_dir);
			if (!$id) {
				
				$res['success'] = 0;
			} else {
				$res['id'] = $id;
				$res['success'] = 1;
				$res['image_url'] = $image_url_done;
			}

					}
	 
	 	endforeach;
		
	 	} else {
					

 
 
		
 
		    $id = $this->query_insert("insert into ".tbl_msg_media." set `room_id`='{$this->room_id}',`file` = '{$filename}', `type`='image', `added`='{$time}'");

			if (!$id) {
				unlink($file_dir);
				$res['success'] = 0;
			} else {
				$res['id'] = $id;
				$res['success'] = 1;
				$res['image_url'] = $image_url_done;
			} 
 
 
 
		}
 
}

// return data
echo $this->je($res);
	
	
	
	
	
	
}

public function sendVoiceClip(){
	
	$aws = S3_ENABLED;
	$buckets = array(S3_BUCKET_NAME);
	$data = isset($_POST['clip']) ? $_POST['clip'] : '';
	$extension = isset($_POST['extension']) ? $this->test_input($_POST['extension']) : '';
	$room_id = isset($_POST['room_id']) ? $this->test_input($_POST['room_id']) : '';
	$recipient_id  = isset($_POST['recipient_id']) ? (int) $this->test_input($_POST['recipient_id']) : '';
	$time = time();
	
	$dir = $this->uploads.VOICE_CLIPS_DIR.$room_id.'/';

	
	$r = array("success" => 0);
	
	
    // generate dir  
    if (!file_exists($dir))
		mkdir($dir, 0777, true);
	
 
 

	

	if(isset($_FILES['clip']) and !$_FILES['clip']['error']){
		
	$filename = basename(mt_rand().mt_rand().mt_rand() . '.' . $extension);
	
	
	if($aws){
		
		if( !  in_array(S3_BUCKET_NAME, $this->s3->listBuckets()) ) {
		
				//create a new bucket
				$this->s3->putBucket(S3_BUCKET_NAME, S3::ACL_PUBLIC_READ, AWS_S3_BUCKET_LOCATION);
		
		}
		
			$pathtos3 = $this->storage_path.'voice-clips/'.$this->room_id.'/';  // path on s3 bucket.
 
			$voiceclip_url_done = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$pathtos3.$filename;

	 	      // No error found! Move uploaded files 
                 foreach($buckets as $bucket):
		 
					if($this->s3->putObjectFile($_FILES['clip']['tmp_name'], S3_BUCKET_NAME, $pathtos3.$filename, S3::ACL_PUBLIC_READ)){
 
						$text = "[voice-clip]".$voiceclip_url_done."[/voice-clip]";
						
						
						$id = $this->query_insert("insert into ".tbl_msg_media." set `storage`='s3',`room_id`='{$this->room_id}',`file` = '{$filename}', `type`='voice-clip', `added`='{$time}'");
 
						$r = array("success" => 1, "text" => $text);
					}
 
	 	endforeach;
		
		
	} else {

    if(move_uploaded_file($_FILES['clip']['tmp_name'], $dir . $filename)) {
		$id = $this->query_insert("insert into ".tbl_msg_media." set `room_id`='{$this->room_id}',`file` = '{$filename}', `type`='voice-clip', `added`='{$time}'");
 
		$text = "[voice-clip]".VOICE_CLIPS_DIR.$room_id."/".$filename."[/voice-clip]";

		$r = array("success" => 1, "text" => $text);
	}
	
	}
	
	} 
	
	
 
	echo $this->je($r);
}


public function open_messages_window_by_link(){
	$content = '<a id="refresh-url" href="'.$_SERVER["REQUEST_URI"].'" onclick="return privateMessages(event,this);"></a>';
	echo $this->getPage($content);
}
public function callingPopups($uid){
 
	
$i = $this->userid; 
$uid = $uid;
$close = 'no';
$action = isset($_GET['action']) ? $this->test_input($_GET['action']) : ''; 
$type = isset($_GET['type']) ? $this->test_input($_GET['type']) : ''; 
$iframe = isset($_GET['iframe']) ? $this->test_input($_GET['iframe']) : false; 
$call_type = $type;

switch($type){
	
	case 'video':
	$type = array("video"=>true,"audio"=>true); 
	break;
	
	default:
	case 'audio':
	$type = array("video"=>false,"audio"=>true); 
	break;
 
}


switch($action){
	
	case 'answer':
	$popup = "call-answer.html";
	break;
	
	default:
	case 'call':
	$popup = "call-init.html";
	break;
	
}


if(!$uid || !$i || !$popup || !carray($type))
	$close = 'yes';
  

$peer_id = 0;
// get recipient peer id
$psql = $this->db->query("Select `unique_id` from ".tbl_peer_id." where `userid`='{$uid}' limit 1");
$pres = $psql->fetch_array(MYSQLI_ASSOC);

if(isset($pres['unique_id']))
	$peer_id = $pres['unique_id'];




$this->template->assign(['this' => $this, 'peer_id' => $peer_id, 'ismobiles' => 'no', 'iframe' => $iframe, 'wo' => $this->wo, 'call_type' => $call_type, 'close' => $close, 'type' => $this->je($type), 'user' => $this->getUserDetails($uid)]);
$this->template->display($this->theme_dir. DIRECTORY_SEPARATOR .$popup);
	
}

// online users details 
public function onlineUsersDetails(){
	
$users_ids = isset($_POST['users']) ? $_POST['users'] : array();	
$users_ids = json_decode($users_ids,true);

 
$i = $this->userid;
$arr = array();
$on = strtotime("-1 minute");
 
$query = $this->query_select("select first_name,last_name,username,avatar as avatar,user_id, lastseen from ".tbl_users."
								where user_id IN ('".implode("','",$users_ids)."') && user_id != '{$i}'
								group by user_id order by lastseen desc LIMIT 100");

 
foreach($query as $res) 
$arr[] = array('id' => $res['user_id'], 'last_seen' => $this->time_elapsed($res['lastseen']), 'online' => $res['lastseen'], 'name' => empty($res['first_name']) ? $res['username'] : $res['first_name']. ' '.$res['last_name'], 'photo' => $this->get_avatar($res['avatar']));


echo count($arr) > 0 ? $this->je($arr) : 'null';
	
	
}
public function getThemeColor($theme = '')
{
        global $wo;
        $theme = !empty($theme) ? $theme : $wo['vy-messenger']['config']['chat']['default_theme'];
        $color_json = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/vy-messenger/themes/'.$theme.'/color.json'),true);
 
        return $color_json['color'];
}
public static function getSounds()
{
        global $wo;
        return $wo["vy-messenger"]["sounds"];
}
public static function _getThemeColor()
{
    return (new MESSENGER)->getThemeColor();
}
public static function _getScriptLang()
{
    return (new VY_CORE)->language;
}
 // get user details
public function getUserDetails($uid) {
	$r = array();
	
	$q = $this->db->query("Select * from ".tbl_users." where `user_id`='{$uid}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
 
	if(!isset($r['user_id']))
		return array();

	$r['fullname'] = !empty($r['first_name']) ? $r['first_name'].' '.$r['last_name'] : $r['username'];
	$r['fn'] = $r['fullname'];
	$r['id'] = $r['user_id'];
	$r['profile_photo'] = $this->get_avatar($r['avatar']);
	$r['name'] = empty($r['first_name']) ? $r['username'] : $r['first_name'];
	$r['online_status'] = $r['status'];
	$r['online'] = $r['lastseen'];
	
	return $r;
	
}

public function getShortcutsSessionUserInfo(){
	 
	$chat_s = isset($_POST['chat_list']) ? $this->test_input($_POST['chat_list']) : '';
	$is_group_or_page = strpos($chat_s, 'GG') !== false || strpos($chat_s, '_') !== false ? true : false;

	
	$rsp = array();
	if($chat_s && !$is_group_or_page) {
		
		$is_arr = strpos($chat_s, ',') !== false ? true : false;
 
		
		if($is_arr){
			 
			$chat_s = explode(',',$chat_s);
			
			foreach($chat_s as $chat):
			
			$ch_uid = str_replace('mshortcut-','',$chat);
			
			$q = $this->query_select("select `username`,`user_id`,`first_name`,`last_name`,`avatar` as photo from ".tbl_users." where `user_id`='{$ch_uid}' limit 1");
			foreach($q as $r):
			$rsp[] = array('id' => $r['user_id'], 'fullname' => (empty($r['first_name']) && empty($r['last_name']) ? $r['username'] : $r['first_name']. ' '.$r['last_name']) , 'photo' => $this->get_avatar($r['photo']));
			endforeach;
			
			
			endforeach;
			
		} else {
			$ch_uid = str_replace('mshortcut-','',$chat_s);
			
			$q = $this->query_select("select `username`,`user_id`,`first_name`,`last_name`,`avatar` as photo from ".tbl_users." where `user_id`='{$ch_uid}' limit 1");
			foreach($q as $r):
			$rsp[] = array('id' => $r['user_id'], 'fullname' => (empty($r['first_name']) && empty($r['last_name']) ? $r['username'] : $r['first_name']. ' '.$r['last_name']), 'photo' => $this->get_avatar($r['photo']));
			endforeach;
			
		}
		
		
		
	}
	 echo $this->je($rsp);
 }
 private function cltype($type,$id, $b = false){
	$str = $b ? $this->lang['Messenger_call_back'] : $this->lang['Messenger_call_again'];

	$call_back_audio = '<A href="javascript:void(0);" onclick="setTimeout(function(){vy_calls.makeCall(event,\'audio\','.$id.');},100);">'.$str.'</a>';
	$call_back_video = '<A href="javascript:void(0);" onclick="setTimeout(function(){vy_calls.makeCall(event,\'video\','.$id.');},100);">'.$str.'</a>';

	return $type == 'video' ?  $call_back_video : $call_back_audio;
 }
 private function makeClickableLinks($text)
{

$text = html_entity_decode($text);
$text = " ".$text;
$text= preg_replace("/(^|[\n ])([\w]*?)([\w]*?:\/\/[\w]+[^ \,\"\n\r\t<]*)/is", "$1$2<a target=\"_blank\" href=\"$3\" >$3</a>", $text);  
$text= preg_replace("/(^|[\n ])([\w]*?)((www|wap)\.[^ \,\"\t\n\r<]*)/is", "$1$2<a target=\"_blank\" href=\"/http://$3\" >$3</a>", $text);
$text= preg_replace("/(^|[\n ])([\w]*?)((ftp)\.[^ \,\"\t\n\r<]*)/is", "$1$2<a target=\"_blank\" href=\"$4://$3\" >$3</a>", $text);  
$text= preg_replace("/(^|[\n ])([a-z0-9&\-_\.]+?)@([\w\-]+\.([\w\-\.]+)+)/i", "$1<a target=\"_blank\" href=\"mailto:$2@$3\">$2@$3</a>", $text);  
$text= preg_replace("/(^|[\n ])(mailto:[a-z0-9&\-_\.]+?)@([\w\-]+\.([\w\-\.]+)+)/i", "$1<a target=\"_blank\" href=\"$2@$3\">$2@$3</a>", $text);  
$text= preg_replace("/(^|[\n ])(skype:[^ \,\"\t\n\r<]*)/i", "$1<a target=\"_blank\" href=\"$2\">$2</a>", $text);  
return $text;
}
public function nl2br_special($string) {
    // Step 1: Add <br /> tags for each line-break
    $string = nl2br($string); 

    // Step 2: Remove the actual line-breaks
    $string = str_replace("\n", "", $string);
    $string = str_replace("\r", "", $string);

    // Step 3: Restore the line-breaks that are inside <pre></pre> tags
    if(preg_match_all('/\<pre\>(.*?)\<\/pre\>/', $string, $match)){
        foreach($match as $a){
            foreach($a as $b){
            $string = str_replace('<pre>'.$b.'</pre>', "<pre>".str_replace("<br />", PHP_EOL, $b)."</pre>", $string);
            }
        }
    }

    // Step 4: Removes extra <br /> tags

    // Before <pre> tags
    $string = str_replace("<br /><br /><br /><pre>", '<br /><br /><pre>', $string);
    // After </pre> tags
    $string = str_replace("</pre><br /><br />", '</pre><br />', $string);

    // Arround <ul></ul> tags
    $string = str_replace("<br /><br /><ul>", '<br /><ul>', $string);
    $string = str_replace("</ul><br /><br />", '</ul><br />', $string);
    // Inside <ul> </ul> tags
    $string = str_replace("<ul><br />", '<ul>', $string);
    $string = str_replace("<br /></ul>", '</ul>', $string);

    // Arround <ol></ol> tags
    $string = str_replace("<br /><br /><ol>", '<br /><ol>', $string);
    $string = str_replace("</ol><br /><br />", '</ol><br />', $string);
    // Inside <ol> </ol> tags
    $string = str_replace("<ol><br />", '<ol>', $string);
    $string = str_replace("<br /></ol>", '</ol>', $string);

    // Arround <li></li> tags
    $string = str_replace("<br /><li>", '<li>', $string);
    $string = str_replace("</li><br />", '</li>', $string);

    return $string;
}
public function str_messenger($string, $min = false, $limit_chars = false, $only_txt = false){
	global $svgI;
 
	$original_string = $string;
	
	// embera
	$config = [
	   // 'responsive' => true,
		'ignore_tags' => true,
		'width' => 480 
	];
	$embera = new Embera($config, null, $this->embera_httpCache);
	$contains_embera = $embera->getUrlData($string);
	$embera_unique_id = 'emberalink'.mt_rand().mt_rand();
	
	$embera = '<div class="embera_embd"><div id="'.$embera_unique_id.'" class="embera_cnt_embd"><div class="vy_ms_embera_loading"></div><div class="vyms-emberaz1">'.$embera->autoEmbed($string).'</div></div></div>';
	$string = $min ? $string : (count($contains_embera) ? $embera : $string);//$embera->transform($string);
 
	$string = htmlspecialchars($string);
	
 
    $string = preg_replace("/\[embera\]((\s|.)+?)\[\/embera\]/i", "$1",$string);
 
	$ic_missedcall = '<div class="vy_ms_callinfoic __missed %s"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 459 459" style="enable-background:new 0 0 459 459;" xml:space="preserve"><g><g id="call-missed"><polygon points="423.3,96.9 229.5,290.7 86.7,147.9 204,147.9 204,96.9 0,96.9 0,300.9 51,300.9 51,183.6 229.5,362.1 459,132.6" style="fill: #da2929;"></g></g></svg></div>';
	$ic_called = '<div class="vy_ms_callinfoic __called %s"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 408 408" style="enable-background:new 0 0 408 408;" xml:space="preserve"><g><g id="call-received"><polygon points="408,35.7 372.3,0 51,321.3 51,153 0,153 0,408 255,408 255,357 86.7,357"></g></g></svg></div>';
		
	$ic_new_missed_call = '<div class="vy_ms_callinfoic __called %s">'.$svgI['missed_call_ic'].'</div>';
	$ic_new_incomming_call = '<div class="vy_ms_callinfoic __called %s">'.$svgI['incomming_call_ic'].'</div>';
	$_missedcall = $_called = false;
	
	
	
	
	
	$string =  preg_replace_callback("/\[group-invitation\]((\s|.)+?)\[\/group-invitation\]/i", function($group_id) use(&$min) { 
			 
			$markup = ''; 
			$e = explode('|',$group_id[1]);
			$group_id = $e[1];
			$sender_id = $e[0];
			
			$text = $this->lang['Messenger_sent_you_group_invitation'];
			
			if($sender_id == $this->USER['id'])
				$text = $this->lang['Messenger_you_have_sent_group_invitation'];
				
				
			// get all group chat memebers 
			//$group_chat_count = count($this->query_select("select `id` from ".tbl_gchat_users." where `group_id`='{$group_id}'"));
			
			$group_chat_count = $this->db->query("select count(*) from ".tbl_gchat_users." where `group_id`='{$group_id}' && `active`='1' limit 1");
			$group_chat_count = $group_chat_count->fetch_row();
 
			$group_details = $this->getGroupDetails($group_id,1,1);
			$group_avatar = $group_details[2];
			$group_name = $group_details[0];
			
			$markup .= '<div class="vy-ms__groupchatinvitation_container">';
			$markup .= '<div class="vy-ms_groupchatinvitation_left"><div class="vy-ms_groupchatinvitation_avatar"><img src="'.$group_avatar.'" /></div></div>';
			$markup .= '<div class="vy-ms_groupchatinvitation_right"><div class="vy_ms__groupchatinviation_name">'.$group_name.'</div><div class="vy_ms__groupchatinviation_count">'.$group_chat_count[0].' '.$this->lang['Messenger_total_members_in_group'].'</div>';
			
			if($sender_id == $this->USER['id'])
				$markup .= '<div class="ms_groupchatinvitation_bottom">'.$this->lang['Messenger_you_have_sent_group_invitation'].'</div>';
			else if($this->checkIfImInGroup($group_id))
				$markup .= '<div class="ms_groupchatinvitation_bottom">'.$this->lang['Messenger_you_have_already_member_in_this_group'].'</div>';
			else 
				$markup .= '<div class="ms_groupchatinvitation_bottom"><button onclick="messenger.accept_group_invitation(this,event,'.$group_id.');" class="vy_ms__button-group-invitation __accept">'.$this->lang['Messenger_accept_group_invitation'].'</button>&nbsp;<button onclick="messenger.decline_group_invitation(this,event,'.$group_id.');" class="vy_ms__button-group-invitation __decline">'.$this->lang['Messenger_decline_group_invitation'].'</button></div>';
			
			$markup .= '</div></div>';
			
			
			return $min ? $text : $markup;
		}, $string);
	
	
	
	
	
	
	

	$string =  preg_replace_callback("/\[missedcall\]((\s|.)+?)\[\/missedcall\]/i", function($k) use(&$min,&$_missedcall,&$ic_new_missed_call) { 
			 
			$_missedcall = true;
			$d = explode('-',$k[1]);
			$caller = $d[0];
			$recipient = $d[1];
			$call_type = $d[2];
			$b = false;
			$msg = 'unknown message.';
 
			if($caller == $this->USER['id']){
				
				$u_details = $this->getUserDetails($recipient);
				$msg = $u_details['name'].' '.$this->lang['Messenger_missed_call_from_you'];
				 
				
			} else {
				$b = 1;
				$u_details = $this->getUserDetails($caller);
				$msg = $min ? $this->lang['Messenger_you_have_missed_a_call_from'].' '.$u_details['name'] : '<span class="error">'.$this->lang['Messenger_you_have_missed_a_call_from'].' '.$u_details['name'].'</span>';
				$recipient = $caller;
			}
			
			return $min ? $msg : '<div class="messenger_call_msg">'.sprintf($ic_new_missed_call,'').$msg.'<div class="messenger_call_msg_footer">'.$this->cltype($call_type,$recipient,$b).'</div></div>';
		}, $string);
	
	
	$string =  preg_replace_callback("/\[callended\]((\s|.)+?)\[\/callended\]/i", function($k) use(&$min,&$_called,&$ic_new_incomming_call) { 
			 
			$_called = true;
			$d = explode('-',$k[1]);
			$caller = $d[0];
			$recipient = $d[1];
			$call_type = $d[2];
			$call_duration = $d[3];
		 
			
			$msg = 'unknown message.';
			
			if($caller == $this->USER['id']){
				$u_details = $this->getUserDetails($recipient);
				$msg = 'You called '.$u_details['name'];//.$this->lang['Messenger_missed_call_from_you'];
				
			} else {
				$u_details = $this->getUserDetails($caller);
				$msg = $u_details['name'].' called you.';//'<span class="error">'.$this->lang['Messenger_you_have_missed_a_call_from'].' '.$u_details['name'].'</span>';
				$recipient = $caller;
			}
 
			return $min ? $msg : '<div class="messenger_call_msg">'.sprintf($ic_new_incomming_call,'').$msg.'<div class="messenger_call_msg_time">'.$call_duration.'</div><div class="messenger_call_msg_footer">'.$this->cltype($call_type,$recipient).'</div></div>';
		}, $string);
	
	//$string = $this->conver_emojis($string);

	// voice clips
	$string = $min ? 
	preg_replace("/\[voice-clip\]((\s|.)+?)\[\/voice-clip\]/i", $only_txt ? $this->lang['voice_clip'] : "<div class=\"msg-media-txt\">".$svgI['contacts']['audio']."</div>" , $string) 
	: 
	preg_replace_callback("/\[voice-clip\]((\s|.)+?)\[\/voice-clip\]/i", function($src)  {
		
		$src = strpos($src[1], $this->settings['HOST']) === false ? $src[1] : $this->settings['HOST'].$src[1];
	return '<div class="sp-voice-clip-comment"><audio controls controlsList="nodownload play timeline" src="'.$this->media_url.$src.'"></audio></div>';

	},$string);
	
	$c = 0;
	// images 
	$count_images = preg_replace_callback("/\[img\]((\s|.)+?)\[\/img\]/i", function($matches)use(&$c) {
		
	$res = '';
 
	$c++;
	
	return $res; 
	
	}, $string);
	$string = $min ? preg_replace("/\[img\]((\s|.)+?)\[\/img\]/i", $only_txt ? "{$c} image" : "<div class=\"msg-media-txt\">".$svgI['contacts']['picture']."</div>",$string) : preg_replace("/\[img\]((\s|.)+?)\[\/img\]/i", "<div  data-src=\"".$this->settings['HOST']."/vy-messenger-cmd.php?cmd=atch&id=\\1\" class=\"messenger-media-image\"><a class=\"messenger-image-hover\" data-fancybox=\"gallery\" target=\"_blank\" href=\"".$this->settings['HOST']."/vy-messenger-cmd.php?cmd=atch&id=\\1\">  <img class=\"vy_ms__attch_img vy_ms_img_lzyload\"  src=\"".$this->settings['HOST']."/vy-messenger-cmd.php?cmd=atch&low=1&id=\\1\" />  </a></div>", $string);//<div class=\"messenger-image-url\" style=\"background-image:url(".$this->settings['HOST']."/messenger.php?cmd=atch&id=\\1);\"></div>
    
	$string = $min ? str_replace('[divstart]','',$string) : str_replace('[divstart]', '<div class="messenger-start-media"><div class="js_lightgallery messenger_images_count_'.$c.'">', $string);
	$string = $min ? str_replace('[divend]','',$string) :str_replace('[divend]', '</div></div>', $string);
	
	if($c > 1 && $only_txt)
		$string = "{$c} images";

	
	// videos
	$cv = 0;
 
	$count_videos = preg_replace_callback("/\[video\]((\s|.)+?)\[\/video\]/i", function($matches)use(&$cv) {
		
 
	$res = '';
 
	$cv++;
	
	return $res; 
	
	}, $string);
	$string = $min ? str_replace('[vdivstart]','',$string) : str_replace('[vdivstart]', '<div class="messenger-start-media"><div class="js_lightgallery_video messenger_videos_count_'.$cv.'">', $string);
	$string = $min ? str_replace('[vdivend]','',$string) :str_replace('[vdivend]', '</div></div>', $string);
	$string = $min ? preg_replace("/\[video\]((\s|.)+?)\[\/video\]/i", $only_txt ? "{$cv} video" : "<div class=\"msg-media-txt\">".$svgI['contacts']['video']."</div>",$string) 
				: 
				preg_replace_callback("/\[video\]((\s|.)+?)\[\/video\]/i", function($video_id) {

					$id = $video_id[1];
					$video_file = "";
					$html = "<video class=\"lg-video-object_dep lg-html5_dep\" controls preload=\"metadata\">Video Not found</video>";
					if(is_numeric($id) && $id > 0){
						
						
						$q = $this->db->query("select `storage`,`file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
						$r = $q->fetch_array(MYSQLI_ASSOC);
						
						
						if(isset($r['file']) && !empty($r['file'])){
							
								switch($r['storage']){
									
									case 's3':
										$video_file = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$this->storage_path.'media/'.$r['room_id'].'/'.$r['file'];
									break;
									case 'null':
									case 'NULL':
									case '':
									default:
										$video_file = $this->media_url.MEDIA_DIR.$r['room_id'].'/'.$r['file'];
									break;
								}
							
						}
 
 
						//$this->template->assign(['this' => $this,'id' => $id,'video' => $video_file]);
						//$html = $this->template->fetch($this->theme_dir."/video-player.html");

 
						//echo $this->getPage($content);
						$html = '<video class="fancybox-video" controls controlsList="nodownload" autoplay playsinline muted preload="metadata">
									<source src="'.$video_file.'" type="video/mp4">
									 Your browser does not support HTML5 video.
									</video>';
								
					}
					
					return $html;
					
				}, $string);

	if($cv > 1 && $only_txt)
		$string = "{$cv} videos";
 
				
 
	
	// gif's
	if($min){
	$string = preg_replace("/\[gif\]((\s|.)+?)\[\/gif\]/i", $only_txt ? "GIF" : "<div class=\"msg-media-txt\">".$svgI['contacts']['gif']."</div>", $string);
	} else {
	$string = preg_replace("/\[gif\]((\s|.)+?)\[\/gif\]/i", "<div class=\"msg_gif\"><A href=\"$1\" data-fancybox=\"gallery\" target=\"_blank\"><img class=\"msg0xf3gif\" src=\"$1\" /><div class=\"gif_bottom_d\">GIF</div></a></div>", $string);
	}
	
	// sticker
	if($min){
	$string = preg_replace("/\[stickerid\]((\s|.)+?)\[\/stickerid\]/i", $only_txt ? "sticker" : "<div class=\"msg-media-txt\">".$svgI['contacts']['sticker']."</div>", $string);
	} else {
		
	$string = preg_replace_callback("/\[stickerid\]((\s|.)+?)\[\/stickerid\]/i", function($matches) {
		
 
	$q = $this->db->query("select s.filename,(select title from ".tbl_msg_stickers_store." where `id`=s.stickers_id limit 1) as title, s.stickers_id from ".tbl_msg_stickers." s where s.id='{$matches[1]}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	 
	
	return '<a href="javascript:void(0);" onclick="messenger.openStickers(this,event,\''.$r['title'].'\',0,0,0,1);"><img class="messenger-sticker" src="'.STICKERS_STORE.$r['stickers_id'].'/'.$r['filename'].'" alt="'.$r['title'].'" title="'.$r['title'].'" /></a>'; 
	
	}, $string);
	
	}
	
	
	// location
	if($min){
	$string = preg_replace("/\[sharelocation\]((\s|.)+?)\[\/sharelocation\]/i", $only_txt ? $this->lang['My_location'] : "<div class=\"msg-media-txt\">".$svgI['contacts']['map']."&nbsp;".$this->lang['My_location']."</div>", $string);
	} else {
		
	$string = preg_replace_callback("/\[sharelocation\]((\s|.)+?)\[\/sharelocation\]/i", function($matches) {
		
	$f = explode('=',$matches[1]);
	$lat = $f[0];
	$lng =  $f[1];
	$rand_id = mt_rand();
	return '<div class="js_mess_map_loc"><div class="messenger_map_location"><iframe id="fancybox-frame'.$rand_id.'" name="fancybox-frame'.$rand_id.'"  src="https://maps.google.com/maps?q='.$lat.','.$lng.'&z=10&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe><div rel="li-gliph-color-background" class="messenger_map_info">'.$this->lang['My_location'].'</div></div></div>'; 
	
	}, $string);
	
	}
	
	// url preview
	if($min){
	$string = preg_replace("/\[url-preview\]((\s|.)+?)\[\/url-preview\]/i", $only_txt ? " link" : "<div class=\"msg-media-txt\">URL</div>", $string);
	} else {
		
	$string = preg_replace_callback("/\[url-preview\]((\s|.)+?)\[\/url-preview\]/i", function($matches) {
	$url = $matches[1];	
	$data = $this->fetchUrl($url,1);
 
	if($data){
		$data = json_decode($this->fetchUrl($url,1),true);
	
		$html_content = '';
		$html_image = '';
		$html = array();
		
		if(isset($data['image'])){
			$html['image'] = '<img src="'.$data['image'].'">';
			$html_image = $html['image'];
		}
		
		
		if( isset($data['title'])  && !empty($data['title']) )
				$html['title'] = '<div class="mess_fetch_title">'.$data['title'].'</div>';
			
		if( isset($data['description']) && !empty($data['description']) )
			$html['description'] = '<div class="mess_fetch_descr">'.(strlen($data['description']) > 85 ? mb_substr($data['description'], 0, 85, "utf-8").'...' : $data['description']).'</div>';
		
		if( isset($data['site_name']) && !empty($data['site_name']) )
			$html['site_name'] = '<div class="mess_fetch_sitename">'.$data['site_name'].'</div>';
 
		foreach($html as $key => $value) $html_content .= $key == 'image' ? '' : $value;
		
		return '<div class="js_urlpreview"><a href="'.$url.'" target="_blank" class="messenger-live-preview-link-container urlpreview">'. $html_image . '<div class="mess_fetch_infotxt">'.$html_content .'</div></a></div>';
	
	} else return $this->makeClickableLinks($url);
	
	}, $string);
	
	}
  
	// links
	$string = $min ? $string : $this->makeClickableLinks($string);
	
	//if($min)
		//$string = preg_replace("/\b(\w+)(?:\s\\1)+/i", "$1", $string);
	 
	if($limit_chars && !$this->string_html($string))
		$string = $this->limit_chars($string,$limit_chars);
	
	if($min && $_missedcall && !$only_txt)
		$string = '<div class="vy_ms__contactmin_msg_missedcall">'.sprintf($ic_missedcall,'mmin').$string.'</div>';
	
	if($min && $_called && !$only_txt)
		$string = '<div class="vy_ms__contactmin_msg_called">'.sprintf($ic_called,'mmin').$string.'</div>';
	
 
	
	
 
	return nl2br( $string );
	
}
public function string_html($string)
{ 
  return preg_match("/<[^<]+>/",$string) != 0;
}
public function conver_emojis($str){


$emojioneClient = new EmojioneClient();
$emojioneClient->emojiSize = '32';

$emojioneClient->cacheBustParam = '';
$emojioneClient->imagePathPNG = 'https://cdnjs.cloudflare.com/ajax/libs/emojione/2.1.4/assets/png/';
Emojione::setClient($emojioneClient);

 
$str = Emojione::shortnameToImage($str);
$str = nl2br($str);

return $str;
	
	
}
private function isJson($string) {
 json_decode($string);
 return (json_last_error() == JSON_ERROR_NONE);
}
public function initiateCall($return = 1){
	
	
	
	// get recipient's peer ID 
	$q = $this->db->query("select `status` from ".tbl_peer_id." where `userid`='{$this->recipient}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	$response = array("peer_id" => $this->recipient, "blacklist" => $this->checkForBlacklist($this->recipient), "status" => (isset($r['status']) ? $r['status'] : 'not-available') );
	
	if($return)
		return $this->je($response);
	else
		echo $this->je($response);
	
	
}
public function liveMessages(){
 
	$page_m = "&& m.page_id='0'";
	$page_mc= "&& mc.page_id='0'";
	if($this->page_id > 0){
		$page_m = "&& m.page_id='{$this->page_id}'";
		$page_mc= "&& mc.page_id='{$this->page_id}'";
	}
	
	
	
	$i = $this->USER['id'];
	$response = array('response' => '1', 'count' => '0');
	$count_by_users = array();
	
	$q = $this->query_select("select (select count(*) from ".tbl_msg." mc where mc.read='no' ". $page_mc ." and mc.seen='0' and mc.from_id=u.user_id and mc.to_id='{$i}' && mc.group_id='0') as msg_count,

 

	m.from_id, m.page_id, m.text, m.time, m.to_id,  m.id as mid, m.bg, u.first_name, u.username, u.lastseen, u.last_name, u.user_id as uid, u.avatar as avatar from ".tbl_msg." m
							left join ".tbl_users." u ON u.user_id = m.from_id
			 
							
							where m.read='no' and m.seen='0' and m.to_id='{$i}'  && m.from_id='{$this->recipient}'
							and m.id = (select MAX(ml.id) from ".tbl_msg." ml where ml.to_id='{$i}' and ml.read='no' and ml.from_id = u.user_id)
							 && m.group_id='0' ".$page_m."
							 
							group by m.from_id,m.id order by m.id desc");
							

	if(count($q)){
	 
		$msg_count = 0;
		$from_user = 0;
		foreach($q as $r):
							$message = array(
								'bg' => $r['bg'], 
								'min_text' => empty($r['text']) && !empty($r['media']) ? $this->str_messenger_wo_sync_media($r['media'],$result['mediaFileName'],1) : $this->str_messenger($r['text'],1), 
								'text' => empty($r['text']) && !empty($r['media']) ? $this->str_messenger_wo_sync_media($r['media'],$result['mediaFileName']) : $this->str_messenger($r['text']), 
								'shared' => 'no',//$r['shared'],  
								'time' => date("H:i",$r['time']), 
								'curr_date' => date('j'),
								'timestamp' => $r['time'],
								'page_id' => $r['page_id'],
								
								'msgid' => $r['mid'], 
								'from_id' => $r['from_id'],
								'count' => $r['msg_count'],
								'to_id' => $r['to_id']);


								$count_by_users[$r['from_id']] = $r['msg_count'];
								 $from_user = $r['from_id'];

								$avatar = $this->get_avatar($r['avatar']);
								$contact_fullname = !empty($r['first_name']) && !empty($r['last_name']) ? $r['first_name'].' '.$r['last_name'] : $r['username'];
								if($r['page_id'] > 0){
									
									$page_details = $this->getPageDetails($r['page_id'],true, true);
									$contact_fullname = $page_details[1] == $i ? $contact_fullname.' ('.$page_details[0].')' : $page_details[0];
									if($page_details[1] != $i)
									$avatar = $page_details[2];
								}
								
								$data[] = array("message" => $message, "user" => array("id" => $r['uid'], "online" => $r['lastseen'], "online_ago" => $this->time_elapsed($r['lastseen']), "fullname" => $contact_fullname, "avatar" => $avatar));
			

		$msg_count = round($msg_count + $r['msg_count']);
		endforeach;
		

		$total_q    =	$this->db->query("SELECT count(*) as total from ".tbl_msg." mc where mc.read='no' ". $page_mc ." and mc.seen='0'  and mc.to_id='{$i}' && mc.group_id='0'");
		$total_count	=	$total_q->fetch_array(MYSQLI_ASSOC);
		$total_count = isset($total_count['total']) ? $total_count['total'] : 0;
		
		$response['count'] =  $total_count;
		$response['from_user'] = $from_user;
		$response['user_count'] = $count_by_users;
		$response['messages'] = $data;
	}  
echo $this->sendResponse($response);
	
	
	
}
 
public function getPageDetails($page_id = 0,$return = false, $check_owner = false){
	
	$page_id = $page_id ? $page_id : $this->page_id;
	
	$name = "unknown-page";
	$owner = $avatar = '';
	$q = $this->db->query("select `user_id`,`page_name`,`avatar` from ".tbl_pages." where `page_id`='{$page_id}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if(isset($r['page_name']))
		$name = $r['page_name'];
	
	if(isset($r['user_id']))
		$owner = $r['user_id'];
	
	if(isset($r['avatar']))
		$avatar = $this->get_avatar($r['avatar']);
	
	if($return) 
		return $check_owner ? [$name,$owner,$avatar] : $name; 
	else 
		echo $name;
 
	
}
public function ajax_getGroupDetails(){
	
	$a = $this->getGroupDetails($this->group_id,1,1);
 
	$response = array("group_name" => $a[0], "group_owner" => $a[1], "group_avatar" => $a[2], "admin" => $this->checkGroupAdmin($this->USER['id'],$this->group_id));
	echo $this->je($response);
}
public function getGroupDetails($group_id = 0,$return = false, $check_owner = false){
	
	$group_id = $group_id ? $group_id : $this->group_id;
	
	$name = "unknown-group";
	$owner = $avatar = '';
	$q = $this->db->query("select `user_id`,`group_name`,`avatar` from ".tbl_gchat." where `group_id`='{$group_id}' limit 1");
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if(isset($r['group_name']))
		$name = $r['group_name'];
	
	if(isset($r['user_id']))
		$owner = $r['user_id'];
	
	if(isset($r['avatar']))
		$avatar = $this->get_avatar($r['avatar']);
	
	if($return) 
		return $check_owner ? [$name,$owner,$avatar] : $name; 
	else 
		echo $name;
 
	
}
public function str_messenger_wo_sync_media($media,$media_name,$min = false){
	
	$pic = ['JPG','JPEG','PNG','GIF','WEBP','TIFF','BMP','ICO','PJP','SVG','TIF'];
	$vid = ['WEBM','MPG','MP2','MPEG','MPE','MPV','OGG','MP4','M4P','M4V','AVI','WMV','MOV','FLV'];
	$ext = pathinfo($media, PATHINFO_EXTENSION);
	$min_str = "media";

	if(in_array(str_replace(".","",strtoupper($ext)),$pic)){
		
		$media = "<div data-src=\"".$this->settings['HOST']."/".$media."\" class=\"messenger-media-image\"><a class=\"messenger-image-hover\" target=\"_blank\" href=\"".$this->settings['HOST']."/".$media."\"> <img class=\"vy_ms__attch_img\" src=\"".$this->settings['HOST']."/".$media."\" />   </a></div>";
		//<div class=\"messenger-image-url\" style=\"background-image:url(".$this->settings['HOST']."/".$media.");\"></div>
		$min_str = "image";
		
	} else if(in_array(str_replace(".","",strtoupper($ext)),$vid)){
		
		$media = "<video class=\"lg-video-object_dep lg-html5_dep\" playsinline controls preload=\"metadata\">
						<source src=\"".$this->settings['HOST']."/".$media."\" type=\"video/mp4\">
						 Your browser does not support HTML5 video.
					</video>";
		$min_str = "video";
	} else if (strtolower($ext) == 'wav') {
		$media = '<div class="sp-voice-clip-comment"><audio controls controlsList="nodownload play timeline" src="'.$this->settings['HOST'].'/'.$media.'"></audio></div>';
		$min_str = "voice clip";
		
	} else {
		
		$media = "<a href=\"".$this->settings['HOST']."/".$media."\" target=\"_blank\">{$media_name}</a>";
		$min_str = "doc";
	}
	
	return $min ? $min_str : $media;
	
}
public function uploadMedia(){
	
	$type = isset($_POST['type']) ? $this->test_input($_POST['type']) : '';
	
 
	switch($type){
		
		case 'image':
		$this->uploadImages();
		break;
	
		case 'video': 
		$this->uploadVideos();
		
		break;
		
		
		
	}
 
		
		
	
	
}

public function uploadVideos(){
	
	
	
	
 
	
	$time = time();
	$allowed = isset($_POST['allowed']) ? json_decode($_POST['allowed'],true) : '';
	$buckets = array(S3_BUCKET_NAME);
	$aws = S3_ENABLED;
	$storage = NULL;
	
	if($aws)
		$storage = 's3';
	
	$res = array("success" => 0);
 
	
   
    $max_file_size = 1048576 * 40;
    $dir = $this->uploads.MEDIA_DIR.$this->room_id.'/';



    // generate dir by user id
    if (!file_exists($dir))
    mkdir($dir, 0777, true);


	
	// SET THE DESTINATION FOLDER
	$source = $_FILES["files"]["tmp_name"];
	$filename = $_FILES["files"]["name"];


 
	$temp    = explode('.', $filename);
	$fileExt = end($temp);
	$newName = basename(mt_rand().mt_rand().mt_rand() . '.' . $fileExt);
	$filename = $dir.$newName;
	$destination = 'Storage';
	
// CHECK IF FILE ALREADY EXIST
$res['msg'] = 'OK';
 

// ALLOWED FILE EXTENSIONS
if ($res['msg'] == "OK") {
 
  $ext = strtoupper(pathinfo($_FILES["files"]["name"], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowed)) {
    $error = "$ext file type not allowed - " . $_FILES["files"]["name"];
  }
}


// FILE SIZE CHECK - 1,000,000 = 1MB
// TAKE NOTE THAT THE SETTINGS IN PHP.INI WILL STILL TAKE PRECEDENCE
if ($res['msg'] == "OK") {
  if ($_FILES["files"]["size"] > 1950000000) {
    $res['msg'] = $_FILES["files"]["name"] . " - file size too big!";
  }
}

// ALL CHECKS OK - MOVE FILE
if ($res['msg'] == "OK") {
	
	if($aws){
		
		if( !  in_array(S3_BUCKET_NAME, $this->s3->listBuckets()) ) {
		
				//create a new bucket
				$this->s3->putBucket(S3_BUCKET_NAME, S3::ACL_PUBLIC_READ, AWS_S3_BUCKET_LOCATION);
		
		}
		
			$pathtos3 = $this->storage_path.'media/'.$this->room_id.'/';  // path on s3 bucket.
 
			$voiceclip_url_done = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$pathtos3.$newName;

	 	      // No error found! Move uploaded files 
                 foreach($buckets as $bucket):
		 
					if(!$this->s3->putObjectFile($source, S3_BUCKET_NAME, $pathtos3.$newName, S3::ACL_PUBLIC_READ))
						$res['msg'] = "Error moving $source to $destination";
					
 
	 	endforeach;
		
		
	} else {
	
  if (!move_uploaded_file($source, $filename)) {
    $res['msg'] = "Error moving $source to $destination";
  }
  
  
  
  
}

}

 
			if($res['msg'] == 'OK')
				$id = $this->query_insert("insert into ".tbl_msg_media." set `storage`='{$storage}',`room_id`='{$this->room_id}',`file` = '{$newName}', `type`='video', `added`='{$time}'");
			else
				$id = 0;
			
			
			if (!$id) {
				unlink($filename);
				$res['msg'] = 'SQL Error.';
			} else {
				$res['id'] = $id;
				$res['msg'] = 'OK';
				$res['success'] = 1;
			} 
 
 
  // UPLOAD OK - DO SOMETHING
  echo $this->je($res);
 







}
public function uploadImages(){
	
	
	
	
	
	
	$time = time();
	$allowed = isset($_POST['allowed']) ? json_decode($_POST['allowed'],true) : '';
	$buckets = array(S3_BUCKET_NAME);
	$aws = S3_ENABLED;
	$storage = NULL;
	
	if($aws)
		$storage = 's3';
	
	$res = array("success" => 0);
 
	
   
    $max_file_size = 1048576 * 40;
    $dir = $this->uploads.MEDIA_DIR.$this->room_id.'/';



    // generate dir by user id
    if (!file_exists($dir))
    mkdir($dir, 0777, true);


	
	// SET THE DESTINATION FOLDER
	$source = $_FILES["files"]["tmp_name"];
	$filename = $_FILES["files"]["name"];


 
	$temp    = explode('.', $filename);
	$fileExt = end($temp);
	$newName = basename(mt_rand().mt_rand().mt_rand() . '.' . $fileExt);
	$filename = $dir.$newName;
	$destination = 'Storage';

// CHECK IF FILE ALREADY EXIST
$res['msg'] = 'OK';
 

// ALLOWED FILE EXTENSIONS
if ($res['msg'] == "OK") {
   
  $ext = strtoupper(pathinfo($_FILES["files"]["name"], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowed)) {
    $error = "$ext file type not allowed - " . $_FILES["files"]["name"];
  }
}

// LEGIT IMAGE FILE CHECK
if ($res['msg'] == "OK") {
  if (getimagesize($_FILES["files"]["tmp_name"]) == false) {
    $res['msg'] = $_FILES["files"]["name"] . " is not a valid image file.";
  }
}

// FILE SIZE CHECK - 1,000,000 = 1MB
// TAKE NOTE THAT THE SETTINGS IN PHP.INI WILL STILL TAKE PRECEDENCE
if ($res['msg'] == "OK") {
  if ($_FILES["files"]["size"] > 950000000) {
    $res['msg'] = $_FILES["files"]["name"] . " - file size too big!";
  }
}

// ALL CHECKS OK - MOVE FILE
if ($res['msg'] == "OK") {
	
	if($aws){
		
		if( !  in_array(S3_BUCKET_NAME, $this->s3->listBuckets()) ) {
		
				//create a new bucket
				$this->s3->putBucket(S3_BUCKET_NAME, S3::ACL_PUBLIC_READ, AWS_S3_BUCKET_LOCATION);
		
		}
		
			$pathtos3 = $this->storage_path.'media/'.$this->room_id.'/';  // path on s3 bucket.
 
			$voiceclip_url_done = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$pathtos3.$newName;

	 	      // No error found! Move uploaded files 
                 foreach($buckets as $bucket):
		 
					if(!$this->s3->putObjectFile($source, S3_BUCKET_NAME, $pathtos3.$newName, S3::ACL_PUBLIC_READ))
						$res['msg'] = "Error moving $source to $destination";
					
 
	 	endforeach;
		
		
	} else {
	
		  if (!move_uploaded_file($source, $filename)) {
			$res['msg'] = "Error moving $source to $destination";
		  }
  
  
	}
  
  
  
}

	
			if($res['msg'] == 'OK')
				$id = $this->query_insert("insert into ".tbl_msg_media." set `storage`='{$storage}',`room_id`='{$this->room_id}',`file` = '{$newName}', `type`='image', `added`='{$time}'");
			else
				$id = 0;

			if (!$id) {
				unlink($filename);
				$res['msg'] = 'SQL Error.';
			} else {
				$res['id'] = $id;
				$res['msg'] = 'OK';
				$res['success'] = 1;
			} 
 
 
  // UPLOAD OK - DO SOMETHING
  echo $this->je($res);
 







}
public function deleteMedia(){
	
	$id = isset($_POST['id']) ? $this->test_input($_POST['id']) : 0;
	
	echo $id;
	if(is_numeric($id) && $id > 0){
		
		
		$q = $this->db->query("select `file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
 
			$filename = $this->uploads.MEDIA_DIR.$r['room_id'].'/'.$r['file'];
			
			if(unlink($filename))
				$delete = $this->query_delete("delete from ".tbl_msg_media." where `id`='{$id}'");
			
 
	 
		
	}
	
	
	
}
public function getVideoCover(){
	

	$fn = "data:image/png;base64,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";



	try {
	header('Content-Type: image/jpeg');
	echo file_get_contents($fn);

	} catch (Exception $e) {
	print $e->getMessage();
	}
	
}
public function streamVideo($id){
	
	
	if(is_numeric($id) && $id > 0){
		
		
		$q = $this->db->query("select `file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
		
		if(isset($r['file'])){
		$dir = $this->uploads.MEDIA_DIR.$r['room_id'].'/';
		 
		$fn = $dir.$r['file'];
		}
	
	
 	 
 
		
	}
	
	$stream = new VideoStream($fn);
	$stream->start();
	
}
public function getNotificationByUser(){
	
	$i = $this->USER['id'];
	$res = array("status" => 200, "interval" => 0, "msg" => $this->lang['Messenger_teh_err']);
	$r = json_decode($this->getMuteSettings($this->id,$this->group_id),true);
 
	if(isset($r['muted']) && $r['muted'] != "null" && $r['muted'] != NULL && $this->isJson($r['muted'])){
		$r['muted'] = json_decode($r['muted'],true);
		
		if(count($r['muted'])){
 
 
			foreach ($r['muted'] as $userid => $value):
			
				if($userid == $i)
					$res['interval'] = $r['muted'][$i]['interval'];

			 
			endforeach;
			

		} 
		
	}
	
 
 
	echo $this->je($res);
	
}
public function getMuteSettings($uid,$group_id = 0,$page_id = 0,$cron = false){
	
	$i = $cron ? $this->recipient : $this->USER['id'];
	$res = array("status" => 200, "muted" => "null", "msg" => $this->lang['Messenger_teh_err']);
	$sql = "select `id`,`muted` from ".tbl_messenger_settings." where (`userid`='{$i}' && `recipient`='{$uid}') || (`userid`='{$uid}' && `recipient`='{$i}') limit 1";
	$sql_groups = "select `id`,`muted` from ".tbl_messenger_settings." where `group_id`='{$group_id}' limit 1";
	$q = $this->db->query($group_id > 0 ? $sql_groups : $sql);
	$r = $q->fetch_array(MYSQLI_ASSOC);
	
	if(!isset($r['id']))
		$this->addMessengerSettings($this->defaultConversationSettings(),$uid);
		

	
	if(isset($r['muted']) && $r['muted'] != "null" && $r['muted'] != NULL && $this->isJson($r['muted']))
		$res['muted'] = $r['muted'];
	
	return $this->je($res);
}
public function m_cron(){
 
	switch($this->action){
		
		case 'unmute':
		$this->unmuteContact();
		break;
		
	}
	

}
public function unmuteContact(){
	

	$r = json_decode($this->getMuteSettings($this->id,$this->group_id,$this->page_id,1),true);
	
 
	if(isset($r['muted']) && $r['muted'] != "null" && $r['muted'] != NULL && $this->isJson($r['muted'])) {

		$r['muted'] = json_decode($r['muted'],true);
		
		if(count($r['muted'])){
			
			if(isset($r['muted'][$this->id])){
				$this->remove_crontab_job($r['muted'][$this->id]['interval'],$r['muted'][$this->id]['now'],1);
				
				unset($r['muted'][$this->id]);
				
			if(!count($r['muted']))
				$r['muted'] = null;
			
			$m_data = json_encode($r['muted']);
			$update = $this->group_id > 0 ? $this->query_update("update ".tbl_messenger_settings." set `muted`='{$m_data}' where `group_id`='{$this->group_id}'") :
											$this->query_update("update ".tbl_messenger_settings." set `muted`='{$m_data}' where (`userid`='{$this->id}' && `recipient`='{$this->recipient}') || (`userid`='{$this->recipient}' && `recipient`='{$this->id}')");
						
			
			
 
			//$socketio_data = array("event" => "unmute_from_crontab", "socket_uid" => $this->socket_id($this->id), "aditional_data" => array("recipient_id" => $this->recipient, "userid" => $this->id, "group_id" => $this->group_id, "page_id" => $this->page_id));
			//$this->emit_notification_to_socketio($socketio_data);
			}
			
			
		}
		
	}
 
	return true;
}

 
 
 
 private function remove_crontab_job($interval,$unixtime,$link = false){
	
	$link = $link ? $this->cron_remove_unmute : $this->cron_add_unmute;
	$arr = ['30','1','12','24'];
	
	for($i=0;$i<count($arr);$i++) {
		
		$cron_time = $this->generate_crontab_command($arr[$i],$unixtime);
		$this->cronjob->removeJob($cron_time.' curl -s '.$link);
	}
	 
 }
 private function add_crontab_job($interval) {
 

	$cron_time = $this->generate_crontab_command($interval);
	
	$this->cronjob->addJob($cron_time.' curl -s '.$this->cron_add_unmute);
	
	return $cron_time;
 }
 
 private function generate_crontab_command($interval,$reverse = false){
	$minute = $hour = $day = $month ='*';
	
	$unixtime = "+0 minute";
	switch($interval) {
		
		case '30':
			$unixtime = "+30 minutes";  
		break;
		case '1':
			$unixtime = "+1 hour"; 
		break;
		case '12':
			$unixtime = "+12 hours";
		break;
		case '24':
			$unixtime = "+24 hours";
		break;
 
	}
 
	$date = $reverse ? explode('/', date('m/d/H/i/Y', strtotime( $unixtime,$reverse ) ) ) : explode('/',date('m/d/H/i/Y',strtotime($unixtime))); 
 
	$minute = $date[3];
	$hour = $date[2];
	$day = $date[1];
	$month = $date[0];
	$year = $date[4];
	
	switch($interval) {
		
		case '30':
			$command = "{$minute} * * * *";  
		break;
		case '1':
			$command = "{$minute} {$hour} * * *"; 
		break;
		case '12':
			$command = "{$minute} {$hour} * * *"; 
		break;
		case '24':
		    $command = "{$minute} {$hour} {$day} * *";
		break;
 
	}
	 
	return $command; 

 }
 
public function MuteContact(){
	
	
	
	$interval = isset($_POST['interval']) ? $this->test_input($_POST['interval']) : '0';
	$i = $this->USER['id'];
	$r = json_decode($this->getMuteSettings($this->recipient,$this->group_id),true);
	$mute_c_append = array("recipient" => $this->recipient, "group_id" => $this->group_id, "page_id" => $this->page_id, "interval" => $interval, "now" => $this->now);
	$mute_c_new = array($i => $mute_c_append);
	$res = array("status" => "error", "new_arr" => array(), "msg" => $this->lang['Messenger_teh_err'], "interval" => $interval);
	$cron_job = "";
 
	if(isset($r['muted']) && $r['muted'] == "null" && $r['muted'] != NULL){  
		$r['muted'] = $mute_c_new;
	 
		if($interval > 0 && $interval != 99)
				$cron_job = $this->add_crontab_job($interval);
		
		
	} else if(isset($r['muted']) && $r['muted'] != "null" && $r['muted'] != NULL && $this->isJson($r['muted'])) {
 
		$r['muted'] = json_decode($r['muted'],true);
		if(count($r['muted'])){
 

				if($interval > 0 && isset($r['muted'][$i])){
					
					if($r['muted'][$i]['interval'] != 99)
						$this->remove_crontab_job($r['muted'][$i]['interval'],$r['muted'][$i]['now']);
					
					 
					if($interval != 99)
						$cron_job = $this->add_crontab_job($interval);
					 
					$r['muted'][$i] = $mute_c_append;
					
				} else if($interval <= 0 && isset($r['muted'][$i])) {

					$this->remove_crontab_job($r['muted'][$i]['interval'],$r['muted'][$i]['now']);
					unset($r['muted'][$i]);
 
				}

			if($this->isarray($r['muted']) && !count($r['muted']))
				$r['muted'] = null;

		} 
		
	}
	
	$m_data = json_encode($r['muted']);
	$update = $this->group_id > 0 ? $this->query_update("update ".tbl_messenger_settings." set `muted`='{$m_data}' where `group_id`='{$this->group_id}'") :
									$this->query_update("update ".tbl_messenger_settings." set `muted`='{$m_data}' where (`userid`='{$i}' && `recipient`='{$this->recipient}') || (`userid`='{$this->recipient}' && `recipient`='{$i}')");
	if($update) {
		$res['status'] = 200;
		$res['new_arr'] = $this->getMyMutedContacts();
		$res['cron'] = $cron_job;
	}
 
	echo $this->je($res);
	
}
public static function out_getMyMutedContacts(){

	return (new MESSENGER)->getMyMutedContacts();
}
 public function ajax_getMyMutedContacts(){
	echo $this->je($this->getMyMutedContacts());
}
public function getMyMutedContacts(){

	$i = $this->USER['id'];
	$res = array("contacts" => array(), "groups" => array(), "pages" => array());
	$q = $this->query_select("
							select `muted` from ".tbl_messenger_settings." where (`userid`='{$i}' || `recipient`='{$i}') && `group_id` IS NULL
								UNION  ALL
							select `muted` from ".tbl_messenger_settings." where `group_id` IN(select `group_id` from ".tbl_gchat_users." where user_id='{$i}')
							");
	
 
	for ($j = 0; $j < count($q); $j++){
	
	
		if(isset($q[$j]['muted']) && $q[$j]['muted'] != "null" && $q[$j]['muted'] != NULL && $this->isJson($q[$j]['muted'])){
			$row = json_decode( $q[$j]['muted'], true );
			if(isset($row[$i]) && $row[$i]['recipient'] != "0" && $row[$i]['group_id'] == "0" && $row[$i]['page_id'] == "0")
				$res['contacts'][] = array("id" => $row[$i]['recipient'], "interval" => $row[$i]['interval']); 
		}
		
		if(isset($q[$j]['muted']) && $q[$j]['muted'] != "null" && $q[$j]['muted'] != NULL && $this->isJson($q[$j]['muted'])) {
			$row = json_decode( $q[$j]['muted'], true );
			if(isset($row[$i]) && $row[$i]['group_id'] != "0" && $row[$i]['page_id'] == "0")
				$res['groups'][] = array("id" => $row[$i]['group_id'], "interval" => $row[$i]['interval']);  
			
		}
		
		
	}

	$_SESSION['VY_MS_MUTED_CONTACTS'] = $res;

	return $res;
}
public function getAttachment(){
	$id = isset($_GET['id']) ? $this->test_input($_GET['id']) : 0;
	$type = isset($_GET['type']) ? $this->test_input($_GET['type']) : '';
	$low = isset($_GET['low']) ? $this->test_input($_GET['low']) : false;
	
	if($type == 'video-cover') 
		return $this->getVideoCover($type);
	
	if($type == 'video')
		return $this->streamVideo($id);
	if(isset($_COOKIE['mode']) && $_COOKIE['mode'] == 'night')
		$fn = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA7YAAAGkCAIAAAH9Hh7gAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNFRDU3MUVBMjA2OTExRTk4NzQ0QkE5MEYwNkVGQ0MzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNFRDU3MUVCMjA2OTExRTk4NzQ0QkE5MEYwNkVGQ0MzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0VENTcxRTgyMDY5MTFFOTg3NDRCQTkwRjA2RUZDQzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0VENTcxRTkyMDY5MTFFOTg3NDRCQTkwRjA2RUZDQzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz57EpHvAABDfUlEQVR42uza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";
	else
		$fn = "data:image/png;base64,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";

	
	if(is_numeric($id) && $id > 0){
		
		
		$q = $this->db->query("select `storage`,`file`,`room_id` from ".tbl_msg_media." where `id`='{$id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
		
		if(isset($r['file'])){
			
			switch($r['storage']){
				
				case 's3':
					$dir = S3_HTTPS.S3_BUCKET_NAME.'.s3.amazonaws.com/'.$this->storage_path.'media/'.$r['room_id'].'/';
				break;
				case 'null':
				case 'NULL':
				case '':
				default:
					$dir = $this->uploads.MEDIA_DIR.$r['room_id'].'/';
				break;
			}
			
		
		 
		if(file_exists($dir.$r['file']) && (empty($r['storage']) || is_null($r['storage'])) ) 
			$fn = $dir.$r['file'];
		else 
			$fn = $dir.$r['file'];
 
		
		}
	
		
 
		
	}
	
	try {
	ob_get_clean();
	
	if($low)
		$img = $this->imagecreatefromfile($fn);
	
	header('Content-Type: image/jpeg');
	
	if($low){
		imagejpeg($img, NULL, 50);
		imagedestroy($img);
	} else {
		
	
	echo file_get_contents($fn);
	
	}

	} catch (Exception $e) {
	print $e->getMessage();
	}
	
	
	
}
private function imagecreatefromfile( $filename ) {
    if (!file_exists($filename)) {
        throw new InvalidArgumentException('File "'.md5($filename).'.'.strtolower( pathinfo( $filename, PATHINFO_EXTENSION )).'" not found.');
    }
    switch ( strtolower( pathinfo( $filename, PATHINFO_EXTENSION ))) {
        case 'jpeg':
        case 'jpg':
            return imagecreatefromjpeg($filename);
        break;

        case 'png':
            return imagecreatefrompng($filename);
        break;

        case 'gif':
            return imagecreatefromgif($filename);
        break;

        default:
            throw new InvalidArgumentException('File "'.md5($filename).'.'.strtolower( pathinfo( $filename, PATHINFO_EXTENSION )).'" is not valid jpg, png or gif image.');
        break;
    }
}
// get gifs
public function getGifs(){
	
$key = isset($_POST['key']) ? $this->test_input($_POST['key']) : '';	

// php
$url = "http://api.giphy.com/v1/gifs/search?q=".$key."&rating=g&api_key=".$this->settings['GIPHY_API']."&limit=".rand(25,40);
 
echo file_get_contents($url);
	
	
}
public function getLang(){
	
	
	
	echo $this->je($this->lang);
	
	
	
}

public function online(){
	
$contacts = isset($_POST['contacts']) ? json_decode($_POST['contacts'],true) : "null";
$contacts = count($contacts) ? implode(',', array_map('intval', $contacts)) : "null"; 

 
$nOnlineInterval = strtotime("-1 minute");
$onlineFriendsArr = array();
$all = false;
$limit = '';

if($contacts != "null"){
// select online friends and contacts of respective user
$query = $this->query_select("select `lastseen`,`user_id` from ".tbl_users." where  `user_id` IN({$contacts})
				group by user_id order by lastseen desc ".$limit);

foreach($query as $res):
$onlineFriendsArr[] = array('id' => $res['user_id'],
			    'online_int' => $res['lastseen'],
			    'online' => $res['lastseen'] > $nOnlineInterval,
				'online_ago' => $this->time_elapsed($res['lastseen'],1)
			    );
endforeach;

echo $this->sendResponse(['response' => 1, 'data' => $this->je($onlineFriendsArr)]);
} else {
	echo $this->sendResponse(['response' => 1, 'data' => $this->je(array())]);
	
}
	

}
public function time_elapsed( $time, $min = false, $numeric = false )
{
    

   $etime = time() - str_replace( '+0000', '', $time );

    if ($etime < 1)
    {
		return $this->lang['just_now'];
    }

    $a = array( 365 * 24 * 60 * 60  =>  $this->lang['year'],
                 30 * 24 * 60 * 60  =>  $this->lang['month'],
                  7 * 24 * 60 * 60  =>  $this->lang['week'],
                      24 * 60 * 60  =>  $this->lang['day'],
                           60 * 60  =>  $this->lang['hour'],
                                60  =>  $this->lang['minute'],
                                 1  =>  $this->lang['second']
                );
    $b = array( 365 * 24 * 60 * 60  =>  'year',
                 30 * 24 * 60 * 60  =>  'month',
                  7 * 24 * 60 * 60  =>  'week',
                      24 * 60 * 60  =>  'day',
                           60 * 60  =>  'hour',
                                60  =>  'minute',
                                 1  =>  'second'
                );

    $a_plural = array( $this->lang['year']   => $this->lang['years'],
                       $this->lang['month']  => $this->lang['months'],
                       $this->lang['week']   => $this->lang['weeks'],
                       $this->lang['day']    => $this->lang['days'],
                       $this->lang['hour']   => $this->lang['hours'],
                       $this->lang['minute'] => $this->lang['minutes'],
                       $this->lang['second'] => $this->lang['seconds']
                );

    if($numeric){

    foreach ($b as $secs => $str)
    {
        $d = $etime / $secs;
        if ($d >= 1)
        {
            $r = round($d);

             return [$r,$str];
        }
    }
	return 0;
}

    foreach ($a as $secs => $str)
    {
        $d = $etime / $secs;
        if ($d >= 1)
        {
            $r = round($d);
 
            if(!$min) return $r . ' ' . ($r > 1 ? $a_plural[$str] : $str) . ' '.$this->lang['ago'];
	    else return $r . $this->time_elapse_min($str);
        }
    }
}

// replace time elapsed month name. year ..
public function time_elapse_min($str){
	
	$r = array(
			   $this->lang['year'] => $this->lang['min_year_name'],
			   $this->lang['month'] => $this->lang['min_month_name'],
			   $this->lang['week'] => $this->lang['min_week_name'],
			   $this->lang['day'] => $this->lang['min_day_name'],
			   $this->lang['hour'] => $this->lang['min_hour_name'],
			   $this->lang['minute'] => $this->lang['min_minute_name'],
			   $this->lang['second'] => $this->lang['min_second_name'],

			   $this->lang['years'] => $this->lang['min_year_name'],
			   $this->lang['months'] => $this->lang['min_month_name'],
			   $this->lang['weeks'] => $this->lang['min_week_name'],
			   $this->lang['days'] => $this->lang['min_day_name'],
			   $this->lang['hours'] => $this->lang['min_hour_name'],
			   $this->lang['minutes'] => $this->lang['min_minute_name'],
			   $this->lang['seconds'] => $this->lang['min_second_name']);

return str_replace(array_keys($r), array_values($r),$str);
}

public function getStickers(){
	
	$from = isset($_POST['from']) ? $this->test_input($_POST['from']) : 'shortcut';
	$most_used_stickers = isset($_COOKIE['vy_ms__recentstickers']) ? $_COOKIE['vy_ms__recentstickers'] : '';

	
 
	$order_by = "ORDER BY s.id desc";
	
	if(!empty($most_used_stickers))
		$order_by = "ORDER BY FIELD(s.id, {$most_used_stickers}) desc, s.id desc";

 
	$limit = 30;
	if($from == 'messenger')
		$limit = $limit;
	
	$arr = array();
	$q = $this->query_select("select s.id, s.title, (select `filename` from ".tbl_msg_stickers." where `stickers_id`=s.id order by id desc limit 1) as cover from ".tbl_msg_stickers_store." s 

	".$order_by."
	
	limit ".$limit);
	
	
	foreach($q as $r):
	
	
	
		$arr[] = array($r['id'],$r['title'],STICKERS_STORE.$r['id'].'/'.$r['cover']);
		 
	
	
	
	endforeach;
	
	
	
	echo $this->je($arr);
	
	
}

public function searchStickers(){
	
	$key = isset($_POST['key']) ? $this->test_input($_POST['key']) : '';
	
	
	
	$arr = array();
$q = $this->query_select("select s.id, s.title, (select `filename` from ".tbl_msg_stickers." where `stickers_id`=s.id order by id desc limit 1) as cover from ".tbl_msg_stickers_store." s where s.title like N'%{$key}%' order by s.id desc limit 6");
	
	
	foreach($q as $r):
	
	
	
		$arr[] = array($r['id'],$r['title'],STICKERS_STORE.$r['id'].'/'.$r['cover']);
		 
	
	
	
	endforeach;
	
	
	
	echo $this->je($arr);
	
}
public function openStickerPack(){
	
	
	$arr = array();
	$q = $this->query_select("select `filename`,`id` from ".tbl_msg_stickers." where `stickers_id`='{$this->id}'");
	
	foreach($q as $r):
	
		$arr[] = array($r['id'],STICKERS_STORE.$this->id.'/'.$r['filename']);
	
	endforeach;
	
	echo $this->je($arr);
}


public function addUserToChat($userid) {
	
	$i = $this->USER['id'];
	$page_id=$this->page_id;
	
	$q = $this->query_select("select `id`,`user_id` from ".tbl_userschat." where `user_id`='{$i}' && `conversation_user_id`='{$userid}' && `page_id`='{$page_id}' || `user_id`='{$userid}' && `conversation_user_id`='{$i}' && `page_id`='{$page_id}' limit 2");
	$r = array();
	foreach($q as $x)
	$r = $x;
 
 
	if(!count($q)){
		
		// add to userschat
		$this->query_insert("
							INSERT INTO ".tbl_userschat." 
												(user_id,conversation_user_id,page_id,time)
											VALUES
												('{$userid}','{$i}','{$page_id}','{$this->now}'),
												('{$i}','{$userid}','{$page_id}','{$this->now}')
												
												");

		
	} else if(count($q) == 1){
	 
		
		if($r['user_id'] == $i)
			$this->query_insert("INSERT INTO ".tbl_userschat." 
													(user_id,conversation_user_id,page_id,time)
												VALUES
													('{$userid}','{$i}','{$page_id}','{$this->now}')
													
													");
		else
			$this->query_insert("INSERT INTO ".tbl_userschat." 
													(user_id,conversation_user_id,page_id,time)
												VALUES
													('{$i}','{$userid}','{$page_id}','{$this->now}')
													
													");
 
	} else {
		
		// update time
		$this->query_update("update ".tbl_userschat." c1, ".tbl_userschat." c2 set 
		c1.time='{$this->now}', c2.time='{$this->now}' where c1.user_id='{$i}' and c1.conversation_user_id='{$userid}' and c1.page_id='{$page_id}' and c2.user_id='{$userid}' and c2.conversation_user_id='{$i}' and c2.page_id='{$page_id}' ");

	}
	
	
	
}
public function isEven($n) {
   return $n % 2 == 0;
}
public function generateRoomId(int $n1, int $n2,$page_id = 0, $group_id = 0){

    $str = ($n1*$n2)+$n1+$n2;
	
	return 'room_'. ($page_id ? $str.'_'.$page_id : ($group_id > 0 ? 'GG'.$group_id : $str));
 
}

 
 // create image from url
 public function createImageFromUrl($url){
	 
	$room_id = "room_".$this->room_id;
    $dir = $this->uploads.MEDIA_DIR.$room_id.'/';
	$newName = basename(mt_rand() . mt_rand() . mt_rand() . '.jpg');

    // generate dir  
    if (!file_exists($dir))
		mkdir($dir, 0777, true);

 
 
	$ch = curl_init($url);
	$fp = fopen($dir.$newName, 'wb');
	curl_setopt($ch, CURLOPT_FILE, $fp);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_exec($ch);
	curl_close($ch);
	fclose($fp);
	
	/*
$img = @file_get_contents($url);
 

$im = imagecreatefromstring($img);

$width = imagesx($im);

$height = imagesy($im);


$newwidth = $width;

$newheight = $height;

$thumb = imagecreatetruecolor($newwidth, $newheight);

imagecopyresized($thumb, $im, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

imagejpeg($thumb,$dir.$newName); //save image as jpg
 

imagedestroy($im);*/

return $newName;


 }
 

// fetch url
public function fetchUrl($url = '',$return = false){
 

	$url = $url ? $url : (isset($_POST['url']) ? urldecode($_POST['url']) : '');
	$room_id = "room_".$this->room_id;
	$array = array();
	$array['embera'] = "no";
	$array['send_now'] = "no";
	
	if(trim($url) && filter_var($url, FILTER_VALIDATE_URL)){
		
 
		// leave embera to find something
		$f_embera = new Embera();
		$u_embera = $f_embera->getUrlData($url);
		$embera_unique_id = 'emberalink'.mt_rand().mt_rand();

		
		$embera_arr = array();
		$continue = 0;
 
	
 
		if($this->isarray($u_embera) && count($u_embera)){
			 
			 foreach($u_embera as $r):
			 
				 $array['embera'] = "yes";
				 $array['title'] = isset($r['title']) ? $r['title'] : '';
				 $array['description'] = isset($r['description']) ? $r['description'] : '';
 
				 $array['preview'] = $url;//$embera->transform($url);
				 $array['send_now'] = "yes";
			 endforeach;
			 
			 
			if($return) return $this->je($array); else echo $this->je($array);
			exit;
 
		} 
		
		
		
		

		// link is a image
		$imgExts = array("gif", "jpg", "jpeg", "png", "tiff", "tif");
		$urlExt = pathinfo($url, PATHINFO_EXTENSION);
		 if (in_array(strtolower($urlExt), $imgExts)) {

			$newImageName = $this->createImageFromUrl($url);
			 
		 
			if($newImageName){
				
            $userid = $this->USER['id'];
			$dir = MEDIA_DIR.$room_id.'/';
 
			$id = $this->query_insert("insert into ".tbl_msg_media." set `room_id`='{$room_id}',`file` = '{$newImageName}', `type`='image', `added`='{$this->now}'");
			
			$arr_data = [ "embera" => "no", "send_now" => "yes", "id" => $id, "upload_url" => '/vy-messenger-cmd.php?cmd=atch&id='.$id.'&type=image', "phext"=>$urlExt, "phFilename"=>$newImageName, "description" => $url, "type" => "image"];
			if($return) return $this->je($arr_data); else echo $this->je($arr_data);
			}
			 
		
		exit;
		}
	
		// link is a video
		$vExts = array('MP4','WEBM','MPG','MPEG','WMV','MOV','MPE','MPV','OGG','MP4','M4P');
		$urlExt = pathinfo($url, PATHINFO_EXTENSION);
		 if (in_array(strtoupper($urlExt), $vExts)) {

			$newVideoName = $this->saveExternalVideo($url);
			 
		 
			if($newVideoName){
				
            $userid = $this->USER['id'];
			$dir = MEDIA_DIR.$room_id.'/';
 
			$id = $this->query_insert("insert into ".tbl_msg_media." set `room_id`='{$room_id}',`file` = '{$newVideoName}', `type`='video', `added`='{$this->now}'");
			$arr_data = [ "embera" => "no", "send_now" => "yes", "id" => $id, "upload_url" => '/vy-messenger-cmd.php?cmd=atch&id='.$id.'&type=video', "phext"=>$urlExt, "phFilename"=>$newVideoName, "description" => $url, "type" => "video"];
			if($return) return $this->je($arr_data); else echo $this->je($arr_data);
			}
			 
		
		exit;
		}
	
        $graph = OpenGraph::fetch($url);
		$is_video = false;
		
		if($graph){
			
        foreach($graph as $key => $value) {
			
			 
            $array[$key] = $value; 
			if($value == 'video') $is_video = true;
        }
		
		
		if(!$is_video){
		// get all images
		$gimages = $this->getExternalImages($url);
		$array['all_images'] = $gimages;  
		} else {
			
			$video = $this->saveExternalVideo($url);
			$array['a'] = '1';
		}


       if($return) return $this->je($array); else echo $this->je($array);
		
		} 
		else
			if($return) return 0; else echo 0;		
		
	} 
	else
		if($return) return 0; else echo 0;
	
}
public function saveExternalVideo($url){
	
	$room_id = "room_".$this->room_id;
    $dir = $this->uploads.MEDIA_DIR.$room_id.'/';
    // generate dir  
    if (!file_exists($dir))
		mkdir($dir, 0777, true);
	
	
	$extension = '.'.pathinfo($url, PATHINFO_EXTENSION);
	$newName = basename(mt_rand() . mt_rand() . mt_rand() . $extension);
	
 

	$ch = curl_init($url);
	$fp = fopen($dir.$newName, 'wb');
	curl_setopt($ch, CURLOPT_FILE, $fp);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_exec($ch);
	curl_close($ch);
	fclose($fp);
	
	return $newName;
	
}
public function sql_escape($str){
	return $this->db->escape($str);
}
// fetch urls
public function fetch_url($url){
	
	if(!$url) return false;
	
	
    // create curl resource
    $ch = curl_init();

    // set url
    curl_setopt($ch, CURLOPT_URL, $url);

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

    // $output contains the output string
    $output = curl_exec($ch);

    // close curl resource to free up system resources
    curl_close($ch); 
	
	return $output;
	
	
}
//get images from fetched link
public function getExternalImages($url){
ini_set('user_agent','Mozilla/4.0 (compatible; MSIE 6.0)'); 

if(!$url) die;


// link is a image
$imgExts = array("gif", "jpg", "jpeg", "png", "tiff", "tif");
$html = $this->fetch_url($url);//file_get_contents($url);
$arr = [];
$doc = new DOMDocument();
@$doc->loadHTML($html);

$tags = $doc->getElementsByTagName('img');



foreach ($tags as $tag) {
	
		
	   $src = $tag->getAttribute('src');
	   $urlExt = pathinfo($src, PATHINFO_EXTENSION);

	   if(!in_array($src, $arr) && in_array($urlExt, $imgExts) && strpos($src, "//")):

		$img_get_size = @getimagesize($src);
		$img_width = $img_get_size[0];
		$img_height = $img_get_size[1];
		if($img_width >= 20 || $img_height >= 20 )
		$arr[] = $src;
		
		// maximum 25 images
		if(sizeof($arr) > 5) break;
	endif;
}
return $arr;	
}

public function CallPopup(){
	
$media_type = isset($_POST['media_type']) ? $this->test_input($_POST['media_type']) : 'audio';
$userdetails = $this->getUserDetails($this->recipient);	
	
$this->template->assign(['this' => $this, 'user' => $userdetails, 'media_type' => $media_type ]);
$content = $this->template->fetch($this->theme_dir."/calls/call.html");
 
echo $this->getPage($content);
	
	
}
public function callErrorMsg(){
		$msg = isset($_POST['msg']) ? $this->test_input($_POST['msg']) : "Sorry, an tehnical error occured.";
 
		$this->template->assign(['this' => $this, 'msg' => $msg ]);
		$content = $this->template->fetch($this->theme_dir."/calls/error.html");
		 
		echo $this->getPage($content);
		exit();
	
}

public function AnswerPopup(){

	$metadata = isset($_POST['metadata']) ? json_decode($_POST['metadata'],true) : array(); 

	if(!count($metadata)){
		$this->template->assign(['this' => $this, 'msg' => "Sorry, an tehnical error occured." ]);
		$content = $this->template->fetch($this->theme_dir."/calls/error.html");
		 
		echo $this->getPage($content);
		exit();
	} 

 
 
	$metadata['name'] = $metadata['user_name'];
 	
	
	$this->template->assign(['this' => $this, 'user' => $this->getUserDetails($metadata['from']), 'media_type' => $metadata['type'] ]);
	$content = $this->template->fetch($this->theme_dir."/calls/answer.html");
	 
	echo $this->getPage($content);
	
	
}
public function is_groupchat_online($group_id = 0){
	
	$i = $this->USER['id'];
	$group_id = $group_id ? $group_id : $this->group_id;
	$on = strtotime("-1 minute");
	$query = $this->db->query("SELECT COUNT(*) FROM  ".tbl_users." u, ".tbl_gchat_users." gu WHERE u.lastseen >= '{$on}' && gu.user_id = u.user_id && gu.group_id='{$group_id}' && u.user_id <> '{$i}'");
	$q = $query->fetch_row();
	$count = $q[0];
 
	return $count;
	
}
public function group_chat_stats(){
	
	$on = strtotime("-1 minute");
	$data = array("total_users" => 0, "online_users" => 0);
 
	
	$q = $this->db->query("
	
	
	SELECT a.id,
    (SELECT COUNT(*) FROM ".tbl_gchat_users." gu, ".tbl_users." u WHERE u.lastseen >= '{$on}' && u.user_id = gu.user_id && gu.group_id='{$this->group_id}' && gu.active='1') as online,
    (SELECT COUNT(*) FROM ".tbl_gchat_users." WHERE `group_id`='{$this->group_id}' && `active`='1') as total
	FROM (SELECT DISTINCT id FROM ".tbl_gchat_users.") a
	
	");
	
	
 
	$r_count = $q->fetch_array(MYSQLI_ASSOC);
	
	$data['total_users'] = isset($r_count['total']) && is_numeric($r_count['total']) ? $r_count['total'] : 0;
	$data['online_users'] = isset($r_count['online']) && is_numeric($r_count['online']) ? $r_count['online'] : 0;
	
	
	
	return $this->je($data);
 
}
public function get_group_members_count($echo = false){
	
 
	$r = $this->db->query("SELECT COUNT(*) as total FROM ".tbl_gchat_users." WHERE `group_id`='{$this->group_id}' && `active`='1'");
	$r = $r->fetch_row();
	if($echo) echo $r[0]; else return $r[0];
 
 
	
}
public function extract_urlbbcode($string){
	
	$data = '';
 
	/*$bbc = json_decode(BBCODES,true);
 
	for($i = 0; $i < count($bbc);$i++){
		$bb = str_replace(']', '', str_replace('[', '',$bbc[$i]));
		preg_replace_callback("/\[{$bb}\]((\s|.)+?)\[\/{$bb}\]/i", function($x)use(&$data)  {

			$data .= $x[1];
			
		},$string);
	}*/
	
 
 
 
	$html = $this->str_messenger($string);
	if (preg_match_all('~<img.*?src=["\']+(.*?)["\']+~', $html, $urls)) 
	{
 
	$data = $urls[1][0];
	}
	
	return $data;
	
}

public function leaveGroup(){
	
	$response = array("status" => 200, "success" => 0, "msg" => $this->lang['Messenger_teh_err']);
	
	if(is_numeric($this->group_id) && is_numeric($this->id) && $this->id > 0 && $this->group_id > 0){
		
		if($this->db->query("delete from ".tbl_gchat_users." where `group_id`='{$this->group_id}' && `user_id`='{$this->id}'"))
			$response['success'] = 1;
		
		
		
	}
	
	echo $this->je($response);
	
}
public function inviteToGroup(){
	
	//$i = $this->USER['id'];
	//$text = "[group-invitation]{$this->group_id}[/group-invitation]";
	$response = array("status" => 200, "success" => 0, "msg" => $this->lang['Messenger_teh_err']);
	
	if(is_numeric($this->group_id) && is_numeric($this->id) && $this->id > 0 && $this->group_id > 0){
		
		if($this->db->query("insert into ".tbl_gchat_users." (`id`,`user_id`,`group_id`,`last_seen`,`active`) VALUES (null,{$this->id},{$this->group_id},'0','0')")){
			$response['success'] = 1;
		
		 // send message 
		 //$this->query_insert("insert into ".tbl_msg." set `from_id`='{$i}',`to_id`='{$this->id}',`text`='{$text}',`time`='{$this->now}',`bg`='no'");
		
		
		}
		
	}
	
	echo $this->je($response);
	
}
public function acceptGroupInvitation(){
	
	$response = array("status" => 200, "success" => 0, "msg" => $this->lang['Messenger_teh_err']);
	
	if(is_numeric($this->group_id) && is_numeric($this->id) && $this->id > 0 && $this->group_id > 0){
		
		if(count($this->query_select("select id from ".tbl_gchat_users." where `user_id`='{$this->id}' && `group_id`='{$this->group_id}'"))){
			
			if($this->db->query("update ".tbl_gchat_users." set `active`='1' where `user_id`='{$this->id}' && `group_id`='{$this->group_id}'"))
				$response['success'] = 1;
			
		}else $response['msg'] = 'you_already_declined_this_invitation';
 
		
	}
	
	echo $this->je($response);
	
	
}
public function ignoreGroupInvitation(){
	
	$response = array("status" => 200, "success" => 0, "msg" => $this->lang['Messenger_teh_err']);
	
	if(is_numeric($this->group_id) && is_numeric($this->id) && $this->id > 0 && $this->group_id > 0){
		
		if($this->db->query("delete from ".tbl_gchat_users." where `user_id`='{$this->id}' && `group_id`='{$this->group_id}'"))
			$response['success'] = 1;
		
		
		
	}
	
	echo $this->je($response);
	
	
}

// add reactions
public function reaction(){

$action = $this->action;
$msg_id = $this->id;
$userid = $this->USER['id'];
$reaction = empty($this->post_vars('reaction')) ? 'like' : $this->post_vars('reaction');
$response = array("success" => 0, "msg" => "Unknown error.");
$unsettled_msg_id = $msg_id;

// get database
$reactions_db = new DB($this->db_path."reactions.json");


if($msg_id > 0 && $userid > 0) {
	
	$db_id = $this->json_db_id($msg_id.'-'.$userid);
 
	
	if($action == 'add' || $action == 'update' || $action == 'remove')
	{
		//get message real id 
		$q = $this->db->query("select `id`,`unsettled_msg_id` from ".tbl_msg." where `id`='{$msg_id}' || `unsettled_msg_id`='{$msg_id}' limit 1");
		$row = $q->fetch_array(MYSQLI_ASSOC);
		
		if(isset($row['id']))
			$msg_id = $row['id'];
		
		if(isset($row['unsettled_msg_id']))
			$unsettled_msg_id = $row['unsettled_msg_id'];
		
		
		$query = false;
		switch($action){
			case 'add':
		
			$reactions_db->insert(array('itemid' => $msg_id, 'unsettled_msg_id' => $unsettled_msg_id, 'userid' => $userid, 'type' => $reaction, 'added' => $this->now), $db_id);

			//$query = $this->query_insert("insert into ".tbl_reactions." set `itemid`='{$msg_id}',`userid`='{$userid}',`type`='{$reaction}',`added`='{$this->now}'");
			break;
			case 'remove':
			//$query = $this->query_delete("delete from ".tbl_reactions." where `itemid`='{$msg_id}' and `userid`='{$userid}'");
			$reactions_db->delete($db_id);
			break;
			case 'update':
			//$query = $this->query_update("update ".tbl_reactions." set `type`='{$reaction}' where `itemid`='{$msg_id}' and `userid`='{$userid}'");
			/*$update = $reactions_db->getSingle($db_id);
			
			if(count($update) && isset($update['type'])){
				$update['type'] = $reaction;
				$reactions_db->delete($db_id);
				$reactions_db->insert(array('itemid' => $msg_id, 'userid' => $userid, 'type' => $reaction, 'added' => $this->now), $db_id);
			}
			*/
			$this->json_db_update($reactions_db,$db_id,'type',$reaction);

			break;
		}
		
		
		if($query) {
			
			$response['success'] = 1;
			$response['msg'] = 'success';
			
			
		}
		
		
		
	}
	

	
	
}
	echo json_encode($response);
	
}
public function getMessageReactions($msg_id){
// get database
$reactions_db = new DB($this->db_path."reactions.json");
return $reactions_db->getList(["itemid"=>$msg_id]);
}

 public function getReactedPeople(){
	 
	$reaction = $this->post_vars('reaction');
	$item_id = $this->post_vars('item_id');
	$item_type = $this->post_vars('item_type');
	
	$result = array("success" => "no", "msg" => $this->lang['Messenger_somethingWrong']);
	
	if($reaction == 'Love')
		$reaction = 'Like';
	
	if($reaction == 'all')
		$q = ["itemid" => $item_id];//$this->query_select("select SQL_CALC_FOUND_ROWS `reaction`,`userid` from ".tbl_reactions." where `itemid`='{$item_id}' and `type`='{$item_type}' group by reaction order by added desc");
	else
		$q = ["itemid" => $item_id, "type" => strtolower($reaction)];//$this->query_select("select SQL_CALC_FOUND_ROWS `reaction`,`userid` from ".tbl_reactions." where `itemid`='{$item_id}' and `type`='{$item_type}' and `reaction`='{$reaction}' group by reaction order by added desc");


	// get database
	$reactions_db = new DB($this->db_path."reactions.json");
	$q = $reactions_db->getList($q,["on" => "added", "order" => "DESC"]);

	 
	//$count_rows = $this->db->query("SELECT FOUND_ROWS() as c");
	//$count_rows = $count_rows->fetch_array(MYSQLI_ASSOC);
	//$count_rows = $count_rows['c'];
	$count_rows =  count($q);
	
	
	// IF THERE ARE 0 RESULT BY ITEM ID, TRYING TO FIND BY ANTOHER ROW `unsettled_msg_id`
	if(!$count_rows){
		
	if($reaction == 'all')
		$q = ["unsettled_msg_id" => $item_id];
	else
		$q = ["unsettled_msg_id" => $item_id, "type" => strtolower($reaction)];


	// get database
	$reactions_db = new DB($this->db_path."reactions.json");
	$q = $reactions_db->getList($q,["on" => "added", "order" => "DESC"]);

	$count_rows =  count($q);

	}
	
	
	
	if(count($q)){
	
	$result['success'] = "yes";
	$result['all_count'] = $count_rows;
		foreach($q as $r):
			$sql_reaction = $r['type'];
			$count_type_reaction = count($reactions_db->getList(["itemid" => $item_id, "type" => $sql_reaction]));//count($this->query_select("select count(*) from ".tbl_reactions." where `itemid`='{$item_id}' and `type`='{$item_type}' and `reaction`='{$sql_reaction}'"));
			
			if(!$count_type_reaction)
				$count_type_reaction = count($reactions_db->getList(["unsettled_msg_id" => $item_id, "type" => $sql_reaction]));
			
			$result['each_reaction_count'][] = array("type" => $r['type'], "count" => $count_type_reaction);
			$result['data'][] = array("reaction" => $r['type'], "user" => $this->getUserDetails($r['userid']));
		
		endforeach;
	
	}
	
	
	
	echo json_encode($result);
	 
 }
 
 public function checkCountDinCindInCind(){

	$i = $this->USER['id'];
	$q = $this->db->query("select COUNT(*) from ".tbl_msg." where `to_id`='{$i}' && `read`='no' && `seen`='0'");
	$r = $q->fetch_row();
	return $r[0];
	
	 
 }
public function groupChatFindParticipants(){
	
$key = $this->post_vars('key');	
$filter_users = isset($_POST['filter']) ? json_decode($_POST['filter'],true) : array();
$i = $this->userid;

$rows = $sort = array();
$query = $this->query_select("
				select IF(u.first_name IS NULL OR u.first_name = '', u.username, GROUP_CONCAT(CONCAT(u.first_name,' ',u.last_name))) as fullname, u.avatar as avatar,u.user_id as id, u.lastseen as last_seen from  ".tbl_users." u
 
		where

		u.user_id NOT IN (SELECT `blocked` from ".tbl_blacklist." where `blocker`='{$i}') 
		&&
		u.user_id NOT IN (SELECT `blocker` from ".tbl_blacklist." where `blocked`='{$i}') 
		&&
		(
		u.user_id IN (select s.user_id from ".tbl_userschat." s where ( (s.conversation_user_id='{$i}' && s.user_id = u.user_id) || (s.conversation_user_id=u.user_id && s.user_id = '{$i}') ) )
		|| u.user_id IN (select f.following_id from ".tbl_followers." f where f.follower_id='{$i}'  && f.following_id = u.user_id )
		
		)
		&&
		(u.first_name LIKE N'%{$key}%' OR u.last_name LIKE N'%{$key}%' OR u.username LIKE N'%{$key}%')  
		&& u.user_id NOT IN ( '" . implode( "', '" , $filter_users ) . "' )
		
		group by u.user_id order by u.first_name ASC,u.last_name ASC,u.username ASC limit 100");

 
 
foreach($query as $row):
	$rows[] = $row;
endforeach;

 for($i = 0; $i < count($rows); $i++){
	 
	 $rows[$i]['avatar'] = $this->get_avatar($rows[$i]['avatar']);
	 $rows[$i]['last_seen'] = $this->time_elapsed($rows[$i]['last_seen']);
 }

foreach($rows as $k=>$v) {
	 
     $sort['last_seen'][$k] = $v['last_seen'];
	  
}
if(count($rows))
array_multisort($sort['last_seen'], SORT_DESC, $rows);

return $this->je($rows);
	
}

public function createGroupChat(){


$i = $this->USER['id'];

$response = array("success" => 0, "group_id" => 0, "msg" => $this->lang['Messenger_somethingWrong']);

if(!$i){
	
	return $this->je($response);
	
} else {

$group_name = $this->post_vars('group_name');	
$parts = explode(',',$this->post_vars('parts'));
$tmpfile = isset($_FILES['avatar']) ? $_FILES['avatar']['tmp_name'] : null;
$filename = isset($_FILES['avatar']) ?  basename($_FILES['avatar']['name']) : null;
$file_type = isset($_FILES['avatar']['type']) ? $_FILES['avatar']['type'] : null;
  
// get access token 
$q = $this->db->query("select `session_id` from ".tbl_session." where `user_id`='{$i}' order by id desc limit 1");
$r = $q->fetch_array(MYSQLI_ASSOC);
$access_token = isset($r['session_id']) ? $r['session_id'] : '';
 
 
if($access_token) {
	
 
 

$data = array();
$data['type'] = 'create';
$data['group_name'] = $group_name;



if($tmpfile != null)
$data['avatar'] = curl_file_create($tmpfile, $file_type, $filename);

$data['parts'] = $parts;
$data['server_key'] = SERVER_KEY;


$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,WOWONDER_URL.'/api/group_chat?access_token='.$access_token);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");   
    curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-Type: multipart/form-data'));
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);   
    curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);  
 


			
 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$res = json_decode(curl_exec($ch),true);
 
curl_close ($ch);

if($res['api_status'] != '200' && $res['errors']['error_id'] == '4'){
	$response['msg'] = $this->lang['Messenger_missin_members_toNewgroupchat_or_group_name'] . " ( Error: {$res['errors']['error_text']} )";	
}

if($res['api_status'] == '200'){
	
  foreach ($parts as $part_id) {
					$notification_data_array = array(
						'recipient_id' => $part_id,
						'post_id' => 0,
						'type2' => $res['data']['0']['group_id'],
						'type' => 'group_chat_invitation',
						'text' => NULL,
						'page_id' => 0,
						'url' => 'index.php' 
					);
					Wo_RegisterNotification($notification_data_array);
					
   } 
	
	$response['success'] = 1;
	$response['group_id'] = $res['data']['0']['group_id'];
} else
$response['msg'] = $res['errors']['error_text'];

} 

}

return $this->je($response);	
	
}



public function editGroupChat(){


$i = $this->USER['id'];

$group_name = $this->post_vars('group_name');	
$group_id = $this->post_vars('group');
$tmpfile = isset($_FILES['avatar']) ? $_FILES['avatar']['tmp_name'] : null;
$filename = isset($_FILES['avatar']) ?  basename($_FILES['avatar']['name']) : null;
$file_type = isset($_FILES['avatar']['type']) ? $_FILES['avatar']['type'] : null;

$response = array("success" => 0, "group_id" => 0, "msg" => $this->lang['Messenger_somethingWrong']);
 
if(!$i || !$this->checkGroupAdmin($this->USER['id'],$group_id,1)){
	
	return $this->je($response);
	
} else {

  
// get access token 
$q = $this->db->query("select `session_id` from ".tbl_session." where `user_id`='{$i}' order by id desc limit 1");
$r = $q->fetch_array(MYSQLI_ASSOC);
$access_token = isset($r['session_id']) ? $r['session_id'] : '';
 
 
if($access_token) {
	
	
 

$data = array();
$data['type'] = 'edit';
$data['id'] = $group_id;
$data['group_name'] = $group_name;

if($tmpfile != null)
$data['avatar'] = curl_file_create($tmpfile, $file_type, $filename);

$data['server_key'] = SERVER_KEY;


$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,WOWONDER_URL.'/api/group_chat?access_token='.$access_token);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");   
    curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-Type: multipart/form-data'));
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);   
    curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);  
 


			
 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$res = json_decode(curl_exec($ch),true);

curl_close ($ch);

if($res['api_status'] != '200' && $res['errors']['error_id'] == '4'){
	$response['msg'] = $this->lang['Messenger_missin_group_name_edit'] . " ( Error: {$res['errors']['error_text']} )";	
}

if($res['api_status'] == '200'){
	$response['success'] = 1;
	$response['group_id'] = $res['data']['0']['group_id'];
} else
$response['msg'] = $res['errors']['error_text'];

} 

}

return $this->je($response);	
	
}
public function getMessageDetails(){
	
	$response = array("status" => 200, "msg" => $this->lang['Messenger_somethingWrong'],"data" => array());
	if($this->id > 0){
		
		$q = $this->db->query("select * from ".tbl_msg." where `id`='{$this->id}' || `unsettled_msg_id`='{$this->id}' limit 1");
		$r = $q->fetch_array(MYSQLI_ASSOC);
		
		if(isset($r['id'])){
			
			$r['original_msg'] = $r['text'];
			$r['text'] = $this->str_messenger($r['text']);
			$response['data'] = $r;
			
		} else $response['status'] = 404;
		
	}
	return $this->je($response);
}
public function requestCall(){

$this->recipient =  $this->getUserDetails($this->recipient);
$this->template->assign(['this' => $this, 'incomingcall' => false]);
$content = $this->template->fetch($this->theme_dir."/calls/desktop/call.html");
echo $content;

}
public function incomingCall(){

$this->recipient =  $this->getUserDetails($this->recipient);
$this->template->assign(['this' => $this, 'incomingcall' => true]);
$content = $this->template->fetch($this->theme_dir."/calls/desktop/call.html");
echo $content;

}
public function videochatDialogConfirmation(){

$this->recipient = $this->getUserDetails($this->recipient);
$this->template->assign(['this' => $this]);
$content = $this->template->fetch($this->theme_dir."/calls/desktop/dialog-confirm-videochat.html");
echo $content;

}
} // end class


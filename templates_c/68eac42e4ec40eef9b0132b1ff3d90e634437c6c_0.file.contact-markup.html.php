<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:43:44
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/contact-markup.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464da106c88b7_75744591',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '68eac42e4ec40eef9b0132b1ff3d90e634437c6c' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/contact-markup.html',
      1 => 1684329619,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464da106c88b7_75744591 (Smarty_Internal_Template $_smarty_tpl) {
echo '<script'; ?>
 rel="vy_ms__remove_on_dom_ready">if(typeof g_messenger_count == 'undefined')var g_messenger_count = {};<?php echo '</script'; ?>
><?php if ($_smarty_tpl->tpl_vars['userid']->value > 0 || $_smarty_tpl->tpl_vars['page_id']->value > 0 || $_smarty_tpl->tpl_vars['group_id']->value > 0) {
$_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['this']->value->theme_dir)."/append-contact-markup.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('pages'=>$_smarty_tpl->tpl_vars['muted_arr']->value), 0, true);
}
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['contacts']->value, 'contact');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['contact']->value) {
$_smarty_tpl->_assignInScope('last_message', $_smarty_tpl->tpl_vars['this']->value->getLastMessage($_smarty_tpl->tpl_vars['contact']->value['user_id'],$_smarty_tpl->tpl_vars['contact']->value['page_id'],$_smarty_tpl->tpl_vars['contact']->value['group_id']));
$_smarty_tpl->_assignInScope('last_seen', date(DATE_RFC2822,$_smarty_tpl->tpl_vars['contact']->value['online']));
$_smarty_tpl->_assignInScope('last_seen2', date(DATE_RFC2822,$_smarty_tpl->tpl_vars['contact']->value['online']));
$_smarty_tpl->_assignInScope('user_status', $_smarty_tpl->tpl_vars['this']->value->getUserStatus($_smarty_tpl->tpl_vars['contact']->value['user_id']));
$_smarty_tpl->_assignInScope('fullname', ((string)$_smarty_tpl->tpl_vars['contact']->value['first_name'])." ".((string)$_smarty_tpl->tpl_vars['contact']->value['last_name']));
$_smarty_tpl->_assignInScope('user_show_last_seen', $_smarty_tpl->tpl_vars['contact']->value['showlastseen']);
$_smarty_tpl->_assignInScope('user_online_privacy', $_smarty_tpl->tpl_vars['contact']->value['online_status']);
$_smarty_tpl->_assignInScope('avatar', $_smarty_tpl->tpl_vars['this']->value->get_avatar($_smarty_tpl->tpl_vars['contact']->value['avatar']));
if ($_smarty_tpl->tpl_vars['contact']->value['page_id'] > 0) {
if (empty($_smarty_tpl->tpl_vars['contact']->value['first_name'])) {
$_smarty_tpl->_assignInScope('ufullname', $_smarty_tpl->tpl_vars['contact']->value['username']);
} else {
$_smarty_tpl->_assignInScope('ufullname', ((string)$_smarty_tpl->tpl_vars['contact']->value['first_name'])." ".((string)$_smarty_tpl->tpl_vars['contact']->value['last_name']));
}
$_smarty_tpl->_assignInScope('get_page_name', $_smarty_tpl->tpl_vars['this']->value->getPageDetails($_smarty_tpl->tpl_vars['contact']->value['page_id'],1,1));
if ($_smarty_tpl->tpl_vars['get_page_name']->value[1] == $_smarty_tpl->tpl_vars['this']->value->USER['id']) {
$_smarty_tpl->_assignInScope('fullname', ((string)$_smarty_tpl->tpl_vars['ufullname']->value)." (".((string)$_smarty_tpl->tpl_vars['get_page_name']->value[0]).")");
} else {
$_smarty_tpl->_assignInScope('fullname', $_smarty_tpl->tpl_vars['get_page_name']->value[0]);
$_smarty_tpl->_assignInScope('avatar', $_smarty_tpl->tpl_vars['get_page_name']->value[2]);
}
} elseif (isset($_smarty_tpl->tpl_vars['contact']->value['group_id']) && $_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {
$_smarty_tpl->_assignInScope('fullname', $_smarty_tpl->tpl_vars['contact']->value['group_name']);
} else {
if (empty($_smarty_tpl->tpl_vars['contact']->value['first_name'])) {
$_smarty_tpl->_assignInScope('fullname', $_smarty_tpl->tpl_vars['contact']->value['username']);
}
}
if ($_smarty_tpl->tpl_vars['user_status']->value) {
$_smarty_tpl->_assignInScope('last_seen', $_smarty_tpl->tpl_vars['this']->value->lang['Active_now']);
}
if (!$_smarty_tpl->tpl_vars['user_show_last_seen']->value) {
$_smarty_tpl->_assignInScope('last_seen', '');
}
if ($_smarty_tpl->tpl_vars['contact']->value['page_id'] > 0) {
$_smarty_tpl->_assignInScope('count_by_user', $_smarty_tpl->tpl_vars['this']->value->getCountByUser($_smarty_tpl->tpl_vars['contact']->value['user_id'],$_smarty_tpl->tpl_vars['contact']->value['page_id']));
echo '<script'; ?>
 rel="vy_ms__remove_on_dom_ready">var __vym_userid = <?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];?>
, __vym_pageid = <?php echo $_smarty_tpl->tpl_vars['contact']->value['page_id'];?>
, __vym_count = <?php echo $_smarty_tpl->tpl_vars['count_by_user']->value;?>
;
		g_messenger_count[__vym_userid+'_'+__vym_pageid] = __vym_count;
		<?php echo '</script'; ?>
><?php } elseif ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {
$_smarty_tpl->_assignInScope('count_by_user', $_smarty_tpl->tpl_vars['this']->value->getCountByUser($_smarty_tpl->tpl_vars['contact']->value['user_id'],false,$_smarty_tpl->tpl_vars['contact']->value['group_id']));
echo '<script'; ?>
 rel="vy_ms__remove_on_dom_ready">var __vym_userid = <?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];?>
, __vym_groupid = <?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
, __vym_count = <?php echo $_smarty_tpl->tpl_vars['count_by_user']->value;?>
;
		g_messenger_count['GG'+__vym_groupid] = __vym_count;
		<?php echo '</script'; ?>
><?php } else {
$_smarty_tpl->_assignInScope('count_by_user', $_smarty_tpl->tpl_vars['this']->value->getCountByUser($_smarty_tpl->tpl_vars['contact']->value['user_id']));
echo '<script'; ?>
 rel="vy_ms__remove_on_dom_ready">var __vym_userid = <?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];?>
, __vym_groupid = 0, __vym_count = <?php echo $_smarty_tpl->tpl_vars['count_by_user']->value;?>
;
		g_messenger_count[__vym_userid] = __vym_count;
		<?php echo '</script'; ?>
><?php }
$_smarty_tpl->_assignInScope('new_message', '');
$_smarty_tpl->_assignInScope('muted', '');
if ($_smarty_tpl->tpl_vars['count_by_user']->value > 0) {
$_smarty_tpl->_assignInScope('new_message', "_newmessages");
}
if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0 && isset($_smarty_tpl->tpl_vars['muted_arr']->value['groups'][$_smarty_tpl->tpl_vars['contact']->value['group_id']])) {
$_smarty_tpl->_assignInScope('new_message', '');
}
if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] <= 0 && $_smarty_tpl->tpl_vars['contact']->value['page_id'] <= 0 && isset($_smarty_tpl->tpl_vars['muted_arr']->value['contacts'][$_smarty_tpl->tpl_vars['contact']->value['user_id']])) {
$_smarty_tpl->_assignInScope('new_message', '');
}
if ((isset($_smarty_tpl->tpl_vars['muted_arr']->value['contacts'][$_smarty_tpl->tpl_vars['contact']->value['user_id']]) && $_smarty_tpl->tpl_vars['contact']->value['page_id'] <= 0 && $_smarty_tpl->tpl_vars['contact']->value['group_id'] <= 0) || isset($_smarty_tpl->tpl_vars['muted_arr']->value['groups'][$_smarty_tpl->tpl_vars['contact']->value['group_id']]) || isset($_smarty_tpl->tpl_vars['muted_arr']->value['pages'][$_smarty_tpl->tpl_vars['contact']->value['page_id']])) {
$_smarty_tpl->_assignInScope('muted', "__muted");
}
if ($_smarty_tpl->tpl_vars['userid']->value != $_smarty_tpl->tpl_vars['contact']->value['user_id'] || $_smarty_tpl->tpl_vars['page_id']->value != $_smarty_tpl->tpl_vars['contact']->value['page_id'] || $_smarty_tpl->tpl_vars['group_id']->value != $_smarty_tpl->tpl_vars['contact']->value['group_id']) {?><div class="vy_ms_contactbord"><a href="/messenger/<?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?>g/<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];
} else {
echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];
if ($_smarty_tpl->tpl_vars['contact']->value['page_id'] > 0) {?>/<?php echo $_smarty_tpl->tpl_vars['contact']->value['page_id'];
}
}?>" data-lastseen="<?php echo $_smarty_tpl->tpl_vars['last_seen2']->value;?>
" data-last-message-timestamp="<?php echo $_smarty_tpl->tpl_vars['last_message']->value['time'];?>
" userfullname="<?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
" <?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?>id="contact-GG<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
"<?php } else { ?>id="contact-<?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];
if ($_smarty_tpl->tpl_vars['contact']->value['page_id'] > 0) {?>_<?php echo $_smarty_tpl->tpl_vars['contact']->value['page_id'];
}?>"<?php }?> class="pmessenger-contact-a <?php echo $_smarty_tpl->tpl_vars['new_message']->value;?>
 <?php echo $_smarty_tpl->tpl_vars['muted']->value;?>
 <?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?>vy_ms_contactisgroup contact_groupid_<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];
}?>" onclick="__j('.pmessenger-contact-a').removeClass('active');__j(this).addClass('active');messenger.openContact(this,event,'<?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];?>
','<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['last_seen']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['contact']->value['page_id'];?>
','<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
','<?php echo $_smarty_tpl->tpl_vars['user_show_last_seen']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['user_online_privacy']->value;?>
');"><div class="js_conv_swipe pmessenger-mleft12"><div class="pmessenger-contact-avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
" /><?php if ($_smarty_tpl->tpl_vars['user_online_privacy']->value == '0') {?><div class="only_ic global_user_online global_user_online_<?php echo $_smarty_tpl->tpl_vars['contact']->value['user_id'];?>
"><?php if ($_smarty_tpl->tpl_vars['user_status']->value) {?><span class="ic-online"></span><?php }?></div><?php }?></div><div class="pmessenger-contact-info"><div class="pmessenger-contact-name ellip" title="<?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
</div><div class="pmessenger-contact-last-msg ellip _1htf _6zke"><div class="_42dz5 ellip"><?php if (empty($_smarty_tpl->tpl_vars['last_message']->value['text'])) {?>--<?php } else {
if ($_smarty_tpl->tpl_vars['last_message']->value['from_id'] == $_smarty_tpl->tpl_vars['this']->value->USER['id']) {?><span class="convo__msgAuthor"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['You'];?>
:</span>&nbsp;<?php }
echo str_replace('&amp;','&',$_smarty_tpl->tpl_vars['this']->value->str_messenger(substr($_smarty_tpl->tpl_vars['last_message']->value['text'],0,150),1,20));
}?></div><div class="pmessenger-contact-last-msg-time"><div class="_6zkf">&#8729;</div><span class="_1ht7 _6zkh timestamp"><?php if (empty($_smarty_tpl->tpl_vars['last_message']->value['time'])) {?>-<?php } else {
echo $_smarty_tpl->tpl_vars['this']->value->lastMessageConvertTime($_smarty_tpl->tpl_vars['last_message']->value['time']);
}?></span></div></div><div class="vy_ms__contactmuted"><?php echo $_smarty_tpl->tpl_vars['svgi']->value['contacts']['muted'];?>
</div><?php if (isset($_smarty_tpl->tpl_vars['last_message']->value['seen']) && $_smarty_tpl->tpl_vars['contact']->value['group_id'] <= 0) {
if ($_smarty_tpl->tpl_vars['last_message']->value['from_id'] == $_smarty_tpl->tpl_vars['this']->value->USER['id']) {?><div class="_3fx44cc"><?php if ($_smarty_tpl->tpl_vars['last_message']->value['seen'] > 0) {?><div class="_3fx45cc" style="background-image:url(<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
);"></div><?php } else { ?><div class="contact-messenger_sent_Status"><i class="glyphicon contact-messenger-sent-ic glyphicon-ok-sign"></i></div><?php }?></div><?php }
} elseif (isset($_smarty_tpl->tpl_vars['last_message']->value['group_seen']) && $_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?><div class="_3fx44cc"><?php if (!empty($_smarty_tpl->tpl_vars['last_message']->value['group_seen'])) {?><div class="_3fx45cc" style="background-image:url(<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
);"></div><?php } else { ?><div class="contact-messenger_sent_Status"><i class="glyphicon contact-messenger-sent-ic glyphicon-ok-sign"></i></div><?php }?></div><?php }
if ($_smarty_tpl->tpl_vars['count_by_user']->value > 0 && !empty($_smarty_tpl->tpl_vars['new_message']->value)) {?><div class="convo__unread oval in_messenger">+<?php echo $_smarty_tpl->tpl_vars['count_by_user']->value;?>
</div><?php }?></div></div><div class="mob_delete_on_swipe js_mob_delete_conv_btn"><div title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['pm_delete_convers'];?>
" <?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?>id="<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
"<?php }?> class="mob_del_swipe_txt js__mob_del_conv_ids <?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {?>js__isgroup<?php }?>"><?php if ($_smarty_tpl->tpl_vars['contact']->value['group_id'] > 0) {
echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_confirm_btn_leaving_group'];
} else {
echo $_smarty_tpl->tpl_vars['this']->value->lang['del_pm'];
}?></div></div></a></div><?php }
}
} else {
if (isset($_smarty_tpl->tpl_vars['nullreturn']->value)) {?>0<?php } else { ?><div class="pmessenger-no-contacts"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['you_dosent_have_dialog_with_users'];?>
</div><?php }
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}

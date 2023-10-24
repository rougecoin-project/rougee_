<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-18 13:28:43
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/group-markup.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64660beb5a0a70_64208100',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '7e7ec1b1d60732f5d12804434353dfbe71e6df3e' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/group-markup.html',
      1 => 1684329622,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64660beb5a0a70_64208100 (Smarty_Internal_Template $_smarty_tpl) {
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['contacts']->value, 'contact');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['contact']->value) {
$_smarty_tpl->_assignInScope('last_message', $_smarty_tpl->tpl_vars['this']->value->getLastMessage(0,0,$_smarty_tpl->tpl_vars['contact']->value['group_id']));
$_smarty_tpl->_assignInScope('last_seen', $_smarty_tpl->tpl_vars['this']->value->time_elapsed($_smarty_tpl->tpl_vars['contact']->value['last_seen']));
$_smarty_tpl->_assignInScope('group_online', $_smarty_tpl->tpl_vars['this']->value->is_groupchat_online($_smarty_tpl->tpl_vars['contact']->value['group_id']));
$_smarty_tpl->_assignInScope('user_show_last_seen', 1);
$_smarty_tpl->_assignInScope('user_online_privacy', 1);
$_smarty_tpl->_assignInScope('avatar', $_smarty_tpl->tpl_vars['this']->value->get_avatar($_smarty_tpl->tpl_vars['contact']->value['avatar']));
$_smarty_tpl->_assignInScope('fullname', $_smarty_tpl->tpl_vars['contact']->value['group_name']);
$_smarty_tpl->_assignInScope('group_count', $_smarty_tpl->tpl_vars['this']->value->getCountByUser(0,0,$_smarty_tpl->tpl_vars['contact']->value['group_id']));?><div class="vy_ms_contactbord"><a href="/messenger/g/<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
" data-last-message-timestamp="<?php echo $_smarty_tpl->tpl_vars['last_message']->value['time'];?>
" userfullname="<?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
" id="contact-GG<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
" class="pmessenger-contact-a <?php if ($_smarty_tpl->tpl_vars['group_count']->value > 0) {?>_newmessages<?php }?> vy_ms_contactisgroup contact_groupid_<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
" onclick="__j('.pmessenger-contact-a').removeClass('active');__j(this).addClass('active');messenger.openContact(this,event,'<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
','<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_name'];?>
','<?php echo $_smarty_tpl->tpl_vars['last_seen']->value;?>
',0,'<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
','<?php echo $_smarty_tpl->tpl_vars['user_show_last_seen']->value;?>
','<?php echo $_smarty_tpl->tpl_vars['user_online_privacy']->value;?>
');let curr_group_id = <?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
;setTimeout(function(){__j('.contact_groupid_'+curr_group_id).addClass('active');},2000);"><div class="js_conv_swipe pmessenger-mleft12"><div class="pmessenger-contact-avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
" /><div class="only_ic global_user_online global_user_online_GG<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
"><?php if ($_smarty_tpl->tpl_vars['group_online']->value) {?><span class="ic-online"></span><?php }?></div></div><div class="pmessenger-contact-info"><div class="pmessenger-contact-name ellip" title="<?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['fullname']->value;?>
</div><div class="pmessenger-contact-last-msg ellip _1htf _6zke"><div class="_42dz5 ellip"><?php if (empty($_smarty_tpl->tpl_vars['last_message']->value['text'])) {?>N/A<?php } else {
if ($_smarty_tpl->tpl_vars['last_message']->value['from_id'] == $_smarty_tpl->tpl_vars['this']->value->USER['id']) {?><span class="convo__msgAuthor"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['You'];?>
:</span>&nbsp;<?php }
echo str_replace('&amp;','&',$_smarty_tpl->tpl_vars['this']->value->str_messenger($_smarty_tpl->tpl_vars['last_message']->value['text'],1,20));
}?></div><div class="pmessenger-contact-last-msg-time"><div class="_6zkf">&#8729;</div><span class="_1ht7 _6zkh timestamp"><?php if (empty($_smarty_tpl->tpl_vars['last_message']->value['time'])) {?>N/A<?php } else {
echo $_smarty_tpl->tpl_vars['this']->value->lastMessageConvertTime($_smarty_tpl->tpl_vars['last_message']->value['time']);
}?></span></div></div><?php if (isset($_smarty_tpl->tpl_vars['last_message']->value['group_seen'])) {?><div class="_3fx44cc"><?php if (!empty($_smarty_tpl->tpl_vars['last_message']->value['group_seen'])) {?><div class="_3fx45cc" style="background-image:url(<?php echo $_smarty_tpl->tpl_vars['avatar']->value;?>
);"></div><?php } else { ?><div class="contact-messenger_sent_Status"><i class="glyphicon contact-messenger-sent-ic glyphicon-ok-sign"></i></div><?php }?></div><?php }
if ($_smarty_tpl->tpl_vars['group_count']->value > 0) {?><div class="convo__unread oval in_messenger">+<?php echo $_smarty_tpl->tpl_vars['group_count']->value;?>
</div><?php }?></div></div><div class="mob_delete_on_swipe js_mob_delete_conv_btn"><div title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_confirm_btn_leaving_group'];?>
" id="<?php echo $_smarty_tpl->tpl_vars['contact']->value['group_id'];?>
" class="mob_del_swipe_txt js__mob_del_conv_ids js__isgroup"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_confirm_btn_leaving_group'];?>
</div></div></a></div><?php
}
} else {
?><div class="messenger_no_groups_to_show"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['mess_no_groups'];?>
</div><?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}
}

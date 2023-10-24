<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-24 00:31:18
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/global-popup.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_646d3eb6e28355_81862979',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '3c69112c04bb3cb5b1755e2e45e8096099404d77' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/global-popup.html',
      1 => 1684329621,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_646d3eb6e28355_81862979 (Smarty_Internal_Template $_smarty_tpl) {
?><section onclick="evstop(event);" class="vy_ms__globalpopup js__vy_ms__globalpopup"><div class="vy_ms__gloalpopup_f54 js__vy_ms__gloalpopup_f54"><div class="vy_ms__gloalpopup_f55flex"><div class="vy_ms__globalpopup_header"><?php echo $_smarty_tpl->tpl_vars['title']->value;?>
<a href="javascript:void(0);" class="vy_ms__globalpopup_close js__vy_ms__globalpopup_close"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3     214.2,178.5   "/></g></g></svg></a></div><?php if ($_smarty_tpl->tpl_vars['this']->value->action == 'manage-group-members') {?><section style="position:relative;width:100%;"><div class="vy_ms__globalpopup_header_options"><div class="vy_ms__globalpopup_group_tabs"><a href="javascript:void(0);" onclick="messenger.group_admin_show_subscribed_membs(event,'<?php echo $_smarty_tpl->tpl_vars['group_id']->value;?>
');" class="vy_ms__group_members_active_tab"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_current_group_members'];?>
</a><a href="javascript:void(0);" onclick="messenger.group_admin_invite_new_membs(event,'<?php echo $_smarty_tpl->tpl_vars['group_id']->value;?>
');"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_add_new_members'];?>
</a></div></div><div class="vy_ms__group_subscribed_members js__vy_ms__group_subscribed_members"><div class="vy_ms__group_subscribed_checkuserforadmin"><label for="vy_ms_newadmin"><input id="vy_ms_newadmin" type="checkbox" /><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_group_add_new_admins'];?>
</label></div><div class="vy_ms__globalpopup_filters _5iwm"><div class="_58ak"><input onkeyup="messenger.filterGroupMembers(event,this);" type="text" id="vy__ms_groupadmin_filter_members" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_filter_group_members'];?>
" /></div></div><div class="vy_ms__globalpopup_content"><div class="js__vy_ms__globalpopup_content vy_ms__globalpopup_content_sll"><div class="div-loader"></div></div></div></div><div class="vy_ms__group_invitenew_members js__vy_ms__group_invitenew_members"><div class="vy_ms__globalpopup_filters _5iwm"><div class="_58ak"><input onkeyup="messenger.filterNewResultMembs(event,this);" type="text" id="vy_ms__groupchat_filter_new_member" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_filter_group_members'];?>
" /></div></div><div class="vy_ms__globalpopup_content_invitenew"><div class="js__vy_ms__globalpopup_content_invitenew vy_ms__globalpopup_content_sll_invitenew"><div class="div-loader"></div></div></div></div></section><?php } else { ?><div class="vy_mess-pcontact_all"><div class="vy_mess-pcontact_search _5iwm"><div class="_58ak"><?php if ($_smarty_tpl->tpl_vars['type']->value == 'forward-message') {?><input type="text" id="vy__ms_forward_cnt_searchcontactinput" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['searchfriends'];?>
" /><a href="javascript:void(0);" style="display:none;" ontouchend="__j('#vy__ms_forward_cnt_searchcontactinput').val('').trigger('keyup.forward_search');" onclick="__j('#vy__ms_forward_cnt_searchcontactinput').val('').trigger('keyup.forward_search');" class="vy__ms_forward_cnt_searchcontactinput_close_search js__vy_ms__globalpopup_close_search"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3     214.2,178.5   "></polygon></g></g></svg></a><?php } else { ?><input onkeydown="clearTimeout(this.__ssc_timeout);" onkeypres="clearTimeout(this.__ssc_timeout);" onkeyup="let t = this;clearTimeout(this.__ssc_timeout); this.__ssc_timeout = setTimeout(function(){messenger.shareContentSearchContact(event,t);},500);"  type="text" id="vy__ms_share_cnt_searchcontactinput" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['searchfriends'];?>
" /><?php }?></div></div><div class="vy_mess-pcontact_info"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><g><path d="M256,85.333c-23.531,0-42.667,19.135-42.667,42.667s19.135,42.667,42.667,42.667s42.667-19.135,42.667-42.667     S279.531,85.333,256,85.333z M256,149.333c-11.76,0-21.333-9.573-21.333-21.333s9.573-21.333,21.333-21.333     s21.333,9.573,21.333,21.333S267.76,149.333,256,149.333z"/><path d="M288,192h-85.333c-5.896,0-10.667,4.771-10.667,10.667v42.667c0,5.896,4.771,10.667,10.667,10.667h10.667v160     c0,5.896,4.771,10.667,10.667,10.667h64c5.896,0,10.667-4.771,10.667-10.667V202.667C298.667,196.771,293.896,192,288,192z      M277.333,405.333h-42.667v-160c0-5.896-4.771-10.667-10.667-10.667h-10.667v-21.333h64V405.333z"/><path d="M256,0C114.844,0,0,114.844,0,256s114.844,256,256,256s256-114.844,256-256S397.156,0,256,0z M256,490.667     C126.604,490.667,21.333,385.396,21.333,256S126.604,21.333,256,21.333S490.667,126.604,490.667,256S385.396,490.667,256,490.667     z"/></g></g></g></svg><span><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_select_recipient_to_send_message'];?>
</span></div><div class="vy_ms__globalpopup_content"><div class="js__vy_ms__globalpopup_content vy_ms__globalpopup_content_sll"><div class="div-loader"></div></div></div></div><?php }?></div></div></section><?php }
}

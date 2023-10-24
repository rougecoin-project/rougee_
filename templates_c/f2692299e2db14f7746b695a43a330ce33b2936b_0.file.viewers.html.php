<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-21 06:09:16
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/viewers.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6469996cad4e06_46966074',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'f2692299e2db14f7746b695a43a330ce33b2936b' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/viewers.html',
      1 => 1684323024,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6469996cad4e06_46966074 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_assignInScope('i', 0);
$_smarty_tpl->_assignInScope('blocked_users', $_smarty_tpl->tpl_vars['users']->value['blocked_viewers']);
$_smarty_tpl->_assignInScope('muted_users', $_smarty_tpl->tpl_vars['users']->value['muted_viewers']);?><div class="vy_lvst_pp_header"><a href="javascript:void(0);" class="vy_lvst_popup_backbtn" id="vy_lvst_popup_back"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['back'];?>
</a><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['your_viewers'];?>
</h3><div class="vy_lvst_header_search_filer _258ak"><input type="text" onkeyup="vy_lvst.searchInViewers(event,this);" class="vy_lvst_header_search_filer_inp" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['search_for_viewers'];?>
" /></div></div><?php if (count($_smarty_tpl->tpl_vars['blocked_users']->value)) {
$_smarty_tpl->_assignInScope('i', 1);?><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['blocked_users'];?>
</h3><ul class="vy_lv_blocked_list"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['blocked_users']->value, 'user');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['user']->value) {
$_smarty_tpl->_assignInScope('ud', $_smarty_tpl->tpl_vars['this']->value->lv_getUserDetails($_smarty_tpl->tpl_vars['user']->value));?><li class="vy_lv-pcontact" id="vy_lv_blocked_viewer_<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
"><div class="vy_lvst-pcontact_avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['ud']->value['avatar'];?>
"></div><div class="vy_lvst-pcontact_details"><div class="vy_lvst-pcontact_name js__lvst_pcontact_name"><username><?php echo $_smarty_tpl->tpl_vars['ud']->value['fullname'];?>
</username></div></div><div class="vy_lvst_viewer_mng js__vy_lvst_viewer_mng"><a href="javascript:void(0);" onclick="vy_lvst.unBlockViewer(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __unblock"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['unblock'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['unblock'];?>
</a></div></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php }
if (count($_smarty_tpl->tpl_vars['muted_users']->value)) {
$_smarty_tpl->_assignInScope('i', 1);?><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['muted_users'];?>
</h3><ul class="vy_lv_muted_list"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['muted_users']->value, 'user');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['user']->value) {
$_smarty_tpl->_assignInScope('ud', $_smarty_tpl->tpl_vars['this']->value->lv_getUserDetails($_smarty_tpl->tpl_vars['user']->value));?><li class="vy_lv-pcontact" id="vy_lv_muted_viewer_<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
"><div class="vy_lvst-pcontact_avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['ud']->value['avatar'];?>
"></div><div class="vy_lvst-pcontact_details"><div class="vy_lvst-pcontact_name js__lvst_pcontact_name"><username><?php echo $_smarty_tpl->tpl_vars['ud']->value['fullname'];?>
</username></div></div><div class="vy_lvst_viewer_mng js__vy_lvst_viewer_mng"><?php if (!in_array($_smarty_tpl->tpl_vars['user']->value,$_smarty_tpl->tpl_vars['blocked_users']->value)) {?><a href="javascript:void(0);" onclick="vy_lvst.blockViewer(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __block"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['block'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['block'];?>
</a><?php }?><a href="javascript:void(0);" onclick="vy_lvst.unMuteViewer(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __unmute"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['unmute'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['unmute'];?>
</a></div></li><?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php }?><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['viewers'];?>
</h3><ul id="vy_lvst_viewers_ul"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['users']->value['viewers'], 'user');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['user']->value) {
$_smarty_tpl->_assignInScope('ud', $_smarty_tpl->tpl_vars['this']->value->lv_getUserDetails($_smarty_tpl->tpl_vars['user']->value));
$_smarty_tpl->_assignInScope('i', 1);?><li class="vy_lv-pcontact" id="vy_lv_viewer_<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
"><div class="vy_lvst-pcontact_avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['ud']->value['avatar'];?>
"></div><div class="vy_lvst-pcontact_details"><div class="vy_lvst-pcontact_name js__lvst_pcontact_name"><username><?php echo $_smarty_tpl->tpl_vars['ud']->value['fullname'];?>
</username></div></div><div class="vy_lvst_viewer_mng js__vy_lvst_viewer_mng"><a href="javascript:void(0);" onclick="vy_lvst.blockViewer(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __block"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['block'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['block'];?>
</a><a href="javascript:void(0);" onclick="vy_lvst.muteViewer(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __mute"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['mute'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['mute'];?>
</a></div></li><?php
}
} else {
?><div class="vy_lvst_st_popup_no_data"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['no_viewers_yet'];?>
</div><?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php if ($_smarty_tpl->tpl_vars['i']->value <= 0) {
echo '<script'; ?>
>
Swal.fire({
  icon: 'info',
  title: 'Empty!',
  text: 'No viewers yet!'
});
vy_lvst.playSound('openpopup');
 <?php echo '</script'; ?>
><?php }
}
}

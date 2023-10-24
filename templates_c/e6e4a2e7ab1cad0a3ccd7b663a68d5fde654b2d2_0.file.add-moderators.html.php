<?php
/* Smarty version 3.1.34-dev-7, created on 2023-06-25 20:55:27
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/add-moderators.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64988d9f6def05_52878241',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'e6e4a2e7ab1cad0a3ccd7b663a68d5fde654b2d2' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/add-moderators.html',
      1 => 1682512440,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64988d9f6def05_52878241 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_assignInScope('i', 0);?><div class="vy_lvst_pp_header"><a href="javascript:void(0);" class="vy_lvst_popup_backbtn" id="vy_lvst_popup_back"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['back'];?>
</a><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['add_moderators'];?>
</h3><div class="vy_lvst_header_search_filer _258ak"><input type="text" onkeyup="vy_lvst.searchInViewers(event,this);" class="vy_lvst_header_search_filer_inp" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['search_viewers'];?>
" /></div></div><h3><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['your_current_viewers'];?>
</h3><ul id="vy_lvst_viewers_ul"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['users']->value['viewers'], 'user');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['user']->value) {
$_smarty_tpl->_assignInScope('ud', $_smarty_tpl->tpl_vars['this']->value->lv_getUserDetails($_smarty_tpl->tpl_vars['user']->value));
$_smarty_tpl->_assignInScope('i', 1);?><li class="vy_lv-pcontact" id="vy_lv_viewer_<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
"><div class="vy_lvst-pcontact_avatar"><img src="<?php echo $_smarty_tpl->tpl_vars['ud']->value['avatar'];?>
"></div><div class="vy_lvst-pcontact_details"><div class="vy_lvst-pcontact_name js__lvst_pcontact_name"><username><?php echo $_smarty_tpl->tpl_vars['ud']->value['fullname'];?>
</username></div></div><div class="vy_lvst_viewer_mng js__vy_lvst_viewer_mng"><a href="javascript:void(0);" onclick="vy_lvst.addModerator(event,this,<?php echo $_smarty_tpl->tpl_vars['user']->value;?>
,<?php echo $_smarty_tpl->tpl_vars['live_id']->value;?>
);" class="vy_lvst_viewer_btn_mng __moderator"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['moderator'];?>
 <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['make_moderator'];?>
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

<?php
/* Smarty version 3.1.34-dev-7, created on 2023-06-19 09:59:35
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/to_page.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64900ae7cd2819_86208018',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '38506082417fed77e5074e312702278b2e48d77b' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/to_page.html',
      1 => 1682512440,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64900ae7cd2819_86208018 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_assignInScope('item', $_smarty_tpl->tpl_vars['this']->value->getPageDetails($_smarty_tpl->tpl_vars['this']->value->page_id));?><div class="vy_lv_brd_related_to2"><div class="nm_tx"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['broadcasting_in'];?>
: <a href="/livestream" class="vy_lv_brdin_close"><?php echo $_smarty_tpl->tpl_vars['this']->value->svg['close'];?>
</a></div><select id="js__vy_lv_brd_related_to" class="vy_disabled"><option value="0" data-imagesrc="<?php echo $_smarty_tpl->tpl_vars['item']->value['avatar'];?>
"data-description="Page"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</option></select></div><?php }
}

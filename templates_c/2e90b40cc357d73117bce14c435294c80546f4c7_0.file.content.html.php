<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-20 02:09:34
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/mob/content.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64680fbea9b8c6_61805551',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '2e90b40cc357d73117bce14c435294c80546f4c7' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/mob/content.html',
      1 => 1684323161,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64680fbea9b8c6_61805551 (Smarty_Internal_Template $_smarty_tpl) {
?><section id="vy_lv__mob_popup"><?php ob_start();
echo dirname('__FILE__');
$_prefixVariable1=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable1."/header.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?><p hide-on-bottom><?php ob_start();
echo dirname('__FILE__');
$_prefixVariable2=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable2."/contents/".((string)$_smarty_tpl->tpl_vars['file_content']->value), $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?></p><?php ob_start();
echo dirname('__FILE__');
$_prefixVariable3=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable3."/footer.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?></section><?php }
}

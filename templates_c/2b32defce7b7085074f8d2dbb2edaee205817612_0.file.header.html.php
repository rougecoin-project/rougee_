<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:43:57
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/header.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464da1d241eb8_27704644',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '2b32defce7b7085074f8d2dbb2edaee205817612' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/header.html',
      1 => 1684329884,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464da1d241eb8_27704644 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_assignInScope('host_url', $_smarty_tpl->tpl_vars['this']->value->settings['HOST']);
if (isset($_smarty_tpl->tpl_vars['this']->value->wowonder_url)) {
$_smarty_tpl->_assignInScope('host_url', $_smarty_tpl->tpl_vars['this']->value->wowonder_url);
}?><html class="vy-msn-desktop-call-bd"><head><title><?php echo $_smarty_tpl->tpl_vars['popup_title']->value;?>
</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="<?php echo $_smarty_tpl->tpl_vars['host_url']->value;?>
/<?php echo $_smarty_tpl->tpl_vars['this']->value->recipient['avatar'];?>
"><?php echo '<script'; ?>
 src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"><?php echo '</script'; ?>
><?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['this']->value->settings['ASSETS'];?>
/js/calls-popup.js?v=<?php echo mt_rand();?>
"><?php echo '</script'; ?>
></head><body style="display:none;">  <?php }
}

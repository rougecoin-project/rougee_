<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:43:57
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/call.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464da1d21a594_37247330',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'bf03403b81f201099d46f4721a4e89cbbf961b48' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/call.html',
      1 => 1684329883,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464da1d21a594_37247330 (Smarty_Internal_Template $_smarty_tpl) {
ob_start();
if ($_smarty_tpl->tpl_vars['incomingcall']->value) {
echo (string)$_smarty_tpl->tpl_vars['this']->value->recipient['fullname'];
echo " is calling you...";
} else {
echo "Calling ";
echo (string)$_smarty_tpl->tpl_vars['this']->value->recipient['fullname'];
echo "...";
}
$_prefixVariable1=ob_get_clean();
$_smarty_tpl->_assignInScope('popup_title', $_prefixVariable1);
ob_start();
echo dirname('__DIR__');
$_prefixVariable2=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable2."/header.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
$_smarty_tpl->_assignInScope('host_url', $_smarty_tpl->tpl_vars['this']->value->settings['HOST']);
if (isset($_smarty_tpl->tpl_vars['this']->value->wowonder_url)) {
$_smarty_tpl->_assignInScope('host_url', $_smarty_tpl->tpl_vars['this']->value->wowonder_url);
}?><div id="msn_bg_eff" class="msn_calls_blur __none" style="background-image:url(<?php echo $_smarty_tpl->tpl_vars['host_url']->value;?>
/<?php echo $_smarty_tpl->tpl_vars['this']->value->recipient['avatar'];?>
);"></div><div class="vy_msn_34vbg"><div class="vymsn-callpopup-desktop-u-dt"><div class="vymsn_udt_av"><div class="callpopup-background-cl-av" style="background-image:url(<?php echo $_smarty_tpl->tpl_vars['host_url']->value;?>
/<?php echo $_smarty_tpl->tpl_vars['this']->value->recipient['avatar'];?>
);"></div></div><div class="vymsn_fji2c12potyy"><div class="vymsn_udt_fn"><div class="vymsn_udt_fn2"><?php echo $_smarty_tpl->tpl_vars['this']->value->recipient['fullname'];?>
</div></div><div class="vymsn_do215" id="vymsn_call_status"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Call_Connecting...'];?>
</div><div class="vymsn_f325sf" id="vymsn_call_error"></div></div></div></div><?php ob_start();
echo dirname('__DIR__');
$_prefixVariable3=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable3."/footer.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
}
}

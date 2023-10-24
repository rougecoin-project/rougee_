<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:02:23
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/select-privacy.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464d05fd3c6c8_30753616',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'bf898de4199427754a54820353209d820c5e60af' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/select-privacy.html',
      1 => 1684323037,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464d05fd3c6c8_30753616 (Smarty_Internal_Template $_smarty_tpl) {
ob_start();
echo dirname('__DIR__');
$_prefixVariable1=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable1."/header.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
$_smarty_tpl->_assignInScope('i', 1);?><ul class="vy_lv_audienceul"><?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['arr']->value, 'item');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
?><li><label class="vy_lv_audience_lb" for="vylvcbx_<?php echo $_smarty_tpl->tpl_vars['item']->value['ic'];?>
"><div class="vy_lv_audience_ic_c"><i class="vy_lv_audience_ic <?php echo $_smarty_tpl->tpl_vars['item']->value['ic'];?>
"></i></div><div class="vy_lv_audience_tx"><div class="vy_lv_audience_tl"><?php echo $_smarty_tpl->tpl_vars['item']->value['title'];?>
</div><div class="vy_lv_audience_ds"><?php echo $_smarty_tpl->tpl_vars['item']->value['descr'];?>
</div></div><div class="vy_lv_radio_cn"><input <?php if ($_smarty_tpl->tpl_vars['value']->value == $_smarty_tpl->tpl_vars['i']->value || $_smarty_tpl->tpl_vars['i']->value == 1) {?>checked<?php }?> type="radio" class="vy_lv_radio" name="vy_lv_audiencev" id="vylvcbx_<?php echo $_smarty_tpl->tpl_vars['item']->value['ic'];?>
" value="<?php echo $_smarty_tpl->tpl_vars['i']->value;?>
"></div></label></li><?php $_smarty_tpl->_assignInScope('i', $_smarty_tpl->tpl_vars['i']->value+1);
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?></ul><?php echo '<script'; ?>
>var vy_lv_privacy_arr = '<?php echo json_encode($_smarty_tpl->tpl_vars['arr']->value);?>
';<?php echo '</script'; ?>
><?php ob_start();
echo dirname('__DIR__');
$_prefixVariable2=ob_get_clean();
$_smarty_tpl->_subTemplateRender($_prefixVariable2."/footer.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
}
}

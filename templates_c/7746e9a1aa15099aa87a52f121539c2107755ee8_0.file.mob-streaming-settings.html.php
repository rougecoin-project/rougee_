<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-20 02:10:07
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/mob/contents/mob-streaming-settings.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64680fdff17792_34239539',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '7746e9a1aa15099aa87a52f121539c2107755ee8' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/popups/mob/contents/mob-streaming-settings.html',
      1 => 1684324038,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64680fdff17792_34239539 (Smarty_Internal_Template $_smarty_tpl) {
?><section class="vy_lv_mob_popup_allincard"><fieldset><legend><b> <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['viewers'];?>
 </b> </legend><button data-id="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" data-kind="viewers" data-title="Block/Mute Viewers" class="vy_lv_ripple" onclick="vy_lvst.mobstf(event,this);"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['block_mute_viewers'];?>
</button></fieldset></section><section class="vy_lv_mob_popup_allincard"><fieldset><legend><b> <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['add_moderators'];?>
 </b> </legend><button data-id="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" data-kind="new-moder" data-title="Add moderators" class="vy_lv_ripple" onclick="vy_lvst.mobstf(event,this);"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['add_moderators'];?>
</button></fieldset></section><section class="vy_lv_mob_popup_allincard"><fieldset><legend><b> <?php echo $_smarty_tpl->tpl_vars['this']->value->lang['remove_moderators'];?>
 </b> </legend><button data-id="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
" data-kind="remove-moder" data-title="Remove moderators" class="vy_lv_ripple" onclick="vy_lvst.mobstf(event,this);"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['remove_moderators'];?>
</button></fieldset></section><?php }
}

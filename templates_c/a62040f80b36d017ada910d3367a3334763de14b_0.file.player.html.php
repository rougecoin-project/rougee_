<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-18 02:57:36
  from '/home/admin/web/rougee.io/public_html/vy-livestream/layout/player.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_64657800f40887_72487518',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'a62040f80b36d017ada910d3367a3334763de14b' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-livestream/layout/player.html',
      1 => 1684323017,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64657800f40887_72487518 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="vy_lv_feedrecorded_vd"><video id="vy_lv_recordplayer_id_<?php echo $_smarty_tpl->tpl_vars['r']->value['id'];?>
" poster="<?php echo $_smarty_tpl->tpl_vars['r']->value['full_cover_url'];?>
" muted autoplay playsinline><source src="<?php echo $_smarty_tpl->tpl_vars['r']->value['full_file_path'];?>
" type="video/mp4" /></video></div><?php echo '<script'; ?>
 type="text/javascript">(function() {var player_id = <?php echo $_smarty_tpl->tpl_vars['r']->value['id'];?>
;player_opts[player_id] = {};player_opts[player_id]['fpath'] = "<?php echo $_smarty_tpl->tpl_vars['r']->value['full_file_path'];?>
";player_opts[player_id]['poster'] = "<?php echo $_smarty_tpl->tpl_vars['r']->value['full_cover_url'];?>
"; 
player_opts[player_id]['f'] = function(){
$('#vy_lv_player_loading_'+player_id).remove();

player_opts[player_id] = fluidPlayer(
'vy_lv_recordplayer_id_'+player_id, {
  "layoutControls": {
    "primaryColor":"red",
    "controlBar": {
      "autoHideTimeout": 3,
      "animated": true,
      "autoHide": true,
      "playbackRates": [
        "x2",
        "x1.5",
        "x1",
        "x0.5"
      ]
    },
    "autoPlay": true,
    "mute": true,
    "allowTheatre": true,
    "playPauseAnimation": false,
    "playbackRateEnabled": true,
    "allowDownload": false,
    "playButtonShowing": true,
    "fillToContainer": true,
    "posterImage": player_opts[player_id]['poster']
  },
  playerInitCallback:     (function() {})
});

}      
player_opts[player_id]['f']();

})();      
<?php echo '</script'; ?>
><?php }
}

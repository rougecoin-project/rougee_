<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:43:57
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/footer.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464da1d261f56_67434914',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '1bb0824237a99cf708426a36fb967a167ace438c' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/calls/desktop/footer.html',
      1 => 1684329884,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464da1d261f56_67434914 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="vy_ms_wbrtc_mediaelement" id="vy_ms_wbrtc_mediaelement"><div id="vymsn_videocall_media" class="<?php if ($_smarty_tpl->tpl_vars['this']->value->type == 'audio') {?>__none<?php }?>"><div id="vy_msn_call_local_arrow_hide" class="__none sd0tyowg foed1vyy l30l7tkp alrytcbg r30xiam5 m0q0jmkx"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['call_local_window_arrow_hide'];?>
</div><div id="vy_msn_call_local_arrow_show" class="__none sd0tyowg foed1vyy l30l7tkp alrytcbg r30xiam5 m0q0jmkx"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['call_local_window_arrow_show'];?>
</div><div class="vy_msn_calls_localvideo_mask" id="vy_msn_videohov"></div><video playsinline  autoplay id="vy-ms__recipient-video-element"></video><video playsinline  autoplay muted id="vy-ms__user-video-element"></video></div></div><div class="vy_msn_fullbg_anim"></div><canvas id="msn_freq" width="1024" height="525"></canvas><footer class="vy_msn_footer_controls slidedown"><div id="vymsn_footer" class="msn_fi34qpo3"><div id="vymsn_footer_controls_btns" class="msn_footer_right_opts __none"><button onclick="switch_camera(event,this);" class="msn_fgi32lfxg __none" title="Switch Camera" id="vymsn_switch_camera"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['switch_camera'];?>
</button><button onclick="shareScreen(event,this);" class="msn_fgi32lfxg __none" title="Share your screen" id="vymsn_share_screen"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['calls_share_screen'];?>
</button><button onclick="requestVideoChat(event,this);" class="msn_fgi32lfxg <?php if ($_smarty_tpl->tpl_vars['this']->value->type == 'video') {?>__none<?php }?>" title="Request video call" id="vymsn_request_video"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['calls_req_video'];?>
</button><button onclick="removeVideoChat(event,this);" class="msn_fgi32lfxg <?php if ($_smarty_tpl->tpl_vars['this']->value->type == 'audio') {?>__none<?php }?>" title="Stop video" id="vymsn_remove_video"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['calls_remove_video'];?>
</button><button onclick="muteMicrophone(event,this);" class="msn_fgi32lfxg" title="Mute your microphone" id="vymsn_mute_microphone"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['calls_microphone'];?>
</button></div><div class="vmm243so2"><button onclick="hangup(event);" title="Hangup" class="msn_fgi32lfxg" id="vymsn_hang_up"><?php echo $_smarty_tpl->tpl_vars['this']->value->svgs['calls_hangup'];?>
</button></div></div></footer><?php echo '<script'; ?>
>
window.onload = function() {
	setRegisterState(NOT_REGISTERED);
	connect();
}

window.onbeforeunload = function() {
	hangup();
	wss.close();
}
<?php echo '</script'; ?>
></body></html><?php }
}

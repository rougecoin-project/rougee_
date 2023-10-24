<?php
/* Smarty version 3.1.34-dev-7, created on 2023-05-17 15:43:44
  from '/home/admin/web/rougee.io/public_html/vy-messenger/layout/messenger.html' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_6464da105a7475_15899338',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '5056632431ee411dde1f5a60e3639d6c4d29b52f' => 
    array (
      0 => '/home/admin/web/rougee.io/public_html/vy-messenger/layout/messenger.html',
      1 => 1684329627,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_6464da105a7475_15899338 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="pmessenger mmmm_c_m vy_msn_vars" style="display:none;"><div id="pointerOverlay" class=""></div><div id="audio-video-mob-conference"></div><div class="messenger-load-data js_messenger_load_data"><div class="messenger_load_data_flex"><div class="messenger_load_data_brand"><?php echo $_smarty_tpl->tpl_vars['svgi']->value['brand_icon'];?>
</div><div class="messenger_load_data_ic"><i class="messenger-gif-search-loading"></i></div></div></div><div class="pmessenger_left_optsbar"><div onclick="messenger.leftSideOptsMenuToggle(this,event);" class="v3542"><?php echo $_smarty_tpl->tpl_vars['svgi']->value['brand_icon'];?>
</div><div class="vyseparator_leftside"></div><a href="javascript:void(0);" onclick="messenger.switchTabs(this,event,'conversations');" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
" id="tippy_all_conv" class="v24d2f h4active _ob34"><div class="vymsn_left_ic _messages"></div></a><a href="javascript:void(0);" onclick="messenger.switchTabs(this,event,'groups');" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_Groups'];?>
" id="tippy_groups" class="v24d2f _ob34"><div class="vymsn_left_ic _group"></div></a><a href="javascript:void(0);" onclick="messenger.switchTabs(this,event,'online');" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_online'];?>
" id="tippy_online" class="v24d2f _ob34"><div class="vymsn_left_ic _online"></div></a><a href="javascript:void(0);" onclick="messenger.composeNewMessage(event);" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_new_message'];?>
" id="tippy_new_msg" class="v24d2f _ob34"><div class="vymsn_left_ic _newmsg"></div></a><a href="javascript:void(0);" onclick="messenger.createGroupChat(this,event);" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_create_groupchat'];?>
" id="tippy_new_group" class="v24d2f _ob34"><div class="vymsn_left_ic _newgroup"></div></a><a href="javascript:void(0);" onclick="messenger.toFullScreen(this,event);" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_toggle_fullscreen'];?>
" id="tippy_fullscreen" class="v24d2f _ob34"><div class="vymsn_left_ic _fullscreen"></div></a><a href="javascript:void(0);" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
" id="tippy_calls" class="v24d2f __none"><div class="vymsn_left_ic _calls"></div></a><a href="javascript:void(0);" onclick="messenger.toggleDayNightMode(this,event);" data-tippy-content="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
" id="night_mode_toggle" class="v24d2f <?php echo $_smarty_tpl->tpl_vars['dark']->value;?>
"><div class="vymsn_left_ic _dark"></div></a><a href="/" data-tippy-content="Go Home" class="v24d2f vymsn_wondertaggohome" style="display:none;"><span class="material-symbols-outlined">home</span></a><div class="v45423"><img src="<?php echo $_smarty_tpl->tpl_vars['this']->value->USER['avatar'];?>
" /></div></div><div class="pmessenger-contacts-list" id="vymsn_sidebarresizable"><div class="vy_ms_f554xbg __none"><div class="mob-contacts-header ellip" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
"><div style="display:none;" class="js__vy_ms_topavatar_standalone_logout" onclick="messenger.standAloneSwitchAccountDropDown(this,event);"><img class="vy_ms__top_avatar" src="<?php echo $_smarty_tpl->tpl_vars['this']->value->USER['avatar'];?>
" /><div class="vy_ms_standalone_logout js__vy_ms_standalone_logout __none"><div class="vymsf40sx_3"><?php echo $_smarty_tpl->tpl_vars['this']->value->USER['fullname'];?>
</div><ul><li><a ontouchend="logout();" onclick="logout();" href="javascript:void(0);"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_standalone_logout'];?>
</a></li></ul></div></div><img class="vy_ms__top_avatar _fwowondxv2" src="<?php echo $_smarty_tpl->tpl_vars['this']->value->USER['avatar'];?>
" /><span><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
</span></div><div class="vy_ms__main_btns"><a class="vy_ms__main_btns_a" href="javascript:void(0);" onclick="messenger.toggleDayNightMode(this,event);"><?php if (isset($_COOKIE['mode']) && $_COOKIE['mode'] == 'night') {
echo $_smarty_tpl->tpl_vars['this']->value->svgs['js']['disable_dark'];
} else {
echo $_smarty_tpl->tpl_vars['this']->value->svgs['js']['enable_dark'];
}?></a><a class="vy_ms__main_btns_a __onlywondertag" style="display:none;" href="/" data-ajax="?index.php?link1=home"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zm-6-2h5V9.157l-6-5.454-6 5.454V19h5v-6h2v6z" fill="currentColor"></path></svg></a><a class="vy_ms__main_btns_a" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_new_message'];?>
" href="javascript:void(0);" onclick="messenger.composeNewMessage(event);"><svg viewBox="0 0 36 36"><g id="compose" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><polygon id="Fill-1" points="0 36 36 36 36 0 0 0"></polygon><path id="Fill-2" d="M15.047,20.26245 L15.9815,17.45445 C16.091,17.12495 16.276,16.82495 16.5215,16.57945 L27.486,5.60195 C28.29,4.79695 29.595,4.79695 30.399,5.60195 C31.2025,6.40645 31.202,7.70895 30.399,8.51345 L19.432,19.49345 C19.186,19.73945 18.886,19.92495 18.556,20.03495 L15.7555,20.96995 C15.318,21.11645 14.901,20.69995 15.047,20.26245 Z M24.005,28.00095 L12.001,28.00095 C9.791,28.00095 8,26.20945 8,23.99995 L8,11.99895 C8,9.78945 9.791,7.99845 12.001,7.99845 L19.0035,7.99745 C19.5555,7.99745 20.0035,8.44545 20.0035,8.99745 C20.0035,9.54995 19.5555,9.99795 19.0035,9.99795 L12.001,9.99845 C10.8965,9.99845 10.0005,10.89395 10.0005,11.99895 L10.0005,23.99995 C10.0005,25.10445 10.8965,26.00045 12.001,26.00045 L24.005,26.00045 C25.1095,26.00045 26.005,25.10445 26.005,23.99995 C26.005,23.99995 26.0045,17.55145 26.0045,16.99895 C26.0045,16.44645 26.4525,15.99845 27.005,15.99845 C27.557,15.99845 28.005,16.44645 28.005,16.99895 C28.005,17.55145 28.0055,23.99995 28.0055,23.99995 C28.0055,26.20945 26.2145,28.00095 24.005,28.00095 Z" fill="#000000"></path></g></svg><span><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_new_message'];?>
</span></a><a class="vy_ms__main_btns_a" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_create_groupchat'];?>
" href="javascript:void(0);" onclick="messenger.createGroupChat(this,event);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13,13C11,13 7,14 7,16V18H19V16C19,14 15,13 13,13M19.62,13.16C20.45,13.88 21,14.82 21,16V18H24V16C24,14.46 21.63,13.5 19.62,13.16M13,11A3,3 0 0,0 16,8A3,3 0 0,0 13,5A3,3 0 0,0 10,8A3,3 0 0,0 13,11M18,11A3,3 0 0,0 21,8A3,3 0 0,0 18,5C17.68,5 17.37,5.05 17.08,5.14C17.65,5.95 18,6.94 18,8C18,9.06 17.65,10.04 17.08,10.85C17.37,10.95 17.68,11 18,11M8,10H5V7H3V10H0V12H3V15H5V12H8V10Z"></path></svg><span><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_create_groupchat'];?>
</span></a><a class="vy_ms__main_btns_a vymsfullscreenmode" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_toggle_fullscreen'];?>
" href="javascript:void(0);" onclick="messenger.toFullScreen(event);"><svg style="width:20px;height:20px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" version="1.1" x="0px" y="0px" viewBox="0 0 469.333 469.333" style="enable-background:new 0 0 469.333 469.333;" xml:space="preserve"><g><g><g><path d="M160,0c-5.896,0-10.667,4.771-10.667,10.667v138.667H10.667C4.771,149.333,0,154.104,0,160     c0,5.896,4.771,10.667,10.667,10.667H160c5.896,0,10.667-4.771,10.667-10.667V10.667C170.667,4.771,165.896,0,160,0z"/><path d="M309.333,170.667h149.333c5.896,0,10.667-4.771,10.667-10.667c0-5.896-4.771-10.667-10.667-10.667H320V10.667     C320,4.771,315.229,0,309.333,0c-5.896,0-10.667,4.771-10.667,10.667V160C298.667,165.896,303.437,170.667,309.333,170.667z"/><path d="M458.667,298.667H309.333c-5.896,0-10.667,4.771-10.667,10.667v149.333c0,5.896,4.771,10.667,10.667,10.667     c5.896,0,10.667-4.771,10.667-10.667V320h138.667c5.896,0,10.667-4.771,10.667-10.667     C469.333,303.437,464.563,298.667,458.667,298.667z"/><path d="M160,298.667H10.667C4.771,298.667,0,303.437,0,309.333C0,315.229,4.771,320,10.667,320h138.667v138.667     c0,5.896,4.771,10.667,10.667,10.667c5.896,0,10.667-4.771,10.667-10.667V309.333C170.667,303.437,165.896,298.667,160,298.667z"/></g></g></g></svg><span><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_toggle_fullscreen'];?>
</span></a></div></div><div class="pmessenger-newheader"><span class="material-symbols-outlined" id="vymsn_leftmenucollapse">menu</span><span id="vymsn_header_txttitle"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Contacts'];?>
</span><span id="vymsn_header_count">(<?php echo count($_smarty_tpl->tpl_vars['contacts']->value);?>
)</span></div><div class="pmessenger-contacts-header __none"><div class="pmessenger-contacts-header-tab ellip mstabactive active" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_recently'];?>
" onclick="messenger.switchTabs(this,event,'conversations');"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_recently'];?>
</div><div class="pmessenger-contacts-header-tab ellip mstabactive" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_online'];?>
" onclick="messenger.switchTabs(this,event,'online');"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_online'];?>
</div><div class="pmessenger-contacts-header-tab ellip mstabactive" title="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_Groups'];?>
" onclick="messenger.switchTabs(this,event,'groups');"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_top_Groups'];?>
</div></div><div class="_1nq2 js__smarphones_search"><span class="_5iwm _150g _58ah"><label class="_58ak"><input autocomplete="off" id="input-search-messenger" class="_58al" placeholder="<?php echo $_smarty_tpl->tpl_vars['this']->value->lang['searchfriends'];?>
" spellcheck="false" type="text" value=""></label></span><i class="hidden_elem _2xme messenger-cancel-search img sp_2XX5N_0Ca5y sx_29d0b2" onclick="messenger.closeSearch(this,event);"></i><span class="_58-3" aria-hidden="true"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['searchfriends'];?>
</span></div><div id="messenger-contacts-groups-res" class="nano __none"><div class="js__groups_tab_cnt overthrow nano-content"></div></div><div id="messenger-contacts-online-res" class="nano __none"><div class="overthrow nano-content"></div></div><div id="messenger-contacts-search-res" class="nano __none"><div class="overthrow nano-content"></div></div><div id="messenger-contacts-last" class="nano"><div class="overthrow nano-content"><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['this']->value->theme_dir)."/contact-markup.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
if ($_smarty_tpl->tpl_vars['this']->value->settings['PM_CONVERSATIONS_LIMIT'] <= count($_smarty_tpl->tpl_vars['contacts']->value)) {?><div class="messenger-load-more-contacts-loader pmessenger-contact-a"><a class="link-show-more loader-controls private" onclick="evstop(event); messenger.load_more_contacts(this);" uid="prevDialogs"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Load_more'];?>
</a></div><?php }?></div></div></div><div data-template="messenger-top" class="pmessenger-messages-list empty vy_msn_middlecol"><div class="vymsn_no_opencontact js__vymsn_no_opencontact"></div><div class="js_media_gifs __none"></div><div class="js_media_stickers __none"></div><div id="vy_ms-middle-column-bg"></div><?php $_smarty_tpl->_subTemplateRender(((string)$_smarty_tpl->tpl_vars['this']->value->theme_dir)."/messenger-messages-tick.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?><div class="pmessenger-msg-list-contenteditable js__pmessenger_footer"></div></div><div id="mess-user-details" class="pmessenger-user-details nano __none"><div class="overthrow nano-content"><div id="mess-right-col-userdetails" class="pmess-right-block"></div><div id="mess-right-col-settings" class="expanded"><h4 aria-expanded="true" onclick="messenger.expandTab(event,this);" class="_1lj0" aria-pressed="true"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_Options'];?>
<div aria-label="toggle" aria-expanded="true" class="_1lj1" role="button" tabindex="0"></div></h4><div class="messenger_aria_expanded" id="messenger_aria_options"></div></div><div id="mess-right-col-privacy" class="expanded"><h4 aria-expanded="true" onclick="messenger.expandTab(event,this);" class="_1lj0" aria-pressed="true"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_Privacy'];?>
<div aria-label="toggle" aria-expanded="true" class="_1lj1" role="button" tabindex="0"></div></h4><div class="messenger_aria_expanded" id="messenger_aria_privacy"></div></div><div id="mess-right-col-group-members" class="expanded __none"><h4 aria-expanded="true" onclick="messenger.expandTab(event,this);" class="_1lj0" aria-pressed="true"><div><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_Group_Members'];?>
 <span class="js__groupchat_total_members __none">(0)</span></div><div aria-label="toggle" aria-expanded="true" class="_1lj1" role="button" tabindex="0"></div></h4><div class="messenger_aria_expanded" id="messenger_aria_group_members" ></div></div><div id="mess-right-col-attachments" class=""><h4 aria-expanded="true" onclick="messenger.expandTab(event,this);" class="_1lj0" aria-pressed="true"><?php echo $_smarty_tpl->tpl_vars['this']->value->lang['Messenger_attachments'];?>
<div aria-label="toggle" aria-expanded="true" class="_1lj1" role="button" tabindex="0"></div></h4><div class="messenger_aria_expanded"><div id="messenger-attachments-cnt" class="mess-attach-venobox"><div class="div-loader"></div></div></div></div></div></div></div><?php echo '<script'; ?>
>window.contacts_count = <?php echo count($_smarty_tpl->tpl_vars['contacts']->value);?>
;
     function startTippy(){


		 tippy.createSingleton(tippy('._ob34'), {
		 	delay: 250,
		    moveTransition: 'transform 0.2s ease-out',
        animation: 'scale-subtle',
        interactive: false,
        theme: 'material',
        touch:'hold'
		}); 

     }

 
 
      <?php echo '</script'; ?>
><?php }
}

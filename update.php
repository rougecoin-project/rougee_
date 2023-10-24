<?php
if (file_exists('assets/init.php')) {
    require 'assets/init.php';
} else {
    die('Please put this file in the home directory !');
}
if (!file_exists('update_langs')) {
    //die('Folder ./update_langs is not uploaded and missing, please upload the update_langs folder.');
}

$versionToUpdate = '4.2';
$olderVersion = '4.1.5';

if ($wo['config']['version'] == $versionToUpdate && $wo['config']['filesVersion'] == $wo['config']['version']) {
    die("Your website is already updated to {$versionToUpdate}, nothing to do.");
}
if ($wo['config']['version'] == $versionToUpdate && $wo['config']['filesVersion'] != $wo['config']['version']) {
    die("Your website is database is updated to {$versionToUpdate}, but files are not uploaded, please upload all the files and make sure to use SFTP, all files should be overwritten.");
}
if ($wo['config']['version'] > $olderVersion) {
    die("Please update to {$olderVersion} first version by version, your current version is: " . $wo['config']['version']);
}

ini_set('max_execution_time', 0);
function check_($check)
{
    $siteurl           = urlencode(getBaseUrl());
    $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false
        )
    );
    $file              = file_get_contents('http://www.wowonder.com/purchase.php?code=' . $check . '&url=' . $siteurl, false, stream_context_create($arrContextOptions));
    if ($file) {
        $check = json_decode($file, true);
    } else {
        $check = array(
            'status' => 'SUCCESS',
            'url' => $siteurl,
            'code' => $check
        );
    }
    return $check;
}
$updated = false;

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }
    if (!is_dir($dir)) {
        return unlink($dir);
    }
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }
        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }
    return rmdir($dir);
}
function updateLangs($lang) {
    global $sqlConnect;
    if (!file_exists("update_langs/{$lang}.txt")) {
        $filename = "update_langs/unknown.txt";
    } else {
        $filename = "update_langs/{$lang}.txt";
    }
    // Temporary variable, used to store current query
    $templine = '';
    // Read in entire file
    $lines    = file($filename);
    // Loop through each line
    foreach ($lines as $line) {
        // Skip it if it's a comment
        if (substr($line, 0, 2) == '--' || $line == '')
            continue;
        // Add this line to the current segment
        $templine .= $line;
        $query = false;
        // If it has a semicolon at the end, it's the end of the query
        if (substr(trim($line), -1, 1) == ';') {
            // Perform the query
            $templine = str_replace('`{unknown}`', "`{$lang}`", $templine);
            //echo $templine;
            $query    = mysqli_query($sqlConnect, $templine);
            // Reset temp variable to empty
            $templine = '';
        }
    }
}

if (!empty($_GET['updated'])) {
    $updated = true;
}
if (!empty($_POST['code'])) {
    $code = check_($_POST['code']);
    if ($code['status'] == 'SUCCESS') {
        $data['status'] = 200;
    } else {
        $data['status'] = 400;
        $data['error']  = $code['ERROR_NAME'];
    }
    header("Content-type: application/json");
    echo json_encode($data);
    exit();
}
if (!empty($_POST['query'])) {
    $query = mysqli_query($sqlConnect, base64_decode($_POST['query']));
    if ($query) {
        $data['status'] = 200;
    } else {
        $data['status'] = 400;
        $data['error']  = mysqli_error($sqlConnect);
    }
    header("Content-type: application/json");
    echo json_encode($data);
    exit();
}
if (!empty($_POST['update_langs'])) {
    $data  = array();
    $query = mysqli_query($sqlConnect, "SHOW COLUMNS FROM `Wo_Langs`");
    while ($fetched_data = mysqli_fetch_assoc($query)) {
        $data[] = $fetched_data['Field'];
    }
    unset($data[0]);
    unset($data[1]);
    unset($data[2]);
    $lang_update_queries = array();
    foreach ($data as $key => $value) {
        updateLangs($value);
    }
    deleteDirectory("update_langs");
    foreach ($all_langs as $key2 => $value2) {
        $count = $db->where('lang_name',strtolower($value2))->getValue(T_LANG_ISO,'COUNT(*)');
        if ($count == 0) {
            $db->insert(T_LANG_ISO,[
                'lang_name' => strtolower($value2),
                'direction' => 'ltr'
            ]);
        }
    }
    
    $info = $db->get(T_LANG_ISO);
    $rtl_langs           = array(
        "arabic",
        "urdu",
        "hebrew",
        "persian"
    );
    foreach ($info as $key => $value) {
        if (in_array(strtolower($value->lang_name), $rtl_langs)) {
            $db->where('id',$value->id)->update(T_LANG_ISO,array('direction' => 'rtl'));
        }
        else{
            $db->where('id',$value->id)->update(T_LANG_ISO,array('direction' => 'ltr'));
        }
    }
    
    $info = $db->get(T_MANAGE_PRO);
    
    foreach ($info as $key => $value) {
        $features = json_decode($value->features,true);
        $features['can_use_ai_image'] = 1;
        $features['can_use_ai_post'] = 1;
        $features['can_use_ai_user'] = 1;
        $features['can_use_ai_blog'] = 1;
        $db->where('id',$value->id)->update(T_MANAGE_PRO,['features' => json_encode($features)]);
    }
    $db->where('name', 'version')->update(T_CONFIG, ['value' => $versionToUpdate]);
    $name = md5(microtime()) . '_updated.php';
    rename('update.php', $name);
}
?>
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Updating WoWonder</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      <style>
         @import url('https://fonts.googleapis.com/css?family=Roboto:400,500');
         @media print {
            .wo_update_changelog {max-height: none !important; min-height: !important}
            .btn, .hide_print, .setting-well h4 {display:none;}
         }
         * {outline: none !important;}
         body {background: #f3f3f3;font-family: 'Roboto', sans-serif;}
         .light {font-weight: 400;}
         .bold {font-weight: 500;}
         .btn {height: 52px;line-height: 1;font-size: 16px;transition: all 0.3s;border-radius: 2em;font-weight: 500;padding: 0 28px;letter-spacing: .5px;}
         .btn svg {margin-left: 10px;margin-top: -2px;transition: all 0.3s;vertical-align: middle;}
         .btn:hover svg {-webkit-transform: translateX(3px);-moz-transform: translateX(3px);-ms-transform: translateX(3px);-o-transform: translateX(3px);transform: translateX(3px);}
         .btn-main {color: #ffffff;background-color: #a84849;border-color: #a84849;}
         .btn-main:disabled, .btn-main:focus {color: #fff;}
         .btn-main:hover {color: #ffffff;background-color: #c45a5b;border-color: #c45a5b;box-shadow: -2px 2px 14px rgba(168, 72, 73, 0.35);}
         svg {vertical-align: middle;}
         .main {color: #a84849;}
         .wo_update_changelog {
          border: 1px solid #eee;
          padding: 10px !important;
         }
         .content-container {display: -webkit-box; width: 100%;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-flex-direction: column;flex-direction: column;min-height: 100vh;position: relative;}
         .content-container:before, .content-container:after {-webkit-box-flex: 1;box-flex: 1;-webkit-flex-grow: 1;flex-grow: 1;content: '';display: block;height: 50px;}
         .wo_install_wiz {position: relative;background-color: white;box-shadow: 0 1px 15px 2px rgba(0, 0, 0, 0.1);border-radius: 10px;padding: 20px 30px;border-top: 1px solid rgba(0, 0, 0, 0.04);}
         .wo_install_wiz h2 {margin-top: 10px;margin-bottom: 30px;display: flex;align-items: center;}
         .wo_install_wiz h2 span {margin-left: auto;font-size: 15px;}
         .wo_update_changelog {padding:0;list-style-type: none;margin-bottom: 15px;max-height: 440px;overflow-y: auto; min-height: 440px;}
         .wo_update_changelog li {margin-bottom:7px; max-height: 20px; overflow: hidden;}
         .wo_update_changelog li span {padding: 2px 7px;font-size: 12px;margin-right: 4px;border-radius: 2px;}
         .wo_update_changelog li span.added {background-color: #4CAF50;color: white;}
         .wo_update_changelog li span.changed {background-color: #e62117;color: white;}
         .wo_update_changelog li span.improved {background-color: #9C27B0;color: white;}
         .wo_update_changelog li span.compressed {background-color: #795548;color: white;}
         .wo_update_changelog li span.fixed {background-color: #2196F3;color: white;}
         input.form-control {background-color: #f4f4f4;border: 0;border-radius: 2em;height: 40px;padding: 3px 14px;color: #383838;transition: all 0.2s;}
input.form-control:hover {background-color: #e9e9e9;}
input.form-control:focus {background: #fff;box-shadow: 0 0 0 1.5px #a84849;}
         .empty_state {margin-top: 80px;margin-bottom: 80px;font-weight: 500;color: #6d6d6d;display: block;text-align: center;}
         .checkmark__circle {stroke-dasharray: 166;stroke-dashoffset: 166;stroke-width: 2;stroke-miterlimit: 10;stroke: #7ac142;fill: none;animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;}
         .checkmark {width: 80px;height: 80px; border-radius: 50%;display: block;stroke-width: 3;stroke: #fff;stroke-miterlimit: 10;margin: 100px auto 50px;box-shadow: inset 0px 0px 0px #7ac142;animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;}
         .checkmark__check {transform-origin: 50% 50%;stroke-dasharray: 48;stroke-dashoffset: 48;animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;}
         @keyframes stroke { 100% {stroke-dashoffset: 0;}}
         @keyframes scale {0%, 100% {transform: none;}  50% {transform: scale3d(1.1, 1.1, 1); }}
         @keyframes fill { 100% {box-shadow: inset 0px 0px 0px 54px #7ac142; }}
      </style>
   </head>
   <body>
      <div class="content-container container">
         <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-10">
               <div class="wo_install_wiz">
                 <?php if ($updated == false) { ?>
                  <div>
                     <h2 class="light">Update to v<?php echo $versionToUpdate;?></span></h2>
                     <div class="setting-well">
                        <h4>Changelog</h4>
                        <ul class="wo_update_changelog">
                        <li> [Added] new theme, updated sunshine to v2 completely.</li>
                              <li> [Added] AI image generation system, now users can generate images directly and post them.</li>
                              <li> [Added] AI post and text generation system, now users can generate texts and post ideas directly and post them.</li>
                              <li> [Added] AI article generation system, now users can generate articles in blog system.</li>
                              <li> [Added] AI image editing system, users can edit their avatar and cover as they want using text promots.</li>
                              <li> [Added] AI system using credit system, charge your website's users for each image, text generated.</li>
                              <li> [Added] google authentication for two authentication system.</li>
                              <li> [Added] authy authentication for two authentication system.</li>
                              <li> [Added] Braintree payment gateway.</li>
                              <li> [Added] new APIs.</li>
                              <li> [Added] username restriction, disallow and band usernames.</li>
                              <li> [Added] photo quailty option in admin panel.</li>
                              <li> [Added] the ability to enable or disable start up page. </li>
                              <li> [Added] the ability to choose RTL lang from admin panel.</li>
                              <li> [Added] support for PHP v8.2</li>
                              <li> [Updated] text editors.</li>
                              <li> [Fixed] 10+ API issues.</li>
                              <li> [Fixed] sitemap system generating more than 50K element in one file.</li>
                              <li> [Fixed] Yoomoney payment not funding.</li>
                              <li> [Fixed] text editor can't add images in edit terms or edit pages in admin panel.</li>
                              <li> [Fixed] filter by active users in Admin > Manage Users not working.</li>
                              <li> [Fixed] Moderator cannot edit languages.</li>
                              <li> [Fixed] disabling blog system still showing create article link in header.</li>
                              <li> [Fixed] Google Vision API not working if posting an album.</li>
                              <li> [Fixed] video is no auto pausing if you scroll down to other posts. </li>
                              <li> [Fixed] banned user's posts still showing on hashtag page.</li>
                              <li> [Fixed] if the hashtag has capital letter it makes it an entirely different hashtag.</li>
                              <li> [Fixed] broken datepicker in settings page.</li>
                              <li> [Fixed] Invitation codes can not be generated in admin panel.</li>
                              <li> [Fixed] /movies/watch url returning 404 page.</li>
                              <li> [Fixed] when you create a fake user, and login in using the fake user info, you'll go to 404 and can't login in</li>
                              <li> [Fixed] can't upload SVG images from edit or add reactions from admin panel.</li>
                              <li> [Fixed] openweathermap API call, now it's all paid.</li>
                              <li> [Fixed] The pro membership levels are still showing the old names on the dashboard even after changing all the names.</li>
                              <li> [Fixed] ReCAPTCHA is not showing on first visit to contact us page, if you refresh the page it will be showing then.</li>
                              <li> [Fixed] Google Translation is not working.</li>
                              <li> [Fixed] The notification sound is not working with Ajax. </li>
                              <li> [Fixed] can't logout using nginx.</li>
                              <li> [Fixed] all emails are being sent like mime format.</li>
                              <li> [Fixed] Events that have been finished, shouldn’t be open to join.</li>
                              <li> [Fixed] If you want to make a user Admin of your page, Privileges can not be changed for that user. The button is not working</li>
                              <li> [Fixed] 1 security issue.</li>
                              <li> [Fixed] 20+ more minor bugs.</li>
                        </ul>
                        <p class="hide_print">Note: The update process might take few minutes.</p>
                        <p class="hide_print">Important: If you got any fail queries, please copy them, open a support ticket and send us the details.</p>
                        <p class="hide_print">Most of the features are disabled by default, you can enable them from Admin -> Manage Features -> Enable / Disable Features, reaction can be enabled from Settings > Posts Sttings.</p><br>
                        <p class="hide_print">Please enter your valid purchase code:</p>
                        <input type="text" id="input_code" class="form-control" placeholder="Your Envato purchase code" style="padding: 10px; width: 50%;"><br>

                        <br>
                             <button class="pull-right btn btn-default" onclick="window.print();">Share Log</button>
                             <button type="button" class="btn btn-main" id="button-update" disabled>
                             Update
                             <svg viewBox="0 0 19 14" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                <path fill="currentColor" d="M18.6 6.9v-.5l-6-6c-.3-.3-.9-.3-1.2 0-.3.3-.3.9 0 1.2l5 5H1c-.5 0-.9.4-.9.9s.4.8.9.8h14.4l-4 4.1c-.3.3-.3.9 0 1.2.2.2.4.2.6.2.2 0 .4-.1.6-.2l5.2-5.2h.2c.5 0 .8-.4.8-.8 0-.3 0-.5-.2-.7z"></path>
                             </svg>
                          </button>
                     </div>
                     <?php }?>
                     <?php if ($updated == true) { ?>
                      <div>
                        <div class="empty_state">
                           <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                           </svg>
                           <p>Congratulations, you have successfully updated your site. Thanks for choosing WoWonder.</p>
                           <br>
                           <a href="<?php echo $wo['config']['site_url'] ?>" class="btn btn-main" style="line-height:50px;">Home</a>
                        </div>
                     </div>
                     <?php }?>
                  </div>
               </div>
            </div>
            <div class="col-md-1"></div>
         </div>
      </div>
   </body>
</html>
<script>
var queries = [
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'images_quality', '90');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'reserved_usernames_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'reserved_usernames', 'maintenance,get_news_feed,video-call,video-call-api,home,welcome,register,confirm-sms,confirm-sms-password,forgot-password,reset-password,start-up,activate,search,timeline,pages,suggested-pages,liked-pages,joined_groups,go-pro,page,poke,most_liked,groups,suggested-groups,group,create-group,group-setting,create-page,setting,page-setting,messages,logout,404,post,game,games,new-game,saved-posts,hashtag,terms,albums,album,create-album,contact-us,user-activation,upgraded,oops,boosted-pages,boosted-posts,new-product,edit-product,products,my-products,site-pages,blogs,my-blogs,create-blog,read-blog,edit-blog,blog-category,forum,forum-members,forum-members-byname,forum-events,forum-search,forum-search-result,forum-help,forums,forumaddthred,showthread,threadreply,threadquote,editreply,deletereply,mythreads,mymessages,edithread,deletethread,create-event,edit-event,events,events-going,events-interested,events-past,show-event,events-invited,my-events,oauth,app_api,authorize,app-setting,developers,create-app,app,apps,sharer,movies,movies-genre,movies-country,watch-film,advertise,wallet,send_money,create-ads,edit-ads,chart-ads,manage-ads,create-status,friends-nearby,more-status,unusual-login,jobs,common_things,funding,my_funding,create_funding,edit_fund,show_fund,memories,refund,offers,nearby_shops,nearby_business,live,checkout,purchased,customer_order,orders,order,reviews,open_to_work_posts,withdrawal,explore');",
    "ALTER TABLE `Wo_LangIso` ADD COLUMN `direction` VARCHAR(50) NOT NULL DEFAULT 'ltr' AFTER `image`;",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'tiktok_login', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'tiktok_client_key', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'tiktok_client_secret', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'disable_start_up', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_image_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'replicate_token', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'openai_token', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_post_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_user_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'images_ai', 'openai');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'post_ai', 'openai');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'user_ai', 'openai');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'openai_text_model', 'gpt-3.5-turbo');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'midjeourny_model', 'prompthero-openjourney');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'num_inference_steps', '1');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'guidance_scale', '1');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'seed', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'scheduler', 'DPMSolverMultistep');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'prompt_strength', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'negative_prompt', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_image_use', 'all');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_post_use', 'all');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_user_use', 'all');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'generated_image_price', '10');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'credit_price', '100');",
    "ALTER TABLE `Wo_Manage_Pro` ALTER COLUMN `features` SET DEFAULT '{\"can_use_funding\":1,\"can_use_jobs\":1,\"can_use_games\":1,\"can_use_market\":1,\"can_use_events\":1,\"can_use_forum\":1,\"can_use_groups\":1,\"can_use_pages\":1,\"can_use_audio_call\":1,\"can_use_video_call\":1,\"can_use_offer\":1,\"can_use_blog\":1,\"can_use_movies\":1,\"can_use_story\":1,\"can_use_stickers\":1,\"can_use_gif\":1,\"can_use_gift\":1,\"can_use_nearby\":1,\"can_use_video_upload\":1,\"can_use_audio_upload\":1,\"can_use_shout_box\":1,\"can_use_colored_posts\":1,\"can_use_poll\":1,\"can_use_live\":1,\"can_use_background\":1,\"can_use_chat\":1,\"can_use_ai_image\":1,\"can_use_ai_post\":1,\"can_use_ai_user\":1,\"can_use_ai_blog\":1}';",
    "ALTER TABLE `Wo_Users` ADD COLUMN `credits` FLOAT(11) NULL DEFAULT '0' AFTER `banned_reason`;",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'images_credit_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'text_credit_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'generated_word_price', '1');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_blog_system', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'ai_blog_use', 'all');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'blog_ai', 'openai');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_payment', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_mode', 'sandbox');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_merchant_id', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_public_key', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_private_key', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'braintree_token', '');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'google_authenticator', '0');",
    "ALTER TABLE `Wo_Users` ADD COLUMN `two_factor_method` VARCHAR(50) NOT NULL DEFAULT 'two_factor' AFTER `credits`;",
    "ALTER TABLE `Wo_Users` ADD COLUMN `google_secret` VARCHAR(100) NOT NULL DEFAULT '' AFTER `credits`;",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'authy_settings', '0');",
    "INSERT INTO `Wo_Config` (`id`, `name`, `value`) VALUES (null, 'authy_token', '');",
    "ALTER TABLE `Wo_Users` ADD COLUMN `authy_id` VARCHAR(100) NOT NULL DEFAULT '' AFTER `credits`;",
    "ALTER TABLE `Wo_Posts` ADD COLUMN `ai_post` INT(2) UNSIGNED NULL DEFAULT '0' AFTER `processing`;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/EAufYfaIkYQEsYzwvZha_01_4bafb7db09656e1ecb54d195b26be5c3_file.svg' WHERE `id` = 1;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/2MRRkhb7rDhUNuClfOfc_01_76c3c700064cfaef049d0bb983655cd4_file.svg' WHERE `id` = 2;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/D91CP5YFfv74GVAbYtT7_01_288940ae12acf0198d590acbf11efae0_file.svg' WHERE `id` = 3;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/cFNOXZB1XeWRSdXXEdlx_01_7d9c4adcbe750bfc8e864c69cbed3daf_file.svg' WHERE `id` = 4;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/yKmDaNA7DpA7RkCRdoM6_01_eb391ca40102606b78fef1eb70ce3c0f_file.svg' WHERE `id` = 5;",
    "UPDATE `Wo_Reactions_Types` SET `sunshine_icon` = 'upload/files/2022/09/iZcVfFlay3gkABhEhtVC_01_771d67d0b8ae8720f7775be3a0cfb51a_file.svg' WHERE `id` = 6;",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_use_affiliate');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'username_is_disallowed');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generate_ai_image');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'enter_prompt');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generate');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'starting');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'succeeded');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'processing');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generate_ai_post');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generated_post');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_generate_and_draw');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'convert_avatar_image');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'convert_cover_image');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_use_ai_image');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_use_ai_post');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_use_ai_user');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'buy_credit');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'image_price');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'credit');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'available_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'min_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'you_dont_have_enough_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'not_enough_wallet_to_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'text_price');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'you_dont_have_enough_credits_text');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'max_result_length');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'available_words_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'max_allowed_words');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'images_count');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'available_images_credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'create_new_article_ai');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'describe_article');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'can_use_ai_blog');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'braintree');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'use_authy_app');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'use_google_authenticator_app');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'google_authenticator');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authy_app');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'two_factor_method');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authenticator_download');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authenticator_set');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authenticator_verify');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authenticator_otp');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'confirm_code');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'empty_code');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'select_two_factor_method');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'wrong_confirm_code');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'two_auth_currenly_enabled');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'deactivate');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authy_register');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'country_code');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'empty_email');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'empty_phone');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'empty_country_code');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'authy_registered');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'sms');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'register_here');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'if_you_dont_account');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'welcome_connect_friends');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'welcome_share_new_text');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'if_you_have_account');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'login_here');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'trendings');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'drag_drop_files');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'drag_browse');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'sypnosis');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'job_overview');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'job_detail');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'show_to');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'regenerate');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generate_using_ai');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'generate_thumbnail');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'download_backup_codes');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'enter_username');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'enter_password');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'max_result_length_blog');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'unsave_post_tx');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'use_text');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'credits');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'ai_credit_purchase');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'tell_me_a_joke');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'ai');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'content_generated_ai');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'equals_to');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'thumbnail_based_content');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'send_gift_user_desc');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'image_size');",
    "INSERT INTO `Wo_Langs` (`id`, `lang_key`) VALUES (NULL, 'ai_words');",

];

$('#input_code').bind("paste keyup input propertychange", function(e) {
    if (isPurchaseCode($(this).val())) {
        $('#button-update').removeAttr('disabled');
    } else {
        $('#button-update').attr('disabled', 'true');
    }
});

function isPurchaseCode(str) {
    var patt = new RegExp("(.*)-(.*)-(.*)-(.*)-(.*)");
    var res = patt.test(str);
    if (res) {
        return true;
    }
    return false;
}

$(document).on('click', '#button-update', function(event) {
    if ($('body').attr('data-update') == 'true') {
        window.location.href = '<?php echo $wo['config']['site_url']?>';
        return false;
    }
    $(this).attr('disabled', true);
    var PurchaseCode = $('#input_code').val();
    $.post('?check', {code: PurchaseCode}, function(data, textStatus, xhr) {
        if (data.status == 200) {
            $('.wo_update_changelog').html('');
            $('.wo_update_changelog').css({
                background: '#1e2321',
                color: '#fff'
            });
            $('.setting-well h4').text('Updating..');
            $(this).attr('disabled', true);
            RunQuery();
        } else {
            $(this).removeAttr('disabled');
            alert(data.error);
        }
    });
});

var queriesLength = queries.length;
var query = queries[0];
var count = 0;
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
function RunQuery() {
    var query = queries[count];
    $.post('?update', {
        query: b64EncodeUnicode(query)
    }, function(data, textStatus, xhr) {
        if (data.status == 200) {
            $('.wo_update_changelog').append('<li><span class="added">SUCCESS</span> ~$ mysql > ' + query + '</li>');
        } else {
            $('.wo_update_changelog').append('<li><span class="changed">FAILED</span> ~$ mysql > ' + query + '</li>');
        }
        count = count + 1;
        if (queriesLength > count) {
            setTimeout(function() {
                RunQuery();
            }, 1500);
        } else {
            $('.wo_update_changelog').append('<li><span class="added">Updating & Adding Langauges</span> ~$ languages.sh, Please wait, this might take some time..</li>');
            $.post('?run_lang', {
                update_langs: 'true'
            }, function(data, textStatus, xhr) {
              $('.wo_update_changelog').append('<li><span class="fixed">Finished!</span> ~$ Congratulations! you have successfully updated your site. Thanks for choosing WoWonder.</li>');
              $('.setting-well h4').text('Update Log');
              $('#button-update').html('Home <svg viewBox="0 0 19 14" xmlns="http://www.w3.org/2000/svg" width="18" height="18"> <path fill="currentColor" d="M18.6 6.9v-.5l-6-6c-.3-.3-.9-.3-1.2 0-.3.3-.3.9 0 1.2l5 5H1c-.5 0-.9.4-.9.9s.4.8.9.8h14.4l-4 4.1c-.3.3-.3.9 0 1.2.2.2.4.2.6.2.2 0 .4-.1.6-.2l5.2-5.2h.2c.5 0 .8-.4.8-.8 0-.3 0-.5-.2-.7z"></path> </svg>');
              $('#button-update').attr('disabled', false);
              $(".wo_update_changelog").scrollTop($(".wo_update_changelog")[0].scrollHeight);
              $('body').attr('data-update', 'true');
            });
        }
        $(".wo_update_changelog").scrollTop($(".wo_update_changelog")[0].scrollHeight);
    });
}
</script>

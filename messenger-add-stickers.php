<?php

/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung


Copyright 2019 by Vanea Young 

--------------------------------
2020 - Modified for WoWonder

*/
					        


require_once('assets/init.php');
 
try {
  
	// build engine
	$core = new VY_CORE;
 
	if ($_SERVER['REQUEST_METHOD'] != "POST") {
    ?>
	
	
	
	<html>
	<title>Add stickers for messenger</title>
	<body style="background:#f8f8f8;margin:0 auto;">
	
	<div class="page_c <?php if (isset($_GET['a']) && $_GET['a'] == 'add') echo 'add';?>">
		<center>
		
		
		
		
		<?php 
		
	}
		$now = time();
		if(isset($_GET['a']) && $_GET['a'] == 'delete'){
			
 function deleteDir($dirPath) {
   // if (! is_dir($dirPath)) {
   //     throw new InvalidArgumentException("$dirPath must be a directory");
   // }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
        $dirPath .= '/';
    }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {
            deleteDir($file);
        } else {
            unlink($file);
        }
    }
    rmdir($dirPath);
}
			
			
			$id = $_GET['id'];
			//$q = $core->query_select("select `filename` from ".tbl_msg_stickers." where `stickers_id`='{$id}'");
			
			//foreach($q as $r):
			
				deleteDir("stickers/".$id);
			$delete = $core->query_delete("delete from ".tbl_msg_stickers." where `stickers_id`='{$id}'");
			$delete = $core->query_delete("delete from ".tbl_msg_stickers_store." where `id`='{$id}'");
			
			
			if($delete)
				header("location: ".$_SERVER['PHP_SELF']);
			
			//endforeach;
			
			
			
		}else 
		
		if(isset($_POST['a']) && $_POST['a'] == 'add-sticker-store'){
		
		
		$name = $_POST['name'];
		
		$id = $core->query_insert("insert into ".tbl_msg_stickers_store." set `title`='{$name}',`added`='{$now}'");
		
		echo $id;
		
		}else if(isset($_POST['a']) && $_POST['a'] == 'upload'){
			




	
	$id = $_POST['id'];
	
	
	$res = array("success" => 0);
 
	
   
    $max_file_size = 1048576 * 40;
    $dir = 'stickers/'.$id.'/';



    // generate dir by user id
    if (!file_exists($dir))
    mkdir($dir, 0777, true);


	
	// SET THE DESTINATION FOLDER
	$source = $_FILES["files"]["tmp_name"];
	$filename = $_FILES["files"]["name"];


 
	$temp    = explode('.', $filename);
	$fileExt = end($temp);
	$newName = basename(mt_rand().mt_rand().mt_rand() . '.' . $fileExt);
	$filename = $dir.$newName;

// CHECK IF FILE ALREADY EXIST
$res['msg'] = 'OK';
 

 


// FILE SIZE CHECK - 1,000,000 = 1MB
// TAKE NOTE THAT THE SETTINGS IN PHP.INI WILL STILL TAKE PRECEDENCE
if ($res['msg'] == "OK") {
  if ($_FILES["files"]["size"] > 1950000000) {
    $res['msg'] = $_FILES["files"]["name"] . " - file size too big!";
  }
}

// ALL CHECKS OK - MOVE FILE
if ($res['msg'] == "OK") {
  if (!move_uploaded_file($source, $filename)) {
    $res['msg'] = "Error moving $source to $destination";
  }
}

 
 
		    $id = $core->query_insert("insert into ".tbl_msg_stickers." set `filename` = '{$newName}', `stickers_id`='{$id}'");

			if (!$id) {
				unlink($filename);
				$res['msg'] = 'SQL Error.';
			} else {
				$res['id'] = $id;
				$res['url'] = $filename;
				$res['msg'] = 'OK';
			} 
 
 
  // UPLOAD OK - DO SOMETHING
  echo json_encode($res);









		
		}else if(isset($_GET['a']) && $_GET['a'] == 'add'){
			
			
			?>
			
			
			<h1>Add new stickers</h1>
			
			<div id="sticker-name"><input type="text" id="name" style="padding: 7px 16px;width: 100%;margin-bottom:20px;border-radius: 4px;border: 1px solid #999;font-size: 16px;" name="stickers-name" placeholder="Enter the stickers package name" /></div>
			
			 <fieldset class="js-stickers-store-id" id="add-files" style="display:none;width: 100%;box-sizing: border-box;"> <legend>Choose multiple files:</legend><input multiple="true" onchange="upload(event,this);" type="file" accept="image/*" /> </fieldset>
			
			<div><button id="submit-btn" onclick="addstickers(this,event);">Submit</button></div>
			
			<div id="upload-complete"></div>
			<p>
			
				<ul id="uploads"></ul>
			
			</p>
			
			<?php
			
			
			
		} else {
			
			
			?>
			
			
			
			<h1>Current available stickers ( <a href="?a=add">Add New</a> )</h1>


<table class="pure-table">
    <thead>
        <tr>
            <th>#id</th>
            <th>Name</th>
			<th>Count</th>
            <th>Added</th>
			<th>Delete</th>
        </tr>
    </thead>

    <tbody>


 

			
			<?php
function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' ago' : 'just now';
}
			$q = $core->query_select("select s1.*, (select count(*) from ".tbl_msg_stickers." where `stickers_id`=s1.id) as count from ".tbl_msg_stickers_store." s1 order by s1.id desc");
			
			if(count($q)){
				
				
				foreach($q as $r){
					
					?>        <tr>
            <td><?php echo $r['id'];?></td>
            <td><?php echo $r['title'];?></td>
			<td><?php echo $r['count'];?></td>
			<td><?php echo time_elapsed_string('@'.$r['added']);?></td>
			<td><a href="?a=delete&id=<?php echo $r['id'];?>">Delete</a></td>
        </tr><?php
					
					
					
				}
				
				
			} else {
				
				echo 'You dose not have stickers.';
			}
			
			?>
			
			
			
			
			
			
			
    </tbody>
</table>
			<?php
			
		}
		
		if ($_SERVER['REQUEST_METHOD'] != "POST") {
		?>
		
		</center>
	</div>
	
	
	
	
	</body>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script>
	var FILE_URL = "<?php echo $_SERVER['PHP_SELF'];?>";
	
	function addstickers(el,evt){
		
		evt.preventDefault();
		
		var name = $('#name').val();
		
		if(!name || !$.trim(name)){
			
			return alert('Please enter name');
			
		}
		
  $.post(FILE_URL,
  {
    a: "add-sticker-store",
    name: name
  },
  function(data, status){
	  
	  if(data <= 0)
		alert("Error! Data: " + data + "\nStatus: " + status);
	else{
		
		$('#sticker-name').hide();
		$('#add-files').attr('id',data).show();
		$('#submit-btn').hide();
	}
		
  });
		
		
	}
function validateJson(str, no_err) {
    try {
        var json = JSON.parse(str);

        if(typeof json.hasOwnProperty('status'))
            if(json.status === 'require_login')
                window.location.reload();


        return json;
    } catch (e) {
        if(!no_err) {
            console.log(str);

            //if(!dev_enabled) setTimeout(function(){window.location.reload()},500);
        } //' + lang.somethingWrong);
        return false;
    }
}

	function upload(ev,el){
	
	
	
	
	var input = $(ev.target);
	var files = input[0].files;
 
	
	
	var allowed = ['JPG','JPEG','PNG','GIF','WEBP','TIFF','BMP','ICO','PJP','SVG','TIF'];
    var count = 0;
	var totalFiles = files.length;
	var content = $('#uploads');
	
	
			for(var i = 0; i < files.length; i++) {
				var file_ext = files[i].name.split('.').pop().toUpperCase();
				
				if($.inArray(file_ext, allowed) == -1 && $.trim(file_ext)) {
					evstop(ev);
 
					return alert('Allowed types are '+allowed.join(','));
				}
				
				content.prepend('<li><div id="sticker_uploading_'+i+'" class="sticker_uploading"><img id="sticker_id_'+i+'" /><div class="upload_info"><div class="filename">'+files[i].name+'</div><div class="uploading-line js-uploading-line"></div></div></li>');
				 
			}
 
    var trigger_upload = function() {
		
		
		
		
		
		
		
		
 
		var container = content.find('#sticker_uploading_' + count);
		 
        if(typeof files[count] === 'undefined' || count > totalFiles - 1) {
			$('#upload-complete').html('<h2>Upload Complete! <a href="'+FILE_URL+'">Take me to home.</a></h2>');
            return false;
			
		}

 
		
        var formData = new FormData();
        formData.append('files', files[count]);
        formData.append('a', 'upload');
		formData.append('id', $('.js-stickers-store-id').attr('id'));

        $.ajax({
            url: FILE_URL,
            type: 'POST',
            xhr: function() { // Custom XMLHttpRequest
                var Xhr = $.ajaxSettings.xhr();
                if(Xhr.upload) { // Check if upload property exists
                    Xhr.upload.addEventListener('progress', function(e) {
                        var p_cont = container.find('.js-uploading-line');
                        if(e.lengthComputable) {
                            var p_percentage = Math.round((e.loaded / e.total) * 100);
                            p_cont.css('width', p_percentage + '%');
                        }
                    }, false); // For handling the progress of the upload
                }
                return Xhr;
            },
            //Ajax events
            beforeSend: function() {
                //readAttach(count);
            },
            success: function(data) {  
                var response = validateJson(data);
                if(response['msg'] === 'OK') {
                   
                    var u_image = container.find('#sticker_id_'+count);
					u_image.attr({'src':'/'+response.url}); 
				//	container.find('.js-uploading-line').remove();
 
					count++;
                    setTimeout(function() {
                        trigger_upload();
                    }, 50);
                } else return displayErr(response['msg']);
            },
            error: function() {
                return displayErr('Something was wrong while processing your upload. Please try again.')
            },
            // Form data
            data: formData,
            // Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
		
	    }
		
		trigger_upload();
		
	}
	
	
	</script>
	
	<style>
.page_c {
    width: 960px;
    margin: 0 auto;
}

.page_c.add{width:360px!important;}
		ul {
		  list-style: none;
		  margin: 0;
		  padding: 0;
		}
	ul#uploads li {
    margin-top: 10px;
}
.sticker_uploading {
    display: flex;
    align-items: center;
}
.sticker_uploading img {
    width: 48px;
    height: 48px;
    background: #ddd;
    flex: none;
    object-fit: cover;
}.sticker_uploading .filename {
    font-size: 16px;
    padding: 8px 0;
}.uploading-line {
    background: #4cb715;
    width: 0%;
	float: left;
    height: 4px;
}.upload_info {
    margin-left: 16px;
    width: 100%;
}
.pure-table {
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    border: 1px solid #cbcbcb;
}.pure-table thead {
    background-color: #e0e0e0;
    color: #000;
    text-align: left;
    vertical-align: bottom;
}.pure-table td, .pure-table th {
    border-left: 1px solid #cbcbcb;
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible;
    padding: .5em 1em;
}.pure-table th, .pure-table td {
    padding: 0.5em 1em;
}
	</style>
	
	</html>
	
	
	
	
	
	<?php
	
		}
	
	
	
	
	
	
	
	
	
	
} catch (Exception $e) {
	print $e->getMessage();
}

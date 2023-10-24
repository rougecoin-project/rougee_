<?php

/*

Plugin Live Stream
email: movileanuion@gmail.com 
Copyright 2022 by Vanea Young 

*/

require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "config.php";
require_once dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "ssvgs.php";
if (!class_exists("Smarty")) {
    require_once dirname(__DIR__, 1) .
        DIRECTORY_SEPARATOR .
        "libraries/smarty-3.1.34/Smarty.class.php";
}
include dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "api.php";

class VY_LIVESTREAM_CORE
{
    public $db_path;
    public $db;
    public $USER;
    public $cronjob;
    public $settings;
    public $view_as_json;
    public $svg;
    public $upload_path_covers;
    public $upload_path_blobs;
    public $upload_path_products;

    // --------------------------- Connect to DATABASE ---------------------------------
    private function db_conn($encoding = "utf8")
    {
        global $sql_db_host, $sql_db_user, $sql_db_pass, $sql_db_name;
        try {
            $this->db = new mysqli(
                $sql_db_host,
                $sql_db_user,
                $sql_db_pass,
                $sql_db_name
            );

            if ($this->db->connect_errno > 0) {
                die(
                    "Unable to connect to database [" .
                        $this->db->connect_error .
                        "]"
                );
            } else {
                $this->db->set_charset("utf8mb4");
            }

            //register_shutdown_function([$this, 'autoclean']);

            return $this->db;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    } // END db_conn()

    // ------------------------------ RUN QUERIES --------------------------
    // for select
    public function query_select($query)
    {
        $result_array = [];
        $database = $this->db_conn();
        ($result = $database->query($query)) or die($database->error);
        if (!$result) {
            die("No disponible data to show. [ error: empty ]");
        }

        while ($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        }

        return $result_array;
    } // END run_query()

    // for insert
    public function query_insert($query)
    {
        $database = $this->db_conn("utf8mb4");
        ($query = $database->query($query)) or die($database->error);
        $insert_id = @mysqli_insert_id($database);
        if (!$insert_id) {
            die("An error occurred to insert data into database.");
        }

        return $insert_id;
    } // END run_query_insert()

    // for update
    public function query_update($query)
    {
        $database = $this->db_conn("utf8mb4");
        ($query = $database->query($query)) or die($database->error);
        if (!$query) {
            die("An error occurred to update data.");
        }

        return true;
    } // END run_query_update()

    // for delete
    public function query_delete($query)
    {
        $database = $this->db_conn();
        ($query = $database->query($query)) or die($database->error);
        if (!$query) {
            die("An error occurred to delete data from database.");
        }

        return true;
    } // END query_delete()

    public function __construct()
    {
        global $__svgI;

        $this->db_conn();
        $this->USER = [];
        $this->cronjob = [];

        if (
            isset($_COOKIE["pwa_login"]) &&
            !empty($_COOKIE["pwa_login"]) &&
            isset($_COOKIE["pwa_user_id"]) &&
            !empty($_COOKIE["pwa_user_id"])
        ) {
            $session_id = $_COOKIE["pwa_user_id"];
        } else {
            $session_id =
                !empty($_SESSION["user_id"]) && isset($_SESSION["user_id"])
                    ? $_SESSION["user_id"]
                    : $_COOKIE["user_id"];
        }

        $user_session = Wo_GetUserFromSessionID($session_id);

        $GLOBALS['V_Y']['user'] = Wo_UserData($user_session);
        $GLOBALS['V_Y']['user']['user_id'] = $GLOBALS['V_Y']['user']['id'];

        $this->USER = $GLOBALS['V_Y']['user'];
        $this->USER["id"] = $this->USER["user_id"];
        $this->USER["fullname"] = empty($this->USER["fist_name"])
            ? $this->USER["username"]
            : $this->USER["first_name"] . " " . $this->USER["last_name"];
        $this->USER["profile_photo"] = $this->USER["avatar"];
        $this->view_as_json =
            isset($_GET["view_as"]) || isset($_POST["view_as"]) ? true : false;
        $this->template = new Smarty();
        $this->theme_dir = getcwd() . "/vy-livestream/layout";
        $this->svg = $__svgI;
        $this->upload_path_covers =
            $GLOBALS['V_Y']["record"]["record_path"] . "/%s/covers/";
        $this->upload_path_blobs =
            $GLOBALS['V_Y']["record"]["record_path"] . "/%s/streams/";
        $this->upload_path_products =
            $GLOBALS['V_Y']["record"]["record_path"] . "/%s/products/";
        $this->recording = $GLOBALS['V_Y']["record"]["recording"];
        $this->settings = $GLOBALS['V_Y']["record"];

        // create user's upload dir
        # crete cover dir
        if (
            !file_exists(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_covers, $this->USER["id"])
            )
        ) {
            mkdir(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_covers, $this->USER["id"]),
                0755,
                true
            );
        }

        # crete stream dir
        if (
            !file_exists(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_blobs, $this->USER["id"])
            )
        ) {
            mkdir(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_blobs, $this->USER["id"]),
                0755,
                true
            );
        }
        # crete product files dir
        if (
            !file_exists(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_products, $this->USER["id"])
            )
        ) {
            mkdir(
                $_SERVER["DOCUMENT_ROOT"] .
                    DIRECTORY_SEPARATOR .
                    sprintf($this->upload_path_products, $this->USER["id"]),
                0755,
                true
            );
        }
        // require language file
        $global_language = "en";

        switch ($GLOBALS['V_Y']["user"]["language"]) {
            case "english":
                $global_language = "en";
                break;
            case "arabic":
                $global_language = "ab";
                break;
            case "german":
                $global_language = "de";
                break;
            case "spanish":
                $global_language = "es";
                break;
            case "french":
                $global_language = "fr";
                break;
            case "italian":
                $global_language = "it";
                break;
            case "dutch":
                $global_language = "nl";
                break;
            case "portuguese":
                $global_language = "pg";
                break;
            case "russian":
                $global_language = "ru";
                break;
            case "turkish":
                $global_language = "tr";
                break;
        }

        $vy_lv_language = include dirname(__DIR__, 1) .
            DIRECTORY_SEPARATOR .
            "lang/{$global_language}.php";

        // get site language
        foreach ($vy_lv_language as $key => $value) {
            $this->lang[$key] = $value;
        }

        // insert settings in db
        $lock_file = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "conf.lock";
        if (!file_exists($lock_file)) {
            $conf = $this->jencode($GLOBALS['V_Y']["record"]);

            $this->db->query("TRUNCATE TABLE " . VY_LV_TBL["CONF"]);

            // add settings
            if (
                $this->db->query(
                    "INSERT INTO " .
                        VY_LV_TBL["CONF"] .
                        " set `settings`='{$conf}'"
                )
            ) {
                $fp = fopen($lock_file, "wb");
                fwrite($fp, "Silence is golden");
                fclose($fp);
            }
        }
    } // END __construct()
    public function im_live()
    {
        return new LIVE_STREAM();
    }
    // escape input
    public function test_input($data, $no_escape = false)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $no_escape ? $data : $this->db->real_escape_string($data);
    }
    // escape for sql
    public function sql_escape($str)
    {
        return $this->db->real_escape_string($str);
    }
    public function getPage($content, $page = false)
    {
        if ($this->view_as_json) {
            return $this->jencode([
                "page" => $page ? $page : "",
                "content" => $content,
            ]);
        } else {
            return $content;
        }
    }
    public function isSecure()
    {
        return (isset($_SERVER["HTTPS"]) &&
            !empty($_SERVER["HTTPS"]) &&
            $_SERVER["HTTPS"] !== "off") ||
            $_SERVER["SERVER_PORT"] == 443;
    }
    public function getAvatar($avatar = "")
    {
        $m_avatar = Wo_GetMedia($avatar);
        if (!empty($m_avatar)) {
            return $m_avatar;
        } else {
            return "/" . $avatar;
        }
    }
    public function isarray($var)
    {
        return is_array($var) or $var instanceof Traversable;
    }
    public function post_vars($var, $no_test_input = false)
    {
        return isset($_POST[$var])
            ? ($no_test_input
                ? $_POST[$var]
                : $this->test_input($_POST[$var]))
            : false;
    }
    public function isLogged()
    {
        return !$GLOBALS['V_Y']["loggedin"] ? false : true;
    }
    public function lv_get_avatar($avatar = "")
    {
        $m_avatar = Wo_GetMedia($avatar);
        if (!empty($m_avatar)) {
            return $m_avatar;
        } else {
            return "/" . $avatar;
        }
    }
    public function jencode($d){
  /*  if (is_array($d) || is_object($d))
        foreach ($d as &$v) $v = $this->jencode($v);
    else
        return utf8_encode($d);
*/
    return json_encode($d,JSON_UNESCAPED_UNICODE);

    }
    protected function isJson($string) {
     json_decode($string);
     return (json_last_error() == JSON_ERROR_NONE);
    }
    public function get_full_url() {
        $https = !empty($_SERVER['HTTPS']) && strcasecmp($_SERVER['HTTPS'], 'on') === 0 ||
            !empty($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
            strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0;
        return
            ($https ? 'https://' : 'http://').
            (!empty($_SERVER['REMOTE_USER']) ? $_SERVER['REMOTE_USER'].'@' : '').
            (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : ($_SERVER['SERVER_NAME'].
                ($https && $_SERVER['SERVER_PORT'] === 443 ||
                $_SERVER['SERVER_PORT'] === 80 ? '' : ':'.$_SERVER['SERVER_PORT']))).
            substr($_SERVER['SCRIPT_NAME'],0, strrpos($_SERVER['SCRIPT_NAME'], '/'));
    }
    protected function get_server_var($id) {
        return @$_SERVER[$id];
    }
    protected function basename($filepath, $suffix = null) {
        $splited = preg_split('/\//', rtrim ($filepath, '/ '));
        return substr(basename('X'.$splited[count($splited)-1], $suffix), 1);
    }
    public function blueimpupload(){

        require_once "class.UploadHandler.php";
        new UploadHandler(array(
            'script_url' => $this->get_full_url().'/livestream/up',
            'upload_dir' => sprintf($this->upload_path_products, $this->USER["id"]),
            'upload_url' => $this->get_full_url() . DIRECTORY_SEPARATOR . sprintf($this->upload_path_products, $this->USER["id"]),
            'readfile_chunk_size' => 10000 * 1024 * 1024, // 10000 MiB
            'inline_file_types' => '/\.(gif|jpe?g|png|mp4)$/i',
            'accept_file_types' => '/\.(gif|jpe?g|png|mp4)$/i',
            'max_file_size' => 10000 * 1024 * 1024, // 10000 MiB
            'max_number_of_files' => null, // maximum number of files a user can upload.
            'replace_dots_in_filenames' => '_',
            'delete_type' => 'POST', 
            'thumbnail' => array(
                    // Uncomment the following to use a defined directory for the thumbnails
                    // instead of a subdirectory based on the version identifier.
                    // Make sure that this directory doesn't allow execution of files if you
                    // don't pose any restrictions on the type of uploaded files, e.g. by
                    // copying the .htaccess file from the files directory for Apache:
                    //'upload_dir' => dirname($this->get_server_var('SCRIPT_FILENAME')).'/thumb/',
                    //'upload_url' => $this->get_full_url().'/thumb/',
                    // Uncomment the following to force the max
                    // dimensions and e.g. create square thumbnails:
                    // 'auto_orient' => true,
                    // 'crop' => true,
                    // 'jpeg_quality' => 70,
                    // 'no_cache' => true, (there's a caching option, but this remembers thumbnail sizes from a previous action!)
                    // 'strip' => true, (this strips EXIF tags, such as geolocation)
                    'max_width' => 136, // either specify width, or set to 0. Then width is automatically adjusted - keeping aspect ratio to a specified max_height.
                    'max_height' => 136 // either specify height, or set to 0. Then height is automatically adjusted - keeping aspect ratio to a specified max_width.
                )
        ));

    }
    public function openUser(){
        
        $id = isset($_GET['id']) ? $this->test_input($_GET['id']) : '';
        
        if(is_numeric($id) && $id > 0){
            
            $q = $this->db->query("select `username` from ".VY_LV_TBL["USERS"]." where `user_id`='{$id}' limit 1");
            $r = $q->fetch_array(MYSQLI_ASSOC);
            $username = $r['username'];
            
            header("location: ".$this->get_full_url().'/'.$username);
            
        }
    }
    public function  mediaTimeDeFormater($seconds)
{
    if (!is_numeric($seconds))
        throw new Exception("Invalid Parameter Type!");


    $ret = "";

    $hours = (string )floor($seconds / 3600);
    $secs = (string )$seconds % 60;
    $mins = (string )floor(($seconds - ($hours * 3600)) / 60);

    if (strlen($hours) == 1)
        $hours = "0" . $hours;
    if (strlen($secs) == 1)
        $secs = "0" . $secs;
    if (strlen($mins) == 1)
        $mins = "0" . $mins;

    if ($hours == 0)
        $ret = "$mins:$secs";
    else
        $ret = "$hours:$mins:$secs";

    return $ret;
}
    public function _f404(){

        return $this->template->fetch($this->theme_dir . "/404.html");
    }
    public function blankimage(){

        return "data:image/png;base64,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";

    }
    public function rs_slider_video_blank(){

        return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAQ4B4ADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8rKKKKg1CiiigAooooAKKKKACiiigAooooAKKKKsAooooAKKKKCQooooAXJoyabupaA5gooooAXdRupKKCh9N20lLuqAHUUUUAFFFFADdtG2nUUAMop9N20AJRS7aSgAooooAKKKKACiiirAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKXbSUAFFFFABRRRQAUUUVYBRRRUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQAUUUUEhvo2UUb6BBRT6ZUDCiiirAKKKKgoKKKKsAooooAKKKKCRd1G2kpd1IoSil20lSAUUUVYBRRRQSFFFFBQUUUUAFFFFQAUUUUAFFFFABRRRQAUUUUAFFFFWSFFFFABRRRQUFFFFQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFBIUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFFABRRRVgFFFFABRRRQAUUUUEhRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFABRRRQSFFFFACbaWiigQUUUUDCiiigAooooAN9FFFAhd1JRRQWFLupKKAF3UbqSioAXdSUUUAP3/7NMopdtABto206igBlFPpu2gBKKXbRtoASil20baAEopdtG2gBKKfRQA3bRtp1FADdtG2nU3dQAbaNtG6jdQLQdRTd1G6gY6im7qN1ADqKbuo3UAOopu6jdQAbaNtG6jdQLQNtG2jdRuoDQNtJS7qdQMZRT9lN20AJRS7aSgAooooAKKKKACiiirAKKKKACiiigAooooJF3UbaSl3VBQlFGyirICiiigYUUUUFBRRRQAUUUUEhRRRQAb6NlFG+gQUUu2kqCwoooqwCiiigAooooAKKKKACiiioAKKKKsAooooAKKKKACiiigAooooJCiiigoKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooJCiiigoKKKKACiiioAKKKKsAooooAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooKCiiigAooooAKKKKACiiigAooooJCiiigAooooKCiiigAooooAKKKKACiiigAoooqACiiigAooooAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKCgoooqACiiirAKKKKACiiigkKKKKACiiigAooooAKKKKACl3UlFBQu6jdSUVAD6Kbup1ABRRRQAUUUUAFFFFABRRRQAU3dTqZQAu6koooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApd1JRVgLup1MooAXbRto3UbqgWglFFLtoGJRRRVgFFFFABRRRQAUUUUAFFFFBI+mUu6jbUFCUUUVZIUUUUFBRRRUAFFFFWAUUUUEhRRRQAb6KKKBD9n+1TdtJS7qRYlFFPqQGUU/Z/tU3bQAlFFFABRRRQA/Z/tU3bSUu6qANtG2jdRuqRaBtpKXdTt9AxlFP2U3bQAlFGyirICiiigsKKKKACiiioAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigAooooAKKKKCQooooAKKKKACiiigoKKKKgAoooqwCiiioAKKKKsAooooJCiiigoKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooqACiiigAooooAKKKKACiiigAoooqwCiiigkKKKKACiiigAoooqCgooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigkKKKKACiiigAooooAKKKKChd1G6kooAfRTKXdUAOooooLCiiigBlFFFBAUUUUAFFFFABRRRQAUUUu2gBKXbSU+gBu2jbTqKAG7aSn03bQAlFLto20AJRS7aSgAoooqwCiiigAooooAKXdSUUAPpu2jdRuqAEopdtG2gBKKKKsAooooAKKKKCQo30UUCF20lLuo21BYlFFFWSFFFFBQUUUVABRRRVgFFFFABRRRQSFFFFABRRRQAUb6KKBBRRRUFhRRRVgFFFFABRRRQSFFFFABRvoooEPoplG+gBdtJS7qdsqCxlFLtpKsAooooAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooqwCiiigkKKKKACiiigAooooAKKKKACiiigoKKKKgAoooqwCiiioAKKKKskKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAooooJCiiigAooooAKKKKACiiigAooooAKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiioAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKgoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKACl3UlFBQ+im7qdUAN20lPplABRRRQAUUUUAFFFFABS7qSigApd1JRQAu6jdSUUAPoplLuoAdRTd1G6gB1FN3UbqADbSUu6koAKKfTdtACUUUVYBRRRQAUUUUALuo3UlFAC7aNtG6jdUC0EopdtG2gYlFFFWAUUUUEhT6ZRvoELtpKfTdtQWJRRRVgFFFFABRRRUAFFFFWAUUUUAFFFFBIUUUUAFFFFAD2+WmU96ZUFBRRRVgFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABvp9Mo30CF20lLuo21BYlFLtpKsAooooAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKCgooooAKKKKgAoooqwCiiioAKKKKskKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAooooJCiiigAooooAKKKKACiiigAooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKCgoooqACiiigAooooAKKKKskKKKKACiiigAoooqCgooooAKKKKACiiirAKKKKACiiigAooooAKKKKACiiigAoooqACiiigAooooAKKKKACiiirAKKKKACiiigkKKKKACjfRRQIfTdtJS7qCw20lPoqAGUUu2koAKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooAXdRupKKgB9N20lLuoASil20lABRRRVgFFFFABRRRQAu6nUyigApdtJT6gBmyin0UyBlFGyiqAN9PplG+gBdtJS7qSoLCiiirAKKKKACiiioAKKKKsAooooAKKKKACiiigkex3LmmU/+CmVBQUUUVYBRRRQAUUUVABRRRQAUUUVYBRRRQAUUUUEhRRRQAUb6KKBD6btpKXdUFiUUu2koAKKKKsAoooqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooAKKKKgAooooAKKKKskKKKKACiiigAooooAKKKKCgoooqACiiirAKKKKgAoooqyQooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKCgooooAKKKKgAoooqwCiiigkKKKKACiiigoKKKKgAooooAKKKKACiil20AJRT9n+1TdtACUUu2jbQAlFLto20AJRS7aSgAopdtJQAUUUUAFFFLtoASil20baAEopdtJQAUUUUAFFFFWAUUUUAFFFFABRRRQSFFFFABRvoooEG+n76ZRQA+jZ/t0yigYu2jbRuo3UtB6CUU/f/sUypEFFFP2f7VBQyin7P8Aapu2gBKKKKACiiirAKKKKACiiigAooooAXdTt/8As0yigAoooqACiiirAKKKKACiiigkKKKKAF3U6mUu6godTKXdUtQBDRS7aSgAoooqwCiiigAooooAKKKKACiiioAKKKKsAooooAKKKKCR6jcuKZTlbaabUFBRRRVkhRRRQUFFFFQAUUUUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFBIb6fTKN9AhdtJT6btqCxKKKKsAooooAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigAoooqACiiigAoooqyQooooAKKKKACiiigoKKKKgAoooqwCiil21ACbKKN9FWQFFFFAwooooKCiiigAooooAKKKKACiiigAooooAKKKKCQooooAKKKKACiiigAooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiioAKKKKskKKKKACiiigAoooqCgoooqwCiiigAooooAKXdSUUAFLupKKAF3UbqSigBd1G6kooAXdTt9MooAfTdtJS7qAJaKhooAfvoplFAD6bupKKADfT9/+xTKKCAp+z/bplFAxdtG2jdRupaD0EopdtJUjCiiirAKKKKACiiigAooooAKKKKCQooooAKKKKACiiigAooooAKXdSUUFBRRRQAUbKKN9BAu2kpd1JQWFFFLtqAEopdtJVgFFFFABRRRQAUUUUAFFFFQAUUUVYBRRRQSFFFFABRRRQAu6nUyl3UFBto20bqdUAMop9N20AJRS7aSrAKKKKACiiigAoooqACiiirJCiiigAo2UU/8AgoEMooooGFFFFBQUUUVABRRRQAUUUVYBRRRQAUUUUAFFFLtoASin7P8AaplQAUUUUAFFFFBIUu6jbSVZQ+m7aN1G6oASil20lABRRRVgFFFFABRRRUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUEhRRRQAUUUUFBRRRUAFFFFWSFFFFABRRRQAUUUVBQUUUVYBRRS7aADbRuo3UlIAooopkhRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFFWAUUUVABRRRVgFFFFBIUUUUAFFFFABRRRUFBRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUALupKKKCgoooqACiiirAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigoKKKKACiiigAooooJCiiigApd1JRQULupKXbSUAP2f7dM2UUb6kgKKfvo2f7VIsZRS7aSrAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigA30b6KKBD6KZS7qCw20lLup2+oAZRS7aNtACUUUVYBRRRQAUUUUEhS7uMUlFBQUUUUEhRRRQUFFFFABRRRQAUUUu2gBKKfso3/7NQA3bTtn+1Td1JVAP3/7NN3UlFMAooooAKKKKACiiigkXdRtpKXdUFCUUu2koAXdRtpKXdVAJRT6ZUgFFFFWAUUUUAFFFFABRRRUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFBIUUUUAFFFFBQUUUVABRRRVkhRRRQAUUUUFBRRRQAUUUUAFLuo20lQAUUUVZIUUUUFBRRRQSFFFFABRRRQUFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUu2kqACiiigAooooAKKKKsAooooJCiiigAooooKCiiioAKKKXbQAlFPpu2gBKKKKACiiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigAooooAKKKKgoKKKKACiiigAoooqwCiiigAooooAKKKKACiiigAooooJCiil20FCUUu2kqACiin7/APZoAZRS7aSrAKKKKACiiigBd1G2kpd1QAlJupdlJtqyBaKbS7qCRd9P2UyigoXbSUu6nVBYyil20lABRRRVgFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQAu6jdSUUFD6ZRRQAUUUUAFFFFBI/Z/tU3bSUu6kUG2kpd1O3/7NADKXbTt/wDs03dQAbads/2qbupKAH7P9qimUUwH7/8AYpm+iiggKKKKBhRRRQUFFFFABRRRQSFFFFBQUUUVABRRRQA+mUUUAFFFFWAb6NlFG+ggKKXbSVBYUUUVYBRRRQSFFFFBQUUUVABRRRQAUUUUAFFFFABRRRVgFFFFBIUUUUAFFFFABRRRUFBRRRVkhRRRQAUUUUFBRRRQAU+m7aN1QAm+iiirICiiigsKKKKCQooooAKKKKACiiigoKKKKACiiigAooooJCiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigB9Mp9MqACiiigAooooAKKKKskKKKKACiiigAoooqCgooooAKXdSUUAPooooAbto206igBu2jbTqKAG7aNtOooAZRT6btoASil20baAEop9FADKXbTqKAG7aNtOooAbtpKXdSUAFFFFWSFFFFABRRRQAUUUUFBRRRUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFABT9n+1TKKACn7P9qmUUAFLupKKAF3UlFFABRRRQAu6lVdxptPSkAyiiimAUUUUAFFFFAD0+emUI+2n1JA0rmmU89aZVBIKXdSUUEjqN9FFBQb6fTKN9AC7aSl3U6oLGUUu2koAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigoKKKKACiiioAKKKKACiiirAKKKKADfRsoo30EBRS7aSoLCiiirAKKKKCQooooKCiiigAoooqACiiigAooooAKKKKskKKKKACiiigAoooqCgoooqwCiiigkKKKKCgpdtJS7qgBN9FFFWQFFFFAwooooKCiiigkKKKKACiiigAooooKCiiigkKKKKACiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooAKKKKACiiioKCiiigAoooqwCiiigkKKKKACiiigoKKKKgAooooAKKKKACl3UlLtoAN1OplPoAKKKKCwooooAKKKKCAooooAKKKKACiiigsKKKKAG7aSn0yrICiiigkKKKKACiiigAoopyruNQUNooooAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKfTKfUAMoooqwCiiigAooooAKXdSUVAD6ZT6ZQAm2looqyAooooGFFFFABRvoooEG+n0yjfQAu2kp9N21BYlFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAUu2kp9ADKKKKsAooooJCiiigAooooKCiiioAKKKKACiiirAKKKKACiiigAooooAN9GyijfQQFFLtpKgsKKKKsAooooAKKKKACiiigAoooqACiiigAoooqwCiiigAooooJCl20lLuoKEooooAKKKKCQooooKCiiigAooooJCiiigoKKKKACiiigkKKKKACiiigoKKKKCQooooAKKKKACiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigAooooAKKKKCgoooqACiiigAoooqwCiiigkKKKKACiiigoKKKKgAooooAKKKKAF206iigBlLuo20lAD6Kbup1ABRTKKAH0Uyl3UAOooooLCiiigAooooAKKKKACmU+mVZAUUUUAFFFFABRRRQSFPX5aZT6goZRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFPpu2nUAMopdtJVgFFFFABRRRQAUUUUAFFFFQAUUUVZIUUUUAFFFFBQUUUUAFFFFBIUb6KKBD99M2UUb6ACin76btqCxKKKKACiiirAKKKKACiiigAooooAKKKKACiiigAoooqACiiigAooooAKKKKACiiigAooooAKfTKXdQAlFFFWAUUUUAFFFFABRRS7aADbSUu6kqACiiirAKKKKACiiigAooooAKKKKACiiigkN9GyijfQIKKXbSVBYUUUVYBRRRQAUUUUAFFFFABRRRUAFFFFABRRRVgFFFFBIUUUUAFFFFQUFFFFWSFFFFABRRRQUFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFBQUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFBIUUUVBQu2kpd1JQAUUUVZIUUUUAFFFFABRRRUFBRRRQAUUUu2gA20badRQAUUUUFhTdtOooIG7adRRQAyiil20AJRRRQA+iiigsKKKbuoIDdTqZT6ACiiigsKZT6ZQQFFFFWAUUUUAFFFFAC7aSn0yoAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooqAF20badRQAUUUUAFMp9FADKKKKsAooooAKKKKACiiioAXbSUu6jbQAlFFFWAUUUUAFFFFABRRRQAUUUUAFFFFBIUb6KKBBS7aSl3UFiUU+m7agBKKKKACiiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiioAKKKKACiiigAoopdtACUUUVYBRRRQAU+mU+gBlFFFABRRRQAUUUUAFFFFABRRRQAUUUVABRRRQAUUUVZI+l2/7VRbqWgOYKKfTKgoKKKKsAooooAKKKKACiiioAKKKKACiiirAKKKKCQooooAKKKKgoKKKKskKKKKACiiigoKKKKgAoooqwCiiigkKKKKAD+Cij+CigQUUUUFhRRRQSFFFFABRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQUFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABRRS7agoSiiirAKKKKCQooooAKKKKCgoooqACiiigB9FFFABRRRQWFFFFABRRRQAUUUUAFFFFBAU3bTqKAGUu6jbSUAPpu2nUUAMp9N206gAooooLCmU+iggZRRRVgFFFFABT6ZT6ACmUu6kqACiiirAKKKKACiiigAooooAKKKKACiiigkKKKKCgooooAKKKKACiil21ABto206igAooooLCiiigApu6nU3bQQG2kpd1G2gBKKKKsAooooAKKKKACn0yioAXbSU+m7aAEoooqwCiiigAooooAKKKKgAooooAKKKKsAooooAKXdSUUAFFFFABRRRUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFLupKKAF20lPplABRRRVgFPplFABRS7aSgAooooJCiiigoKKKKACiiigAoopdtQAlFLtpKACiiirAbS7qWm0GQ/fRk0yl3UFcw7bSUu6jbUFiUUUVYBRRRQAUUUUAFFFFQAUUUUAFFFFWAUUUUEhRRRUFBRRRVgFFFFBIUUUUFBRRRUAFFFFWSFFFFABRRRQAUUUUFBRRRQSFFFFABRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUAFPpu2kqCgoooqyQooooAKKKKACiiioKCiiigAoop9ABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBAUUUUFhRRRQQFFFFBYUUUUEDKKXbSVYBRRRQAU+iioAZRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFPoAbtp1FFABRRRQWFFFN3UEDqKbup1ABRRRQWN206iiggbtpKfTdtACUUUVYBRRRQAUUUUAPoplPqAGUUu2koAKKKKsAooooAKKKKgAooooAKKKKACil20lABRRRVgFFFFABRRRQAUUUUAFFFFQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUVAD6Kbup1ADKKKKsAooooAfTKKXbUAJRRRVkhRRRQAUUUUFBRRRQAU+mUu6oAdTdtOooAZRS7aSgApNtOwaMGrJ5RlFLtpKCB+TRvplOoK5h9M2Ub6N9SAUUu2jbSLEoooqwCiiigAoooqACiiigAooooAKKKKACiiirAKKKKCQooooAKKKKCgooooJCiiigAooooAKKKKCgooooJCiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigAooooAKKKKACiiigAooooAKKKKChd1JRRUAFFFFWSFFFFABRRRQUFFFFQAUUUUAFPplPoAKKKKCwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKbuoIHUU3dRuoAdRTd1OoAKKKKACmU+mUAFFFFWA+mt1p1NbrUAxKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKgBdtOoooAKKKKCwooooAZRRRQQFFFFAC7qdTKXdQA6iiigAooooAbtpKfTdtACUUUVYBRRRQAUUUUAPpu2kp9QAyil20lABRRRVgFFFFQAUUUUAFFFFAC7qNtJS7qAEooooAKKKKACiiirAKKKKACiiigAoooqACiiigAooooAKKKKACiiigAoooqwCiiigAooooAKKKKACn0yioAfTKfTKACiiirAKXdSUUALtpKXdRtqAEoooqyQooooAKKKKCgoooqAH0U3dRuoAN1G2kp9ADKKKKACiiirJCk20tFAgooooGG+n0yigQ/Z/t0yin7/8AYqQGUU/Z/tU3bSLEooooAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKACiiigAooooAKKKKCgooooJCiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooAKKKKACiiigAooooAKKKKCgooooAKKKKACiiigAooooAKKKKCQooooAKKKKgoKKKKACiil20AOooooAKKKKCwooooAKKKKACim7qN1BA6im7qN1ADqbupKKAF3UbqSigBd1G6kooAXdSUUVYBRRRQAUUUVAD6KZS7qADdRtpKfQAyiiirAfTKfTKgAoooqwCiiigAooooAKKKKACiiigAooooAKKKKACiiioAKfTdtOoAKKKKCwooooAKKKKAGUUUUEBRRRQAUUUUALup1MooAfRTd1OoAKKKKAG7aSl3U6gBlFLtpKACiiirAKXdSUUAPpu2jdTqgBlFLtpKACiiirAKKKKgAooooAKKKKACl20lLuoASl20badQA3bSUu6jbQAlFLto20AJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFAD6btpKfUAMooooAKKKKsApd1JRQAu2kpd1G2oASiiirJCiiigoKKKKACiiioAKXdSUUAPplLupKACiiigAoooqyQooooAKKKKACiiigAo30UUCH7/8AYoplFAxdtG2jdRuqB6CUU+m7aBiUUUUAFFFFWAUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBQUUUUEhRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUFBRRRUAFFFLtoANtOoooAKKKKCwopu6jdQQOopu6koAXdRupKKACiiigAoooqwCiiigAooooAKKKKACiiigAooooAKKKKACiiigAp9Mpd1QAlKvWkp9WAUyn0yoAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAoooqAH0UUUAFFFFBYUUUUAFFFFABTKfTdtBAlFFFABRRRQAUUUUAFLupKKAF3UbqSigB+z/AGqKZS7qAHUU3dRuoANtJS7qNtACUUu2kqwCl3UlFAD6ZS7qNtQAlFFFABRRRVgFFFFQAUUUUAFFFFAC7qdTKXdQAbadRRQAUUUUAN20badRQA3bSU+igBlFLto20AJRRRQAUu2kp9ADdtJT6btoASil20lABRRRQAUUUVYBRRRQAUUUUAFPplFQAu2kp9MoAKKKKsAooooAKXdSUUAPpu2jdTqgBlFPplABRRRVgFFFFABRRRQAUUUUAFFFFQAUUUVYBRRRQSFFFFABRRRQUFFFFBIUUUUAFFFFABvo30UUCF20lLup2z/aqCxlFFFABRRRVkhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBQUUUUEhRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUVBQUUUUAFLupKKAF3UbqSigBd1G6kooAKKKKACiiigAooooAKKKKACiiigAoopdtACUUu2koAKKKKACiiirAKKKKACiiigAooooAKKKKACn0yn0AFMp9MqACiiirAKKKKCQooooKCiiigAooooAKKKKACiiioAKelMp6/LQAUUU1etADqKKKCwooooAKKKKACiiiggbtpKfTdtACUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUu6kooAfTdtJS7qAEop9N20AJT6ZS7qADbSU+m7aAEooooAKKKKsAoooqACiiigAooooAXdRupKKAH0U3dTqACiiigAooooAKKKKACm7adRQAUUUUAFFFFABTdtOooAZRS7aSgAooooAKKKKACiiirAKKKKAH03bSU+oAZRRRVgFFFFABRRRQAUUUUEhvp9Mo30CCiil21BYlFFFWAUUUUAFFFFABRRRQAUUUVABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUbKKN9AhdtJT6btqCxKKKKskTdSUu2koIF3UbqSigBd1G6kooAdRRRQWFFFFABRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFQUFFFFABRRRQAUUUUAFFFFABRRRQAUUu2jbQAlLtpKfQA3bRto3UbqBaBtp1N3UbqBjqKbuo3UAOopu6jdQA6m7adRQA3bSU+m7aAEopdtG2gBKKKKACiiirAKKKKACn0yn0AFMp9MqACiiirAKKKKACiiigAooooAKKKKACiiigAoooqACn0yn0AFNXrTqKACiiigsKKKbuoIHUUU3dQWOooooAKbup1FBA3bRtp1N3UAJRS7aNtACUUUUAFFFFABRRRQAUUUVYBRRRQAUUUUAFLupKKACiiigApd1JRQAu2jbRup1QAyil20lABRRRVgFFFFQAUUUUAFFFFABRRRQA+imUu6gB1FFFBYUUUUAFFFFABRRRQAUUUUEBRRRQWFN206iggZRS7aSgAooooAKKKKACiiigAp9MpV60AOplPplABRRRVgFFFFABRRRQSFFFFABS7qSigoXbSUu6kqACiiigAoooqwCiiigAooooAKKKKgAooooAKKKKsAooooAKKKKACiiigAooooAKKKKCQooooKDfRvoooICiil21BYlFFFWSJtpKdRQKw2inUbKCQooooLCiiigAooooAKKKKACiiigAooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigkKKKKgoKKKKACiil20AG2kp9N20AJRS7aSgAop9MoAXbTqKbuoAdTd1JRQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUALuo3UlFAD6KZS7qgA20lLupKACiiigAoooqwCn0yn0AFMp9MqACiiirAKKKKACiiigAooooAKKKKACiiigAoooqACn0iruNLQAUUUUFhRRRQAUUUUEBRRRQWFFFFABRRRQAUUUUAFN3U6iggbto206m7qAEopdtG2gBKKKKACiiigAoooqwCiiigAooooAKKKKACiiigAp9MooAfTdtG6nVADKKXbSUAFFFFWAUUUUAFFFFQAUUUUAFFFFABT6btp1ABRRRQWFFFFABRRRQA3bTqKKCAopu2nUFhRRRQAU3bTqKCBlFFFABRRRQAUUUUAFKvWkpV60AOpu2nUUAMoooqwCiiigAooooJCiiigAooooKCiiigAoopdtQAlFFFWAUUUUAFFFFABRRRUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRvoooICiiigYUUUUAFLuo20lQUFFFFWSFFFFABRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRUAFFFFABRRRVgFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRUFBRRRQAU+mr1p1ABRRRQAUyn0ygBd1JRRQAUUUUAFFFFABRRS7aAEpdtG2jdQAbaNtG6jdQLQNtG2nUUDG7aNtOooAbtpKfRQAyin03bQAlFLto20AJS7aNtG6gA20lPpu2gBKKKKsAp9Mp9ABTKfTKgAoooqwCiiigAooooAKKKKACiiigAooooAKKKKgB6UUL8tFABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEBTdtOooAZRT6KAGUUu2jbQAlFFFABRRRVgFFFFABRRRQAUUUUAFLupKKAH0U3dTqgBu2kp9N20AJRRRVgFFFFABRRRQAUUUVAC7qN1JRQAu6nUyl3UAOopu6nUAFFFFBYUUUUAFFFFABRRTd1BA6im7qN1ACUUUUAFFFFABRRRQAUUUUALup1Mpd1ACUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFLuo20lQAUUUVYBRRRQAUUUUEhRRRUFBRRRQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQUFLto20bqgA3UlFFWAUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUFBRRRUAFFFFWAUUUUAFFFFABRRRUAFFFFWAUUUUEhRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAUUUUAPooooAKKKKCxu6koooICiiigAooooAKXbRtp1ADdtG6jdRtoF6BupKKKBhRRRVgFLupKKAF3U6mUVAD6Kbup1ABRTdtOoAKKKKACiiigAooooAbtpKfTKACn0yn1YBTKVutJUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAPooooLCiiigAooooAKKKKACim7adQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBAUUUUAMopdtJQAUUUUAFFFFABRRRQAUUUVYBRRRQAUu6kooAXdTqZS7qgA20lPpu2gBKKKKACiiirAKKKKACiiioAKKKKACn0yl3UAOopu6jdQA6m7qSigBd1G6kooAXdSUUUAFFFFABRRRQAUUu2koAKKKKACiiigAooooAKKKKACiiirAKKKXbQAlFFLtoASil20lQAu2jbRuo3UC0DdSUUVYwooooAKKKKACiiigAooooAKKKKgAooooAKKKKACiiigAoooqwCiiigAooooAKKKKACiiigAoooqACl20lLuoAN1JRRVgFFFFABRRRQSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFQAUUUVYBRRRQAUUUVABRRRVgFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUFBRRRQAUUUUAFFFFQAUUUUAFPplPoAKKKKCwplLupKCAooooAKKKXbQAbaNtOooAKKbuo3UAJS7qSigAooooAKKKKsAooooAKKKKACl3UlFAC7qdTKXdUAOooooLCiiigAooooAKZT6ZVkBT6ZT6gBrdaSiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKXbUAOooooLCiiigAooooAKKKKACiiigApu2nUUAFFFN20AOopu2nUAFFFFABRRRQAUUUUAFFN206gAooooAKKKKACiiiggbto206igBlFPpu2gBKKKKACiiigAoooqwCiiioAKKKKsA30+mUb6CBdtJS7qNtQWJRS7aSgAoooqwCiiigAooooAKKKKACiiioAKKKKACiiirAKKKKCQooooAKKKKCh9GymUUAPopu6jdUAG2jbRuo3UC0DbRto3UbqA0DbTqbuo3VQx1FN3UbqYDqKbuo3UAO303dSUUALupKKKACiiigkKKKKCgooooAKKKKACiiigAooooAKKKKCQoooqCgooooAKKKKACiiirAKKXbRtoASiiioAKKKKsAooooAKKKXbUAJRRRQAUUUVYBRRRQAUUUUEhRRRQAUUUUAFFFFABRRRQUFFFFQAUUUVYBRRRQAUUUVABRRRQAUUUVYBRRRQSFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFBIUUUVBQUUU5V3GgBaKKbuoAdRRTKACiiigAooooAKfTdtOoAKbuo3UlABRRRVgFPplPqAG7aNtOooAZS7aNtOoAZRRRQAUUUVYBRRRQAUUUUAFLupKKAH0Uyl3VADqbuo3UlAD6ZT6ZVgFPpq9adUAMoooqwCiiigAooooAKKKKACiiigAooooAKKKKgAp9Mp9ABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFN3UECUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUEhRvoooEPpu2jdRuqCxKKXbSUAFFFFWAUUUUAFFFFBIUUUUFBRRRQAUUUUAFFFFABRRRQSFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQUFFFFABRRRUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAu6jdSUVABRRRQAUUUVYBRRRQAU+mU+oAZRS7aSgAoooqwCiiigkKKKKACiiigAooooAKKKKCgooooAKKKKgAoooqwCiiioAKKKKACiiirAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooJCiiigAooooKCiiigAooooAKKKKgAoooqyQooooAKKKKCgooooAKKKKACiiigAoooqACnK200m2jbQIdTdtOooNBu6koooICiiigApdtJT6AChvlooegBlFFFWAUUUUAFPplFQAu6jbTqKACim7qdQWFN206iggbtpKfTdtACUUUUAFFFFWAUUUUAFFFFABRRRUALupKKKsB9FFFQAyiiirAKKKKACiiigAooooAKKKKACiiigAoooqACn0yn0AFFFFBYUUUUAFFN3U6gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACim7qN1BA6m7qSigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigkKKKKAF3U6mUu6goNtJS7qNtQAlFLtpKsAooooJCiiigoKKKKgAooooAKKKKsAooooAKKKKCQooooKCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiioAKKKXbQAlFLtp1ADdtG2nUUAN20lPplABRRRQAUUUVZIUUUUAFFFFABRRRQAUUUUFBRRRUAFFFFABRRRVgFFFFAD6ZT6ZUAFFFFWAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFQAUUUUAFFFFABRRRQAUUUVYBRRRQSFFFFABRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQUFFFFABRRRQAu2kpd1JQAUUUUEhRRRQAUUUUFBRRRQAUUUUAFFFFABRRRUAPooooAKKKa3WgBKKKKACiil20AOooooAKa3WnU1utAMSiiirAKKKKCQooooKH0UUVABRRRQWFFFFABRTd1OoICm7adRQAyl20badQAyin03bQAlFFFABRRRQAUUUVYD6a3WnU1utQDEoooqwCiiigAooooAKKKKCQooooKCiiigAoooqAFXrTqavWnUAFFFFBYUUUUAN206iigBu6jdTqKCAopu6nUFhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRTd1BA6m7qN1JQAu6koooAKKKKACiiigAooooAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQo30UUCF3U6mUUFj9n+1TdtJS7qQBto20bqN1SLQNtG2jdRuoDQNtG2jdRuoDQNtG2jdRuoDQNtG2jdRuoDQNtG2jdRuoDQSin0bP8AaoGMopdtG2rASiiigAooooAKKKKACiiioAKKKKACiiigAooooAKKKKACl20badQAUUUUAFFFFABRRRQWFMp9MoICiiigAoooqyQooooAKKKKACiiigAooooAKKKKCgoooqACiiirAKKKKACn0yl3VACUUUUAFFFFWSFFFFABRRRQAUUUUFBRRRQAUUUVABRRRQAUUUUAFFFFABRRRVgFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFFWSFFFFABRRRQUFFFFABRRRQSFFFFABRRRQUFLtpKfUAFFFFABTKfTKACiiigAp9Mp9ABRRRQWFNbrTqZQQFFFFWAUUUUEhRRRQUFPplPqACiiigsKKKKACiiiggKKKKCwooooICiiigBu2kp9N20AJRS7aSgAoooqwH0yn0yoAKKKKsAooooAKKKKCQooooAKKKKCgooooAKKKKgBV606iigAooooLCiiigApu6nUUAFFFFBA3bTqKKCwooooAKKKKACiiigAooooAKKKKACm7qdTKCBd1JRRQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUAPo2f7dMooAfRTN9G+gQ+mbKN9PqQGUU/ZTdtIsSiiigAooooAKKKKACiiigAooooAKKKKAH0U3dTqACiiigsKKKKACiiigAplPplBAUUUUAFFFFWSFJupaKBBRRRQMKKKKACiiigAooooKCiiigAooooAKKKKACiiigB9Mpd1JUAFFFFWAUUUUEhRRRQAUUUUFBRRRQAUUUVABRRRQAUUUUAFFFFWAUUUUEhRRRQAUUUUFBRRRUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFBQUUUUAFFFFABRRRQAUUUUEhRRRQAU+mU+oKCiiigsKZRRQQFFFFAC7adRRQAUUUUFhTKXdSUEBRRRVgFFFFBIUUUUFBT6ZT6gBu6nU3bTqACiiigsKKKKACiiigAooooAKKKKACiiiggKKKKAGUUUq9asB1Mp9MqACiiirAKKKKACiiigkKKKKACiiigoKKKKACiiioAfRRRQWFFFFABRRRQAUUUUAFFFNbrQQOooooLCiiigAooooAKKKKACiiigAooooAKZS7qSggKKKKsAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiioAKKKXbQAlFLto20AJRS7aNtACUUu2jbQAlFLto20AJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUUAFG+iigQUu2kpd1QWJRRRQAUUUUAFFFFABRRRQAU/f/s0yigApd1JRQA+im7qN1ADqKKKCwooooAKbtp1FBAyiiigAoooqyQo2UU+pEMooopFhRRRVgFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQUFFFFABRRRUAFFFFABRRRVgFFFFBIUUUUAFFFFABRRRQUFFFFQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUEj6KKKgoKKKKCxlFFFBAUUUUAPooooAKKKKCxu2kpd1JQQFFFFWAUUUUEhRRRQUFPplPqACimr1p1ABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQQFFFDfLQAylXrSU+rAKZT6ZUAFFFFWAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFLtqAHUUUUFhRRRQAUUUUAFFFFABTW606iggKKKKCwooooAKKKKACiim7qCB1FN3UlAC7qSiirAKKKKACiiigAooooAKKKKACil20bagBKKXbTqAGUU+igBu2kp9N20AG2jbTqKAG7adRRQAUUUUAN20bqdRQAUUUUAFFFFABRRRQAUUUUAN20badRQA3bSU+m7aAEopdtG2gBKKXbRtoANtJT6btoASiiigAoooqwCiiigAooooAKKKKCQooooKCiiigAooooAKKKKAHMu002nt81MoAKKKKgAooooAKKKKACiiigAooooAKKKKACl3UlFAC7qN1JRQAu6jdSUUAFFFFABRRRVkhS7qSioKCiiigAooooAKKKKsAooooAKKKKCQooooAKKKKCgooooJCiiigAooooAKKKKCgooooAKKKKACiiigAoooqACiiigAoooqwCiiigkKKKKACiiigoKKKKACiiioAKKKKskKKKKACiiioKCiiirAKKKKACiiigAooooAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigkfRRRUFBRRRQWMop9MoICiiigB9Mp9N20AOooooLGUUUVZAUUUUAFFFFBIUUUUFBT6ZT6gAooooAKKKKCwooooAKKKKACiiigAooooAKKKKACh6Ka3WggSn0yn0AFMoooAKKKKsAooooAKKKKCQooooKCiiigAooooAKfTKfUAFFFFABRRRQWFFFFABRRRQAUUUUAFFFN3UAOopu6jdQQOplLupKAF3UlFFWAUUUUAFFFFABRRS7agBKKXbTqAGUU+m7aAHUUU3dQA6im7qN1ADqKKKACiim7aAHUU3bTqCwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCAooooAKKKKAGUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAPplPplABRRRUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQSFGyijfQIXbSUu6kqCwooooAKKKKACiiirAKKKKACiiigAooooJCiiigAooooAKKKKACiiigAooooKCiiigAoooqACiiigAoooqwCiiigkKKKKACiiigAooooKCiiigAooooAKKKKCQooooAKKKKgoKKKKsAooooJCiiigAooooAKKKKACiiigoKKKKACiiioAKKKKsAooooAKKKKACiiigAooooAfRRRUFhRR/BRQQFMp9N20AJRRT6ACiiigAooooLGUUUVZAUUUUEhRRRQAUUUUFBT6ZT6gAooooLCiiigAooooAKKKKACiiigAooooAKKKKACmU+mUEBT6avWnUAMooooAKKKKsAooooAKKKKCQooooKCiiigAoooqACn0yn0AFFFFABRRRQWFFFFABRRRQAUUUUEBTdtG6jdQAlFFFWAUUUUEhRRRQAUUUUFBRRRQAU+m7adUAFFFFABTd1OplAC7qSiigAooooAKXdSUUALuo3UlFAD6Kbuo3UAG2nU3dRuoAdTd1G6koAfRTKfQAUUUygB9FFFBYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFNbrTqKAGUUUUEBRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQA+mUu6kqwCiiigAoooqACiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigkKKKKACl6mkpV61BQlFLtpKAF20lPpu2gBKKXbSUAFFFFABRRRQAUUUUAFFFFWAUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRUAFFFFWSFFFFABRRRUFBRRRVkhRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUVABRRRVgFFFFABRRRQAUUUUAFFFFAD6KKKgsP4KZT/4KKCAooooAbtp1FFADd1OplPoAKKKKCxlFFFWQFFFFBIUUUUAFFFFBQU+mUVAD6KKKCwooooAKKKKACiiigAooooAKKKKACiiigAplPplWQPoooqAGUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAU+mU+gAooooLCiiigApu6jdSUEC7qdTdtOoAKbuo3UlABRRRVgFFFFBIUUUUAFFFFBQUUUUAFFFFAC7qdTKfUAFFFFABTKXdSUAFFFFWAUUUUAFFFFQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUu6kooAKXdSUu2gA3UbqNtJQAU+m7adQAUUU3dQA6iim7qAHUU3dTqACiiigsKKKKAGUUUUEBRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUu2oASiiigAoooqwCiiigkKKKKgoKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooJCiiigAooooAKKKKCh9FFFQAUUU3dQA5vlplOZtxptABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUEhRRRQUFFFFABRRRQAUUUVABRRRVkhRRRQAUUUrdagoSiiirJCiiigAooooAKKKKCgooooAKKKKACiiigAoooqACiiirJCiiigAooooKCiiigAooooJH0UUVBqFFFFBAUUUUAFFFFBY3bTqKKCAooooLCmU+mUEBRRRVkhRRRQAUUUUFBRRRUAPooooLG7adRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTKe3y0yrIH01utOplQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQA+iiigApu6nUygApd1JRQAUu2jbTqACm7qN1JQAUUUVZIUUUUAFFFCJuoEFFFFBYUUUUAFFFFABRRRUAFPpu2nUAFFN3UbqAEoooqwCiiigAooooAKKKKACiiioAKKXbSUALto20bqdQA3bTqbuo3UAJRRRQAu2kpd1JQA+m7aSl3UAG2nU3dRuoAdTKKKAF3UbqSigAooooAXdSUUUAFPplPoAKKbup1ABTd1OplABRRRVgFFFFABRRRQAUUUUAFFFFABRRS7agBKKXbRtoANtOoprdaA2EooooAKKKKsAooooJCiiioKCiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKCQooooAKKKKACiiigB9FFFQahTKXdSUEBRRRVgFFFFABRRRQSFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFQAUUUVZIUUUUAPprdaN1DdagYlFFFWIKKKKACiiigAooooAKKKKCgooooAKKKKACiiigAooooJCiiigAooooKCiiigkKKKKAH0UUVBqFFFFABRRRQQFFFFBYUUUUEBRRRQAUyn0ygAoooqyQooooAKKKKCgooooAXdTqZT6gAooooLCiiigAooooAKKKKACiiigAooooAHplFFWQPplPprdagBKKKKsAooooAKKKKACiiigAooooAKKKKACn0yn1ABRRTd1ABupKKKsAoopdtQA6m7qdTKACiiirJCiiigAooooAKevy0yn0FDKKKKACiiigAooooAKKKKgB9FFN3UAJRRRVgFFFFABRRRQAUUUUAFFFLtqADbRtp1FABTKXdSUAFLupKKsAooooAKKKKACiiigAooooAKKKKACiiioAKKKKACiiigAooooAXbTqKKAG7aN1G6koAXdSUUVYBRRRQAUUu2nbKgBu2jbRuo3UC0DbRto3UbqrQNA206m7qN1Ax1FN3UbqYDqKbup1QAUUUUAMopdtJQAUUUVYBRRRQSFFFFQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUAFFFOVdxoAbRRRQSFFFKvzUAOopu6jdUFCUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUFBRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUAFFFFABRRRQUFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFQUFFFFWSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABRRRUFD6KKKCwooooAKKKKCAoopu2gsdRRRQAUUUUEBRRRQAyiiirAKKKKCQooooKCiiigAp9Mp9QAUUUUFhRRRQAUUUUAFFFFABRRRQAUUUUAMooooIH/wUyn/AMFMoAKKKKsAooooAKKKKACiiigAooooAKKKKgAp9N205vloAKZRRQAUUUVYC7adRTd1QAbqSiirAKKKKCQooooAKKKKACn0yn0FBTKfTKgAoooqwCiiigAp9Mp9QAUyn0ygAoooqwCiiigAooooAKKKKgBdtOopu6gA3UlFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUVABRRRQAUUu2koAKXbTqKAGUu2paZQAU3dRupKACiiirAKKKKACl20baN1QAbqSiirAKKKKACiiigAopdtG2gBKKKKgAooooAXdTqZS7qAHUyn0ygAoooqwCiiigkKKKKgoKKKKACiiigAooooAKKKKACiiigAooooAKKKKsAooooAKevy0yl3VACUUUVZIUqrikp9AhlFFFQWFFFFWSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFBIUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQUFFFFABRRRUAFFFFWAUUUUEhRRRQAUUUVBQUUUVZIUUUUAFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQSFCJuopVbFAhKKKKBhRRRQAUUUUFD6KKKgsKKKKACiiiggKKKKACiiigBu6nU3bTqACiiigsZRRRQQFFFFWSFFFFBQUUUUAFPplLuqAHUUUUFhRRRQAUUUUAFFFFABRRRQAUUUUAMoopV60EDv4KZT6ZQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUu2oAdSM240tMoAKKKKsAp9Mp9QAUyl3UlABRRRVgFFFFABRRRQSFFFFBQUu6kooAfTKfTdtQAlFFFWAUUUUAFFFFABRRRUAFFFFWAUUUUAFFFFQAUu2jbTqACmUu6koAKKKKsAooooAKKKKACiiigAooooAKKKXbUAJS7aNtOoAbto206igBu2nUU3dQA6n0ymUALuo3UlFABRRRVgFFFFABRRS7aADbRtp1N3VABupKKKsAooooAKKKKACl20baN1QAbqN1JRQAUUUUAFFFFABRRRVgPoooqAGUUUVYBRRRQSFFFFBQUUUVABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAu2kp9MoAKKKKskKfTKHqRBRRRVFhRRRQSFFFFABRRRQAUUUUAFFFFABRRRQUFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUVABRRRVkhRRRQAUUUUAFFFFABRRRQAUUUUFBRRRUAFFFFWSFFFFABSquaSnpQIZRRRQMKKKKACiiigB9FFFQahTd1G6jbQQOopu6koAfTd1JRVgLuo3UlFAC7qdTKKAH0Uyl3UAG2jbTqKgBlFFFWAUUUUEhRRRQUFFFFAC7qN1JRQA+im7qN1QA6iiigsKKKKACiiigAooooIGU9KZT0qwCmU+mVABRRRVgFFFFABRRRQAUUUUAFFFFABT6btp1QA3dSUUVYBRRS7aAHUUUyoAKKKKsAooooAKKKKACiiigAooooAKKKKAF3U6mU+oAbtpKfTKACiiirAKKKKACiiigAooooAKKKKACiil21ADqbup1MoAKKKKsAooooAKKKKACiiioAKKKKACl20badQA3bTqKKACiiigBu6nUyl3UAJRRRQAUUUUAFFFFWAUUUUAFFLtp1QA3bTqbuo3UAG6kooqwCiiigAooooAKKKKAF3UlFFABRRRQAUUUUAFFFFQAUUUUAFPplPoAZRRRVgFFFFBIUUUUFBRRRUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFLtpKAF3UlFFWAUUUUEhRTlXcabUFBRRRVgFFFFBIUUUUAFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFFWAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUUFBRRRUAFFFFWSFFFFABT0plKrYoEJRRRQMKKKKACiiigB9FFFQajdtG6jdSUEBRRRVkhRRRQUFFFFABRRRQAUUUUALup1Mp6/NQA3bSU+mVABRRRVkhRRRQAUUU/f/sVADKKXbSUFBRRRVgLup1MoqAH0Uyl3UAOopu6nUFhRRR/BQQMp6Uynr8tWA1utJT/46ZUAFFFFWAUUUUAFFFFABRRRQAUUUq9agB1N3U6mUAFFFFWAU+mU+oAbupKKKsAooooAKKKKgAoooqwCiiigAooooAKKKKACl3UlFAD6Kbup1QAyil20lABRRRVgFFFFABRRRQSFFFFABT6ZT6goKZT6ZQAUUUUAFFFFABRRRQAUUUVYBRRRUAPooooAbup1N20bqADdSUUUAFFFFABRRRQAUUUUAFFLto20AG2jbTqbuoAdTd1G6koAKKKKsAooooAKKKKACiiigAooooAKKKKgAoooqwCiiigAoooqACiiigAp9Mp9ADW60lK3WkqgCiiimSFFFFABRRRUFBRRRQAUUUUAFLto20bqAEooooAKKKKACiil20AG6kooqwCiiigAooooAcrbTTaKKgAoooqwCiiigkKKKKACiiigAooooAKKKKgoKKKKACiiirAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooAKKKKACiiigkKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooJCiiigAooooKCiiioAKKKKskKKKKAChKKEoEFFFFAwooooAKKKKAF3UbqNtJUFBRRRVkhRRRQAUUUUAFFFFABRRRQUFFFFABTlbaabRQA+kZdppaG+aoAZRRRVkhRRRQAUUUUAG+jZRRvqRBRS7aSkWFFFFWAUUUVABS7qSigBd1O/gplLuoASn0yn1YB/HTKf/HTKgAoooqwCiiigAooooAKKKKACn0yn1ABTKVutJVgFFFFAD6KKZUAFFFFWAUUUVABS7aNtOoAZRRRVgFFFFABRRRQAUUUUAFFFFABS7qSigB9N20bqdUAMopdtJQAUUUVYBRRRQSFFFFABSq2aSlX5aBDqZT6btqCxKKKKACiiigAooooAKKKKsAooooAfRQvzUVABTKfTKACiil20AJRS7aNtACUu2nUUAMpdtS1FuoAdRTd1JQAu6kooqwCiiigAooooAKKKKACiiigAoooqACiiigAooooAXbSUu6koAKKKKACiiigAooooAKfTKfQA1utJSt1pKoAooopkhRRRQAUUUUFBRRRUALtpKfRQA3dSUu2koAKKKXbQAlFLtp1ADdtOpu6jdQAlFFFWAUUUUAFFFFABRRRUAFFFFABRRRVgFFFFBIUUUUAFFFFBQUUUVABRRRQAUUUVYBRRRQAUUUUEhRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUFBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABQlFFAgooooLCiiigkKKKKAH0yl3UlBQUUUUEhRRRQAUUUUAFFFFBQUUUUAFFFFABRRRQA+imU+oARl2mm09vmplWAUUUUEhRRRQAUUUUALup1Mpd1QUOplPp9AENFPpu2gBKKXbSUAFFFFWAU+mU+oAP46ZT6ZQAUUUVYBRRRQAUUUUAFFFFABT6avWnVADKKKKACl20qruNLQAUyiirAKKKKACl20lPqACiiigBlFLtpKsAooooAKKKKACiiigAooooAKKKKACiiigBd1OplLuoANtJT6btqAEoooqwCiiigkKKKKAF3U6mUu6goNtG2nUVABTKKKACiiigAooooAKKKKsByttNLTKfUANbrSU+mUAFPplPoAKKKbuoAdTd1JRQAUUUUAFFFFABRRRVgFFFFABRRRUAFFFLtoASil206gBu2jbTqKAG7aNtOooAZRT6btoASiiigAoooqwCiiioAKKKKACn0yn0ANbrSU+mUAFFFFWSFFFFABRRRQUFFFFQAU+mU+gApu2nUUAFFFFABRRRQAyiiirAKKKKACiiigAooooAKKKKgAooooAKKKKACiiirAKKKKACiiioAKKKKACiiigAooooAKKKKsAooooAKKKKCQooooAKKKKCgooooAKKKKACiiigkKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAoooqACiiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKKCQooooAKKKKCgooooAKKKKCQooooAKKKKCgooooAKKKKACiiigAooooAKKKKCQooooKCiiigAp9Mp9ABTKfTKgAoooqyQooooAKKKKACiil21BQ6jfTd1OoAKKKKACm7adRQA3bSU+mUAFPplPoAa3WkooqwCiiigAooooAKKKKACiiigAp9Mp9QAyil20baAHL8tFFMoAKKKKsAoooqACn0UUAFFFFBYUyn0yggKKKKsAooooAKKKKACl20badUAN20lPpu2gBKKKKsAooooAXdTqZS7qADbSU+m7agBKKKKACiiirJCiiigA30+mUb6BC7aSl3UbagsSiiigAooooAKKKKsApd1JRQA+mU+m7agBKfRRQAUyn0ygAooooAKKKKACiiigAopdtG2gBKKXbTqAG7aNtOooAKKKKACiiigAooooLCiiigAooooIG7aSn0ygAooooAKKKKsAoooqACn0yl3UAOplPplABRRRVgFFFFBIUUUUFBRRRQAUUUVAD6KKKCwooooAbup1N206ggZRRRVgFFFFABRRRQAUUUUEhRRRQUFFFFQAUUUUAFFFFWAUUUVABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUAFFFFBIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAUUUVYBRRRQAUUUUAFFFFABRRRUAFFFFWSFFFFABRRRQAUUUUFBRRRQAUUUUEhRRRQAUUUUFBRRRQAUu2kpd1QAlFPpu2gBKKKKskKKKKACiiigoKKKKACnr81Mp6UAFMp9MqACiiirJCiiigAooooKCn03bTqgAooooAKKKKCwooooAKZT6Y/36ZMhV606mr1p1IQyiiirAKKKKACiiigAooooAKKKKAFXrTqZT6gAoopu6gA3UlFFWAUUUUAFLto206oAKKKKCwooooAKZT6btoIEopdtJQAUUUVYBRRRQA+iiioAKKbup1ADKKKKsAooooAKKKKAF3U6mUu6gA20lPpu2oASiiigAoooqwCiiigkKN9FFAhdtG2jdTqgsZRS7aSgAoooqwCiiigBd1OplLuoAdRTd1OqACmU+m7aAEopdtOoAbto206igBu2nUUUAFFFFABRRRQAUUUUFhRRRQAUUUUAFFFFABRRRQAUUUUAFN206iggZRRRQAUUUVYBRRRQAUUUVAD6ZT6btoASiiirJCiiigoKKKKACiiigAooooAKfTKXdUAOooooAKZS7qSrAKKKKACiiigAooooJCiiigAooooAKKKKCgoooqACiiirAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAoooqwCiiigAooooJCiiigAoopdtQUJRRRVgFFFFABRRRQAUUUUAFFFFQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAUUUVZIUUUUAFFFFABRRRQUFFFFQAUUUVZIUUUUAFFFFBQUUUVABRRS7aAHUUUUAMooeirICiiigYUUUUFBRRRQAU9KZRQA+mU+m7agBKKKKskKKKKACiinpQUFFFFQAUUUUFhRRRQAUUUUAFMf79Ppj/fpomYq9adTV607+CkIZRSt1pKACiiirAKKKKACiiigAooooAKfTKXdUAG6kooqwCiiigApdtJT6gAooooAKKKKCwooooAKKKKCAplPplABRRRVgFFFLtqAHU3dRupKACn0yn0AMoooqwCiiigAooooAKKKKAF3U6mUu6gA20badRUAN20lPpu2gBKKKKsAooooJCjfRRQIfTdtJS7qgsSil20lABRRRVgFFFFABS7qSigB9FN3UbqgB1FFFABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTKfTdtBAlFFFABRRRVgFFFFAC7qdTKfUAMoooqwCiiigAooooAKKKKACiiigAoooqACn0yigAoooqwCiiigAooooAKKKKCQooooKCiiigApdtJT6gBlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFABRRRQSFG+iigQu2jbRup1QWMopdtJQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUVABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQUFFFFQAUUUVZIUUUUAFFLto21BQlFLto20AG2nUUUAFFFFADW60lFFWAUUUUAFFFFABRRRQAUUUUAPooprdagBKKKKskKKKKACnpTKelBQ3dTqbtp1QAUUUUFhRRRQAUUUUAFMf79PplMmY9KP4KEopCGUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRS7agB1FFFABRRRQWFFFFABRRRQAUUUUAMoooqyAooooAXbTqKbuqAEopW60lABRSr1pKsAooooAKKKKACiiigAooooAKKKKAF3UbqSioAfRRRQA3bSU+igBlFLtpKACiiirAKKKKCRd1G2kpd1IoSil20bakBKKKKsAooooAKKKKAF3U6mUu6oAdRTd1OoAKKKKCwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooIG7aSn03bQAlFFFABRRRVgFLupKKgBdtJS7qNtACUUUVYBRRRQAUUUUAFFFFQAUUUUAFFFFABRRRQAUUUUAFFFFABS7aSl3UAJRRRQAUUUu2gA20bqN1JVAFFFFSAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUUAFFFFBIUUU2gRLRvqPdS0D5g2UUb6fv/wBipEMop9N20ixKKKKsAooooAKKKKACiiigAooooAKKKKgAoooqwCiiigAooooAKKXbSUAFFFFABRRRQSFFFFABRRRQAUUUUAFFFFBQUUUUAFFFFBIu6nU3bTqgoKKKKACim7qdQWFFGyigBlFFFWQFFFFABRRRQAUUUUAFFFFAD6Ho2UPUAMoooqyQooooAKelMp6UFBRRRUFhRRRQAUUUUAFFFFABTKfTKCZD0ob5aEoegQyiiirAKKKKACiiigkKKKKCgooooAKKKKACiiioAKfTdtOoAKKKKCwooooAKKKKAGr1p1FFBAUUUUFjKKKKsgKKKVetADv4Kbtp38FFQA1utJRRQA+mU+mUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFQA+imr1p1ABRRRQAU3bTqKAGUUu2koAKKKKsAooooAXdTqZS7qADbSUu6jbUAJRRRQAUUUVYBRRRQAUu6koqAF3U6mUu6gB1FFFBYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEDdtJT6ZQAUUUUAFFFFWAUu6koqACiil20AJRRRVgFFFFABRRRUAFFFFABRRRQAUUUUAFFFFABRRT9n+1QAyiiigBdtG2jdRuqtBaCUu6kopjCiiigAoooqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigAooooJCiiigBNtJTqKBWCiiigYUb6KKBD6Zsoo30AFFP3/7NN21BYlFLtpKsAooooAKKKKACiiigkKKKKCgooooAKKKKAF3UlFFABRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQUFFFFABRRRQSPoooqCgoo2UUFhRsoo30APqLdTt9MoICiiirAKKKKACiiigAooooAKKKKAH76ZT6ZUAFFFFWSFFFFABT1+WmU+oKCiiigsKKKKACiiigAooooAKZT6ZVkD6ZT/4KZUAFFFFWAUUUUEhRRRQAUUUUAFFFFBQUUUVABT6btp1ABRRRQWFFFN3UEDqbtp1N3UAOooooLCiiigAoooeggZRRRVgFPSmU9KABvloob5qKgsZRRRQQLup1Mp9ADKKXbSUAFFFFWAUUUUAFFFFABRRRQAUUUUAFPplLuqAHUUUUAFFFFBYUyn0yggKKKKACiiirAKKKKACl3UlFAC7aSl3UbagBKKKKACiiirAKKKKACiiigApd1JRUAPoplLuoAdRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEDKKfTKACiiigAoooqwCl3UlFQAUu2kpd1ACUUUUAFFLtp1ADKKfRQAyin0ygBdtJS7qSrAKKKKCQooooAKKKKACiiigoKKKKACiiigAooooAKKKKgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACil20lABRRRQAUUUUAFFFFABRRRVgFFFFBIUb6KKBD6Zsoo30AFFLtpKgsKKKKsAooooJCiiigAooooKCiiigAooooAKKKKgAoooqwCiiigAooooAKKKKACiiigAop9MoAKKKKCR+yjZT6KzuahTNlPopgMooooAKZS7qSggKKKKsAooooAKKKKACiiigAoop6UADfLTKe3zUyoAKKKKskKKKKACn0yn1BQUUUUFhRRRQAUUUUAFFFFABTKfTKCB/wDBTKfTKsAooooJCiiigAooooKCiiigAooooAKKKKgB9FFFBYUUUUAFFFFBAUUU3dQWOooooAKKKKAChvmoooIGUUUVYBT0plPSgAoooqCxlFFFBAU+mU+gApu2nUUAMop9N20AJRS7aSrAKKKKACiiigAooooAKKKKAF3U6mUUAPopu6jdUAOpu2nUUAMopdtJQAUUUUAFFFFWAUUUUAFG+iiggKXbSUu6oLEopdtJQAUUUVYBRRRQAUUUUAFFFFAC7qN1JRUAPopu6jdQA6iiigsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACm7adRQQN20lPplABRRRQAUUUVYBRRRUAFFFFAC7qN1JRQAu6kooqwCiiigAooooAKKKKCQooooAKKKKACiiigAooooAKKKKACiiigAooooKCiiigAoooqACiiigAooooAKKXbTqAGUUu2jbQAlFLto20AJRT6ZQAu2kp9MoAKXbSUu6gB1MoooAXdSUUUAFFFFWAUUUUAFFFFABRRRQAUUUVABRRRVgFFFFBIb6KKKBBRRS7agsSiiirAKKKKCQooooAKKKKCgooooAKKKKACiiioAKKKKskKKKKACiiigoKKKKADfRRRQQFFFFAyaiiisjoGb6N9FFUQFFFFADKKKKsgKKKKACiiigAooooAKKKKACnr8tMp9QAN8tMpzNuNNoAKKKKskKKKKACn0UVBQUUUUFhRRRQAUUUUAFFFFAB/eplP8A71MoIH0yn0yrAKKKKCQooooKCiiigAooooAKKKKACiiigAp9Mpd1QA6iiigsKKKKACm7adRQAUUUUAFFFFABRRRQAyiiiggKVetJSr1oAdRRRQWMooooICn03bTqACiiigAooooAKbtp1FADKKfTdtACUUu2kqwCiiigAooooAKKKKACiiigBd1G6kooAfTdtJS7qADbRto3U6oAZRS7aNtACUUu2koAKKKKsAooooJDfRRRQIKKKKgsKKKKACiiirAKKKKACiiigAooooAKXdSUVAC7qdTKXdQA6im7qN1ADqKKKCwooooAKKKKACiiigAooooAKKKKACiiiggbtpKfTdtACUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFBQUUUVAD6KKKACiimUAPpu6kooAXdSUUUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFBIUUUUAFFFFABRRRQAUUUVBQUUu2koAKKKKskKN9FFAgoooqCwoooqwCiiigkKKKKACiiigoKKKKACiiigkKKKKACiiigoKKKKACiiigkKKKKACiiigCaiiisjoGUUUVRAU3dTqZQQFFFFWAUUUUAFFFFABRRRQAUUUVAD6KKKAGUUUVYBRRRQSFFFFBQ+iiioAKKKKCwooooAKKKKACiiigAplP2UyrIH0yn0yoAKKKKskKKKKCgooooAKKKKACiiigAooooAKKKKAF3U6mUu6oAdRRRQWFFN206gAooooAKKKKACiiigBrdaSn03bQQJT6ZT6ACiiigsKbtp1FBAUUUUAFFFFBYUUUUAFFFFABRRRQQFFFFADdtG2nUUAN20lPooAZRS7aNtWAlFFFABRRRQSFFFFABS7qSigoXdTqZRQA+im7qN1QAbaSn03bQAlFLtpKACiiirAKKKKCQooooKCiiioAKKKKACiiirAKKKKACiiigAooooAKKKKAF3UbqSioAfRTKXdQA6im7qdQAUUUUFhRRRQAUUUUAFFFFABRRRQQFN206igBlFLtpKACiiirAKKKKACiiioAKKfs/2qbtoASil20baAEopdtG2gBKKXbRtoASil20baAEopdtG2rASil20baAEooooJCiiigAooooAKKKKACiiigAooooAKKKKAF3U6mUUFD6bto3UbqgBKKfsplABRS7aSgAoopdtACUU/ZTdtACUUu2jbQAlFLtpKACiiirAKKKKACiiigkKKKKACiiigAooooAXdSUUUFBRRRQAUUUUEhRRRQUFFFFQAUUUVYBRRRQSFFFFABRRRQUFFFFABRRRQSFFFFBQUUUUEhRRRQAUUUUAFFFFAD99G+iioNQooooAKZRRVkBRRRQAUUUUAFFFFABRRRUAFPoooAKKKKCxlFFFWZBRRRQAUUU+oKCiiigsKKKKACiiigAooooAKKKKAH1DT99MoIH0ynr81FADKKKKsAoopyruNQA2il20lABRRRQAUUUVYBRRRQAUUUUAFFFFAC7qN1JRQA+im7qdUAFFFFBYUUUUAFH8FFH8FABRRRQQN206iigAooooLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooICiiigAooooAbtpKXdTqAGUUUVYBRRRQAUUUVABRRRVgFFFFAC7qN1JRQA+m7aN1OqAG7aSn03bQAlFFFWAUUUUEhRRRQAUUUVBQUUu2koAKKKKsAooooAKKKKACiiigAooooAKKKKACiiigBd1G6koqAH0U3dRuoAdRRRQWFFFFABRRRQAUUUUAFFFFBA3bSU+igBlFLto20AJRRRQAUu6koqwF3UbqSigBd1G6kooAXdRupKKAH0UyigB9FMooAfRTKXdQA6im7qN1ADqbto3UbqQBto20bqN1GgtA20baN1G6jQNA20baN1G6pDQSin76NlAhlFLto20FCUUUVYBRRRQAUUUUALupKKKACl3UlFABS7qSigBd1G6kooAXdSUUVAC7aSl3UbaAEooooAKKKKsAooooAKKKKACiiigAooooJCiiioKCiiirAXJoyaSk3UE8wtFFFBQUUUVABRS7aSrAKKKKCQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAH0UUVBqFFFFADKKKKsgKKKKACiiigAooooAKKKKgB9GyijfQAUyn0ygAoooqyQooooAKfTKVetQUOooooLCiiigAooooAKKKKACiiigAprfLTqay4pkzHJRQlFIQyiiirAKcrbTTaKAF3U6mU+oANlN20lLuoANtJT6btoASil20lABRRRVgFFFFABRRRQAUu6kooAfTdtJS7qgB1FN206gAooooLCiijZQAUUUUAFFFFADd1OplPoICiiigsKKKKACiiigAooooAKKKKACiiigAooooAKKKKCAooooLG7adRRQQMopdtJQAUUUUAFFLto20AG2jbTqKAGUUUVYBRRRQSFFFFAC7qdTKXdQUG2jbRup1QAyil20lABRRRVkhRSbqWgQb6NlFG+gAop9N21BYlFLtpKACiiirAKKKKACiiigAooooAKKKKACiiigAooooAKXdSUUALuo3UlFQA+im7qN1ADqKbuo3UAOooooLCiiigAooooICiiigBu2jbTqKAG7aSn0UAMopdtG2gBKKXbSUAFFFFABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAC7qN1JRQA+m7aSl3UAG2kpd1O2f7VQAyil20lWAUUUUAFFFFABRRRQAUUUUAFFFFABS7qSigB+ym7aSn1ADKKXbSUAFFFFWAUUUUAFFFFABRRRQSFFFFBQUUUVABTadRVkCbqWjFFArsKKKKDQXdSUUUAFFFFQAUUUVYBRRRQSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAPoooqDUKKKKAGUUUVZAUUUUAFFFFABRRRUAFLtp1FABRRsooLCmUUVZAUUUUEhRRRQUPoooqACiiigsKKKKACiiigAooooAKKKKACh6KHoIGU+mU+gBlFFFWAUUUUAFPplLuqADbSU+mUAFPplLuoAdTdtOoX5qAGUUu2jbQAlFFFWAUUUUAFFFFABRRRQAu6koooAfRTd1G6oAdRvoooLCiiigAooooAKKKKCAooooLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAoprdadQQFG+imUAPpu2nUUAN20badRQAUU3dTqAG7qdTdtOoAZRT6ZVgFFFFBIUUUUAFFFFABS7qSigofTdtG6nVADKKXbSUAJtpKdSbasyDdS02igB1PqPdS0FD6btpKXdQWG2kp9N21ACUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAC7qN1JRQAu6jdSUUALuo3UlFQA+imUUAPopu6jdQA6im7qN1ADqKbuo3UAOopu6jdQAlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFPoAZRS7aSgAoooqwCiiigAooooAKKKKAF3UbaSl3UgDbSUu6jbUgJRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAu6nUyl3VACUUUVYBRRRQAUUUUAFFFFBIUUUUAFFFFQUFFFFWAmDSU6k20GQbqWjAooHdhRRRQaBRRRQAUUUUAFFFFABRRRQAUUUUEhRRRQAUUUUAFFFFABRRRQA+iiioNQooooAZRRRQQFFFFABRRRVgFFFFQA+iiigA30UUUFjKKKKsgKKKKCQpdtJT6goKKKKCwooooAbup1N206ggKKKKCwooooAKKKKACh6KKCBlPplPSrAZRRRQAUUUUAFFFFAD6bto3U6oAZRRRQAU5W2mm0VYD6KZS7qgB1Mp9N20AJRRS7aAEoooqwCiiigAooooAKKKKACl3UlFAD6Kbuo3VADqKbup1ABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEBTdtOooAKKbtp1ABRRRQAUUUUFhRRRQQFMp7fLTKsAooooJCiiigAooooAKKKKCgpd1JRQA+m7aN1OqAGUUu2koATbSU6irIsNooooJHUm6lwKMCgd2PoqPdRuoK5h22jbRup1QUMopdtG2gBKKXbSUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFQAUUUUAFFFFABRRRVgFFFFABRRRUAFFFFACr1p1Mp9ABTdtOooAbtpKfTdtACUUu2koAKKKKsAooooAKKKKACl3UlFAC7aSl3UlQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAPplPplQAUUUVYBRRRQAUUUUAFFFFBIUUUUFBRRRUAFFFFWSNooooIHbvelyaZS7qCuYWiiigsKKKKACiiigAooooAKKKKACiiigkKKKKACiiigAooooAXdRupKKgofRRRQWMop9N20ECUUu2koAKKKKsAooooAfRTd1OqAChvlopGbcaAG0UUVZIUUUUAPoooqCgpu6nU3bQAbqdTdtOoAKKKKCwooooAKKKKACiiigAooo2UEDKelMp6VYBTKe3y0yoAKKKKsAooooAKXdSUVAD6ZT6btoASiiigAoooqwCn0yigB9FN3U6oAbto206igBlFLtpKACiiirAKKKKACiiigAooooAKXdSUUAFLupKKAH03dSUVAD6Kbup1ABRRRQAUUUUFhRRRQAUUUUAFFFN3UEDqKKKCwooooAKKKKCAooooLG7aNtOooIG7qdTdtOoAKKKKAGs2aSlb5qSrICiiigYUUUUAFFFFABRRRQUFFFFQAUu6koqwH03bRup1QAyil20lACbaSnUVZFhtFOpNtBIlFFFAD8mjJplLuoK5hd9PplG+gB9FN3U6oLG7aNtOooAZRS7aNtACUUUUAFFFFWAUUUUAFFFFABRRRQAUUUVABRRRQAUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFQAUUUUAFFFFABRRRVgFFFFQAUUUUAFPplPoAKKKKCwooooAKbtp1FBAyil20lABRRRVgFFFFABRRRQAUUUVABRT6ZQAUUUVYBRRRQAUUUUAFFFFABRRRQA+mUu6nVADKKKKsAooooAKKKKACiiigAooooJCiiioKCiiigAptOoqyBtFLtpKCR1FGBRQO7Ciiig0CiiigAooooAKKKKACiiigkKKKKACiiigAooooAKKKKChd1OplLuqAHUUUUAFMp9FADKKfTKACiiigAp9MpV60AOplPplABRRRVkhRRSr81ADqKKKgoKKKKCwooooAKKKKACiiigAooooAKKKKACn0yjfQAyiiirIHt81Mp9NbrUAJRRRVgFFFFABRRRQAu6jdSUVAD6ZS7qNtACUUUUAFFFFABRRRVgLup1MooAfRTd1OqAGUu2nUUAMopdtG2gBKKKKsAooooAKKKKACiiigAooooAKKKKACl3UlFAC7qN1JRQAu6jdSUUALupKKKAF3UlFFABS7qSigBd1G6kooAKKKKgApd1JRQA+ihfmooLCiiiggKKbuo3UAJRRRVkhRRRQAUUUUAFFFFABRRRUFBRRRQAUUUUAFLupKKsB9Mpd1OqAGUUUVYBRRRQSFFFFABSbaWigQUUUUDCjfRRQIfRTKN9A+YfTd1G6jbUFBtpKfTdtACUUu2koAKKKKsAooooAKKKKACiiigAoooqACiiigAooooAKKKKACiiigAooooAKKKKACiiirAKKKKACiiigAooooAKKKKgAoopdtABtp1FFABRRRQWFFN3UbqCB1FMpd1ADqKbup1ADdtJT6btoASiiigAoooqwCiil21ADqZT6ZQAUUUVYBRRRQAUUUUAFFFFABRRRQAU+mU+oAZRRRQAUUUVYBRRRQAUUUUAFFFFBIUUUUAFLtpKXdUFCUUUVYBSbaWiggbRTqKCRN1G6lwKMCgdwooooKCiiigoKKKKACiiigAooooAKKKKCQooooAKKKKCgoooqACiiigBd1OplFAD6NlN3VLQAym7adRQA3bTqKKACmU9vlplABRRRVkhSgZpKelBQUUUVBYUUUUANbrTqa3WnUEBRRRQWFFFFABRRRQAbKNlPooAZRRQibqAB6ZT3plWQPooSioAZRRRVgFFFFABRRRQAUUUUALtp1N3U6oAbtpKXdRtoASiiigAooooAKKKKsAooooAXdTqZRQA+im7qdUAN20badRQAyil/CkoAKKKKACiiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKgAooooAevy0UUUFhRRRQA3bSUu6koICiiirJCiiigAooooAKKKKgoKKKKACiiigAoooqwCiiigAp6/NTKcrbTQAm2kp9N21ACUUUVYBRRRQSFFFFBQUUUUAFFFFBI2nUUUCCjfRRQA+imUu6gsN1JRS7agA20lLuo20AJRRRVgFFFFABRRRQAUUUUAFFFFABRRRUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUVABRS7aNtABtp1FFABRTd1G6gA3UbqSigAooooAKKXbRtoASl3UbaNtABup1N206gBu2kp9N20AJRRRQAU+m7adQAUyiirAKKKKACiiigAooooAKKKKACiiioAKfTKfQAUyl3UlABRRRVgFFFFABRRRQAUUUUEhRRRQAUUUUFBRRRUAFFFFWSFFFFABRRRQITbRupaKAsFFJtpaACiiigYUUUUFBRRRQAUUUUAFFFFBI/ZTdtS0yoKGUU+igBlFLtpKACiiigAooooAXdTqZT6ACiim7qAFZtxptFFWAUUUUEhTlbaabRQUPo2fLRRv+WoLCijZRQAUUUUEBRRRQWFFFFABRRRQA+iiipLGUK2KKF+WqIB6ZT3plWQPSihKKgBlFPplABRRRVgFFFFABRRRQAUu6kooAXbTqbup1QA3bRtp1FADKKXbSUAFFFFWAUUUUAFFFFABRRRQAu6nUyigB9N20bqN1QAbaNtOooAbto206igBlFP3/wCzRQAyil20baAEopdtJQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFPoAKKKKCxu6nU3bRuoIEoooqyQooooAKKKKCgoopdtQAlLtp1FADKKXbRtoASiiigAoooqwCiiigAooooAXdTqZS7qgBKKXbSUAFFFFWAUUUUEhRRRQUFFFFBIUUUUAFFFFABRRRQAUu6kooKF20bqN1JUALtpKXdRtoASiiirAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACil20lQAUUU+gAooooAKZS7qSgAoopdtACUu2jbRuoANtG2nUUAFFFFABRRRQAUUUUAFFFFABRTd1G6gB1N3UbqSgAoooqwCiiigAooooAKKKKACiiigAoooqACn0yn0AN206iigBlFFFWAUUUUAFFFFABRRRQSFFFFABRRRQAUu2kp9QUMoooqyQooooAKKKKCgooooAKKKKCQooooAKKKKACiiigAooooAKKKKACl3UlFBQu6nUyigB9FN3U6oAbto206jZQA3bSU+igBlPpu2nUAFMpd1JQAUUUVZIUUUUAFPplPqCgooooLH0yjfRQAU3dTqKCAooooLCiiigA2UbKfRSuAUUUUixlGyijfVEBTKfTKCAp9Mp9A4hTKfTdtAhKKKKsAooooAKKKKACiiigAp9MoqAH0UUUAGym7advooAZRS7aNtACUUUVYBRRRQAUUUUAFFFFABRRRQAUu6kooAfRTKXdQAbadRRUAFN3U6m7aAHU3bTqKACm7adRQAU3bTqKAG7adRRQAUyn0UAMooooAKKKKsAooooAKXdSUVAC7qdTKXdQAbqSiirAKKKKCQooooKCiil21ABtp1FFABRRRQWFFFFBAyin03bQAlFFFABRRRVgFFFFBIUUUUFD6Kbup1QAyiiigAoooqwCiiigAooooJCiiigoKKKKACiiigAooooAKKKKACl3UlFQAu2kpd1G2gBKKXbSVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUAFFFLtoASl20badQAUUUUAFFFFABRRRQWN20lPpu2ggdRRRQAUyl3UlAD6Kbup1ABRRTd1ABuo3UlFAC7qN1JRQAu6koooAKKKKACiiigAooooAKKKKsAooooAKKKKACiiigAoooqACnpTKcrbTQAtFFFBYyiiiggKKKKsAooooJCiiigAooooAKKKKACjfRRQIKKKKgsKKKKsAooooJCiiigoKKKKACiiigAooooAKKKKCQooooAKKKKACiiigoKKKKACiiigBd1O30yl3VADtlFG+igsKZS7qSggKKKKsAoopN1BAtFKvzUlAwoop9QUFFFFBYUUUUAFFFFABRRRQAbKNlPooAZvo30UUAPoooqSxlCJuop6fJVEDWqOpGqOrJkFPplPX5qBBRRRUAMooooAKKKKsAooooAKKKKACiiigB9FMp9QAUL81FC/LQWFFFFBA3bRtp1FADKKXbRtoASiiirAKKKKACiiigAooooAKKKKACl3UlFAC7qdTKKAH0U3dRuqAHUUU3dQA6iiigsKKKbuoIHUyiigAooooAKKKKsAoopdtQAbaSn0ygAoooqwCiiigAoooqACl20badQA3bTqKKACiiigsKKKKACiiigAooooIGUUUUAFFFFWAUUUUEhRRRQAU+mUu6goNtJT6btqAEoooqwCiiigAooooJCiiigAooooAKKKKCgooooAKKKKACiiigApd1JRUALupKKKACiiirAKKKKACiiigAooooAKKKKACiiigAoooqAF206m7qdQAUUUUAFFFN3UFjqKKKCAoopu6gB1N3UbqSgBd1JRRQAUUUUAFPpu2nUAFN20bqdQAyil20lABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFABRRRQAUUUVABRRRQA+iiigsKZT6ZQQFFFFWAUUUUEhRRRQAUUUUAFFFFABRRRQAUUUUFC7aSn0yoAKKKKskKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAXdTqZT6gBu2kp9MoAKKKKsAptOpF60GQ5flpKKKCwp9N206oKCiiigsNlPooqQCmbKfRVAMooooAfRRRUljNlGyn0U7kBRRRSLGU+mUrNiqIEplPplWQFPSmUUAPoooqCwplPpu2ggSiiirAKKKKACiiigAooooAKfTKfUAFFFFBYUUUUAFFFFBAUbKKN9ABspu2nb6KAG7aSn0f8BoAZRT9/+zTKACiil21YCUUUUAFFFFABRRRQAUUUUAFFFFAC7qdTKfUAFN206igBlFFFABRRRQAUUUu2gA206m7qN1ABupKKKsAooooAKKKKgApdtG2nUAFFFFABRRRQWFFFFABRRRQAUUUUAFFFN3UECUUUUAFFFFWAUUUUEhRRRQAUUUUAPoplPqChlFFFABRRRVgFFFPegkZRRRQAUUUUAFFFFBQUUUVABRRRQAUUUUAFFFLt4zQAlFFFWAUUUVABRRRVgFFFFABRRRQAUUUUAFFFFABRRRQAUu6koqAH0U3dRuoAdRs/2qbupKAH03dSUVYC7qSiigAooooAKKKKACiiigBd1G6jbRtqBaiUu6kooGPpu2jdRuoAdTdtG6jdQAbaSl3UlABRRRQAUUUVYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRUALup1Mpd1ADqZRRQAUUUUAFFFFWAUUUUEhRRRQAUUUUAFFFFABRRRQUFFFFQAUUUVZIUUUUAFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRT6btqAEooooAKKKKACiiirAKXdSUVAD6HooegBlFFFWSI3WloooEFFFFAx9FN3U6oKCiiigsN9G+iigB9FFFSWMoooqiB9FFFSWM30b6KKogfRRRUljKHoRN1DfNVGYyiiirJCiiigB9FN3U6oAKKKKAGUUu2koAKKKKsAooooAKKKKACn0yn1ABRRRQWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUEBRRRQAbKNlG+jfQA3bRtp1FADKKmpmygBlFLto20AJRS7aNtACU+iigAooooLG7aSn0yggKKKXbQAbadTd1G6gBKKKKsAooooAKKKKgApdtOooAKKKKACiiigsKKKKACiiigAooooAKKKbuoIDdSUUUAFFFFABRRRVkhRRRQAUUUUAFFFFABSq2aSlX5aBDqZT6ZUFhRRRVgFOZtxptLtpAJRRRTJCiiigAooooKCiiioAKKKKACiiigAp9MooAKKcy7TTasAoooqACiiigAoooqwCiiigAooooJCiiigAooooAKKKKACiiigoKKKKACiiigAooooAKKKKACiiigAooooAfRRTd1QAlFFFABRRRQAUUUUAFFFFWAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVABRRRQAUUUUAFFFFABRRRVgFFFFBIUUUUAFFFFABRRRQAUUUVBQUUUVYBRRRQSFFFFABRRRQUFFFFABRRRQAUUUUAFFFFAD6KKKgBu2kp9MoAKKKKACiiigAooooAfQ9FIzbjQA2iiirJCil20bagoSiiirAKXdSUUAPoplLuqAHUU3dTqADfRvoooLCijZRQA+iiipLGUUUVRAb6N9FCJuoEKj7FpG+WhhtXFD0EjKKKKsAooooAKXdSUUAPopu6nVABTdtOooAZRRRVgFFFFABRRRQAU9fmplPSoAKKKKCwooooAKKKKACiiigAooooAKKbtp1ABRRRQA3dTqbtp1BAUUUUFhRRRQAb6N9FFBAUUUUAFFFFABRRRQAU1utG6nUBuFMp9N20AG2nU3dRuoASiiirAKKKKACiil21ACU+iigAooooAKKKKCwooooAKKKKACiiigAooooAbupKKKCAooooAKKKKACiiirJCiiigAooooAKKKKACiiigB9Mp9NbrUFCUUUVYBS7qSigAooooAKKKKCQooooAKKXbSVBQUUUUAFFFFABRRRVgPb5qZT6ZUAFFFFWAUUUVABRRRQAUUUVYBRRRQAUUUUEhRRRQAUUUUAFFFFBQUUUu2oASil20baAEop9FADKKfTdtACUUu2kqwCiiigB9Mp9MqACiiirAKKKKgAooooAXbRto3UbqBaCUUu2jbQMSil20lABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRVgFFFFBIUUUUAFFFFABSt1oXrSVBQUUUVYBRRRQAUUUUEhRRRQUFFFFABRRRQAUUUUAFFFFAD6KKKgsKZT6ZQQFFFFABRRRQAUu2jbTm+WgBrNikpW+akqyAooooGPoplLuoKDbRtp1FQAyin7KZQAUUUVYBRRRQAu6nUyioAfvopu6jdQA7fRvoooLCiiigA2U9PkoooAY9Mp70yggKKKKsAooooAKKKKACiiigB9FN3U5fmqAGUUu2kqwCiiigAooooAKVetJSr1oAdRRRUFhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQQFN206igsKKKKACiiigAooooAKKKKACiiigBu2nUUUEBRRTd1ACUUUVYBRRRQAUUUVAC7adRRQAUUUUAFFFFBYUUUUAFFFFABRRRQAUUUUAFFFN3UAOpu2nUUEDdtG2nUUAMop9N20AJRRRVkhRRRQAUUUUAFFFFABRRRQAU+mU+oKGUUUUAFFFFWA5l2mm09juXNMoAKKKKCQooooAfTKKfUFDKKKKACiiigAoooqwH0Uyn1ADKKKKsApdtJS7qAEoooqACiiirJCiiigAooooKCiiigAooo2VJAUUUUixdtOoooAKKbupKAF3UbqSigBd1OplFAD6bto3UbqAEop9N20AJT6ZS7qsBKKXbSVABRRRVgFFFFABRRRQAu6jdSUVAC7qSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooqwCiiigkKKKKACiiigofTKfTKACiiigAooooAKKKKACiiigkKKKKCgooooAKKKKACiiigB9N3U6mVAC7qSiigAoopdtACUu2jbTqACkZtxpN1JVAFFFFMkKKKKChdtG2nUVADKXdTtlN20AO30PTKXdVgG2kp9FQAyil20lABRRRVgFFFFAC7qN1JRUAPoplLuoAdvp9RbqdvoKuFMp9MoJCiiigAoooqwCiiigAooooAKelMpV60AOb5aZT2+amUAFFFFABRRRQAUq9aSnpUAFFFFBYUUUUAFFFCJuoAKKKKACiiigAooooAKKKKACiim7qCB1FFFBYUUUUAFFFFABRRRQAUUUUAFFFFABRRTd1BAbqSiirAKKKKACiiioAXbTqKKACiiigsKKKKACiiigAooooAKKKKACiiigAoopu6ggdTKXdSUAPoplLuoAdTd1OplAD6Kbuo3UAOpu2nUUAMooooAKKKKskKKKKACiiigAp9MooKCin0yoAKKKKsBd3GKSiigAooooJCiiigAo30UUCCil20lQWFFFFABRRRVgFLupKKACiiigAooooAKKKKACiiigAoooqACil20baADbRtp1N3UAOpu6jdSUAFFFFABS7qSigAooooAKKKKACiiirAKKKKAH0Uyl3VABtpKXdRtoAN1JRRVgFFLtpKACiiigAooooAKKKKACiiioAKKKKACiiigBdtG2jdTqAGUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQSFFFFABS7aSn1BQ3dSUUVYBRRRQSFFFFBQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA+m7adRUAN20badRQAUUU3dQAbqN1JRVgFFFFBIUUUUFBS7aNtOqACm7qN1JVgFPplPqAGUUUVZIUb6KKBD6bto3U6oLGUU+m7aAEoooqwCiiioAKKKKACl3UlFAD6Kbup1ADKKXbSUAFFFFABRRRVgFFFFABT0plPX5agAb5aZTmbcabVgFFFFABRRRQAU9flplPqACiiigsKKKKACnp8lMX5qe/yUAMooooAKKKNlABRRRQAUUU3dQQG6koooAfRRRQWFFFFABRRRQAUUU3dQQG6nU3bTqACm7qN1JQAu6kooqwCiiigAoooqAF206iigAooooLCim7qdQAUUUUAFFFFABRRRQAUUUUAFFMooIF3UlFFABRRRQAUUUu2gBKKKKACiiirAXdTqZS7qgA20lPpu2gBKKKKACiiirJCiiigAooooKH0yn0yoAKKKKsAooooJCiiigAooooAKKKKADfRsoo30CCiil21BYlFLtpKsAoo2UUEBRRS7aCxKKXbRtqAEopdtG2gA20badRQA3bTqKZQA+m7qSigBd1JRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQAUu6koqAF20lLuo20AG6kooqwCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKXbSUu6oANtG2nUUAN20lPpu2gBKKXbSUAFFFFABRRRQAUUUVYBRRRQAUUUUAFFFFBIUUUUFC7aN1OplQAUUUVZIUUUUAFFFFQUFFLtpKACiiirAKKKKCQooooKCiiigAooooAfRsooqCwooooIG7qSiiqQkFFFFMQUUUUFBS7aKKgB1M30UVZDCiiigYu2nUUVBQ3bSUUUAFFFFABRRRQAu6nUUUCQbKZRRQMKKKKACiiigAooooAKXdRRQJjqKKKBjKKKKACiiigAooooAXbTqKKAGUUUVYBRRRQAUUUUAFPooqACiiigsKKKKABVzT3oooAZRRRQQFG+iigAooooLCmUUUEBRRRQA+iiigsKKKKACm7aKKAHU3bRRQQOooooAZRRRVgFFFFABRRRUALto20UUAOooooLCiiiggZS7qKKBMSn0UUDCiiigsKKKKCBu6jdRRQK4lFFFAwoooqwCiiioAKfRRQAyiiigAoooqwCiiigBd1OooqBIbtpKKKBhRRRVkhRRRQAUUUUFD6KKKgBlFFFWAUUUUEhRRRQAUUUUAFFFFABRRRQAUu6iikxsN1O3/AOzRRQgQ3dTt/wDs0UUIEG//AGaKKKkYU3dRRQJhup1FFAIKKKKBhTKKKACiiigAooooAKKKKACiiigBdtJRRQAUUUUAFFFFABRRRQAUUUUAFFFFWAUUUVABS7qKKBMNtJRRQMKKKKsAooooJCiiigoKKKKgAooooAKKKKACiiirAKKKKACiiigBd1OooqBIbup1FFAIKbtoooGJRRRQAUUUUAFFFFABRRRQAUUUVYBRRRQAUu2iioATfRRRVkIKKKKBhRRRQUFFFFQAu6jbRRQLcSiiirGFFFFBIUUUUFBRRRQAUUUUAf/Z";

    }
} // end class

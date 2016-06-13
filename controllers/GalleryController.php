<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class GalleryController extends Controller
{
    public $enableCsrfValidation = false;

    private static $basepath = '/home/synerg00/synergy.od.ua/www/gallery';

    public function actionIndex()
    {
        //$this->layout = 'admin';
        //return $this->render('index');
    }

    public function actionDir($dir = '/'){
        if($dir == '') $dir == '/';

        $path = self::$basepath.$dir;
        $list = scandir($path);
        array_shift($list);// delete .
        array_shift($list);// delete ..
        natsort($list);
        $sorted_list = array();

        $folder_thumbnail = 'http://synergy.od.ua/img/folder.png';
        foreach($list as $value)
	{
            if(is_dir($path.'/'.$value)){
                $sorted_list[] = array('name'=>$value, 'type'=>'dir', 'url'=>$dir.'/'.$value, 'thumbnail'=>$folder_thumbnail);
            }
	}
        foreach($list as $value)
	{
            if(is_file($path.'/'.$value))
            {
                if(preg_match('/.jpg$|.jpeg$|.gif$|.png$|.svg$/', strtolower($value))){
                    $sorted_list[] = array('name'=>$value, 'type'=>'image', 'url'=>'http://'.$_SERVER['SERVER_NAME'].'/gallery/'.$value, 'thumbnail'=> 'http://'.$_SERVER['SERVER_NAME'].'/gallery/'.$value);
                }
            }
	}
        return json_encode($sorted_list);
    }

    public function actionCreateFolder($folder_name)
    {
        $full_folder_name = self::$basepath.$folder_name;
        if(file_exists($full_folder_name))
        {
            echo 'FOLDER_NAME_BUZY_ERROR';
            return;
        }
        if(mkdir($full_folder_name, 0777)) echo 'FOLDER_WAS_CREATED';
        else echo 'FOLDER_CREATION_ERROR';
    }

    public function actionDelete($files_list){
        $files_list = json_decode($files_list, TRUE);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}

        foreach($files_list as $file){
            $full_name = $_SERVER['DOCUMENT_ROOT'].'/gallery/'.$file;
            echo $full_name;
            if(file_exists($full_name))
            {
                switch(filetype($full_name))
                {
                    case "dir":
                        if(!rmdir($full_name)){
                            $this->_delete_file_recursion($full_name);
                        }
                        break;
                    case "file":
                        unlink($full_name);
                        break;
                }
            }
        }
    }

    function _delete_file_recursion($path)
    {
        $file_list = scandir($path);
        unset($file_list[0]);
        unset($file_list[1]);
        vardump($file_list);
        if(count($file_list) == 0) {return;}
        foreach($file_list as $key => $value)
        {
            if(is_dir($path.'/'.$value))
                if(!rmdir($path.'/'.$value))
                    _delete_file_recursion($path.'/'.$value);
        }
        foreach($file_list as $key => $value)
        {
            if(is_file($path.'/'.$value)) unlink($path.'/'.$value);
        }
        rmdir($path);
    }

    public function actionUpload(){
        if(count($_FILES) > 0)
	{
            foreach ($_FILES as $file){
                copy($file['tmp_name'], self::$basepath.'/'.$file['name']);
            }
	}
    }

    /*public function actionDownload(){

    }*/

}




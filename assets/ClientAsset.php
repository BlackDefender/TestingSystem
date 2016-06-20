<?php

namespace app\assets;

use yii\web\AssetBundle;

class ClientAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/client/base.css',
        'css/client/index-page.css',
        'css/client/test-page.css',
        'css/client.css'
    ];
    public $js = [
        'js/libs/jquery.maskedinput-1.2.2.js',
        'js/client/globalVars.js',
        'js/client/helpers.js',
        'js/client.js'
    ];
    public $depends = [
        'app\assets\AppAsset'
    ];
}
?>
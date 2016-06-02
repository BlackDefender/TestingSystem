<?php

namespace app\assets;

use yii\web\AssetBundle;

class ClientAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/client-style.css',
    ];
    public $js = [
        'js/client-script.js'
    ];
    public $depends = [
        'app\assets\AppAsset'
    ];
}
?>
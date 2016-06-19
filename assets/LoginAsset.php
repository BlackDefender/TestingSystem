<?php

namespace app\assets;

use yii\web\AssetBundle;

class LoginAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/site.css'
    ];
    public $js = [];
    public $depends = [
        'app\assets\AppAsset'
    ];
}
?>
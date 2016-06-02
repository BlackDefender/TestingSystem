<?php

namespace app\assets;

use yii\web\AssetBundle;

class AdminAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/admin-style.css',
    ];
    public $js = [
        'js/jquery.color.js',
        '/js/image-picker.js',
        'js/admin.js',
        'js/admin/messages.js',
        'js/admin/categories.js',
        'js/admin/testEditor.js',
        'js/admin/tests.js',
        'js/admin/testsResults.js',
        'js/admin-fork.js'
    ];
    public $depends = [
        'app\assets\AppAsset'
    ];
}
?>
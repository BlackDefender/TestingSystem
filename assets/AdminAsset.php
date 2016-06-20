<?php

namespace app\assets;

use yii\web\AssetBundle;

class AdminAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/site.css',
        'css/admin.css',
        'css/gallery.css'

    ];
    public $js = [
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js',
        'js/libs/jquery-ui.min.js',
        'js/libs/jquery.color.js',
        'js/admin/globalVars.js',
        'js/admin/helpers.js',
        'js/admin/gallery.js',
        'js/admin/messages.js',
        'js/admin/categories.js',
        'js/admin/testEditor.js',
        'js/admin/tests.js',
        'js/admin/testsResults.js',
        'js/admin.js'
    ];
    public $depends = [
        'app\assets\AppAsset'
    ];
}
?>
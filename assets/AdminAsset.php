<?php

namespace app\assets;

use yii\web\AssetBundle;

class AdminAsset extends AssetBundle
{
    public $basePath = '@webroot'; //алиас каталога с файлами, который соответствует @web
    public $baseUrl = '@web';//Алиас пути к файлам
    public $css = [
        'css/admin-style.css',
        'css/gallery.css'
    ];
    public $js = [
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js',
        '//code.jquery.com/ui/1.11.4/jquery-ui.js',
        'js/jquery.color.js',
        'js/admin.js',
        '/js/admin/gallery.js',
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
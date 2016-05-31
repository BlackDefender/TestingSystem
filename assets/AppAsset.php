<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
        'css/site.css',
        'css/style.css',
        'css/tablesorter.css'
    ];
    public $js = [
        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.12.0/lodash.min.js',
        'js/jquery.tablesorter.min.js',
        '/js/image-picker.js',
        'js/admin.js',
        'js/admin/globalVars.js',
        'js/admin/helpers.js',
        'js/admin/categories.js',
        'js/admin/testEditor.js',
        'js/admin/tests.js',
        'js/admin/testsResults.js',
        'js/admin-fork.js',
        'js/client-script.js'
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
        'yii\bootstrap\BootstrapPluginAsset'
    ];
}

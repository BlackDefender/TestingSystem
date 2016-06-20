<?php

/* @var $this yii\web\View */

$this->title = 'Testing System';

// подключаем скрипты и стили
use app\assets\ClientAsset;
ClientAsset::register($this);

// подключаем файлы с шаблонами
require_once dirname(__FILE__).'/../templates/client.php';
require_once dirname(__FILE__).'/../templates/helpers.php';
?>

<div id="workplace" class="clearfix"></div>

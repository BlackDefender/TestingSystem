<?php

/* @var $this yii\web\View */

$this->title = 'Admin Page';

// подключаем скрипты и стили
use app\assets\AdminAsset;
AdminAsset::register($this);

// подключаем файлы с шаблонами
require_once dirname(__FILE__).'/../templates/admin.php';
require_once dirname(__FILE__).'/../templates/helpers.php';
?>

<ul class='toolbar btn-group'>
    <li class='btn btn-info get-tests-list-btn' title="Список тестов"><i class="glyphicon glyphicon-list"></i></li>
    <li class='btn btn-warning get-categories-list-btn' title="Список категорий"><i class="fa fa-database"></i></li>
</ul>

<ul class='toolbar btn-group' id="current-task-toolbar"></ul>
<div class='clearfix' id="workplace"></div>


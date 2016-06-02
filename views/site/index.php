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



<div id="workplace"></div>



<!--<form id="test" data-test-id="">
    <fieldset class="container">
        <legend>Регистрационные данные</legend>
        <div class="form-group col-xs-6">
            <label for="firstName">Имя</label>
            <input id="firstName" class="form-control">
        </div>
        <div class="form-group col-xs-6">
            <label for="firstName">Фамилия</label>
            <input id="lastName" class="form-control">
        </div>
        <div class="form-group col-xs-6">
            <label for="firstName">Телефон</label>
            <input id="tel" class="form-control">
        </div>
        <div class="form-group col-xs-6">
            <label for="firstName">E-mail</label>
            <input id="email" class="form-control">
        </div>
    </fieldset>
    <button type="button" class="btn btn-primary" id="test-next-block-btn">Далее &gt;&gt;</button>
</form>-->





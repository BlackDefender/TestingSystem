<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class AdminController extends Controller
{
    public $enableCsrfValidation = false;
    public static $guest_message = 'Вы не авторизованы на сервере!';

    public function actionIndex()
    {
        if (!\Yii::$app->user->isGuest) {
            $this->layout = 'admin';
            return $this->render('fork');
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            //return $this->goBack();
            $this->layout = 'admin';
            return $this->render('fork');
        }
        $this->layout = 'admin';
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    public function actionLogout()
    {
        Yii::$app->user->logout();
        return Yii::$app->getResponse()->redirect('http://synergy.od.ua/admin');
    }

}
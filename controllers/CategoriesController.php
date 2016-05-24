<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class CategoriesController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionIndex()
    {
        $list = Yii::$app->db->createCommand('SELECT * FROM categories')->queryAll();
        return json_encode($list);
    }

    public function actionAdd($name = 'NO_NAME_ERROR'){
        if($name == 'NO_NAME_ERROR') return $name;
        $cols_num = Yii::$app->db->createCommand()->insert('categories', ['name' => $name])->execute();
        return $cols_num;
    }

    public function actionDelete($id){
        $category_id = intval($id);
        if($category_id <= 0) {return 'NO_NAME_ERROR';}
        $cols_num = Yii::$app->db->createCommand('DELETE FROM categories WHERE id='.$category_id)->execute();
        return $cols_num;
    }

    public function actionRename($id = -1, $new_name = 'NO_NAME_ERROR'){
        if($id <= 0 || $new_name == 'NO_NAME_ERROR') return '__ERROR';
        return Yii::$app->db->createCommand()->update('categories', ['name' => $new_name],['id'=>  intval($id)])->execute();
    }

}




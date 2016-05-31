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
        $category_exists = (new \yii\db\Query())
            ->select(['id'])
            ->from('categories')
            ->where(['name' => $name])
            ->one();
        if($category_exists != false)
            return 'CATEGORY_EXISTS_ERROR';
        else
            return Yii::$app->db->createCommand()->insert('categories', ['name' => $name])->execute();

    }

    public function actionDelete($ids_JSON){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        return Yii::$app->db->createCommand()->delete('categories', array('in', 'id', $ids))->execute();
    }

    public function actionRename($id = -1, $new_name = 'NO_NAME_ERROR'){
        if($id <= 0 || $new_name == 'NO_NAME_ERROR') return '__ERROR';
        return Yii::$app->db->createCommand()->update('categories', ['name' => $new_name],['id'=>  intval($id)])->execute();
    }

    public function actionTrash($ids_JSON, $to_trash){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        $to_trash = $to_trash === 'true';
        return Yii::$app->db->createCommand()->update('categories', ['is_in_trash' => $to_trash], array('in', 'id', $ids))->execute();
    }

    public function actionRemoveFromTrash($ids_JSON){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        return Yii::$app->db->createCommand()->update('categories', ['is_in_trash' => false], array('in', 'id', $ids))->execute();
    }
}




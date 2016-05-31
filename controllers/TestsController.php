<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class TestsController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionIndex()
    {
        $tests_list = Yii::$app->db->createCommand('SELECT id, category_id, name, DATE_FORMAT(start_date, \'%d.%m.%Y\') AS start_date_formatted, DATE_FORMAT(end_date, \'%d.%m.%Y\') AS end_date_formatted, is_private, is_in_trash FROM tests')->queryAll();
        return json_encode($tests_list);
    }

    public function actionAdd(){
        $test_JSON = $_POST['test_JSON'];
        $test = json_decode($test_JSON, TRUE);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}

        $transaction = Yii::$app->db->beginTransaction();
        try{
            Yii::$app->db->createCommand()->insert('tests', ['category_id' => $test['category_id'], 'name'=>  htmlspecialchars($test['test_name']), 'start_date'=>date('Y-m-d G:i:s', $test['start_date']), 'end_date'=>date('Y-m-d G:i:s', $test['end_date']), 'is_private'=>$test['is_private']])->execute();
            $test_id = Yii::$app->db->getLastInsertID();

            foreach ($test['blocks'] as $block) {
                Yii::$app->db->createCommand()->insert('blocks', ['test_id' => $test_id, 'name'=>htmlspecialchars($block['name'])])->execute();
                $block_id = Yii::$app->db->getLastInsertID();

                foreach ($block['questions'] as $question) {
                    Yii::$app->db->createCommand()->insert('questions', ['test_id' => $test_id, 'block_id' => $block_id, 'name'=>htmlspecialchars($question['name']), 'img' => $question['img'], 'type' => $question['type']])->execute();
                    $question_id = Yii::$app->db->getLastInsertID();

                    foreach ($question['answers'] as $answer) {
                        Yii::$app->db->createCommand()->insert('answers', ['question_id' => $question_id, 'name'=>htmlspecialchars($answer['name']), 'img' => $answer['img'], 'is_true' => ($answer['is_true'] === 'true')])->execute();
                    }
                }
            }
            $transaction->commit();
        }catch(Exception $e) {
            //var_dump($e);
            $transaction->rollBack();
            throw $e;
        }
    }

    public function actionDelete($ids_JSON){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        return Yii::$app->db->createCommand()->delete('tests', array('in', 'id', $ids))->execute();
    }

    public function actionRename($id = -1, $new_name = 'NO_NAME_ERROR'){
        if($id <= 0 || $new_name == 'NO_NAME_ERROR') return '__ERROR';
        return Yii::$app->db->createCommand()->update('tests', ['name' => $new_name],['id'=>  intval($id)])->execute();
    }

    public function actionTrash($ids_JSON, $to_trash){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        $to_trash = $to_trash === 'true';
        return Yii::$app->db->createCommand()->update('tests', ['is_in_trash' => $to_trash], array('in', 'id', $ids))->execute();
    }

    public function actionRemoveFromTrash($ids_JSON){
        $ids = json_decode($ids_JSON);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}
        return Yii::$app->db->createCommand()->update('tests', ['is_in_trash' => false], array('in', 'id', $ids))->execute();
    }

    public function actionGet($test_id = '__ERROR'){
        if($test_id == '__ERROR') return $test_id;
    }

    public function actionChangePrivacy($id, $is_private) {
        $test_id = intval($id);
        if($test_id <= 0) {return '__ERROR';}
        return Yii::$app->db->createCommand()->update('tests', ['is_private' => ($is_private === 'true')], 'id = '.$test_id)->execute();
    }




}

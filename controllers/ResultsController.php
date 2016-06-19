<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class ResultsController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionIndex($test_id){
        if (\Yii::$app->user->isGuest){return AdminController::$guest_message;}
        $test_id = intval($test_id);
        if($test_id <= 0) {return 'WRONG_ID_ERROR';}
        $test_results = (new \yii\db\Query())
            ->from('tests_results')
            ->where(['test_id' => $test_id])
            ->all();

        foreach ($test_results as $key => $result) {
            $test_results[$key]['responses'] = Yii::$app->db->createCommand('SELECT * FROM tests_results_responses WHERE test_result_id='.$result['id'].' ORDER BY question_id ASC')->queryAll();
        }

        return json_encode($test_results);
    }



}




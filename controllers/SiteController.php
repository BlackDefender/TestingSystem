<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionLogin()
    {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    public function actionAbout()
    {
        return $this->render('about');
    }

    /*
    public function actionGetTest($id){
        $test_id = intval($id);
        if($test_id <= 0) {return '__ERROR';}

        $test = Yii::$app->db->createCommand('SELECT id, name FROM tests WHERE id='.$test_id)->queryAll();// находим тест
        $test = $test[0];

        $blocks = Yii::$app->db->createCommand('SELECT * FROM blocks WHERE test_id='.$test_id)->queryAll();// находим блоки теста

        foreach ($blocks as $block_key => $block) {

            $blocks[$block_key]['questions'] = Yii::$app->db->createCommand('SELECT * FROM questions WHERE block_id='.$block['id'])->queryAll();// к каждому блоку добавляем вопросы

            foreach ($blocks[$block_key]['questions'] as $question_key => $question) {
                // к вопросам добавляем варианты ответов, но только в том случае если это не свободный вариант ответа
                if($blocks[$block_key]['questions'][$question_key]['type'] != 'text')
                    $blocks[$block_key]['questions'][$question_key]['answers'] = Yii::$app->db->createCommand('SELECT id, question_id, name, img FROM answers WHERE question_id='.$question['id'])->queryAll();
            }
        }
        $test['blocks'] = $blocks;

        return json_encode($test);
    }

    public function actionAddTestResult(){
        $test_result_JSON = $_POST['test_result_JSON'];
        $test_result = json_decode($test_result_JSON, TRUE);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}


        $transaction = Yii::$app->db->beginTransaction();
        try{
            Yii::$app->db->createCommand()->insert('tests_results',
                ['test_id' => intval($test_result['test_id']),
                'first_name'=>  htmlspecialchars($test_result['first_name']),
                'last_name'=>  htmlspecialchars($test_result['last_name']),
                'tel'=>htmlspecialchars($test_result['tel']),
                'email'=>htmlspecialchars($test_result['email'])])->execute();

            $test_result_id = Yii::$app->db->getLastInsertID();


            $questions_ids = array();
            foreach($test_result['responses'] as $resp){
                $questions_ids[] = intval($resp['question_id']);
            }

            $answers = array();
            foreach ($questions_ids as $q_id) {
                $answers[$q_id] = (new \yii\db\Query())->select(['id', 'question_id', 'name', 'is_true'])->from('answers')->where(['question_id' => $q_id])->all();
            }

            $responses = array();
            foreach ($test_result['responses'] as $user_response) {
                $current_question_answers_list = $answers[intval($user_response['question_id'])];
                switch ($user_response['question_type']){
                    case 'radio':
                        $is_right = FALSE;
                        foreach($current_question_answers_list AS $current_question_answer){
                            if($current_question_answer['id'] == $user_response['result']){
                                $is_right = $current_question_answer['is_true'];
                                break;
                            }
                        }
                        $responses[] = ['test_result_id' => $test_result_id, 'question_id'=> intval($user_response['question_id']), 'is_right' => $is_right];
                        break;
                    case 'checkbox':
                        $is_right = FALSE;
                        $answer_ids = $user_response['result'];
                        foreach($current_question_answers_list AS $current_question_answer){
                            if($current_question_answer['is_true']){
                                if(in_array($current_question_answer['id'], $answer_ids)) $is_right = TRUE;
                                else {
                                    $is_right = FALSE;
                                    break;
                                }
                            }
                            else{
                                if(in_array($current_question_answer['id'], $answer_ids)) {
                                    $is_right = FALSE;
                                    break;
                                }
                            }
                        }
                        $responses[] = ['test_result_id' => $test_result_id, 'question_id'=> intval($user_response['question_id']), 'is_right' => $is_right];
                        break;
                    case 'text':
                        $is_right = FALSE;
                        $value = $user_response['result'];
                        foreach($current_question_answers_list AS $current_question_answer){
                            if($current_question_answer['name'] == $value){
                                $is_right = TRUE;
                                break;
                            }
                        }
                        $responses[] = ['test_result_id' => $test_result_id, 'question_id'=> intval($user_response['question_id']), 'is_right' => $is_right];
                        break;
                }
            }

            Yii::$app->db->createCommand()->batchInsert('tests_results_responses', ['test_result_id', 'question_id', 'is_right'], $responses)->execute();

            $transaction->commit();
        }catch(Exception $e) {
            $transaction->rollBack();
            throw $e;
        }
    }*/
}

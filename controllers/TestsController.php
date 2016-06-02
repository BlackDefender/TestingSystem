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

    public function actionIndex(){// список тестов для админа
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

    public function actionChangeCategory($test_id, $new_category_id) {
        $category_id = intval($new_category_id);
        if($category_id <= 0) {return '__ERROR';}
        $count = Yii::$app->db->createCommand('SELECT COUNT(*) FROM categories WHERE id='.$category_id)->queryScalar();

        if($count == 1)
            return Yii::$app->db->createCommand()->update('tests', ['category_id' => $category_id], 'id = '.$test_id)->execute();
    }



    /************************** НАБОР ФУНКЦИЙ ДЛЯ КЛИЕНТА **************************/

    // плучить список тестов (отсутствуют скрытые и помещенные в корзину тесты)
    public function actionClient(){
        $tests_list = Yii::$app->db->createCommand('SELECT id, category_id, name, DATE_FORMAT(start_date, \'%d.%m.%Y\') AS start_date_formatted, DATE_FORMAT(end_date, \'%d.%m.%Y\') AS end_date_formatted FROM tests WHERE is_private = FALSE AND is_in_trash = false')->queryAll();
        return json_encode($tests_list);
    }

    // плучить тест
    public function actionClientGet($id){
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

    public function actionAddResult(){
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
    }

}

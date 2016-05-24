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

    public function actionIndex()
    {
        $this->layout = 'admin';
        return $this->render('index');
    }
    public function actionFork()
    {
        $this->layout = 'admin';
        return $this->render('fork');
    }

    /****************************** РАБОТА С КАТЕГОРИЯМИ *******************************/
    public function actionAddCategory($name = '__ERROR'){
        if($name == '__ERROR') return $name;
        $cols_num = Yii::$app->db->createCommand()->insert('categories', ['name' => $name])->execute();
        return $cols_num;
    }

    public function actionDeleteCategory($id){
        $category_id = intval($id);
        if($category_id <= 0) {return '__ERROR';}
        $cols_num = Yii::$app->db->createCommand('DELETE FROM categories WHERE id='.$category_id)->execute();
        return $cols_num;
    }

    public function actionGetCategories(){
        $post = Yii::$app->db->createCommand('SELECT * FROM categories')->queryAll();
        return json_encode($post);
    }

    /****************************** РАБОТА С ТЕСТАМИ *********************************/
    public function actionAddTest(){
        $test_JSON = $_POST['test_JSON'];
        $test = json_decode($test_JSON, TRUE);
        if(json_last_error() != JSON_ERROR_NONE) {return '__ERROR';}

        $transaction = Yii::$app->db->beginTransaction();
        try{
            Yii::$app->db->createCommand()->insert('tests', ['category_id' => $test['category_id'], 'name'=>  htmlspecialchars($test['test_name']), 'start_date'=>date('Y-m-d G:i:s', $test['start_date']), 'end_date'=>date('Y-m-d G:i:s', $test['end_date']), 'is_private'=>$test['is_private']])->execute();
            $test_id = Yii::$app->db->getLastInsertID();

            foreach ($test['blocks'] as $block) {
                Yii::$app->db->createCommand()->insert('blocks', ['test_id' => $test_id, 'name'=>htmlspecialchars($block['name']), 'number' => $block['number']])->execute();
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
            $transaction->rollBack();
            throw $e;
        }
    }
    public function actionDeleteTest($id){
        $test_id = intval($id);
        if($test_id <= 0) {return '__ERROR';}
        return Yii::$app->db->createCommand()->delete('tests', 'id='.$id)->execute();
    }

    public function actionGetTest($test_id = '__ERROR'){
        if($test_id == '__ERROR') return $test_id;
    }

    public function actionGetTestsList(){
        $tests_list = Yii::$app->db->createCommand('SELECT id, category_id, name, DATE_FORMAT(start_date, \'%d.%m.%Y\') AS start_date_formatted, DATE_FORMAT(end_date, \'%d.%m.%Y\') AS end_date_formatted, is_private FROM tests')->queryAll();
        return json_encode($tests_list);
    }

    public function actionChangeTestPrivaty($id, $is_private) {
        $test_id = intval($id);
        if($test_id <= 0) {return '__ERROR';}
        return Yii::$app->db->createCommand()->update('tests', ['is_private' => ($is_private === 'true')], 'id = '.$test_id)->execute();
    }
    /*********************** ФАЙЛОВАЯ СИСТЕМА *************************/

    public function actionDir($dir = ''){
        $basepath = '/home/synerg00/synergy.od.ua/www/gallery/';
        $folder_thumbnail = 'http://synergy.od.ua/img/folder.png';
        $path = $basepath.$dir;
        $list = scandir($path);
        array_shift($list);// delete .
        array_shift($list);// delete ..
        natsort($list);
        $sorted_list = array();
        foreach($list as $value)
	{
            if(is_dir($path.'/'.$value)){
                $sorted_list[] = array('name'=>$value, 'type'=>'dir', 'url'=>$dir.'/'.$value, 'thumbnail'=>$folder_thumbnail);
            }
	}
        foreach($list as $value)
	{
            if(is_file($path.'/'.$value))
            {
                if(preg_match('/.jpg$|.jpeg$|.gif$|.png$|.svg$/', strtolower($value))){
                    $sorted_list[] = array('name'=>$value, 'type'=>'image', 'url'=>'http://'.$_SERVER['SERVER_NAME'].'/gallery/'.$value, 'thumbnail'=> 'http://'.$_SERVER['SERVER_NAME'].'/gallery/'.$value);
                }
            }
	}
        return json_encode($sorted_list);
    }

    public function actionCreateFolder($path)
    {
        if(file_exists($path))
        {
            echo 'FOLDER_NAME_BUZY_ERROR';
            return;
        }
        if(mkdir($path, 0777)) echo 'FOLDER_WAS_CREATED';
        else echo 'FOLDER_CREATION_ERROR';
    }


}




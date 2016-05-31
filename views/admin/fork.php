<?php

/* @var $this yii\web\View */

$this->title = 'Admin Page';

require_once 'fork-templates.php';// подключаем файл с шаблонами

?>

<ul class='toolbar btn-group'>
    <!--<li class='btn btn-success add-test-btn' title="Добавить тест"><i class="glyphicon glyphicon-plus"></i></li>-->
    <li class='btn btn-info get-tests-list-btn' title="Список тестов"><i class="glyphicon glyphicon-list"></i></li>
    <li class='btn btn-warning get-categories-list-btn' title="Список категорий"><i class="fa fa-database"></i></li>
</ul>

<ul class='toolbar btn-group' id="current-task-toolbar"></ul>
<div class='clearfix' id="work-space"></div>

<!------------------------------------------- ВСПЛЫВАЮЩИЕ ОКНА ОБЪЕКТА HELPERS ------------------------------------------>

<div id="helpers-alert" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">ОК</button>
            </div>
        </div>
    </div>
</div>


<div id="helpers-prompt" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title"></h4>
          </div>
          <div class="modal-body">
              <div class="modal-body-message"></div>
              <input type="text" class="form-control" id="helpers-prompt-input" placeholder="">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" data-dismiss="modal">Отмена</button>
              <button type="button" class="btn btn-success" id="helpers-prompt-ok-btn" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>

<div id="helpers-confirm" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title"></h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="helpers-confirm-cancel-btn" data-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-default" id="helpers-confirm-ok-btn" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
<!-------------------------------------------------------------------------------------------------------------->


<style type="text/css">
    /* ОБЩИЕ СТИЛИ */
    body{
        padding: 0;
    }
    .toolbar{
        padding: 0;
        margin: 0 0 20px;
    }
    #work-space{
        width: 100%;
        height: auto;
        background-color: transparent;
        position: relative;
    }
    /* СТИЛИ ФОРМЫ ДОБАВЛЕИЯ НОВОГО ТЕСТА */
    .add-new-test--form-header .form-control.add-new-test--date{
        width: 50px;
        text-align: center;
    }
    .add-new-test--form-header .form-control.add-new-test--date-year{
        width: 60px;
        text-align: center;
    }
    .add-new-test--category-label{
        padding: 0 10px 0 30px;
    }
    .add-new-test--form-header{
        padding: 3px;
        border-radius: 5px;
    }
    .add-new-test--form-header .form-control{
        display: inline;
        width: auto;
    }
    #add-new-test--test-name{
        width: 50%;
    }
    .add-new-test--aside-toolbar{
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 0;
    }
    .add-new-test--questions-block-wrap{
        background-color: #F7F4DC;
        margin: 20px 0 20px;
        padding: 3px;
        border-radius: 5px;
        border: 1px solid #FFF9CB;
    }
    .add-new-test--questions-block-name{
        /*margin: 0 0 15px;*/
        width: 70%;
        display: inline-block;
    }
    .add-new-test--questions-block--question-wrap{
        margin: 15px 0;
    }
    .add-new-test--questions-block-toolbar{
        text-align: right;
    }
    .add-new-test--questions-block-menu{
        float: right;
    }
    .add-new-test--questions-block--question-answer{
        margin: 5px 0;
    }
    .add-new-test--questions-block--question-answer input[type="text"]{
        width: 60%;
        display: inline-block;
    }
    .add-new-test--questions-block--question-add-answer{
        margin: 15px 0 0;
    }
    .add-new-test--questions-block--question-answer-delete{
        margin: 0 0 0 15px;
    }
    .list-edit-field{
        display: none;
    }
    .list-item-label{
        width:100%;
        height: 100%;
        padding: 15px 0 15px 21px;
        margin: -8px;
        font-weight: 400;
    }

</style>


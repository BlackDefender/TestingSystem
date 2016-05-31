<?php

/* @var $this yii\web\View */

$this->title = 'Admin Page';
?>

<ul class='toolbar btn-group'>
    <li class='btn btn-success add-test' title="Добавить тест"><i class="glyphicon glyphicon-plus"></i></li>
    <li class='btn btn-info get-tests-list' title="Список тестов"><i class="glyphicon glyphicon-list"></i></li>
    <li class='btn btn-info batch-copy-tests' title="Создать копии тестов"><i class="fa fa-clone"></i></li>
    <li class='btn btn-danger batch-remove-tests' title="Удалить тесты"><i class="glyphicon glyphicon-trash"></i></li>    
</ul>
<ul class='toolbar btn-group cats'>
    <li class='btn btn-warning categories' title="Список категорий"><i class="fa fa-database"></i></li>
</ul>
<div class='work-space clearfix'></div>




<!-- Trigger the modal with a button -->
<!--<button type="button" class="btn btn-info" data-toggle="modal" data-target="#add-category-modal-window" title="Добавить категорию"><i class="glyphicon glyphicon-plus"></i></button>-->
<!-- Modal -->
<div id="add-category-modal-window" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Добавление категории тестов</h4>
      </div>
      <div class="modal-body">
          <input type="text" class="form-control" id="add-category-modal-window-input" placeholder="Название категории">
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-default" id="add-category-btn" data-dismiss="modal">Добавить</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
      </div>
    </div>

  </div>
</div>



<style type="text/css">
    /* ОБЩИЕ СТИЛИ */
    body{
        padding: 0;
    }
    .toolbar{
        padding: 0;
        margin: 0 0 20px;
    }
    .work-space{
        width: 100%;
        height: auto;
        background-color: transparent;
        position: relative;
    }
    /* СТИЛИ ФОРМЫ ДОБАВЛЕИЯ НОВОГО ТЕСТА */
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
    .categories {
        position:relative;
        right:0;
    }
    .catId {
        display:none;
    }
</style>

<script type="text/javascript">

jQuery(function($){
    function counter(){
        return counter.count++;
    }
    counter.count = 0;

    var baseUrl = 'http://synergy.od.ua/admin/';
    var categoriesList;// [{id:'1',name:'name'}]
    var categoriesListAssociated = []; // categoriesListAssociated[id] = 'name'
    var testsList;
    var $workplace = $(".work-space");

    // загружаем и показываем список имеющихся тестов
    function getTestsList(){
        $.get(baseUrl+'get-categories',function(data){
            categoriesList = JSON.parse(data);
            categoriesList.forEach(function(item){
                categoriesListAssociated[item['id']] = item['name'];
            });
            $.get(baseUrl+'get-tests-list', function(data){
                testsList = JSON.parse(data);
                _renderTestsList();
            });
        });        
    }
    // отрисовка списка имеющихся тестов (из кэша, без обращения к серверу!)
    
    function _renderTestsList(){
        var testsListHTML = '<table id="tests-list" class="table table-bordered table-hover">\n\
                <thead>\n\
                    <tr class="bg-info text-muted">\n\
                        <th></th>\n\
                        <th class="col-xs-4">Название</th>\n\
                        <th>Категория</th>\n\
                        <th>Дата начала</th>\n\
                        <th>Дата окончания</th>\n\
                        <th><i class="fa fa-eye-slash" title="Тест скрыт"></i></th>\n\
                        <th></th>\n\
                    </tr>\n\
                </thead>\n\
                <tbody></tbody>\n\
            </table>';
        $workplace.html('');
        if ($('.add-category').html() != undefined) $('.add-category').remove();
        
        $workplace.append(testsListHTML);
        var $testsTable = $('#tests-list tbody');
        testsList.forEach(function(item){
            $testsTable.append('<tr data-test-id="'+item['id']+'">\n\
                    <td><input type="checkbox"></td>\n\
                    <td>'+item['name']+'</td>\n\
                    <td>'+categoriesListAssociated[item['category_id']]+'</td>\n\
                    <td>'+item['start_date_formatted']+'</td>\n\
                    <td>'+item['end_date_formatted']+'</td>\n\
                    <td><input class="test-list--test-privacy-property" type="checkbox" '+(item['is_private'] == 1? 'checked':'')+'></td>\n\\n\
                    <td>\n\
                        <span class="btn btn-success single-edit" title="Редактировать тест"><i class="glyphicon glyphicon-edit"></i></span>\n\
                        <span class="btn btn-info single-copy" title="Создать копию теста"><i class="fa fa-clone"></i></span>\n\
                        <span class="btn btn-warning single-remove" title="Удалить тест"><i class="glyphicon glyphicon-trash"></i></span>\n\
                    </td>\n\
                </tr>');
        });
    }

    function batchRemoveTests(){
        var selectedTestsIdsList = _getSelectedTestsIds();
        if(selectedTestsIdsList === 'NO_SELECTED_ITEMS_ERROR') return;

    }
    function batchCopyTests(){
        var selectedTestsIdsList = _getSelectedTestsIds();
        if(selectedTestsIdsList === 'NO_SELECTED_ITEMS_ERROR') return;

    }

    //Создаем новый тест
    function addTest(){
        $workplace.html('');
        if ($('.add-category').html() != undefined) $('.add-category').remove();
        $.get(baseUrl+'get-categories',function(data){
            categoriesList = JSON.parse(data);
        });
        $workplace.append('<aside class="btn-group-vertical add-new-test--aside-toolbar">\n\
            <div class="btn btn-primary add-new-test--add-block" title="Добавить раздел"><i class="fa fa-pause" style="transform:rotate(90deg);"></i></div>\n\
        </aside>');

        $workplace.append('<div class="bg-info add-new-test--form-header col-xs-11">\n\
            <input class="form-control col-xs-5" id="add-new-test--test-name" placeholder = "Название теста">\n\
            <span class="text-muted add-new-test--category-label">Категория</span><select class="form-control" name="category" id="test-category-selector"></select>\n\
            <span class = "btn btn-warning add-new-test--add-category" title="Добавить категорию"><i class="glyphicon glyphicon-plus"></i></span>\n\
            <span class="btn btn-success" title="Сохранить тест" id="save-new-test"><i class="glyphicon glyphicon-ok"></i></span>\n\
            </div>');
        categoriesList.forEach(function(item){
            $('#test-category-selector').append('<option value="'+item['id']+'">'+item['name']+'</option>');
        });

        addBlockInNewTest();
        $('#add-new-test--test-name').focus();
    }

    function addBlockInNewTest(){
        $workplace.append('<section class="col-xs-11 add-new-test--questions-block-wrap">\n\
            <div class="clearfix">\n\
                <input class="form-control add-new-test--questions-block-name" placeholder="Название раздела" type="text">\n\
                <div class="dropdown add-new-test--questions-block-menu">\n\
                    <span class="btn btn-default" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false" title="Меню">\n\
                     <i class="fa fa-navicon"></i> <span class="caret"></span>\n\
                    </span>\n\
                    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">\n\
                     <li role="presentation"><a role="menuitem" href="#" class="add-new-test--questions-block-menu-delete">Удалить раздел</a></li>\n\
                    </ul>\n\
               </div>\n\
            </div>\n\
            <div class="add-new-test--questions-block"></div>\n\
            <div class="add-new-test--questions-block-toolbar">\n\
                <div class="btn btn-primary add-new-test--add-question">Добавить вопрос</div>\n\
            </div>\n\
        </section>');
        addQuestionInBlock();
        $('.add-new-test--questions-block-wrap:last .add-new-test--questions-block-name').focus();
    }
    function deleteBlockFromNewTest(){
        $(this).parents('.add-new-test--questions-block-wrap').remove();
    }
    function addQuestionInBlock(){
        // определяем откуда был вызов функции
        // если нажатием кнопки в форме - добавляем вопрос в соответствующий блок вопросов
        // если чистый вызов функции, то в последний блок. (используется при инициализации блока)
        var $target;
        if($(this).hasClass('add-new-test--add-question') || $(this).parent().hasClass('add-new-test--add-question'))
            $target = $(this).parents('.add-new-test--questions-block-wrap').children('.add-new-test--questions-block');
        else $target = $('.add-new-test--questions-block:last');
        if($target.length === 0) return ; // а вдруг вызвали откуда не надо.
        $target.append('<div class="clearfix add-new-test--questions-block--question-wrap">\n\
                <div class="row">\n\
                    <div class="col-xs-8"><input type="test" placeholder="Вопрос" class="form-control add-new-test--questions-block--question-name"></div>\n\
                    <div class="col-xs-4 form-inline">Тип вопроса: <select class="form-control add-new-test--questions-block--test-type-select">\n\
                        <option value="radio">radio</option>\n\
                        <option value="checkbox">checkbox</option>\n\
                        <option value="text">text</option>\n\
                    </select>\n\
                    <span class="btn btn-warning add-new-test--questions-block--question-delete" title="Удалить вопрос"><i class="fa fa-minus"></i></span>\n\
                    </div>\n\
                </div>\n\
                <div class="add-new-test--questions-block--question-answers-wrap"></div>\n\
                <span class="btn btn-success add-new-test--questions-block--question-add-answer">Добавить вариант ответа</span>\n\
            </div>');

        $target.find('.add-new-test--questions-block--question-wrap:last .add-new-test--questions-block--question-add-answer').click();
        $target.find('.add-new-test--questions-block--question-wrap:last .add-new-test--questions-block--question-name').focus();
    }

    function deleteQuestionFromBlock($obj){
        $obj.parents('.add-new-test--questions-block--question-wrap').remove();
    }

    function addAnswerForQuestion(){
        var $parent = $(this).parents('.add-new-test--questions-block--question-wrap'); //контейнер вопроса
        var $target = $parent.find('.add-new-test--questions-block--question-answers-wrap');// контейнер с ответами
        var type = $parent.find('.add-new-test--questions-block--test-type-select').val();

        var counterIndex;
        if($target.attr('data-counter-index')){
            counterIndex = $target.attr('data-counter-index');
        }else{
            counterIndex = counter();
            $target.attr('data-counter-index', counterIndex);
        }

        var output = '<div class="add-new-test--questions-block--question-answer">';
        switch(type){
            case 'radio':
                output += '<input type="radio" name="answer_'+counterIndex+'"> <input class="form-control" placeholder="Ответ" type="text">';
                break;
            case 'checkbox':
                output += '<input type="checkbox" name="answer_'+counterIndex+'"> <input class="form-control" placeholder="Ответ" type="text">';
                break;
            case 'text':
                output += '<input class="form-control" type="text" name="answer_'+counterIndex+'" placeholder="Ответ">';
                break;
        }
        output += '<span class="btn btn-warning add-new-test--questions-block--question-answer-delete" title="Удалить вариант ответа"><i class="fa fa-minus"></i></span>';
        output += '</div>';
        $target.append(output);
        $target.find('input[type="text"]:last').focus();
    }

    function deleteAnswerForQuestion($obj){
        $obj.parents('.add-new-test--questions-block--question-answer').remove();
    }

    function changeQuestionType(){
        var windowScroll = $(window).scrollTop();
        var $questionContainer = $(this).parents('.add-new-test--questions-block--question-wrap');
        var $answersContainer = $questionContainer.find('.add-new-test--questions-block--question-answers-wrap');
        if($answersContainer.length === 0) return ;

        var data = [];
        $answersContainer.find('input[type="text"]').each(function(){
            data.push($(this).val());
        });
        $answersContainer.empty();
        var $addBtn = $questionContainer.find('.add-new-test--questions-block--question-add-answer');
        data.forEach(function(item){
            $addBtn.click();
            $answersContainer.find('input[type="text"]:last').val(item);
        });
        $(window).scrollTop(windowScroll);
    }
    // возвращет массив айдишников выбранных тестов в списке
    function _getSelectedTestsIds(){
        var $selectedTests = $workplace.find('#tests-list tbody tr td:first input[type="checkbox"]:checked');
        if($selectedTests.length === 0) return 'NO_SELECTED_ITEMS_ERROR';
        var selectedTestsIdsList = [];
        $selectedTests.each(function(){
            selectedTestsIdsList.push($(this).parents('tr').attr('data-test-id'));
        });
        return selectedTestsIdsList;
    }
    
    // получает список категорий
    function getCategoriesList() {
        $.get(baseUrl+'get-categories',function(data){
            categoriesList = JSON.parse(data);
            _renderCategoriesList();
        });
    }
    
    function _renderCategoriesList(){
        
        var categoriesListHTML = '<table id="categories-list" class="table table-bordered table-hover">\n\
                                <thead>\n\
                                    <tr class="bg-info text-muted">\n\
                                        <th></th>\n\
                                        <th></th>\n\
                                        <th class="col-xs-8">Название</th>\n\
                                        <th></th>\n\
                                    </tr>\n\
                                </thead>\n\
                                <tbody></tbody>\n\
                            </table>';
        $workplace.html('');
        if ($('.add-category').html() == undefined) $workplace.append("<div class='btn btn-warning add-category' data-toggle='modal' data-target='#myModal' title='Добавить категорию'><i class='glyphicon glyphicon-plus add-category'></i></div>")
        $workplace.append(categoriesListHTML);
        var $categoriesTable = $('#categories-list tbody');
        categoriesList.forEach(function(item){
            $categoriesTable.append('<tr data-cat-id="'+item['id']+'">\n\
                    <td>'+item['id']+'</td>\n\
                    <td><input type="checkbox"></td>\n\
                    <td>'+item['name']+'</td>\n\
                    <td>\n\
                        <span class="btn btn-warning edit-category" data-toggle="modal" data-target="#myModal" title="Переименовать категорию"><i class="glyphicon glyphicon-edit edit-category"></i></span>\n\
                        <span class="btn btn-danger delete-category" data-toggle="modal" data-target="#myModal" title="Удалить категорию"><i class="glyphicon glyphicon-trash delete-category"></i></span>\n\
                        <span class="btn btn-success add-test-from-category" title="Добавить тест"><i class="glyphicon glyphicon-plus add-test-from-category"></i></span>\n\
                    </td>\n\
                </tr>');
        });
        
        $workplace.append(" <div id='myModal' class='modal fade'>\n\
                            <div class='modal-dialog'>\n\
                            <div class='modal-content'>\n\
                            <div class='modal-header'><button class='close' type='button' data-dismiss='modal'>×</button>\n\
                            <h4 class='modal-title'></h4></div>\n\
                            <div class='modal-body'></div>\n\
                            <div class='modal-footer'>\n\
                            </div>\n\
                            </div>\n\
                            </div>\n\
                            </div>");   
    }

//_______________________________________
//_______________________________________
//_______________________________________

    // обработчик нажатия в рабочей области
    // идентифицируем событие и делаем что надо
    // сюда можно добавлять обработку любых событий, происходящих на бескрайних просторах .work-space
    

$workplace.bind('click', function(e){
        var $target = $(e.target);
        // изменение приватности теста
        if($target.hasClass('test-list--test-privacy-property')){
            var id = $target.parents('tr').attr('data-test-id');
            $.get(baseUrl+'change-test-privaty',{'id':id, 'is_private':$target.is( ":checked" )}, function(data){
                var text;
                if(data == 1) text = 'Изменено';
                else text = 'Ошибка';
                var $node = $('<span class="text-success"> '+text+'</span>');
                $target.parent().append($node);
                $node.animate({'opacity':0}, 2000, function(){
                    $node.remove();
                });
            });
        }
        if($target.hasClass('add-new-test--add-block') || $target.parent().hasClass('add-new-test--add-block')){
            addBlockInNewTest();
        }
        if($target.hasClass('add-new-test--add-question') || $target.parent().hasClass('add-new-test--add-question')){
            addQuestionInBlock.apply(e.target);
        }
        if($target.hasClass('add-new-test--questions-block--question-add-answer') || $target.parent().hasClass('add-new-test--questions-block--question-add-answer')){
            addAnswerForQuestion.apply(e.target);
        }
        if($target.hasClass('add-new-test--questions-block-menu-delete')){
            deleteBlockFromNewTest.apply(e.target);
        }
        if($target.hasClass('add-new-test--questions-block--question-answer-delete') || $target.parent().hasClass('add-new-test--questions-block--question-answer-delete')){
            var $obj;
            if($target.hasClass('add-new-test--questions-block--question-answer-delete'))
                $obj = $target;
            else $obj = $target.parent();
            deleteAnswerForQuestion($obj);
        }
        if($target.hasClass('add-new-test--questions-block--question-delete') || $target.parent().hasClass('add-new-test--questions-block--question-delete')){
            var $obj;
            if($target.hasClass('add-new-test--questions-block--question-delete'))
                $obj = $target;
            else $obj = $target.parent();
            deleteQuestionFromBlock($obj);
        }
        
        if ($target.hasClass('add-category')){
            $('.modal-title').html('Добавить категорию');
            $('.modal-body').html(" <input class = 'catId' type = 'text' value = ''>\n\
                                    <input class = 'catName' type = 'text' value = '' autofocus>");            
            $('.catName').attr('placeholder', 'Новая категория');
            $('.modal-footer').html("<button class='btn btn-default' type='button' data-dismiss='modal'>Закрыть</button>\n\
            <button type='button' class='btn btn-primary new-category-submit' data-dismiss='modal'>Сохранить</button>");            
        }
        
        if ($target.hasClass('new-category-submit')){
            $.get('http://synergy.od.ua/categories/add', {'name':$('.catName').val()}, function(data){
            // data - данные с сервера
                if (data != 1) {
                    alert('Не удалось создать. Почему-то... гуглим телефон центральной прачечной.');
                } else {
                  getCategoriesList();                
                }                
            });
        }
        
        if ($target.hasClass('edit-category')){
            $('.modal-title').html('Переименовать категорию');
            $('.modal-body').html(" <input class = 'catId' type = 'text' value = ''>\n\
                                    <input class = 'catName' type = 'text' value = '' autofocus>");
            $('.modal-footer').html("<button class='btn btn-default' type='button' data-dismiss='modal'>Закрыть</button>\n\
            <button type='button' class='btn btn-primary rename-category-submit' data-dismiss='modal'>Сохранить</button>");            
            $('.catId').val('');
            $('.catName').val('');
            $id = $($target).closest('tr').find('td:eq(0)').html();
            $.get(baseUrl+'get-categories',function(data){
                categoriesList = JSON.parse(data);
            });            
            categoriesList.forEach(function(item){
                if (item['id'] === $id) {                    
                    $name = item['name'];                    
                    $('.catName').val($name);
                    $('.catId').val($id);
                }
            });
        }
             
        if ($target.hasClass('rename-category-submit')){
            $.get('http://synergy.od.ua/categories/rename', {'id':$('.catId').val(), 'new_name':$('.catName').val()}, function(data){
            // data - данные с сервера
                if (data != 1) {
                    alert('Не удалось переименовать. Извините уж...');
                } else {
                  getCategoriesList();  
                }
            });    
        }
        
        if ($target.hasClass('delete-category')){
            
            $('.modal-title').html('Удалить категорию');
            $('.modal-body').html('<div class="confirm">Вы уверены? </div>');
            $('.catId').val('');
            $('.catName').css('display', 'none');
            $('.modal-footer').html("<button class='btn btn-default' type='button' data-dismiss='modal'>Закрыть</button>\n\
            <button type='button' class='btn btn-primary delete-category-submit' data-dismiss='modal'>Удалить</button>");                 
            $id = $($target).closest('tr').find('td:eq(0)').html();
            $('.catId').val($id);
        }
        
        if ($target.hasClass('delete-category-submit')){
            $.get('http://synergy.od.ua/categories/delete', {'id':$('.catId').val()}, function(data){
            // data - данные с сервера
                if (data != 1) {
                    alert('Удаление не выполнено. Попробуйте еще раз.');
                } else {
                  getCategoriesList();  
                }
            });    
        }
        
        if ($target.hasClass('add-test-from-category')){
            $id = $($target).closest('tr').find('td:eq(0)').html();
            addTest();
            $('#test-category-selector').val($id).change();

        }
    });    
    
    $workplace.bind('change', function(e){
        var $target = $(e.target);
        if($target.hasClass('add-new-test--questions-block--test-type-select')){
            changeQuestionType.apply(e.target);
        }

    });
    // инициализация
    function init(){
        // для затравки показываем список имеющихся тестов
        getTestsList();


        // обработчики для кнопок тулбара
        $('.add-test').bind('click', addTest);
        $('.get-tests-list').bind('click', getTestsList);
        $('.batch-remove-tests').bind('click', batchRemoveTests);
        $('.batch-copy-tests').bind('click', batchCopyTests);
        $('.categories').bind('click', getCategoriesList);

        $('.add-category-btn').bind('click',function(){
            var categoryName = $('#add-category-modal-window-input').val();
            $.get(baseUrl+'add-category',{'name':categoryName}, function(data){
               
            });
        });

    }
    init();
    
});
</script>

jQuery(function($){

//////// НАЧАЛЬНАЯ СТРАНИЦА
    var indexPage = (function(){
        function show(){
            // скачиваем список категорий
            $.get(globalVars.baseUrl+'categories')
                .done(function(data){
                    globalVars.categoriesList = JSON.parse(data);
                    // скачиваем список тестов
                    $.get(globalVars.baseUrl+'tests/client')
                        .done(
                            function(data){
                                globalVars.testsList = JSON.parse(data);
                                globalVars.testsListAssociated = [];
                                globalVars.testsList.forEach(function(item){
                                    globalVars.testsListAssociated[item['id']] = item;
                                });
                                render();
                            }
                        )
                        .fail(function(){
                            helpers.alert('Ошибка','Не удалось получить данные с сервера.');
                        });
                })
                .fail(function(){
                    helpers.alert('Ошибка','Не удалось получить данные с сервера.');
                });

        }
        function render(){
            var dataToRender = [];
            // создаем объект с категориями у которого ключами будут id категорий
            globalVars.categoriesList.forEach(function(category){
                dataToRender[category['id']] = category;
                dataToRender[category['id']]['tests'] = [];
            });
            // распихиваем тесты по категориям
            globalVars.testsList.forEach(function(test){
                dataToRender[test['category_id']]['tests'].push(test);
            });
            // удаляем пустые и находящиеся в корзине категории
            dataToRender.forEach(function(item){
                if(item['tests'].length === 0 || item['is_in_trash'] == 1)
                    delete dataToRender[item['id']];
            });
            // создаем функцию шаблонизатор
            var testsListTemplateFunction = _.template($('#tests-list-template').html()),
                testsListHTML = '';
            // подставляем данные в шаблон, получаем готовый HTML
            dataToRender.forEach(function(item){
                testsListHTML += testsListTemplateFunction({'categoryName':item['name'], 'tests':item['tests']});
            });
            // добавляем сгенерированный HTML на страницу
            globalVars.$workplace.empty();
            globalVars.$workplace.append(testsListHTML);
        }


        globalVars.$workplace.bind('click',function(e){
            var $target = $(e.target);
            // обработчик перехода на тест
            if($target.parents('tr').attr('data-test-id')){
                var testId = $target.parents('tr').attr('data-test-id');// получаем айдишник теста

                var startDate = moment(globalVars.testsListAssociated[testId].start_date_formatted, "DD-MM-YYYY"),
                    endDate = moment(globalVars.testsListAssociated[testId].end_date_formatted, "DD-MM-YYYY"),
                    now = moment();

                if(startDate.isAfter(now, 'day')){
                    return ;
                }
                if(endDate.isBefore(now, 'day')){
                    return ;
                }
                testPage.show(testId);// выводим тест
                window.history.pushState(null, null, '/?test-id='+testId); // меняем состояние в адресной строке
                return false;// отменяем стандартное поведение ссылки
            }
        });

        return{
            'show':show
        };
    })();

//////////// СТРАНИЦА ТЕСТА
    var testPage = (function(){
        var $blocksCollection;
        var isUserDataValid = false;
        var questionsCounter;
        var answersCounter;

        var buttonTexts = {
            done: 'Готово!',
            next: 'Далее >>'
        };

        function show(testId){
            $.get(globalVars.baseUrl+'tests/client-get', {'id':testId})
                .done(function(data){

                    if(data === 'NO_SUCH_TEST_ERROR' || data === 'WRONG_DATE_ERROR' || data === 'TEST_IN_TRASH_ERROR'){
                        indexPage.show();
                        return ;
                    }



                    var test = JSON.parse(data);
                    var testTemplateFunction = _.template($('#test-template').html());
                    var testHTML = testTemplateFunction({'test':test});
                    helpers.clearWorklace();
                    globalVars.$workplace.append(testHTML);

                    questionsCounter = $('.question').length - 4;
                    answersCounter = questionsCounter - $('#test fieldset').find('.invalid').length;
                    $blocksCollection = $('#test fieldset');
                    $($blocksCollection[0]).css('display','block');

                    $blocksCollection.iterator = 1;
                    $('.blocksCount').html('Блок ' + ($blocksCollection.iterator) + ' из ' + $blocksCollection.length);
                    $('#tel').mask('+38 (999) 999-99-99');

                    if($blocksCollection.length === 1){
                        $('#test-next-block-btn').val(buttonTexts.done);
                    }
                })
                .fail(function(){
                    helpers.alert('Ошибка','Не удалось получить данные с сервера.');
                });
        }

        function checkBlock(){
            var $questions = $($blocksCollection[$blocksCollection.iterator - 1]).find('.question');
            for (var i = 0; i < $questions.length; i++) {
                var $ans = $($questions[i]).find('input[name="'+$($questions[i]).attr('data-input-name')+'"]');
                var type = $($ans).attr("type");
                if (type == 'text') {
                    if($($ans).val() === ''){
                        return false;
                    }
                }
                if (type == 'radio') {
                    if($($questions[i]).find('input[name="'+$($questions[i]).attr('data-input-name')+'"]:checked').length === 0){
                        return false;
                    }
                }
                if (type == 'checkbox') {
                    if($($questions[i]).find('input[name="'+$($questions[i]).attr('data-input-name')+'"]:checked').length === 0){
                        return false;
                    }
                }
            }
            return true;
        }

        // отправка результатов прохождения теста
        function sendResult(){
            var test_result = {};
            test_result['test_id'] = $('#test').attr('data-test-id');
            test_result['first_name'] = $('#firstName').val();
            test_result['last_name'] = $('#lastName').val();
            test_result['tel'] = $('#tel').val();
            test_result['email'] = $('#email').val();

            var responses = [];
            $('#test .question:not(.user-data)').each(function(){
                switch ($(this).attr('data-question-type')){
                    case 'radio':
                        var answer_id = $(this).find('input:checked').attr('data-answer-id');
                        responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':answer_id});
                        break;
                    case 'checkbox':
                        var answer_ids = [];
                        $(this).find('input:checked').each(function(){
                            answer_ids.push($(this).attr('data-answer-id'));
                        });
                        responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':answer_ids});
                        break;
                    case 'text':
                        var value = $(this).find('input[type="text"]').val();
                        responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':value});
                        break;
                }
            });
            test_result['responses'] = responses;
            var test_result_json = JSON.stringify(test_result);

            $.post(globalVars.baseUrl+'tests/add-result', {'test_result_JSON':test_result_json})
                .done(function(data){
                    var str = "<div class='congrats container-fluid'>\n\
                                    <div class='finish'>\n\
                                        <div class='finish_column-1'>\n\
                                            <div>Спасибо за прохождение теста</div>\n\
                                            <a href='http://synergy.od.ua'><button type='button' class='button1'>На главную</button></a>\n\
                                        </div>\n\
                                    </div>\n\
                                </div>";
                    globalVars.$workplace.empty().append(str);
                    /*  ЗДЕСЬ ВСТАВЛЕН КОД БОЛЬШОГО СПАСИБО ЗА ПРОХОЖДЕНИЕ ТЕСТА И ОТСЫЛКА НА ГЛАВНУЮ СТРАНИЦУ   */
                    console.log(data); /*     ????? Цэ шо?       */

                }).fail(function(){
                    helpers.alert('Ошибка', 'Не удалось отправить данные на сервер.');
                });
        }

        // Проверка ввода пользовательских данных
        /*globalVars.$workplace.bind('focusout', function(e){
            var $target = $(e.target);
            if($target.context.id == 'firstName' || $target.context.id == 'lastName'){
               if ($($target).val().length > 0) {
                   $($target).parent().css('border-color','green');
                    isUserDataValid = true;
                } else {
                    $($target).parent().css('border-color','red');
                    isUserDataValid = false;
                };
            }
            if($target.context.id == 'email'){
                var str = $($target).val();
                var r = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/gmi;
                if(str.match(r) !== null){
                    $($target).parent().css('border-color','green');
                    isUserDataValid = true;
                } else {
                    $($target).parent().css('border-color','red');
                    isUserDataValid = false;
                };
            };
            if($target.context.id == 'tel'){
                var r = /X/;
                if ($target.val().match(r) == null) {
                    $($target).parent().css('border-color','green');
                    isUserDataValid = true;
                } else {
                    $($target).parent().css('border-color','red');
                    isUserDataValid = false;
                }
            }
        });*/
        function userDataIsValid(){
            function setValid() {$currentField.css('border-color', 'green');}
            function setInvalid() {$currentField.css('border-color', 'red');}

            var emailReg = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/gmi,
                telReg = /X/;

            var $currentField = $('#firstName');
            if($currentField.val().length === 0){
                setInvalid()
                return false;
            }
            else setValid();

            $currentField = $('#lastName');
            if($currentField.val().length === 0){
                setInvalid()
                return false;
            }
            else setValid();

            $currentField = $('#email');
            if($currentField.val().match(emailReg) === null){
                setInvalid()
                return false;
            }
            else setValid();

            $currentField = $('#tel');
            if ($currentField.val().match(telReg) !== null) {
                setInvalid()
                return false;
            }
            else setValid();
            return true;
        }

        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            // поменять блок в тесте при нажатии на кнопку ДАЛЕЕ
            if($target.hasClass('test-next-block-btn')){

                //если человек НЕ ответил хоть на один вопрос - дальше его не пускаем
                if(!checkBlock()){
                    helpers.alert(' ','Необходимо ответить на все вопросы блока.');
                    return;
                }
                if ($('#test-next-block-btn').val() !== buttonTexts.done) {
                    if ($blocksCollection.iterator > 0) {
                        $('#test-prev-block-btn').css('display','inline-block');
                    }
                    $blocksCollection.eq($blocksCollection.iterator - 1).hide();
                    $blocksCollection.eq($blocksCollection.iterator).show();
                    $blocksCollection.iterator++;
                    $('.blocksCount').html('Блок ' + ($blocksCollection.iterator) + ' из ' + $blocksCollection.length);
                    if($blocksCollection.iterator === $blocksCollection.length){
                        $('#test-next-block-btn').val(buttonTexts.done);
                    }
                    //если блок был последним отсылаем результат
                }
                else{
                    if (!userDataIsValid()){
                        helpers.alert ('', 'Заполните пожалуйста данные о себе');
                        return ;
                    }
                    sendResult();
                }
            }
            // поменять блок в тесте при нажатии на кнопку НАЗАД
            if($target.hasClass('test-prev-block-btn')){
                $('#test-next-block-btn').val(buttonTexts.next);
                $blocksCollection.iterator--;
                $blocksCollection.eq($blocksCollection.iterator).hide();
                $blocksCollection.eq($blocksCollection.iterator - 1).show();
                $('.blocksCount').html('Блок ' + $blocksCollection.iterator + ' из ' + $blocksCollection.length);
                var $questions = $blocksCollection.eq($blocksCollection.iterator).find('.question');
                if ($blocksCollection.iterator == 1) {
                    $('#test-prev-block-btn').css('display','none');
                }
            }
        });

        return{
            'show':show
        };
    })();

    function init(){
        $('#header-logo').bind('click', function(e){
            e.preventDefault();
            indexPage.show();
            window.history.pushState(null, null, '/');
        });

        var place = window.location.search;
        if(place === "") indexPage.show();
        var keyStr = 'test-id=';
        if(place.indexOf(keyStr)>0){
            var testId = place.substr(place.indexOf(keyStr)+keyStr.length);
            testPage.show(testId);
        }
    }
    init();

});

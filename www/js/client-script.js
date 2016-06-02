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
            globalVars.$workplace.append(testsListHTML);
        }
        globalVars.$workplace.bind('click',function(e){
            var $target = $(e.target);
            // обработчик перехода на тест
            if($target.hasClass('link-to-the-test')){
                var testId = $target.parents('tr').attr('data-test-id');// получаем айдишник теста
                testPage.show(testId);// выводим тест
                window.history.pushState(null, null, $target[0].href); // меняем состояние в адресной строке
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

        function show(testId){
            $.get(globalVars.baseUrl+'tests/client-get', {'id':testId})
                .done(function(data){
                    var test = JSON.parse(data);
                    var testTemplateFunction = _.template($('#test-template').html());
                    var testHTML = testTemplateFunction({'test':test});
                    helpers.clearWorklace();
                    globalVars.$workplace.append(testHTML);

                    $blocksCollection = $('#test fieldset');
                    $blocksCollection.iterator = 0;
                })
                .fail(function(){
                    helpers.alert('Ошибка','Не удалось получить данные с сервера.');
                });
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

                    /*  СЮДА ВСТАВИТЬ КОД БОЛЬШОГО СПАСИБО ЗА ПРОХОЖДЕНИЕ ТЕСТА И ОТСЫЛКУ НА ГЛАВНУЮ СТРАНИЦУ   */
                    console.log(data);

                }).fail(function(){
                    helpers.alert('Ошибка', 'Не удалось отправить данные на сервер.');
                });
        }


        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            // поменять блок в тесте при нажатии на кнопку ДАЛЕЕ
            if($target.hasClass('test-next-block-btn')){
                var goBack = false;
                var $questions = $blocksCollection.eq($blocksCollection.iterator).find('.question');
                $questions.each(function(){
                    var $ans = $(this).find('input[name="'+$(this).attr('data-input-name')+'"]');
                    switch ($ans.attr("type")) {
                        case 'text':
                            if($ans.val() === ''){
                                goBack = true;
                                $(this).addClass('invalid');
                                $ans.focus();
                                return false;
                            }
                            break;
                        case 'radio':
                            if($ans.filter(':checked').length === 0){
                                goBack = true;
                                $(this).addClass('invalid');
                                return false;
                            }
                            break;
                        case 'checkbox':
                            if($ans.filter(':checked').length === 0){
                                goBack = true;
                                $(this).addClass('invalid');
                                return false;
                            }
                            break;
                        default:
                            break;
                    }
                });
                //если человек НЕ ответил хоть на один вопрос - дальше его не пускаем
                if(goBack) return ;
                //если блок был последним отсылаем результат
                if($blocksCollection.iterator === $blocksCollection.length - 1){
                    sendResult();
                }
                $blocksCollection.eq($blocksCollection.iterator).toggle();
                ++$blocksCollection.iterator;
                $blocksCollection.eq($blocksCollection.iterator).toggle();
                if($blocksCollection.iterator === $blocksCollection.length - 1){
                    $('#test-next-block-btn').html('Готово!');
                }
            }
        });


        return{
            'show':show
        };
    })();

    function init(){
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

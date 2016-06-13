<!---------------------------------------- ШАБЛОНЫ СПИСКА КАТЕГОРИЙ --------------------------------------->
<script type="text/template" id="categories-toolbar-template">
    <li class="btn btn-success categories--add">Добавить категорию</li>
    <li class="btn btn-info categories--toolbar-show-trash" >Показать корзину</li>
    <li class="btn btn-warning toolbar-batch-add-to-trash" >Отправить в корзину</li>
</script>

<script type="text/template" id="categories-trash-toolbar-template">
    <li class="btn btn-success toolbar-batch-recover">Восстановить</li>
    <li class="btn btn-info categories--toolbar-show-main-list">Показать основной список</li>
    <li class="btn btn-danger toolbar-batch-delete">Удалить навсегда</li>
</script>

<script type="text/template" id="categories-list-base-template">
    <table id="categories-list" class="table table-bordered table-hover tablesorter">
        <thead>
            <tr class="bg-info text-muted">
                <th><input type="checkbox" class="select-all-items"></th>
                <th class="col-xs-10">Название</th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</script>

<script type="text/template" id="categories-list-item-template">
    <tr data-id="${item['id']}">
        <td><input type="checkbox"></td>
        <td>
            <label class="list-item-label">${item['name']}</label>
            <input class="list-edit-field form-control" type="text" value="${item['name']}">
        </td>
        <td>
            <div class="btn-group">
                <% if(mainListIsShowingNow){ %>
                    <span class="btn btn-warning single-add-to-trash" title="Отправить в корзину"><i class="glyphicon glyphicon-trash single-add-to-trash"></i></span>
                    <!--<span class="btn btn-success categories--add-test" title="Добавить тест"><i class="glyphicon glyphicon-plus categories--add-test"></i></span>-->
                <% }else{ %>
                    <span class="btn btn-success single-recover" title="Восстановить"><i class="fa fa-plus single-recover"></i></span>
                    <span class="btn btn-danger single-delete" title="Удалить навсегда"><i class="glyphicon glyphicon-trash single-delete"></i></span>
                <% } %>
            </div>
        </td>
    </tr>
</script>
<!------------------------------------------------------------------------------------------------------------->




<!---------------------------------------- ШАБЛОНЫ СПИСКА ТЕСТОВ --------------------------------------->
<script type="text/template" id="tests-list-toolbar-template">
    <li class="btn btn-success tests-list--toolbar-add-test" >Добавить тест</li>
    <li class="btn btn-info tests-list--toolbar-show-trash" >Показать корзину</li>
    <li class="btn btn-warning toolbar-batch-add-to-trash" >Отправить в корзину</li>
</script>

<script type="text/template" id="tests-list-trash-toolbar-template">
    <li class="btn btn-success toolbar-batch-recover">Восстановить</li>
    <li class="btn btn-info tests-list--toolbar-show-main-list">Показать основной список</li>
    <li class="btn btn-danger toolbar-batch-delete">Удалить навсегда</li>
</script>

<script type="text/template" id="tests-list-base-template">
    <table id="tests-list" class="table table-bordered table-hover">
        <thead>
            <tr class="bg-info text-muted">
                <th><input type="checkbox" class="select-all-items"></th>
                <th class="col-xs-3">Название</th>
                <th class="col-xs-3">Категория</th>
                <th>Дата начала</th>
                <th>Дата окончания</th>
                <th><i class="fa fa-eye-slash" title="Тест скрыт"></i></th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</script>

<script type="text/template" id="tests-list-item-template">
    <tr data-id="${item['id']}">
        <td><input type="checkbox"></td>
        <td>
            <label class="list-item-label">${item['name']}</label>
            <input class="list-edit-field form-control" type="text" value="${item['name']}">
        </td>
        <td>
            <select  class="form-control test-list--test-category">
                <% _.forEach(categories, function(category){
                    if(item['category_id']== category['id']){
                        %> <option selected value="${category['id']}">${category['name']}</option> <%
                    }else{
                        %> <option value="${category['id']}">${category['name']}</option> <%
                    }
                });%>
            </select>
        </td>
        <td>
            <label class="tests-list-item-start-date-label">${item['start_date_formatted']}</label>
            <input class="form-control tests-list-item-start-date-input" type="text" value="${item['start_date_formatted']}">
        </td>
        <td>
            <label class="tests-list-item-end-date-label">${item['end_date_formatted']}</label>
            <input class="form-control tests-list-item-end-date-input" type="text" value="${item['end_date_formatted']}">
        </td>
        <td><input class="test-list--test-privacy-property" type="checkbox" <% if(item['is_private'] == 1){ %> checked <% } %> ></td>
        <td>
            <div class="btn-group">
                <span class='btn btn-primary tests-list--get-test-results' title="Результаты тестирования"><i class="fa fa-check tests-list--get-test-results"></i></span>
                <span class="btn btn-info tests-list--single-copy" title="Создать копию теста"><i class="fa fa-clone tests-list--single-copy"></i></span>
                <span class="btn btn-info tests-list--single-edit" title="Редактировать тест"><i class="fa fa-edit tests-list--single-edit"></i></span>
                <span class="btn btn-info tests-list--single-get-link" title="Получить ссылку на тест"><i class="fa fa-link tests-list--single-get-link"></i></span>
                <% if(mainListIsShowingNow){ %>
                    <!--<span class="btn btn-success tests-list--single-edit" title="Редактировать тест"><i class="glyphicon glyphicon-edit"></i></span>-->
                    <span class="btn btn-warning single-add-to-trash" title="Отправить в корзину"><i class="glyphicon glyphicon-trash single-add-to-trash"></i></span>
                <% }else{ %>
                    <span class="btn btn-success single-recover" title="Восстановить"><i class="fa fa-plus single-recover"></i></span>
                    <span class="btn btn-danger single-delete" title="Удалить навсегда"><i class="glyphicon glyphicon-trash single-delete"></i></span>
                <% } %>
            </div>
        </td>
    </tr>
</script>
<!------------------------------------------------------------------------------------------------------------->




<!---------------------------------------- ШАБЛОНЫ ДОБАВЛЕНИЯ ТЕСТА --------------------------------------->
<script type="text/template" id="add-test-template">
    <aside class="btn-group-vertical add-new-test--aside-toolbar">
        <div class="btn btn-primary add-new-test--add-block" title="Добавить раздел"><i class="fa fa-pause" style="transform:rotate(90deg);"></i></div>
    </aside>
    <div class="bg-info add-new-test--form-header col-xs-11">
        <div>
            <input class="form-control col-xs-5" id="add-new-test--test-name" placeholder = "Название теста">
            <span class="text-muted add-new-test--category-label">Категория</span><select class="form-control" name="category" id="test-category-selector"></select>
            <!--<span class = "btn btn-warning add-new-test--add-category" title="Добавить категорию"><i class="glyphicon glyphicon-plus"></i></span>-->
            <span class="btn btn-success add-new-test--save-btn" title="Сохранить тест" id="save-new-test"><i class="glyphicon glyphicon-ok"></i></span>
        </div>
        <div>
            Дата начала:
                <input type="text" class="form-control add-new-test--date" id="add-new-test--start-date-dd" placeholder="ДД" maxlength="2">
                <input type="text" class="form-control add-new-test--date" id="add-new-test--start-date-mm" placeholder="ММ" maxlength="2">
                <input type="text" class="form-control add-new-test--date-year" id="add-new-test--start-date-yyyy" placeholder="ГГГГ" maxlength="4">
            Дата окончания:
                <input type="text" class="form-control add-new-test--date" id="add-new-test--end-date-dd" placeholder="ДД" maxlength="2">
                <input type="text" class="form-control add-new-test--date" id="add-new-test--end-date-mm" placeholder="ММ" maxlength="2">
                <input type="text" class="form-control add-new-test--date-year" id="add-new-test--end-date-yyyy" placeholder="ГГГГ" maxlength="4">
            Скрыт:
                <input type="checkbox" id="add-new-test--is-private">
        </div>
    </div>
</script>


<script type="text/template" id="add-test-categories-list-item-template">
    <option value="${item['id']}">${item['name']}</option>
</script>

<script type="text/template" id="add-test-block-template">
    <section class="col-xs-11 add-new-test--questions-block-wrap">
        <div class="clearfix">
            <input class="form-control add-new-test--questions-block-name" placeholder="Название раздела" type="text">
            <div class="dropdown add-new-test--questions-block-menu">
                <span class="btn btn-default" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false" title="Меню">
                 <i class="fa fa-navicon"></i> <span class="caret"></span>
                </span>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                 <li role="presentation"><a role="menuitem" href="#" class="add-new-test--questions-block-menu-delete">Удалить раздел</a></li>
                </ul>
           </div>
        </div>
        <div class="add-new-test--questions-block"></div>
        <div class="add-new-test--questions-block-toolbar">
            <div class="btn btn-primary add-new-test--add-question">Добавить вопрос</div>
        </div>
    </section>
</script>

<script type="text/template" id="add-test-question-template">
    <div class="clearfix add-new-test--questions-block--question-wrap">
        <div class="row">
            <div class="col-xs-8"><input type="test" placeholder="Вопрос" class="form-control add-new-test--questions-block--question-name"></div>
            <div class="col-xs-4 form-inline">Тип вопроса:
                <select class="form-control add-new-test--questions-block--test-type-select">
                    <option value="radio">radio</option>
                    <option value="checkbox">checkbox</option>
                    <option value="text">text</option>
                </select>
                <div class="add-new-test--questions-block--question-img" title="Добавить изображение"></div>
                <span class="btn btn-warning add-new-test--questions-block--question-delete" title="Удалить вопрос"><i class="fa fa-minus"></i></span>
            </div>
        </div>
        <div class="add-new-test--questions-block--question-answers-wrap"></div>
        <span class="btn btn-success add-new-test--questions-block--question-add-answer">Добавить вариант ответа</span>
    </div>
</script>
<!------------------------------------------------------------------------------------------------------------->



<!---------------------------------------- ШАБЛОНЫ РЕЗУЛЬТАТОВ ТЕСТИРОВАНИЯ --------------------------------------->
<script type="text/template" id="test-results-base-template">
    <section>
        Фильтры:<br>
        Минимальный балл:<input type="text" id="test-results--minimal-grade-filter" onkeypress="return helpers.filterInput(event,/[\d]/)"><br>
        Количество записей:<input type="text" id="test-results--maximal-count-of-items-filter" onkeypress="return helpers.filterInput(event,/[\d]/)">
    </section>
    <table id="test-results-list" class="table table-bordered table-hover tablesorter">
        <thead>
            <tr class="bg-info text-muted">
                <th><input type="checkbox" class="select-all-items"></th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Итоговая оценка</th>
                    <% for(var i=1; i <= count; ++i){%> <th><%= i %></th> <%} %>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</script>

<script type="text/template" id="test-results-item-template">
    <tr data-id="${item['id']}">
        <td><input type="checkbox"></td>
        <td>${item['first_name']}</td>
        <td>${item['last_name']}</td>
        <td>${item['tel']}</td>
        <td><a href="mailto:${item['email']}">${item['email']}</a></td>
        <td>${item['final_grade']}%</td>
        <% _.forEach(grades, function(grade){%> <td><%- grade %></td> <%});%>
    </tr>
</script>

<script type="text/template" id="test-results-table-toolbar-template">
    <li class="btn btn-info test-results--chart" title="Показать в виде диаграммы"><i class="fa fa-area-chart test-results--chart"></i></li>
    <li class="btn btn-info test-results--export-to-excel" title="Экспорт в excel"><i class="fa fa-file-excel-o test-results--export-to-excel"></i></li>

</script>
<script type="text/template" id="test-results-chart-toolbar-template">
    <li class="btn btn-info test-results--table" title="Показать в виде таблицы"><i class="fa fa-table test-results--table"></i></li>
</script>
<script type="text/template" id="test-results-chart-template">
    <div class="test-results-canvas-holder">
	<canvas id="test-results-chart" width="600" height="400"></canvas>
    </div>
</script>
<!------------------------------------------------------------------------------------------------------------->
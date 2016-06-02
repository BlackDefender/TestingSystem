<script type="text/template" id="tests-list-template">
    <section class="category-container">
        <h2>${categoryName}</h2>
        <table class="table table-bordered table-hover img-rounded">
            <thead>
                <tr class="bg-info text-muted">
                    <th class="col-xs-8">Название</th>
                    <th class="col-xs-2">Дата начала</th>
                    <th class="col-xs-2">Дата окончания</th>
                </tr>
            </thead>
            <tbody>

            <% _.forEach(tests, function(test){%>
                <tr data-test-id="${test['id']}">
                    <td>
                        <a href="/?test-id=${test['id']}" class="link-to-the-test">${test['name']}</a>
                    </td>
                    <td>${test['start_date_formatted']}</td>
                    <td>${test['end_date_formatted']}</td>
                </tr>
            <%});%>

            </tbody>
        </table>
    </section>
</script>

<script type="text/template" id="test-template">
    <form id="test" data-test-id="${test['id']}">
        <h1>${test['name']}</h1>
        <fieldset>
            <legend>Регистрационные данные</legend>
            <div class="form-group question user-data" data-input-name="firstName">
                <label for="firstName">Имя</label>
                <input id="firstName" name="firstName" type="text" class="form-control">
            </div>
            <div class="form-group question user-data" data-input-name="lastName">
                <label for="lastName">Фамилия</label>
                <input id="lastName" name="lastName" type="text" class="form-control">
            </div>
            <div class="form-group question user-data" data-input-name="tel">
                <label for="tel">Телефон</label>
                <input id="tel" name="tel" type="text" class="form-control">
            </div>
            <div class="form-group question user-data" data-input-name="email">
                <label for="email">E-mail</label>
                <input id="email" name="email" type="text" class="form-control">
            </div>
        </fieldset>

        <% _.forEach(test['blocks'], function(block){%>
            <fieldset style="display:none;">
                <% if(block['name'] !== ""){ %> <legend>${block['name']}</legend> <% } %>
                <% _.forEach(block['questions'], function(question){%>
                    <div class="question" data-input-name="question_${question['id']}" data-question-type="${question['type']}" data-question-id="${question['id']}">
                        <% if(question['name'] !== ''){ %> <h4>${question['name']}</h4> <% } %>
                        <% if(question['img'] !== ''){ %> <img class="test-question-image" src="${question['img']}"> <% } %>

                        <% if(question['type'] === 'text'){ %>
                                <label><input type="text" name="question_${question['id']}"></label>
                        <% }
                        else
                        {
                            _.forEach(question['answers'], function(answer){ %>
                                <label>
                                    <input type="${question['type']}" name="question_${question['id']}" data-answer-id="${answer['id']}">
                                    <% if(answer['name'] !== '' && question['type'] !== 'text'){%> ${answer['name']} <% } %>
                                    <% if(answer['img'] !== ''){ %> <img class="test-answer-image" src="${answer['img']}"> <% } %>
                                </label>
                            <% });
                        } %>

                    </div>
                <%});%>
            </fieldset>
        <%});%>

        <button type="button" class="btn btn-primary test-next-block-btn" id="test-next-block-btn">Далее &gt;&gt;</button>
    </form>
</script>


<script type="text/template">
</script>
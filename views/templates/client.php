<script type="text/template" id="tests-list-template">
    <div class="tests-list-header">${categoryName}</div>
    <table class="tests-list">
        <tr>
            <th class="col-xs-8">Название</th>
            <th class="col-xs-2">Дата начала</th>
            <th class="col-xs-2">Дата окончания</th>
        </tr>

        <% _.forEach(tests, function(test){%>
            <tr class='link-to-the-test' data-test-id="${test['id']}">
                <td class="col-xs-8">${test['name']}</td>
                <td class="col-xs-2">${test['start_date_formatted']}</td>
                <td class="col-xs-2">${test['end_date_formatted']}</td>
            </tr>
        <%});%>
    </table>
</script>

<script type="text/template" id="test-template">
    <form id="test" data-test-id="${test['id']}">
	<div class="info">
	    <ul>
                <li>Contact Details</li>
                <li>
                    <label for="firstname">First Name:</label>
                </li>
                <li>
                    <div class="icon form-group question user-data" data-input-name="firstName">
                        <img src="/img/image/name.png">
                        <input name="firstname" id="firstName" type="text" size="20" required>
                    </div>
                </li>
                <li>
                    <label for="secondname">Last Name:</label>
                </li>
                <li>
                    <div class="icon form-group question user-data" data-input-name="lastName">
                        <img src="img/image/name.png">
                        <input name="secondname" id="lastName" type="text" size="20" required>
                    </div>
                </li>
                <li>
                    <label for="phone">Phone:</label>
                </li>
                <li>
                    <div class="icon form-group question user-data" data-input-name="tel">
                        <img src="img/image/phone.png">
                        <input id="tel" name="tel" type="text" size="20" required placeholder="+38 (XXX) XXX-XX-XX">
                    </div>
                </li>
                <li>
                    <label for="mail">Email:</label>
                </li>
                <li>
                    <div class="icon form-group question user-data" data-input-name="email">
                        <img src="img/image/email.png">
                        <input id="email" name="mail" type="email" size="20" required>
                    </div>
                </li>
	    </ul>
            <div class="blocksCount"></div>
	</div>

	<div class="chapter">
	  <h1 class="test-name">${test['name']}</h1>
	  <% _.forEach(test['blocks'], function(block){%>
	    <fieldset style="display:none;">
	      <% if(block['name'] !== ""){ %> <legend>${block['name']}</legend> <% } %>
	      <% _.forEach(block['questions'], function(question){%>
	        <div class="question invalid" data-input-name="question_${question['id']}" data-question-type="${question['type']}" data-question-id="${question['id']}">
		  <% if(question['name'] !== ''){ %> <h4>${question['name']}</h4> <% } %>
		  <% if(question['img'] !== ''){ %> <img class="test-question-image" src="${question['img']}"> <% } %>
		  <% if(question['type'] === 'text'){ %>
		    <label><input type="text" name="question_${question['id']}"></label>
		  <%}
		  else
		  {
		    _.forEach(question['answers'], function(answer){ %>
		      <div>
			<input type="${question['type']}" name="question_${question['id']}" id="${answer['id']}" data-answer-id="${answer['id']}">
			<label for="${answer['id']}" class="${question['type']}">
                            <% if(answer['name'] !== '' && question['type'] !== 'text'){%> ${answer['name']} <% } %>
                            <% if(answer['img'] !== ''){ %> <img class="test-answer-image" src="${answer['img']}"> <% } %>
                        </label>
		      </div>
		    <% });
		} %>
	      </div>
		  <%});%>
	    </fieldset>
	      <%});%>

        <div class="buttons">
            <input type="button" class="button test-prev-block-btn" id="test-prev-block-btn" value="&lt;&lt; Назад"></button>
            <input type="button" class="button test-next-block-btn" id="test-next-block-btn" value="Далее &gt;&gt;"></button>
        <div>
	</div>

    </form>
</script>

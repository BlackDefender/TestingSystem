jQuery(function($){
    var testsResults = (function(){
        var results = [];
        var testId;
        function get(test_id){
            testId = test_id;
            $.get(globalVars.baseUrl+'results',{'test_id':test_id}, function(data){
                results = JSON.parse(data);
                if(results.length === 0){
                    console.log('NO_RESULTS_FOUND');// заменить на всплывающее окно
                    helpers.alert('Предупреждение','Данный тест еще никто не проходил.');
                    return ;
                }
                render();
            });
        }

        function render(){
            globalVars.currentController = 'testsResults';
            helpers.clearWorklace();

            //console.log(globalVars.testsList);

            var baseTemplateFunction = _.template($('#test-results-base-template').html());
            var baseTemplateHTML = baseTemplateFunction({'count':results[0]['responses'].length});
            globalVars.$workplace.append(baseTemplateHTML);


            results.forEach(function(item, index){
                var finalGrade = 0;
                results[index]['grades'] = [];
                item['responses'].forEach(function(item){
                    finalGrade += parseInt(item['is_right']);
                    results[index]['grades'].push(item['is_right']);
                });
                finalGrade = (finalGrade / item['responses'].length * 100).toFixed(2)+'%';
                results[index]['final_grade'] = finalGrade;
            });

            var listItemTemplateFunction = _.template($('#test-results-item-template').html()),
                listItemsHTML = '';
            results.forEach(function(item){
                listItemsHTML += listItemTemplateFunction({'item':item, 'grades':item['grades']});
            });
            $('#test-results-list tbody').append(listItemsHTML);

            $("#test-results-list").tablesorter({
                headers:{ 0:{sorter: false} }
            });

            globalVars.$currentTaskToolbar.append('<li class="btn btn-info test-results--export-to-excel"><i class="fa fa-file-excel-o"></i></li>')
        }

        function exportToExcel(){
            var outputFile = '<\?xml version="1.0" encoding="UTF-8" \?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
            outputFile += '\n<Worksheet ss:Name="sWorksheetTitle">\n<Table>\n';
            results.forEach(function(result){
                outputFile += '<Row>\n';
                outputFile += '<Cell><Data ss:Type="String">'+result['first_name']+'</Data></Cell>\n';
                outputFile += '<Cell><Data ss:Type="String">'+result['last_name']+'</Data></Cell>\n';
                outputFile += '<Cell><Data ss:Type="String">'+result['tel']+'</Data></Cell>\n';
                outputFile += '<Cell><Data ss:Type="String">'+result['email']+'</Data></Cell>\n';
                outputFile += '<Cell><Data ss:Type="String">'+result['final_grade']+'</Data></Cell>\n';
                outputFile += '</Row>\n';
            });
            outputFile += "</Table>\n</Worksheet>\n";
            outputFile += '</Workbook>';

            setFile(outputFile);
        }

        function setFile(data) {
            var blob, url, a;



            var testName, testCategory;
            for(var i=0; i < globalVars.testsList.length; ++i){
                if(globalVars.testsList[i]['id'] == testId){
                    testName = globalVars.testsList[i]['name'];
                    testCategory = globalVars.categoriesListAssociated[globalVars.testsList[i]['category_id']];
                    break;
                }
            }
            var d = new Date();
            var timeStamp = d.getDate()+'.'+d.getMonth()+'.'+d.getFullYear()+' '+d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds();
            var fileName = testCategory+' - '+testName+' '+timeStamp+'.xls';

            // Set data on blob.
            blob = new Blob( [ data ]/*, { type: fileType }*/);

            // Set view.
            if ( blob ) {
                // Read blob.
                url = window.URL.createObjectURL( blob );

                // Create link.
                a = document.createElement( "a" );
                // Set link on DOM.
                document.body.appendChild( a );
                // Set link's visibility.
                a.style = "display: none";
                // Set href on link.
                a.href = url;
                // Set file name on link.
                a.download = fileName;

                // Trigger click of link.
                a.click();

                // Clear.
                window.URL.revokeObjectURL( url );
            } else {
                // Handle error.
            }
        }
        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            if($target.hasClass('test-results--export-to-excel') || $target.parent().hasClass('test-results--export-to-excel')){
                exportToExcel();
            }
        });

        return{
            'get':get
        };
    })();

    window.testsResults = testsResults;
});
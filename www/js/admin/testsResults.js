jQuery(function($){
    var testsResults = (function(){
        var rawResults = [],
            filteredResults,
            testId;

        var tableToolbarTemplate = $('#test-results-table-toolbar-template').html(),
            chartToolbarTemplate = $('#test-results-chart-toolbar-template').html(),
            chartTemplate = $('#test-results-chart-template').html(),
            tableBaseTemplateFunction = _.template($('#test-results-base-template').html()),
            tableItemTemplateFunction = _.template($('#test-results-item-template').html());

        var minGradeFilter = '',
            maxCountFilter = '';

        function get(test_id){
            testId = test_id;
            globalVars.currentController = 'testsResults';
            $.get(globalVars.baseUrl+'results',{'test_id':test_id}, function(data){
                rawResults = JSON.parse(data);
                if(rawResults.length === 0){
                    console.log('NO_RESULTS_FOUND');// заменить на всплывающее окно
                    helpers.alert('Предупреждение','Данный тест еще никто не проходил.');
                    return ;
                }
                rawResults.forEach(function(item, index){
                    var finalGrade = 0;
                    rawResults[index]['grades'] = [];
                    item['responses'].forEach(function(item){
                        finalGrade += parseInt(item['is_right']);
                        rawResults[index]['grades'].push(item['is_right']);
                    });
                    finalGrade = (finalGrade / item['responses'].length * 100).toFixed(2);
                    rawResults[index]['final_grade'] = finalGrade;
                });
                filteredResults = _.cloneDeep(rawResults);
                filteredResults.sort(function(a, b){
                    return b['final_grade'] - a['final_grade'];
                });
                renderTable();
            });
        }
        function renderTable(){
            helpers.clearWorklace();

            var baseTemplateHTML = tableBaseTemplateFunction({'count':filteredResults[0]['responses'].length});
            globalVars.$workplace.append(baseTemplateHTML);

            var listItemsHTML = '';
            filteredResults.forEach(function(item){
                listItemsHTML += tableItemTemplateFunction({'item':item, 'grades':item['grades']});
            });

            $('#test-results-list tbody').append(listItemsHTML);

            $("#test-results-list").tablesorter({
                headers:{ 0:{sorter: false} }
            });

            globalVars.$currentTaskToolbar.append(tableToolbarTemplate);

            if(minGradeFilter === 0) minGradeFilter = '';
            $('#test-results--minimal-grade-filter').val(minGradeFilter);
            $('#test-results--maximal-count-of-items-filter').val(maxCountFilter);

            $.get(globalVars.baseUrl+'tests/get-questions',{'test_id': testId})
                .done(function(data){
                    console.log('inside');
                    var questions = JSON.parse(data);
                    $('.test-results-question > span').each(function(index){
                        var content = (questions[index]['name'] === '') ? '' : '<div>'+questions[index]['name']+'</div>';
                            content += (questions[index]['img'] === '') ? '' : '<img style="max-width:100%" src="'+questions[index]['img']+'">';
                        $(this).attr({
                            'data-toggle': 'tooltip',
                            'data-placement':'bottom',
                            'title': content
                        });
                        //data-toggle="tooltip" data-placement="bottom" ="
                    });
                    $('.test-results-question > span[data-toggle="tooltip"]').tooltip({html: true});
                });

        }

        function renderChart(){
            helpers.clearWorklace();
            globalVars.$workplace.append(chartTemplate);

            globalVars.$currentTaskToolbar.append(chartToolbarTemplate);

            var rawChartData = [];
            filteredResults.forEach(function(item){
                rawChartData.push(item['final_grade']);
            });
            rawChartData.sort(function(a, b){
                return a - b;
            });
            var unicChartData = _.uniq(rawChartData);
            var chartData = [];
            unicChartData.forEach(function(unic){
                var count = 0;
                rawChartData.forEach(function(raw){
                    if(raw === unic) count++;
                });
                chartData.push({ x: parseFloat(unic), y: count });
            });

            var ctx = document.getElementById("test-results-chart");
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        data: chartData
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Распределение результатов тестирования'
                    },
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom'
                        }]
                    }
                }
            });

        }

        function exportToExcel(){
            var outputFile = '<\?xml version="1.0" encoding="UTF-8" \?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
            outputFile += '\n<Worksheet ss:Name="sWorksheetTitle">\n<Table>\n';
            filteredResults.forEach(function(result){
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
            blob = new Blob( [ data ]);

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

        function applyFilters(){
            minGradeFilter = $('#test-results--minimal-grade-filter').val();
            if(minGradeFilter === '') minGradeFilter = 0;
            else minGradeFilter = parseInt(minGradeFilter);

            maxCountFilter = $('#test-results--maximal-count-of-items-filter').val();
            var data = [], rawData;
            rawData = _.cloneDeep(rawResults);
            rawData.sort(function(a, b){
                return b['final_grade'] - a['final_grade'];
            });
            rawData.forEach(function(item){
                if(parseFloat(item['final_grade']) >= minGradeFilter)
                    data.push(item);
            });
            if(maxCountFilter !== '' && data.length > parseInt(maxCountFilter)){
                data.length = maxCountFilter;
            }
            filteredResults = data;

            var listItemsHTML = '';
            filteredResults.forEach(function(item){
                listItemsHTML += tableItemTemplateFunction({'item':item, 'grades':item['grades']});
            });
            $('#test-results-list tbody').empty();
            $('#test-results-list tbody').append(listItemsHTML);

            $('#test-results-list tbody').trigger('update');
        }

        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            if($target.hasClass('test-results--export-to-excel')){
                exportToExcel();
            }
            if($target.hasClass('test-results--chart')){
                renderChart();
            }
            if($target.hasClass('test-results--table')){
                renderTable();
            }
        });
        globalVars.$workplace.bind('keyup', function(e){
            if(e.target.id === 'test-results--minimal-grade-filter' || e.target.id === 'test-results--maximal-count-of-items-filter'){
                applyFilters(e);
            }
        });
        return{
            'get':get
        };
    })();

    window.testsResults = testsResults;
});
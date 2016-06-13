jQuery(function($){
    var globalVars = {
        'baseUrl': 'http://synergy.od.ua/',
        'categoriesList': '',                     // [{id:'1',name:'name'}]
        'categoriesListAssociated': [], // categoriesListAssociated[id] = 'name'
        'testsList': '',
        'testsListAssociated': [],
        '$workplace': $('#workplace'),
        '$currentTaskToolbar': $('#current-task-toolbar'),
        'currentController': ''
    };
    window.globalVars = globalVars;
});
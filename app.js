var expenseController = (function() {

    var Expense = function (id,name, category, description, value) {
        this.id = id;
        this.name=name;
        this.category = category;
        this.description = description;
        this.value = value;
    };

    var calcTotal = function(name, category ) {
        
        var sum_name = 0, sum_category =0;
        data.names[name].forEach(function(cur){
            sum_name += cur.value;
        });
        data.expenseCategory[category].forEach(function(cur){
            sum_category += cur.value;
        });

        data.totals[name] = sum_name;
        data.totals[category] = sum_category;
    };

    var data = {
        names: {
            diana: [],
            amine: []
        },
        expenseCategory: {
            food: [],
            health: [],
            apt: [],
            misc: [],
            personalExpense: [],
        },
        totals: {
            diana: 0,
            amine: 0,
            food: 0,
            health: 0,
            apt: 0,
            misc: 0,
            personalExpense: 0,
            expense: 0,
            owe: 0,
            expenseperperson: 0,
        },
    };

    return {
        addItem: function(name,category, des, val) {
            var newExpense, ID;

            // to check if expenseCategory is empty or else set ID 
            if(data.expenseCategory[category].length > 0) {
                ID = data.expenseCategory[category][data.expenseCategory[category].length - 1].id +1;
            } else {
                ID = 0;
            }

            // to place expense in the right category array
            if (name == 'amine')
            {
                switch (category) {
                    case 'food':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'health':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'apt':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'misc':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;  
                    case 'personalExpense':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;  
                }
            }
            else if (name == 'diana')
            {
                switch (category) {
                    case 'food':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'health':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'apt':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;
                    case 'misc':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;  
                    case 'personalExpense':
                        newExpense = new Expense(ID,name,category, des,val);
                        break;  
                }
            }

            data.expenseCategory[category].push(newExpense);
            data.names[name].push(newExpense);

            return newExpense;
        },

        deleteItem: function(name,category, id) {
            
            category_ids = data.expenseCategory[category].map(function(current) {
                return current.id;
            });
            name_ids = data.names[name].map(function(current) {
                if((category == current.category) && (name == current.name)) {
                    return current.id;
                }                
            });

            category_index = category_ids.indexOf(id);
            name_index = name_ids.indexOf(id);
      
            //at the index position remove one            
            if (category_index !== -1) {
                data.expenseCategory[category].splice(category_index, 1);
            }
            if (name_index !== -1) {
                data.names[name].splice(name_index, 1);
            }
            
        },

        calculateExpense: function() {
            calcTotal('diana', 'food');
            calcTotal('diana', 'health');      
            calcTotal('diana', 'apt');      
            calcTotal('diana', 'misc');      
            calcTotal('diana', 'personalExpense');  

            calcTotal('amine', 'food');
            calcTotal('amine', 'health');      
            calcTotal('amine', 'apt');      
            calcTotal('amine', 'misc');      
            calcTotal('amine', 'personalExpense');          

            data.totals.expense = ((data.totals.diana + data.totals.amine)-data.totals.personalExpense);
            data.totals.expenseperperson = data.totals.expense/2;
    
            if (data.totals.amine < data.totals.expenseperperson)
            {
                data.totals.owe = data.totals.diana-data.totals.expenseperperson;
            }
            else
            {
                data.totals.owe = data.totals.amine-data.totals.expenseperperson;
            }

        },

        getExpense: function() {
            return {
                totalDiana : data.totals.diana,
                totalAmine : data.totals.amine,
                totalFood : data.totals.food,
                totalHealth : data.totals.health,
                totalApt : data.totals.apt,
                totalMisc : data.totals.misc,
                totalPersonalExpense : data.totals.personalExpense,
                totalExpense : data.totals.expense,
                totalOweExpense : data.totals.owe,
                totalSharedExpense : data.totals.expenseperperson,

            }
        }

    }
})();


var uiController = (function() {
    var DOMstrings = {
        inputName : '.add__person',
        inputExpenseCategory : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        dianaContainer: '.diana__list',
        miscContainer: '.misc__list',
        aptContainer: '.apt__list',
        foodContainer: '.food__list',
        healthContainer: '.health__list',
        personalExpenseContainer: '.personalexpense__list',
        
        foodLabel: '.food__value',
        healthLabel: '.health__value',
        aptLabel: '.apt__value',
        miscLabel: '.misc__value',
        personalExpenseLabel: '.personalexpense__value',
        dianaLabel: '.expense__diana--value',
        amineLabel: '.expense__amine--value',
        container: '.container', 
        expenseLabel: '.expense__value',
        oweLabel: '.owes__value',
        expenseperpersonLabel: '.expenseperperson__value',

        dateLabel: '.expense__title--month',
        oweMoneyLabel: '.owes__name',
        owesNothingLabel: '.owesNothing__name',
    };

    var formatNumber = function(num) {
        var numSplit, int , dec;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> +2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2); // method of number prototype
        
        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length -3, 3);
        }

        dec = numSplit[1];
        return  ( '$' + int + '.' + dec);

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
          return {
            name : document.querySelector(DOMstrings.inputName).value ,  // will be either amine or diana
            expenseCategory : document.querySelector(DOMstrings.inputExpenseCategory).value ,  
            description : document.querySelector (DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
        },

        addListItem: function(obj, name, expenseCategory) {

            var html, newHtml, element;
            // create HTML with placeholder text
            if (name == 'amine')
            {
                if (expenseCategory ==='food')
                {
                    element = DOMstrings.foodContainer;        
                    html = '<div class="item clearfix" id="amine-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='health')
                {
                    element = DOMstrings.healthContainer;                          
                    html = '<div class="item clearfix" id="amine-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='apt')
                {
                    element = DOMstrings.aptContainer;                          
                    html = '<div class="item clearfix" id="amine-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='misc')
                {
                    element = DOMstrings.miscContainer;                          
                    html = '<div class="item clearfix" id="amine-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='personalExpense')
                {
                    element = DOMstrings.personalExpenseContainer;                          
                    html = '<div class="item clearfix" id="amine-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
            }
            else if (name == 'diana')
            {
                if (expenseCategory ==='food')
                {
                    element = DOMstrings.foodContainer;        
                    html = '<div class="item clearfix" id="diana-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='health')
                {
                    element = DOMstrings.healthContainer;                          
                    html = '<div class="item clearfix" id="diana-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='apt')
                {
                    element = DOMstrings.aptContainer;                          
                    html = '<div class="item clearfix" id="diana-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                else if (expenseCategory ==='misc')
                {
                    element = DOMstrings.miscContainer;                          
                    html = '<div class="item clearfix" id="diana-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                else if (expenseCategory ==='personalExpense')
                {
                    element = DOMstrings.personalExpenseContainer;                          
                    html = '<div class="item clearfix" id="diana-%expenseCategory%-%id%"><div class="name">%name% - </div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
            }
           //Replace the placeholder test wih some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', name.charAt(0).toUpperCase())
            newHtml = newHtml.replace('%expenseCategory%', expenseCategory);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayExpense : function(obj) {
            console.log('display expense')
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.expense);
            document.querySelector(DOMstrings.dianaLabel).textContent = formatNumber(obj.totalDiana);
            document.querySelector(DOMstrings.amineLabel).textContent = formatNumber(obj.totalAmine);
            document.querySelector(DOMstrings.foodLabel).textContent = formatNumber(obj.totalFood);
            document.querySelector(DOMstrings.healthLabel).textContent = formatNumber(obj.totalHealth);
            document.querySelector(DOMstrings.miscLabel).textContent = formatNumber(obj.totalMisc);
            document.querySelector(DOMstrings.aptLabel).textContent = formatNumber(obj.totalApt);
            document.querySelector(DOMstrings.personalExpenseLabel).textContent = formatNumber(obj.totalPersonalExpense);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense);
            document.querySelector(DOMstrings.expenseperpersonLabel).textContent = formatNumber(obj.totalSharedExpense);
            document.querySelector(DOMstrings.oweLabel).textContent = formatNumber(obj.totalOweExpense);

            if (obj.totalAmine > obj.totalSharedExpense)
            {
                document.querySelector(DOMstrings.oweMoneyLabel).textContent = 'Diana';
                document.querySelector(DOMstrings.owesNothingLabel).textContent = 'Amine';
            }
            else if (obj.totalDiana > obj.totalSharedExpense)
            {
                document.querySelector(DOMstrings.oweMoneyLabel).textContent = 'Amine';
                document.querySelector(DOMstrings.owesNothingLabel).textContent = 'Diana';            
            }
            else {
                document.querySelector(DOMstrings.oweMoneyLabel).textContent = 'Who '
                document.querySelector(DOMstrings.owesNothingLabel).textContent = ' who?';              
            }
            console.log('Expense has been displayed');
        },

        displayMonth: function () {
            var now, year, month, months;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            day = now.getDate();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + day + ', ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll (
                DOMstrings.inputName+ ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue

            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


var controller = (function(expenseCtrl, UICtrl) {
   
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputExpenseCategory).addEventListener('change', UICtrl.changedType);        
    };
    
    
    var updateExpense = function() {
        
        // 1. Calculate the budget
        expenseCtrl.calculateExpense();
        
        // 2. Return the budget
        var expense = expenseCtrl.getExpense();
        
        // 3. Display the budget on the UI
        UICtrl.displayExpense(expense);
    };
    
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = expenseCtrl.addItem(input.name , input.expenseCategory, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.name,input.expenseCategory);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateExpense();
        }
    };
      
    var ctrlDeleteItem = function(event) {
        var expenseID, splitID, category, ID;
        
        expenseID = event.target.parentNode.parentNode.parentNode.parentNode.id;
                
        if (expenseID) {
            
            //inc-1
            splitID = expenseID.split('-');
            name = splitID[0]
            category = splitID[1];
            ID = parseInt(splitID[2]);
            
            // 1. delete the item from the data structure
            expenseCtrl.deleteItem(name,category, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(expenseID);
            
            // 3. Update and show the new budget
            updateExpense();
        }
    };
      
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayExpense({
                totalAmine: 0,
                totalDiana: 0,
                totalFood: 0,
                totalHealth: 0,
                totalMisc: 0,
                totalApt: 0,
                totalPersonalExpense: 0,
                totalExpense: 0,
                totalSharedExpense: 0,
                totalOweExpense: 0
            });
            setupEventListeners();
        }
    };
    
})(expenseController, uiController);



controller.init();
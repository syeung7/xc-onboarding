// fields
let country_dropdown = document.getElementById("country");
let state_dropdown = document.getElementById("state");
var selectedCountryID = 0
var selectedCountryCode = 0

// starting point
create_country_dropdown();

// create_country_dropdown
function create_country_dropdown() {

    // call the api and get a promise object return, parse it and get the object's value in a variable
    // using Promise.resolve(API).then(variable name)
    Promise.resolve(fun("https://xc-countries-api.herokuapp.com/api/countries/")).then((countrylist) => {

        // clean dropdown options from previous dropdown
        removeOptions(document.getElementById('country'));

        // add the default option
        let defaultOption = document.createElement('option');
        defaultOption.text = '-- Select Country --';
        country_dropdown.add(defaultOption);
        country_dropdown.selectedIndex = 0;

        //Load countries to country_dropdown
        for (var index in countrylist) {
            const option = document.createElement('option');
            option.text = countrylist[index].name;
            option.id = countrylist[index].id;
            option.code = countrylist[index].code;
            country_dropdown.add(option);
        }

        // country select change event
        const country_select = document.getElementById("country");
        country_select.addEventListener('change', create_states_dropdown);

        console.log("create_country_dropdown success");

    })
}

// create_states_dropdown
function create_states_dropdown() {
    if (selectedCountryCode != null) {
        // dynamically change url based on its country code
        var stateurl = 'https://xc-countries-api.herokuapp.com/api/countries/{}/states/'.format(selectedCountryCode);

        // call the new state api and get a promise object return,
        // parse it and get the object's value in a variable using Promise.resolve(API).then(variable name)
        Promise.resolve(fun(stateurl)).then((statelist) => {

                // clean dropdown options from previous selected country
                removeOptions(document.getElementById('state'));

                // add the default option
                let defaultOption = document.createElement('option');
                defaultOption.text = '-- Select State --';
                state_dropdown.add(defaultOption);
                state_dropdown.selectedIndex = 0;

                // load state options to state dropdown
                for (var index in statelist) {
                    const option = document.createElement('option');
                    option.text = statelist[index].name;
                    state_dropdown.add(option);
                }

            }
        )
        console.log("create_states_dropdown success")
    }

}

// once user click "add", execute following code
function add_new_country() {

    var countryName = document.getElementById('addCountryName').value;
    var countryCode = document.getElementById('addCountryCode').value;

    let data = {
        "code": countryCode,
        "name": countryName
    };

    fetch('https://xc-countries-api.herokuapp.com/api/countries/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

        .then((response) => response.json())
        .then(data => {
            console.log("add_new_country success: ", JSON.stringify(data))
            countryName = " ";
            countryCode = " ";
            create_country_dropdown()
        })
        .catch((error) => {
            console.error('Error:', error);

        })

}

// once user click "add", execute following code
function add_new_state() {

    var stateName = document.getElementById('addStateName').value;
    var stateCode = document.getElementById('addStateCode').value;

    let data = {
        "countryId": selectedCountryID,
        "code": stateCode,
        "name": stateName
    };

    fetch('https://xc-countries-api.herokuapp.com/api/states/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

        .then((response) => response.json())
        .then(data => {
            console.log("add_new_state success: ", JSON.stringify(data))
            stateName = " ";
            stateCode = " ";
            create_states_dropdown()
        })
        .catch((error) => {
            console.error('Error:', error);

        })

}

// get selected country information
function selected() {
    let countryName = document.getElementById('country');
    selectedCountryID = countryName.options[countryName.selectedIndex].id;
    selectedCountryCode = countryName.options[countryName.selectedIndex].code
    console.log("get selected country information success")
}

// string formatting helper function
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// clean dropdown options helper function
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

// make api call
function fun(url) {
    return fetch(url).then(res => res.json());
}
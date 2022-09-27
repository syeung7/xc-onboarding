const countryurl = 'https://xc-countries-api.herokuapp.com/api/countries/';

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

// my dropdowns
let country_dropdown = document.getElementById("country");
let state_dropdown = document.getElementById("state");


// creating dropdowns
function create_dropdowns() {

    // call the api and get a promise object return, parse it and get the object's value in a variable
    // using Promise.resolve(API).then(variable name)
    Promise.resolve(fun(countryurl)).then((countrylist) => {
        //Load countries to country_dropdown
        for (var index in countrylist) {
            const option = document.createElement('option');
            option.text = countrylist[index].name;
            country_dropdown.add(option);
        }

        console.log(countrylist)

        // if a country get selected, call state dropdown api
        function create_states_dropdown() {
            // get selected country code
            let country_name = document.getElementById("country").value;
            let country_code;
            for (var index in countrylist) {
                if (countrylist[index].name === country_name) country_code = countrylist[index].code;
            }

            if (country_code != null) {
                // dynamically change url based on its country code
                var stateurl = 'https://xc-countries-api.herokuapp.com/api/countries/{}/states/'.format(country_code);

                // call the new state api and get a promise object return,
                // parse it and get the object's value in a variable using Promise.resolve(API).then(variable name)
                Promise.resolve(fun(stateurl)).then((statelist) => {
                    console.log(stateurl)

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
                })
            }

        }

        // country select change event
        const country_select = document.getElementById("country");
        country_select.addEventListener('change', create_states_dropdown);

        create_states_dropdown();

    })
}

/**
 * todo: 3. Once all of that is done, create a way to
 * add a new country by sending a POST call to
 * https://xc-countries-api.herokuapp.com/api/countries/
 */

    let addCountryName = getElementById("addCountryName");
    let addCountryCode = getElementById("addCountryCode");

//function add_new_country() {

     let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xc-countries-api.herokuapp.com/api/countries/");

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = () => console.log(xhr.responseText);
    
    let data = `{ 
    "code": "${addCountryCode}",
    "name": "${addCountryName}",
    }`;

    xhr.send(data); 
    
        
    

/**
 * todo: 4. Create a way to add new states by sending a POST call to https://xc-countries-api.herokuapp.com/api/states/
 */
//function add_new_state() {
    //return;
//}

create_dropdowns()
//add_new_country()
//add_new_state()
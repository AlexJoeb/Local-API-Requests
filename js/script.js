const url = "https://randomuser.me/api/?results=12&format=json&nat=US&inc=name,email,picture,dob,location,cell&noinfo";

const gallery = $('#gallery');
const searchCont = $('.search-container');

let people = [];
let peopleShowing = [];
let currentModalPerson = null;

var states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];


const goFetch = url => {
    return fetch(url)
        .then(response => response.json());
}

$(document).on("DOMContentLoaded", (e) => {
    initSearchForm();
    goFetch(url).then(resp => {
        let result = resp.results;
        let person;
        result.forEach(p => {
            person = new Person(`${p.name.first} ${p.name.last}`, p.email, p.location, p.cell, p.dob, p.picture, p.picture);
            people.push(person);
            gallery.append(createCard(person));
        });
    }).then(resp => {
        searchCont.submit(e => {
            e.preventDefault();
            const form = $(e.target);
            const input = $(form.children()[0]);
            const val = input.val();
        
            peopleShowing.length = 0;
        
            peopleShowing = people.filter(p => p._name.toLowerCase().includes(val.toLowerCase()));
        
            refreshScreen();
        });
        
        searchCont.keyup(e => {
            e.preventDefault();
            const input = $(e.target);
            const val = input.val();
        
            peopleShowing.length = 0;
        
            peopleShowing = people.filter(p => p._name.toLowerCase().includes(val.toLowerCase()));
        
            refreshScreen();
        });
    });
});

gallery.click(e => {
    const t = $(e.target);
    let name, person = null;

    console.log(t);

    if(t.hasClass("card")){
        // Card clicked
        name = $($(t.children()[1]).children()[0]).text();
        person = getPersonByName(name);
    }else if(t.hasClass("card-info-container")){
        // Container for person info clicked
        name = $(t.children()[0]).text();
        person = getPersonByName(name);
    }else if(t.hasClass("card-name")){
        // Name Clicked
        name = t.text();
        person = getPersonByName(name);
    }else if(t.hasClass("card-text") && t.text().includes('@')){
        // E-Mail Clicked
        name = $(t.prev()).text();
        person = getPersonByName(name);
    }else if(t.hasClass("card-text") && !t.text().includes('@')){
        // City Clicked
        name = $($(t.prev()).prev()).text();
        person = getPersonByName(name);
    }else if(t.hasClass('modal-container') || t.hasClass('modal-close-btn') || $(t.parent()).hasClass('modal-close-btn')){
        $(`.modal-container`).remove();
    }else if(t.hasClass('modal-prev')){
        if(getCurrentPersonIndex() == 0) return;
        if(showingHasPeople()){
            showModal(peopleShowing[getCurrentPersonIndex() - 1]);
        }else{
            showModal(people[getCurrentPersonIndex() - 1]);
        }
    }else if(t.hasClass('modal-next')){
        if(showingHasPeople()){
            if(getCurrentPersonIndex() == peopleShowing.length - 1) return;
            showModal(peopleShowing[getCurrentPersonIndex() + 1]);
        }else{
            if(getCurrentPersonIndex() == people.length - 1) return;
            showModal(people[getCurrentPersonIndex() + 1]);
        }
    }

    if(person){
        showModal(person);
    }
});

const showModal = person => {
    $(`.modal-container`).remove();
    currentModalPerson = person;
    const modal = $(`
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person._picture.large}" alt="${person._name}'s Profile Picture">
                <h3 id="name" class="modal-name cap">${titleCase(person._name)}</h3>
                <p class="modal-text">${person._email}</p>
                <p class="modal-text cap">${person._location.city}</p>
                <hr>
                <p class="modal-text">${person._cell}</p>
                <p class="modal-text">${titleCase(person._location.street)}, ${titleCase(person._location.city)}, ${getStateInitals(person._location.state)} ${person._location.postcode}</p>
                <p class="modal-text">Birthday: ${person._birthday.date.replace(/-/g, "/").split("T")[0]}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `);
    
    gallery.append(modal);
}

const createCard = person => {
    var card = $(`
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${person._picture.medium}" alt="${person._name}'s Profile Picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person._name}</h3>
                <p class="card-text">${person._email}</p>
                <p class="card-text cap">${person._location.city}</p>
            </div>
        </div>
    `);
    return card;
}

const refreshScreen = () => {
    gallery.empty();
    if(showingHasPeople()){
        peopleShowing.forEach(p => {
            gallery.append(createCard(p));
        });
    }
}

const initSearchForm = () => {
    const form = 
    $(`
    <form id="search-form" action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
    `);
    searchCont.append(form);
}

const getPersonByName = name => {
    for(let personIndex in people){
        if(people[personIndex]._name.toLowerCase().trim().includes(name.toLowerCase().trim())){
            return people[personIndex];
        }else continue;
    }
    return null;
}

const showingHasPeople = () => {
    return peopleShowing.length > 0;
}

const titleCase = str => {
    return str.replace(/\b[A-Za-z]/g, match => {
        return match.toUpperCase();
    });
}

const getStateInitals = state => {
    for(let stateIndex in states){
        if(states[stateIndex][0].toLowerCase().trim().includes(state.toLowerCase().trim())){
            return states[stateIndex][1];
        }else continue;
    }
    return null;
}

const getCurrentPersonIndex = () => {
    // This function takes the person currently shown in the modal and finds their index in the list.
    if(showingHasPeople()){
        for(let i = 0; i < peopleShowing.length; i++){
            if(peopleShowing[i]._name.toLowerCase().trim().includes(currentModalPerson._name.toLowerCase().trim())) return i;
            else continue;
        }
    }else{
        for(let i = 0; i < people.length; i++){
            if(people[i]._name.toLowerCase().trim().includes(currentModalPerson._name.toLowerCase().trim())) return i;
            else continue;
        }
    }
    return null;
}
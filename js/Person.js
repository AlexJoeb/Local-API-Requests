class Person {
    constructor(name, email, location, cell, 
                    birthday, picture) {
        this._name = name;
        this._email = email;
        this._location = location;
        this._cell = cell;
        this._birthday = birthday;
        this._picture = picture || null;
    }

    set setName(name){
        this._name = name;
    }

    get getName() {
        return this._name;
    }

    set setEmail(email){
        this._email = email;
    }

    get getEmail() {
        return this._email;
    }

    set setLocation(location){
        this._location = location;
    }

    get getLocation() {
        return this._location;
    }

    set setCell(cell){
        this._cell = cell;
    }

    get getCell() {
        return this._cell;
    }

    set setBirthday(birthday){
        this._birthday = birthday;
    }

    get getBirthday() {
        return this._birthday.split('T')[0].replace(/-/g, '/');
    }

    set setPicture(picture){
        this._picture = picture;
    }

    get getPicture() {
        return this._picture;
    }
}

document.getElementById('subButton').addEventListener('click', function(){
    let person = document.getElementById('name').value;
    makeApiRequest(person);
})

function makeApiRequest(person){
    const peopleEndpoint = 'https://swapi.co/api/people/?search='
    fetch(peopleEndpoint+person)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        if (data.results.length > 1){
            throw Error("too many results");
        }
        let body = document.getElementById('body');
        let keys = Object.keys(data.results[0]);
        eraseChildren();
        for (let i = 0; i < keys.length-3; i++){
            let name = '';
            let world = '';
            let species = '';
            if (keys[i].includes('_')){
                nameArr = keys[i].split('_');
                let firstName = nameArr[0];
                let lastName = nameArr[1];
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
                name = firstName + ' ' + lastName;
            } else {
                name = keys[i];
                name = name.charAt(0).toUpperCase() + name.slice(1);
            }
            if (name == 'Homeworld'){
                fetch(data.results[0][keys[i]])
                .then(function (response){
                    return response.json();
                })
                .then(function (data){
                    world = data.name;
                    let child = document.createElement('p');
                    child.innerHTML = "<span> " + name + ': ' + world +  " </span>";
                    child.classList.add("attr");
                    body.appendChild(child);
                })
            } else if (name == 'Species'){
                fetch(data.results[0][keys[i]])
                .then(function (response){
                    return response.json();
                })
                .then(function (data){
                    species = data.name;
                    let child = document.createElement('p');
                    child.innerHTML = "<span> " + name + ': ' + species +  " </span>";
                    child.classList.add("attr");
                    body.appendChild(child);
            })
            } else if (name == 'Films'){
                let filmList = document.createElement('ul');
                let title = document.createElement('li');
                title.innerHTML = 'Films:'
                filmList.appendChild(title);
                const movies = {
                    1: 'New Hope',
                    2: 'Empire Strikes Back',
                    3: 'Return of the Jedi',
                    4: 'Phantom Menace',
                    5: 'Clone Wars',
                    6: 'Revenge of the Sith',
                    7: 'Force Awakens',
                    8: 'Last Jedi',
                    9: 'Rise of Skywalker'
                }
                let filmNums = [];
                for (let i = 0; i<data.results[0].films.length; i++){
                    let film = data.results[0].films[i].split('/');
                    let filmNum = film[5];
                    filmNums.push(filmNum);
                }
                filmNums.sort((a, b) => a - b);
                for (let i = 0; i < filmNums.length; i++){
                    let filmName = movies[filmNums[i]];
                    let film = document.createElement('li');
                    film.innerHTML = filmName;
                    filmList.appendChild(film);
                }
                filmList.classList.add('attr');
                body.appendChild(filmList);
            } else if (name == 'Vehicles') {
                if (data.results[0].vehicles.length > 0){
                    let vehicleList = document.createElement('ul');
                    let title = document.createElement('li');
                    title.innerHTML = 'Vehicles:';
                    vehicleList.appendChild(title);
                    for (let i = 0; i < data.results[0].vehicles.length; i++){
                        fetch(data.results[0].vehicles[i])
                        .then(function (response){
                            return response.json()
                        })
                        .then(function (data){
                            let vehicle = document.createElement('li');
                            vehicle.innerHTML = data.name;
                            vehicleList.appendChild(vehicle);
                        })
                    }
                    vehicleList.classList.add('attr');
                    body.appendChild(vehicleList);
                }
            } else if (name == 'Starships') {
                if (data.results[0].starships.length > 0){
                    let starshipList = document.createElement('ul');
                    let title = document.createElement('li');
                    title.innerHTML = 'Starships:';
                    starshipList.appendChild(title);
                    for (let i = 0; i < data.results[0].starships.length; i++){
                        fetch(data.results[0].starships[i])
                        .then(function (response){
                            return response.json()
                        })
                        .then(function (data){
                            let starship = document.createElement('li');
                            starship.innerHTML = data.name;
                            starshipList.appendChild(starship);
                        })
                    }
                    starshipList.classList.add('attr');
                    body.appendChild(starshipList);
                }
            } else {
                let child = document.createElement('p');
                child.innerHTML = "<span> " + name + ': ' + data.results[0][keys[i]] +  " </span>";
                child.classList.add("attr");
                body.appendChild(child);
            }
        }
    })
    .catch(function(error){
        eraseChildren();
        if (error.message.includes('null')){
            let child = document.createElement('p');
            child.innerHTML = "<span> Check to make sure the name is spelled correctly, if so then an entry for this character does not exist </span>";
            child.classList.add("attr");
            body.appendChild(child);
        } else if (error.message.includes('too')){
            let child = document.createElement('p');
            child.innerHTML = "<span> You must be more specific, spell out the name completely or include both the first and last name  </span>";
            child.classList.add("attr");
            body.appendChild(child);
        }
    })
}

function eraseChildren(){
    let body = document.getElementById('body');
    if (document.querySelector('.attr') != null){
        let attrs = document.querySelectorAll('.attr')
        for (let i = 0; i < attrs.length; i++){
            body.removeChild(attrs[i]);
        }
    }
}
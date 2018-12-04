$(document).ready(function () {

    // array of initial button names
    var topics = [
        "Abyssinian Cat", "Aegean Cat", "American Bobtail Cat", "American Curl Cat", "American Polydactyl Cat",
        "American Shorthair Cat", "American Wirehair Cat", "Arabian Mau Cat", "Australian Mist Cat",
        "Balinese Cat", "Bambino Cat", "Bengal Cat", "Birman Cat", "Burmese Cat", "Exotic Shorthair Cat",
        "Maine Coon Cat", "Munchkin Cat", "Scottish Fold Cat", "Siamese Cat", "Sphynx Cat"
    ];

    // appends buttons to screen
    for (var i = 0; i < topics.length; i++) {
        $('#buttons').append(`<button class='btn cat-button'>${topics[i]}</button>`);
    }

    $(document).on('click', '#create-new-btn', function (e) {
        e.preventDefault();
        $('#buttons').append(`<button class='btn cat-button'>${$('#search').val().trim()}</button>`);
    });

    // when clicking a button
    $(document).on('click', '.cat-button', function () {
        console.log(`Button Clicked: ${$(this).text()}`);
        var queryURL = `http://api.giphy.com/v1/gifs/search?q=${$(this).text()}&api_key=t0ZbKcgIFae6eHmCqLFoyUsNVYx5lbaT`;
        axios.get(queryURL)
            .then(function (response) {
                console.log(response);
                localStorage.setItem
                // array that consists of ID #s of gifs already in favorites section
                var favoritesArray = [];

                // append favorited gifs from local storage upon refresh
                // favoritesArray = JSON.parse(localStorage.getItem('favorites'));
                // console.log(favoritesArray);
                // for (var i = 0; i < favoritesArray.length; i++) {
                //     // to favorite-panel div, with i=the clicked button's data-index value
                //     appendGif('#favorites-panel', i);
                // }

                // appends 10 gifs to screen
                for (var i = 0; i < 10; i++) {
                    // to gif-panel div, with i=i
                    appendGif('#gif-panel', i);
                }

                // on click to pause or animate each gif
                $(document).on('click', '.cat-gif', function () {
                    // sets source to a variable
                    var oldSrc = $(this).attr('src');

                    // sets the current value as the new source
                    $(this).attr('src', $(this).val());

                    // sets the old src as the new value(so they swap places like in bubble sort)
                    $(this).val(oldSrc);
                });

                // on click to append gif to favorites section
                $(document).on('click', '.favorites-btn', function () {
                    // redeclare gif ID based on favorite buttons data-id attribute
                    var gifID = $(this).attr('data-id');

                    // only append if gif isn't already in favorites
                    if (!favoritesArray.includes(gifID)) {
                        // to favorite-panel div, with i=the clicked button's data-index value
                        appendGif('#favorites-panel', $(this).attr('data-index'));

                        // store favorites array in local storage after modifying the array
                        localStorage.setItem('favorites', JSON.stringify(favoritesArray));
                    }
                });

                $(document).on('click', '.favorites-remove-btn', function () {
                    // redeclare gif ID based on favorite buttons data-id attribute
                    var gifID = $(this).attr('data-id');

                    // remove the div w/ the ID corresponding to the remove button and splice ID from array
                    $(`#${gifID}-div`).remove();
                    favoritesArray.splice(favoritesArray.indexOf(gifID), 1);
                    console.log(favoritesArray);

                    // store favorites array in local storage after modifying the array
                    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
                });

                // creates gifs(with a favorite button if not creating the gif in the favorites div)
                function appendGif(location, i) {
                    // vars for id and still/animated images sources
                    var gifID = response.data.data[i].id;
                    var gifStillSrc = response.data.data[i].images.fixed_height_still.url;
                    var gifAnimatedSrc = response.data.data[i].images.fixed_height.url;

                    // appends div to screen for each gif
                    if (location === '#gif-panel') {
                        $(location).prepend(`<div class='gif-div' id='${gifID}-div'></div>`);
                    } else if (location === '#favorites-panel') {
                        $(location).append(`<div class='gif-div' id='${gifID}-div'></div>`);
                    }

                    // appends still image to div of corresponding id
                    $(`#${gifID}-div`).append(`<img class='cat-gif' src='${gifStillSrc}' 
                        id='${gifID}-gif' alt='cat gif' />`);

                    // sets the value of img to its corresponding animated img src
                    $(`#${gifID}-gif`).val(gifAnimatedSrc);

                    // appends rating to each gif div
                    $(`#${gifID}-div`).append(`<p>Rating: ${response.data.data[i].rating.toUpperCase()}</p>`);

                    if (location === '#gif-panel') {
                        // append "add to favorites" button
                        $(`#${gifID}-div`).append(`<button class='btn favorites-btn' data-index='${i}' data-id='${gifID}'>Add to favorites</button>`);

                        /* add remove from favorites button if appending to favorites panel; also check favorites array to see
                        if the gif's ID is already there so the same one can't be appended multiple times*/
                    } else if (location === '#favorites-panel') {
                        $(`#${gifID}-div`).append(`<button class='btn favorites-remove-btn' data-index='${i}' data-id='${gifID}'>Remove from favorites</button>`);
                        favoritesArray.push(gifID);
                        console.log(favoritesArray);
                    }
                }
            });
        ;
    });
});
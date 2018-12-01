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

    // when clicking a button
    $('.cat-button').on('click', function () {
        console.log(`Button Clicked: ${$(this).text()}`);
        var queryURL = `http://api.giphy.com/v1/gifs/search?q=${$(this).text()}&api_key=t0ZbKcgIFae6eHmCqLFoyUsNVYx5lbaT`;
        axios.get(queryURL)
            .then(function (response) {

                console.log(response);

                // appends 10 gifs to screen
                for (var i = 0; i < 10; i++) {
                    // vars for id and still/animated images sources
                    var gifID = response.data.data[i].id;
                    var gifStillSrc = response.data.data[i].images.fixed_height_still.url;
                    var gifAnimatedSrc = response.data.data[i].images.fixed_height.url;

                    // appends div to screen for each gif
                    $('#gif-panel').prepend(`<div class='gif-div' id='${gifID}-div'></div>`);

                    // appends still image to div of corresponding id
                    $(`#${gifID}-div`).append(`<img class='cat-gif' src='${gifStillSrc}' 
                        id='${gifID}-gif' alt='cat gif' />`);

                    // sets the value of img to its corresponding animated img src
                    $(`#${gifID}-gif`).val(gifAnimatedSrc);

                    // appends rating to each gif div
                    $(`#${gifID}-div`).append(`<p>Rating: ${response.data.data[i].rating.toUpperCase()}</p>`);
                }

                // on click to pause or animate each gif
                $('.cat-gif').on('click', function () {
                    // sets source to a variable
                    var oldSrc = $(this).attr('src');

                    // sets the current value as the new source
                    $(this).attr('src', $(this).val());

                    // sets the old src as the new value(so they swap places like in bubble sort)
                    $(this).val(oldSrc);
                });

            });
        ;
    });

});
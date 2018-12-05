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
        $('#search').val('');
    });

    // array of objects with properties relating to favorited gifs
    var favoritesArray = [];
    // append favorites to screen on refresh
    var favoritesArray = JSON.parse(localStorage.getItem("favorites"));
    $('#gif-favorites-panel').empty();
    for (var i = 0; i < favoritesArray.length; i++) {
        appendGif(favoritesArray[i].id, favoritesArray[i].img, favoritesArray[i].gif, favoritesArray[i].rating, '-favorites-');
    }

    // creates gifs(with a favorite button if not creating the gif in the favorites div)
    function appendGif(gifID, gifStillSrc, gifAnimatedSrc, gifRating, appendLocation) {
        // appends div to screen for each gif
        if (appendLocation === '-') {
            $(`#gif${appendLocation}panel`).prepend(`<div class='gif-div' id='${gifID}${appendLocation}div'></div>`);
        } else if (appendLocation === '-favorites-') {
            $(`#gif${appendLocation}panel`).append(`<div class='gif-div' id='${gifID}${appendLocation}div'></div>`);
        }
        // appends still image to div of corresponding id
        $(`#${gifID}${appendLocation}div`).append(`<img class='cat-gif' src='${gifStillSrc}' 
            id='${gifID}-gif' alt='cat gif' data-altSrc='${gifAnimatedSrc}' />`);
        // appends rating to each gif div
        $(`#${gifID}${appendLocation}div`).append(`<p class='rating-p'>Rating: ${gifRating}</p>`);
        // append "add to favorites" button
        $(`#${gifID}${appendLocation}div`).append(`<div class='btn-flexbox'></div>`)
        if (appendLocation === '-') {
            $(`#${gifID}${appendLocation}div .btn-flexbox`).append(`<button class='btn favorites-btn' data-index='${i}' data-id='${gifID}' 
                data-img='${gifStillSrc}' data-gif='${gifAnimatedSrc}' data-rating='${gifRating}'>Add to favorites</button>`);
        } else if (appendLocation === '-favorites-') {
            $(`#${gifID}${appendLocation}div .btn-flexbox`).append(`<button class='btn favorites-remove-btn' data-index='${i}' data-id='${gifID}' 
            data-img='${gifStillSrc}' data-gif='${gifAnimatedSrc}' data-rating='${gifRating}'>Remove from favorites</button>`);
        }
        $(`#${gifID}${appendLocation}div .btn-flexbox`).append(`<button class='btn download-btn' data-download='${gifAnimatedSrc}'><i class='fa fa-download'></i></button>`);
    }

    $('.download-btn').click(function() {
        window.location = $(this).attr('data-download');
    });

    // remove gif from favorites
    $(document).on('click', '.favorites-remove-btn', function () {
        // redeclare gif ID based on the favorite button's data-id attribute
        var gifID = $(this).attr('data-id');
        // get favorites from local storage
        favoritesArray = JSON.parse(localStorage.getItem("favorites"));
        // find the index w/ the ID identical to the remove button's data-id value
        var j = favoritesArray.findIndex(j => j.id === gifID);
        // splice that index out
        favoritesArray.splice(j, 1);
        // put array back into local storage
        localStorage.setItem("favorites", JSON.stringify(favoritesArray));
        // remove the div containing the gif from favorites panel
        $(`#${gifID}-favorites-div`).remove();
        console.log(favoritesArray);
    });

    // on click to pause or animate each gif
    $(document).on('click', '.cat-gif', function () {
        // sets source to a variable
        var oldSrc = $(this).attr('src');
        // sets the current data-altSrc as the new source
        $(this).attr('src', $(this).attr('data-altSrc'));
        // sets the old src as the new data-altSrc(so they swap places like in bubble sort)
        $(this).attr('data-altSrc', oldSrc);
    });

    // when clicking a button
    $(document).on('click', '.cat-button', function () {
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
                    var gifRating = response.data.data[i].rating.toUpperCase();
                    appendGif(gifID, gifStillSrc, gifAnimatedSrc, gifRating, '-');
                }
                // on click to append gif to favorites section
                $(document).on('click', '.favorites-btn', function () {
                    /* redeclare ID/img srcs based on favorite data attributes(so imgs are no longer
                        tied to their response property path in the case of multiple responses)*/
                    var gifID = $(this).attr('data-id');
                    var gifStillSrc = $(this).attr('data-img');
                    var gifAnimatedSrc = $(this).attr('data-gif');
                    var gifRating = $(this).attr('data-rating');
                    // see if there is an element in favoritesArray with the same ID you're trying to add
                    var j = favoritesArray.findIndex(j => j.id === gifID)
                    // if not, add it
                    if (j === -1) {
                        // push ID to favorites array
                        favoritesArray = JSON.parse(localStorage.getItem("favorites"));
                        favoritesArray.push(JSON.parse(`{ "id": "${gifID}", "img": "${gifStillSrc}", "gif": "${gifAnimatedSrc}", "rating": "${gifRating}"}`));
                        console.log(favoritesArray);
                        localStorage.setItem('favorites', JSON.stringify(favoritesArray));

                        // append to favorites panel
                        appendGif(gifID, gifStillSrc, gifAnimatedSrc, gifRating, '-favorites-');
                    }
                });
            });
        ;
    });

    $('.btn').hover(function () {
        $(this).css({ 'background-color': '#3f8683', 'border-color': '#3f8683' });
    }, function () {
        $(this).css({ 'background-color': '#4aaaa5', 'border-color': '#4aaaa5' });
    });
});
function getGrass(name) {


                displayGrass(name);

 
}



function displayGrass(title) {
    document.getElementById("hero").style.backgroundImage = "";
    gbifgallery=[];
    document.getElementById("title").innerHTML = title;
    document.getElementById("wiki").innerHTML = "";
    document.getElementById("swipergallery").innerHTML = "";

    getFlickr(title);
    getWiki(title);


}









function getWiki(title) {

    let wiki = underscore(title);

    var apiEndpoint = "https://en.wikipedia.org/w/api.php";
    var params = "action=parse&format=json&page=" + wiki;
    var wikiurl = apiEndpoint + "?" + params + "&origin=*";
    fetch(wikiurl)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            wikidata = response;
            wikitext = wikidata.parse.text["*"];
            var regex = /src="/gm;
            var str = wikitext;
            var subst = `src="https:`;
            var result = str.replace(regex, subst);

            var regex2 = /href="\/wiki/gm;
            var str2 = result;
            var subst2 = `target="_blank" href="https://en.wikipedia.org/wiki`;
            var result2 = str2.replace(regex2, subst2);

            document.getElementById("wiki").innerHTML = result2;
        })

        .catch(function (error) {
            console.log(error);
        });

}

function underscore(title) {
    var regex = / /gm;
    var str = title;
    var subst = `_`;
    return str.replace(regex, subst);
}


function getImages(title) {
    let wiki = underscore(title);
    var wikiurl = 'https://commons.wikimedia.org/w/api.php?action=query&generator=images&prop=imageinfo&gimlimit=12&iiurlwidth=1000&redirects=1&iiprop=url&format=json&titles=' + wiki + '&origin=*';
    fetch(wikiurl)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            images = response;
            imageArray = findAllByKey(images, 'url');
            if (imageArray.length<3) {gbif(title);} else {
            document.getElementById("hero").style.backgroundImage = "url(" + imageArray[0] + ")";
            gallery(imageArray);
            }
        })

        .catch(function (error) {
            console.log(error);
        });
}

function getFlickr(title) {
    var flickurl = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=de263df0e3f49e27607f6dada330262c&sort=relevance&per_page=12&format=json&nojsoncallback=1&text=" + title;
    fetch(flickurl)
    .then(function (response) { return response.json(); })
    .then(function (response) {
        flick = response;
        console.log(flick);

        for (i = 0; i < flick.photos.photo.length; i++) {
        let flickId = flick.photos.photo[i].id;
        let flickSecret = flick.photos.photo[i].secret;
let flickServer = flick.photos.photo[i].server;
let flickFarm = flick.photos.photo[i].farm;
let flickTitle = flick.photos.photo[i].title;
          let  flickURL = "http://farm" + flickFarm + ".static.flickr.com/" + flickServer + "/" + flickId + "_" + flickSecret + ".jpg";
          let flickImg = "<img src = " + flickURL + ">";
          let swiperwrap = "<div class='swiper-slide'>" + flickImg + "</div>";
          document.getElementById('swipergallery').innerHTML += swiperwrap;
        }
    })

    .catch(function (error) {
        console.log(error);
    });
}



function findAllByKey(obj, keyToFind) {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => (key === keyToFind)
            ? acc.concat(value)
            : (typeof value === 'object')
                ? acc.concat(findAllByKey(value, keyToFind))
                : acc
            , [])
}

function gallery(array) {
    for (i = 0; i < array.length; i++) {
        var imagenode = document.createElement("IMG");
        imagenode.setAttribute("onclick", "openImage(" + i + ")");
        imagenode.className = "galleryimage";
        imagenode.id = "galleryimage" + i;
        document.getElementById('gallery').appendChild(imagenode).setAttribute('src', array[i]);
    }

}

function openImage(id) {
    var imageModal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");

    imageModal.style.display = "block";
    oldsrc = document.getElementById("galleryimage" + id).src;
    modalImg.src = oldsrc;
    modalImg.dataset.number = id;
    var span = document.getElementsByClassName("imageModalclose")[0];

    span.onclick = function () {
        imageModal.style.display = "none";
    }
}

function nextImage() {
    var imageNumber = document.getElementById("modalImage");
    var next = parseInt(imageNumber.dataset.number) + 1;
    if (next > 11) { next = 0; }
    openImage(next);
}

function prevImage() {
    var imageNumber = document.getElementById("modalImage");
    var prev = parseInt(imageNumber.dataset.number) - 1;
    if (prev < 0) { prev = 11; }
    openImage(prev);
}



function gbif(title) {
    fetch('https://api.gbif.org/v1/species?name=' + title)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            gbifkey = response;
            


            imagekey = gbifkey.results[0].key;
            console.log(imagekey);
            gbifImage(imagekey);
        })

        .catch(function (error) {
            console.log(error);
        });
}

function gbifImage(title) {
    fetch('https://api.gbif.org/v1/occurrence/search?media_type=StillImage&limit=9&taxon_key=' + title)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            gbifarray = response;
            console.log(gbifarray);

            // results[0].media[0].identifier
            for (i = 0; i < gbifarray.results[0].media.length; i++) {
                        var gbifimage = gbifarray.results[0].media[i].identifier;
                        gbifgallery.push(gbifimage);
                        }
                        document.getElementById("hero").style.backgroundImage = "url(" + gbifgallery[0] + ")";
                            gallery(gbifgallery);
        })

        .catch(function (error) {
            console.log(error);
        });
}




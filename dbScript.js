let req = indexedDB.open("gallery", 1);

let database;

let numberOfMedia = 0;




req.addEventListener("success", function() {
    //when data is added succesfully print the result
    database = req.result;


})


req.addEventListener("upgradeneeded", function() {

    let db = req.result;

    //here we createObjectStore which has a keypath as mId which will be unique
    db.createObjectStore("media", { keyPath: "mId" })

})



req.addEventListener("error", function() {


})

function saveMedia(media) {
    if (!database) return;

    //here we create a object of data where we stroe mId as current date as mId is unique
    //mediadata stores the actual data of captured or recorded pic or video
    let data = {
        mId: Date.now(),
        mediaData: media,
    };

    //here we open the databaase for readwrite only
    let tx = database.transaction("media", "readwrite");

    //the we select the mediaobjectStore and add the object
    let mediaobjectStore = tx.objectStore("media");

    //here we add that data object in mediaobjectStore
    mediaobjectStore.add(data);

}

function viewMedia() {
    if (!database) return;

    let galleryContainer = document.querySelector(".gallery-container");

    let tx = database.transaction("media", "readonly")

    //the we select the mediaobjectStore and add the object
    let mediaobjectStore = tx.objectStore("media");

    let req = mediaobjectStore.openCursor(); //point to  the first object in objectstore
    //if there is object

    req.addEventListener("success", function() {

        cursor = req.result;

        if (cursor) {


            numberOfMedia++;

            let mediaCard = document.createElement("div");

            mediaCard.classList.add("media-card")

            mediaCard.innerHTML =
                `<div class="actual-media"></div>

            <div class="media-buttons">
                <button class="media-download">Download</button>
                <button data-mid="${cursor.value.mId}" class="media-delete">Delete</button>
            </div>`;


            let data = cursor.value.mediaData;


            let actualMediaDiv = mediaCard.querySelector(".actual-media");

            let deleteBtn = mediaCard.querySelector(".media-delete");
            let downloadBtn = mediaCard.querySelector(".media-download");


            deleteBtn.addEventListener("click", function(e) {

                let mId = Number(e.currentTarget.getAttribute("data-mid"));
                deleteMedia(mId);

                e.currentTarget.parentElement.parentElement.remove();

            })


            let type = typeof data;


            if (type == "string") {
                //means it is a image

                let image = document.createElement("img");
                image.src = data;

                downloadBtn.addEventListener("click", function() {
                    downloadMedia(data, "image");

                })

                actualMediaDiv.append(image);

            } else if (type == "object") {
                let video = document.createElement("video");

                let url = URL.createObjectURL(data);

                video.src = url;

                downloadBtn.addEventListener("click", function() {
                    downloadMedia(url, "video");

                })

                video.autoplay = true
                video.loop = true
                video.controls = true
                video.muted = true

                actualMediaDiv.append(video);

            }

            galleryContainer.append(mediaCard);
            cursor.continue();
        } else {
            if (numberOfMedia == 0) {
                galleryContainer.innerText = "No Media Present";
            }
        }


    });

}


function downloadMedia(url, type) {

    let anchor = document.createElement("a");

    anchor.href = url;

    if (type == "image") {
        anchor.download = "image.png"
    } else if (type == "video") {
        anchor.download = "video.mp4"
    }

    anchor.click();

    anchor.remove();

}

function deleteMedia(mId) {

    let tx = database.transaction("media", "readwrite");

    let mediaStore = tx.objectStore("media");

    mediaStore.delete(mId);
}
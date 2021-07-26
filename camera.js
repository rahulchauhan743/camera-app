let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let captureBtn = document.querySelector("#capture");


let body = document.querySelector("body");



//when caputrebutton get clicked so it captures the pic of image going on in videoplayer
captureBtn.addEventListener("click", function() {
    let canvas = document.createElement("canvas");

    //set canvas height and width eqaul to videoplayer height and width
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let tool = canvas.getContext("2d");

    //this draws the image in videoplayer on canvas
    //here 0,0 is corner in canvas not body
    //so it draws image taking 0,0  as left corner of canvas
    tool.drawImage(videoPlayer, 0, 0);

    //here we convert that canvas to url as canvas contains that captured image
    let url = canvas.toDataURL();

    let a = document.createElement("a");

    a.href = url;

    a.download = "image.png";

    a.click();

    //we remove the anchor tag as after captured imaage is downloaded we dont need that anchor tag
    a.remove();

})


//when recordBtn is clicked so if isrecording is false  intially means recording is not started
//so we start it by .start() which automatically calls "dataavailable" eventlisteneer
//when isRecording == true which means recording is alreading going on for stoping it we call .stop()
//which automatically calls "stop" eventlisteneer
recordBtn.addEventListener("click", function() {

    if (isRecording == true) {
        //recording ko stop krna h
        mediaRecorder.stop();
        isRecording = false;
    } else {
        //recording shuru krni hai 
        mediaRecorder.start();
        isRecording = true;
    }
})

//promiseToUseCamera is a promise based function which gets resolved when user gives camera and mic permission 
//and gets reject when user does not give permission 
//navigator is given by browser
//getUserMedia is a function for accessing permisssion
let promiseToUseCamera = navigator.mediaDevices.getUserMedia({

    video: true,
    audio: true,

});

promiseToUseCamera
    .then(function(mediaStream) {
        //when permission is given so promise is resolved so we are here
        //when we come here after promise is resolved so we come with medistream which has data of video and audio pplaying
        //it gets stored in video tag and shows in output 
        videoPlayer.srcObject = mediaStream;

        mediaRecorder = new MediaRecorder(mediaStream); //here mediaRecorder is responsible for recording

        //mediaRecorder contains video and audio 

        //when recording is started this addEventListener is executed and audio and video which is beeen reorded is saved in chinks array
        //the video being recorded is saved in chunks or pieces in array  as it comes in chunks
        mediaRecorder.addEventListener("dataavailable", function(e) {
            chunks.push(e.data);
        })

        //when we stop so all these chunks is added to form one 
        mediaRecorder.addEventListener("stop", function(e) {
            //here all chunks are combined and stored in blob
            let blob = new Blob(chunks, {
                type: "video/mp4"
            });

            //chunks is empty for next recording process
            chunks = [];


            let link = URL.createObjectURL(blob); //convert this blob into a link which can be putted into a anchor tag and downloaded

            let a = document.createElement("a");

            a.href = link;
            a.download = "video.mp4";
            a.click();

            a.remove();

        });




        //   console.log("User has given access to use the camera");
        //   console.log(mediaStream);
    })

.catch(function() {
    console.log("user has denied the access of camera");
});
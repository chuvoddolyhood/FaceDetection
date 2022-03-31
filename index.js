const video = document.getElementById('videoElm');

const loadFaceAPI = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models'); //bieu cam
}

//Open a camera
function getCameraStream(){
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video:{}})
            .then(stream => {
                video.srcObject = stream;
            })
    }
}


video.addEventListener('playing', ()=>{
    //take a photo
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
    }

    setInterval(async () => {
        //detect
        const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions(); //Add bieu cam
        // console.log('detects', detects);

        


        //draw face frame
        const resizedDetects = faceapi.resizeResults(detects,displaySize);
        canvas.getContext('2d').clearRect(0,0,displaySize.width,displaySize.height);
        //ve khung vuong
        faceapi.draw.drawDetections(canvas, resizedDetects);

        //draw expression frame
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetects);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetects);
    }, 500);
})

loadFaceAPI().then(getCameraStream());


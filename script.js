let model;
let webcam;
let maxPredictions;

const URL="./";

async function init(){

    console.log("Entré a init()");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300,300,flip);

    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);
}

async function loop(){
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict(){
    let mejorEmocion = "";
    let mayorProbabilidad = 0;
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > mayorProbabilidad) {
            mayorProbabilidad = prediction[i].probability;
            mejorEmocion = prediction[i].className;
        }
    console.log(prediction[i].className);
    console.log((prediction[i].probability*100).toFixed(2));
    document.getElementById("resultado").innerHTML = "<h2>" + mejorEmocion + "</h2>" + "<p>Confianza: " + (mayorProbabilidad * 100).toFixed(2) + "%</p>";

    }
     if (window.AppInventor) {

    window.AppInventor.setWebViewString(mejorEmocion);

}
}

document.getElementById("btnIniciar").addEventListener("click", init);

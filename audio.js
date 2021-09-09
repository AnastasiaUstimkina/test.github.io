var context;
var source, sourceJs;
var analyser;
var buffer;
var url = 'data/vcr.mp3';
var array = new Array();
var boost = 0;


window.onload = function() {
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();

        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        src.connect(analyser);
        analyser.connect(context.destination);
    
        analyser.fftSize = 256;
        array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        boost = 0;
        for (var i = 0; i < array.length; i++) {
            boost += array[i];
        }
        boost = boost / array.length;
        console.log(array);
    }
}
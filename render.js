var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(10, WIDTH/HEIGHT);
camera.position.z = 70;
scene.add(camera);

//controls

var cubes = new Array();
var cubeSize = 3;
var step = 1.5;
var coordinate = -(cubeSize + step)*5;

var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
var material = new THREE.MeshBasicMaterial({color: 0xDDDDDD});

// wireframe without diagonals
var mash = new THREE.Mesh(geometry, material);
var geo = new THREE.EdgesGeometry( mash.geometry ); // or WireframeGeometry
var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );

for(var i = 0; i <= 20; i += 2) {
	cubes[i] = new THREE.Mesh(geometry, material);
	cubes[i].position.set(coordinate, 0, 0);

	cubes[i+1] = new THREE.Mesh(geometry, material);
	cubes[i+1].position.set(0, 0, coordinate);

	coordinate += cubeSize + step;

	scene.add(cubes[i]);
	scene.add(cubes[i+1]);

	// wireframe without diagonals
	var wireframe = new THREE.LineSegments( geo, mat );
	var wireframe_ = new THREE.LineSegments( geo, mat );
	cubes[i].add(wireframe);
	cubes[i+1].add(wireframe_);
}

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


        src.connect(analyser);
        analyser.connect(context.destination);
    
		//var bufferLength = analyser.frequencyBinCount;
        //console.log(bufferLength);

        analyser.fftSize = 256;
        array = new Uint8Array(analyser.frequencyBinCount);
		
        boost = 0;
        for (var i = 0; i < array.length; i++) {
            boost += array[i];
        
        boost = boost / array.length;
      //  console.log(array);
		}

		var controls;
		controls = new THREE.OrbitControls(camera);
		controls.addEventListener('change', render);
		console.log('im here');
		function render() {
			requestAnimationFrame(render);

			analyser.getByteFrequencyData(array);
			if(typeof array === 'object' && array.length > 0) {
				//analyser.fftSize = 256;
			// array = new Uint8Array(analyser.frequencyBinCount);
			// analyser.getByteFrequencyData(array);
				console.log(typeof(array));
				boost = 0;
				for (var i = 0; i < array.length; i++) {
					boost += array[i];
				}
				boost = boost / array.length;
				//console.log(array);
				var k = 0;
				for(var i = 0; i <= 21; i += 1) {
					var scale = (array[k] + boost) / 30;
					//if (cubes[i]){
						cubes[i].scale.y = (scale < 1 ? 1 : scale);
					//}
					k += (k < array.length ? 1 : 0);
				}
			}
			
			controls.update();
			renderer.render(scene, camera);
		}
	
		render();
    }
    
}







function webGLStart() 
{
	var currentlyPressedKeys = new Int8Array(1000);
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
	initTexture();
	
	// Key events
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	function handleKeyDown(event) {
		currentlyPressedKeys[event.keyCode] = true;
		handleKeys(currentlyPressedKeys);
	}
	
	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
	}
	// End key events
	
    drawScene();
}

function initGL(cv)
{
    // first, try standard WebGL context
    gl = cv.getContext("webgl");
    if (!gl)
    {
        // if failed, try experimental one
        gl = cv.getContext("experimental-webgl");
        if (!gl)
        {
            alert("Your browser does not support WebGL");
            return;
        }
    }
    gl.viewportWidth  = cv.width;
    gl.viewportHeight = cv.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function getShader(id)
{
    var shaderScript = document.getElementById(id);
    if (!shaderScript)
    {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders()
{
    var fragmentShader = getShader( "fshader");
    var vertexShader = getShader( "vshader");
    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Could not initialise shaders");
    }
}

var neheTexture;
function initTexture() {
	neheTexture = gl.createTexture();
    neheTexture.image = new Image();
    neheTexture.image.onload = function() {
      handleLoadedTexture(neheTexture)
    }
    neheTexture.image.src = "texture.png";
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initBuffers()
{
    var vertices =  new Float32Array([
		// position       // color				// texcoord
        -0.5,  0.5, 0.0, 	1.0, 1.0, 	0.0, 	0.0, 0.0,
        0.5,  0.5, 0.0, 	1.0, 0.0,  0.0,  	1.0, 0.0,
        -0.5, -0.5, 0.0, 	0.0, 1.0, 	0.0, 	1.0, 1.0,
        0.5, -0.5, 0.0 , 	0.0, 0.0, 1.0, 		0.0, 1.0
    ]);
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 8;
    triangleVertexPositionBuffer.numItems = 4;
}

function drawScene()
{
    gl.useProgram(shaderProgram);
    var location = gl.getAttribLocation(shaderProgram, "a_position");
    var color = gl.getAttribLocation(shaderProgram, "a_color");
	var texcoord = gl.getAttribLocation(shaderProgram, "a_texcoord");
    gl.enableVertexAttribArray(location);
    gl.enableVertexAttribArray(color);
    gl.enableVertexAttribArray(texcoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 32, 0);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 32, 12);
    gl.vertexAttribPointer(texcoord, 2, gl.FLOAT, false, 32, 28);
	
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, neheTexture);
	var textureLocation = gl.getUniformLocation(shaderProgram, "uSampler");
	gl.uniform1i(textureLocation, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangleVertexPositionBuffer.numItems);
	// requestAnimationFrame(drawScene);
}

function handleKeys(currentlyPressedKeys) {
	if (currentlyPressedKeys[33]) {
		// Page Up
	}
	if (currentlyPressedKeys[34]) {
		// Page Down
	}
	if (currentlyPressedKeys[37]) {
		// Left cursor key
		console.log("#------------------ Bam phim Left");
	}
	if (currentlyPressedKeys[39]) {
		// Right cursor key
		console.log("#------------------ Bam phim Right");
	}
	if (currentlyPressedKeys[38]) {
		// Up cursor key
		console.log("#------------------ Bam phim Up");
	}
	if (currentlyPressedKeys[40]) {
		// Down cursor key
		console.log("#------------------ Bam phim Down");
	}
}
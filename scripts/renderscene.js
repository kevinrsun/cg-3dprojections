let view;
let ctx;
let scene;
let start_time;

const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
//const inside = 0;   binary 000000
const FLOAT_EPSILON = 0.000001;

// Initialization function - called when web page loads
function init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    // initial scene... feel free to change this
    scene = {
        /*
        view: {
            type: "parallel",
            prp: [0, 0, 10],
            srp: [0, 0, 0],
            vup: [0, 1, 0],
            clip: [-4, 20, -1, 17, 5, 75]
        },
        models: [
            {
                type: "cube",
                center: [4, 4, -10],
                width: 8,
                height: 8,
                depth: 8
            },
            {
                type: "cylinder",
                center: [12, 10, -49],
                radius: 1.5,
                height: 5,
                sides: 12,
                animation: {
                    axis: 'y',
                    rps: 0.5
                }
            }
        ] */
        
        view: {
            type: 'perspective',
            /*
            prp: Vector3(10, 9, 0),
            srp: Vector3(10, 9, -30),
            vup: Vector3(0, 1, 0),
            clip: [-11, 11, -11, 11, 30, 100] */
            
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100] 
            //use example in class to check if correct
        },
        models: [
            {
                type: 'generic',
                vertices: [
                    
                    Vector4(0, 0, -30, 1),
                    Vector4(20, 0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4(0, 12, -30, 1),
                    Vector4(0, 0, -60, 1),
                    Vector4(20, 0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4(0, 12, -60, 1) 
                    /*
                    Vector4( 0,  0, -30, 1),
                    Vector4(20,  0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4( 0, 12, -30, 1),
                    Vector4( 0,  0, -60, 1),
                    Vector4(20,  0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4( 0, 12, -60, 1) */
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 5],
                    [0, 5],
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ],
                matrix: new Matrix(4, 4)
            }, 
            {
                type: 'cube',
                center: [4, 4, -10],
                width: 8,
                height: 8,
                depth: 8
            }
        ] 
    };

    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);
    
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    window.requestAnimationFrame(animate);
}

// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;
    
    // step 2: transform models based on time
    // TODO: implement this!
    let rotate_x = new Matrix(4,4);

    mat4x4RotateX(rotate_x, time+1);


    // step 3: draw scene
    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    //window.requestAnimationFrame(animate);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    console.log(scene);

    // TODO: implement drawing here!
    // For each model, for each edge

    //check which scene view type
    if (scene.view.type == 'perspective'){
        //look through the list of models under 'perspective'
        //create N_per for transforms + M_per
        let N_per = mat4x4Perspective(scene.view.prp, scene.view.srp,
            scene.view.vup, scene.view.clip);
        let M_per = new Matrix(4,4);
        M_per = mat4x4MPer();
        for (let i = 0; i < scene.models.length; i++){
            //check the model type
            if (scene.models[i].type == 'generic'){
                for (j = 0; j < scene.models[i].edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < scene.models[i].edges[j].length-1; k++){
                        //find indices
                        let index0 = scene.models[i].edges[j][k];
                        let index1 = scene.models[i].edges[j][k+1];

                        let p0 = scene.models[i].vertices[index0];
                        let p1 = scene.models[i].vertices[index1];

                        let line = {pt0: p0, pt1: p1};
                        
                        //console.log(line);
                        /*
                        let identity = new Matrix(4,4);
                        mat4x4Identity(identity);
                        line.pt0 = Matrix.multiply([identity, line.pt0]);
                        line.pt1 = Matrix.multiply([identity, line.pt1]); */

                        line.pt0 = Matrix.multiply([N_per, line.pt0]);
                        line.pt1 = Matrix.multiply([N_per, line.pt1]);

                        let z_min = ((-scene.view.clip[4])/scene.view.clip[5]);
                        
                        let placeholder_line = clipLinePerspective(line, z_min);
                        line.pt0 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        line.pt1 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        console.log(line); 
                        
                        if (line != null){
                            //m_per
                            line.pt0 = Matrix.multiply([M_per, line.pt0]);
                            line.pt1 = Matrix.multiply([M_per, line.pt1]);
                            console.log(line.pt0);
                            
                            //change viewport matrix
                            let V = new Matrix(4,4);
                            V.values = [[(view.width/2), 0, 0, (view.width/2)],
                                        [0, (view.height/2), 0, (view.height/2)],
                                        [0, 0, 1, 0],
                                        [0, 0, 0, 1]];
                            line.pt0 = Matrix.multiply([V, line.pt0]);
                            line.pt1 = Matrix.multiply([V, line.pt1]);

                            //convert to cartesian
                            let twoD_p0 = {x: line.pt0.x/line.pt0.w,
                                           y: line.pt0.y/line.pt0.w,
                                           z: line.pt0.z/line.pt0.w};
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                            console.log(line)
                        }
                    }
                }
            } else if (scene.models.type == 'cube'){
                //center x, y, z values
                let cube_x = scene.models.center[0];
                let cube_y = scene.models.center[1];
                let cube_z = scene.models.center[2];

                let lbf; //left, bottom, front
                let rbf; //right, bottom, front
                let ltf; //left, top, front
                let rtf; //right, top, front
                let lbb; //left, bottom, back
                let rbb; //right, bottom, back
                let ltb; //left, top, back
                let rtb; //right, top, back

                let cube = {
                    vertices: [
                    //calculate edges and vertices from center, width, height, and depth
                    // left bottom front = center + 1/2 depth - 1/2 width - 1/2 height
                    // right bottom front = center + 1/2 depth + 1/2 width - 1/2 height
                    // left top front = center + 1/2 depth - 1/2 width + 1/2 height
                    // right top front = center + 1/2 depth + 1/2 width + 1/2 height

                    // left bottom back = center - 1/2 depth - 1/2 width - 1/2 height
                    // right bottom back = center - 1/2 depth + 1/2 width - 1/2 height
                    // left top back = center - 1/2 depth - 1/2 width + 1/2 height
                    // right top back = center - 1/2 depth + 1/2 width + 1/2 height
                        //front
                         //left
                        lbf = new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
                        ltf = new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
                         // right
                        rbf = new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
                        rtf = new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
                        //back
                         //left
                        lbb = new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
                        ltb = new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z - (depth/2), 1),
                         //right
                        rbb = new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
                        rtb = new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z - (depth/2), 1)
                    ],
                    edges: [
                        [0, 1, 2, 3, 0],
                        [4, 5, 6, 7, 4],
                        [0, 4],
                        [1, 5],
                        [2, 6],
                        [3, 7]
                    ]

                };

                for (j = 0; j < scene.models[i].edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < scene.models[i].edges[j].length-1; k++){
                        //find indices
                        let index0 = scene.models[i].edges[j][k];
                        let index1 = scene.models[i].edges[j][k+1];

                        let p0 = scene.models[i].vertices[index0];
                        let p1 = scene.models[i].vertices[index1];

                        let line = {pt0: p0, pt1: p1};
                        
                        //console.log(line);
                        /*
                        let identity = new Matrix(4,4);
                        mat4x4Identity(identity);
                        line.pt0 = Matrix.multiply([identity, line.pt0]);
                        line.pt1 = Matrix.multiply([identity, line.pt1]); */

                        line.pt0 = Matrix.multiply([N_per, line.pt0]);
                        line.pt1 = Matrix.multiply([N_per, line.pt1]);

                        let z_min = ((-scene.view.clip[4])/scene.view.clip[5]);
                        
                        let placeholder_line = clipLinePerspective(line, z_min);
                        line.pt0 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        line.pt1 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        console.log(line); 
                        
                        if (line != null){
                            //m_per
                            line.pt0 = Matrix.multiply([M_per, line.pt0]);
                            line.pt1 = Matrix.multiply([M_per, line.pt1]);
                            console.log(line.pt0);
                            
                            //change viewport matrix
                            let V = new Matrix(4,4);
                            V.values = [[(view.width/2), 0, 0, (view.width/2)],
                                        [0, (view.height/2), 0, (view.height/2)],
                                        [0, 0, 1, 0],
                                        [0, 0, 0, 1]];
                            line.pt0 = Matrix.multiply([V, line.pt0]);
                            line.pt1 = Matrix.multiply([V, line.pt1]);

                            //convert to cartesian
                            let twoD_p0 = {x: line.pt0.x/line.pt0.w,
                                           y: line.pt0.y/line.pt0.w,
                                           z: line.pt0.z/line.pt0.w};
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                            console.log(line)
                        }
                    }
                }
            } else if (scene.models.type == 'cylinder'){

            } else if (scene.models.type == 'cone') {

            } else {
                //sphere

            }
        }
    
    } else {
        //look through the list of models under 'parallel'
        //create N_per for transforms
        let N_par = mat4x4Parallel(scene.view.prp, scene.view.srp,
            scene.view.vup, scene.view.clip);
        let M_par = new Matrix(4,4);
        M_par = mat4x4MPar();
        for (let i = 0; i < scene.models.length; i++){
            //check the model type
            if (scene.models[i].type == 'generic'){
                for (j = 0; j < scene.models[i].edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < scene.models[i].edges[j].length-1; k++){
                        //find indices
                        let index0 = scene.models[i].edges[j][k];
                        let index1 = scene.models[i].edges[j][k+1];

                        let p0 = scene.models[i].vertices[index0];
                        let p1 = scene.models[i].vertices[index1];

                        let line = {pt0: p0, pt1: p1};
                        
                        //console.log(line);
                        /*
                        let identity = new Matrix(4,4);
                        mat4x4Identity(identity);
                        line.pt0 = Matrix.multiply([identity, line.pt0]);
                        line.pt1 = Matrix.multiply([identity, line.pt1]); */

                        line.pt0 = Matrix.multiply([N_par, line.pt0]);
                        line.pt1 = Matrix.multiply([N_par, line.pt1]);

                        let z_min = ((-scene.view.clip[4])/scene.view.clip[5]);
                        
                        let placeholder_line = clipLineParallel(line);
                        line.pt0 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        line.pt1 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        console.log(line); 
                        
                        if (line != null){
                            //m_per
                            line.pt0 = Matrix.multiply([M_par, line.pt0]);
                            line.pt1 = Matrix.multiply([M_par, line.pt1]);
                            console.log(line.pt0);
                            
                            //change viewport matrix
                            let V = new Matrix(4,4);
                            V.values = [[(view.width/2), 0, 0, (view.width/2)],
                                        [0, (view.height/2), 0, (view.height/2)],
                                        [0, 0, 1, 0],
                                        [0, 0, 0, 1]];
                            line.pt0 = Matrix.multiply([V, line.pt0]);
                            line.pt1 = Matrix.multiply([V, line.pt1]);

                            //convert to cartesian
                            let twoD_p0 = {x: line.pt0.x/line.pt0.w,
                                           y: line.pt0.y/line.pt0.w,
                                           z: line.pt0.z/line.pt0.w};
                            console.log(twoD_p0);
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            console.log(twoD_p1);

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                        }
                    }
                }
            } else if (scene.models.type == 'cube'){
                //center x, y, z values
                let cube_x = scene.models.center[0];
                let cube_y = scene.models.center[1];
                let cube_z = scene.models.center[2];

                let lbf; //left, bottom, front
                let rbf; //right, bottom, front
                let ltf; //left, top, front
                let rtf; //right, top, front
                let lbb; //left, bottom, back
                let rbb; //right, bottom, back
                let ltb; //left, top, back
                let rtb; //right, top, back

                let cube = {
                    vertices: [
                    //calculate edges and vertices from center, width, height, and depth
                    // left bottom front = center + 1/2 depth - 1/2 width - 1/2 height
                    // right bottom front = center + 1/2 depth + 1/2 width - 1/2 height
                    // left top front = center + 1/2 depth - 1/2 width + 1/2 height
                    // right top front = center + 1/2 depth + 1/2 width + 1/2 height

                    // left bottom back = center - 1/2 depth - 1/2 width - 1/2 height
                    // right bottom back = center - 1/2 depth + 1/2 width - 1/2 height
                    // left top back = center - 1/2 depth - 1/2 width + 1/2 height
                    // right top back = center - 1/2 depth + 1/2 width + 1/2 height
                        //front
                         //left
                        lbf = new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
                        ltf = new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
                         // right
                        rbf = new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
                        rtf = new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
                        //back
                         //left
                        lbb = new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
                        ltb = new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z - (depth/2), 1),
                         //right
                        rbb = new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
                        rtb = new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z - (depth/2), 1)
                    ],
                    edges: [
                        [0, 1, 2, 3, 0],
                        [4, 5, 6, 7, 4],
                        [0, 4],
                        [1, 5],
                        [2, 6],
                        [3, 7]
                    ]

                };

                for (j = 0; j < scene.models[i].edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < scene.models[i].edges[j].length-1; k++){
                        //find indices
                        let index0 = scene.models[i].edges[j][k];
                        let index1 = scene.models[i].edges[j][k+1];

                        let p0 = scene.models[i].vertices[index0];
                        let p1 = scene.models[i].vertices[index1];

                        let line = {pt0: p0, pt1: p1};
                        
                        //console.log(line);
                        /*
                        let identity = new Matrix(4,4);
                        mat4x4Identity(identity);
                        line.pt0 = Matrix.multiply([identity, line.pt0]);
                        line.pt1 = Matrix.multiply([identity, line.pt1]); */

                        line.pt0 = Matrix.multiply([N_par, line.pt0]);
                        line.pt1 = Matrix.multiply([N_par, line.pt1]);

                        let z_min = ((-scene.view.clip[4])/scene.view.clip[5]);
                        
                        let placeholder_line = clipLineParallel(line);
                        line.pt0 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        line.pt1 = new Vector4(placeholder_line.pt0.x,
                                               placeholder_line.pt0.y,
                                               placeholder_line.pt0.z,
                                               1);
                        console.log(line); 
                        
                        if (line != null){
                            //m_per
                            line.pt0 = Matrix.multiply([M_par, line.pt0]);
                            line.pt1 = Matrix.multiply([M_par, line.pt1]);
                            console.log(line.pt0);
                            
                            //change viewport matrix
                            let V = new Matrix(4,4);
                            V.values = [[(view.width/2), 0, 0, (view.width/2)],
                                        [0, (view.height/2), 0, (view.height/2)],
                                        [0, 0, 1, 0],
                                        [0, 0, 0, 1]];
                            line.pt0 = Matrix.multiply([V, line.pt0]);
                            line.pt1 = Matrix.multiply([V, line.pt1]);

                            //convert to cartesian
                            let twoD_p0 = {x: line.pt0.x/line.pt0.w,
                                           y: line.pt0.y/line.pt0.w,
                                           z: line.pt0.z/line.pt0.w};
                            console.log(twoD_p0);
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            console.log(twoD_p1);

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                        }
                    }
                }

            } else if (scene.models.type == 'cylinder'){

            } else if (scene.models.type == 'cone') {

            } else {
                //sphere

            }
        }
    }

    //  * transform to canonical view volume
    //  * clip in 3D
    //  * project to 2D
    //  * draw line

}
// Get outcode for vertex (parallel view volume)
function outcodeParallel(vertex) {
    let outcode = 0;
    if (vertex.x < (-1.0 - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (1.0 + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (-1.0 - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (1.0 + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (0.0 + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Get outcode for vertex (perspective view volume)
function outcodePerspective(vertex, z_min) {
    let outcode = 0;
    if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (z_min + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLineParallel(line) {
    let result = {pt0: {
                        x: line.pt0.x,
                        y: line.pt0.y,
                        z: line.pt0.z
                    }, pt1: {
                        x: line.pt1.x,
                        y: line.pt1.y,
                        z: line.pt1.z
                    }
                };
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodeParallel(p0);
    let out1 = outcodeParallel(p1);
    console.log(p0, p1, out0, out1);
    console.log(result);

    // TODO: implement clipping here!
    let accepted = false;

    while (!accepted){
        if ((out0 | out1) == 0){
            //inside view rectangle
            //trivial accepted
            console.log("accepted");
            accepted = true;
        } else if ((out0 & out1) != 0) {
            //outside view, in same region
            //trivial rejected, don't draw
            accepted = true;
            console.log("rejected");
            result = null;
        } else {
            console.log("clip time");
            let inter_out;
            let t;
            let x;
            let y;
            let z;

            //check which lies outside
            // at least one should lie outside, so choose
            if (out0 != 0){
                inter_out = out0;
            } else {
                inter_out = out1;
                let temp = p0;
                p0 = p1;
                p1 = temp;
            }

            let delta_x = p1.x - p0.x;
            let delta_y = p1.y - p0.y;
            let delta_z = p1.z - p0.z;

            // find t, and then find x, y, and z
            // change so in bitwise order LRBTNF

            if (inter_out & LEFT == LEFT) {

                t = (-1 - p0.x)/(delta_x);

            } else if (inter_out & RIGHT == RIGHT) {

                t = (1 - p0.x)/(-delta_x);

            } else if (inter_out & BOTTOM == BOTTOM) {

                t = (-1 - p0.y)/(delta_y);

            } else if (inter_out & TOP == TOP){

                t = (1 - p0.y)/(delta_y);

            } else if (inter_out & NEAR == NEAR) {

                t = (-p0.z)/(delta_z);

            } else if (inter_out & FAR == FAR) {

                t = (-1 - p0.z)/(delta_z);
            }

            x = ((1-t)*p0.x) + (t*p1.x);

            y = ((1-t)*p0.y) + (t*p1.y);

            z = ((1-t)*p0.z) + (t*p1.z);

            let inter_p = Vector3(x, y, z);
            p0 = inter_p;

            result = {pt0: {
                            x: p0.x,
                            y: p0.y,
                            z: p0.z
                            }, 
                      pt1: {
                            x: p1.x,
                            y: p1.y,
                            z: p1.z
                            }
                    };
            //console.log(result);

            out0 = outcodeParallel(p0);
            //console.log(out0);
            out1 = outcodeParallel(p1);
            //console.log(out1);

        }
    }
    return result;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLinePerspective(line, z_min) {
    let result = {pt0: {
                    x: line.pt0.x,
                    y: line.pt0.y,
                    z: line.pt0.z
                }, pt1: {
                    x: line.pt1.x,
                    y: line.pt1.y,
                    z: line.pt1.z
                }
            };
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodePerspective(p0, z_min);
    let out1 = outcodePerspective(p1, z_min);
    console.log(p0, p1, out0, out1);
    console.log(result);
    
    // TODO: implement clipping here!
    let accepted = false;

    while (!accepted){
        if ((out0 | out1) == 0){
            //inside view rectangle
            //trivial accepted
            console.log("accepted");
            accepted = true;
        } else if ((out0 & out1) != 0) {
            //outside view, in same region
            //trivial rejected, don't draw
            accepted = true;
            console.log("rejected");
            result = null;
        } else {
            console.log("clip time");
            let inter_out;
            let t;
            let x;
            let y;
            let z;

            //check which lies outside
            // at least one should lie outside, so choose
            if (out0 != 0){
                inter_out = out0;
            } else {
                inter_out = out1;
                let temp = p0;
                p0 = p1;
                p1 = temp;
            }

            let delta_x = p1.x - p0.x;
            let delta_y = p1.y - p0.y;
            let delta_z = p1.z - p0.z;

            // find t, and then find x, y, and z
            // change so in bitwise order LRBTNF
            if (inter_out & LEFT == LEFT) {

                t = (-p0.x + p0.z)/(delta_x - delta_z);
                
            } else if (inter_out & RIGHT == RIGHT) {
                
                t = (p0.x + p0.z)/(-delta_x - delta_z);

            } else if (inter_out & BOTTOM == BOTTOM) {

                t = (-p0.y + p0.z)/(delta_y - delta_z);

            } else if (inter_out & TOP == TOP){
                
                t = (p0.y + p0.z)/(-delta_y - delta_z);

            } else if (inter_out & NEAR == NEAR) {

                t = (p0.z - z_min)/(-delta_z);

            } else if (inter_out & FAR == FAR) {

                t = (-p0.z - 1)/(delta_z);

            }

            x = ((1-t)*p0.x) + (t*p1.x);
            y = ((1-t)*p0.y) + (t*p1.y);
            z = ((1-t)*p0.z) + (t*p1.z);
            let inter_p = Vector4(x, y, z, 1);
            p0 = inter_p;

            result = {pt0: {
                        x: p0.x,
                        y: p0.y,
                        z: p0.z
                    }, pt1: {
                        x: p1.x,
                        y: p1.y,
                        z: p1.z
                    }};
            console.log(result);

            out0 = outcodePerspective(p0, z_min);
            out1 = outcodePerspective(p1, z_min);
        }
        
    }
    console.log(result);
    return result;
}

// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    //recaclulate axes u, v, n
    //a = prp - 0, 0, 0 
    //prp + u axis => left + right
    //prp + n axis => forward + back
    let n = scene.view.prp.subtract(srp);
    let u = scene.view.vup.cross(n);

    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            break;
        case 65: // A key
            console.log("A");
            break;
        case 68: // D key
            console.log("D");
            break;
        case 83: // S key
            console.log("S");
            break;
        case 87: // W key
            console.log("W");
            break;
    }
}

///////////////////////////////////////////////////////////////////////////
// No need to edit functions beyond this point
///////////////////////////////////////////////////////////////////////////

// Called when user selects a new scene JSON file
function loadNewScene() {
    let scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    let reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                                                          scene.models[i].vertices[j][1],
                                                          scene.models[i].vertices[j][2],
                                                          1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                                                 scene.models[i].center[1],
                                                 scene.models[i].center[2],
                                                 1);
            }
            scene.models[i].matrix = new Matrix(4, 4);
        }
    };
    reader.readAsText(scene_file.files[0], 'UTF-8');
}

// Draw black 2D line with red endpoints 
function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}

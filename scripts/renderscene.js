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
        view: {
            type: 'perspective',       
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100] 
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
                // animation: {
                //     axis: 'x',
                //     rps: 0.5
                // },
                matrix: new Matrix(4, 4)
            }, 
            {
                type: 'cube',
                center: Vector3(25, 4, -30),
                width: 2,
                height: 2,
                depth: 2
            },
            {
                type: 'cube',
                center: Vector3(25, 4, -33),
                width: 2,
                height: 2,
                depth: 2
            },
            {
                type: 'cube',
                center: Vector3(25, 6, -31),
                width: 2,
                height: 2,
                depth: 2
            },
            {
                type: 'cylinder',
                center: Vector3(-5, 4, -15),
                radius: 0.9,
                height: 1.8,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(30, 0, -39),
                radius: 3,
                height: 10,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(-10, 0, -28),
                radius: 5,
                height: 20,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(-20, 0, -40),
                radius: 7,
                height: 26,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(-5, 0, -34),
                radius: 3,
                height: 10,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(-20, 0, -10),
                radius: 3,
                height: 10,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cone',
                center: Vector3(30, 0, -50),
                radius: 7,
                height: 26,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cylinder',
                center: Vector3(6, 4, -20),
                radius: 0.9,
                height: 1.8,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cylinder',
                center: Vector3(0, 4, -35),
                radius: 0.9,
                height: 1.8,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
            },
            {
                type: 'cylinder',
                center: Vector3(37, 4, -38),
                radius: 0.9,
                height: 1.8,
                sides: 12,
                animation: {
                    axis: "y",
                    rps: 0.5
                }
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
    let time = (timestamp - start_time)/1000.0;

    // step 2: transform models based on time
    // TODO: implement this!
    for(let i = 0; i < scene.models.length; i++) {
        if(scene.models[i].type == "generic" && scene.models[i].animation != null) {
            if(scene.models[i].animation.axis == "x") {
                let rotate_x = new Matrix(4,4);
                mat4x4RotateX(rotate_x, time*scene.models[i].animation.rps*(2*Math.PI));
                for(let i = 0; i < scene.models[0].vertices.length; i++) {
    
                    let newValues = rotate_x.mult(scene.models[0].vertices[i]).values;
                    scene.models[0].vertices[i] = Vector4(newValues[0], newValues[1], newValues[2], newValues[3]);
                }
            } else if(scene.models[i].animation.axis == "y") {
                let rotate_y = new Matrix(4,4);
                mat4x4RotateY(rotate_y, time*scene.models[i].animation.rps*(2*Math.PI));

                for(let i = 0; i < scene.models[0].vertices.length; i++) {
    
                    let newValues = rotate_y.mult(scene.models[0].vertices[i]).values;
                    scene.models[0].vertices[i] = Vector4(newValues[0], newValues[1], newValues[2], newValues[3]);
                }
            }  else if(scene.models[i].animation.axis == "z") {
                let rotate_z = new Matrix(4,4);
                mat4x4RotateZ(rotate_z, time*scene.models[i].animation.rps*(2*Math.PI));

                for(let i = 0; i < scene.models[0].vertices.length; i++) {
    
                    let newValues = rotate_z.mult(scene.models[0].vertices[i]).values;
                    scene.models[0].vertices[i] = Vector4(newValues[0], newValues[1], newValues[2], newValues[3]);
                }
            } 
        }
    }

    // step 3: draw scene
    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    //window.requestAnimationFrame(animate);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    console.log(scene);
    ctx.clearRect(0, 0 , view.width, view.height);

    // TODO: implement drawing here!
    // For each model, for each edge
    //  * transform to canonical view volume
    //  * clip in 3D
    //  * project to 2D
    //  * draw line

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
            let model;
            if (scene.models[i].type == 'generic'){
                model = scene.models[i];
            } else if (scene.models[i].type == 'cube'){
                model = createCube(scene.models[i].center, scene.models[i].width,
                    scene.models[i].height, scene.models[i].depth);
            } else if (scene.models[i].type == 'cylinder'){
                model = createCylinder(scene.models[i].center, scene.models[i].radius,
                    scene.models[i].height, scene.models[i].sides);
            } else if (scene.models[i].type == 'cone'){
                model = createCone(scene.models[i].center, scene.models[i].radius,
                    scene.models[i].height, scene.models[i].sides);
                //console.log(model);
            } else {
                model = createSphere();
            }
                for (j = 0; j < model.edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < model.edges[j].length-1; k++){
                        //find indices
                        let index0 = model.edges[j][k];
                        let index1 = model.edges[j][k+1];

                        let p0 = model.vertices[index0];
                        let p1 = model.vertices[index1];

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
                        
                        if (placeholder_line != null){
                            line.pt0 = new Vector4(placeholder_line.pt0.x,
                                                    placeholder_line.pt0.y,
                                                    placeholder_line.pt0.z,
                                                    1);
                            line.pt1 = new Vector4(placeholder_line.pt1.x,
                                                    placeholder_line.pt1.y,
                                                    placeholder_line.pt1.z,
                                                    1);
                            //console.log(line); 

                            //m_per
                            line.pt0 = Matrix.multiply([M_per, line.pt0]);
                            line.pt1 = Matrix.multiply([M_per, line.pt1]);
                            //console.log(line);
                            
                            //change viewport matrix
                            let V = new Matrix(4,4);
                            V.values = [[(view.width/2), 0, 0, (view.width/2)],
                                        [0, (view.height/2), 0, (view.height/2)],
                                        [0, 0, 1, 0],
                                        [0, 0, 0, 1]];
                            line.pt0 = Matrix.multiply([V, line.pt0]);
                            line.pt1 = Matrix.multiply([V, line.pt1]);
                            //console.log(line)

                            //convert to cartesian
                            let twoD_p0 = {x: line.pt0.x/line.pt0.w,
                                           y: line.pt0.y/line.pt0.w,
                                           z: line.pt0.z/line.pt0.w};
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                            //console.log(line)
                        }
                    }
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
            let model;
            if (scene.models[i].type == 'generic'){
                model = scene.models[i];
            } else if (scene.models[i].type == 'cube'){
                model = createCube(scene.models[i].center, scene.models[i].width,
                    scene.models[i].height, scene.models[i].depth);
            } else if (scene.models[i].type == 'cylinder'){
                model = createCylinder(scene.models[i].center, scene.models[i].radius,
                    scene.models[i].height, scene.models[i].sides);
            } else if (scene.models[i].type == 'cone'){
                model = createCone(scene.models[i].center, scene.models[i].radius,
                    scene.models[i].height, scene.models[i].sides);
                //console.log(model);
            } else {
                //sphere, probably wont implement in time :(
                model = createSphere();
            }
                for (j = 0; j < model.edges.length; j++){
                    //clip + draw lines
                    for (k = 0; k < model.edges[j].length-1; k++){
                        //find indices
                        let index0 = model.edges[j][k];
                        let index1 = model.edges[j][k+1];

                        let p0 = model.vertices[index0];
                        let p1 = model.vertices[index1];

                        let line = {pt0: p0, pt1: p1};
                        
                        //console.log(line);
                        /*
                        let identity = new Matrix(4,4);
                        mat4x4Identity(identity);
                        line.pt0 = Matrix.multiply([identity, line.pt0]);
                        line.pt1 = Matrix.multiply([identity, line.pt1]); */

                        line.pt0 = Matrix.multiply([N_par, line.pt0]);
                        line.pt1 = Matrix.multiply([N_par, line.pt1]);
                        
                        let placeholder_line = clipLineParallel(line);
                        
                        if (placeholder_line != null){
                            line.pt0 = new Vector4(placeholder_line.pt0.x,
                                                    placeholder_line.pt0.y,
                                                    placeholder_line.pt0.z,
                                                    1);
                            line.pt1 = new Vector4(placeholder_line.pt1.x,
                                                    placeholder_line.pt1.y,
                                                    placeholder_line.pt1.z,
                                                    1);
                            //console.log(line); 

                            //m_per
                            line.pt0 = Matrix.multiply([M_par, line.pt0]);
                            line.pt1 = Matrix.multiply([M_par, line.pt1]);
                            //console.log(line.pt0);
                            
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
                            //console.log(twoD_p0);
                            let twoD_p1 = {x: line.pt1.x/line.pt1.w,
                                           y: line.pt1.y/line.pt1.w,
                                           z: line.pt1.z/line.pt1.w};

                            //console.log(twoD_p1);

                            // draw line 
                            drawLine(twoD_p0.x, twoD_p0.y, twoD_p1.x, twoD_p1.y); 
                        }
                    }
                }
        }
    }
}

function createCube(center, width, height, depth){
    //center x, y, z values
    let cube_x = center.x;
    let cube_y = center.y;
    let cube_z = center.z;

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
            new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
            new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
             // right
            new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z + (depth/2), 1),
            new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z + (depth/2), 1),
            //back
             //left
            new Vector4(cube_x - (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
            new Vector4(cube_x - (width/2), cube_y + (height/2), cube_z - (depth/2), 1),
             //right
            new Vector4(cube_x + (width/2), cube_y - (height/2), cube_z - (depth/2), 1),
            new Vector4(cube_x + (width/2), cube_y + (height/2), cube_z - (depth/2), 1)
        ],
        edges: [
            [0, 1, 3, 2, 0],
            [4, 5, 7, 6, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ]

    };
    return cube;
}

function createCylinder(center, radius, height, sides){
    //circle x, y, z
    let circle_x = center.x;
    let circle_y_bottom = center.y - (height/2);
    let circle_y = center.y;
    let circle_y_top = center.y + (height/2);
    let circle_z = center.z;

    let top_x = 0;
    let top_z = 0;
    let bottom_x = 0;
    let bottom_z = 0;
    let radians = 0;
    let pt = new Vector4((circle_x + radius), circle_y, circle_z, 1);
    let vertices = [];
    let circle_top_vertices = [];
    let circle_bottom_vertices = [];

    //vertices of circles
    // * top circle: (x, y + 1/2*height, z)
    for (let i = 0; i < sides; i++){
        //create each vertex
        radians = radians + ((Math.PI * 2)/sides);
        top_x = circle_x + radius * (Math.cos(radians));
        top_z = circle_z + radius * (Math.sin(radians));

        pt = new Vector4(top_x, circle_y_top, top_z, 1);

        circle_top_vertices.push(pt);
    }
    
    // * bottom circle
    for (let i = 0; i < sides; i++){
        //create each vertex
        radians = radians + ((Math.PI * 2)/sides);
        bottom_x = circle_x + radius * (Math.cos(radians));
        bottom_z = circle_z + radius * (Math.sin(radians));

        pt = new Vector4(bottom_x, circle_y_bottom, bottom_z, 1);

        circle_bottom_vertices.push(pt);
    }

    //console.log(circle_top_vertices);
    //console.log(circle_bottom_vertices);
    for (let i = 0; i < circle_top_vertices.length; i++){
        vertices.push(circle_top_vertices[i]);

    }
    for (let i = 0; i < circle_bottom_vertices.length; i++){
        vertices.push(circle_bottom_vertices[i]);
    }

    //edges
    let edges = [];
    // * top circle edges
    let bottom_start_index = 0;
    let circle_top_edge = [];
    for (let i = 0; i < sides; i++){
        //add circle edge
        circle_top_edge.push(i);
        bottom_start_index++;
    }
    circle_top_edge.push(0);
    edges.push(circle_top_edge);

    // * bottom circle edges
    let circle_bottom_edge = [];
    for (let i = bottom_start_index; i < (sides + bottom_start_index); i++){
        //add circle edge
        circle_bottom_edge.push(i);
    }
    circle_bottom_edge.push(bottom_start_index);
    edges.push(circle_bottom_edge);
    //console.log(edges);
    let connect_edges = [];
    // * connecting edges
    for (let i = 0; i < sides; i++){
        connect_edges = [circle_top_edge[i], circle_bottom_edge[i]];
        edges.push(connect_edges);
    }
    //console.log(edges);

    let cylinder = {
        vertices: vertices,
        edges: edges
    }
    return cylinder;
}

function createCone(center, radius, height, sides){
    let circle_x = center.x;
    let circle_y = center.y;
    let circle_z = center.z;

    let x = 0;
    let z = 0;
    let radians = 0;
    let pt = new Vector4((circle_x + radius), circle_y, circle_z, 1);
    let vertices = [];

    //add the point up top
    let top = new Vector4(circle_x, circle_y + height, circle_z, 1);
    vertices.push(top);

    for (let i = 0; i < sides; i++){
        //create each vertex
        radians = radians + ((Math.PI * 2)/sides);
        x = circle_x + radius * (Math.cos(radians));
        z = circle_z + radius * (Math.sin(radians));

        pt = new Vector4(x, circle_y, z, 1);

        vertices.push(pt);
    }

    //console.log(vertices);
    let edges = [];
    let circle_edge = [];
    for (let i = 1; i <= sides; i++){
        //add circle edge
        circle_edge.push(i);
    }
    circle_edge.push(1);
    edges.push(circle_edge);

    let cone_edge = [];

    for (let i = 1; i <= sides; i++){
        cone_edge = [0, i];
        edges.push(cone_edge);
    }


    //console.log(edges);
    let cone = {
       vertices: vertices,
       edges: edges
    }
    return cone;

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
    //console.log(p0, p1, out0, out1);
    //console.log(result);

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
            console.log("clip time, babie!");
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

            if ((inter_out & LEFT) == LEFT) {

                t = (-1 - p0.x)/(delta_x);

            } else if ((inter_out & RIGHT) == RIGHT) {

                t = (1 - p0.x)/(delta_x);

            } else if ((inter_out & BOTTOM) == BOTTOM) {

                t = (-1 - p0.y)/(delta_y);

            } else if ((inter_out & TOP) == TOP){

                t = (1 - p0.y)/(delta_y);

            } else if ((inter_out & NEAR) == NEAR) {

                t = (-p0.z)/(delta_z);

            } else if ((inter_out & FAR) == FAR) {

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
    //console.log(p0, p1, out0, out1);
    //console.log(result);
    
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
            console.log("clip time, babie!");
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
            if ((inter_out & LEFT) == LEFT) {

                t = (-p0.x + p0.z)/(delta_x - delta_z);
                
            } else if ((inter_out & RIGHT) == RIGHT) {
                
                t = (p0.x + p0.z)/(-delta_x - delta_z);

            } else if ((inter_out & BOTTOM) == BOTTOM) {

                t = (-p0.y + p0.z)/(delta_y - delta_z);

            } else if ((inter_out & TOP) == TOP){
                
                t = (p0.y + p0.z)/(-delta_y - delta_z);

            } else if ((inter_out & NEAR) == NEAR) {

                t = (p0.z - z_min)/(-delta_z);

            } else if ((inter_out & FAR) == FAR) {

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
            //console.log(result);

            out0 = outcodePerspective(p0, z_min);
            out1 = outcodePerspective(p1, z_min);
        }
        
    }
    //console.log(result);
    return result;
}

// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    //recaclulate axes u, v, n
    //a = prp - 0, 0, 0 
    //prp + u axis => left + right
    //prp + n axis => forward + back
    let n = scene.view.prp.subtract(scene.view.srp);
    n.normalize();

    let u = scene.view.vup.cross(n);
    u.normalize();

    let v = n.cross(u);
    /*
    matrix.multiply([back, rotate, toorigin, srp]) where:
        - srp is the srp as a homogenous vector
        - toorigin is the translation matrix that translates by -prp
        - rotate is that rotation matrix around the v axis I sent you
        - back is the translation matrix that translates by prp

    */

    let rotation = new Matrix(4,4);
    let translation = new Matrix(4,4);
    mat4x4Translate(translation, scene.view.prp.x, scene.view.prp.y, scene.view.prp.z);
    let backTranslation = new Matrix(4,4);
    mat4x4Translate(backTranslation, -scene.view.prp.x, -scene.view.prp.y, -scene.view.prp.z);
    let homo_srp = new Vector4(scene.view.srp.x, scene.view.srp.y, scene.view.srp.z, 1);
    let rotate_shift;

    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            mat4x4VRotation(rotation, 5, v);
            
            rotate_shift = Matrix.multiply([translation, rotation, backTranslation, homo_srp]);

            //console.log(rotate_shift);
            scene.view.srp.x = rotate_shift.x;
            scene.view.srp.y = rotate_shift.y;
            scene.view.srp.z = rotate_shift.z;
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            mat4x4VRotation(rotation, -5, v);
            
            rotate_shift = Matrix.multiply([translation, rotation, backTranslation, homo_srp]);

            scene.view.srp.x = rotate_shift.x;
            scene.view.srp.y = rotate_shift.y;
            scene.view.srp.z = rotate_shift.z;
            break;
        case 65: // A key
            console.log("A");
            scene.view.prp = scene.view.prp.subtract(u);
            scene.view.srp = scene.view.srp.subtract(u);
            break;
        case 68: // D key
            console.log("D");
            scene.view.prp = scene.view.prp.add(u);
            scene.view.srp = scene.view.srp.add(u);
            break;
        case 83: // S key
            console.log("S");
            scene.view.prp = scene.view.prp.add(n);
            scene.view.srp = scene.view.srp.add(n);
            break;
        case 87: // W key
            console.log("W");
            scene.view.prp = scene.view.prp.subtract(n);
            scene.view.srp = scene.view.srp.subtract(n);
            break;
    }
    drawScene();
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

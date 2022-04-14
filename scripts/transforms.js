// create a 4x4 matrix to the parallel projection / view matrix
function mat4x4Parallel(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let translate_par = new Matrix(4,4);
    mat4x4Translate(translate_par, -prp.x, -prp.y, -prp.z);

    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    // find n, u, and v

    let n = prp.subtract(srp);
    n.normalize();

    let u = vup.cross(n);
    u.normalize();

    let v = n.cross(u);

    // create rotation
    let rotate_par = new Matrix(4,4);
    rotate_par.values = [[u.x, u.y, u.z, 0],
                         [v.x, v.y, v.z, 0],
                         [n.x, n.y, n.z, 0],
                         [0, 0, 0, 1]];

    // 3. shear such that CW is on the z-axis
    let cW = new Vector(3);
    cW.x = (clip[0] + clip[1])/2;
    cW.y = (clip[2] + clip[3])/2;
    cW.z = -(clip[4]);

    let shx_par = (-cW.x)/cW.z; 
    let shy_par = (-cW.y)/cW.z;

    let shear_par = new Matrix(4,4);
    mat4x4ShearXY(shear_par, shx_par, shy_par);

    // 4. translate near clipping plane to origin
    let translate_near = new Matrix(4,4);
    mat4x4Translate(translate_near, 0, 0, clip[4]);

    // 5. scale such that view volume bounds are ([-1,1], [-1,1], [-1,0])
    let scale_par = new Matrix(4,4);
    let s_par_x = 2/(clip[1] - clip[0]);
    let s_par_y = 2/(clip[3] - clip[2]);
    let s_par_z = 1/clip[5];

    mat4x4Scale(scale_par, s_par_x, s_par_y, s_par_z);

    // ...
    // let transform = Matrix.multiply([...]);
    let transform_par = Matrix.multiply([scale_par, translate_near, shear_par, rotate_par, translate_par]);
    return transform_par;
}

// create a 4x4 matrix to the perspective projection / view matrix
function mat4x4Perspective(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let translate_per = new Matrix(4,4);
    mat4x4Translate(translate_per, -prp.x, -prp.y, -prp.z);

    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    let n = prp.subtract(srp);
    n.normalize();

    let u = vup.cross(n);
    u.normalize();

    let v = n.cross(u);

    // create rotation
    let rotate_per = new Matrix(4,4);
    rotate_per.values = [[u.x, u.y, u.z, 0],
                         [v.x, v.y, v.z, 0],
                         [n.x, n.y, n.z, 0],
                         [0, 0, 0, 1]];

    // 3. shear such that CW is on the z-axis
    let cW = new Vector(3);
    cW.x = (clip[0] + clip[1])/2;
    cW.y = (clip[2] + clip[3])/2;
    cW.z = -(clip[4]);

    let shx_par = (-cW.x)/cW.z; 
    let shy_par = (-cW.y)/cW.z;

    let shear_par = new Matrix(4,4);
    mat4x4ShearXY(shear_par, shx_par, shy_par);

    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])
    let scale_per = new Matrix(4,4);
    let s_per_x = (clip[4]*2)/((clip[1] - clip[0]) * clip[5]);
    let s_per_y = (clip[4]*2)/((clip[3] - clip[2]) * clip[5]);
    let s_per_z = 1/clip[5];

    mat4x4Scale(scale_per, s_per_x, s_per_y, s_per_z);

    // ...
    // let transform = Matrix.multiply([...]);
    let transform_per = Matrix.multiply([scale_per, shear_par, rotate_per, translate_per]);
    return transform_per;
}

// create a 4x4 matrix to project a parallel image on the z=0 plane
function mat4x4MPar() {
    let mpar = new Matrix(4, 4);
    // mpar.values = ...;
    mpar.values = [[1, 0, 0, 0],
                   [0, 1, 0, 0],
                   [0, 0, 0, 0],
                   [0, 0, 0, 1]]
    return mpar;
}

// create a 4x4 matrix to project a perspective image on the z=-1 plane
function mat4x4MPer() {
    let mper = new Matrix(4, 4);
    // mper.values = ...;
    mper.values = [[1, 0, 0, 0],
                   [0, 1, 0, 0],
                   [0, 0, 1, 0],
                   [0, 0, -1, 0]]
    return mper;
}



///////////////////////////////////////////////////////////////////////////////////
// 4x4 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// set values of existing 4x4 matrix to the identity matrix
function mat4x4Identity(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the translate matrix
function mat4x4Translate(mat4x4, tx, ty, tz) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],                    
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the scale matrix
function mat4x4Scale(mat4x4, sx, sy, sz) {
    // mat4x4.values = ...;
    mat4x4.values = [[sx, 0, 0, 0],
                     [0, sy, 0, 0],
                     [0, 0, sz, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about x-axis matrix
function mat4x4RotateX(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, 0],
                     [0, Math.cos(theta), (-Math.sin(theta)), 0],
                     [0, Math.sin(theta), Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about y-axis matrix
function mat4x4RotateY(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[Math.cos(theta), 0, Math.sin(theta), 0],
                     [0, 1, 0, 0],
                     [(-Math.sin(theta)), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about z-axis matrix
function mat4x4RotateZ(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[ Math.cos(theta), (-Math.sin(theta)), 0, 0],
                     [Math.sin(theta), Math.cos(theta), 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

function mat4x4VRotation(mat4x4, theta, v){
    theta = theta * (Math.PI/180);
    mat4x4.values = [
                    [  (Math.cos(theta) + (Math.pow(v.x, 2))*(1 - Math.cos(theta))), 
                       (v.x * v.y * (1 - Math.cos(theta)) - (v.z * Math.sin(theta))), 
                       (v.x * v.z * (1 - Math.cos(theta)) + (v.y * Math.sin(theta))),
                       0
                    ],
                    [
                       (v.y * v.x * (1 - Math.cos(theta)) + (v.z * Math.sin(theta))),
                       (Math.cos(theta) + (Math.pow(v.y, 2) * (1 - Math.cos(theta)))),
                       (v.y * v.z * (1 - Math.cos(theta)) - (v.x * Math.sin(theta))),
                       0
                    ],
                    [
                       (v.z * v.x * (1 - Math.cos(theta)) - (v.y * Math.sin(theta))),
                       (v.z * v.y * (1 - Math.cos(theta)) - (v.x * Math.sin(theta))),
                       (Math.cos(theta) + (Math.pow(v.z, 2) * (1 - Math.cos(theta)))),
                       0
                    ],
                    [
                        0, 0, 0, 1
                    ]
                ]
}

// set values of existing 4x4 matrix to the shear parallel to the xy-plane matrix
function mat4x4ShearXY(mat4x4, shx, shy) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, shx, 0],
                     [0, 1, shy, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]]
}

// create a new 3-component vector with values x,y,z
function Vector3(x, y, z) {
    let vec3 = new Vector(3);
    vec3.values = [x, y, z];
    return vec3;
}

// create a new 4-component vector with values x,y,z,w
function Vector4(x, y, z, w) {
    let vec4 = new Vector(4);
    vec4.values = [x, y, z, w];
    return vec4;
}

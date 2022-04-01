// create a 4x4 matrix to the parallel projection / view matrix
function mat4x4Parallel(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let translate = new Matrix;
    Mat4x4Translate(translate, -prp.x, -prp.y, -prp.z);

    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    // find n, u, and v
    let n = new Vector3();
    let u = new Vector3();
    let v = new Vector3();

    n = prp - srp;
    let n_normal = n.normalize();

    u = vup.cross(n_normal);
    let u_normal = u.normalize();

    v = n_normal.cross(u_normal);

    // create rotation
    let rotate = new Matrix;
    //Mat4x4 

    // 3. shear such that CW is on the z-axis
    let cW = new Vector3();
    cW.x = (clip.left + clip.right)/2;
    cW.y = (clip.bottom + clip.top)/2;
    cW.z = z;

    let shx_par = (-x);
    let shy_par = x;

    let shear = new Matrix;
    Mat4x4ShearXY(shear, )

    // 4. translate near clipping plane to origin
    let translate_near = new Matrix;
    Mat4x4Translate(translate_near, 0, 0, clip.near);

    // 5. scale such that view volume bounds are ([-1,1], [-1,1], [-1,0])
    let scale = new Matrix;
    let s_par_x = 2/(clip.right - clip.left);
    let s_par_y = 2/(clip.top - clip.bottom);
    let s_par_z = 1/clip.far;

    Mat4x4Scale(scale, s_par_x, s_par_y, s_par_z);

    // ...
    // let transform = Matrix.multiply([...]);
    // return transform;
}

// create a 4x4 matrix to the perspective projection / view matrix
function mat4x4Perspective(prp, srp, vup, clip) {
    // 1. translate PRP to origin

    // 2. rotate VRC such that (u,v,n) align with (x,y,z)

    // 3. shear such that CW is on the z-axis

    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])

    // ...
    // let transform = Matrix.multiply([...]);
    // return transform;
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
function Mat4x4Translate(mat4x4, tx, ty, tz) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],                    
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the scale matrix
function Mat4x4Scale(mat4x4, sx, sy, sz) {
    // mat4x4.values = ...;
    mat4x4.values = [[sx, 0, 0, 0],
                     [0, sy, 0, 0],
                     [0, 0, sz, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about x-axis matrix
function Mat4x4RotateX(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, 0],
                     [0, Math.cos(theta), (-Math.sin(theta)), 0],
                     [0, Math.sin(theta), Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about y-axis matrix
function Mat4x4RotateY(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[Math.cos(theta), 0, Math.sin(theta), 0],
                     [0, 1, 0, 0],
                     [(-Math.sin(theta)), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about z-axis matrix
function Mat4x4RotateZ(mat4x4, theta) {
    // mat4x4.values = ...;
    mat4x4.values = [[ Math.cos(theta), (-Math.sin(theta)), 0, 0],
                     [Math.sin(theta), Math.cos(theta), 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the shear parallel to the xy-plane matrix
function Mat4x4ShearXY(mat4x4, shx, shy) {
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

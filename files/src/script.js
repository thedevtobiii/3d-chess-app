import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' 
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js';


//debug
const gui = new dat.GUI()

//canvas
const canvas = document.querySelector('.webgl');

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

//resize
window.addEventListener('resize', ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  //update renderer
  renderer.setSize(sizes.width, sizes.height); 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
})

//textures
const textureLoader = new THREE.TextureLoader()
const chessColorTexture = textureLoader.load('/textures/chess-pieces/color.jpg')
const chessNormalTexture =textureLoader.load('/textures/chess-pieces/normal.jpg')
const checkerboardTexture = textureLoader.load('/textures/checkerboard/checkerboard.png')

checkerboardTexture.wrapS = THREE.RepeatWrapping;
checkerboardTexture.wrapT = THREE.RepeatWrapping;
checkerboardTexture.repeat.set(16,17.3)
checkerboardTexture.magFilter = THREE.NearestFilter;
checkerboardTexture.minFilter = THREE.NearestFilter;
checkerboardTexture.generateMipmaps = false;

chessColorTexture.repeat.set(2,2)
// chessAOTexture.repeat.set(2,2)
chessNormalTexture.repeat.set(2,2)
// chessRoughnessTexture.repeat.set(2,2)

chessColorTexture.wrapS = THREE.RepeatWrapping
// chessAOTexture.wrapS = THREE.RepeatWrapping
chessNormalTexture.wrapS = THREE.RepeatWrapping
// chessRoughnessTexture.wrapS = THREE.RepeatWrapping

chessColorTexture.wrapT = THREE.RepeatWrapping
// chessAOTexture.wrapT = THREE.RepeatWrapping
chessNormalTexture.wrapT = THREE.RepeatWrapping
// chessRoughnessTexture.wrapT = THREE.RepeatWrapping


// chessColorTexture.magFilter = THREE.LinearFilter
// chessColorTexture.minFilter = THREE.LinearMipMapLinearFilter








//scene
const scene = new THREE.Scene();

//sky
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();
// Change these variables to move the sun
const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2, // Low elevation = sunset
    azimuth: 180,
};

// Update the sky uniforms based on the sun position
const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
const theta = THREE.MathUtils.degToRad(effectController.azimuth);
sun.setFromSphericalCoords(1, phi, theta);
sky.material.uniforms['sunPosition'].value.copy(sun);

//group
const sceneGraph = new THREE.Group();
scene.add(sceneGraph)

//models
//model materials
const whiteMaterial = new THREE.MeshStandardMaterial({
    map: chessColorTexture,
    normalMap: chessNormalTexture,
    // roughnessMap: chessRoughnessTexture,
    metalness: 0.5,
    roughness: 0.2
})

const blackMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0a,       
  roughness: 0.1,         
  metalness: 0.0,      
  side: THREE.DoubleSide   
})

//pawns
const gltfloader = new GLTFLoader()
gltfloader.load('./models/pawn/pawn9.gltf', 
  (gltf)=>{
console.log(gltf)
const pawn = gltf.scene
pawn.scale.set(0.1,0.1,0.1)
pawn.traverse(
  (child)=>{
if(child.isMesh){
  child.material = whiteMaterial.clone()
  child.userData.isPiece = true
  child.userData.type = 'pawn'
  child.userData.color = 'white'
}
  }
)
const squareSize = 2.1
const pawnsWhite = []
for (let i =0; i<8; i++){
const pawnPieces = pawn.clone(true)
pawnPieces.position.set((i - 3.5)* squareSize, -0.8 , 3.3* squareSize)
pawnsWhite.push(pawnPieces)
// scene.add(pawnPieces)
sceneGraph.add(pawnPieces)

}

//blackpawns
const blackPawn = pawn.clone()
blackPawn.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
  child.userData.color = 'black'
}
})
//to create multiple balckpawns lined up accordingly
const pawnsBlack = []
for (let i = 0; i<8; i++){
const pawnPieces = blackPawn.clone()
pawnPieces.position.set((i-3.5)*squareSize, -0.8, -3.3*squareSize)
pawnsBlack.push(pawnPieces)
// scene.add(pawnPieces)
sceneGraph.add(pawnPieces)

}
// console.log(pawn.children.material)
  }
)

//knights
gltfloader.load('./models/knight/knight5.gltf', (gltf)=>{
const knight = gltf.scene
knight.scale.set(0.1, 0.1, 0.1)
knight.traverse((child)=>{
if (child.isMesh){
  child.material = whiteMaterial.clone() //material uniqueness
  child.material.side = THREE.DoubleSide
  child.userData.isPiece = true
  child.userData.type = 'knight'
  child.userData.color = 'white'

}
})
  const squareSize = 2.1
const positionKnights = [-2.5,2.5]

positionKnights.forEach((x)=>{
const clonedKnights = knight.clone(true)
clonedKnights.rotation.y = Math.PI
clonedKnights.position.set(x * squareSize, -0.8, 4.3*squareSize)

// scene.add(clonedKnights)
sceneGraph.add(clonedKnights)

//black knights
const blackKnight = knight.clone()
blackKnight.traverse((child)=>{
  if (child.isMesh){
    child.material = blackMaterial
    child.userData.color = 'black'
  }
})

const positionBlackKnights = [-2.5, 2.5]
positionBlackKnights.forEach((x)=>{
  const clonedKnights = blackKnight.clone()
  clonedKnights.position.set(x * squareSize, -0.8, -4.3*squareSize)

  // scene.add(clonedKnights)
  sceneGraph.add(clonedKnights)
})

})
})

//bishops
gltfloader.load('./models/bishop/bishop.gltf', (gltf)=>{
  const bishop = gltf.scene
  bishop.position.set(-2,0,0)
  bishop.scale.set(0.1, 0.1, 0.1)
  // scene.add(bishop)
  bishop.traverse((child)=>{
    if (child.isMesh){
      child.material = whiteMaterial.clone()
      child.material.side = THREE.DoubleSide
      child.userData.isPiece = true
      child.userData.type = 'bishop'
      child.userData.color = 'white'
    }
  })

const squareSize = 2.1
const positionBishops = [-1.5,1.5]

positionBishops.forEach((x)=>{
const clonedBishops = bishop.clone(true)
clonedBishops.position.set(x * squareSize, -0.8, 4.3*squareSize)

// scene.add(clonedBishops)
sceneGraph.add(clonedBishops)
})

//black bishops
const blackBishop = bishop.clone()
blackBishop.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
  child.userData.color = 'black'
}
})

positionBishops.forEach((x)=>{
  const clonedBlackBishops = blackBishop.clone()
  clonedBlackBishops.position.set(x * squareSize, -0.8, -4.3*squareSize)
  // scene.add(clonedBlackBishops)
  sceneGraph.add(clonedBlackBishops)
})


}
)

//queens
gltfloader.load('./models/queen/queen.gltf',(gltf)=>{
  const queen = gltf.scene
  queen.scale.set(0.1, 0.1, 0.1)
  // scene.add(queen)
  queen.traverse((child)=>{
    if(child.isMesh){
      child.material = whiteMaterial.clone()
      child.material.side = THREE.DoubleSide
      child.userData.isPiece = true
      child.userData.type = 'queen'
      child.userData.color = 'white'
    }
  })

const squareSize = 2.1
queen.position.set(-0.5 * squareSize, -0.8, 4.3*squareSize)
// scene.add(queen)
sceneGraph.add(queen)

const blackQueen = queen.clone()
blackQueen.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
  child.userData.color = 'black'
}
})
blackQueen.position.set(-0.5 * squareSize, -0.8, -4.3*squareSize)
// scene.add(blackQueen)
sceneGraph.add(blackQueen)


})

//kings
gltfloader.load('./models/king/king3.gltf', (gltf)=>{
  const king = gltf.scene
 
  king.scale.set(0.1, 0.1, 0.1)
  // scene.add(king)
    king.traverse((child)=>{
    if(child.isMesh){
      child.material = whiteMaterial.clone()
      child.material.side = THREE.DoubleSide
      child.userData.isPiece = true
      child.userData.type = 'king'
      child.userData.color = 'white'
    }
  })

const squareSize = 2.1
king.position.set(0.5 * squareSize, -0.8, 4.3*squareSize)
// scene.add(king)
sceneGraph.add(king)
const blackKing = king.clone()
blackKing.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
  child.userData.color = 'black'
}
})
blackKing.position.set(0.5 * squareSize, -0.8, -4.3*squareSize)
// scene.add(blackKing)
sceneGraph.add(blackKing)
})

//rooks
gltfloader.load('./models/rook/rook.gltf', (gltf)=>{
const rook = gltf.scene
rook.scale.set(0.1,0.1,0.1)

// scene.add(rook)
rook.traverse((child)=>{
    if(child.isMesh){
      child.material = whiteMaterial.clone()
      child.material.side = THREE.DoubleSide
      child.userData.isPiece = true
      child.userData.type = 'rook'
      child.userData.color = 'white'
    }
  })

  const squareSize = 2.1
const positionRooks = [-3.5,3.5]

positionRooks.forEach((x)=>{
const clonedRooks = rook.clone()
clonedRooks.position.set(x * squareSize, -0.8, 4.3*squareSize)

// scene.add(clonedRooks)
sceneGraph.add(clonedRooks)

})

const blackRook = rook.clone(true)
blackRook.traverse((child)=>{
if (child.isMesh){
  child.material = blackMaterial
  child.userData.color = 'black'
}
})

positionRooks.forEach((x)=>{
  const clonedBlackRooks = blackRook.clone()
  clonedBlackRooks.position.set(x * squareSize, -0.8, -4.3*squareSize)
  // scene.add(clonedBlackRooks)
  sceneGraph.add(clonedBlackRooks)
})
})

//board
gltfloader.load('./models/chessboard/chessboard4.gltf', (gltf)=>{
  const chessBoard = gltf.scene
  chessBoard.scale.set(0.3,0.3,0.3)
  chessBoard.position.set(0,-3,0)
  // scene.add(chessBoard)
  sceneGraph.add(chessBoard)
  chessBoard.traverse((child)=>{
   if (child.isMesh){
    console.log('Mesh:', child.name, 'UUID:', child.uuid)

        if (child.name === "Cube_1") {
        child.material = new THREE.MeshStandardMaterial({
          
         color: 0x3e1f0e,
  roughness: 0.35,
  metalness: 0.2

        })

      }
       if (child.name === "Cube_2") {
        child.material = new THREE.MeshStandardMaterial({
        map : checkerboardTexture 
        })

   }
   child.userData.isBoard = true
  }
  })

})


//lamp
gltfloader.load('./models/lamp/lamp.gltf', (gltf)=>{
  const lamp = gltf.scene
 
  lamp.scale.set(0.5,0.5,0.5)
 lamp.position.set(12,-3,0)
//  scene.add(lamp)
sceneGraph.add(lamp)
  })





//objects
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0.5,
        roughness: 0.1
    })
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = -3.2
floor.material.side = THREE.DoubleSide
// scene.add(floor)
sceneGraph.add(floor)


//raycaster
let selectedPiece = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // 1. Convert mouse position to -1 to +1 range
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // 2. Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // 3. Calculate objects intersecting the picking ray
    // We check sceneGraph.children because that's where your pieces and board are
    const intersects = raycaster.intersectObjects(sceneGraph.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const data = clickedObject.userData;

        // LOGIC A: If we clicked a Piece
        if (data.isPiece) {
            // Deselect previous piece if it exists
            if (selectedPiece) {
                selectedPiece.material.emissive.setHex(0x000000);
            }

            // Select new piece
            selectedPiece = clickedObject;
            // Make it glow yellow to show it's selected
            selectedPiece.material.emissive.setHex(0x555500); 
            
            console.log(`Selected ${data.color} ${data.type}`);
        } 
        
        // LOGIC B: If we have a piece selected and click the Board
        else if (data.isBoard && selectedPiece) {
            const point = intersects[0].point;
            
            // Snap the piece to the center of the clicked square
            // We'll calculate the exact grid math in the next step
            selectedPiece.position.x = Math.round(point.x / 2.1) * 2.1;
            selectedPiece.position.z = Math.round(point.z / 2.1) * 2.1;

            // Clear selection
            selectedPiece.material.emissive.setHex(0x000000);
            selectedPiece = null;
        }
    }
});

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.position.set(3, 3, 8)
directionalLight.position.set(3,5,0)
scene.add(directionalLight)

const lampLight = new THREE.HemisphereLight(0xff0000, 0x0000ff,0.5)
scene.add(lampLight)



//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1 ,100);
camera.position.set(5, 10, 20)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)  
controls.enableDamping = true;
controls.minDistance = 15
controls.maxDistance = 50
// controls.target.set(0, 0.75, 0)


//renderer
const renderer =new THREE.WebGLRenderer(
  {
    canvas : canvas,
    antialias: true
  }
);
renderer.setSize(sizes.width, sizes.height); 
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.CineonToneMapping

chessColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2


//animation
const clock = new THREE.Clock()

const loop = () =>
{
  //update objects
const elapsedTime = clock.getElapsedTime()
// sceneGraph.rotation.y = 0.05 * elapsedTime * Math.PI * 2
   
  controls.update()

  renderer.render(scene, camera);
  

  window.requestAnimationFrame(loop); 
}
loop();
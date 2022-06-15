const colorsChoice = document.querySelector('#colorsChoice')
const game = document.querySelector('#game')
const cursor = document.querySelector('#cursor')
game.width = 1200
game.height = 600
const gridCellSize = 10

const ctx = game.getContext('2d');
const gridCtx = game.getContext('2d');

const colorList = [
    "#FFEBEE", "#FCE4EC", "#F3E5F5", "#B39DDB", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA",
    "#4DB6AC", "#66BB6A", "#9CCC65", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
    "#A1887F", "#E0E0E0", "#90A4AE", "#000"
]
let currentColorChoice = colorList[9]


const firebaseConfig = {
    apiKey: "AIzaSyDko3nHqR5s_3d19cBSC6LA_ILryP1Xz2Y",
    authDomain: "pixel-war-6d68f.firebaseapp.com",
    projectId: "pixel-war-6d68f",
    storageBucket: "pixel-war-6d68f.appspot.com",
    messagingSenderId: "159315787603",
    appId: "1:159315787603:web:688b7f2b3a1e137d786ba6"
};
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()


colorList.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.style.backgroundColor = color
    colorsChoice.appendChild(colorItem)

    colorItem.addEventListener('click', () => {
        currentColorChoice = color

        colorItem.innerHTML = `<i class="fa-solid fa-check"></i>`

        setTimeout(() => {
            colorItem.innerHTML = ""
        }, 1000)
    })
})


function createPixel(x, y, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, gridCellSize, gridCellSize)
}

function addPixelIntoGame() {
    const x = cursor.offsetLeft
    const y = cursor.offsetTop - game.offsetTop

    createPixel(x, y, currentColorChoice)

    const pixel = {
        x,
        y,
        color: currentColorChoice
    }

    const pixelRef = db.collection('pixels').doc(`${pixel.x}-${pixel.y}`)
    pixelRef.set(pixel, { merge: true })

}

cursor.addEventListener('click', function (event) {
    addPixelIntoGame()
})
game.addEventListener('click', function () {
    addPixelIntoGame()
})


function drawGrids(ctx, width, height, cellWidth, cellHeight) {
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"

    for (let i = 0; i < width; i++) {
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
    }

    for (let i = 0; i < height; i++) {
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
    }
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function (event) {
    const cursorLeft = event.clientX - (cursor.offsetWidth / 2)
    const cursorTop = event.clientY - (cursor.offsetHeight / 2)

    cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px"
    cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px"
})


db.collection('pixels').onSnapshot(function (querySnapshot) {
    querySnapshot.docChanges().forEach(function (change) {
        const { x, y, color } = change.doc.data()

        createPixel(x, y, color)
    })
})
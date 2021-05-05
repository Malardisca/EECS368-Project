//let canvas = document.querySelector('#notification').querySelector('canvas');
//let notification = canvas.getContext('2d')
/* MUSIC For winner
function playSound(src){
    //this.playSound=document.createElement('audio')
    this.playSound=createElement('audio')
    this.playSound.setAttribute('id', 'music')
    this.playSound.src=src
    this.playSound.setAttribute('preload','auto')
    this.playSound.style.display='none'
    document.body.appendChild(this.playSound)
    this.play=function(){
        this.playSound.play()
        let x=document.getElementById('music')
        x.loop=true
    }
    this.stop=function(){
        this.playSound.pause()
    }
}
*/

class Gobang {

    constructor(options) {
        this.options = options
        this.gobang = document.getElementById(options.canvas || 'gobang')
        this.chessboard = this.gobang.children[0]
        this.pieces = this.gobang.children[1]

        this.gobangStyle = Object.assign({
            padding: 30,
            count: 20
        }, options.gobangStyle || {})

        this.lattice = {
            width: (this.gobang.clientWidth - this.gobangStyle.padding * 2) / this.gobangStyle.count,
            height: (this.gobang.clientHeight - this.gobangStyle.padding * 2) / this.gobangStyle.count
        }
        this.resetAndInit()
    }

    howToPlay(){
        document.write("<h3>Goban (aka:five-in-a-row) is a purely strategic chess game in which two people play against each other.</br>It is a Japanese game played on a go board with players alternating and attempting to be first to place five counters in a row(it can be opposite and hypotenuse line). Usually the two sides use black and white chess pieces, and both player take turns and can only place one piece at a time.</br>  In short: The player who first forms 5 sub-links wins.</br></br>hit Reload to re-enter the game.</h3>");
    }

    resetAndInit() {
        const {options} = this
        this.role = options.role || this.role || 1
        this.win = false
        this.history = []
        this.currentStep = 0
        this.pieces.onclick = null
        this.pieces.innerHTML = ''
        this.drawBoard()
        this.listenDownPiece()
        this.initialize()
    }

    initialize() {
        const checkerboard = []
        for(let x = 0; x < this.gobangStyle.count + 1; x++) {
            checkerboard[x] = []
            for(let y = 0; y < this.gobangStyle.count + 1; y++) {
                checkerboard[x][y] = 0
            }
        }
        this.checkerboard = checkerboard
    }

    drawBoard() {
        const {
            gobangStyle,
            gobang
        } = this
        const lattices = Array.from({
            length: gobangStyle.count * gobangStyle.count
        }, () => `<span class="lattice"></span>`).join('')
        this.chessboard.className = `chessboard lattice-${gobangStyle.count}`
        this.chessboard.innerHTML = lattices
        this.gobang.style.border = `${gobangStyle.padding}px solid #ddd`
    }

    drawPiece(x, y, isBlack) {
        const {
            gobangStyle,
            lattice,
            gobang
        } = this
        const newPiece = document.createElement('div')
        newPiece.setAttribute('id', `x${x}-y${y}-r${isBlack ? 1 : 2}`)
        newPiece.className = isBlack ? 'piece black' : 'piece white'
        newPiece.style.width = lattice.width * 0.8
        newPiece.style.height = lattice.height * 0.8
        newPiece.style.left = (x * lattice.width) - lattice.width * 0.4
        newPiece.style.top = (y * lattice.height) - lattice.height * 0.4
        this.pieces.appendChild(newPiece)
        setTimeout(() => {
            this.checkReferee(x, y, isBlack ? 1 : 2)
        }, 0)
    }

    listenDownPiece(isBlack = false) {
        this.pieces.onclick = event => {
            if(event.target.className.includes('piece ')) {
                return false
            }
            let {
                offsetX: x,
                offsetY: y
            } = event
            x = Math.round(x / this.lattice.width)
            y = Math.round(y / this.lattice.height)

            if(this.checkerboard[x][y] !== undefined &&
                Object.is(this.checkerboard[x][y], 0)) {
                this.checkerboard[x][y] = this.role
                this.drawPiece(x, y, Object.is(this.role, 1))
                this.history.length = this.currentStep
                this.history.push({
                    x,
                    y,
                    role: this.role
                })
                this.currentStep++
                this.role = Object.is(this.role, 1) ? 2 : 1
            }
        }
    }

    checkReferee(x, y, role) {
        if((x == undefined) || (y == undefined) || (role == undefined)) return

        let countContinuous = 0

        const XRow = this.checkerboard.map(x => x[y])
        const YColumn = this.checkerboard[x]
        const S1pattern_M = []
        const S2pattern_M = []
        this.checkerboard.forEach((_y, i) => {
            //check left slash
            const S1Item = _y[y - (x - i)]
            if(S1Item !== undefined) {
                S1pattern_M.push(S1Item)
            }
            //check right slash
            const S2Item = _y[y + (x - i)]
            if(S2Item !== undefined) {
                S2pattern_M.push(S2Item)
            }
        });

        [XRow, YColumn, S1pattern_M, S2pattern_M].forEach(axis => {
            if(axis.some((x, i) => axis[i] !== 0 &&
                    axis[i - 2] === axis[i - 1] &&
                    axis[i - 1] === axis[i] &&
                    axis[i] === axis[i + 1] &&
                    axis[i + 1] === axis[i + 2])) {
                countContinuous++
            }
        })


        if(countContinuous) {
//          music=new playSound('win.mp3')
//          music.play()
            this.pieces.onclick = null
            this.win = true
            alert((role == 1 ? 'Black' : 'White') + 'Won!')
        }
    }
}
const five_Row = new Gobang({
	role: 2,
	canvas: 'game',
	gobangStyle: {
	    padding: 30,
	    count: 20
	}
})
console.log(five_Row)
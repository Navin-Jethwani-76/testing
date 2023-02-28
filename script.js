
const threshold = 10;

const newBoard = document.getElementById(`board-${editorCount}`);
const board = newBoard.querySelector("svg");
const boardText = newBoard.getElementById("text");
const mode = newBoard.getElementById("mode-select");
const svgRect = newBoard.getBoundingClientRect();

var isPainting = false;
var isErasing = false;

board.addEventListener("mousedown", start)
board.addEventListener("mouseup", stop);
board.addEventListener("mousemove", draw);
mode.addEventListener('change', handleModeChange);

function start(event){
    if(mode.value === 'pencil'){
        isPainting = true;
        isErasing = false;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let x1 = event.clientX - svgRect.left;
        let y1 = event.clientY - svgRect.top;
        let x2 = event.clientX - svgRect.left;
        let y2 = event.clientY - svgRect.top;
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);

        const lines = document.querySelectorAll('line');
        for(let i=0; i<lines.length; i++){
            const x1Other = lines[i].getAttribute("x1");
            const y1Other = lines[i].getAttribute("y1");
            const x2Other = lines[i].getAttribute("x2");
            const y2Other = lines[i].getAttribute("y2");
            const distanceStart = Math.sqrt((x1 - x1Other) ** 2 + (y1 - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x1 - x2Other) ** 2 + (y1 - y2Other) ** 2);
            if (distanceStart < threshold) {
                line.setAttribute("x1", x1Other);
                line.setAttribute("y1", y1Other);
            }
            if (distanceEnd < threshold) {
                line.setAttribute("x1", x2Other);
                line.setAttribute("y1", y2Other);
              }
        }
        board.appendChild(line);
    }
    else if(mode.value === 'eraser'){
        isErasing = true;
        isPainting = false;
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if(element.tagName === 'line'){
            element.remove();
        }
    }
}

function draw(event){
    if(isPainting === false) return;
    else if(isPainting === true){
        boardText.setAttribute('style', 'display: none;');
        const line = board.lastChild;
        const x2 = event.clientX - svgRect.left;
        const y2 = event.clientY - svgRect.top
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        const lines = document.querySelectorAll('line');
        for(let i=0; i<lines.length; i++){
            const x1Other = lines[i].getAttribute("x1");
            const y1Other = lines[i].getAttribute("y1");
            const x2Other = lines[i].getAttribute("x2");
            const y2Other = lines[i].getAttribute("y2");
            const distanceStart = Math.sqrt((x2 - x1Other) ** 2 + (y2 - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x2 - x2Other) ** 2 + (y2 - y2Other) ** 2);
            if (distanceStart < threshold) {
                line.setAttribute("x2", x1Other);
                line.setAttribute("y2", y1Other);
            }
            if (distanceEnd < threshold) {
                line.setAttribute("x2", x2Other);
                line.setAttribute("y2", y2Other);
            }

        }
    }
}

function stop(event){
    isPainting = false;
    isErasing = false;
    const emptyLine = document.querySelectorAll("line");
    for(let i=0; i<emptyLine.length; i++){
        if(emptyLine[i].getTotalLength() === 0){
            emptyLine[i].remove();
        }
    }
    if(!board.hasChildNodes()){
        boardText.setAttribute('style', '');
    }

    const element = document.elementFromPoint(event.clientX, event.clientY);
        if(element.tagName === 'line'){
            element.addEventListener('mouseenter', () => {
                element.classList.add('highlight');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('highlight');
            });
        }
}

function handleModeChange() {
    isDrawing = false;
    isErasing = false;
}
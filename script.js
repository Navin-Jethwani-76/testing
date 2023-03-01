
class Draw{


    constructor(id){
        this.element = document.getElementById(id);
        this.shapes = [];
        this.currentShape = null; 
        this.mode = "pencil";

        const selectTag = document.getElementById("mode-select");
            selectTag.addEventListener("change", (event) => {
                this.mode = event.target.value;
        });

        this.element.addEventListener("mousedown", (event) => {
            if (this.mode === 'pencil') {
              this.startShape(event.offsetX, event.offsetY);
            } else if (this.mode === 'eraser') {
              this.eraseShapes(event.offsetX, event.offsetY);
            }
          });
        this.element.addEventListener("mousemove", (event) => {
          
            if(this.mode === 'pencil'){
              this.updateShape(event.offsetX, event.offsetY);
            }
            else if (this.mode === 'eraser'){
              this.highlightLines(event.offsetX, event.offsetY);
            }
        });
        this.element.addEventListener("mouseup", (event) => {
            this.endShape();
        });
    }



    highlightLines(x, y){

      for (const shape of this.shapes) {
        const element = shape.element;
        const x1 = Number(element.getAttribute("x1"));
        const y1 = Number(element.getAttribute("y1"));
        const x2 = Number(element.getAttribute("x2"));
        const y2 = Number(element.getAttribute("y2"));
        const distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
        if (distance <= 15) {
            element.classList.add('highlight');
            }
        else{
            element.classList.remove('highlight');
        }
      }
    }



    getPerpendicularDistance(x, y, x1, y1, x2, y2) {
      const slope = (y2 - y1) / (x2 - x1);
      const yIntercept = y1 - slope * x1;
      const perpendicularSlope = -1 / slope;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const perpendicularYIntercept = midY - perpendicularSlope * midX;
      const intersectionX = (perpendicularYIntercept - yIntercept) / (slope - perpendicularSlope);
      const intersectionY = slope * intersectionX + yIntercept;
      const distance = Math.sqrt(Math.pow(x - intersectionX, 2) + Math.pow(y - intersectionY, 2));
      return distance;
    }



    startShape(x, y) {
        this.currentShape = new Shape(x, y);
        this.element.appendChild(this.currentShape.element);
    }



    updateShape(x, y) {
        if (this.currentShape !== null) {
          this.currentShape.addPoint(x, y);
        }
    }


    endShape() {
        if (this.currentShape !== null) {
          this.shapes.push(this.currentShape);
          this.currentShape = null;
        }
    }


    eraseShapes(x, y) {
      const shapeElementsToRemove = [];
      for (const shape of this.shapes) {
        const element = shape.element;
        const x1 = Number(element.getAttribute("x1"));
        const y1 = Number(element.getAttribute("y1"));
        const x2 = Number(element.getAttribute("x2"));
        const y2 = Number(element.getAttribute("y2"));
        const distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
        console.log(distance);
        if (distance <= 20) {
          shapeElementsToRemove.push(shape.element);
          console.log(shapeElementsToRemove);
        }
      }
    
      for (const element of shapeElementsToRemove) {
        element.remove();
        const index = this.shapes.findIndex(shape => shape.element === element);
        if (index !== -1) {
          this.shapes.splice(index, 1);
        }
      }
    }
    
    
}




class Shape {



    constructor(x, y) {
        
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.element.setAttribute("x1", x);
        this.element.setAttribute("y1", y);
        this.element.setAttribute("x2", x);
        this.element.setAttribute("y2", y);

        this.boardText = document.getElementById('board-text');
        const lines = document.querySelectorAll('line')
        for(let i=0; i<lines.length; i++){  
            const x1Other = lines[i].getAttribute("x1");
            const y1Other = lines[i].getAttribute("y1");
            const x2Other = lines[i].getAttribute("x2");
            const y2Other = lines[i].getAttribute("y2");
            const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
            if (distanceStart <= 10) {
                this.element.setAttribute("x1", x1Other);
                this.element.setAttribute("y1", y1Other);
            }
            if (distanceEnd <= 10) {
                this.element.setAttribute("x1", x2Other);
                this.element.setAttribute("y1", y2Other);
            }
        }
    }




    addPoint(x, y) {
      this.element.setAttribute("x2", x);
      this.element.setAttribute("y2", y);
      this.boardText.setAttribute('style', 'display: none;');
      const lines = document.querySelectorAll('line');
        for(let i=0; i<lines.length; i++){
            const x1Other = lines[i].getAttribute("x1");
            const y1Other = lines[i].getAttribute("y1");
            const x2Other = lines[i].getAttribute("x2");
            const y2Other = lines[i].getAttribute("y2");
            const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
            if (distanceStart <= 10) {
                this.element.setAttribute("x2", x1Other);
                this.element.setAttribute("y2", y1Other);
            }
            if (distanceEnd <= 10) {
                this.element.setAttribute("x2", x2Other);
                this.element.setAttribute("y2", y2Other);
            }

        }
    }




    remove() {
      this.element.remove();
    }
  }

  
  const drawingBoard = new Draw('board');
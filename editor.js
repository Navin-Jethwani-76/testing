let editorCount = 0;
class MoleculeEditor {
  constructor(width, height) {
    this.height = height;
    this.width = width;
  }

  newEditor() {
    editorCount++;
    let newDiv = `
    <div id="board-${editorCount}">
        <div class="svg-wrap">
        <span class="text">Click and drag to start drawing a structure.</span>
        <svg id="svg-${editorCount}" style="height:${this.height};width:${this.width};"></svg>
    </div>
    <div class="switch">
      <label>Mode:</label>
      <select class="mode-select">
      <option value="pencil">Pencil</option>
      <option value="eraser">Eraser</option>
      </select>
    </div>
    </div>
  `;
    document.innerHTML += newDiv;
  }
}
// let editor1 = new MoleculeEditor(600,400);
// editor1.newEditor();
// let editor2 = new MoleculeEditor(600,400);
// editor2.newEditor();

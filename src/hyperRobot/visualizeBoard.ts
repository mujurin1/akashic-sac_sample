import { MutableBoard } from "./model/MutableBoard";

export const visualizeBoard = (board: MutableBoard, width: number, height: number): void => {
  let html = "";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = board.getCell(x, y);
      const style = {
        width: "64px",
        height: "64px",
        position: "fixed",
        top: `${64 * y + 128}px`,
        left: `${64 * x + 128}px`,
        padding: "8px",
        "box-sizing": "border-box",
        border: "2px solid #fff",
        "border-left-color": cell.isLeftWall ? "#000" : "#fff",
        "border-top-color": cell.isTopWall ? "#000" : "#fff",
        "border-right-color": cell.isRightWall ? "#000" : "#fff",
        "border-bottom-color": cell.isBottomWall ? "#000" : "#fff",
        overflow: "hidden",
        background: cell.goal?.color ?? "#ccc"
      };

      const styleStr = Object.entries(style)
        .map(([key, value]) => `${key}: ${value};`)
        .join("");
      html += `<div style="${styleStr}">${cell.goal?.src ?? ""}</div>`;
    }
  }

  setTimeout(() => {
    document.write(html);
  }, 1000);
  // console.log(`document.write(${"`" + html + "`"});`);
};

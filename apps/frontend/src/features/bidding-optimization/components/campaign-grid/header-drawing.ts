const HELP_TRIANGLE_SIZE = 14;
const TRIANGLE_COLOR = "#1f2937";
const QUESTION_MARK_COLOR = "#ffffff";
const QUESTION_MARK_FONT = "6px sans-serif";

export function drawHelpTriangle(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
) {
  const right = rect.x + rect.width;
  const top = rect.y;

  ctx.beginPath();
  ctx.moveTo(right, top);
  ctx.lineTo(right - HELP_TRIANGLE_SIZE, top);
  ctx.lineTo(right, top + HELP_TRIANGLE_SIZE);
  ctx.closePath();
  ctx.fillStyle = TRIANGLE_COLOR;
  ctx.fill();

  ctx.fillStyle = QUESTION_MARK_COLOR;
  ctx.font = QUESTION_MARK_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", right - 4, top + 4);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

export function isInHelpTriangle(
  mouseX: number,
  mouseY: number,
  rect: { x: number; y: number; width: number; height: number },
): boolean {
  const right = rect.x + rect.width;
  const top = rect.y;
  return mouseX >= right - HELP_TRIANGLE_SIZE && mouseX <= right
    && mouseY >= top && mouseY <= top + HELP_TRIANGLE_SIZE;
}

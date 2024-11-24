export default function renderTextToImageWebPPrecise(
  text: string
): HTMLImageElement {
  // Create a canvas and context
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get canvas context");
  }

  // Define font and line height
  const fontSize = 48;
  const lineHeight = fontSize * 1.4; // Adjust line height as needed
  context.font = `${fontSize}px Arial`;

  // Split the text into lines based on \n
  const lines = text.split("\n");

  // Measure the width of the longest line
  const maxWidth = Math.max(
    ...lines.map((line) => context.measureText(line).width)
  );

  // Temporarily set canvas dimensions to render the text
  canvas.width = Math.ceil(maxWidth) + 20; // Add horizontal padding
  canvas.height = Math.ceil(lines.length * lineHeight); // Approximate height

  // Redefine font after resizing canvas
  context.font = `${fontSize}px Arial`;
  context.textBaseline = "top";

  // Render the text
  context.fillStyle = "#000000"; // Black text
  lines.forEach((line, index) => {
    const x = 10; // Horizontal padding
    const y = index * lineHeight; // Vertical position per line
    context.fillText(line, x, y);
  });

  // Measure the precise text height by checking the y-position of the last line
  const preciseHeight = lines.length * lineHeight;

  // Resize canvas to fit the rendered content
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = canvas.width;
  finalCanvas.height = Math.ceil(preciseHeight);
  const finalContext = finalCanvas.getContext("2d");

  if (!finalContext) {
    throw new Error("Failed to get final canvas context");
  }

  // Copy the rendered content to the final canvas
  finalContext.drawImage(canvas, 0, 0, canvas.width, preciseHeight);

  // Create an HTMLImageElement from the canvas
  const img = new Image();
  img.src = finalCanvas.toDataURL("image/webp"); // Generate WebP image
  return img;
}

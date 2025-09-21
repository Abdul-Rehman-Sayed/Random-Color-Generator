// Select DOM elements
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const colorCodeEl = document.getElementById("color-code");
const colorBox = document.getElementById("color-box");
const formatSelect = document.getElementById("format-select");
const historyEl = document.getElementById("color-history"); // Container for color history

// Array to store last generated colors
let colorHistory = [];

// Event listener for "Generate Color" button
generateBtn.addEventListener("click", () => {
  let color;

  // Decide format based on dropdown selection
  if (formatSelect.value === "hex") {
    color = getRandomHexColor(); // Generate HEX color
  } else {
    color = getRandomRGBColor(); // Generate RGB color
  }

  // Update the color code text
  colorCodeEl.innerText = color;

  // Update the background color of the display box
  colorBox.style.backgroundColor = color;

  // Adjust text color for readability
  colorBox.style.color = getContrastYIQ(color);
  // Update color history
  updateHistory(color);
  console.log(`Generated Color: ${color}`);
});

// Event listener for "Copy Color" button
copyBtn.addEventListener("click", () => {
  // Copy current color code to clipboard
  navigator.clipboard
    .writeText(colorCodeEl.innerText)
    .then(() => alert(`Copied: ${colorCodeEl.innerText}`))
    .catch((err) => console.error("Copy failed", err));
});

// Function to generate a random RGB color
function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`; // Return as CSS rgb string
}

// Function to generate a random HEX color
function getRandomHexColor() {
  const hex = Math.floor(Math.random() * 16777215).toString(16); // Convert decimal to hex
  return `#${hex.padStart(6, "0")}`; // Ensure 6 digits
}

// Function to determine if text should be black or white based on background color
function getContrastYIQ(color) {
  let r, g, b;

  // Extract RGB values depending on format
  if (color.startsWith("#")) {
    r = parseInt(color.substr(1, 2), 16);
    g = parseInt(color.substr(3, 2), 16);
    b = parseInt(color.substr(5, 2), 16);
  } else {
    [r, g, b] = color.match(/\d+/g).map(Number);
  }

  // Calculate brightness using YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light backgrounds, white for dark
  return yiq >= 128 ? "black" : "white";
}

// Function to update color history
function updateHistory(color) {
  // Add new color at the beginning
  colorHistory.unshift(color);

  // Keep only last 5 colors
  if (colorHistory.length > 5) colorHistory.pop();

  // Clear current history display
  historyEl.innerHTML = "";

  // Create swatches for each color
  colorHistory.forEach((c) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch"; // Style with CSS
    swatch.style.backgroundColor = c;
    swatch.title = c; // Show color code on hover

    // Clicking a swatch sets it as the main color
    swatch.addEventListener("click", () => {
      colorCodeEl.innerText = c;
      colorBox.style.backgroundColor = c;
      colorBox.style.color = getContrastYIQ(c);
    });

    // Add swatch to history container
    historyEl.appendChild(swatch);
  });
}

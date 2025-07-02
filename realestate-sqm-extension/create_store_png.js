// Node.js script to create a Chrome Store icon PNG
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 128x128 canvas
const size = 128;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Clear canvas with transparency
ctx.clearRect(0, 0, size, size);

// Draw a subtle rounded square background
ctx.fillStyle = '#ffb3b3'; // Light pink background
ctx.beginPath();
ctx.roundRect(0, 0, size, size, size * 0.2);
ctx.fill();

// Draw a border
ctx.strokeStyle = '#000000';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.roundRect(10, 10, size - 20, size - 20, (size - 20) * 0.1);
ctx.stroke();

// House silhouette (black)
const houseWidth = size * 0.5;
const houseHeight = size * 0.4;
const houseX = (size - houseWidth) / 2;
const houseY = size * 0.3;

ctx.fillStyle = '#000000';

// House body
ctx.fillRect(
  houseX, 
  houseY + houseHeight * 0.3, 
  houseWidth, 
  houseHeight * 0.7
);

// House roof
ctx.beginPath();
ctx.moveTo(houseX, houseY + houseHeight * 0.3);
ctx.lineTo(houseX + houseWidth / 2, houseY);
ctx.lineTo(houseX + houseWidth, houseY + houseHeight * 0.3);
ctx.closePath();
ctx.fill();

// Dollar sign
ctx.fillStyle = '#ffb3b3'; // Same as background
ctx.font = 'bold 40px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('$', size / 2, size / 2 + 10);

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(process.env.HOME, 'Downloads', 'store_icon.png'), buffer);

console.log('Store icon saved to ~/Downloads/store_icon.png');

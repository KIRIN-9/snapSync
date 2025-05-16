#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:3000/api/auto-upload';
const IMAGE_PATH = path.join(__dirname, 'test-image.png'); // Create a test image or use an existing one

// Create a simple test image if it doesn't exist
function createTestImage() {
  if (fs.existsSync(IMAGE_PATH)) {
    console.log(`Using existing test image: ${IMAGE_PATH}`);
    return;
  }
  
  // This is a very simple 1x1 pixel PNG
  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );
  
  fs.writeFileSync(IMAGE_PATH, pngData);
  console.log(`Created test image: ${IMAGE_PATH}`);
}

// Upload the image to the auto-upload endpoint
async function uploadImage() {
  try {
    const formData = new FormData();
    const imageStream = fs.createReadStream(IMAGE_PATH);
    
    formData.append('image', imageStream);
    formData.append('filename', 'test-image.png');
    
    console.log('Uploading image to:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful!');
      console.log('Result:', result);
    } else {
      console.error('Upload failed:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

// Main function
async function main() {
  createTestImage();
  await uploadImage();
}

main().catch(console.error);

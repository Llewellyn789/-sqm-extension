# Realestate.com.au Price per Square Metre Extension

This Chrome extension overlays price-per-square-metre data on realestate.com.au property listings, helping you quickly assess property value compared to suburb medians.

## Features

- Automatically calculates price per square metre on property listings
- Compares with suburb median values
- Shows the difference between listing and median values
- Clean, unobtrusive overlay design

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the `realestate-sqm-extension` folder
5. The extension is now installed and will activate on realestate.com.au property listing pages

## How It Works

The extension activates on realestate.com.au property listing pages and:

1. Extracts the property price (calculating average if a range is provided)
2. Finds the land size in square metres
3. Calculates the price per square metre
4. Identifies the suburb from the listing
5. Compares with hardcoded median values by suburb
6. Displays an overlay with the calculated values

## Customization

To add or update suburb median values, edit the `MEDIAN_PRICES_BY_SUBURB` object in `content.js`.

## Note

This extension is for informational purposes only. Property valuations should consider many factors beyond price per square metre.

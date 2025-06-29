// Realestate.com.au Price per Square Metre Extension
// This script runs on property listing pages and overlays price-per-square-metre data

// Dictionary of median $/sqm values by suburb (hardcoded initially)
const MEDIAN_PRICES_BY_SUBURB = {
  'Lower Plenty': 1400,
  'Eltham': 1350,
  'Templestowe': 1500,
  'Doncaster': 1600,
  'Balwyn': 2200,
  'Brighton': 3500,
  'Toorak': 4200,
  'Richmond': 2800,
  'Brunswick': 2100,
  'Coburg': 1800,
  // Add more suburbs as needed
};

// Function to extract and parse the price range
function extractPrice() {
  console.log('Extracting price...');
  
  try {
    // First, look specifically for "Indicative price: $X,XXX,XXX" format
    const indicativePriceElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.trim().match(/Indicative price.*\$[0-9,]+/i)
    );
    
    if (indicativePriceElements.length > 0) {
      console.log('Found indicative price element:', indicativePriceElements[0].textContent.trim());
      const priceMatch = indicativePriceElements[0].textContent.match(/\$([0-9,]+)/); 
      if (priceMatch && priceMatch[1]) {
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));
        console.log('Parsed indicative price:', price);
        return price;
      }
    }
    
    // Try multiple selectors for price elements
    let priceElement = document.querySelector('[data-testid="listing-details__price"]');
    
    // Fallback selectors if the primary one doesn't work
    if (!priceElement) {
      // Look for elements with "Indicative price" label
      const priceLabels = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.trim().includes('Indicative price')
      );
      
      if (priceLabels.length > 0) {
        // Try to find the price in the next sibling or parent
        const priceLabel = priceLabels[0];
        const parent = priceLabel.parentElement;
        if (parent) {
          const potentialPriceElements = Array.from(parent.querySelectorAll('*'));
          for (const el of potentialPriceElements) {
            if (el.textContent && el.textContent.trim().match(/\$[0-9,]+/)) {
              priceElement = el;
              console.log('Found price element via Indicative price label:', priceElement.textContent.trim());
              break;
            }
          }
        }
      }
    }
    
    // Try to find by content pattern
    if (!priceElement) {
      const allElements = document.querySelectorAll('*');
      const priceMatches = Array.from(allElements).filter(el => 
        el.textContent && el.textContent.trim().match(/^\$[0-9,]+(\s*-\s*|\s*–\s*|-)\$?[0-9,]+$/)
      );
      
      if (priceMatches.length > 0) {
        priceElement = priceMatches[0];
        console.log('Found price element by pattern matching:', priceElement.textContent.trim());
      }
    }
    
    // Try to find a single price (not a range)
    if (!priceElement) {
      const allElements = document.querySelectorAll('*');
      const priceMatches = Array.from(allElements).filter(el => 
        el.textContent && el.textContent.trim().match(/^\$[0-9,]+$/)
      );
      
      if (priceMatches.length > 0) {
        priceElement = priceMatches[0];
        console.log('Found single price element:', priceElement.textContent.trim());
      }
    }
    
    if (!priceElement) {
      console.log('Price element not found');
      return null;
    }
    
    const priceText = priceElement.textContent.trim();
    console.log('Raw price text:', priceText);
    
    // Handle different price formats
    // Format: "$1,200,000–$1,300,000" or "$1,200,000-$1,300,000"
    if (priceText.includes('–') || priceText.includes('-')) {
      const separator = priceText.includes('–') ? '–' : '-';
      const prices = priceText.split(separator);
      const lowerPrice = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
      const upperPrice = parseFloat(prices[1].replace(/[^0-9.]/g, ''));
      console.log(`Parsed price range: ${lowerPrice} to ${upperPrice}, average: ${(lowerPrice + upperPrice) / 2}`);
      return (lowerPrice + upperPrice) / 2;
    }
    
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    console.log('Parsed single price:', price);
    return price;
  } catch (error) {
    console.error('Error extracting price:', error);
    return null;
  }
}

// Function to extract land size
function extractLandSize() {
  console.log('Extracting land size...');
  
  try {
    // 1. Look for the specific format shown in the screenshot (387m²)
    const landSizeElements = document.querySelectorAll('[data-testid="property-features-feature-land-size"], [data-testid="property-features__feature"]');
    console.log('Land size elements found:', landSizeElements.length);
    
    for (const element of landSizeElements) {
      if (element && element.textContent) {
        const text = element.textContent.trim();
        console.log('Checking land size element:', text);
        if (text.includes('m²')) {
          console.log('Found land size in property features:', text);
          const match = text.match(/([0-9,]+)\s*m²/);
          if (match && match[1]) {
            const size = parseFloat(match[1].replace(/,/g, ''));
            console.log('Parsed land size:', size);
            return size;
          }
        }
      }
    }
    
    // 2. Look for any element containing both a number and m² symbol
    const allElements = document.querySelectorAll('*');
    console.log('Searching through all elements for land size...');
    
    // First look for elements that ONLY contain the land size (higher confidence)
    const exactLandSizeMatches = Array.from(allElements).filter(el => {
      if (!el || !el.textContent) return false;
      const text = el.textContent.trim();
      return text.match(/^[0-9,]+\s*m²$/);
    });
    
    if (exactLandSizeMatches.length > 0) {
      const text = exactLandSizeMatches[0].textContent.trim();
      console.log('Found exact land size match:', text);
      const match = text.match(/([0-9,]+)\s*m²/);
      if (match && match[1]) {
        const size = parseFloat(match[1].replace(/,/g, ''));
        console.log('Parsed exact land size:', size);
        return size;
      }
    }
    
    // Then look for any element containing m² (lower confidence)
    const landSizeMatches = Array.from(allElements).filter(el => {
      if (!el || !el.textContent) return false;
      return el.textContent.trim().match(/[0-9,]+\s*m²/);
    });
    
    if (landSizeMatches.length > 0) {
      // Log all matches to help with debugging
      landSizeMatches.forEach((el, i) => {
        console.log(`Land size match ${i}:`, el.textContent.trim());
      });
      
      const text = landSizeMatches[0].textContent.trim();
      console.log('Found land size by pattern matching:', text);
      const match = text.match(/([0-9,]+)\s*m²/);
      if (match && match[1]) {
        const size = parseFloat(match[1].replace(/,/g, ''));
        console.log('Parsed land size:', size);
        return size;
      }
    }
    
    // 3. Look for the land size in the page title or metadata
    const metaTags = document.querySelectorAll('meta');
    for (const meta of metaTags) {
      const content = meta.getAttribute('content');
      if (content && content.includes('m²')) {
        console.log('Found land size in meta tag:', content);
        const match = content.match(/([0-9,]+)\s*m²/);
        if (match && match[1]) {
          const size = parseFloat(match[1].replace(/,/g, ''));
          console.log('Parsed land size from meta:', size);
          return size;
        }
      }
    }
    
    // 4. Look for specific patterns in the page that might indicate land size
    // This is specifically for the format in the screenshot (387m²)
    const landSizePattern = /\b(\d{3,4})m²\b/;
    const bodyText = document.body.textContent;
    if (bodyText) {
      const bodyMatch = bodyText.match(landSizePattern);
      if (bodyMatch && bodyMatch[1]) {
        const size = parseFloat(bodyMatch[1]);
        console.log('Found land size in body text:', size);
        return size;
      }
    }
    
  } catch (error) {
    console.error('Error extracting land size:', error);
  }
  
  console.log('Land size not found');
  return null;
}

// Function to extract suburb name from the listing title
function extractSuburb() {
  console.log('Extracting suburb...');
  
  // Try to get from the address in the page title
  try {
    const titleElement = document.querySelector('h1');
    if (titleElement && titleElement.textContent) {
      const titleText = titleElement.textContent.trim();
      console.log('Title text:', titleText);
      
      // Format: "123 Main St, Suburb, State 1234"
      const parts = titleText.split(',');
      if (parts && parts.length >= 2) {
        const suburb = parts[parts.length - 2].trim();
        console.log('Extracted suburb from title:', suburb);
        return suburb;
      }
    }
  } catch (error) {
    console.error('Error extracting suburb from title:', error);
  }
  
  // Fallback: try to extract from URL
  // Format: https://www.realestate.com.au/property-house-vic-suburb-12345678
  try {
    const urlMatch = window.location.href.match(/property-[^-]+-[^-]+-([^-]+)-\d+/);
    if (urlMatch && urlMatch[1]) {
      const suburb = urlMatch[1].replace(/-/g, ' ');
      console.log('Extracted suburb from URL:', suburb);
      return suburb;
    }
  } catch (error) {
    console.error('Error extracting suburb from URL:', error);
  }
  
  // Try to extract from breadcrumbs
  try {
    const breadcrumbs = document.querySelectorAll('a[href*="/vic/"], a[href*="/nsw/"], a[href*="/qld/"], a[href*="/sa/"], a[href*="/wa/"], a[href*="/nt/"], a[href*="/tas/"], a[href*="/act/"]');
    if (breadcrumbs && breadcrumbs.length > 0) {
      for (const crumb of breadcrumbs) {
        if (crumb.textContent && !crumb.textContent.includes('Back to')) {
          console.log('Extracted suburb from breadcrumb:', crumb.textContent.trim());
          return crumb.textContent.trim();
        }
      }
    }
  } catch (error) {
    console.error('Error extracting suburb from breadcrumbs:', error);
  }
  
  // Try to find suburb in any text that looks like a location
  try {
    // Look for VIC, NSW, QLD, etc. followed by a postcode
    const statePostcodeElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && /\b(VIC|NSW|QLD|SA|WA|NT|TAS|ACT)\s+\d{4}\b/i.test(el.textContent)
    );
    
    if (statePostcodeElements.length > 0) {
      const text = statePostcodeElements[0].textContent;
      const match = text.match(/([\w\s]+),\s*(VIC|NSW|QLD|SA|WA|NT|TAS|ACT)/i);
      if (match && match[1]) {
        console.log('Extracted suburb from state/postcode element:', match[1].trim());
        return match[1].trim();
      }
    }
  } catch (error) {
    console.error('Error extracting suburb from state/postcode:', error);
  }
  
  console.log('Suburb not found');
  return 'Unknown';
}

// Function to create and inject the overlay
function createOverlay(pricePerSqm, medianPrice, suburb, errorMessage = null) {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'sqm-price-overlay';
  overlay.style.backgroundColor = '#ffffff';
  overlay.style.border = '1px solid #e4e4e4';
  overlay.style.borderRadius = '8px';
  overlay.style.padding = '12px';
  overlay.style.margin = '0';
  overlay.style.fontSize = '14px';
  overlay.style.lineHeight = '1.4';
  overlay.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
  overlay.style.position = 'relative';
  overlay.style.zIndex = '100';
  overlay.style.maxWidth = '200px';
  overlay.style.minWidth = '180px';
  
  // Create content
  let contentHtml = `
    <div style="font-weight: bold; margin-bottom: 8px; color: #333; font-size: 16px;">Price/SQM</div>
  `;
  
  // If we have an error message, display that instead of calculations
  if (errorMessage) {
    contentHtml += `<div style="color: #666;">${errorMessage}</div>`;
  } else if (pricePerSqm) {
    // Format the price per square meter - round to whole number and remove decimals
    const roundedPrice = Math.round(pricePerSqm);
    contentHtml += `
      <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px;">$${roundedPrice.toLocaleString()}</div>
    `;
    
    // Only show median comparison if we have data for this suburb
    if (medianPrice && medianPrice > 0) {
      const roundedMedian = Math.round(medianPrice);
      contentHtml += `
        <div style="color: #666; margin-bottom: 3px;">Median: $${roundedMedian.toLocaleString()}</div>
      `;
      
      // Calculate the difference from median as a percentage
      const percentDifference = ((roundedPrice - roundedMedian) / roundedMedian) * 100;
      const percentDifferenceAbs = Math.abs(percentDifference);
      const isAbove = percentDifference >= 0;
      // Round to 1 decimal place
      const roundedPercentDiff = Math.round(percentDifferenceAbs * 10) / 10;
      const differenceText = isAbove ? `${roundedPercentDiff}% above` : `${roundedPercentDiff}% below`;
      const differenceColor = isAbove ? '#d12440' : '#0ea47a';
      
      contentHtml += `
        <div style="color: ${differenceColor}; font-weight: 500;">${differenceText}</div>
      `;
    } else {
      contentHtml += `
        <div style="color: #888;">No median data for ${suburb || 'this suburb'}</div>
      `;
    }
  } else {
    contentHtml += `
      <div style="color: #888;">Could not calculate price per square meter</div>
    `;
  }
  
  overlay.innerHTML = contentHtml;
  
  // Try multiple places to insert the overlay
  const insertOverlay = () => {
    // First try: Look for the "Price guide details" link and position the overlay next to it
    const priceGuideLinks = Array.from(document.querySelectorAll('a')).filter(el => 
      el.textContent && el.textContent.trim() === 'Price guide details'
    );
    
    if (priceGuideLinks.length > 0) {
      console.log('Found Price guide details link, positioning overlay next to it');
      const priceGuideLink = priceGuideLinks[0];
      
      // Find the parent container of the price guide link
      let parentContainer = priceGuideLink.parentNode;
      
      // Create a container to hold both the price guide link and our overlay
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.alignItems = 'center';
      container.style.gap = '20px';
      container.style.marginTop = '10px';
      container.style.marginBottom = '10px';
      
      // Clone the price guide link to keep it in the DOM
      const linkClone = priceGuideLink.cloneNode(true);
      
      // Add the link and overlay to our container
      container.appendChild(linkClone);
      container.appendChild(overlay);
      
      // Replace the original link with our container
      if (parentContainer) {
        parentContainer.replaceChild(container, priceGuideLink);
        return true;
      }
    }
    
    // Second try: Look for any element containing "Price guide details" text
    const priceGuideElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.trim() === 'Price guide details'
    );
    
    if (priceGuideElements.length > 0) {
      console.log('Found Price guide details element, positioning overlay next to it');
      const priceGuideElement = priceGuideElements[0];
      
      // Find the parent container
      let parentContainer = priceGuideElement.parentNode;
      
      // Create a flex container for horizontal layout
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.alignItems = 'center';
      container.style.gap = '20px';
      container.style.marginTop = '10px';
      container.style.marginBottom = '10px';
      
      // Clone the price guide element
      const elementClone = priceGuideElement.cloneNode(true);
      
      // Add both elements to the container
      container.appendChild(elementClone);
      container.appendChild(overlay);
      
      // Replace the original element with our container
      if (parentContainer) {
        parentContainer.replaceChild(container, priceGuideElement);
        return true;
      }
    }
    
    // Fallback: Try to find the address element (h1) and insert after it
    const addressElement = document.querySelector('h1');
    if (addressElement) {
      // Create a container for better positioning
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.justifyContent = 'flex-start';
      container.style.alignItems = 'flex-start';
      container.style.gap = '20px';
      container.style.marginTop = '10px';
      container.style.marginBottom = '10px';
      
      // Find the price element to position next to it
      const priceElement = document.querySelector('[data-testid="listing-details__price"]');
      if (priceElement) {
        // Clone the price element to place in our container
        const priceClone = priceElement.cloneNode(true);
        container.appendChild(priceClone);
        container.appendChild(overlay);
        
        // Hide the original price element
        priceElement.style.display = 'none';
        
        // Insert our container after the address
        if (addressElement.parentNode) {
          addressElement.parentNode.insertBefore(container, addressElement.nextSibling);
          return true;
        }
      } else {
        // If no price element, just insert the overlay after the address
        if (addressElement.parentNode) {
          addressElement.parentNode.insertBefore(overlay, addressElement.nextSibling);
          return true;
        }
      }
    }
    
    // Last resort: insert at the top of the page
    const firstElement = document.body.firstChild;
    if (firstElement) {
      document.body.insertBefore(overlay, firstElement);
      return true;
    }
    
    return false;
  };
  
  // Try to insert the overlay, and if it fails, retry after a short delay
  if (!insertOverlay()) {
    setTimeout(insertOverlay, 1000);
  }
}

// Main function to run the extension logic
function analyzePricePerSquareMetre() {
  console.log('Running price per square meter analysis...');
  
  // Check if we're on a property page
  if (!window.location.href.includes('realestate.com.au/property-')) {
    console.log('Not on a property page, skipping analysis');
    return;
  }
  
  // Check if overlay already exists to avoid duplicates
  if (document.getElementById('sqm-price-overlay')) {
    console.log('Overlay already exists, skipping analysis');
    return;
  }
  
  try {
    // Extract data from the page
    const price = extractPrice();
    const landSize = extractLandSize();
    const suburb = extractSuburb();
    
    console.log('Extracted data:', { price, landSize, suburb });
    
    // Check if we have all the necessary data
    if (!price) {
      console.log('Missing price data for calculation');
      createOverlay(null, null, suburb, 'Could not extract property price');
      return;
    }
    
    if (!landSize) {
      console.log('Missing land size data for calculation');
      createOverlay(null, null, suburb, 'Could not extract land size');
      return;
    }
    
    // Calculate price per square metre
    const pricePerSqm = price / landSize;
    console.log('Calculated price per sqm:', pricePerSqm);
    
    // Normalize suburb name for lookup
    let normalizedSuburb = '';
    let medianPrice = 0;
    
    if (suburb) {
      normalizedSuburb = suburb.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      // Try to find the suburb in our dictionary
      medianPrice = MEDIAN_PRICES_BY_SUBURB[normalizedSuburb] || 0;
      
      // If not found, try without case sensitivity
      if (medianPrice === 0) {
        const suburbLower = normalizedSuburb.toLowerCase();
        const matchingSuburb = Object.keys(MEDIAN_PRICES_BY_SUBURB).find(key => 
          key.toLowerCase() === suburbLower
        );
        
        if (matchingSuburb) {
          medianPrice = MEDIAN_PRICES_BY_SUBURB[matchingSuburb];
          normalizedSuburb = matchingSuburb; // Use the correctly cased version
        }
      }
      
      if (medianPrice === 0) {
        console.log(`No median price found for suburb: ${normalizedSuburb}`);
        console.log('Available suburbs:', Object.keys(MEDIAN_PRICES_BY_SUBURB).length);
      } else {
        console.log(`Found median price for ${normalizedSuburb}: $${medianPrice}/sqm`);
      }
    }
    
    // Create and inject the overlay
    createOverlay(pricePerSqm, medianPrice, normalizedSuburb);
    
    console.log('Price per square metre analysis:', {
      price,
      landSize,
      suburb: normalizedSuburb,
      pricePerSqm,
      medianPrice
    });
  } catch (error) {
    console.error('Error in analyzePricePerSquareMetre:', error);
    createOverlay(null, null, null, 'Error analyzing property data');
  }
}

// Set up a MutationObserver to detect URL changes (for SPA behavior)
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('URL changed to:', location.href);
    // Wait longer for the page to fully load before analyzing
    setTimeout(analyzePricePerSquareMetre, 5000);
  }
});

observer.observe(document, { subtree: true, childList: true });

// Run the analysis after page load with a longer delay
// Increase the delay to ensure all elements are loaded
console.log('Setting up initial analysis with delay...');
setTimeout(analyzePricePerSquareMetre, 5000);

// Add multiple retry mechanisms in case the first attempt fails
setTimeout(() => {
  if (!document.getElementById('sqm-price-overlay')) {
    console.log('First retry: Running analysis again after 8 second delay...');
    analyzePricePerSquareMetre();
  }
}, 8000);

setTimeout(() => {
  if (!document.getElementById('sqm-price-overlay')) {
    console.log('Second retry: Running analysis again after 12 second delay...');
    analyzePricePerSquareMetre();
  }
}, 12000);

// Add a DOM content loaded listener as another trigger point
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  setTimeout(analyzePricePerSquareMetre, 3000);
});

// Add a window load listener as a final trigger point
window.addEventListener('load', () => {
  console.log('Window load event fired');
  setTimeout(analyzePricePerSquareMetre, 4000);
});

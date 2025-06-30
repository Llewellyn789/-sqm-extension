// Realestate.com.au Price per Square Metre Extension
// This script runs on property listing pages and overlays price-per-square-metre data

// Dictionary of median $/sqm values by suburb from the CSV data
const MEDIAN_PRICES_BY_SUBURB = {
  'Abbotsford': 4679,
  'Albert Park': 8400,
  'Alphington': 7429,
  'Armadale': 7752,
  'Ascot Vale': 3564,
  'Ashburton': 5291,
  'Ashwood': 3309,
  'Aspendale': 2667,
  'Aspendale Gardens': 2596,
  'Avondale Heights': 2279,
  'Balwyn': 8114,
  'Balwyn North': 6841,
  'Balaclava': 0,
  'Beaumaris': 4078,
  'Bellfield': 1944,
  'Bentleigh': 4438,
  'Bentleigh East': 3500,
  'Black Rock': 5822,
  'Blackburn': 3667,
  'Blackburn North': 3122,
  'Blackburn South': 3204,
  'Bonbeach': 2372,
  'Box Hill': 3833,
  'Box Hill North': 2980,
  'Box Hill South': 3412,
  'Braeside': 0,
  'Braybrook': 1774,
  'Briar Hill': 2324,
  'Brighton': 7389,
  'Brighton East': 5813,
  'Brunswick': 3338,
  'Brunswick East': 4050,
  'Brunswick West': 3203,
  'Bulleen': 2921,
  'Bundoora': 2148,
  'Burnley': 0,
  'Burwood': 3411,
  'Camberwell': 7614,
  'Canterbury': 10957,
  'Carlton': 4680,
  'Carlton North': 6723,
  'Carnegie': 4550,
  'Carrum': 0,
  'Caulfield': 0,
  'Caulfield East': 0,
  'Caulfield North': 5475,
  'Caulfield South': 4425,
  'Chadstone': 2532,
  'Chelsea': 2261,
  'Chelsea Heights': 2111,
  'Cheltenham': 2761,
  'Clarinda': 2330,
  'Clayton': 3309,
  'Clayton South': 2089,
  'Clifton Hill': 6098,
  'Coburg': 3125,
  'Coburg North': 2450,
  'Collingwood': 4679,
  'Cremorne': 0,
  'Deepdene': 9714,
  'Dingley Village': 2340,
  'Docklands': 0,
  'Doncaster': 3191,
  'Doncaster East': 3340,
  'Donvale': 3255,
  'Eaglemont': 3900,
  'East Melbourne': 0,
  'Edithvale': 1947,
  'Elsternwick': 0,
  'Eltham': 2728,
  'Eltham North': 2733,
  'Elwood': 10900,
  'Essendon': 3802,
  'Essendon North': 0,
  'Essendon West': 0,
  'Fairfield': 5870,
  'Fawkner': 2010,
  'Fitzroy': 5179,
  'Fitzroy North': 5116,
  'Flemington': 4800,
  'Forest Hill': 2444,
  'Footscray': 2369,
  'Gardenvale': 0,
  'Glen Huntly': 0,
  'Glen Iris': 7372,
  'Glen Waverley': 3617,
  'Glenroy': 2206,
  'Gowanbrae': 2275,
  'Greensborough': 2224,
  'Hadfield': 2205,
  'Hampton': 5178,
  'Hampton East': 2558,
  'Hawthorn': 6971,
  'Hawthorn East': 6971,
  'Heatherton': 2766,
  'Heidelberg': 3289,
  'Heidelberg Heights': 1867,
  'Heidelberg West': 1751,
  'Highett': 3169,
  'Hughesdale': 3117,
  'Huntingdale': 0,
  'Ivanhoe': 4428,
  'Ivanhoe East': 5172,
  'Keilor East': 2227,
  'Kensington': 4700,
  'Kew': 7686,
  'Kew East': 6429,
  'Kingsbury': 1891,
  'Kingsville': 3071,
  'Kooyong': 0,
  'Lower Plenty': 4833,
  'Macleod': 2538,
  'Maidstone': 2083,
  'Malvern': 9693,
  'Malvern East': 6670,
  'Maribyrnong': 2636,
  'Mckinnon': 0,
  'Melbourne': 5200,
  'Mentone': 3090,
  'Middle Park': 12120,
  'Mitcham': 2667,
  'Mont Albert': 7687,
  'Mont Albert North': 4133,
  'Montmorency': 2500,
  'Moonee Ponds': 3465,
  'Moorabbin': 2606,
  'Mordialloc': 3287,
  'Mount Waverley': 3469,
  'Mulgrave': 2511,
  'Murrumbeena': 3503,
  'Niddrie': 3023,
  'North Melbourne': 4960,
  'Northcote': 4107,
  'Notting Hill': 0,
  'Nunawading': 2617,
  'Oak Park': 1663,
  'Oakleigh': 2968,
  'Oakleigh East': 2735,
  'Oakleigh South': 2553,
  'Ormond': 4529,
  'Park Orchards': 4043,
  'Parkdale': 3766,
  'Parkville': 0,
  'Pascoe Vale': 3010,
  'Pascoe Vale South': 3000,
  'Patterson Lakes': 2170,
  'Port Melbourne': 7352,
  'Prahran': 5958,
  'Preston': 2827,
  'Princes Hill': 6259,
  'Reservoir': 2167,
  'Richmond': 5091,
  'Ripponlea': 0,
  'Rosanna': 3007,
  'Sandringham': 4611,
  'Seddon': 2917,
  'South Melbourne': 6640,
  'South Wharf': 0,
  'South Yarra': 6142,
  'Southbank': 0,
  'St Kilda': 6680,
  'St Kilda East': 6400,
  'St Kilda West': 0,
  'Strathmore': 3647,
  'Strathmore Heights': 0,
  'Surrey Hills': 7086,
  'Templestowe': 3383,
  'Templestowe Lower': 2766,
  'Thornbury': 3298,
  'Toorak': 9500,
  'Tottenham': 0,
  'Travancore': 0,
  'Tullamarine': 1846,
  'Vermont': 2537,
  'Vermont South': 3304,
  'Viewbank': 2589,
  'Warrandyte': 2654,
  'Warrandyte South': 0,
  'Waterways': 3191,
  'Watsonia': 1822,
  'Watsonia North': 1889,
  'West Footscray': 2077,
  'West Melbourne': 0,
  'Wheelers Hill': 3147,
  'Williamstown': 3929,
  'Windsor': 4207,
  'Wonga Park': 3649,
  'Yallambie': 1963,
  'Yarraville': 2680
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
  let contentHtml = '';
  
  // If we have an error message, display that instead of calculations
  if (errorMessage) {
    contentHtml += `<div style="color: #666;">${errorMessage}</div>`;
  } else if (pricePerSqm) {
    // Format the price per square meter - round to whole number and remove decimals
    const roundedPrice = Math.round(pricePerSqm);
    contentHtml += `
      <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px;">Price/SQM: $${roundedPrice.toLocaleString()}</div>
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
    // First try: Look for the "Price guide details" text and position below it
    const priceGuideLinks = Array.from(document.querySelectorAll('a')).filter(el => 
      el.textContent && el.textContent.trim() === 'Price guide details'
    );
    
    if (priceGuideLinks.length > 0) {
      console.log('Found Price guide details link, positioning overlay below it');
      const priceGuideElement = priceGuideLinks[0];
      
      // Find the parent container that contains both the price guide and potentially other elements
      let parentContainer = priceGuideElement.parentNode;
      while (parentContainer && parentContainer.tagName !== 'DIV' && parentContainer.tagName !== 'SECTION') {
        parentContainer = parentContainer.parentNode;
      }
      
      if (parentContainer) {
        // Create a wrapper for proper positioning
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '20px'; // Increased margin to position it lower
        wrapper.style.marginBottom = '15px';
        wrapper.style.clear = 'both'; // Ensure it appears on a new line
        wrapper.appendChild(overlay);
        
        // Insert after the parent container to position it below the entire price guide section
        if (parentContainer.parentNode) {
          parentContainer.parentNode.insertBefore(wrapper, parentContainer.nextSibling);
          return true;
        }
      }
    }
    
    // Second try: Look for any element containing "Price guide details" text
    const priceGuideTextElements = Array.from(document.querySelectorAll('*')).filter(el => {
      if (!el.textContent) return false;
      const isMatch = el.textContent.includes('Price guide details') && !el.tagName.match(/^(HTML|BODY|SCRIPT|STYLE)$/i);
      // Exclude elements we've already checked in the first try
      const isInPreviousSet = priceGuideLinks.some(link => link === el || link.contains(el) || el.contains(link));
      return isMatch && !isInPreviousSet;
    });
    
    if (priceGuideTextElements.length > 0) {
      console.log('Found element with Price guide details text, positioning overlay below it');
      const element = priceGuideTextElements[0];
      
      // Find a suitable parent container
      let parentContainer = element;
      for (let i = 0; i < 3; i++) {
        if (parentContainer.parentNode) {
          parentContainer = parentContainer.parentNode;
        }
      }
      
      // Create a wrapper for proper positioning
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '20px';
      wrapper.style.marginBottom = '15px';
      wrapper.style.clear = 'both';
      wrapper.appendChild(overlay);
      
      // Insert after the parent container
      if (parentContainer.parentNode) {
        parentContainer.parentNode.insertBefore(wrapper, parentContainer.nextSibling);
        return true;
      }
    }
    
    // Second try: Look for price guide details as a fallback
    const priceGuideElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.includes('Price guide details')
    );
    
    if (priceGuideElements.length > 0) {
      console.log('Found Price guide details element as fallback');
      const priceGuideElement = priceGuideElements[0];
      
      // Find the parent container
      let parentContainer = priceGuideElement.parentNode;
      
      // Go up a few levels to find the main price container
      for (let i = 0; i < 3; i++) {
        if (parentContainer && parentContainer.parentNode) {
          parentContainer = parentContainer.parentNode;
        }
      }
      
      if (parentContainer) {
        // Create a wrapper for proper positioning
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '10px';
        wrapper.style.marginBottom = '15px';
        wrapper.appendChild(overlay);
        
        // Insert at the beginning of this container
        parentContainer.insertBefore(wrapper, parentContainer.firstChild);
        return true;
      }
    }
    
    // Third try: Look for "Price guide details" text in any element's content
    // This is a more aggressive search than the previous two tries
    const allElements = Array.from(document.querySelectorAll('*'));
    const priceGuideContainers = allElements.filter(el => {
      if (!el.textContent) return false;
      return el.textContent.toLowerCase().includes('price guide') && 
             !el.tagName.match(/^(HTML|BODY|SCRIPT|STYLE)$/i);
    });
    
    if (priceGuideContainers.length > 0) {
      console.log('Found element containing price guide text, positioning overlay below it');
      const container = priceGuideContainers[0];
      
      // Find the parent container
      let parentContainer = container;
      // Go up a few levels to find a good container
      for (let i = 0; i < 4; i++) {
        if (parentContainer.parentNode && parentContainer.parentNode.tagName !== 'BODY') {
          parentContainer = parentContainer.parentNode;
        }
      }
      
      // Create a wrapper for proper positioning
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '25px'; // Extra margin to position it even lower
      wrapper.style.marginBottom = '15px';
      wrapper.style.clear = 'both';
      wrapper.appendChild(overlay);
      
      // Insert after the parent container
      if (parentContainer.parentNode) {
        parentContainer.parentNode.insertBefore(wrapper, parentContainer.nextSibling);
        return true;
      }
    }
    
    // Fourth try: Look for the main price element and position below it
    const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
      if (!el.textContent) return false;
      const text = el.textContent.trim();
      // Look for text that looks like a price (e.g., $6,550,000)
      return /^\$[0-9,]+$/.test(text) || /^\$[0-9,]+,[0-9]{3}$/.test(text);
    });
    
    // Sort by font size (descending) to find the most prominent price
    priceElements.sort((a, b) => {
      const aStyle = window.getComputedStyle(a);
      const bStyle = window.getComputedStyle(b);
      const aSize = parseInt(aStyle.fontSize) || 0;
      const bSize = parseInt(bStyle.fontSize) || 0;
      return bSize - aSize;
    });
    
    if (priceElements.length > 0) {
      console.log('Found price element, positioning overlay below it:', priceElements[0].textContent);
      const priceElement = priceElements[0];
      
      // Find the parent container
      let parentContainer = priceElement.parentNode;
      // Go up a few levels to find a good container
      for (let i = 0; i < 2; i++) {
        if (parentContainer.parentNode && parentContainer.parentNode.tagName !== 'BODY') {
          parentContainer = parentContainer.parentNode;
        }
      }
      
      // Create a wrapper for proper positioning
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '30px'; // Extra margin to position it lower
      wrapper.style.marginBottom = '15px';
      wrapper.style.clear = 'both';
      wrapper.appendChild(overlay);
      
      // Insert after the parent container
      if (parentContainer.parentNode) {
        parentContainer.parentNode.insertBefore(wrapper, parentContainer.nextSibling);
        return true;
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

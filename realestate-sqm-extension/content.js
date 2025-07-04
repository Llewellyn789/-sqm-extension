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
    // Format: "$1,200,000–$1,300,000" or "$1,200,000-$1,300,000" or "$990,000 - $1,075,000"
    if (priceText.includes('–') || priceText.includes('-')) {
      console.log('Detected price range format');
      // Extract all numbers from the string
      const allNumbers = priceText.match(/\$([0-9,]+)/g);
      if (allNumbers && allNumbers.length >= 2) {
        const lowerPrice = parseFloat(allNumbers[0].replace(/[^0-9.]/g, ''));
        const upperPrice = parseFloat(allNumbers[1].replace(/[^0-9.]/g, ''));
        console.log(`Parsed price range: ${lowerPrice} to ${upperPrice}, average: ${(lowerPrice + upperPrice) / 2}`);
        return (lowerPrice + upperPrice) / 2;
      }
      
      // Fallback to old method
      const separator = priceText.includes('–') ? '–' : '-';
      const prices = priceText.split(separator);
      const lowerPrice = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
      const upperPrice = parseFloat(prices[1].replace(/[^0-9.]/g, ''));
      console.log(`Parsed price range (fallback): ${lowerPrice} to ${upperPrice}, average: ${(lowerPrice + upperPrice) / 2}`);
      return (lowerPrice + upperPrice) / 2;
    }
    
    // Handle price with 'k' suffix (e.g., $650k)
    if (priceText.toLowerCase().includes('k')) {
      const match = priceText.match(/\$([0-9,.]+)k/i);
      if (match && match[1]) {
        const price = parseFloat(match[1].replace(/,/g, '')) * 1000;
        console.log('Parsed price with k suffix:', price);
        return price;
      }
    }
    
    // Handle price with 'm' suffix (e.g., $1.2m)
    if (priceText.toLowerCase().includes('m')) {
      const match = priceText.match(/\$([0-9,.]+)m/i);
      if (match && match[1]) {
        const price = parseFloat(match[1].replace(/,/g, '')) * 1000000;
        console.log('Parsed price with m suffix:', price);
        return price;
      }
    }
    
    // Handle standard price format
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
    // First, look for land size in the property details section
    // This targets the format shown in the screenshot (256m²)
    const allElements = document.querySelectorAll('*');
    console.log('Searching for land size in all elements...');
    
    // Look for elements that contain both a number and m² symbol
    for (const element of allElements) {
      if (element && element.textContent) {
        const text = element.textContent.trim();
        // Check for the format like "256m²" with no spaces
        if (/\d+m²/.test(text)) {
          console.log('Found potential land size (no space):', text);
          const match = text.match(/(\d+)m²/);
          if (match && match[1]) {
            const size = parseFloat(match[1]);
            console.log('Parsed land size (no space):', size);
            return size;
          }
        }
        // Check for the format with a space like "256 m²"
        else if (text.includes('m²')) {
          console.log('Found potential land size with space:', text);
          const match = text.match(/([0-9,]+)\s*m²/);
          if (match && match[1]) {
            const size = parseFloat(match[1].replace(/,/g, ''));
            console.log('Parsed land size with space:', size);
            return size;
          }
        }
      }
    }
    
    // 1. Look for the specific format using data-testid attributes
    const landSizeElements = document.querySelectorAll('[data-testid="property-features-feature-land-size"], [data-testid="property-features__feature"]');
    console.log('Land size elements found by data-testid:', landSizeElements.length);
    
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
    // We already searched all elements above, but now we'll look for different patterns
    console.log('Searching through all elements for land size with different patterns...');
    
    // First look for elements that ONLY contain the land size (higher confidence)
    const exactLandSizeMatches = Array.from(document.querySelectorAll('*')).filter(el => {
      if (!el || !el.textContent) return false;
      // Look for elements that might contain just the number and m² symbol
      return el.textContent.trim().match(/^\d+m\u00b2$/) || 
             el.textContent.trim().match(/^\d+\s*m\u00b2$/) ||
             el.textContent.trim().match(/^[0-9,]+\s*m²$/) || 
             el.textContent.trim().match(/^\d+m²$/);
    });
    
    if (exactLandSizeMatches.length > 0) {
      const text = exactLandSizeMatches[0].textContent.trim();
      console.log('Found exact land size match:', text);
      // Try multiple regex patterns to match different formats
      const match = text.match(/([0-9,]+)\s*m²/) || 
                   text.match(/(\d+)\s*m\u00b2/) || 
                   text.match(/(\d+)m\u00b2/) || 
                   text.match(/(\d+)m²/);
      if (match && match[1]) {
        const size = parseFloat(match[1].replace(/,/g, ''));
        console.log('Parsed exact land size:', size);
        return size;
      }
    }
    
    // Then look for any element containing m² (lower confidence)
    const landSizeMatches = Array.from(document.querySelectorAll('*')).filter(el => {
      if (!el || !el.textContent) return false;
      return el.textContent.trim().match(/[0-9,]+\s*m²/) || el.textContent.trim().match(/\d+m²/);
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
    // This is specifically for the format in the screenshot (256m²)
    const landSizePattern = /\b(\d+)m²\b/;
    const bodyText = document.body.textContent;
    if (bodyText) {
      const bodyMatch = bodyText.match(landSizePattern);
      if (bodyMatch && bodyMatch[1]) {
        const size = parseFloat(bodyMatch[1]);
        console.log('Found land size in body text:', size);
        return size;
      }
    }
    
    // 5. Look for the format shown in the screenshot with the icon (256m²)
    // This targets elements that might contain the land size with an icon
    const iconElements = Array.from(document.querySelectorAll('*')).filter(el => {
      if (!el || !el.textContent) return false;
      // Look for elements that might contain just the number and m² symbol
      return el.textContent.trim().match(/^\d+m\u00b2$/) || 
             el.textContent.trim().match(/^\d+\s*m\u00b2$/);
    });
    
    if (iconElements.length > 0) {
      for (const el of iconElements) {
        const text = el.textContent.trim();
        console.log('Found potential land size with icon:', text);
        const match = text.match(/(\d+)\s*m\u00b2/);
        if (match && match[1]) {
          const size = parseFloat(match[1]);
          console.log('Parsed land size from icon element:', size);
          return size;
        }
      }
    }
    
  } catch (error) {
    console.error('Error extracting land size:', error);
  }
  
  console.log('Land size not found');
  return null;
}
function extractSuburb() {
  console.log('Extracting suburb...');
  
  try {
    // Method 1: Try to extract from the title
    const titleElement = document.querySelector('h1');
    if (titleElement && titleElement.textContent) {
      const titleText = titleElement.textContent.trim();
      console.log('Found title:', titleText);
      
      // Look for patterns like "123 Main St, Suburb, VIC 3000"
      const commaMatch = titleText.match(/,\s*([^,]+),\s*[A-Z]{2,3}\s*\d{4}/);
      if (commaMatch && commaMatch[1]) {
        console.log('Extracted suburb from title comma pattern:', commaMatch[1]);
        return commaMatch[1].trim();
      }
      
      // Alternative pattern: "123 Main St, Suburb VIC 3000"
      const spaceMatch = titleText.match(/,\s*([^,]+)\s+[A-Z]{2,3}\s*\d{4}/);
      if (spaceMatch && spaceMatch[1]) {
        console.log('Extracted suburb from title space pattern:', spaceMatch[1]);
        return spaceMatch[1].trim();
      }
      
      // Try to extract just the suburb and state pattern: "Suburb, VIC"
      const suburbStateMatch = titleText.match(/,\s*([^,0-9]+),\s*[A-Z]{2,3}/);
      if (suburbStateMatch && suburbStateMatch[1]) {
        console.log('Extracted suburb from suburb-state pattern:', suburbStateMatch[1]);
        return suburbStateMatch[1].trim();
      }
    }
    
    // Method 2: Try to extract from the URL
    const urlMatch = window.location.pathname.match(/\/property-[^-]+-([^-]+)-/);
    if (urlMatch && urlMatch[1]) {
      const suburbFromUrl = urlMatch[1].replace(/-/g, ' ');
      console.log('Extracted suburb from URL:', suburbFromUrl);
      return suburbFromUrl;
    }
    
    // Method 3: Try to extract from breadcrumbs
    const breadcrumbs = document.querySelectorAll('nav[aria-label="Breadcrumb"] a, .breadcrumbs a, .breadcrumb a');
    if (breadcrumbs && breadcrumbs.length > 0) {
      // Typically the second-to-last breadcrumb is the suburb
      const suburbLink = breadcrumbs[breadcrumbs.length - 2];
      if (suburbLink && suburbLink.textContent) {
        console.log('Extracted suburb from breadcrumbs:', suburbLink.textContent.trim());
        return suburbLink.textContent.trim();
      }
    }
    
    // Method 4: Look for elements containing "Suburb" or "Location"
    const locationLabels = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && 
      (el.textContent.trim() === 'Suburb' || 
       el.textContent.trim() === 'Location' ||
       el.textContent.trim().toLowerCase() === 'suburb' ||
       el.textContent.trim().toLowerCase() === 'location')
    );
    
    if (locationLabels.length > 0) {
      const locationLabel = locationLabels[0];
      const parent = locationLabel.parentElement;
      
      if (parent) {
        // Look for sibling elements that might contain the suburb
        const siblings = Array.from(parent.children);
        for (const sibling of siblings) {
          if (sibling !== locationLabel && sibling.textContent) {
            const siblingText = sibling.textContent.trim();
            if (siblingText && siblingText !== 'Suburb' && siblingText !== 'Location' && 
                siblingText.toLowerCase() !== 'suburb' && siblingText.toLowerCase() !== 'location') {
              console.log('Extracted suburb from location label sibling:', siblingText);
              return siblingText;
            }
          }
        }
        
        // Look in the parent's next sibling
        const parentSibling = parent.nextElementSibling;
        if (parentSibling && parentSibling.textContent) {
          console.log('Extracted suburb from location label parent sibling:', parentSibling.textContent.trim());
          return parentSibling.textContent.trim();
        }
      }
    }
    
    // Method 5: Look for address elements that might contain the suburb
    const addressElements = Array.from(document.querySelectorAll('[class*="address"], [class*="Address"], [class*="location"], [class*="Location"]'));
    for (const el of addressElements) {
      if (el.textContent) {
        const text = el.textContent.trim();
        // Look for VIC postcode pattern
        const match = text.match(/([^,]+),\s*VIC\s*\d{4}/);
        if (match && match[1]) {
          console.log('Extracted suburb from address element:', match[1]);
          return match[1].trim();
        }
      }
    }
    
    console.log('Could not extract suburb using any method');
    return "Unknown";
  } catch (error) {
    console.error('Error extracting suburb from state/postcode:', error);
  }
  
  console.log('Suburb not found');
  return "Unknown";
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
  overlay.style.marginTop = '10px';
  overlay.style.marginBottom = '10px';
  overlay.style.fontSize = '14px';
  overlay.style.lineHeight = '1.5';
  overlay.style.color = '#333';
  overlay.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  overlay.style.maxWidth = '100%';
  overlay.style.boxSizing = 'border-box';
  
  // Create content based on available data
  if (errorMessage) {
    // Display error message
    overlay.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px; color: #e74c3c;">
        ${errorMessage}
      </div>
      <div style="font-size: 12px; color: #7f8c8d;">
        Try refreshing the page or check the browser console for more details.
      </div>
    `;
  } else {
    // Format the price per square meter with commas and round to nearest dollar
    let pricePerSqmFormatted = 'N/A';
    if (pricePerSqm && !isNaN(pricePerSqm) && isFinite(pricePerSqm)) {
      pricePerSqmFormatted = '$' + Math.round(pricePerSqm).toLocaleString();
    }
    
    // Format the median price with commas
    let medianPriceFormatted = 'N/A';
    if (medianPrice && !isNaN(medianPrice) && isFinite(medianPrice)) {
      medianPriceFormatted = '$' + Math.round(medianPrice).toLocaleString();
    }
    
    // Calculate the percentage difference if both values are available
    let percentageDiff = '';
    let percentageClass = '';
    
    if (pricePerSqm && medianPrice && !isNaN(pricePerSqm) && !isNaN(medianPrice) && 
        isFinite(pricePerSqm) && isFinite(medianPrice) && medianPrice > 0) {
      const diff = ((pricePerSqm - medianPrice) / medianPrice) * 100;
      const diffRounded = Math.round(diff);
      
      if (diffRounded > 0) {
        percentageDiff = `+${diffRounded}%`;
        percentageClass = 'above-median';
      } else if (diffRounded < 0) {
        percentageDiff = `${diffRounded}%`;
        percentageClass = 'below-median';
      } else {
        percentageDiff = '0%';
        percentageClass = 'equal-median';
      }
    }
    
    // Create the HTML content
    overlay.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
        Property Price Analysis
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Price/SQM:</span>
        <span style="font-weight: bold;">${pricePerSqmFormatted}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>${suburb || 'Area'} Median:</span>
        <span style="font-weight: bold;">${medianPriceFormatted}</span>
      </div>
    `;
    
    // Add percentage difference if available
    if (percentageDiff) {
      const diffColor = percentageClass === 'above-median' ? '#e74c3c' : 
                        percentageClass === 'below-median' ? '#27ae60' : 
                        '#7f8c8d';
      
      const diffElement = document.createElement('div');
      diffElement.style.display = 'flex';
      diffElement.style.justifyContent = 'space-between';
      diffElement.style.marginTop = '5px';
      diffElement.style.paddingTop = '5px';
      diffElement.style.borderTop = '1px solid #eee';
      
      diffElement.innerHTML = `
        <span>Compared to median:</span>
        <span style="font-weight: bold; color: ${diffColor};">${percentageDiff}</span>
      `;
      
      overlay.appendChild(diffElement);
    }
  }
  
  // HTML content is already set above
  
  // Function to insert the overlay into the page
  const insertOverlay = () => {
    console.log('Attempting to insert overlay...');
    
    try {
      // First try: Look for price guide links
      const priceGuideLinks = document.querySelectorAll('a[href*="price-guide"]');
      console.log('Price guide links found:', priceGuideLinks.length);
      
      if (priceGuideLinks.length > 0) {
        console.log('Found price guide link, positioning overlay below it');
        const priceGuideLink = priceGuideLinks[0];
        
        // Find the parent container
        let parentContainer = priceGuideLink.parentNode;
        
        // Go up a few levels to find the main price container
        for (let i = 0; i < 3; i++) {
          if (parentContainer.parentNode) {
            parentContainer = parentContainer.parentNode;
          }
        }
        
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
      
      // Second try: Look for the price element directly
      const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
        if (!el || !el.textContent) return false;
        const text = el.textContent.trim();
        // Match price formats like "$990,000 - $1,075,000" or "$1,200,000"
        return /^\$[0-9,]+(\s*-\s*\$[0-9,]+)?$/.test(text);
      });
      
      if (priceElements.length > 0) {
        console.log('Found price element, positioning overlay below it:', priceElements[0].textContent);
        const priceElement = priceElements[0];
        
        // Find the parent container
        let parentContainer = priceElement.parentNode;
        // Go up a few levels to find a good container
        for (let i = 0; i < 3; i++) {
          if (parentContainer && parentContainer.parentNode && parentContainer.parentNode.tagName !== 'BODY') {
            parentContainer = parentContainer.parentNode;
          }
        }
        
        // Create a wrapper for proper positioning
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '15px';
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
      console.log('No suitable insertion point found, inserting at top of page');
      const mainContent = document.querySelector('main') || document.body;
      if (mainContent) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '20px';
        wrapper.appendChild(overlay);
        mainContent.insertBefore(wrapper, mainContent.firstChild);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error inserting overlay:', error);
      // Last resort fallback - insert at body start
      try {
        document.body.insertBefore(overlay, document.body.firstChild);
        return true;
      } catch (e) {
        console.error('Failed to insert overlay even with fallback:', e);
        return false;
      }
    }
  };
  
  // Try to insert the overlay, and if it fails, retry after a short delay
  if (!insertOverlay()) {
    console.log('Initial overlay insertion failed, retrying in 1 second...');
    setTimeout(() => {
      if (!insertOverlay()) {
        console.log('Second overlay insertion failed, retrying in 2 seconds...');
        setTimeout(insertOverlay, 2000);
      }
    }, 1000);
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
    
    console.log(`Extracted data - Price: ${price}, Land Size: ${landSize}, Suburb: ${suburb}`);
    console.log(`Data types - Price: ${typeof price}, Land Size: ${typeof landSize}, Suburb: ${typeof suburb}`);
    
    // Check if we have all the required data
    if (!price) {
      console.log('Price not found, showing error overlay');
      createOverlay(null, null, suburb, 'Could not find property price. Please check if the price is displayed on this page.');
      return;
    }
    
    if (!landSize) {
      console.log('Land size not found, showing error overlay');
      createOverlay(price, null, suburb, 'Could not find land size. This might not be a house listing or the land size is not specified.');
      return;
    }
    
    if (!suburb || suburb === 'Unknown') {
      console.log('Suburb not found, showing error overlay');
      createOverlay(price / landSize, null, 'Unknown', 'Could not determine the suburb. The price per square meter calculation is shown, but no median comparison is available.');
      return;
    }
    
    // Normalize suburb name for dictionary lookup
    let normalizedSuburb = suburb.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    console.log(`Normalized suburb: ${normalizedSuburb}`);
    
    // Look up median price
    let medianPrice = MEDIAN_PRICES_BY_SUBURB[normalizedSuburb];
    console.log(`Initial median price lookup: ${medianPrice}`);
    
    // If not found, try case-insensitive lookup
    if (!medianPrice) {
      console.log('Median price not found with exact match, trying case-insensitive lookup');
      const suburbLower = normalizedSuburb.toLowerCase();
      
      // First try exact lowercase match
      const matchingSuburb = Object.keys(MEDIAN_PRICES_BY_SUBURB).find(key => 
        key.toLowerCase() === suburbLower
      );
      
      if (matchingSuburb) {
        medianPrice = MEDIAN_PRICES_BY_SUBURB[matchingSuburb];
        normalizedSuburb = matchingSuburb; // Use the correctly cased suburb name
        console.log(`Found median price with case-insensitive lookup: ${medianPrice} for ${matchingSuburb}`);
      } else {
        // Try partial match if exact match fails
        console.log('Trying partial suburb name match');
        const partialMatch = Object.keys(MEDIAN_PRICES_BY_SUBURB).find(key => 
          suburbLower.includes(key.toLowerCase()) || key.toLowerCase().includes(suburbLower)
        );
        
        if (partialMatch) {
          medianPrice = MEDIAN_PRICES_BY_SUBURB[partialMatch];
          normalizedSuburb = partialMatch;
          console.log(`Found median price with partial match: ${medianPrice} for ${partialMatch}`);
        } else {
          console.log(`No median price found for ${normalizedSuburb}, even with partial matching`);
        }
      }
    }
    
    // Calculate price per square meter
    const pricePerSqm = price / landSize;
    console.log(`Calculated price per sqm: ${pricePerSqm}`);
    
    // Create and display the overlay
    if (medianPrice) {
      console.log(`Creating overlay with median price: ${medianPrice}`);
      createOverlay(pricePerSqm, medianPrice, normalizedSuburb);
    } else {
      console.log('Creating overlay without median price (not found in database)');
      createOverlay(pricePerSqm, null, normalizedSuburb, 'Median price data not available for this suburb.');
    }
  } catch (error) {
    console.error('Error in analyzePricePerSquareMetre:', error);
    console.error('Error stack:', error.stack);
    createOverlay(null, null, 'Error', `An error occurred while analyzing the listing: ${error.message}`);
  }
  
  console.log('Price per square metre analysis complete');
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

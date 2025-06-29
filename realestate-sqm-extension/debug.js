// Debug script to help identify DOM structure on realestate.com.au
console.log('Debug script loaded on: ' + window.location.href);

// Function to inspect and log key elements
function inspectElements() {
  console.log('Inspecting realestate.com.au page elements...');
  
  // Price element
  const priceElements = document.querySelectorAll('*');
  const priceMatches = Array.from(priceElements).filter(el => 
    el.textContent && el.textContent.trim().match(/\$[0-9,]+(-|–|\s*-\s*|\s*–\s*)\$?[0-9,]+/)
  );
  
  console.log('Potential price elements found:', priceMatches.length);
  priceMatches.forEach((el, i) => {
    console.log(`Price element ${i}:`, {
      text: el.textContent.trim(),
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      dataTestId: el.getAttribute('data-testid'),
      path: getElementPath(el)
    });
  });
  
  // Land size elements
  const allElements = document.querySelectorAll('*');
  const landSizeMatches = Array.from(allElements).filter(el => 
    el.textContent && el.textContent.trim().match(/[0-9,]+\s*m²/)
  );
  
  console.log('Potential land size elements found:', landSizeMatches.length);
  landSizeMatches.forEach((el, i) => {
    console.log(`Land size element ${i}:`, {
      text: el.textContent.trim(),
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      dataTestId: el.getAttribute('data-testid'),
      path: getElementPath(el)
    });
  });
  
  // Address/suburb elements
  const addressElements = document.querySelectorAll('h1');
  console.log('Potential address elements found:', addressElements.length);
  Array.from(addressElements).forEach((el, i) => {
    console.log(`Address element ${i}:`, {
      text: el.textContent.trim(),
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      dataTestId: el.getAttribute('data-testid'),
      path: getElementPath(el)
    });
  });
}

// Helper function to get element path for debugging
function getElementPath(element) {
  if (!element) return '';
  
  let path = [];
  let currentElement = element;
  
  try {
    while (currentElement && currentElement !== document.body) {
      // Make sure tagName exists and is a string before calling toLowerCase
      let selector = 'unknown';
      
      try {
        if (currentElement.tagName) {
          selector = currentElement.tagName.toLowerCase();
        }
      } catch (e) {
        console.error('Error getting tagName:', e);
      }
      
      try {
        if (currentElement.id) {
          selector += '#' + currentElement.id;
        } else if (currentElement.className) {
          // Check if className is a string before using string methods
          if (typeof currentElement.className === 'string') {
            selector += '.' + currentElement.className.trim().replace(/\s+/g, '.');
          } else if (currentElement.className && currentElement.className.baseVal) {
            // Handle SVG elements which have className.baseVal
            selector += '.' + currentElement.className.baseVal.trim().replace(/\s+/g, '.');
          }
        }
      } catch (e) {
        console.error('Error processing element attributes:', e);
      }
      
      // Add position if it has siblings of same type
      try {
        let siblings = [];
        if (currentElement.parentNode && currentElement.tagName) {
          const children = currentElement.parentNode.children;
          if (children) {
            siblings = Array.from(children).filter(child => 
              child && child.tagName && currentElement.tagName && 
              child.tagName === currentElement.tagName
            );
          }
        }
          
        if (siblings.length > 1) {
          const index = siblings.indexOf(currentElement);
          if (index !== -1) {
            selector += `:nth-child(${index + 1})`;
          }
        }
      } catch (e) {
        console.error('Error processing siblings:', e);
      }
      
      path.unshift(selector);
      
      try {
        currentElement = currentElement.parentNode;
      } catch (e) {
        console.error('Error accessing parentNode:', e);
        break;
      }
      
      // Limit path length for readability
      if (path.length >= 5) break;
    }
  } catch (e) {
    console.error('Unexpected error in getElementPath:', e);
    return 'Error getting path';
  }
  
  return path.join(' > ');
}

// Run inspection after a delay to ensure page is loaded
setTimeout(inspectElements, 2000);

console.log('Debug script initialized, will inspect elements after 2 seconds');

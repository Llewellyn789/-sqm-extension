#!/bin/bash

# Remove temporary privacy policy files
rm -f privacy-modal.html privacy-policy.html privacy-standalone.html privacy.html

# Remove temporary deployment directories
rm -rf deploy-temp public

# Remove GitHub CLI installation files
rm -rf gh-cli gh.zip gh

# Remove deployment script
rm -f deploy-privacy.js

echo "Cleanup complete! Temporary files have been removed."

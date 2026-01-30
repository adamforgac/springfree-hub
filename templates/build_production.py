#!/usr/bin/env python3
"""
Build script for Baselinker email templates.
Generates minified HTML ready for Baselinker template editor.
"""

import json
import re
import os

# Get the directory of this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Data
with open(os.path.join(SCRIPT_DIR, 'translations.json'), 'r') as f:
    translations = json.load(f)

with open(os.path.join(SCRIPT_DIR, 'order-confirmation.html'), 'r') as f:
    template = f.read()

# Configuration
LANG = 'cs'

# 1. Replace language code
template = template.replace("{{lang}}", LANG)

# 2. Replace Translations
for key, value_dict in translations['translations'].items():
    if isinstance(value_dict, dict) and LANG in value_dict:
        template = template.replace(f"{{{{{key}}}}}", value_dict[LANG])

# Replace shop_url
if "links" in translations["translations"] and "shop_url" in translations["translations"]["links"]:
   template = template.replace("{{shop_url}}", translations["translations"]["links"]["shop_url"][LANG])

# 3. Minification
# Remove HTML comments (but keep MSO conditionals)
template = re.sub(r'<!--(?!\[if)(?!<!\[endif\])(?!>).*?-->', '', template, flags=re.DOTALL)
# Remove extra whitespace
template = re.sub(r'\s+', ' ', template).strip()

# 4. Save
output_filename = os.path.join(SCRIPT_DIR, 'order-confirmation-baselinker.html')
with open(output_filename, 'w') as f:
    f.write(template)

print(f"✅ Production template generated: order-confirmation-baselinker.html")
print(f"   Size: {len(template):,} characters")
print(f"   Limit: 25,000 characters")
print(f"   Remaining: {25000 - len(template):,} characters")

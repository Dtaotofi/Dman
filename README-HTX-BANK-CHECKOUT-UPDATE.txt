HTX Peptides NZ Dman update

Changed files:
- script.js
- styles.css
- checkout.html (new)
- HTML pages: cart drawer checkout buttons updated from WhatsApp to bank-transfer checkout.

What changed:
- Fixed Add To Cart click handling and removed a JavaScript brace error that could stop product/cart actions.
- Cart now persists in localStorage, updates cart count, supports quantity +/- and remove.
- Products are limited to the requested 8 products and ordered as requested.
- Added bank-transfer checkout page with customer details, shipping options, free shipping over $200, order number generation, and bank details.
- Order data is saved as a JavaScript order object in localStorage for future email/admin integration.
- Removed WhatsApp checkout flow and replaced cart checkout button with Proceed to Checkout.
- Added mobile CSS so product cards display 2 per row on tablet and 1 per row on mobile, with no horizontal scrolling.
- Increased logo size while preserving the existing Dman visual style.

Bank details used:
Account Name: HTX Peptides NZ
Account Number: 06-0489-0153992-02
Reference: generated order number, e.g. HTX-10001

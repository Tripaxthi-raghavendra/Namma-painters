# Namma Painters — Remote Quote System

## What this does
1. Customer opens `/quote.html` (or the home page can link there).
2. Customer enters name, phone, location, service, approximate area and details.
3. Customer uploads up to 12 photos. On mobile, the photo picker can use the camera.
4. The backend stores the enquiry and uploaded photos.
5. You open `/admin` to see incoming enquiries, inspect every photo, enter a quote and update the status.

## Run locally
Requires Node.js 18+.

    npm install
    npm start

Customer: http://localhost:3000/quote.html
Admin: http://localhost:3000/admin

## Important before public deployment
The admin dashboard currently has NO login/authentication. Add authentication before putting `/admin` on the public internet.
For production, move uploaded images and enquiry data to managed storage/database (e.g. object storage + PostgreSQL) and add HTTPS, backups, file scanning, rate limits and admin authentication.

## Quote workflow
New → Under Review → Quoted / Need More Information / Site Visit Required → Completed

This version is designed to let you make an initial quote without a site visit, while retaining a "Site Visit Required" option when photos are not sufficient.

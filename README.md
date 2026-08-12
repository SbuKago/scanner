# Dispatch Barcode Tracker

A simple local-first dispatch pallet barcode scanning and loading tracker built with:

- HTML
- CSS
- Vanilla JavaScript

## Files

```text
dispatch-barcode-tracker/
├── index.html
├── style.css
├── app.js
└── README.md
```

## What it does

1. Imports an Excel product/barcode master.
2. Scans barcodes with a phone/tablet camera.
3. Accepts manual barcode entry.
4. Supports keyboard-style USB/Bluetooth barcode scanners.
5. Validates barcodes against the imported product master.
6. Detects duplicate pallet scans.
7. Records pallet loading information.
8. Stores records in browser localStorage.
9. Tracks barcode problems.
10. Provides daily reports.
11. Exports loading history and barcode problems to CSV.
12. Includes demo data for testing.

## Excel format

Your real Excel file should have a header row.

The most important column is:

```text
Barcode
```

Other useful columns can be:

```text
Barcode
Product Code
Product Description
Customer
Pack Size
Cases Per Pallet
Pallet Type
```

The application tries to recognize common variations such as:

- Bar Code
- Pallet Barcode
- EAN
- UPC
- GTIN
- SKU
- Item Code
- Product
- Description
- Product Name
- Cases/Pallet
- Pallet Type

### IMPORTANT: Barcodes must be treated as text

Do not let Excel remove leading zeroes.

For example:

```text
0001234567895
```

must remain:

```text
0001234567895
```

and not:

```text
1234567895
```

If your Excel program has converted barcode values into numbers, the original leading zeroes may already be lost. Keep the barcode column formatted as Text when possible.

## How to run

The easiest option:

1. Put the four files in one folder.
2. Open `index.html` in Chrome or Edge.
3. Click **Product Master**.
4. Click **Load Demo Data** to test first.
5. Start a loading session.
6. Go to **Scan Pallet**.
7. Try the demo valid barcode:

```text
6001234567890
```

8. Try the demo invalid barcode:

```text
9999999999999
```

## Camera scanning

Camera access is normally restricted by browsers when a page is opened directly from a local file.

If the camera does not work when opening `index.html`, run the folder through a small local web server.

If you use VS Code, one simple option is the Live Server extension.

Then open the local address, usually something like:

```text
http://127.0.0.1:5500
```

Allow camera permission when Chrome asks.

On a phone, camera access generally requires HTTPS or localhost. A future deployed version should use HTTPS.

## Handheld scanner

Many USB/Bluetooth barcode scanners behave like keyboards.

The workflow is:

1. Click the barcode input.
2. Scan the pallet.
3. The scanner types the barcode.
4. The scanner sends Enter.
5. JavaScript validates the barcode automatically.
6. Confirm the loading.
7. The application becomes ready for the next pallet.

## Data storage

This version uses browser `localStorage`.

That means data is stored on the current browser/device.

It does NOT provide:

- shared data between computers
- shared data between phones
- real-time synchronization
- user accounts
- cloud backup
- central database

Export a backup regularly if the records are important.

## Camera library

The application uses `html5-qrcode` from a CDN for camera scanning.

Excel import uses SheetJS from a CDN.

Therefore, internet access is required for those external libraries unless you later download and host the libraries locally.

## Future version

When the team needs multiple dispatch employees to use the same system at the same time, the next version should add:

- Login
- Users and permissions
- Central database
- Shared product master
- Real-time loading dashboard
- Supervisor dashboard
- Audit trail
- Customer-specific barcode rules
- Barcode verification history
- Cloud backups
- Offline synchronization
- ERP/Syspro integration

Those features should be added after the local MVP workflow has been tested successfully.

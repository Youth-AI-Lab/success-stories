/**
 * generate-pdf.js
 * Renders the success story HTML to a clean PDF using headless Chromium.
 *
 * Setup (one-time):
 *   cd SuccessStories
 *   npm init -y
 *   npm install puppeteer
 *
 * Usage:
 *   node generate-pdf.js                                  # uses carnet_mockup.html
 *   node generate-pdf.js path/to/story.html               # custom input
 *   node generate-pdf.js path/to/story.html output.pdf    # custom input + output
 *
 * Notes:
 *   - The book is fixed-size (1500 x 950 in CSS pixels). Each "spread" becomes one landscape page.
 *   - The page-turning JS is short-circuited at print time via the @media print stylesheet
 *     already embedded in the HTML, which flattens all sheets into a vertical stack.
 *   - For an even cleaner PDF, see the spread-by-spread mode below (set MODE='spreads').
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const MODE = process.env.PDF_MODE || 'spreads'; // 'spreads' (recommended) or 'print-stylesheet'

async function main() {
  const inputArg = process.argv[2] || 'carnet_mockup.html';
  const outputArg = process.argv[3] || inputArg.replace(/\.html$/, '.pdf');

  const inputPath = path.resolve(inputArg);
  const outputPath = path.resolve(outputArg);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }

  const fileUrl = 'file://' + inputPath;
  console.log(`Loading ${fileUrl}`);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  if (MODE === 'spreads') {
    await renderSpreadByPDF(page, fileUrl, outputPath);
  } else {
    await renderPrintStylesheet(page, fileUrl, outputPath);
  }

  await browser.close();
  console.log(`Done. PDF written to ${outputPath}`);
}

/**
 * Mode A: render the book one spread at a time, capturing each as one PDF page.
 * Produces the cleanest output: each spread is a true two-page layout, in landscape.
 */
async function renderSpreadByPDF(page, fileUrl, outputPath) {
  // Set viewport to match the book's intrinsic size (1500x950).
  await page.setViewport({ width: 1500, height: 950, deviceScaleFactor: 2 });

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Force the book scale to 1 (no shrink-to-fit) so it fills the page.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--book-scale', '1');
    const stage = document.querySelector('.stage');
    const book = document.querySelector('.book');
    if (book) {
      book.style.position = 'absolute';
      book.style.top = '0';
      book.style.left = '0';
      book.style.transform = 'none';
    }
    // hide interactive chrome
    document.querySelectorAll('.nav-btn, .indicator, .pdf-download').forEach(el => el.style.display = 'none');
  });

  // Number of spreads = number of sheets + 1 (one for the initial state).
  const totalSpreads = await page.evaluate(() => document.querySelectorAll('.sheet').length + 1);

  const pdfPath = outputPath;
  const pages = [];

  for (let i = 0; i < totalSpreads; i++) {
    // Turn pages up to index i.
    await page.evaluate((n) => {
      const sheets = document.querySelectorAll('.sheet');
      sheets.forEach((sheet, idx) => {
        sheet.style.transition = 'none';
        if (idx < n) {
          sheet.classList.add('turned');
          sheet.style.zIndex = 10 + idx;
        } else {
          sheet.classList.remove('turned');
          sheet.style.zIndex = 100 + (sheets.length - idx);
        }
      });
    }, i);

    // Let the layout settle.
    await new Promise(r => setTimeout(r, 200));

    const spreadPdf = await page.pdf({
      width: '1500px',
      height: '950px',
      printBackground: true,
      pageRanges: '1',
      preferCSSPageSize: false,
    });

    pages.push(spreadPdf);
  }

  // Merge the per-spread PDFs into one file. Puppeteer does not natively merge,
  // so we use pdf-lib if available, otherwise we write the first one and warn.
  try {
    const { PDFDocument } = require('pdf-lib');
    const merged = await PDFDocument.create();
    for (const buf of pages) {
      const sub = await PDFDocument.load(buf);
      const copied = await merged.copyPages(sub, sub.getPageIndices());
      copied.forEach(p => merged.addPage(p));
    }
    fs.writeFileSync(pdfPath, await merged.save());
  } catch (e) {
    console.warn('\n(pdf-lib not installed — saving only the first spread.)');
    console.warn('To produce the full PDF, run: npm install pdf-lib\n');
    fs.writeFileSync(pdfPath, pages[0]);
  }
}

/**
 * Mode B: rely on the @media print stylesheet in the HTML.
 * Simpler but less control over per-spread layout.
 */
async function renderPrintStylesheet(page, fileUrl, outputPath) {
  await page.setViewport({ width: 1500, height: 950 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

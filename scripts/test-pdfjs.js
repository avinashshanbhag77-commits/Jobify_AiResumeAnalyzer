const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const fs = require('fs');

async function testParse() {
    try {
        const buffer = fs.readFileSync('minimal.pdf');
        const data = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument({
            data: data,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        console.log(`PDF loaded. Pages: ${pdf.numPages}`);

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => item.str)
                .join(' ');
            console.log(`Page ${i} content:`, pageText);
        }
        console.log('Test successful!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testParse();

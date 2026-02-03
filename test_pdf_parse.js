const fs = require('fs');
const pdfParse = require('pdf-parse');

const buffer = fs.readFileSync('minimal.pdf');

pdfParse(buffer).then(data => {
    console.log('Success!');
    console.log('Text:', data.text);
}).catch(err => {
    console.error('Error:', err);
});

const xlsx = require('xlsx');

const workbook = xlsx.readFile('Royal_International_Public_School_Complete_Data.xlsx');

workbook.SheetNames.forEach(sheetName => {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet).slice(0, 3);
  console.log(JSON.stringify(data, null, 2));
});

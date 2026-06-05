const XLSX = require('xlsx');
const csv  = require('csv-parser');
const { Readable } = require('stream');

function parseExcel(buffer) {
  const wb      = XLSX.read(buffer, { type: 'buffer' });
  const sheet   = wb.Sheets[wb.SheetNames[0]];
  const rows    = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return { rows, columns };
}

function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer.toString())
      .pipe(csv())
      .on('data',  row  => rows.push(row))
      .on('end',   ()   => resolve({ rows, columns: rows.length > 0 ? Object.keys(rows[0]) : [] }))
      .on('error', err  => reject(err));
  });
}

async function parseFile(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xlsx', 'xls'].includes(ext)) return parseExcel(buffer);
  if (ext === 'csv')                  return parseCsv(buffer);
  throw new Error(`Format non supporté : .${ext}. Formats acceptés : xlsx, xls, csv`);
}

module.exports = { parseFile };

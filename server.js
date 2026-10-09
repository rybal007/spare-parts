import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsFile = path.join(__dirname, 'data', 'spare-parts-settings.json');
const fields = [
  'id',
  'machine',
  'machineCode',
  'partNumber',
  'partName',
  'category',
  'quantity',
  'minStock',
  'supplier',
  'image',
  'createdAt',
  'updatedAt',
];

const ensureSettingsFile = () => {
  fs.mkdirSync(path.dirname(settingsFile), { recursive: true });

  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(
      settingsFile,
      JSON.stringify({ dataPath: '', password: '' }, null, 2),
      'utf8',
    );
  }
};

const readSettings = () => {
  ensureSettingsFile();

  try {
    const content = fs.readFileSync(settingsFile, 'utf8');
    const parsed = JSON.parse(content);

    return {
      dataPath: typeof parsed?.dataPath === 'string' ? parsed.dataPath : '',
      password: typeof parsed?.password === 'string' ? parsed.password : '',
    };
  } catch (error) {
    console.warn('Unable to read spare-parts settings; using defaults.', error);
    return { dataPath: '', password: '' };
  }
};

const saveSettings = (settings) => {
  ensureSettingsFile();
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf8');
};

const resolveDataFile = () => {
  const configuredPath = process.env.SPARE_PARTS_DATA_PATH || readSettings().dataPath;

  if (!configuredPath) {
    return path.join(__dirname, 'data', 'spare-parts.csv');
  }

  const resolvedPath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(__dirname, configuredPath);

  const hasFileExtension = path.extname(resolvedPath) !== '';

  if (hasFileExtension) {
    return resolvedPath;
  }

  const candidateFiles = [
    path.join(resolvedPath, 'spare-parts.csv'),
    path.join(resolvedPath, 'spare-parts.xlsx'),
    path.join(resolvedPath, 'spare-parts.xls'),
  ];

  for (const candidateFile of candidateFiles) {
    if (fs.existsSync(candidateFile)) {
      return candidateFile;
    }
  }

  return path.join(resolvedPath, 'spare-parts.csv');
};

const ensureDirectories = (targetPath) => {
  const directory = path.dirname(targetPath);
  fs.mkdirSync(directory, { recursive: true });
};

const ensureFile = (targetPath = resolveDataFile()) => {
  ensureDirectories(targetPath);

  if (fs.existsSync(targetPath)) {
    return targetPath;
  }

  const extension = path.extname(targetPath).toLowerCase();

  if (extension === '.xlsx' || extension === '.xls') {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      Object.fromEntries(fields.map((field) => [field, ''])),
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, targetPath);
    return targetPath;
  }

  fs.writeFileSync(targetPath, `${fields.join(',')}\n`, 'utf8');
  return targetPath;
};

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? '');

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    if (char === '\r') {
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const readCsvRows = (csvPath) => {
  const csv = fs.readFileSync(csvPath, 'utf8').trim();

  if (!csv) {
    return [];
  }

  const lines = csv.split(/\r?\n/).filter(Boolean);
  const [headerLine, ...rows] = lines;
  const headers = parseCsvLine(headerLine);

  return rows.map((row) => {
    const values = parseCsvLine(row);
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] ?? '';
    });

    return record;
  });
};

const readExcelRows = (excelPath) => {
  const workbook = XLSX.readFile(excelPath);
  const [sheetName] = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  return rows.map((row) => {
    const record = {};

    fields.forEach((field) => {
      const value = row[field] ?? row[field.toLowerCase()] ?? row[field.toUpperCase()] ?? '';
      record[field] = value;
    });

    return record;
  });
};

const normalizeRecord = (record = {}) => ({
  id: record.id || '',
  machine: record.machine || '',
  machineCode: record.machineCode || '',
  partNumber: record.partNumber || '',
  partName: record.partName || '',
  category: record.category || '',
  quantity: Number(record.quantity || 0),
  minStock: Number(record.minStock || 0),
  supplier: record.supplier || '',
  image: record.image || '',
  createdAt: record.createdAt || new Date().toISOString(),
  updatedAt: record.updatedAt || new Date().toISOString(),
});

const readParts = () => {
  const targetPath = resolveDataFile();
  ensureFile(targetPath);

  const extension = path.extname(targetPath).toLowerCase();
  const rows = extension === '.xlsx' || extension === '.xls'
    ? readExcelRows(targetPath)
    : readCsvRows(targetPath);

  return rows.map((record) => normalizeRecord(record));
};

const writeParts = (parts) => {
  const targetPath = resolveDataFile();
  ensureFile(targetPath);

  const extension = path.extname(targetPath).toLowerCase();

  if (extension === '.xlsx' || extension === '.xls') {
    const workbook = XLSX.utils.book_new();
    const sheetData = parts.map((part) =>
      fields.reduce((row, field) => {
        row[field] = part[field] ?? '';
        return row;
      }, {})
    );
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, targetPath);
    return;
  }

  const csvContent = [
    fields.join(','),
    ...parts.map((part) =>
      fields
        .map((field) => escapeCsvValue(part[field] ?? ''))
        .join(',')
    ),
  ].join('\n');

  fs.writeFileSync(targetPath, `${csvContent}\n`, 'utf8');
};

const normalizePart = (part) => ({
  ...part,
  quantity: Number(part.quantity ?? 0),
  minStock: Number(part.minStock ?? 0),
  id: part.id || crypto.randomUUID(),
  createdAt: part.createdAt || new Date().toISOString(),
  updatedAt: part.updatedAt || new Date().toISOString(),
});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/config', (_req, res) => {
  const settings = readSettings();
  const resolvedPath = resolveDataFile();

  res.json({
    dataPath: settings.dataPath || resolvedPath,
    password: settings.password || '',
  });
});

app.put('/api/config', (req, res) => {
  const incomingPath = typeof req.body?.dataPath === 'string' ? req.body.dataPath.trim() : '';
  const incomingPassword = typeof req.body?.password === 'string' ? req.body.password : '';
  const nextSettings = { dataPath: incomingPath, password: incomingPassword };
  saveSettings(nextSettings);
  const resolvedPath = resolveDataFile();
  ensureFile(resolvedPath);
  res.json({ dataPath: resolvedPath, password: incomingPassword });
});

app.get('/api/parts', (_req, res) => {
  res.json(readParts());
});

app.post('/api/parts', (req, res) => {
  const nextPart = normalizePart(req.body);
  const parts = readParts();
  const updated = [...parts, nextPart];

  writeParts(updated);
  res.status(201).json(nextPart);
});

app.put('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  const updatedPart = normalizePart({
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  });

  const parts = readParts();
  const updated = parts.map((part) =>
    part.id === id ? updatedPart : part
  );

  writeParts(updated);
  res.json(updatedPart);
});

app.delete('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  const parts = readParts();
  const updated = parts.filter((part) => part.id !== id);

  writeParts(updated);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Spare-parts database server running on http://localhost:${port}`);
});

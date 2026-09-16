import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsFile = path.join(__dirname, 'data', 'spare-parts-settings.json');

const ensureSettingsFile = () => {
  fs.mkdirSync(path.dirname(settingsFile), { recursive: true });

  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({ dataPath: '' }, null, 2), 'utf8');
  }
};

const readSettings = () => {
  ensureSettingsFile();

  try {
    const content = fs.readFileSync(settingsFile, 'utf8');
    const parsed = JSON.parse(content);

    return typeof parsed?.dataPath === 'string' ? parsed : { dataPath: '' };
  } catch (error) {
    console.warn('Unable to read spare-parts settings; using defaults.', error);
    return { dataPath: '' };
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

  return hasFileExtension ? resolvedPath : path.join(resolvedPath, 'spare-parts.csv');
};

let dataFile = resolveDataFile();
const dataDir = path.dirname(dataFile);
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

const ensureFile = () => {
  dataFile = resolveDataFile();
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, `${fields.join(',')}\n`, 'utf8');
  }
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

const readParts = () => {
  ensureFile();

  const csv = fs.readFileSync(dataFile, 'utf8').trim();

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

    return {
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
    };
  });
};

const writeParts = (parts) => {
  ensureFile();

  const csvContent = [
    fields.join(','),
    ...parts.map((part) =>
      fields
        .map((field) => escapeCsvValue(part[field] ?? ''))
        .join(',')
    ),
  ].join('\n');

  fs.writeFileSync(dataFile, `${csvContent}\n`, 'utf8');
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
  res.json({ dataPath: readSettings().dataPath || path.join(__dirname, 'data', 'spare-parts.csv') });
});

app.put('/api/config', (req, res) => {
  const incomingPath = typeof req.body?.dataPath === 'string' ? req.body.dataPath.trim() : '';
  const nextSettings = { dataPath: incomingPath };
  saveSettings(nextSettings);
  dataFile = resolveDataFile();
  ensureFile();
  res.json({ dataPath: dataFile });
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
  console.log(`Spare-parts CSV server running on http://localhost:${port}`);
});

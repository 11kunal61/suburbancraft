import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const form = new formidable.IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const file = files.resume;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    try {
      const buffer = fs.readFileSync(file.filepath);
      let text = '';
      if (file.mimetype === 'application/pdf' || file.originalFilename?.toLowerCase().endsWith('.pdf')) {
        const data = await pdfParse(buffer);
        text = data.text;
      } else {
        const { value } = await mammoth.extractRawText({ buffer });
        text = value;
      }
      text = text.replace(/\s+/g, ' ').trim().slice(0, 4000);
      res.json({ text });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

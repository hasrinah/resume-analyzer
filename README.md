# Resume Analyzer

A Node.js / Express API that accepts a PDF résumé upload and returns its extracted text.

> **Status:** early stage. This repository contains the backend API only.

## Features

- `POST /upload` accepts a single PDF résumé (multipart field `resume`)
- Extracts the text with [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- Accepts PDF files only, up to 10 MB
- Deletes each upload as soon as it has been parsed; no résumé is stored

## Tech Stack

Node.js · Express 5 · Multer · pdf-parse · nodemon (development)

## Getting Started

**Requirements:** Node.js 18 or later

```bash
cd server
npm install
npm run dev      # auto-reload with nodemon
# or
npm start
```

The server listens on `http://localhost:5000`. Set the `PORT` environment variable to change it.

## API

| Method | Path | Request | Success response |
|---|---|---|---|
| `POST` | `/upload` | `multipart/form-data` with a PDF in the `resume` field | `200` `{ "text": "..." }` |

| Status | Meaning |
|---|---|
| `400` | No file was sent |
| `413` | File is larger than 10 MB |
| `415` | File is not a PDF |
| `500` | The PDF could not be parsed |

Example:

```bash
curl -F "resume=@my-resume.pdf" http://localhost:5000/upload
```

## Project Structure

```
server/
├── index.js        # Express app and /upload endpoint
├── package.json
└── package-lock.json
```

## Roadmap

- [x] PDF upload and text-extraction API
- [ ] Web frontend (not yet included in this repository)

## Privacy

Résumés contain personal data. Uploads are written to the operating system's temporary folder and deleted straight after parsing. `node_modules/` and `uploads/` are listed in `.gitignore`, so real résumés and dependencies don't end up in the repository.

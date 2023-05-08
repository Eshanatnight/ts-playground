// write me a express web server
import express from 'express';
import path from 'path';

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR: string = "./"

app.use(express.static(PUBLIC_DIR));

app.get("/", (req, res) => {
    const fileName = String(req.params);
    let filePath = path.join(PUBLIC_DIR , fileName);
    res.sendFile(filePath);
});

app.get("/vscode.html", (req, res) => {
    const fileName = String(req.params);
    let filePath = path.join(PUBLIC_DIR , fileName);
    res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`File server listening on port ${PORT}...`);
});

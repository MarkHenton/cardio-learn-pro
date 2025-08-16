import * as puppeteer from "puppeteer";
import * as express from "express";
import * as cors from "cors";
import * as fs from "fs/promises";
import * as path from "path";
import * as multer from "multer"; // Importamos o multer

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const materiaisDir = path.join(__dirname, '..', 'materiais');

// --- CONFIGURAÇÃO DO UPLOAD ---
// Dizemos ao multer para guardar os ficheiros na nossa pasta 'materiais'
// e para manter o nome original do ficheiro.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, materiaisDir);
  },
  filename: function (req, file, cb) {
    // Para evitar nomes duplicados, podemos adicionar um timestamp
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
    // Por agora, vamos manter o nome original para ser mais simples.
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- NOVA ROTA DE UPLOAD ---
// Criamos um novo endpoint em '/upload' que espera um único ficheiro
// vindo de um campo de formulário chamado 'materialFile'.
app.post('/upload', upload.single('materialFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum ficheiro foi enviado.');
  }
  
  console.log('Ficheiro recebido e guardado:', req.file.filename);
  // Devolvemos o nome do ficheiro para que o frontend o possa guardar na base de dados.
  res.status(200).json({ fileName: req.file.filename });
});


// --- ROTA DE GERAR PDF (sem alterações) ---
app.post("/generatePdf", async (req, res) => {
  const { fileName } = req.body;
  if (!fileName) {
    return res.status(400).send("O 'fileName' do material não foi fornecido.");
  }
  try {
    const filePath = path.join(materiaisDir, fileName);
    const htmlContent = await fs.readFile(filePath, 'utf8');
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    res.set("Content-Type", "application/pdf");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    if (error.code === 'ENOENT') {
        return res.status(404).send("Ficheiro do material não encontrado.");
    }
    res.status(500).send("Erro ao gerar o PDF");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de API a rodar na porta ${PORT}`);
});
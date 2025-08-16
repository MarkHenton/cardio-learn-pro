import * as puppeteer from "puppeteer";
import * as express from "express";
import * as cors from "cors";
import * as fs from "fs/promises"; // Módulo para lidar com ficheiros
import * as path from "path";       // Módulo para lidar com caminhos de ficheiros

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// A pasta onde os materiais estão guardados, dentro do nosso contêiner.
const materiaisDir = path.join(__dirname, '..', 'materiais');

app.post("/generatePdf", async (req, res) => {
  // Em vez de 'storagePath', agora vamos receber um 'fileName'.
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).send("O 'fileName' do material não foi fornecido.");
  }

  try {
    // 1. Construir o caminho completo para o ficheiro e lê-lo.
    const filePath = path.join(materiaisDir, fileName);
    console.log(`A ler o ficheiro de: ${filePath}`);
    const htmlContent = await fs.readFile(filePath, 'utf8');

    // 2. Gerar o PDF com Puppeteer (o resto do código é igual)
    console.log("A iniciar o Puppeteer...");
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    console.log("PDF gerado com sucesso.");

    res.set("Content-Type", "application/pdf");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    // Adiciona uma verificação para erros de "ficheiro não encontrado"
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
import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";
import * as express from "express";
import * as cors from "cors";

// --- INÍCIO DA ADAPTAÇÃO FINAL ---

// Inicializa o SDK do Firebase Admin.
// Ele irá procurar automaticamente as credenciais que vamos configurar.
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // Adicione o URL do seu bucket do Firebase Storage aqui.
  // Pode encontrá-lo na página do Storage no seu Firebase Console.
  // Geralmente é algo como "seu-projeto-id.appspot.com".
  storageBucket: "cardio-learn-pro.appspot.com" 
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/generatePdf", async (req, res) => {
  // Agora recebemos o 'storagePath' e o 'materialTitle'.
  const { storagePath, materialTitle } = req.body;

  if (!storagePath) {
    return res.status(400).send("O 'storagePath' do material não foi fornecido.");
  }

  try {
    // 1. Descarregar o ficheiro HTML do Firebase Storage
    console.log(`A descarregar o ficheiro de: ${storagePath}`);
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    const [fileContents] = await file.download();
    const htmlContent = fileContents.toString('utf8');

    // 2. Usar o Puppeteer para gerar o PDF (como antes)
    console.log("A iniciar o Puppeteer...");
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    
    console.log("A definir o conteúdo da página...");
    await page.setContent(htmlContent);

    console.log("A gerar o PDF...");
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    console.log("PDF gerado com sucesso.");

    res.set("Content-Type", "application/pdf");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar o PDF");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de API a rodar na porta ${PORT}`);
});
// --- FIM DA ADAPTAÇÃO FINAL ---
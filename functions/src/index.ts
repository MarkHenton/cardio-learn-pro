// functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";

// Inicializa o Admin SDK para acessar Storage e Firestore no backend
admin.initializeApp();

// Define a função HTTP que será acionada por uma URL
export const generatePdf = functions
  .region("southamerica-east1") // Região de São Paulo
  .https.onCall(async (data, context) => {
    // 1. Verifica se o usuário está autenticado
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Você precisa estar logado para acessar os materiais."
      );
    }
    const uid = context.auth.uid;
    const { storagePath, materialTitle } = data;

    if (!storagePath || !materialTitle) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "O caminho do arquivo e o título são obrigatórios."
        );
    }
    
    try {
      // 2. Busca os dados do usuário no Firestore
      const userDoc = await admin.firestore().collection("users").doc(uid).get();
      if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Usuário não encontrado.");
      }
      const userData = userDoc.data()!;

      // 3. Baixa o arquivo de conteúdo (JSON ou HTML) do Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(storagePath);
      const [fileBuffer] = await file.download();
      const fileContent = fileBuffer.toString("utf8");
      
      // Simplesmente trata o conteúdo como texto puro por enquanto
      // Lógica mais complexa para parsear HTML ou JSON pode ser adicionada aqui
      const mainText = fileContent.replace(/<[^>]*>?/gm, ''); // Remove tags HTML

      // 4. Cria um novo documento PDF em memória
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const today = format(new Date(), "dd/MM/yyyy");

      // --- Desenha o Template ---

      // Cabeçalho
      page.drawText("MedStudy", { x: 50, y: height - 50, font, size: 16, color: rgb(0.1, 0.4, 0.8) });
      page.drawText(materialTitle, { x: 50, y: height - 70, font, size: 12, color: rgb(0.2, 0.2, 0.2) });
      page.drawLine({
          start: { x: 50, y: height - 80 },
          end: { x: width - 50, y: height - 80 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
      });

      // Conteúdo Principal
      page.drawText(mainText, {
          x: 50,
          y: height - 120,
          font,
          size: 10,
          lineHeight: 14,
          color: rgb(0.1, 0.1, 0.1),
      });

      // Rodapé
      const footerTextLeft = `${userData.nome_completo} - ${today}`;
      const footerTextCenter = "www.meusaasmedico.com.br";
      const footerTextRight = `Página 1 de 1`;
      page.drawText(footerTextLeft, { x: 50, y: 40, font, size: 8, color: rgb(0.5, 0.5, 0.5) });
      page.drawText(footerTextCenter, { x: (width / 2) - 60, y: 40, font, size: 8, color: rgb(0.5, 0.5, 0.5) });
      page.drawText(footerTextRight, { x: width - 100, y: 40, font, size: 8, color: rgb(0.5, 0.5, 0.5) });

      // 5. Salva o PDF como bytes e o converte para Base64 para enviar de volta ao cliente
      const pdfBytes = await pdfDoc.save();
      return { pdfBase64: Buffer.from(pdfBytes).toString("base64") };

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw new functions.https.HttpsError("internal", "Não foi possível gerar o PDF.");
    }
});
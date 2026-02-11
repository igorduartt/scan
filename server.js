// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos (index.html, styles.css, etc.) da raiz do projeto
app.use(express.static(__dirname));

// Configuração do transporte de e-mail (Hostinger)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true para 465, false para 587
  auth: {
    // ATENÇÃO: confirme se o usuário de SMTP é exatamente este
    // Em muitos provedores é o e-mail completo.
    user: "contato@igorduartepsi.com.br",
    pass: "AIDB@Funsaude01",
  },
});

// Verifica conexão com o servidor SMTP ao subir a aplicação
transporter.verify((error, success) => {
  if (error) {
    console.error("Erro ao conectar no SMTP:", error);
  } else {
    console.log("Conexão SMTP ok:", success);
  }
});

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const message = `A localização do usuário é:
Latitude: ${latitude}
Longitude: ${longitude}
Google Maps: ${maps}`;

  try {
    // Envia a localização por e-mail
    await transporter.sendMail({
      from: '"Backscan" <contato@igorduartepsi.com.br>',
      to: "contato@igorduartepsi.com.br",
      subject: "Nova localização recebida",
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    res
      .status(500)
      .json({ success: false, message: "Erro ao enviar a localização por e-mail." });
  }
});

app.listen(8089, () => {
  console.log("Servidor rodando na porta 8089");
});

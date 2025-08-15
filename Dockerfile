# --- Estágio 1: Build da Aplicação React ---
# Usamos a imagem oficial do Node.js como base.
# A tag 'alpine' se refere a uma versão mínima, o que torna o processo mais rápido.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o contêiner.
# Fazemos isso primeiro para aproveitar o cache do Docker.
COPY package*.json ./

# Instala as dependências do projeto.
RUN npm install

# Copia todo o resto do código-fonte do projeto.
COPY . .

# Executa o comando para "compilar" a aplicação.
# Isso vai criar a pasta /app/dist com os arquivos estáticos.
RUN npm run build

# --- Estágio 2: Servidor de Produção ---
# Usamos a imagem oficial do Nginx como base, que é um servidor web leve e eficiente.
FROM nginx:1.25-alpine

# Copia os arquivos estáticos gerados no estágio de build (a pasta 'dist')
# para a pasta padrão que o Nginx usa para servir sites.
COPY --from=builder /app/dist /usr/share/nginx/html

# Uma pequena configuração extra: para que o roteamento do React (React Router) funcione,
# precisamos dizer ao Nginx para sempre enviar o arquivo index.html, não importa a URL.
# Para isso, removemos a configuração padrão...
RUN rm /etc/nginx/conf.d/default.conf
# ...e copiamos a nossa própria configuração (vamos criar esse arquivo a seguir).
COPY nginx.conf /etc/nginx/conf.d

# Expõe a porta 80 para que possamos acessar o site de fora do contêiner.
EXPOSE 80

# O comando que será executado quando o contêiner iniciar.
CMD ["nginx", "-g", "daemon off;"]
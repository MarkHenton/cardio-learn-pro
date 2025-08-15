# --- Estágio 1: Build do TypeScript ---
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copia os package.json e instala as dependências
    COPY package*.json ./
    RUN npm install
    
    # Copia o resto do código-fonte do backend
    COPY . .
    
    # Compila o TypeScript para JavaScript
    RUN npm run build
    
    # --- Estágio 2: Produção ---
    # Usamos a mesma imagem do Node, mas vamos limpar o que não for necessário
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copia apenas as dependências de produção do estágio anterior
    COPY --from=builder /app/node_modules ./node_modules
    # Copia o código já compilado para JavaScript
    COPY --from=builder /app/lib ./lib
    # Copia o package.json
    COPY package.json .
    
    # O Puppeteer precisa de algumas dependências do sistema para rodar.
    # Este comando instala essas dependências na imagem do Docker.
    RUN apk add --no-cache \
          udev \
          ttf-freefont \
          chromium
    
    # Expõe a porta que definimos no nosso código (3001)
    EXPOSE 3001
    
    # O comando para iniciar o servidor quando o contêiner rodar
    CMD [ "node", "lib/index.js" ]
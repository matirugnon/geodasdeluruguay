FROM node:18

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código incluyendo .env
COPY . .

# Exponer puerto
EXPOSE 5000

# Iniciar servidor
CMD ["npm", "start"]
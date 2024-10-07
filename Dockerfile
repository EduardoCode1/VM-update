# Usar la imagen base de Node
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 3000 (o el puerto que uses)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

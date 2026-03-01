FROM node:18-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Tüm kodları kopyala
COPY . .

# TypeScript'i JavaScript'e derle (Build al)
RUN npm run build

# Uygulamayı başlat
EXPOSE 3000
CMD ["npm", "start"]
# =========================================================
# Stage 1 - Build (Node + Vite)
# =========================================================
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências de forma reprodutível
COPY package*.json ./
RUN npm ci

# Build de produção do Vite.
# VITE_API_BASE_URL vazio => o cliente usa caminhos relativos (/api),
# que o nginx reencaminha para o backend (mesma origem, sem CORS).
COPY . .
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# =========================================================
# Stage 2 - Serve (nginx, SPA + proxy para a API)
# =========================================================
FROM nginx:1.27-alpine AS runtime

# Upstream da API; configurável em produção (ex.: Render)
ENV BACKEND_URL=http://backend:8080

# O template é processado com envsubst pelo entrypoint oficial do nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

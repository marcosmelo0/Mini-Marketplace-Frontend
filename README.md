# 🛍️ Mini Marketplace - Frontend

> Aplicação frontend para o Mini Marketplace, uma plataforma de agendamento de serviços que conecta clientes e prestadores de serviços.

---

## 🚀 Tecnologias

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Animações**: Svelte Motion
- **HTTP Client**: Fetch API
- **Gerenciamento de Estado**: Svelte Stores
- **Validação**: Zod (no backend)

---

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:3000`

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do projeto
cd mini-marketplace-frontend

# Instale as dependências
npm install
```

---

## 🏃 Executando o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

O projeto estará disponível em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── api/              # Funções de chamada à API
│   │   ├── auth.ts       # Autenticação
│   │   ├── services.ts   # Serviços
│   │   ├── bookings.ts   # Agendamentos
│   │   ├── reviews.ts    # Avaliações
│   │   └── ...
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/          # Componentes de UI
│   │   └── ...
│   ├── stores/          # Svelte stores
│   │   ├── auth.ts      # Estado de autenticação
│   │   └── toast.ts     # Notificações toast
│   ├── types/           # TypeScript types
│   └── utils/           # Funções auxiliares
├── routes/              # Páginas da aplicação (SvelteKit routing)
│   ├── auth/           # Páginas de autenticação
│   ├── services/       # Páginas de serviços
│   ├── bookings/       # Páginas de agendamentos
│   ├── provider/       # Páginas do provedor
│   └── ...
├── app.css             # Estilos globais
└── app.html            # Template HTML
```

---

## 🎨 Funcionalidades Implementadas

### 👤 Para Todos os Usuários
- ✅ Página inicial com busca de serviços
- ✅ Busca com Elasticsearch
- ✅ Filtro por categoria
- ✅ Visualização de detalhes do serviço
- ✅ Sistema de autenticação (Login/Registro)
- ✅ Perfil do usuário

### 🛒 Para Clientes
- ✅ Busca e navegação de serviços
- ✅ Visualização de detalhes e avaliações
- ✅ Seleção de variação e agendamento
- ✅ Verificação de disponibilidade em tempo real
- ✅ Lista de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Sistema de avaliações

### 💼 Para Provedores
- ✅ Dashboard com resumo
- ✅ CRUD completo de serviços
- ✅ Gerenciamento de variações de serviço
- ✅ Gerenciamento de disponibilidade
- ✅ Lista de agendamentos recebidos
- ✅ Centro de notificações
- ✅ Marcar notificações como lidas

---

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. **Login**: Retorna `token` e `refreshToken`
2. **Token**: Armazenado no localStorage e incluído em requisições autenticadas
3. **Refresh**: Renovação automática do token quando expira
4. **Roles**: `CLIENT` (cliente) ou `PROVIDER` (prestador)

---

## 📡 Integração com Backend

A aplicação consome a API REST do backend em `http://localhost:3000`.

### Principais Endpoints Utilizados

- **Auth**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **Serviços**: `/services`, `/services/:id`, `/services/types`
- **Agendamentos**: `/bookings`, `/bookings/client/my-bookings`
- **Avaliações**: `/reviews`, `/reviews/services/:serviceId`
- **Disponibilidade**: `/availabilities/provider/:providerId/slots`
- **Notificações**: `/notifications/my-notifications`

Para documentação completa da API, consulte o arquivo `BACKEND_SPEC.md`.

---

## 🎨 Design System

### Cores Principais
- **Primary**: Purple/Pink gradient
- **Background**: Dark slate (slate-900)
- **Cards**: Glass morphism effect
- **Text**: White/Gray scale

### Componentes UI
- `Button`: Botões com variantes (primary, outline, ghost)
- `Input`: Campos de entrada estilizados
- `Loading`: Indicador de carregamento
- `Toast`: Notificações temporárias
- `Modal`: Diálogos modais

---

## 📝 Notas Importantes

### Fotos de Serviços
- As fotos são armazenadas como **URLs de texto** no frontend
- O backend armazena as imagens como dados binários (BYTEA)
- URLs de fotos seguem o padrão: `/services/{id}/photos/{index}`

### Categorias de Serviços
- As categorias são obtidas dinamicamente via `/services/types`
- Utilizadas em selects nas páginas de criação e edição de serviços

### Disponibilidade
- Sistema de slots de horários baseado na duração do serviço
- Verificação em tempo real de conflitos de agendamento
- Suporte a descontos por dia da semana

---

## 🐛 Debugging

```bash
# Verificar erros de lint
npm run lint

# Verificar tipos TypeScript
npm run check
```

---

## 📦 Build e Deploy

```bash
# Criar build de produção
npm run build

# A build estará em ./build
# Configure seu servidor para servir os arquivos estáticos
```

---

## 🔄 Atualizações Recentes

### 28/11/2025
- ✅ Atualizado input de foto para URL de texto (criação de serviço)
- ✅ Atualizado campo de categoria para select dropdown (edição de serviço)
- ✅ Melhorias de responsividade em toda a aplicação
- ✅ Sistema de avaliações implementado

### 27/11/2025
- ✅ Implementado sistema de upload de imagens
- ✅ Seed data atualizado com múltiplos nichos
- ✅ Correções de responsividade

---

## 📄 Licença

Este projeto é parte de um sistema de marketplace de serviços.

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Para questões e suporte, consulte a documentação do backend em `BACKEND_SPEC.md`.

---

**Última atualização**: 28/11/2025  
**Versão**: 1.0.0

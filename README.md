# Mini Marketplace - Frontend

Frontend do Mini Marketplace, uma plataforma moderna e responsiva para conectar prestadores de serviços com clientes.

## ✨ Destaques

- 🎨 **Design Moderno** - Interface premium com gradientes, glassmorphism e animações suaves
- 📱 **Totalmente Responsivo** - Experiência otimizada para mobile, tablet e desktop
- ⚡ **Performance** - Carregamento rápido e navegação fluida
- 🔍 **Busca Inteligente** - Integração com Elasticsearch para busca rápida e precisa
- 🔔 **Notificações em Tempo Real** - Sistema de notificações para provedores
- 🎯 **UX Aprimorada** - Componentes intuitivos e fluxos de usuário otimizados

## 🚀 Tecnologias

- **SvelteKit 5** - Framework web moderno com roteamento file-based
- **TypeScript** - Tipagem estática para código mais seguro
- **Tailwind CSS v4** - Estilização utilitária de última geração
- **Svelte Motion** - Animações fluidas e performáticas
- **Zod** - Validação de dados robusta
- **date-fns** - Manipulação de datas em português brasileiro

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Backend do Mini Marketplace rodando (porta 3000)

## 🔧 Instalação

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone <repository-url>
cd mini-marketplace-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PUBLIC_API_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Com Docker

```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── api/              # Funções de chamada à API
│   │   ├── auth.ts       # Autenticação e autorização
│   │   ├── services.ts   # CRUD de serviços
│   │   ├── bookings.ts   # Gerenciamento de agendamentos
│   │   ├── reviews.ts    # Sistema de avaliações
│   │   ├── availabilities.ts  # Disponibilidade de provedores
│   │   ├── notifications.ts   # Notificações
│   │   └── search.ts     # Busca com Elasticsearch
│   ├── stores/           # Svelte stores (estado global)
│   │   ├── auth.ts       # Estado de autenticação
│   │   ├── toast.ts      # Notificações toast
│   │   └── notifications.ts  # Notificações do sistema
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/          # Componentes base (Button, Input, Modal, etc.)
│   │   ├── Navigation.svelte
│   │   ├── SearchBar.svelte
│   │   └── ReviewModal.svelte
│   ├── types/           # TypeScript types
│   │   └── api.ts       # Tipos da API
│   └── utils/           # Funções auxiliares
│       ├── http.ts      # Cliente HTTP com interceptors
│       ├── date.ts      # Formatação de datas
│       └── debounce.ts  # Debounce para inputs
├── routes/              # Páginas SvelteKit (file-based routing)
│   ├── +page.svelte                    # Home
│   ├── +layout.svelte                  # Layout principal
│   ├── auth/
│   │   ├── login/+page.svelte          # Login
│   │   └── register/+page.svelte       # Cadastro
│   ├── services/
│   │   ├── +page.svelte                # Lista de serviços
│   │   └── [id]/+page.svelte           # Detalhes do serviço
│   ├── bookings/
│   │   ├── +page.svelte                # Meus agendamentos
│   │   └── new/+page.svelte            # Novo agendamento
│   ├── profile/
│   │   └── +page.svelte                # Perfil do usuário
│   └── provider/
│       ├── dashboard/+page.svelte      # Dashboard do provedor
│       ├── services/
│       │   ├── +page.svelte            # Gerenciar serviços
│       │   ├── new/+page.svelte        # Criar serviço
│       │   └── [id]/+page.svelte       # Editar serviço
│       ├── availability/+page.svelte   # Gerenciar disponibilidade
│       └── notifications/+page.svelte  # Centro de notificações
└── app.css              # Estilos globais e Tailwind
```

## 🎯 Funcionalidades

### Para Todos os Usuários
- ✅ **Busca Avançada** - Busca com autocomplete e sugestões inteligentes
- ✅ **Filtros** - Filtro por categoria com UI responsiva
- ✅ **Detalhes do Serviço** - Visualização completa com galeria de fotos
- ✅ **Sistema de Avaliações** - Visualizar avaliações e ratings
- ✅ **Autenticação** - Login e registro com validação

### Para Clientes
- ✅ **Criar Agendamentos** - Seleção de data, horário e variação
- ✅ **Meus Agendamentos** - Visualizar histórico completo
- ✅ **Cancelar Agendamentos** - Cancelamento com confirmação
- ✅ **Avaliar Serviços** - Sistema de rating com comentários
- ✅ **Buscas Recentes** - Histórico de buscas personalizadas

### Para Provedores
- ✅ **Dashboard Completo** - Estatísticas e atalhos rápidos
- ✅ **CRUD de Serviços** - Criar, editar e excluir serviços
- ✅ **Upload de Fotos** - Galeria de imagens para serviços
- ✅ **Gerenciar Disponibilidade** - Configurar horários por dia da semana
- ✅ **Agendamentos Recebidos** - Visualizar e gerenciar bookings
- ✅ **Centro de Notificações** - Notificações em tempo real
- ✅ **Notificações Push** - Alertas de novos agendamentos

## 🎨 Design System

### Cores
- **Primary**: Gradiente roxo-rosa (`from-purple-600 to-pink-600`)
- **Background**: Slate escuro (`slate-900`)
- **Cards**: Glass effect com backdrop blur
- **Text**: Branco e tons de cinza

### Componentes UI
- **Button** - Variantes: primary, outline, ghost, danger
- **Input** - Com labels e validação visual
- **Modal** - Responsivo com animações
- **Toast** - Notificações temporárias
- **Loading** - Spinner animado
- **Card** - Container com glass effect

### Responsividade
Breakpoints Tailwind:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

Todas as páginas são otimizadas para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔐 Autenticação

### JWT (JSON Web Tokens)
- Tokens armazenados em `localStorage`
- Renovação automática de tokens
- Interceptors HTTP para incluir tokens automaticamente
- Proteção de rotas com `RouteGuard`

### Fluxo de Autenticação
1. Login/Registro → Recebe access token e refresh token
2. Access token incluído em todas as requisições
3. Ao expirar, tenta renovar automaticamente
4. Se falhar, redireciona para login

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PUBLIC_API_URL` | URL do backend | `http://localhost:3000` |

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Type checking
npm run check

# Type checking em watch mode
npm run check:watch

# Lint
npm run lint
```

## 🔄 Integração com Backend

O frontend se comunica com o backend através de uma API REST documentada em `BACKEND_SPEC.md`.

### Principais Endpoints
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Cadastro
- `GET /services` - Listar serviços
- `POST /services` - Criar serviço (provider)
- `GET /services/:id` - Detalhes do serviço
- `POST /bookings` - Criar agendamento
- `GET /bookings` - Listar agendamentos
- `GET /search` - Busca com Elasticsearch
- `GET /notifications` - Notificações (provider)

## 🐛 Troubleshooting

### Erro de conexão com o backend
1. Verifique se o backend está rodando na porta 3000
2. Confirme a variável `PUBLIC_API_URL` no `.env`
3. Verifique se não há bloqueio de CORS

### Problemas com autenticação
1. Limpe o localStorage:
```javascript
localStorage.clear()
```
2. Faça login novamente

### Erros de build
1. Limpe o cache:
```bash
rm -rf .svelte-kit node_modules
npm install
```

### Problemas com Tailwind CSS v4
- Certifique-se de ter a configuração correta no `app.css`
- Verifique se o VS Code está configurado para ignorar warnings de `@custom-variant`

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos otimizados estarão em `/build`

### Variáveis de Ambiente em Produção
Certifique-se de configurar `PUBLIC_API_URL` para a URL do backend em produção.

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👥 Autor

Desenvolvido com ❤️ por Marcos, usando SvelteKit 5 e Tailwind CSS v4.

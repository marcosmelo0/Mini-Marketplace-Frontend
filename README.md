# Mini Marketplace - Frontend

Frontend do Mini Marketplace, uma plataforma para conectar prestadores de serviços com clientes.

## 🚀 Tecnologias

- **SvelteKit 5** - Framework web moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de dados
- **date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Docker (opcional)

## 🔧 Instalação

### Sem Docker

1. Clone o repositório:
```bash
git clone https://github.com/marcosmelo0/Mini-Marketplace-Frontend.git
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

Edite o arquivo `.env` e configure a URL do backend:
```env
PUBLIC_API_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Com Docker

1. Build da imagem:
```bash
docker build -t mini-marketplace-frontend .
```

2. Execute o container:
```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── api/              # Funções de chamada à API
│   │   ├── auth.ts
│   │   ├── services.ts
│   │   ├── bookings.ts
│   │   ├── reviews.ts
│   │   ├── availabilities.ts
│   │   ├── notifications.ts
│   │   └── search.ts
│   ├── stores/           # Svelte stores
│   │   ├── auth.ts
│   │   └── notifications.ts
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/          # Componentes de UI base
│   │   └── ...
│   ├── types/           # TypeScript types
│   │   └── api.ts
│   └── utils/           # Funções auxiliares
│       └── http.ts
├── routes/              # Páginas SvelteKit
│   ├── +page.svelte                    # Home
│   ├── +layout.svelte                  # Layout principal
│   ├── auth/
│   │   ├── login/+page.svelte
│   │   └── register/+page.svelte
│   ├── services/
│   │   ├── +page.svelte                # Lista de serviços
│   │   └── [id]/+page.svelte           # Detalhes do serviço
│   ├── bookings/
│   │   └── +page.svelte                # Meus agendamentos
│   ├── profile/
│   │   └── +page.svelte                # Perfil do usuário
│   └── provider/
│       ├── dashboard/+page.svelte      # Dashboard
│       ├── services/+page.svelte       # Gerenciar serviços
│       ├── availability/+page.svelte   # Disponibilidade
│       ├── bookings/+page.svelte       # Agendamentos recebidos
│       └── notifications/+page.svelte  # Notificações
└── app.css
```

## 🎯 Funcionalidades

### Para Todos os Usuários
- ✅ Busca de serviços
- ✅ Filtro por categoria
- ✅ Visualização de detalhes do serviço
- ✅ Sistema de autenticação (login/registro)

### Para Clientes
- ✅ Criar agendamentos
- ✅ Visualizar meus agendamentos
- ✅ Cancelar agendamentos
- ✅ Avaliar serviços

### Para Provedores
- ✅ Dashboard com resumo
- ✅ CRUD de serviços
- ✅ Gerenciar disponibilidade
- ✅ Visualizar agendamentos recebidos
- ✅ Centro de notificações
- ✅ Notificações em tempo real

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Os tokens são armazenados no localStorage e incluídos automaticamente nas requisições autenticadas.

### Renovação Automática de Token

O sistema implementa renovação automática de tokens. Quando um token expira, o sistema tenta renová-lo automaticamente usando o refresh token.

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
```

## 🎨 Estilização

O projeto utiliza Tailwind CSS com tema customizado:

- **Cores primárias**: Tons de azul
- **Cores secundárias**: Tons de roxo
- **Dark mode**: Suportado
- **Animações**: Fade-in, slide-up, slide-down
- **Efeitos**: Glassmorphism

## 🔄 Integração com Backend

O frontend se comunica com o backend através de uma API REST. Certifique-se de que o backend está rodando antes de iniciar o frontend.

Endpoints principais:
- `/auth/*` - Autenticação
- `/services/*` - Serviços
- `/bookings/*` - Agendamentos
- `/reviews/*` - Avaliações
- `/availabilities/*` - Disponibilidade
- `/notifications/*` - Notificações
- `/search` - Busca com Elasticsearch

## 🐛 Troubleshooting

### Erro de conexão com o backend

Verifique se:
1. O backend está rodando
2. A variável `PUBLIC_API_URL` está configurada corretamente
3. Não há bloqueio de CORS

### Problemas com autenticação

1. Limpe o localStorage:
```javascript
localStorage.clear()
```

2. Faça login novamente

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👥 Autores

- Desenvolvido com ❤️ usando SvelteKit 5

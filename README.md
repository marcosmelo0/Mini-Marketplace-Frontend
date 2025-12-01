# 🛍️ Mini Marketplace - Frontend

> Aplicação frontend moderna para o Mini Marketplace, uma plataforma completa de agendamento de serviços que conecta clientes e prestadores de serviços de forma segura e eficiente.

---

## 🚀 Tecnologias

- **Framework**: [SvelteKit](https://kit.svelte.dev/) 2.48.5
- **Linguagem**: TypeScript 5.9.3
- **Estilização**: Tailwind CSS 4.1.17
- **Animações**: Svelte Motion 0.12.2
- **UI Components**: bits-ui, Lucide Icons
- **HTTP Client**: Fetch API nativa
- **Gerenciamento de Estado**: Svelte 5 Stores (Runes)
- **Validação de Datas**: date-fns 4.1.0, @internationalized/date
- **Build Tool**: Vite 7.2.2

---

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Backend** rodando em `http://localhost:3000`
- **PostgreSQL** (via backend)
- **Elasticsearch** (via backend)

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do projeto
cd mini-marketplace-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

### Variáveis de Ambiente

```env
PUBLIC_API_URL=http://localhost:3000
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

# Verificar tipos TypeScript
npm run check

# Verificar tipos em modo watch
npm run check:watch
```

O projeto estará disponível em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
mini-marketplace-frontend/
├── src/
│   ├── lib/
│   │   ├── api/                    # Camada de integração com API
│   │   │   ├── auth.ts            # Autenticação e autorização
│   │   │   ├── services.ts        # CRUD de serviços
│   │   │   ├── bookings.ts        # Gestão de agendamentos
│   │   │   ├── reviews.ts         # Sistema de avaliações
│   │   │   ├── availabilities.ts  # Verificação de disponibilidade
│   │   │   ├── notifications.ts   # Centro de notificações
│   │   │   └── search.ts          # Busca com Elasticsearch
│   │   ├── components/            # Componentes reutilizáveis
│   │   │   ├── ui/               # Componentes base de UI
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   └── ...
│   │   │   ├── ServiceCard.svelte
│   │   │   ├── BookingCard.svelte
│   │   │   ├── ReviewModal.svelte
│   │   │   └── ...
│   │   ├── stores/               # Estado global da aplicação
│   │   │   ├── auth.ts          # Estado de autenticação
│   │   │   ├── toast.ts         # Sistema de notificações
│   │   │   └── user.ts          # Dados do usuário
│   │   ├── types/               # Definições TypeScript
│   │   │   └── index.ts
│   │   └── utils/               # Funções auxiliares
│   │       ├── http.ts          # Cliente HTTP configurado
│   │       ├── date.ts          # Manipulação de datas/timezone
│   │       └── format.ts        # Formatação de dados
│   ├── routes/                  # Sistema de rotas (SvelteKit)
│   │   ├── +layout.svelte      # Layout principal
│   │   ├── +page.svelte        # Página inicial
│   │   ├── auth/               # Autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── services/           # Catálogo de serviços
│   │   │   └── [id]/          # Detalhes do serviço
│   │   ├── bookings/           # Agendamentos do cliente
│   │   │   ├── new/           # Novo agendamento
│   │   │   └── +page.svelte   # Lista de agendamentos
│   │   ├── provider/           # Área do prestador
│   │   │   ├── dashboard/     # Dashboard do provedor
│   │   │   ├── services/      # Gestão de serviços
│   │   │   ├── bookings/      # Agendamentos recebidos
│   │   │   ├── availability/  # Configuração de disponibilidade
│   │   │   └── notifications/ # Notificações
│   │   └── profile/           # Perfil do usuário
│   ├── app.css                # Estilos globais + Tailwind
│   ├── app.html               # Template HTML base
│   └── app.d.ts               # Definições de tipos globais
├── static/                    # Arquivos estáticos
├── .env.example              # Exemplo de variáveis de ambiente
├── package.json              # Dependências e scripts
├── svelte.config.js          # Configuração do SvelteKit
├── tailwind.config.js        # Configuração do Tailwind
├── tsconfig.json             # Configuração do TypeScript
├── vite.config.ts            # Configuração do Vite
├── Dockerfile                # Container Docker
├── docker-compose.yml        # Orquestração Docker
├── BACKEND_SPEC.md           # Documentação da API
└── README.md                 # Este arquivo
```

---

## 🎨 Funcionalidades Implementadas

### 👤 Para Todos os Usuários

- ✅ **Página Inicial**: Interface moderna com busca inteligente
- ✅ **Busca Avançada**: Integração com Elasticsearch para resultados rápidos
- ✅ **Filtros**: Por categoria, preço, avaliação e disponibilidade
- ✅ **Ordenação**: Por preço (menor/maior) e avaliação
- ✅ **Detalhes do Serviço**: Visualização completa com fotos, variações e avaliações
- ✅ **Autenticação Segura**: Login/Registro com HTTP-Only Cookies
- ✅ **Perfil do Usuário**: Visualização e edição de dados pessoais
- ✅ **Design Responsivo**: Otimizado para desktop, tablet e mobile

### 🛒 Para Clientes

- ✅ **Catálogo de Serviços**: Navegação intuitiva com cards informativos
- ✅ **Sistema de Agendamento**: Seleção de data, horário e variação
- ✅ **Verificação de Disponibilidade**: Consulta em tempo real de horários disponíveis
- ✅ **Gestão de Agendamentos**: Lista completa com status e ações
- ✅ **Cancelamento**: Cancelamento de agendamentos com confirmação
- ✅ **Sistema de Avaliações**: Avaliação de serviços concluídos (1-5 estrelas + comentário)
- ✅ **Visualização de Descontos**: Exibição de preços promocionais por dia da semana
- ✅ **Histórico**: Acesso a agendamentos passados e futuros

### 💼 Para Provedores

- ✅ **Dashboard Completo**: Resumo de agendamentos, receitas e estatísticas
- ✅ **CRUD de Serviços**: Criação, edição e exclusão de serviços
- ✅ **Variações de Serviço**: Múltiplas opções de preço/duração por serviço
- ✅ **Upload de Fotos**: Suporte a URLs de imagens para serviços
- ✅ **Gestão de Disponibilidade**: Configuração de horários por dia da semana
- ✅ **Descontos Especiais**: Configuração de preços promocionais por dia
- ✅ **Lista de Agendamentos**: Visualização de todos os agendamentos recebidos
- ✅ **Centro de Notificações**: Alertas de novos agendamentos e cancelamentos
- ✅ **Marcação de Leitura**: Sistema de notificações lidas/não lidas
- ✅ **Estatísticas**: Métricas de desempenho e avaliações

---

## 🔐 Autenticação e Segurança

O sistema implementa autenticação moderna e segura usando **HTTP-Only Cookies**:

### Arquitetura de Autenticação

1. **Login/Registro**: 
   - Usuário envia credenciais via POST
   - Backend valida e retorna cookies `token` e `refreshToken`
   - Cookies são HttpOnly, Secure (em produção) e SameSite

2. **Armazenamento Seguro**:
   - Tokens armazenados em cookies HTTP-Only (inacessíveis via JavaScript)
   - Proteção contra ataques XSS
   - Cookies enviados automaticamente em cada requisição

3. **Refresh Automático**:
   - Token de acesso expira em 1 hora
   - Refresh token válido por 7 dias
   - Renovação automática gerenciada pelo backend

4. **Roles e Permissões**:
   - `CLIENT`: Acesso a agendamentos e avaliações
   - `PROVIDER`: Acesso adicional a dashboard e gestão de serviços

### Configuração do Cliente HTTP

```typescript
// src/lib/utils/http.ts
fetch(url, {
    credentials: 'include',  // Envia cookies automaticamente
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### Segurança Implementada

- ✅ **HTTP-Only Cookies**: Proteção contra XSS
- ✅ **CORS Configurado**: Apenas origem do frontend aceita
- ✅ **Secure Flag**: Cookies HTTPS em produção
- ✅ **SameSite**: Proteção contra CSRF
- ✅ **Refresh Token Rotation**: Tokens únicos por sessão
- ✅ **Validação de Input**: Zod no backend

---

## 📡 Integração com Backend

A aplicação consome uma API REST completa em `http://localhost:3000`.

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login e geração de tokens
- `POST /auth/refresh` - Renovação de token
- `POST /auth/logout` - Logout e invalidação de cookies
- `GET /auth/me` - Dados do usuário autenticado

#### Serviços
- `GET /services` - Lista de serviços (com filtros e busca)
- `GET /services/:id` - Detalhes de um serviço
- `GET /services/types` - Categorias disponíveis
- `POST /services` - Criar serviço (provider)
- `PUT /services/:id` - Atualizar serviço (provider)
- `DELETE /services/:id` - Deletar serviço (provider)
- `GET /services/:id/photos/:index` - Foto do serviço

#### Agendamentos
- `GET /bookings` - Lista de agendamentos (provider)
- `GET /bookings/client/my-bookings` - Agendamentos do cliente
- `POST /bookings` - Criar agendamento
- `PATCH /bookings/:id/cancel` - Cancelar agendamento

#### Disponibilidade
- `GET /availabilities/provider/:providerId/slots` - Slots disponíveis
- `GET /availabilities/my-availabilities` - Disponibilidade do provider
- `POST /availabilities` - Criar disponibilidade
- `PUT /availabilities/:id` - Atualizar disponibilidade
- `DELETE /availabilities/:id` - Deletar disponibilidade

#### Avaliações
- `GET /reviews/services/:serviceId` - Avaliações de um serviço
- `POST /reviews` - Criar avaliação
- `GET /reviews/booking/:bookingId` - Avaliação de um agendamento

#### Notificações
- `GET /notifications/my-notifications` - Notificações do usuário
- `PATCH /notifications/:id/read` - Marcar como lida

#### Busca
- `GET /search` - Busca com Elasticsearch


---

## 🎨 Design System

### Paleta de Cores

```css
/* Cores Principais */
--primary: Purple/Pink gradient (#8B5CF6 → #EC4899)
--background: Dark slate (#0f172a)
--surface: Slate-800 (#1e293b)
--card: Glass morphism (backdrop-blur + opacity)

/* Texto */
--text-primary: White (#ffffff)
--text-secondary: Gray-300 (#d1d5db)
--text-muted: Gray-500 (#6b7280)

/* Estados */
--success: Green-500 (#10b981)
--error: Red-500 (#ef4444)
--warning: Yellow-500 (#eab308)
--info: Blue-500 (#3b82f6)
```

### Componentes UI

#### Button
```svelte
<Button variant="primary">Confirmar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Fechar</Button>
```

#### Input
```svelte
<Input type="text" placeholder="Digite aqui..." />
<Input type="email" label="E-mail" />
```

#### Modal
```svelte
<Modal open={isOpen} onClose={handleClose}>
    <h2>Título</h2>
    <p>Conteúdo</p>
</Modal>
```

#### Toast
```typescript
import { showToast } from '$lib/stores/toast';

showToast('Sucesso!', 'success');
showToast('Erro ao processar', 'error');
```

### Efeitos Visuais

- **Glass Morphism**: Cards com backdrop-blur e transparência
- **Gradientes**: Botões e headers com gradientes suaves
- **Animações**: Transições suaves com Svelte Motion
- **Hover Effects**: Feedback visual em elementos interativos
- **Loading States**: Skeletons e spinners durante carregamento

---

## 📝 Notas Técnicas Importantes

### Gestão de Fotos de Serviços

- **Frontend**: Aceita URLs de imagens como string
- **Endpoint de Foto**: `/services/{id}/photos/{index}`
- **Formato**: Suporta múltiplas fotos por serviço (array)

```typescript
const photoUrl = `${API_URL}/services/${serviceId}/photos/0`;
```

### Categorias de Serviços

- Obtidas dinamicamente via `/services/types`
- Enum no backend: `BEAUTY`, `HEALTH`, `EDUCATION`, `TECHNOLOGY`, etc.
- Utilizadas em selects com labels traduzidos

```typescript
const categories = await fetch('/services/types').then(r => r.json());
// ['BEAUTY', 'HEALTH', 'EDUCATION', ...]
```

### Sistema de Disponibilidade

- **Slots de Horário**: Calculados com base na duração do serviço
- **Verificação em Tempo Real**: Consulta conflitos antes de confirmar
- **Descontos por Dia**: Preços especiais configuráveis por dia da semana
- **Bloqueio de Horários**: Agendamentos existentes bloqueiam slots

```typescript
// Exemplo de consulta de disponibilidade
const slots = await getAvailableSlots(providerId, date, variationId);
// Retorna: [{ time: '09:00', available: true, price: 50 }, ...]
```

### Gestão de Timezone

**CRÍTICO**: Todo o sistema opera no timezone do Brasil (UTC-3)

- **Formato**: ISO 8601 com offset explícito
- **Exemplo**: `2025-12-04T14:00:00-03:00`
- **Parsing**: Sempre preserva o timezone original
- **Display**: Formatado com date-fns para exibição local

```typescript
const bookingTime = new Date('2025-12-04T14:00:00-03:00');

```

### Sistema de Avaliações

- **Restrição**: Apenas clientes com agendamentos `COMPLETED`
- **Escala**: 1-5 estrelas
- **Comentário**: Opcional, máximo 500 caracteres
- **Unicidade**: Uma avaliação por agendamento
- **Impacto**: Atualiza média de avaliação do serviço

---

## 🐛 Debugging e Desenvolvimento

### Scripts Úteis

```bash
# Verificar tipos TypeScript
npm run check

# Verificar tipos em modo watch
npm run check:watch

# Sincronizar tipos do SvelteKit
npm run prepare
```

### Logs e Debugging

```typescript
// Habilitar logs detalhados (desenvolvimento)
console.log('[API]', endpoint, data);

// Verificar estado de autenticação
import { user } from '$lib/stores/auth';
console.log($user);
```

## 📦 Build e Deploy

### Build Local

```bash
# Criar build de produção
npm run build

# Testar build localmente
npm run preview
```

### Deploy com Docker

```bash
# Build da imagem
docker build -t mini-marketplace-frontend .

# Executar container
docker run -p 5173:5173 mini-marketplace-frontend
```

### Deploy com Docker Compose

```bash
# Subir todos os serviços
docker-compose up -d

```

### Variáveis de Ambiente (Produção)

```env
PUBLIC_API_URL=https://api.seudominio.com
NODE_ENV=production
```

### Adaptadores SvelteKit

- **Desenvolvimento**: `@sveltejs/adapter-auto`
- **Produção**: `@sveltejs/adapter-node` (configurado)


---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando tecnologias modernas e melhores práticas de desenvolvimento web.

---
# Mini Marketplace de Serviços

## Objetivo

Construir um sistema de marketplace de serviços de profissionais liberais (ex.: diarista, pintor, eletricista), com cadastro de prestadores, criação de serviços com variações, agenda de disponibilidades e contratação de serviços por clientes.

Você terá 8 dias corridos para desenvolver e apresentar o projeto (demo de até 15 minutos).

---

## Escopo Mínimo (obrigatório)

### 1) Cadastro de Prestador
- Prestador cria conta.
- Área administrativa para:
  - Criar serviços (escolhendo o tipo a partir de uma lista global definida no sistema).

Cada serviço deve conter:
- **Nome**
- **Descrição**
- **Fotos**
- **Variações** (uma ou mais):
  - Nome da variação
  - Preço
  - Duração (em minutos)

**Exemplo:**
- Serviço: *Manicure*
  - Descrição: Serviço de manicure excelente, profissional com 20 anos de experiência.
  - Variações:
    - Pé: R$ 20,00 — 30 minutos
    - Pé com pintura: R$ 30,00 — 60 minutos
    - Mãos: R$ 25,50 — 30 minutos
    - Mãos com pintura: R$ 35,00 — 60 minutos

- Cadastrar agenda de disponibilidades (ex.: dias/horários que pode atender).

### 2) Cliente (website principal do marketplace)
- Cliente pode navegar sem login, mas precisa se cadastrar para contratar.

Funcionalidades:
- Filtrar serviços por tipo.
- Ver detalhes de um serviço (quem oferece, descrição, variações).
- Escolher variação, dia/hora disponível e contratar.

### 3) Contratação
Ao contratar:
- O sistema deve reservar o slot de data/hora + duração (não pode haver sobreposição).
- Não é necessário implementar integração de pagamento — a compra é automaticamente aprovada.

### 4) Painel do Prestador
- Visualizar agenda com serviços contratados.
- Receber notificação simples (ex.: banner ou listagem) quando houver nova contratação.
- Possibilidade de visualizar lista de contratações.
- Cancelar uma contratação.

---

## Extras (valem pontos)
- Notificações externas (e-mail, WhatsApp, Telegram).
- Descontos em dias específicos.
- Avaliações de clientes.
- Geolocalização (filtrar prestadores por cidade/bairro).
- Autocomplete / facetas nas buscas (ex.: usando Elasticsearch).
- Serviços longos: suportar serviços que duram vários dias (ex.: pintura de uma casa) — definir modelo que abranja este caso.
- Chat interno entre prestador e cliente.

---

## Requisitos Técnicos (mínimos)
- **Backend:** Node.js (Elysia / Express / Fastify / Hono ou outro).
- **Frontend:** SvelteKit.
- **Banco de dados:** MySQL ou PostgreSQL.
- **Cache:** Redis (ex.: guardar buscas recentes ou slots disponíveis).
- **Busca:** Elasticsearch (buscar serviços por nome/descrição).
- Rodar em Linux (local ou containerizado).

---

## Critérios de Avaliação
- Modelagem de dados.
- Fluxo cliente → contratação → bloqueio da agenda (sem sobreposição).
- Performance.
- Frontend funcional, elegante e intuitivo (Svelte).
- Código organizado + README / documentação.
- Apresentação da demo (clareza do que foi feito).
- Extras implementados.

---

## Entrega
- Repositório Git com backend e frontend.
- README explicando como rodar, incluindo:
  - Variáveis de ambiente.
  - Scripts (dev, start, seed).
  - Se usar Docker, incluir `docker-compose.yml`.
- Seed inicial com alguns prestadores, serviços e variações para testar.
- Vídeo de apresentação hospedado no YouTube (ou outro serviço) com o link no README do repositório.
  - O vídeo deve mostrar o sistema funcionando com todas as funcionalidades e também apresentar a arquitetura da solução: quais sistemas foram desenvolvidos e quais partes do código são mais importantes.

---

## Sugestões de Estrutura do Repositório
- `/backend`
  - `src/`
  - `Dockerfile`
  - `docker-compose.yml` (opcional)
  - `prisma/` ou `migrations/` (se usar ORM)
  - `seed/` (scripts de seed)
- `/frontend`
  - `src/`
  - `svelte.config.js`
- `README.md` (raiz) — instruções gerais e link para o vídeo de apresentação

---

## Exemplo de Endpoints (sugestão)
- `POST /auth/signup` — cadastrar prestador/cliente
- `POST /auth/login`
- `GET /services?type=manicure&city=...` — listar/filtrar serviços
- `GET /services/:id` — detalhes do serviço
- `POST /providers/:id/services` — criar serviço (área do prestador)
- `POST /bookings` — criar contratação (reserva de slot)
- `GET /providers/:id/bookings` — listar contratações do prestador
- `PATCH /bookings/:id/cancel` — cancelar contratação

---

## Observações
- Priorize o fluxo crítico (cadastro de prestador → criação de serviço → cliente contrata → bloqueio de horário → painel do prestador).
- Implemente validações para evitar sobreposição de reservas.
- Inclua seed com exemplos reais para facilitar a demo.

---

*Boa sorte no desenvolvimento — 8 dias voam!*


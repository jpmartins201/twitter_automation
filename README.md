# Bot de Automação de Respostas no Twitter

Este projeto é um bot automatizado que responde tweets no Twitter de forma massiva, utilizando Playwright para automação do navegador e integração com Google Sheets para gerenciar os links dos tweets a serem respondidos.

## Funcionalidades
- Login automático no Twitter
- Resposta automática a uma lista de tweets
- Confirmação do envio da resposta
- Registro dos links processados com sucesso em uma planilha Google Sheets
- Controle de delays para simular comportamento humano

## Pré-requisitos
- Node.js (versão 16 ou superior)
- Conta no Twitter
- Conta Google com acesso à API do Google Sheets

## Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/twitter-automation.git
   cd twitter-automation
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   TWITTER_USERNAME=seu_usuario_twitter
   TWITTER_PASSWORD=sua_senha_twitter
   GOOGLE_SHEETS_ID=ID_da_sua_planilha
   ```
4. Gere as credenciais do Google Cloud para acesso à API do Sheets e salve como `credentials.json` na raiz do projeto.

## Como usar
1. Preencha a planilha Google Sheets com os links dos tweets na coluna G (a partir da linha 2).
2. Execute o bot:
   ```bash
   node index.js
   ```
3. O bot fará login no Twitter, responderá cada tweet da lista e marcará na coluna K da planilha os links processados com sucesso.

## Estrutura dos arquivos principais
- `index.js`: Script principal de execução
- `twitter-bot.js`: Funções de login e resposta automática no Twitter
- `sheet-connection.js`: Funções de integração com Google Sheets
- `credentials.json`: Credenciais da API Google (não versionar)
- `.env`: Variáveis de ambiente (não versionar)

## Dicas e observações
- O bot abre o navegador em modo visível (`headless: false`) para facilitar o acompanhamento.
- Ajuste os delays no código para evitar bloqueios por comportamento suspeito.
- Caso o Twitter altere sua interface, pode ser necessário atualizar os seletores no código.

## Possíveis melhorias
- Processamento paralelo de múltiplos tweets
- Logs detalhados e notificações em caso de erro
- Interface web para monitoramento
- Respostas personalizadas conforme o conteúdo do tweet

## Licença
Este projeto está sob a licença ISC.
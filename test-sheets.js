require('dotenv').config();
const { google } = require('googleapis');

// Função auxiliar para criar a conexão com o Google Sheets
async function getGoogleSheetsConnection() {
  console.log('Estabelecendo a conexão com o Google Sheets...');
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const sheets = google.sheets({
    version: 'v4',
    auth: client 
  });
  
  return { auth, sheets };
}

async function getLinks() {
  const { auth, sheets } = await getGoogleSheetsConnection();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID; 

  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "links_reais!G2:G", 
    });
    console.log('✅ Conexão bem-sucedida! Mostrando dados abaixo...');
    const links = [];
    if (response.data.values && response.data.values.length > 0) {
      for (const row of response.data.values) {
        if (row && row[0]) {
          links.push(row[0]);
        }
      }
    }
    
    console.log(`Encontrados ${links.length} links para processar`);
    return links;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    // Mostrar mais detalhes do erro
    if (error.response) {
      console.error('Detalhes do erro:', JSON.stringify(error.response.data, null, 2));
    }
  }
  
}

// Função para atualizar o status dos links processados com sucesso
async function updateSheetStatus(successfulLinks) {
  if (!successfulLinks || successfulLinks.length === 0) {
    console.log('Nenhum link processado com sucesso para atualizar.');
    return;
  }
  
  try {
    console.log('Atualizando status dos links processados com sucesso...');
    const { auth, sheets } = await getGoogleSheetsConnection();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    // Primeiro, obter todos os links da coluna G para encontrar os índices
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "links_reais!G2:G",
    });
    
    if (!response.data.values) {
      console.error('Não foi possível obter os links da planilha.');
      return;
    }
    
    // Criar um array de atualizações em lote
    const updates = [];
    
    // Para cada link bem-sucedido, encontrar sua posição na planilha
    for (const successLink of successfulLinks) {
      for (let i = 0; i < response.data.values.length; i++) {
        if (response.data.values[i][0] === successLink) {
          // A linha na planilha é i+2 porque começamos da linha 2 (índice 0 + 2)
          const rowIndex = i + 2;
          updates.push({
            range: `links_reais!K${rowIndex}`,
            values: [['SIM']]
          });
          break;
        }
      }
    }
    
    if (updates.length > 0) {
      // Fazer a atualização em lote
      await sheets.spreadsheets.values.batchUpdate({
        auth,
        spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: updates
        }
      });
      console.log(`✅ ${updates.length} links atualizados com sucesso na planilha.`);
    } else {
      console.log('Nenhum link correspondente encontrado para atualizar.');
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar status na planilha:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

module.exports = { getLinks, updateSheetStatus };
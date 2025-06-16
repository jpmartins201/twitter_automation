const { chromium } = require('playwright');
const { getLinks, updateSheetStatus } = require('./test-sheets');
const { loginTwitter, sendReply } = require('./twitter-bot');

(async () => {
  try {
    const links = await getLinks();
    const browser = await chromium.launch({ headless: false, slowMo: 150 });
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginTwitter(page);
    console.log('Login realizado, pronto para processar links');
    
    // Array para armazenar os links processados com sucesso
    const successfulLinks = [];
    
    for (const link of links) {
      console.log(`Processando: ${link}`);
      const success = await sendReply(context, link);
      
      if (success) {
        console.log(`✅ Sucesso ao processar: ${link}`);
        // Adicionar ao array de links bem-sucedidos
        successfulLinks.push(link);
      } else {
        console.log(`❌ Falha ao processar: ${link}`);
      }
      
      // Delay humano entre ações
      const delayTime = 20000 + Math.random() * 10000;
      console.log(`Aguardando ${Math.round(delayTime/1000)} segundos antes do próximo link...`);
      await new Promise(r => setTimeout(r, delayTime));
    }
    
    console.log(`Processamento concluído. ${successfulLinks.length} de ${links.length} links processados com sucesso.`);
    
    // Atualizar o status na planilha para os links bem-sucedidos
    await updateSheetStatus(successfulLinks);
    
    await browser.close();
    console.log('Navegador fechado. Programa finalizado.');
  } catch (error) {
    console.error('Erro durante a execução do programa:', error);
  }
})();

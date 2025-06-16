const { chromium } = require('playwright');
require('expect');
require('dotenv').config();

async function loginTwitter(page) {
  try {
    await page.goto('https://twitter.com/i/flow/login');
    
    await page.waitForSelector('input[autocomplete="username"]');
    await page.waitForTimeout(5000)
    await page.fill('input[autocomplete="username"]', process.env.TWITTER_USERNAME);
    await page.waitForTimeout(2000)
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('input[autocomplete="current-password"]');
    await page.waitForTimeout(5000)
    await page.fill('input[autocomplete="current-password"]', process.env.TWITTER_PASSWORD);
    await page.waitForTimeout(3000)
    await page.click('span:has-text("Log in")');
    await page.waitForSelector('[data-testid="AppTabBar_Home_Link"]');
    console.log('Login realizado com sucesso!');
  } catch (error) {
    console.error('Erro durante o login:', error);
  }
}

async function sendReply(context, url) {
  try {
    const page = await context.newPage();
    await page.goto(url);
    console.log('Página carregada com sucesso');
    console.log('Aguardando 3 segundos para carregamento completo da página...');
    await page.waitForTimeout(3000)
    
    try {
      console.log('Procurando pelo botão de Reply do tweet...');
      await page.waitForTimeout(5000)
      await page.click('span:has-text("Reply")');
      console.log('Clicou no botão Reply para enviar a resposta');     
      console.log('Aguardando confirmação de envio (Playwright locator)...');

      try {
        await page.getByText('Your post was sent.').waitFor({ timeout: 2000 });
        console.log('Resposta enviada com sucesso! Mensagem de confirmação recebida.');
        await page.waitForTimeout(5000);
        await page.close();
        return true;
      } catch (successError) {
        console.error('Não foi possível detectar nenhuma mensagem de confirmação.');
        await page.waitForTimeout(3000);
        await page.close();
        return false;
      }
    } catch (err) {
      console.error(`Erro ao responder tweet: ${err.message}`);
      await page.close();
      return false;
    }
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
    await page.close();
    return false;
  }
}

module.exports = { loginTwitter, sendReply };

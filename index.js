const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '7691144295:AAGtM0QKcmpW7WaxLMzSGs5YvSH7OFCzhE8';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Привітання' },
    { command: '/info', description: 'Отримати інформацію' },
    { command: '/game', description: 'Гра відгадай цифру' }
  ]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Зараз я загадаю цифру від 0 до 9, а ти спробуй їх відгадати`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Відгадуй', gameOptions);
}

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      return bot.sendMessage(chatId, `Привіт, рада знайомству!`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name || ''}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я не зовсім тебе зрозуміла, спробуй ще раз, будь ласка');
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === String(chats[chatId])) {
      await bot.sendMessage(chatId, `Вітаю, ти відгадав цифру ${chats[chatId]}`, againOptions);
    } else {
      await bot.sendMessage(chatId, `На жаль, ти не виграв, я загадала цифру ${chats[chatId]}, тому з тебе дайснон`, againOptions);
    }

    await bot.sendMessage(chatId, 'Хочеш зіграти ще раз?', againOptions);

    bot.answerCallbackQuery(msg.id);
  });
};

start();

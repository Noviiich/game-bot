const TelegramApi = require('node-telegram-bot-api')
const token = '7279369202:AAFktW3qJcN-fGmqzLaCRgOm_GCNFqJpWjI'
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, againOptions} = require('./options')
const chats = {} 

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное состояение'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://sl.combot.org/tproger_stickers/webp/13xf09f92ab.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграмм Новича`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }

    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(chats[chatId])
        if (data === '/again') {
            return startGame(chatId)
        }
    
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Неверно, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    
    })
    
}

start()
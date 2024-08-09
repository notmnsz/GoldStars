const moment = require('moment')
const math = require('math');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function enterRankup(bot) {
    if (bot.currentWindow) bot.closeWindow(bot.currentWindow)
    bot.setQuickBarSlot(4)
    bot.activateItem()

    bot.once('windowOpen', async (window) => {
        if (window.title.includes('Modos de Jogo')) {
            log(`Janela identificada: 'Modos de Jogo'`, 'grey')
            await bot.clickWindow(10, 0, 0)
        }
    })
    await sleep(3000)

    if (bot.currentWindow?.title?.includes('Modos de Jogo')) {
        console.log('Não entrou no rankup?')
        enterRankup(bot)
    }
}

async function getLocation(bot, home, cb) {

    const onMessage = async (message) => {
        if (message.includes('Teletransportado com sucesso')) {
            log(`${bot.username} chegou na home com sucesso!`, 'brightGreen')
            bot.location = 'home'
            bot.removeListener('messagestr', onMessage)
        }

        else if (message.includes('Cancelado, você moveu!')) {
            log(`${bot.username} não conseguiu chegar na home`, 'brightRed')
            bot.removeListener('messagestr', onMessage)
            await sleep(2500)
            bot.chat(`${home}`)
        }
    }

    let coords = bot.entity.position
    if (math.trunc(coords.z) === 0 && math.trunc(coords.x) === 0) {
        const block = bot.blockAt(bot.entity.position.offset(0, -1, 0))
        if (!block) return;
        if (block.name === 'polished_diorite') {
            bot.location = 'rankup'
            console.log('Lobby/Rankup identificado')
            bot.on('messagestr', onMessage)
            await sleep(500)
            log(`indo até o fullpvp`, 'grey')
            bot.chat(`/sv`)
            bot.on('windowOpen', function(window) {
                bot.clickWindow(10, 0, 0);
              });
              await sleep(1500)
              log(`Indo até a home: ${home}`, 'grey')
              bot.chat(`${home}`)
        }
        if (block.name === 'stone') {
            bot.location = 'rankup'
            console.log('Lobby/Rankup identificado')
            bot.on('messagestr', onMessage)
            await sleep(500)
            log(`indo até o fullpvp`, 'grey')
            bot.chat(`/sv`)
            bot.on('windowOpen', function(window) {
                bot.clickWindow(10, 0, 0);
              });
              await sleep(1500)
              log(`Indo até a home: ${home}`, 'grey')
              bot.chat(`${home}`)
        }
        cb()
    }
}

async function getCurrentTime() {
    return (new moment()).format("HH:mm:ss");
}

async function log(message, color) {
    let time = await getCurrentTime();
    console.log(`[${time}] ${message}`[color]);
}

async function logAccount(user, message) {
    log('[' + user + '] ' + message);
}

module.exports = {
    sleep,
    log,
    logAccount,
    getLocation,
    getCurrentTime
}
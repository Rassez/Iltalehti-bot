const Parser = require('rss-parser');
const { WebhookClient } = require('discord.js');
const Config = require('./config.json')
const parser = new Parser();
var SaveTime;

const WebClient = new WebhookClient({ id: Config.ID, token: Config.Token });

// Main function
const CheckRSS = async() => {
    parser.parseURL(Config.NewsURL).then((NewsFeed) => {
        const NewsItems = NewsFeed.items[0]
        let date = new Date().toLocaleString('fi-FI')
        if (SaveTime !== NewsItems.pubDate) {
            const Embed = {
                color: 16711680,
                title: NewsItems.title,
                url: NewsItems.link,
                author: {
                    name: NewsItems.categories[0].replace(/\b\w/g, e => e.toUpperCase()),
                    icon_url: Config.AvatarURL
                },
                description: NewsItems.content,
                Image: {
                    url: NewsItems.enclosure?.url ? NewsItems.enclosure.url : 'https://assets.ilcdn.fi/iltalehti_placeholder_some.png',
                },
                footer: {
                    text: date,
                    icon_url: Config.AvatarURL,
                },
            };
        
            WebClient.send({
                username: 'Iltalehti',
                avatarURL: Config.AvatarURL,
                embeds: [Embed],
            }).catch((e) => {
                console.log(e)
            })
            SaveTime = NewsItems.pubDate;
        }

    }).catch((e) => {
        console.log(e)
    });
}

// Installation
const Init = () => {
    CheckRSS();
    setInterval(CheckRSS, Config.RefreshTime * 60000)
}

Init();
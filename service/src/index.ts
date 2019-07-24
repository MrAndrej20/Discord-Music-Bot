// tslint:disable:no-console
import Discord from "discord.js";
import * as http from "http";
import commands from "./commands";
import { config } from "./config";
import { ResponseManager } from "./models/response-manager";

const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot is Ready");
});

client.on("message", async msg => {
    const responseManager = new ResponseManager(msg);
    try {
        switch (true) {
            case commands.spam.test(msg.content): {
                return responseManager.spam();
            }
            case commands.playUrl.test(msg.content): {
                const url = msg.content.split("play")[1].trim();
                return responseManager.playUrl(url);
            }
            case commands.playSearch.test(msg.content): {
                return responseManager.playSearch();
            }
            case commands.kopuk.test(msg.content): {
                return responseManager.kopuk();
            }
            case commands.stop.test(msg.content): {
                return responseManager.stop();
            }
            case commands.skip.test(msg.content): {
                return responseManager.skip();
            }
            case commands.loop.test(msg.content): {
                return responseManager.loop();
            }
            case commands.playlist.test(msg.content): {
                return responseManager.playlistVideos();
            }
        }
    } catch (error) {
        return msg.channel.send(error.message);
    }
});

client.login(config.discordLoginKey);

if(config.isHerokuHosted){
    http.createServer((req,res)=>res.end()).listen(process.env.PORT)
}

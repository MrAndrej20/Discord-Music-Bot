// tslint:disable:no-console
import { Message } from "discord.js";
import Emojis from "node-emoji";
import ytdl from "ytdl-core";
import { search } from "../actions/youtube";
import { config } from "../config";
import { PlaylistManager } from "./playlist-manager";

export class ResponseManager {

    private readonly playlistManager: PlaylistManager;

    constructor(
        private readonly message: Message
    ) {
        this.playlistManager = new PlaylistManager(this.message.guild.id);
    }

    async kopuk(): Promise<void> {
        await Promise.all([
            this.message.react(Emojis.random().key),
            this.sendMessage("prekini kopuk")
        ]);
    }

    async playSearch(): Promise<void> {
        const query = this.message.content.split("play")[1].trim();
        console.log(`Query to search: ${query}`);
        const url = await search(query);
        return this.playUrl(url);
    }

    async playUrl(url: string): Promise<void> {
        const voiceChannel = this.message.member.voiceChannel;
        const client = this.message.client;
        if (!voiceChannel) {
            return this.sendMessage("You need to be in a Voice Channel to play a video");
        }
        const videoMetadata = await ytdl.getInfo(url);
        const playlist = this.playlistManager.get();

        if (playlist) {
            playlist.videos.push({ title: videoMetadata.title, url });
            console.log(playlist.videos);
            await this.sendMessage(`${videoMetadata.title} - Added to playlist`);
            if (!voiceChannel.members.get(client.user.id)) {
                playlist.voiceConnection = await this.message.member.voiceChannel.join();
                return this.play();
            }
        } else {
            const vc = await this.message.member.voiceChannel.join();
            this.playlistManager.add({
                textChannel: this.message.channel,
                voiceChannel: this.message.member.voiceChannel,
                videos: [{ title: videoMetadata.title, url }],
                voiceConnection: vc,
                volume: config.defaultVolume,
                isPlaying: false
            });
            await this.sendMessage(`${videoMetadata.title} - Added to playlist`);
            return this.play();
        }
    }

    async spam() {
        if (this.message.member.voiceChannel) {
            await this.sendMessage(`Spamming channel: ${this.message.member.voiceChannel.name}`);
            const numberOfSpam = 5;
            for (let i = 0; i < numberOfSpam; i++) {
                (
                    await this.message.member.voiceChannel.join()
                ).disconnect();
            }
        }
    }

    async loop(): Promise<void> {
        const playlist = this.playlistManager.get();
        if (playlist) {
            playlist.loop = !playlist.loop;
            return playlist.loop ?
                this.sendMessage("Playlist loop ON") :
                this.sendMessage("Playlist loop OFF");
        } else {
            return this.sendMessage("There is no Playlist to loop");
        }
    }

    async stop(): Promise<void> {
        const playlist = this.playlistManager.get();
        if (playlist) {
            playlist.voiceConnection.disconnect();
            this.playlistManager.deleteVideos();
            return this.sendMessage("Stopping Playlist");
        } else {
            (await this.message.member.voiceChannel.join()).disconnect();
            return this.sendMessage("There is no Playlist to stop");
        }
    }

    async skip(): Promise<void> {
        const playlist = this.playlistManager.get();
        if (playlist) {
            await this.sendMessage("Skipping video");
            playlist.voiceConnection.dispatcher.end();
        } else {
            return this.sendMessage("There is no Playlist for you to skip videos");
        }
    }

    private async play(): Promise<void> {
        const playlist = this.playlistManager.get();
        if (playlist) {
            const video = playlist.videos[0];
            // if no video is present, it means that the array is empty
            // also this helps with types
            if (!video) {
                playlist.voiceConnection.disconnect();
                this.playlistManager.deleteVideos();
                return this.sendMessage("Playlist is empty");
            }
            console.log(playlist.videos);
            await this.sendMessage(`Now playing - ${video.title}`);
            playlist.voiceConnection.playStream(ytdl(video.url), {
                volume: playlist.volume
            })
                .on("end", () => {
                    // if look is disabled, remove the video from the array
                    if (!playlist.loop) {
                        playlist.videos.shift();
                    }
                    return this.play();
                });
        } else {
            console.error("NO playlist IN PLAY");
        }
    }

    playlistVideos(): Promise<void> {
        const playlist = this.playlistManager.get();
        if (!playlist) {
            throw new Error("There is no playlist");
        }
        const message = `Playlist:\n${playlist.videos.map((v, index) => `${index + 1}. ${v.title}`).join("\n")}`;
        return this.sendMessage(message);
    }

    private async sendMessage(message: string): Promise<void> {
        console.log(message);
        await this.message.channel.send(message);
    }
}

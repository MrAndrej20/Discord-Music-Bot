import Discord from "discord.js";

export interface Playlist {
    textChannel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel;
    voiceChannel: Discord.VoiceChannel;
    voiceConnection: Discord.VoiceConnection;
    videos: Video[];
    loop?: boolean;
    volume: number;
    isPlaying: boolean;
}

export interface Video {
    url: string;
    title: string;
}

export class PlaylistManager {
    private static readonly queue: Map<string, Playlist> = new Map();

    constructor(
        private readonly guildId: string
    ) { }

    add(input: Playlist): void {
        PlaylistManager.queue.set(this.guildId, input);
    }

    get(): Playlist | undefined {
        const queue = PlaylistManager.queue.get(this.guildId);
        return queue;
    }

    delete(): void {
        PlaylistManager.queue.delete(this.guildId);
    }

    deleteVideos(): void {
        const queue = this.get()!;
        queue.videos = [];
    }
}

// tslint:disable:no-console
import { google, youtube_v3 } from "googleapis";
import { config } from "../config";

const yt = google.youtube("v3");
export async function search(query: string) {
    const params: youtube_v3.Params$Resource$Search$List = {
        auth: config.youtubeAuthKey,
        part: "id",
        q: query,
        maxResults: 1
    };
    const sr = await yt.search.list(params);
    return `https://www.youtube.com/watch?v=${sr.data.items![0].id!.videoId}`;
}

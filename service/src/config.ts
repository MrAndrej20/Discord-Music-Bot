const {
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted,
    defaultVolume
} = process.env;

export const config = {
    defaultVolume:parseInt(defaultVolume!),
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted
};

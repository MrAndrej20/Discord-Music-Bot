const {
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted
} = process.env;

export const config = {
    defaultVolume: 0.5,
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted
};

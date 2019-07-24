const {
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted
} = process.env;

export const config = {
    defaultVolume: 1,
    youtubeAuthKey,
    discordLoginKey,
    suffix,
    isHerokuHosted
};

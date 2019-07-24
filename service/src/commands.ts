import { config } from "./config";

export const suffix = config.suffix;

function generateRegExp(...values: string[]) {
    const regexr = `^\\${suffix}${values.join(" +")}$`;
    return new RegExp(regexr);
}

export default {
    spam: generateRegExp("spam"),
    playUrl: generateRegExp(
        "play",
        "(https?:\\/\\/)?([\\w\\-])+\\.{1}([a-zA-Z]{2,63})([\\/\\w-]*)*\\/?\\??([^#\\n\\r]*)?#?([^\\n\\r]*)"
    ),
    playSearch: generateRegExp(
        "play",
        "([A-Z]|[a-z]|[0-9]| )+"
    ),
    kopuk: generateRegExp("kopuk"),
    stop: generateRegExp(
        "stop"
    ),
    skip: generateRegExp(
        "skip"
    ),
    loop: generateRegExp(
        "loop"
    ),
    playlist: generateRegExp(
        "playlist"
    )
};

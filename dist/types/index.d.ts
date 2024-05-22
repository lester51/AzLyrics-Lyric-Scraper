export function getLyrics(url: any): Promise<{
    title: string;
    lyrics: string;
    lyricsList?: undefined;
} | {
    title: string;
    lyricsList: string;
    lyrics?: undefined;
}>;
export function searchSong(q: any): Promise<any>;

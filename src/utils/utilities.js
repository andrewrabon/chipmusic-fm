export class Utilities {
  static getTrueSongName(songTitle, songArtist) {
    if (songTitle) {
      return songTitle.slice(songArtist.length + 3);
    }
    return songTitle;
  }
}

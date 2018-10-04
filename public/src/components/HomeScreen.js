import { SongCard } from './SongCard.js';
import './MusicPlayer.js';

export class HomeScreen extends HTMLElement {
  constructor() {
    super();
    this.currentSong = null;
    this.playerCanPlay = false;
    this.songHistory = [];

  }
  connectedCallback() {
    this.innerHTML = `
      <div class="home-screen__song-container"></div>
      <music-player />
    `;

    this.goToNextSong();
  }

  async goToNextSong() {
    const song = {
      link:'https://google.com',
      title: 'Speedcore... (LSDJ Speedcore)',
      artist: 'A Versus B',
      listenCount: 0,
      likeCount: 0,
    };
    this.currentSong = new SongCard({
      href: song.link,
      songTitle: song.title,
      songArtist: song.artist,
      playCount: song.listenCount,
      likeCount: song.likeCount,
    });
    const container = this.querySelector('.home-screen__song-container');
    container.innerHTML = '';
    container.appendChild(this.currentSong);
  }
}

window.customElements.define('home-screen', HomeScreen);

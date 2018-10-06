import { SongCard } from './SongCard.js';
import './MusicPlayer.js';
import { MusicPlayer } from './MusicPlayer.js';
import { resolve } from 'path';

export class HomeScreen extends HTMLElement {
  constructor() {
    super();
    this.songCard = null;
    this.playerCanPlay = false;
    this.songHistory = [];
    this.isTransitioning = false;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="home-screen__song-container"></div>
    `;

    const musicPlayer = new MusicPlayer();
    musicPlayer.addEventListener('previous', (event) => this.goToPreviousSong(event.detail.song));
    musicPlayer.addEventListener('next', (event) => this.goToNextSong(event.detail.song));
    this.appendChild(musicPlayer);

    musicPlayer.playNext();
  }

  buildSongCard(song, isPreviousSong) {
    const onResolved = () => {
      this.songCard = new SongCard({
        href: song.link,
        songTitle: song.title,
        songArtist: song.artist,
        listenCount: song.listenCount,
        likeCount: song.likeCount,
      });
      this.querySelector('.home-screen__song-container').appendChild(this.songCard);
    };

    return new Promise((resolve) => {
      const previousSongCard = this.querySelector('.song-card');
      if (previousSongCard) {
        const transformValue = isPreviousSong ? '100vw' : '-100vw';
        previousSongCard.style.transform = `translate(${transformValue})`;

        // Make up for the animation time.
        setTimeout(() => {
          previousSongCard.parentElement.remove();
          onResolved();
          resolve();
        }, 300);
      } else {
        onResolved();
        resolve();
      }
    });
  }

  async goToPreviousSong(song) {
    await this.buildSongCard(song, true);
    this.songCard.enterFromLeft();
  }

  async goToNextSong(song) {
    await this.buildSongCard(song);
    this.songCard.enterFromRight();
  }
}

window.customElements.define('home-screen', HomeScreen);

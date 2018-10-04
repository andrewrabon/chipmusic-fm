import { Navigator } from './Navigator.js';

export class SongCard extends HTMLElement {
  constructor(params) {
    super(params);

    this.href = params.href;
    this.songTitle = params.songTitle;
    this.songArtist = params.songArtist;
    this.playCount = params.playCount;
    this.likeCount = params.likeCount;
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .song-card {
          position: absolute;
          top: calc(50vh - 167px);
          right: 1rem;
          left: 1rem;
          display: block;
          height: 300px;
          background-size: cover;
          border-radius: 5px;
          box-shadow: 0px 1px 5px #aaa;
        }
        .song-card__bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0 0 5px 5px;
        }
        .song-card__bottom h1,
        .song-card__bottom h2,
        .song-card__bottom h3 {
          margin: 1rem;
          border: 0;
          background: transparent;
          text-align: center;
        }
        .song-card__bottom h2,
        .song-card__bottom h3 {
          padding: 0;
        }
        .song-card__bottom h1 {
          margin-top: 1.5rem;
        }
        @media screen and (min-width: 600px) {
          .song-card {
            top: calc(50vh - 179px);
            width: 500px;
            margin: 0 auto;
          }
        }
      </style>
      <a href=${this.href} class="song-card">
        <div class="song-card__bottom">
          <h1>${this.songTitle}</h1>
          <h3>by ${this.songArtist} &middot; ${this.playCount} plays &middot; ${this.likeCount} likes</h3>
        </div>
      </a>
    `;

    this.getGif();
  }

  async getGif() {
    const API_KEY = 't0Op5B0QkoHsaGndTQdmx5blXoWBscSm';
    const GIPHY_URL = `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=pixel art`;
    const response = await fetch(GIPHY_URL);
    const gifs = await response.json();
    const container = this.querySelector('.song-card');
    container.style.backgroundImage = `url('${gifs.data.image_url}')`;
  }
}

window.customElements.define('song-card', SongCard);

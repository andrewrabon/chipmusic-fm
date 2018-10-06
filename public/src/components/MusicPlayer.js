export class MusicPlayer extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <style>
        .music-controls {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          background: black;
          color: white;
          box-shadow: 0px 1px 5px #aaa;
        }
        .music-controls__buttons {
          display: flex;
        }
        .music-controls__seek-bar {
          -webkit-appearance: none;
          -moz-apperance: none;
          display: block;
          width: calc(100% - 1rem);
          height: 2rem;
          margin: 0.5rem auto 0;
          background: transparent;
          border-radius: 5px 5px 0 0;
          cursor: col-resize;
        }
        .music-controls__seek-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          background-color: white;
          width: 5px;
          height: 1.5em;
          border-radius: 5px;
        }
        .music-controls__seek-bar::-moz-range-thumb {
          background-color: white;
          width: 10px;
          height: 2em;
          border-radius: 0;
          border: 0;
        }
        .music-controls__seek-bar::-moz-range-track {
          display: none;
          background-color: transparent;
        }
        .music-controls__button {
          flex: 1;
          padding: 1rem;
          background: transparent;
          color: white;
        }
        @media screen and (min-width: 600px) {
          .music-controls {
            width: 500px;
            height: 100px;
            margin: 1rem auto;
            border-radius: 5px;
          }
        }
      </style>
      <div class="music-controls">
        <input class="music-controls__seek-bar" type="range">
        <div class="music-controls__buttons">
          <button class="music-controls__button">
            <i class="material-icons">cloud_download</i>
          </button>
          <button class="music-controls__previous music-controls__button">
            <i class="material-icons">skip_previous</i>
          </button>
          <button class="music-controls__button">
            <i class="material-icons">play_circle_filled</i>
          </button>
          <button class="music-controls__next music-controls__button">
            <i class="material-icons">skip_next</i>
          </button>
          <button class="music-controls__button">
            <i class="material-icons">favorite_border</i>
          </button>
        </div>
      </div>
    `;

    this.querySelector('.music-controls__previous').addEventListener('click', () => this.playPrevious());
    this.querySelector('.music-controls__next').addEventListener('click', () => this.playNext());
  }

  getSong() {
    return {
      link:'https://google.com',
      title: 'Speedcore... (LSDJ Speedcore)',
      artist: 'A Versus B',
      listenCount: Math.floor(Math.random() * Math.floor(1000)),
      likeCount: 0,
    };
  }

  playNext() {
    const nextEvent = new CustomEvent('next', { detail: { song: this.getSong() } });
    this.dispatchEvent(nextEvent);
  }

  playPrevious() {
    const nextEvent = new CustomEvent('previous', { detail: { song: this.getSong() } });
    this.dispatchEvent(nextEvent);
  }
}

window.customElements.define('music-player', MusicPlayer);

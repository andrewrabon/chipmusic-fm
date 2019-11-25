import React from 'react';

export const AboutFragment = () => (
  <>
    <h1>About ChipMusic.fm</h1>
    <p>TBD.</p>

    <h1>Disclosures and policies</h1>
    <p>
      This app uses
      {' '}
      <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">Google Firebase</a>
      {' '}
      for authentication, data, hosting and analytics. Email addresses are only used for login
      purposes and will never be shared with a third-party. If you&apos;re in the European Union,
      you should be aware this site uses cookies. 🍪
    </p>
    <p>
      <a href="https://gist.github.com/andrewrabon/c02a6969fabb6772044c77e3f34c99cb" target="_blank" rel="noopener noreferrer">You can view the full ChipMusic.fm privacy policy here.</a>
    </p>

    <h1>Licenses and copyright</h1>
    <p>
      The source code behind ChipMusic.fm is licensed under the
      {' '}
      <a
        href="https://github.com/andrewrabon/chipmusic-fm/blob/master/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
      >
        Mozilla Public License, version 2.0
      </a>
      . ChipMusic.fm itself is &copy;2017-2019 Andrew Rabon.
    </p>
    <p>Songs played on ChipMusic.fm have been generously made available under Creative Commons.</p>
  </>
);

## About

ChipMusic.fm is a shuffle-only music player for the 8000+ free chiptunes available on ChipMusic.org,

## Contributing

In the future, a `.env.development` file will be checked in and ready to use with a
publicly-writable "test" database. Until then you will need to request access to the ChipMusic.fm
database in Firebase [from me](mailto:andrewrabon@gmail.com).

### Installation

```
yarn install
```

Once you have your .env files setup, the above command will install all the dependencies including
Gatsby, Firebase, and any plugins needed.

### Development

```
gatsby develop -o
```

This will invoke Gatsby's SSR and run the local Firebase instance for development, then open a tab
pointing to `localhost:8000`.

## License and Copyright

[ChipMusic.fm is licensed under the Mozilla Public License, version 2.0.](https://github.com/andrewrabon/chipmusic-fm/blob/master/LICENSE) ChipMusic.fm itself is © 2017-2019 Andrew Rabon.

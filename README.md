<p align="center">
  <img src="./pages/img/iam-mml-logo.svg" alt="Logo" height=120></a>
</p>

<h1 align="center">IAM.mml</h1>

<p align="center">
  <img src="https://github.com/Tengu712/iam-mml/actions/workflows/publish.yaml/badge.svg" alt="Deployment">
  <img height=20 src="https://img.shields.io/badge/license-CC0_1.0-blue">
</p>

## What is this?

AM/FM Synthesizer for Generating and Playing WAV from MML.

## Build

### CLI

1. Install [Rust](https://www.rust-lang.org/).
2. Run `cargo build --release`.
3. Then `target/release/iamc` is generated.

### Web

1. Install [Rust](https://www.rust-lang.org/).
2. Install [npm](https://www.npmjs.com/) or something that's compatible with npm.
3. Run `npm run build`.
4. Then `pages/pkg/` is generated.
5. Host a local web server with `pages` as the root directory.

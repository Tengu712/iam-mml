mod engine;

use std::{env, fs};

fn run() -> Result<(), String> {
    let args = env::args().collect::<Vec<String>>();
    if args.len() < 2 {
        return Err(String::from(
            "usage: iamc <mml file path> [output file path]",
        ));
    }

    let src_path = args.get(1).map(|n| n.as_str()).unwrap();
    let out_path = args.get(2).map(|n| n.as_str()).unwrap_or("audio.wav");

    let src = fs::read_to_string(src_path).map_err(|e| e.to_string())?;

    engine::generate_file(out_path, engine::run(src.as_str())?).map_err(|e| e.to_string())
}

fn main() {
    match run() {
        Ok(()) => (),
        Err(e) => {
            eprintln!("{e}");
            std::process::exit(1);
        }
    }
}

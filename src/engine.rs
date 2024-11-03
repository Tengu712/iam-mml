mod evaluator;
mod note;
mod parser;

pub fn run(src: &str) -> Result<Vec<f32>, String> {
    Ok(evaluator::evaluate(parser::parse(src)?))
}

pub fn generate(name: &str, wave: Vec<f32>) -> Result<(), Box<dyn std::error::Error>> {
    use std::{
        fs::File,
        io::{BufWriter, Write},
    };

    const RIFF: [u8; 4] = ['R' as u8, 'I' as u8, 'F' as u8, 'F' as u8];
    const WAVE: [u8; 4] = ['W' as u8, 'A' as u8, 'V' as u8, 'E' as u8];
    const FMT: [u8; 4] = ['f' as u8, 'm' as u8, 't' as u8, ' ' as u8];
    const DATA: [u8; 4] = ['d' as u8, 'a' as u8, 't' as u8, 'a' as u8];
    const BYTES_COUNT_PER_SAMPLE: u32 = 2;

    let file = File::create(name)?;
    let mut writer = BufWriter::new(file);

    let length = wave.len() as u32;

    // RIFF identifier
    writer.write_all(&RIFF)?;
    // chunk size
    writer.write_all(&(32 + length * BYTES_COUNT_PER_SAMPLE).to_le_bytes())?;

    // WAVE format
    writer.write_all(&WAVE)?;

    // fmt identifier
    writer.write_all(&FMT)?;
    // fmt chunk size
    writer.write_all(&16u32.to_le_bytes())?;

    // linear PCM format
    writer.write_all(&1u16.to_le_bytes())?;
    // monaural
    writer.write_all(&1u16.to_le_bytes())?;
    // sample rate
    writer.write_all(&(evaluator::SAMPLE_RATE as u32).to_le_bytes())?;
    // bytes count per a second
    writer.write_all(&((evaluator::SAMPLE_RATE as u32) * BYTES_COUNT_PER_SAMPLE).to_le_bytes())?;
    // bytes count per a sample
    writer.write_all(&(BYTES_COUNT_PER_SAMPLE as u16).to_le_bytes())?;
    // bits count per a sample
    writer.write_all(&(BYTES_COUNT_PER_SAMPLE as u16 * 8).to_le_bytes())?;

    // data identifier
    writer.write_all(&DATA)?;
    // data chunk size
    writer.write_all(&(length * BYTES_COUNT_PER_SAMPLE).to_le_bytes())?;
    // write all samples
    for n in wave {
        let n = if n < -1.0 {
            -1.0
        } else if n > 1.0 {
            1.0
        } else {
            n
        };
        let n = (n * 32767.5_f32).round() as i16;
        writer.write_all(&n.to_le_bytes())?;
    }

    // finish
    writer.flush()?;
    Ok(())
}

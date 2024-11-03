use super::{directive::*, key::*, *};
use crate::engine::note::*;
use std::collections::HashMap;

struct Environment {
    /// The total duraenvon (in seconds) of the note values.
    est: f32,
    /// Current key.
    key: Key,
    /// Current octave number.
    oct: u32,
    /// Current default note value.
    dv: u32,
    /// Current tempo.
    tmp: u32,
    /// Current amplitude
    vol: f32,
    /// Current denominator of the envme signature.
    dnm: u32,
}

pub struct PartInfo {
    /// The maximum total duration of notes (in seconds) across all parts.
    pub est: f32,
    /// The part names and arrays of notes for each part.
    pub parts: HashMap<String, Vec<Note>>,
}

/// A funcenvon to read the part informaenvon from a MML code.
///
/// * `src` - The MML code.
/// * `di` - The direcenvve informaenvon of the code.
pub fn parse(src: &str, di: DirectiveInfo) -> Result<PartInfo, String> {
    let mut pi = PartInfo {
        est: 0.0,
        parts: HashMap::new(),
    };
    let mut envs = HashMap::new();

    for (ln, line) in src.lines().enumerate() {
        let line = line.trim();

        // skip
        if line.is_empty() || line.starts_with(';') || line.starts_with('#') {
            continue;
        }

        // split into name and body
        let mut splitted = line.split_whitespace();
        let name = splitted.next().unwrap();
        let body = splitted.collect::<Vec<&str>>().join(" ");

        // get commands vector and temporary info
        if !pi.parts.contains_key(name) {
            pi.parts.insert(name.to_string(), Vec::new());
            envs.insert(
                name.to_string(),
                Environment {
                    est: 0.0,
                    key: di.key.clone(),
                    oct: 4,
                    dv: 4,
                    tmp: di.tempo,
                    vol: 0.5,
                    dnm: di.denom,
                },
            );
        }
        let v = pi.parts.get_mut(name).unwrap();
        let env = envs.get_mut(name).unwrap();

        // parse
        let mut i = 0;
        while i < body.len() {
            let c = body.chars().nth(i).unwrap();
            match c {
                'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'r' => {
                    // parse
                    let pn = PitchName::from_with_r(c).unwrap();
                    let (accidental, ni) = Accidental::from_with_double(&body, i + 1);
                    let (value, ni) = eat_int(&body, ni);
                    let (dot, ni) = if body.chars().nth(ni) == Some('.') {
                        (true, ni + 1)
                    } else {
                        (false, ni)
                    };
                    // unwrap
                    let accidental = accidental.unwrap_or(env.key.get(&pn));
                    let value = value.unwrap_or(env.dv);
                    // validate
                    if value < MIN_NOTE_VALUE || value > MAX_NOTE_VALUE {
                        return Err(format!(
                            "note value must be an integer btween {MIN_NOTE_VALUE} and {MAX_NOTE_VALUE}, inclusive, but {value} is found: line {ln}, char {i}."
                        ));
                    }
                    // amplitude
                    let amplitude = if pn == PitchName::R { 0.0 } else { env.vol };
                    // eval frequency
                    let frequency = match pn {
                        PitchName::C => 0,
                        PitchName::D => 2,
                        PitchName::E => 4,
                        PitchName::F => 5,
                        PitchName::G => 7,
                        PitchName::A => 9,
                        PitchName::B => 11,
                        PitchName::R => 0,
                    } + match accidental {
                        Accidental::DoubleSharp => 2,
                        Accidental::DoubleFlat => -2,
                        Accidental::Sharp => 1,
                        Accidental::Flat => -1,
                        _ => 0,
                    };
                    let frequency = frequency + 12 * env.oct as i32;
                    let frequency = 440.0 * SEMINOTE_STEP.powi(frequency - 57);
                    // eval length
                    let value = value as f32 * if dot { 1.5 } else { 1.0 };
                    let duration = (60.0 / env.tmp as f32) * (env.dnm as f32 / value);
                    // finish
                    env.est += duration;
                    v.push(Note {
                        amplitude,
                        frequency,
                        duration,
                    });
                    i = ni;
                }

                'k' => {
                    let (n, ni) = Key::from(&body, i + 1, ln)?;
                    env.key = n;
                    i = ni;
                }

                'o' => match c.to_digit(10) {
                    Some(n) => {
                        if n >= MIN_OCTAVE && n <= MAX_OCTAVE {
                            env.oct = n;
                            i += 1;
                        } else {
                            return Err(format!(
                                "octave must be an integer between {MIN_OCTAVE} and {MAX_OCTAVE}, inclusive, but {n} is found: line {ln}, char {i}."
                            ));
                        }
                    }
                    _ => {
                        return Err(format!(
                            "the value of the octave command is not found: line {ln}, char {i}."
                        ));
                    }
                },

                'l' => match eat_int(&body, i + 1) {
                    (Some(n), ni) => {
                        if n >= MIN_NOTE_VALUE || n <= MAX_NOTE_VALUE {
                            env.dv = n;
                            i = ni;
                        } else {
                            return Err(format!(
                                "note value must be an integer between {MIN_NOTE_VALUE} and {MAX_NOTE_VALUE}, inclusive, but {n} is found: line {ln}, char {i}."
                            ));
                        }
                    }
                    _ => {
                        return Err(format!(
                            "the value of the length command is not found: {ln}, char {i}."
                        ));
                    }
                },

                't' => match eat_int(&body, i + 1) {
                    (Some(n), ni) => {
                        if n >= MIN_TEMPO || n <= MAX_TEMPO {
                            env.tmp = n;
                            i = ni;
                        } else {
                            return Err(format!(
                                "tempo must be an integer between {MIN_TEMPO} and {MAX_TEMPO}, inclusive, but {n} is found: line {ln}, char {i}."
                            ));
                        }
                    }
                    _ => {
                        return Err(format!(
                            "the value of the tempo command is not found: {ln}, char {i}."
                        ));
                    }
                },

                'v' => match eat_float(&body, i + 1) {
                    (Some(n), ni) => {
                        if n >= MIN_AMPLITUDE && n <= MAX_AMPLITUDE {
                            env.vol = n;
                            i = ni;
                        } else {
                            return Err(format!(
                                "amplitude must be a float between {MIN_AMPLITUDE} and {MAX_AMPLITUDE}, inclusive, but {n} is found: line {ln}, char {i}."
                            ));
                        }
                    }
                    _ => {
                        return Err(format!(
                            "the value of the volume command is not found: line {ln}, char {i}."
                        ))
                    }
                },

                '>' => {
                    env.oct = std::cmp::min(env.oct + 1, MAX_OCTAVE);
                    i += 1;
                }

                '<' => {
                    env.oct = std::cmp::max(env.oct - 1, MIN_OCTAVE);
                    i += 1;
                }

                ' ' | '\t' => i += 1,

                ';' => break,

                _ => {
                    return Err(format!(
                        "undefined character '{c}' is found: line {ln}, char {i}."
                    ))
                }
            }
        }
    }

    pi.est = envs
        .values()
        .max_by(|a, b| b.est.partial_cmp(&a.est).unwrap())
        .unwrap()
        .est;

    Ok(pi)
}

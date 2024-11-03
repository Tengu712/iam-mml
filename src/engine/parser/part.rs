use super::{directive::*, key::*, *};
use crate::engine::note::*;

pub struct Environment {
    /// The total duraenvon (in seconds) of the note values.
    pub est: f32,
    /// Current key.
    pub key: Key,
    /// Current octave number.
    pub oct: u32,
    /// Current default note value.
    pub dv: u32,
    /// Current tempo.
    pub tmp: u32,
    /// Current amplitude
    pub vol: f32,
    /// Current denominator of the envme signature.
    pub dnm: u32,
    /// Current instrument index.
    pub inst: usize,
}

impl Environment {
    pub fn new(di: &DirectiveInfo) -> Self {
        Self {
            est: 0.0,
            key: di.key.clone(),
            oct: 4,
            dv: 4,
            tmp: di.tempo,
            vol: 0.5,
            dnm: di.denom,
            inst: 0,
        }
    }
}

pub fn parse(
    body: &str,
    vec: &mut Vec<Note>,
    env: &mut Environment,
    inst_idx_map: &HashMap<String, usize>,
    ln: usize,
    cn: usize,
) -> Result<(), String> {
    let mut i = 0;
    while i < body.len() {
        let cn = cn + i;
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
                        "note value must be an integer btween {MIN_NOTE_VALUE} and {MAX_NOTE_VALUE}, inclusive, but {value} is found: line {ln}, char {cn}."
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
                vec.push(Note {
                    amplitude,
                    frequency,
                    duration,
                    instrument: env.inst,
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
                            "octave must be an integer between {MIN_OCTAVE} and {MAX_OCTAVE}, inclusive, but {n} is found: line {ln}, char {cn}."
                        ));
                    }
                }
                _ => {
                    return Err(format!(
                        "the value of the octave command is not found: line {ln}, char {cn}."
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
                            "note value must be an integer between {MIN_NOTE_VALUE} and {MAX_NOTE_VALUE}, inclusive, but {n} is found: line {ln}, char {cn}."
                        ));
                    }
                }
                _ => {
                    return Err(format!(
                        "the value of the length command is not found: {ln}, char {cn}."
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
                            "tempo must be an integer between {MIN_TEMPO} and {MAX_TEMPO}, inclusive, but {n} is found: line {ln}, char {cn}."
                        ));
                    }
                }
                _ => {
                    return Err(format!(
                        "the value of the tempo command is not found: {ln}, char {cn}."
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
                            "amplitude must be a float between {MIN_AMPLITUDE} and {MAX_AMPLITUDE}, inclusive, but {n} is found: line {ln}, char {cn}."
                        ));
                    }
                }
                _ => {
                    return Err(format!(
                        "the value of the volume command is not found: line {ln}, char {cn}."
                    ))
                }
            },

            '@' => match eat_to_whitespace(&body, i) {
                (Some(n), ni) => {
                    if let Some(n) = inst_idx_map.get(&n) {
                        env.inst = *n;
                        i = ni;
                    } else {
                        return Err(format!(
                            "undefined instrument is using: line {ln}, char {cn}."
                        ));
                    }
                }
                _ => panic!("unexpected error"),
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
                    "undefined character '{c}' is found: line {ln}, char {cn}."
                ))
            }
        }
    }

    Ok(())
}

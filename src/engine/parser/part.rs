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

/// A function to parse the body of a part line, change the environment and push notes.
///
/// * `body` - the body of a part line.
/// * `vec` - the notes vector of the part.
/// * `env` - the environment of the part.
/// * `inst_idx_map` - the map: instrument name -> the index of the instrument in the instrument vector.
/// * `ln_d` - the line number for an error message.
/// * `cn_d` - the char number for an error message.
pub fn parse(
    body: &str,
    vec: &mut Vec<Note>,
    env: &mut Environment,
    inst_idx_map: &HashMap<String, usize>,
    ln_d: usize,
    cn_d: usize,
) -> Result<(), String> {
    let mut i = 0;
    while i < body.len() {
        let cn_d = cn_d + i;
        let c = body.chars().nth(i).unwrap();
        match c {
            ';' => break,
            ' ' | '\t' => i += 1,

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
                if value < MIN_VALUE || value > MAX_VALUE {
                    return Err(format!(
                        "note value must be an integer btween {MIN_VALUE} and {MAX_VALUE}, inclusive, but {value} is found: line {ln_d}, char {cn_d}."
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
                let duration = (60.0 / env.tmp as f32) * (env.dnm as f32 / value as f32);
                let duration = if dot { duration * 1.5 } else { duration };
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

            '>' => {
                env.oct = std::cmp::min(env.oct + 1, MAX_OCTAVE);
                i += 1;
            }
            '<' => {
                env.oct = std::cmp::max(env.oct - 1, MIN_OCTAVE);
                i += 1;
            }

            'o' => {
                (env.oct, i) =
                    int_command(&body, i + 1, ln_d, cn_d, "octave", MIN_OCTAVE, MAX_OCTAVE)?
            }
            'l' => {
                (env.dv, i) =
                    int_command(&body, i + 1, ln_d, cn_d, "note value", MIN_VALUE, MAX_VALUE)?
            }
            't' => {
                (env.tmp, i) = int_command(&body, i + 1, ln_d, cn_d, "tempo", MIN_TEMPO, MAX_TEMPO)?
            }
            'v' => {
                (env.vol, i) = float_command(
                    &body,
                    i + 1,
                    ln_d,
                    cn_d,
                    "amplitude",
                    MIN_AMPLITUDE,
                    MAX_AMPLITUDE,
                )?
            }

            'k' => {
                let (n, ni) = Key::from(&body, i + 1, ln_d)?;
                env.key = n;
                i = ni;
            }

            '@' => match eat_to_whitespace(&body, i) {
                (Some(n), ni) => {
                    if let Some(n) = inst_idx_map.get(&n) {
                        env.inst = *n;
                        i = ni;
                    } else {
                        return Err(format!(
                            "undefined instrument is using: line {ln_d}, char {cn_d}."
                        ));
                    }
                }
                _ => panic!("unexpected error"),
            },

            _ => {
                return Err(format!(
                    "undefined character '{c}' is found: line {ln_d}, char {cn_d}."
                ))
            }
        }
    }

    Ok(())
}

fn int_command<T>(
    body: &str,
    i: usize,
    ln_d: usize,
    cn_d: usize,
    name: &str,
    min: T,
    max: T,
) -> Result<(T, usize), String>
where
    T: std::str::FromStr + std::fmt::Display + std::cmp::PartialOrd,
{
    if let (Some(n), ni) = eat_int::<T>(&body, i) {
        if n < min || n > max {
            Err(format!(
                "{name} must be an integer between {min} and {max}, inclusive, but {n} is found: line {ln_d}, char {cn_d}."
            ))
        } else {
            Ok((n, ni))
        }
    } else {
        Err(format!(
            "the value of the {name} command is not found: line {ln_d}, char {cn_d}."
        ))
    }
}

fn float_command<T>(
    body: &str,
    i: usize,
    ln_d: usize,
    cn_d: usize,
    name: &str,
    min: T,
    max: T,
) -> Result<(T, usize), String>
where
    T: std::str::FromStr + std::fmt::Display + std::cmp::PartialOrd,
{
    if let (Some(n), ni) = eat_float::<T>(&body, i) {
        if n < min || n > max {
            Err(format!(
                "{name} must be a float between {min} and {max}, inclusive, but {n} is found: line {ln_d}, char {cn_d}."
            ))
        } else {
            Ok((n, ni))
        }
    } else {
        Err(format!(
            "the value of the {name} command is not found: line {ln_d}, char {cn_d}."
        ))
    }
}
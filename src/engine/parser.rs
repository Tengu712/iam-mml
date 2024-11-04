mod directive;
mod instrument;
mod key;
mod part;

use crate::engine::{instrument::Instrument, note::Note};
use std::collections::HashMap;

pub struct ParsedInfo {
    pub est: f32,
    pub insts: Vec<Instrument>,
    pub parts: HashMap<String, Vec<Note>>,
}

pub fn parse(src: &str) -> Result<ParsedInfo, String> {
    let mut di = directive::DirectiveInfo::default();
    let mut macros = HashMap::new();
    let mut insts = Vec::new();
    let mut inst_idx_map = HashMap::new();
    let mut parts = HashMap::new();
    let mut envs = HashMap::new();

    let (inst, _) = instrument::parse(&Vec::from(["1 1 0 0 1 0"]), 0)?;
    insts.push(inst);

    let lines = src.lines().collect::<Vec<&str>>();
    let mut ln = 0;
    while ln < lines.len() {
        let line = lines[ln];
        let ln_d = ln + 1;

        // skip whiteline and comment line
        if line.is_empty() || line.starts_with(';') {
            ln += 1;
            continue;
        }

        // instrument line
        if line.starts_with('@') {
            // get name
            let name = line;
            if inst_idx_map.contains_key(name) {
                return Err(format!(
                    "instrument '{name}' is already defined: line {ln_d}."
                ));
            }
            ln += 1;
            // parse
            let (inst, nln) = instrument::parse(&lines, ln)?;
            // finish
            inst_idx_map.insert(name.to_string(), insts.len());
            insts.push(inst);
            ln = nln;
            continue;
        }

        // directive line
        if line.starts_with('#') {
            di.apply(&line, ln_d)?;
            ln += 1;
            continue;
        }

        // macro line
        if line.starts_with('!') {
            let splitted = line.split_whitespace().collect::<Vec<&str>>();
            if splitted.len() < 2 {
                return  Err(format!(
                    "the content of the macro is empty: line {ln_d}."
                ));
            }
            let cn_d = line.find(splitted[1]).unwrap() + 1;
            let name = splitted[0];
            let body = splitted[1..].join(" ");
            if macros.contains_key(name) {
                return Err(format!(
                    "the macro '{name}' has been already defined: line {ln_d}."
                ));
            }
            macros.insert(name.to_string(), (body, ln_d, cn_d));
            ln += 1;
            continue;
        }

        // part line
        let splitted = line.split_whitespace().collect::<Vec<&str>>();
        if splitted.len() < 2 {
            ln += 1;
            continue;
        }
        let cn_d = line.find(splitted[1]).unwrap() + 1;
        let name = splitted[0];
        let body = splitted[1..].join(" ");
        if !parts.contains_key(name) {
            parts.insert(name.to_string(), Vec::new());
            envs.insert(name.to_string(), part::Environment::new(&di));
        }
        let vec = parts.get_mut(name).unwrap();
        let env = envs.get_mut(name).unwrap();
        part::parse(&body, vec, env, &macros, &inst_idx_map, ln_d, cn_d)?;
        ln += 1;
    }

    for (name, env) in envs.iter() {
        if env.stack.is_empty() {
            continue;
        }
        return Err(format!("the loop for the part '{name}' is not finished."));
    }

    let est = envs
        .values()
        .max_by(|a, b| b.est.partial_cmp(&a.est).unwrap())
        .unwrap()
        .est;

    Ok(ParsedInfo { est, insts, parts })
}

// 2^(1/12)
pub const SEMINOTE_STEP: f32 = 1.0594630943592952645618253;
pub const MIN_DENOM: u32 = 1;
pub const MAX_DENOM: u32 = 128;
pub const MIN_VALUE: u32 = 1;
pub const MAX_VALUE: u32 = 128;
pub const MIN_OCTAVE: u32 = 1;
pub const MAX_OCTAVE: u32 = 8;
pub const MIN_TEMPO: u32 = 1;
pub const MAX_TEMPO: u32 = 1000;
pub const MIN_AMPLITUDE: f32 = 0.0;
pub const MAX_AMPLITUDE: f32 = 1.0;

#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash)]
pub enum PitchName {
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    R,
}
impl PitchName {
    pub fn from_with_r(c: char) -> Option<Self> {
        match c {
            'a' => Some(PitchName::A),
            'b' => Some(PitchName::B),
            'c' => Some(PitchName::C),
            'd' => Some(PitchName::D),
            'e' => Some(PitchName::E),
            'f' => Some(PitchName::F),
            'g' => Some(PitchName::G),
            'r' => Some(PitchName::R),
            _ => None,
        }
    }

    pub fn from(c: char) -> Option<Self> {
        Self::from_with_r(c).filter(|n| *n != PitchName::R)
    }
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Accidental {
    DoubleSharp,
    DoubleFlat,
    Sharp,
    Flat,
    Natural,
}
impl Accidental {
    pub fn from_with_double(s: &str, i: usize) -> (Option<Self>, usize) {
        match (s.chars().nth(i), s.chars().nth(i + 1)) {
            (Some('+'), Some('+')) => (Some(Accidental::DoubleSharp), i + 2),
            (Some('-'), Some('-')) => (Some(Accidental::DoubleFlat), i + 2),
            (Some('+'), _) => (Some(Accidental::Sharp), i + 1),
            (Some('-'), _) => (Some(Accidental::Flat), i + 1),
            (Some('='), _) => (Some(Accidental::Natural), i + 1),
            _ => (None, i),
        }
    }

    pub fn from(s: &str, i: usize) -> (Option<Self>, usize) {
        match s.chars().nth(i) {
            Some('+') => (Some(Accidental::Sharp), i + 1),
            Some('-') => (Some(Accidental::Flat), i + 1),
            Some('=') => (Some(Accidental::Natural), i + 1),
            _ => (None, i),
        }
    }
}

/// A function to count the number of the leading tabs of s.
pub fn count_leading_tab(s: &str) -> usize {
    s.chars().take_while(|c| *c == '\t').count()
}

/// A function that eats a string from the i-th character of s to a whitespace.
pub fn eat_to_whitespace(s: &str, i: usize) -> (Option<String>, usize) {
    let oi = i;
    let mut i = i;
    let mut ss = String::new();
    while i < s.len() {
        let c = s.chars().nth(i).unwrap();
        if c.is_whitespace() {
            break;
        } else {
            ss.push(c);
            i += 1;
        }
    }
    if ss.is_empty() {
        (None, oi)
    } else {
        (Some(ss), i)
    }
}

/// A function that eats a continuous characters from the i-th character of s.
pub fn eat_chars(s: &str, i: usize, chars: &[char]) -> (Option<String>, usize) {
    let oi = i;
    let mut i = i;
    let mut ss = String::new();
    while i < s.len() {
        let c = s.chars().nth(i).unwrap();
        if chars.contains(&c) {
            ss.push(c);
            i += 1;
        } else {
            break;
        }
    }
    if ss.is_empty() {
        (None, oi)
    } else {
        (Some(ss), i)
    }
}

/// A function that parses a T-type integer from the i-th character of s.
pub fn eat_int<T>(s: &str, i: usize) -> (Option<T>, usize)
where
    T: std::str::FromStr,
{
    match eat_chars(s, i, &['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
        (Some(ns), ni) => {
            if let Ok(n) = ns.parse::<T>() {
                (Some(n), ni)
            } else {
                (None, i)
            }
        }
        _ => (None, i),
    }
}

/// A function that parses a T-type integer from the i-th character of s.
pub fn eat_float<T>(s: &str, i: usize) -> (Option<T>, usize)
where
    T: std::str::FromStr,
{
    let (former, ni) = if let (Some(ns), ni) =
        eat_chars(s, i, &['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
    {
        (ns, ni)
    } else {
        return (None, i);
    };

    let ni = match s.chars().nth(ni) {
        Some('.') => ni + 1,
        _ => {
            if let Ok(n) = former.parse::<T>() {
                return (Some(n), ni);
            } else {
                return (None, i);
            }
        }
    };

    let (latter, ni) = if let (Some(ns), ni) =
        eat_chars(s, ni, &['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
    {
        (ns, ni)
    } else {
        return (None, i);
    };

    let ss = former + "." + latter.as_str();

    if let Ok(n) = ss.parse::<T>() {
        (Some(n), ni)
    } else {
        (None, i)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn eat_int_correct_return_expected() {
        let res = eat_int("abc00123d", 3);
        let ans = (Some(123), 8);
        assert_eq!(res, ans);
    }

    #[test]
    fn eat_int_no_int_return_none() {
        let res = eat_int::<u32>("abcdefg", 3);
        let ans = (None, 3);
        assert_eq!(res, ans);
    }

    #[test]
    fn eat_float_correct_return_expected() {
        let res = eat_float("abc00123.0456d", 3);
        let ans = (Some(123.0456), 13);
        assert_eq!(res, ans);
    }

    #[test]
    fn eat_float_only_former_return_expected() {
        let res = eat_float("abc00123d", 3);
        let ans = (Some(123.0), 8);
        assert_eq!(res, ans);
    }

    #[test]
    fn eat_float_no_former_return_none() {
        let res = eat_float::<f32>("abc.0456d", 3);
        let ans = (None, 3);
        assert_eq!(res, ans);
    }

    #[test]
    fn eat_float_no_latter_return_none() {
        let res = eat_float::<f32>("abc00123.d", 3);
        let ans = (None, 3);
        assert_eq!(res, ans);
    }
}

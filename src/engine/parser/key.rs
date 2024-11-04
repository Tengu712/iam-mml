use super::*;
use std::collections::HashSet;

/// A struct which represents the key.
///
/// It allows that the pitch names is empty.
/// It disallow double sharp and double flat.
#[derive(Clone)]
#[cfg_attr(test, derive(Debug, PartialEq, Eq))]
pub struct Key {
    pitch_names: HashSet<PitchName>,
    accidental: Accidental,
}
impl Default for Key {
    fn default() -> Self {
        Self {
            pitch_names: HashSet::new(),
            accidental: Accidental::Natural,
        }
    }
}

impl Key {
    /// A function to create an object from a string.
    ///
    /// * `s` - The string which contains the command.
    /// * `i` - The index of the content of the command on `s`.
    /// * `ln_d` - The line number of `s` for an error message.
    pub fn from(s: &str, i: usize, ln_d: usize) -> Result<(Self, usize), String> {
        let mut i = i;
        let mut pitch_names = HashSet::new();
        while i < s.len() {
            if let Some(n) = PitchName::from(s.chars().nth(i).unwrap()) {
                pitch_names.insert(n);
                i += 1;
            } else {
                break;
            }
        }
        let (accidental, ni) = Accidental::from(s, i);
        if let Some(accidental) = accidental {
            Ok((
                Self {
                    pitch_names,
                    accidental,
                },
                ni,
            ))
        } else {
            Err(format!(
                "accidental is not found for modulation: line {ln_d}, char {i}."
            ))
        }
    }

    /// A method to get the accidental of the pitch.
    pub fn get(&self, pitch_name: &PitchName) -> Accidental {
        if self.pitch_names.contains(pitch_name) {
            self.accidental
        } else {
            Accidental::Natural
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn correct() {
        let res = Key::from("kba+", 1, 1).unwrap();
        let ans = (
            Key {
                pitch_names: HashSet::from([PitchName::B, PitchName::A]),
                accidental: Accidental::Sharp,
            },
            4,
        );
        assert_eq!(res, ans);
    }

    #[test]
    fn not_eat_double_sharp() {
        let res = Key::from("kba++", 1, 1).unwrap();
        let ans = (
            Key {
                pitch_names: HashSet::from([PitchName::B, PitchName::A]),
                accidental: Accidental::Sharp,
            },
            4,
        );
        assert_eq!(res, ans);
    }

    #[test]
    fn allow_duplicated_pitch_name() {
        let res = Key::from("kbabb-c", 1, 1).unwrap();
        let ans = (
            Key {
                pitch_names: HashSet::from([PitchName::B, PitchName::A]),
                accidental: Accidental::Flat,
            },
            6,
        );
        assert_eq!(res, ans);
    }

    #[test]
    fn allow_no_pitch_name() {
        let res = Key::from("foo bk=ad", 6, 1).unwrap();
        let ans = (
            Key {
                pitch_names: HashSet::from([]),
                accidental: Accidental::Natural,
            },
            7,
        );
        assert_eq!(res, ans);
    }

    #[test]
    fn disallow_no_accidental() {
        let res = Key::from("foo bkad", 6, 1);
        assert!(res.is_err());
    }
}

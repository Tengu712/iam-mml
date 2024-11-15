use super::key::Key;
use crate::engine::note::Note;

#[derive(Clone)]
pub struct LoopInfo {
    pub delim: usize,
    pub notes: Vec<Note>,
}

#[derive(Clone)]
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
    ///
    pub stack: Vec<LoopInfo>,
}

impl Default for Environment {
    fn default() -> Self {
        Self {
            est: 0.0,
            key: Key::default(),
            oct: 4,
            dv: 4,
            tmp: 100,
            vol: 0.5,
            dnm: 4,
            inst: 0,
            stack: Vec::new(),
        }
    }
}

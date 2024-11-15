/// A struct which represents a note.
#[derive(Clone)]
pub struct Note {
    /// The amplitude of the note.
    /// If the note is `r`, it is `0.0`.
    pub amplitude: f32,
    /// The frequency of the note.
    pub frequency: f32,
    /// The duration of the note (in seconds).
    pub duration: f32,
    /// The instrument that the note uses.
    pub instrument: usize,
}

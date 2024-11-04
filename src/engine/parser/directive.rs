use super::{key::*, *};

pub struct DirectiveInfo {
    /// The tempo.
    /// The default is 100.
    pub tempo: u32,
    /// The denominator of the time signature.
    /// The default is 4.
    pub denom: u32,
    /// The key.
    pub key: Key,
}

impl Default for DirectiveInfo {
    fn default() -> Self {
        Self {
            key: Key::default(),
            tempo: 100,
            denom: 4,
        }
    }
}

impl DirectiveInfo {
    /// A method to apply a directive line to this instance.
    ///
    /// * `line` - the directive line.
    /// * `ln_d` - the line number for an error message.
    pub fn apply(&mut self, line: &str, ln_d: usize) -> Result<(), String> {
        if !line.starts_with('#') {
            panic!("unexpected error");
        }

        // split and get the index of tokens[1]
        let tokens = line.split_whitespace().collect::<Vec<&str>>();
        if tokens.len() < 2 {
            return Err(format!("value is missing for {}: line {ln_d}.", tokens[0]));
        }
        let i = line.find(tokens[1]).unwrap();

        // parse
        match tokens[0] {
            "#tempo" => self.tempo = int_directive(line, i, ln_d, "#tempo", MIN_TEMPO, MAX_TEMPO)?,
            "#denom" => self.denom = int_directive(line, i, ln_d, "#denom", MIN_DENOM, MAX_DENOM)?,
            "#key" => (self.key, _) = Key::from(line, i, ln_d)?,
            cmd => return Err(format!("undefined directive {cmd} found: line {ln_d}.")),
        }

        Ok(())
    }
}

fn int_directive<T>(
    line: &str,
    i: usize,
    ln_d: usize,
    name: &str,
    min: T,
    max: T,
) -> Result<T, String>
where
    T: std::str::FromStr + std::fmt::Display + std::cmp::PartialOrd,
{
    if let (Some(n), _) = eat_int::<T>(line, i) {
        if n < min || n > max {
            Err(format!(
                "the value of {name} must be an integer between {min} and {max}, inclusive, but {n} is found: line {ln_d}, char {i}."
            ))
        } else {
            Ok(n)
        }
    } else {
        Err(format!(
            "the value of {name} is not found: line {ln_d}, char {i}."
        ))
    }
}

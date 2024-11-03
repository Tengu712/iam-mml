use super::{key::*, *};

pub struct DirectiveInfo {
    /// The denominator of the time signature.
    /// The default is 4.
    pub denom: u32,
    /// The tempo.
    /// The default is 100.
    pub tempo: u32,
    /// The key.
    pub key: Key,
}

impl Default for DirectiveInfo {
    fn default() -> Self {
        Self {
            denom: 4,
            tempo: 100,
            key: Key::default(),
        }
    }
}

impl DirectiveInfo {
    pub fn apply(&mut self, line: &str, ln: usize, cn: usize) -> Result<(), String> {
        if !line.starts_with('#') {
            panic!("unexpected error");
        }

        // split and get the index of tokens[1]
        let tokens = line.split_whitespace().collect::<Vec<&str>>();
        if tokens.len() < 2 {
            return Err(format!("value is missing for {}: line {ln}.", tokens[0]));
        }
        let i = line.find(tokens[1]).unwrap() + cn;

        match tokens[0] {
            "#denom" => {
                if let (Some(n), ni) = eat_int(line, i) {
                    if ni != line.len() {
                        return Err(format!(
                            "unnecesary character is found: line {ln}, char {ni}."
                        ));
                    }
                    if n < MIN_DENOMINATOR || n > MAX_DENOMINATOR {
                        return Err(format!(
                            "the value of #denom must be an integer between {MIN_DENOMINATOR} and {MAX_DENOMINATOR}, inclusive, but {n} is found: line {ln}, char {i}."
                        ));
                    }
                    self.denom = n;
                } else {
                    return Err(format!(
                        "the value of #denom is not found: line {ln}, char {i}."
                    ));
                }
            }
            "#tempo" => {
                if let (Some(n), ni) = eat_int(line, i) {
                    if ni != line.len() {
                        return Err(format!(
                            "unnecesary character is found: line {ln}, char {ni}."
                        ));
                    }
                    if n < MIN_TEMPO || n > MAX_TEMPO {
                        return Err(format!(
                            "the value of #denom must be an integer between {MIN_TEMPO} and {MAX_TEMPO}, inclusive, but {n} is found: line {ln}, char {i}."
                        ));
                    }
                    self.tempo = n;
                } else {
                    return Err(format!(
                        "the value of #tempo is not found: line {ln}, char {i}."
                    ));
                }
            }
            "#key" => {
                let (n, ni) = Key::from(line, i, ln)?;
                if ni != line.len() {
                    return Err(format!(
                        "unnecesary character is found: line {ln}, char {ni}."
                    ));
                }
                self.key = n;
            }
            cmd => {
                return Err(format!(
                    "undefined directive {cmd} found: line {ln}, char {i}."
                ))
            }
        }

        Ok(())
    }
}

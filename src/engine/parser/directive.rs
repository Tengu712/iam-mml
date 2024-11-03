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

/// A function to read the directive infomation from a MML code.
///
/// * `src` - The MML code.
pub fn parse(src: &str) -> Result<DirectiveInfo, String> {
    let mut di = DirectiveInfo {
        denom: 4,
        tempo: 100,
        key: Key::default(),
    };

    for (ln, line) in src.lines().enumerate() {
        let line = line.trim();

        // skip
        if !line.starts_with('#') {
            continue;
        }

        // split and get the index of tokens[1]
        let tokens = line.split_whitespace().collect::<Vec<&str>>();
        if tokens.len() < 2 {
            return Err(format!("value is missing for {}: line {ln}.", tokens[0]));
        }
        let i = line.find(tokens[1]).unwrap();

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
                    di.denom = n;
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
                    di.tempo = n;
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
                di.key = n;
            }
            cmd => {
                return Err(format!(
                    "undefined directive {cmd} found: line {ln}, char {i}."
                ))
            }
        }
    }

    Ok(di)
}

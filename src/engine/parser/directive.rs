use super::{environment::Environment, *};
use std::collections::HashMap;

pub fn parse(
    line: &str,
    env: &mut Environment,
    envs: &mut HashMap<String, Environment>,
    ln_d: usize,
) -> Result<(), String> {
    // split and get the index of tokens[1]
    let tokens = line.split_whitespace().collect::<Vec<&str>>();
    if tokens.len() < 2 {
        return Err(format!("value is missing for {}: line {ln_d}.", tokens[0]));
    }
    let i = line.find(tokens[1]).unwrap();
    let cn_d = i + 1;

    // parse
    match tokens[0] {
        "#tempo" => {
            let n = int_directive(line, i, MIN_TEMPO, MAX_TEMPO, "#tempo", ln_d, cn_d)?;
            env.tmp = n;
            for env in envs.values_mut() {
                env.tmp = n;
            }
        }
        "#denom" => {
            let n = int_directive(line, i, MIN_DENOM, MAX_DENOM, "#denom", ln_d, cn_d)?;
            env.dnm = n;
            for env in envs.values_mut() {
                env.dnm = n;
            }
        }
        "#key" => {
            let (key, _) = key::Key::from(line, i, ln_d)?;
            env.key = key.clone();
            for env in envs.values_mut() {
                env.key = key.clone();
            }
        }
        cmd => return Err(format!("undefined directive {cmd} found: line {ln_d}.")),
    }

    Ok(())
}

fn int_directive<T>(
    line: &str,
    i: usize,
    min: T,
    max: T,
    name: &str,
    cn_d: usize,
    ln_d: usize,
) -> Result<T, String>
where
    T: std::str::FromStr + std::fmt::Display + std::cmp::PartialOrd,
{
    if let (Some(n), _) = eat_int::<T>(line, i) {
        if n < min || n > max {
            Err(format!(
                "the value of {name} must be an integer between {min} and {max}, inclusive, but {n} is found: line {ln_d}, char {cn_d}."
            ))
        } else {
            Ok(n)
        }
    } else {
        Err(format!(
            "the value of {name} is not found: line {ln_d}, char {cn_d}."
        ))
    }
}

use super::*;
use crate::engine::instrument::*;

pub fn parse(lines: &Vec<&str>, ln: usize) -> Result<(Instrument, usize), String> {
    let mut ln = ln;
    let mut cind = 0;
    let mut cmds = Vec::new();
    let mut max_release = 0.0;

    while ln < lines.len() {
        let line = lines[ln];

        if line.trim().is_empty() || line.trim().starts_with('#') || line.trim().starts_with('@') {
            break;
        }

        let ln_d = ln + 1;
        let ind = count_leading_tab(line);

        if ind > 0 && cmds.is_empty() {
            return Err(format!("base carrier must not be indented: line {ln_d}."));
        }

        let outdent = cind - ind as i32;
        if outdent > 0 {
            cmds.push(Command::Stack(outdent as usize));
        } else if outdent < -1 {
            return Err(format!("too many indent is found: line {ln_d}."));
        }

        let tokens = line.trim().split_whitespace().collect::<Vec<&str>>();
        if tokens.len() != 6 && tokens.len() != 7 {
            return Err(format!(
                "the number of parameters of an operator must be 6 or 7: line {ln_d}."
            ));
        }
        let (amplitude, _) = eat_float(tokens[0], 0);
        let (freqratio, _) = eat_float(tokens[1], 0);
        let (attack, _) = eat_float(tokens[2], 0);
        let (decay, _) = eat_float(tokens[3], 0);
        let (sustain, _) = eat_float(tokens[4], 0);
        let (release, _) = eat_float(tokens[5], 0);
        let amplitude = amplitude
            .ok_or_else(|| format!("invalid operator amplitude is found: line {ln_d}."))?;
        let freqratio = freqratio
            .ok_or_else(|| format!("invalid operator freqratio is found: line {ln_d}."))?;
        let attack =
            attack.ok_or_else(|| format!("invalid operator attack is found: line {ln_d}."))?;
        let decay =
            decay.ok_or_else(|| format!("invalid operator decay is found: line {ln_d}."))?;
        let sustain =
            sustain.ok_or_else(|| format!("invalid operator sustain is found: line {ln_d}."))?;
        let release =
            release.ok_or_else(|| format!("invalid operator release is found: line {ln_d}."))?;
        let feedback = if tokens.len() == 7 {
            if let (Some(n), _) = eat_int(tokens[6], 0) {
                n
            } else {
                return Err(format!("invalid operator feedback is found: line {ln_d}."));
            }
        } else {
            0
        };
        cmds.push(Command::Operator(Operator {
            amplitude,
            freqratio,
            attack,
            decay,
            sustain,
            release,
            feedback,
        }));

        if release > max_release {
            max_release = release;
        }
        cind = ind as i32;
        ln += 1;
    }

    cmds.reverse();
    Ok((Instrument { release: max_release, cmds }, ln))
}

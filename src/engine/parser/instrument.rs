use super::*;
use crate::engine::instrument::*;

pub fn parse(lines: &Vec<&str>, ln: usize) -> Result<(Instrument, usize), String> {
    let mut ln = ln;
    let mut cind = 0;
    let mut cmds = Vec::new();
    let mut release = 0.0;

    while ln < lines.len() {
        let line = lines[ln];
        let ln_d = ln + 1;

        if line.trim().is_empty()
            || line.trim().starts_with('#')
            || line.trim().starts_with('@')
            || line.trim().starts_with(';')
        {
            break;
        }

        let indent = count_leading_tab(line);
        if indent > 0 && cmds.is_empty() {
            return Err(format!("base carrier must not be indented: line {ln_d}."));
        }

        let outdent = cind - indent as i32;
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
        let (v, _) = eat_float(tokens[0], 0);
        let (f, _) = eat_float(tokens[1], 0);
        let (a, _) = eat_float(tokens[2], 0);
        let (d, _) = eat_float(tokens[3], 0);
        let (s, _) = eat_float(tokens[4], 0);
        let (r, _) = eat_float(tokens[5], 0);
        let (fd, _) = if tokens.len() == 7 {
            eat_int(tokens[6], 0)
        } else {
            (Some(0), 0)
        };
        let v = v.ok_or_else(|| format!("operator amplitude is invalid: line {ln_d}."))?;
        let f = f.ok_or_else(|| format!("operator freqratio is invalid: line {ln_d}."))?;
        let a = a.ok_or_else(|| format!("operator attack is invalid: line {ln_d}."))?;
        let d = d.ok_or_else(|| format!("operator decay is invalid: line {ln_d}."))?;
        let s = s.ok_or_else(|| format!("operator sustain is invalid: line {ln_d}."))?;
        let r = r.ok_or_else(|| format!("operator release is invalid: line {ln_d}."))?;
        let fd = fd.ok_or_else(|| format!("operator feedback is invalid: line {ln_d}."))?;
        cmds.push(Command::Operator(Operator {
            amplitude: v,
            freqratio: f,
            attack: a,
            decay: d,
            sustain: s,
            release: r,
            feedback: fd,
        }));

        if r > release {
            release = r;
        }
        cind = indent as i32;
        ln += 1;
    }

    cmds.reverse();
    Ok((Instrument { release, cmds }, ln))
}

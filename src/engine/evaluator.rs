use super::parser::*;

pub const SAMPLE_RATE: f32 = 44100.0;
pub const PER_SAMPLE_RATE: f32 = 1.0 / SAMPLE_RATE;
const EXTRA_EST: f32 = 5.0;

fn sec_to_len(sec: f32) -> usize {
    (sec * SAMPLE_RATE).ceil() as usize
}

pub fn evaluate(pi: ParsedInfo) -> Vec<f32> {
    let mut buffer = Vec::<f32>::with_capacity(sec_to_len(pi.est + EXTRA_EST));
    let mut length = 0;

    for ns in pi.parts.values() {
        let mut ci = 0;
        for n in ns {
            let inst = &pi.insts[n.instrument];
            let duration = sec_to_len(n.duration + inst.release);
            for i in 0..duration {
                let t = i as f32 * PER_SAMPLE_RATE;
                let v = n.amplitude * inst.eval(n.frequency, n.duration, t);
                if ci + i < length {
                    buffer[ci + i] += v;
                } else {
                    buffer.push(v);
                    length += 1;
                }
            }
            ci += sec_to_len(n.duration);
        }
    }

    buffer
}

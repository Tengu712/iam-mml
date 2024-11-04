use std::f32::consts::PI;

/// A struct which represents an operator.
pub struct Operator {
    pub amplitude: f32,
    pub freqratio: f32,
    pub attack: f32,
    pub decay: f32,
    pub sustain: f32,
    pub release: f32,
    pub feedback: u32,
}

impl Operator {
    fn eval(&self, f: f32, d: f32, t: f32, res: f32) -> f32 {
        let mut res = res;
        for _ in 0..(self.feedback + 1) {
            let base = self.amplitude * (2.0 * PI * f * self.freqratio * t + res).sin();
            // attack
            if t < self.attack {
                res = (t / self.attack) * base;
            }
            // decay
            else if t < d && t < self.attack + self.decay {
                res = (self.sustain
                    + (1.0 - self.sustain) * (1.0 - (t - self.attack) / self.decay))
                    * base;
            }
            // sustain
            else if t < d {
                res = self.sustain * base;
            }
            // release
            else if t < d + self.release {
                res = self.sustain * (1.0 - (t - d) / self.release) * base;
            }
        }
        res
    }
}

/// An enum which represents the instruction of an instrument.
pub enum Command {
    Operator(Operator),
    Stack(usize),
}

/// A struct which represents an intrument.
pub struct Instrument {
    pub release: f32,
    pub cmds: Vec<Command>,
}

impl Instrument {
    pub fn eval(&self, f: f32, d: f32, t: f32) -> f32 {
        let mut res = 0.0;
        let mut stack = Vec::new();
        for cmd in self.cmds.iter() {
            match cmd {
                Command::Operator(n) => {
                    res = n.eval(f, d, t, res);
                    if let Some((cnt, val)) = stack.pop() {
                        if cnt > 0 {
                            stack.push((cnt - 1, val));
                        } else {
                            res += val;
                        }
                    }
                }
                Command::Stack(n) => {
                    stack.push((*n, res));
                    res = 0.0;
                }
            }
        }
        res
    }
}

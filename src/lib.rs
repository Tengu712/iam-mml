#![cfg(target_arch = "wasm32")]

mod engine;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn build(src: &str) -> Result<Vec<f32>, JsValue> {
    engine::run(src).map_err(|n| JsValue::from(n))
}

#[wasm_bindgen]
pub fn generate(src: &str) -> Result<Vec<u8>, JsValue> {
    let wave = engine::run(src).map_err(|n| JsValue::from(n))?;
    let buffer = Vec::new();
    let mut cursor = std::io::Cursor::new(buffer);
    engine::generate_wave(wave, &mut cursor).map_err(|n| JsValue::from(n.to_string()))?;
    Ok(cursor.into_inner())
}

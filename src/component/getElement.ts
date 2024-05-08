export function getElementById<T>(id: string): T {
  return document.getElementById(id)! as T
}

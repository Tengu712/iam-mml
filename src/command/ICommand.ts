import type {Buffer} from '../evaluate/Buffer'

export interface ICommand {
  eval(buffer: Buffer): void
}

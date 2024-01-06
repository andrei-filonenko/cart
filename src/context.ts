import { ref } from "./_db.js";
import * as commands from "./commands.js";
import { State } from './_db.js';

export interface MyContext {
    data: () => State["snapshot"]
    commands: typeof commands
}


export const context = async (): Promise<MyContext> => ({
  data: () => ref().snapshot,
  commands: commands,
  
});


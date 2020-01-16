import acorn_interpreter from "./acorn_interpreter";
(window as any).acorn = acorn_interpreter;
import { range } from "./util";

export const dataLength = 10;
export let data: number[];

export function initData() {
  data = range(dataLength).map(() =>
    Math.floor(Math.random() * dataLength * 2 + 1)
  );
}

export type Code = {
  source: string;
  isDescending: boolean;
  interpreter?: any;
};

export function getCode(source: string, isDescending = false): Code {
  const code = { source, isDescending };
  reset(code);
  return code;
}

export function reset(code: Code) {
  code.interpreter = new acorn_interpreter.Interpreter(
    code.source,
    (interpreter, scope) => {
      function getData(i: number) {
        return data[i];
      }
      function getDataInverse(i: number) {
        return -data[i];
      }
      function swapData(i: number, j: number) {
        const tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
      }
      interpreter.setProperty(
        scope,
        "get",
        interpreter.createNativeFunction(
          code.isDescending ? getDataInverse : getData
        )
      );
      interpreter.setProperty(
        scope,
        "swap",
        interpreter.createNativeFunction(swapData)
      );
      interpreter.setProperty(scope, "length", dataLength);
    }
  );
}

export function step(code: Code) {
  return code.interpreter.step();
}

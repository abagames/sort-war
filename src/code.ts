import acorn_interpreter from "./acorn_interpreter";
(window as any).acorn = acorn_interpreter;
import { range } from "./util";

export const dataLength = 10;
export let data: number[];
const instructionHistoryLength = 20;

export function initData() {
  data = range(dataLength).map(() =>
    Math.floor(Math.random() * dataLength * 2 + 1)
  );
  if (countDataAscending() === 0 && countDataAscending(true) === 0) {
    data = range(dataLength).map(i => i + 1);
  }
}

export function countDataAscending(isDescending = false) {
  const inv = isDescending ? -1 : 1;
  let c = 0;
  for (let i = 0; i < dataLength - 1; i++) {
    if (data[i] * inv < data[i + 1] * inv) {
      c++;
    }
  }
  return c;
}

export type Code = {
  source: string;
  isDescending: boolean;
  interpreter?: any;
  isSwapCalled: boolean;
  swappingFrom: number;
  swappingTo: number;
  isTerminated: boolean;
  instruction: string;
  instructionHistory: string[];
};

export function getCode(source: string, isDescending = false): Code {
  const code = {
    source,
    isDescending,
    isSwapCalled: false,
    swappingFrom: -1,
    swappingTo: -1,
    isTerminated: false,
    instruction: "",
    instructionHistory: []
  };
  reset(code);
  return code;
}

export function reset(code: Code) {
  code.isTerminated = false;
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
        if (i < 0 || i >= dataLength || j < 0 || j >= dataLength) {
          throw `invalid params: swap(${i}, ${j})`;
        }
        const tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
        code.isSwapCalled = true;
        code.swappingFrom = i;
        code.swappingTo = j;
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
  code.instruction = "";
  code.isSwapCalled = false;
  if (code.isTerminated) {
    return false;
  }
  if (code.interpreter.stateStack.length > 0) {
    const node =
      code.interpreter.stateStack[code.interpreter.stateStack.length - 1].node;
    code.instruction = code.source.substring(node.start, node.end);
    code.instructionHistory.push(code.instruction);
    code.instructionHistory = code.instructionHistory.slice(
      -instructionHistoryLength
    );
  }
  if (!code.interpreter.step()) {
    code.isTerminated = true;
    return false;
  }
  return true;
}

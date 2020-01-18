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
  name: string;
  isDescending: boolean;
  interpreter?: any;
  isSwapCalled: boolean;
  swappingFrom: number;
  swappingTo: number;
  isTerminated: boolean;
  instruction: string;
  instructionHistory: string[];
  hasError: boolean;
  errorMessage: string;
};

export function getCode(source: string, isDescending = false): Code {
  const code: Code = {
    source,
    name: isDescending ? "Player2" : "Player1",
    isDescending,
    isSwapCalled: false,
    swappingFrom: -1,
    swappingTo: -1,
    isTerminated: false,
    instruction: "",
    instructionHistory: [],
    hasError: false,
    errorMessage: ""
  };
  if (source.startsWith("//")) {
    const name = source
      .substring(2, source.indexOf("\n"))
      .trim()
      .substr(0, 16);
    if (name.length > 0) {
      code.name = name;
    }
  }
  reset(code);
  return code;
}

export function reset(code: Code) {
  try {
    code.isTerminated = code.hasError = false;
    code.interpreter = new acorn_interpreter.Interpreter(
      code.source,
      (interpreter, scope) => {
        function getData(i: number) {
          if (i < 0 || i >= dataLength) {
            code.hasError = true;
            code.errorMessage = `Invalid params: get(${i})`;
          }
          return data[i];
        }
        function getDataInverse(i: number) {
          if (i < 0 || i >= dataLength) {
            code.hasError = true;
            code.errorMessage = `Invalid params: get(${i})`;
          }
          return -data[i];
        }
        function swapData(i: number, j: number) {
          if (i === j) {
            return;
          }
          if (i < 0 || i >= dataLength || j < 0 || j >= dataLength) {
            code.hasError = true;
            code.errorMessage = `Invalid params: swap(${i}, ${j})`;
            return;
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
  } catch (e) {
    code.hasError = true;
    code.errorMessage = e.toString();
  }
}

export function step(code: Code) {
  code.instruction = "";
  code.isSwapCalled = false;
  if (code.isTerminated || code.hasError || code.interpreter == null) {
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
  try {
    if (!code.interpreter.step()) {
      code.isTerminated = true;
      return false;
    }
  } catch (e) {
    code.hasError = true;
    code.errorMessage = e.toString();
  }
  return true;
}

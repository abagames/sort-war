import acorn_interpreter from "./acorn_interpreter";
(window as any).acorn = acorn_interpreter;

const code = "var a=1; for(var i=0;i<4;i++){a*=i;} a;";
const interpreter = new acorn_interpreter.Interpreter(code);

for (let i = 0; i < 100; i++) {
  console.log(interpreter.step());
}

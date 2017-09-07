type VariableType = "Numerical"| "Categorical" | "Text" | "None";

export class Concept {
  label: string;
  labelLong: string;
  node: string;
  variableType: VariableType;
}

type VariableType = "Numerical"| "Categorical" | "Text" | "None";

export class Concept {
  label: string;
  labelLong: string;
  variableType: VariableType;
}

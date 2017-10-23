type EnvironmentType = "Public"| "Internal" | "None";

export class Environment {
  environment: EnvironmentType;
  grailsEnvironment: string;
  application: string;
  version: string;
}

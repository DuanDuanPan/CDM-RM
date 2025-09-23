export interface DotenvSafeOptions {
  cwd?: string;
  path?: string;
  example?: string;
  allowEmptyValues?: boolean;
  override?: boolean;
  optional?: string[];
}

export interface DotenvSafeResult {
  parsed: Record<string, string>;
  sample: Record<string, string>;
}

export declare function config(options?: DotenvSafeOptions): DotenvSafeResult;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OUTPUT_DIRNAME: string;
      SOURCE_DIRNAME: string;
    }
  }
}

export {};

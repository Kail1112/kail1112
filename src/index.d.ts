declare global {
  namespace Kail1112 {
    type AnyObject = Record<keyof any, any>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      OUTPUT_DIRNAME: string;
      SOURCE_DIRNAME: string;
    }
  }
}

export {};

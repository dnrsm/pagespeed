export interface LighthouseList {
  [key: string]: number[];
}

export interface ChromeUxList {
  [key: string]: string[];
}

export interface Options {
  [key: string]: string;
  strategy: string;
}

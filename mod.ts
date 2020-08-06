import {
  red,
  green,
  blue,
  bold,
  parse,
  Args,
  Logger,
  Spinner,
  Table,
} from "./deps.ts";
import {
  formatToNumber,
  mean,
  mode,
  isUrlValid,
  sleep,
} from "./util.ts";
import { ChromeUxList, LighthouseList, Options } from "./types.d.ts";

const { args } = Deno;
const logger = new Logger();
const spinner = Spinner.getInstance();

const baseURL: string =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const parsedArgs: Args = parse(args);
const times: number = parsedArgs["t"] || parsedArgs["times"] || 1;
const interval: number = parsedArgs["i"] || parsedArgs["interval"] || 0;
const help: boolean = parsedArgs["h"] || parsedArgs["help"];

function displayHelpMsg(): string {
  return `
Usage:
  pagespeed [url] [options]

Options:
  -h, --help      display help message
  -s, --strategy  The analysis strategy (desktop or mobile) to use, and desktop is the default
  -k, --key       API Key(Optional)
  -t, --times     Number of times
  -i, --interval  Time interval(ms)
`;
}

export async function runPagespeed(
  url: string,
  options: Options,
): Promise<any> {
  if (url === "" || typeof url === "undefined") {
    throw new Error("Please enter a URL");
  }
  if (!isUrlValid(url)) {
    throw new Error("Please enter a valid URL");
  }
  const params = new URLSearchParams();
  params.set("url", url);
  Object.keys(options).forEach((key) => {
    params.set(key, options[key]);
  });
  const res = await fetch(`${baseURL}?${params.toString()}`);
  if (res.status === 429) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  if ("error" in data) {
    throw new Error(data.error.message);
  }
  return data;
}

export async function getResult(): Promise<void> {
  spinner.start("Processing...");

  const [url]: string[] = parsedArgs._.map((args) => args.toString());
  const strategy: string = parsedArgs["s"] || parsedArgs["strategy"] ||
    "desktop";
  const key: string = parsedArgs["k"] || parsedArgs["key"] || "";

  let scoreList = [];
  let chromeUxList: ChromeUxList = {
    "First Contentful Paint": [],
    "First Input Delay": [],
  };
  let lighthouseList: LighthouseList = {
    "First Contentful Paint": [],
    "Speed Index": [],
    "Time To Interactive": [],
    "First Meaningful Paint": [],
    "First CPU Idle": [],
    "Estimated Input Latency": [],
  };

  for (let index = 0; index < times; index++) {
    const { lighthouseResult, loadingExperience } = await runPagespeed(
      url,
      {
        strategy,
        key,
      },
    );
    scoreList.push(
      Math.round(lighthouseResult.categories.performance.score * 100),
    );
    chromeUxList["First Contentful Paint"].push(
      loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
    );
    chromeUxList["First Input Delay"].push(
      loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category,
    );
    lighthouseList["First Contentful Paint"].push(
      formatToNumber(
        lighthouseResult.audits["first-contentful-paint"].displayValue,
      ),
    );
    lighthouseList["Speed Index"].push(
      formatToNumber(lighthouseResult.audits["speed-index"].displayValue),
    );
    lighthouseList["Time To Interactive"].push(
      formatToNumber(lighthouseResult.audits["interactive"].displayValue),
    );
    lighthouseList["First Meaningful Paint"].push(
      formatToNumber(
        lighthouseResult.audits["first-meaningful-paint"].displayValue,
      ),
    );
    lighthouseList["First CPU Idle"].push(
      formatToNumber(lighthouseResult.audits["interactive"].displayValue),
    );
    lighthouseList["Estimated Input Latency"].push(
      formatToNumber(
        lighthouseResult.audits["estimated-input-latency"].displayValue,
      ),
    );
    await sleep(interval);
  }

  const scoreTable = new Table({
    header: ["Property", "Min", "Max", "Mean"],
  });
  scoreTable.push(
    [
      "Score",
      Math.min(...scoreList),
      Math.max(...scoreList),
      mean(scoreList),
    ],
  );
  const chromeTable = new Table({
    header: ["Property", "Mode"],
  });
  Object.keys(chromeUxList).forEach((key) => {
    chromeTable.push(
      [
        key,
        mode(chromeUxList[key]),
      ],
    );
  });
  const lighthouseTable = new Table({
    header: ["Property", "Min", "Max", "Mean"],
  });
  Object.keys(lighthouseList).forEach((key) => {
    const unit = key === "Estimated Input Latency" ? "ms" : "s";
    lighthouseTable.push(
      [
        key,
        `${Math.min(...lighthouseList[key])} ${unit}`,
        `${Math.max(...lighthouseList[key])} ${unit}`,
        `${mean(lighthouseList[key])} ${unit}`,
      ],
    );
  });

  console.log(`\n
${blue(`${bold("Page Tested")}: ${url}`)}
${blue(`${bold("Strategy")}:    ${strategy}`)}
${green(scoreTable.toString())}

${blue(bold(`Chrome User Experience Report Result`))}
${green(chromeTable.toString())}

${blue(bold(`Lighthouse Results`))}
${green(lighthouseTable.toString())}
  `);
}

if (import.meta.main) {
  try {
    if (help && args.length === 1) {
      logger.info(displayHelpMsg());
      logger.warn(
        `Uses:\n  pagespeed https://developers.google.com --strategy mobile --times 3 --interval 3000`,
      );
    } else {
      await getResult();
    }
  } catch (error) {
    console.log(red(`\n${error}`));
  } finally {
    spinner.stop();
  }
}

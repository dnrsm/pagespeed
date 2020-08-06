# pagespeed
[![tag](https://img.shields.io/github/v/tag/dnrsm/pagespeed.svg)](https://github.com/dnrsm/pagespeed/tags/)
![CI](https://github.com/dnrsm/pagespeed/workflows/CI/badge.svg) 
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/pagespeed)

CLI tool and API Wrapper for the [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) written in Deno
> Inspired by https://github.com/GoogleChromeLabs/psi

## Screen Shot
![Screen Shot](assets/screenshot.png "Screen Shot")

## Module
### Usage
```typescript
import { runPagespeed } from "https://deno.land/x/pagespeed/mod.ts";

const data = await runPagespeed("https://developers.google.com", {
  strategy: "mobile",
});

console.log(data);
```

### Options
| Option | Type | Default | Description |
|-------|--------------------|-----------|----------------|
| `strategy` | `string` | `desktop` | The analysis strategy |
| `key` | `string` | ` ` | API Key |

## CLI
## Install
```
$ deno install --allow-net --name pagespeed https://deno.land/x/pagespeed/mod.ts
```

## Usage
```
pagespeed https://developers.google.com --strategy mobile --times 3
```

### Options
```shell
Usage: pagespeed [url] [options]

Options:
  -h, --help: display help message
  -s, --strategy: The analysis strategy (desktop or mobile) to use, and desktop is the default
  -k, --key: API Key(Optional)
  -t, --times: Number of times
  -i, --interval: Time interval(ms)
```

## Testing
```shell
$ deno test --allow-net
```

## Code formatter
```shell
$ deno fmt
```

## License
[MIT LICENSE](LICENSE)
test:
	deno test --allow-net

lint:
	deno fmt --check

fmt:
	deno fmt

install:
	deno install --allow-net --name pagespeed https://deno.land/x/pagespeed/mod.ts

.PHONY: test lint install
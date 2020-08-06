ENTRY_FILE=	./mod.ts

test:
	deno test --allow-net

lint:
	deno fmt --check

install:
	deno install --allow-net --name pagespeed ${ENTRY_FILE}

.PHONY: test lint install
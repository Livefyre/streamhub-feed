.PHONY: all build

all: build

build: node_modules

dist: node_modules config
	./node_modules/requirejs/bin/r.js -o ./config/build.conf.js

version:
	./node_modules/.bin/json -E 'this.version="$(v)"' -f package.json -I
	./node_modules/.bin/json -E 'this.version="$(v)"' -f bower.json -I

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

test: build
	npm test

testw: build
	npm run testw

testp: build
	./node_modules/karma/bin/karma start --browsers=PhantomJS

testb: build
	./node_modules/karma/bin/karma start --browsers=Chrome

clean:
	rm -rf node_modules lib

package: dist

run: server

server: build
	npm start
	
lint: build
	./node_modules/jshint/bin/jshint src

env=dev
deploy: dist
	./node_modules/.bin/lfcdn -e $(env)


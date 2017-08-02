# data-showcase-api-e2e
## How to run
These tests are designed to run against a live environment. By default it is pointed at localhost:8080. The test suite 
uses [spock](http://spockframework.org/) and [http-builder-ng](https://github.com/http-builder-ng/http-builder-ng).

Running all tests:
```
gradle test
```

Run one test class: 
```
gradle test --tests '*namespec'
```

Change base url:
```
gradle -DbaseUrl=http://some-showcase-server.com/ test
```

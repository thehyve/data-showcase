# data-showcase-api-e2e
## How to run
These tests are designed to run against a live environment. By default it is pointed at `http://localhost:8080`. The test suite 
uses [spock](http://spockframework.org/) and [http-builder-ng](https://github.com/http-builder-ng/http-builder-ng).

To start the server, run the following in the `data-showcase` directory:
```bash
# Start the server
pushd ..
./gradlew -Dgrails.env=test bootRun
popd
```

While the server is running, the tests can be run from the `data-showcase-api-e2e` directory:

```bash
# Running all tests:
gradle test

# Run one test class: 
gradle test --tests '*namespec'

# Change base url:
gradle -DbaseUrl=https://some-showcase-server.com/ test
```

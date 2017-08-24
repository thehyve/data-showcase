# Data showcase

A data showcase for displaying a summary of data in TranSMART.

## Run

```bash
# Fetch the Gradle wrapper
gradle wrapper

# Start the application, http://localhost:8080
./gradlew bootRun

# Start with the internal environment enabled
./gradlew -Dgrails.env=developmentInternal bootRun

# You could run the reloading frontend separately, http://localhost:4200
cd src/main/user-interface
npm start

# Package, creates build/lib/data-showcase-0.0.1-SNAPHOT.war
./gradlew assemble
```

## Test

```bash
# Run unit tests
./gradlew test

# Run unit tests for the internal environment
./gradlew -Dgrails.env=testInternal test

# Run unit tests and user interface tests
./gradlew check
```

For end to end API tests, see [data-showcase-api-e2e](data-showcase-api-e2e).

### Continuous integration

Bamboo plan: [DS-DEV](https://ci.ctmmtrait.nl/browse/DS-DEV).


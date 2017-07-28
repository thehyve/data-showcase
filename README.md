Data showcase
====

A data showcase for displaying a summary of data in TranSMART.

Run
---

```bash
# Fetch the Gradle wrapper
gradle wrapper

# Start the application, http://localhost:8080
./gradlew bootRun

# You could run the reloading frontend separately, http://localhost:4200
cd src/main/user-interface
npm start

# Package, creates build/lib/data-showcase-0.0.1-SNAPHOT.war
./gradlew assemble

# Run tests
./gradlew test
```

Continuous integration
---
Bamboo plan: [DS-DEV](https://ci.ctmmtrait.nl/browse/DS-DEV).


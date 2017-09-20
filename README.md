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

# Run the war
java -jar build/lib/data-showcase-0.0.1-SNAPHOT.war
```

## Publish
```bash
# Deploy to the Nexus repository https://repo.thehyve.nl
./gradlew publish
```
This publishes the artifact `nl.thehyve:data-showcase:0.0.1-SNAPSHOT:war`.

## Deploy
For deployment, fetch the application war file from the Nexus repository,
and run the application with an external config file:
```bash
MEMORY_OPTIONS="-Xms2g -Xmx2g -XX:MaxPermSize=512m"
JAVA_OPTIONS="-server -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom"
APP_OPTIONS="-Dgrails.env=prod -Dspring.config.location=/home/user/data-showcase-internal.yml"
java -jar ${JAVA_OPTIONS} ${MEMORY_OPTIONS} ${APP_OPTIONS} data-showcase-0.0.1-SNAPHOT.war
```

Example configuration file `data-showcase-internal.yml`:
```yaml
dataShowcase:
    environment: Internal
dataSource:
    url: jdbc:postgresql://localhost:5432/data_showcase
    username: dsc_user
    password: <configure a secure password>
```

Create the database:
```bash
sudo -u postgres psql
```

```sql
create user dsc_user with password '<choose a secure password>';
create database data_showcase;
grant all privileges on database data_showcase to dsc_user;
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


# Data showcase
[![Build Status](https://travis-ci.org/thehyve/data-showcase.svg?branch=master)](https://travis-ci.org/thehyve/data-showcase/branches)


A data showcase for displaying a summary of data in TranSMART.

## Development

### Configure PostgreSQL database
```bash
sudo -u postgres psql
```

```bash
create user datashowcase with password 'datashowcase';
create database data_showcase;
grant all privileges on database data_showcase to datashowcase;
```

## Run

```bash
# Change to the application directory
cd data-showcase

# Fetch the Gradle wrapper
gradle wrapper

# Start the application, http://localhost:8080
./gradlew bootRun

# Start with the internal environment enabled
./gradlew -Dgrails.env=developmentInternal bootRun

# You could run the reloading frontend separately, http://localhost:4200
cd src/main/user-interface
npm start

# Package, creates build/lib/data-showcase-1.0.7.war
./gradlew assemble

# Run the war
java -jar build/libs/data-showcase-1.0.7.war
```

## Publish
Do not forget to change the contents of [env.json](data-showcase/src/main/user-interface/src/app/config/env.json) to:
```json
{
  "env": "prod"
}
```
Publish to Nexus:
```bash
# Deploy to the Nexus repository https://repo.thehyve.nl
./gradlew publish
```
This publishes the artifact `nl.thehyve:data-showcase:1.0.7:war`.

## Deploy
For deployment, fetch the application war file from the Nexus repository,
and run the application with an external config file:
```bash
MEMORY_OPTIONS="-Xms2g -Xmx2g -XX:MaxPermSize=512m"
JAVA_OPTIONS="-server -Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom"
APP_OPTIONS="-Dgrails.env=prod -Dspring.config.location=/home/user/data-showcase-internal.yml"
java -jar ${JAVA_OPTIONS} ${MEMORY_OPTIONS} ${APP_OPTIONS} data-showcase-1.0.7.war
```

Example configuration file `data-showcase-internal.yml`:
```yaml
dataShowcase:
    environment: Internal
    accessToken: '<configure a secure token>'
    ntrLogo: '/<path to the logo>/<file name>'
    vuLogo: '/<path to the logo>/<file name>'
dataSource:
    url: jdbc:postgresql://localhost:5432/data_showcase
    username: datashowcase
    password: <configure a secure password>
```

## Testing

```bash
cd data-showcase

# Run unit tests
./gradlew -Dgrails.env=test test

# Run unit tests for the internal environment
./gradlew -Dgrails.env=testInternal test

# Run unit tests and user interface unit tests
./gradlew -Dgrails.env=test check
```

For end-to-end API tests, see [data-showcase-api-e2e](data-showcase-api-e2e).
For user interface end-to-end tests, see [user-interface](data-showcase/src/main/user-interface).

### Continuous integration

Bamboo plan: [DS-DEV](https://ci.ctmmtrait.nl/browse/DS-DEV).

## License
Copyright &copy; 2017&ndash;2018  The Hyve B.V.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the [GNU Affero General Public License](LICENSE)
along with this program. If not, see https://www.gnu.org/licenses/.


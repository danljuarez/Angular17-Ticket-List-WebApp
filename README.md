# Project Angular 17 - Ticket List System UI Webapp
#### Author: Daniel Juarez

## Project Overview
This UI project was developed in conjunction with a [backend API project](https://github.com/danljuarez/cSharp-RestAPI-NetCore-TicketList) (not included in this repository) to showcase the author's full-stack development experience with Angular and C# for technical interview purposes.

This implementation focuses on the core foundational features commonly found in a Angular project, including:

**User interaction**
- Designing a user-friendly interface for interacting with a ticket list system.
- Implementing a responsive layout to ensure compatibility across various devices and screen sizes.
- Displaying and updating data in real time.
- Enabling filtering functionality for tickets based on name, description, date, and other criteria using Angular Material.
- Enabling column sorting and pagination using Angular Material.

**Angular Best Practices**
- Following TypeScript best practices.
- Using Angular CLI to scaffold the project and manage dependencies when required.
- Using Angular Material for UI components.
- Using Angular Router for routing.
- Using Angular Services for data management.
- Using Angular Observables for data streaming.
- Using Angular Reactive Forms for data validation.

**Integration with backend API**
- Integration with a [backend API](https://github.com/danljuarez/cSharp-RestAPI-NetCore-TicketList) to fetch and update data.
- Implementing services with API calls to create, read, update, and delete data.

**For unit tests**
- Implementing Isolated Unit Tests using Karma/Jasmine.
- Implementing Code Coverage using Istanbul.

If discussed during an interview, I am available to provide detailed explanations of these approaches, including the reasoning behind design choices and their practical advantages in real-world application development.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.10.

## This project works in conjunction with
- A [backend API](https://github.com/danljuarez/cSharp-RestAPI-NetCore-TicketList) (not included in this repository) that handles data storage and retrieval.
- A [microservice](https://github.com/danljuarez/cSharp-Azure-Functions-AddTickets) (not included in this repository) that can optionally be used to import multiple tickets into the backend API using Azure Functions V4.


## To run this project
- **Version compatibility**<br/>
This webapp uses following compatible Angular tools version:

    | Angular| Node.js | TypeScript	| RxJS |
    | --- | --- | --- | --- |
    | 17.3.11 | 20.9.0	 | 5.2.2 | 7.8.1

- **Clear Angular CLI cache**<br/>
To clear the Angular CLI persistent disk cache, run the following command in your terminal:
    ```console
    ng cache clear
    ```

- **Install all npm components**<br/>
To install all npm components, run the following command in your terminal:
    ```console
    npm install
    ```
    or
    ```console
    npm i
    ```
    **Note**: At this time, ignore the `npm WARN deprecated` messages.

- **Build**<br/>
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
    ```console
    ng build
    ```
    **Note**: At this time, ignore the `[WARNING]` message.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/` in your preferred browser. The application will automatically reload if you change any of the source files.

**Note**: [Backend API](https://github.com/danljuarez/cSharp-RestAPI-NetCore-TicketList) (not included in this repository) that handles data storage and retrieval need to be running before the UI is executed: [cSharp-RestAPI-NetCore-TicketList](https://github.com/danljuarez/cSharp-RestAPI-NetCore-TicketList)

```console
ng serve
```

It will generate the following result in your browser:

**For Desktop:**

![](./screenshots/screenshot-01.JPG)

**For Mobile** (iPhone 12 Pro):

![](./screenshots/screenshot-02.JPG)


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
```console
ng test
```
or
```console
ng test --browsers=Chrome --watch
```
It will show following result:

![](./screenshots/screenshot-03.JPG)


## Run test-coverage
Run `ng test` to verify test coverage.
```console
ng test --no-watch --code-coverage
```
Look for `index.html` file in the following location:
```console
C:\<YourDrivePath>\Angular17-Ticket-List-WebApp\coverage\angular17-ticket-list-web-app\index.html
```
Open `index.html` in your preferred browser to see the results:

![](./screenshots/screenshot-04.JPG)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

Thank You.

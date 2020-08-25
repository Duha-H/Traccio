<a href="https://traccio.app" style="display: block; text-align: center;" alt="traccio logo"><img src="./src/assets/logo_traccio@2x.png"/></a>
====================

An app to help you track your job-search journey. Onward!<br><br>
**[What is *traccio*?](#what-is-traccio)**<br>
**[Sneak Peeks!](#sneak-peeks)**<br>
**[Libraries/Frameworks Used](#libraries/frameworks-used)**<br>
**[Credits](#credits)**<br>
**[License](#license)**<br>
<br>

### What is *traccio*?
___

*traccio* is a simple job hunt tracking application. It allows users to organize their job search endeavors, log in job applications they've submitted, and conveniently track them. It also helps users better monitor their progress, and distill different trends in their job hunt process.
<br>
<br>

### Sneak Peeks!
___
[add screenshots here later]
<br>
<br>


### Libraries/Frameworks Used
___
*traccio* is a serverless **Angular 9** web app, with an **AWS** backend setup for authentication and storage.<br>
Libraries used:
- [Angular Material](https://material.angular.io/) (specific usage details can be found [here](link-to-wiki))
- [nivo charts](https://nivo.rocks/) <br>
  *nivo* is a data-visualization *Reactjs* library, so I had to jump through *some* hoops to use this library in my *Angular* app, but it was one of the main inspirations behind the idea for this app, so I couldn't really compomise on using it. Usage details can be found [here](link-to-wiki).
- [hammerjs](https://hammerjs.github.io/) <br>
  For simple mobile swiping gestures utilized in the app. Usage details can be found [here](link-to-wiki).
- [rxjs](https://github.com/ReactiveX/RxJS) (specific usage details can be found [here](link-to-wiki))
- [aws-amplify](https://aws-amplify.github.io/) (specific usage details can be found [here](link-to-wiki))<br>

Backend setup (serverless **AWS** architecture):
- [Cognito](https://aws.amazon.com/cognito/) authentication setup and user pool
- [DynamoDB](https://aws.amazon.com/dynamodb/) database storage
- [GraphQL](https://aws.amazon.com/dynamodb/) API endpoint, created and managed using [AWS Lambda](https://aws.amazon.com/lambda/)<br>
Additional setup details can be found [here](link-to-wiki)

<br>
<br>

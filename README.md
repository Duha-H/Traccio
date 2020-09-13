<p align="center"><a href="https://traccio.app" style="display: block; text-align: center;" alt="traccio logo"><img width="350px" src="./src/assets/logo_traccio@2x.png"/></a></p>

<p align="center">It's job-search tracking, but better!</p><br><br>

- **[What is *traccio*?](#what-is-traccio)**<br>
- **[Sneak Peeks!](#sneak-peeks)**<br>
- **[Libraries/Frameworks](#librariesframeworks)**<br>
- **[Credits](#credit)**<br>
- **[License](#license)**<br>
- **[Support](#support)**<br>
<br>

What is *Traccio*?
===

*Traccio* is a simple job hunt tracking application. It allows users to organize their job search endeavors, log in job applications they've submitted, and conveniently track them. It also helps users better monitor their progress, and distill different trends in their job hunts.
<br>
<br>

Sneak Peeks!
===
[add screenshots here later]
<br>
<br>

Libraries/Frameworks
===
*Traccio* is a serverless **Angular 9** web app, with an **AWS** backend setup for authentication and storage.<br>
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

Credit
===
Just some specific thanks to cool open-source packages used in the app :star2:
- [nivo](https://nivo.rocks/)
- [hammerjs](https://hammerjs.github.io/)
<br>
<br>

License
===
Licensed under the MIT License.

Copyright (c) 2020 Duha Hassan
<br>
<br>

Support
===
Enjoying using *Traccio* and feeling generous?

Tips are more than welcome, and help [me](https://github.com/Duha-h) continue to host and maintain Traccio :)

<a href="https://paypal.me/traccioapp"><img src="./src/assets/tip_button.png" width="150px"></a>

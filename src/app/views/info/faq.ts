export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'Why should I use Traccio?',
    // tslint:disable-next-line: max-line-length
    answer: 'Traccio is a simple and intuitive organizational tool. Job hunts are a full-time job, that can sometimes be soul-draining and with little immediate reward. Traccio helps make your job-search just a bit more tolerable, and provides you with the tools needed to stay motivated!'
  },
  {
    question: 'How does Traccio help?',
    // tslint:disable-next-line: max-line-length
    answer: 'An organized job search is a more effective one, and Traccio provides you with the tools to keep track of your applications in one place (No more sending out multiple applications to the same potential employer). It also helps you visualize how your job search is panning out; keep track of how frequently you\'re applying, and oversee how effective your search is by tracking how often you\'ve heard back.'
  },
  {
    question: 'What\'s the point of Journeys?',
    // tslint:disable-next-line: max-line-length
    answer: 'Journeys are meant to help you bundle applications sent out for different job-hunts. You were applying for internships last summer? That\'s a Journey! You want to separate and compare your search for your entry level position 3 years ago, and your current search for your next role? Those are two different Journeys! They\'re simply there to help you split different job-hunts and make your data-tracking more meaningful.'
  },
  {
    question: 'What\'s the point of Wishlist Applications?',
    // tslint:disable-next-line: max-line-length
    answer: 'Wishlist applications are applications you plan to send out in the future but haven\'t submitted yet. They simply allow you to pre-emptively track them, and add them to any Journey at a later date. In the future, Traccio might allow you to set deadlines for Wishlist Applications, and send you reminders to apply!'
  },
  {
    question: 'What can I learn from my Dashboard?',
    // tslint:disable-next-line: max-line-length
    answer: 'Your Dashboard is Traccio\'s heart and soul:<br>\
      &#8226; &nbsp; It\'s a stats-hub for any given Journey: it provides you with details about how often you\'re applying. Say you want to set an application quota for a given week, and keep track of whether or not you met that quota? Your Dashboard is here to save the day! <br>\
      &#8226; &nbsp; It also helps you visualize a breakdown of how effective your job-hunt potentially is, by distilling the status of different applications you sent out. <br>\
      &#8226; &nbsp; It gives you a productivity calendar; hopefully a more colorful Calendar is a decent motivator for you to keep going! <br>\
      (p.s. all those neat-o data-visualization components? They\'re courtesy of <a href="https://nivo.rocks/">nivo</a> and you should check it out)'
  },
  {
    question: 'What exactly does the "Search" functionality search through?',
    // tslint:disable-next-line: max-line-length
    answer: 'The "Search" functionality helps you search through Journeys, submitted applications, and Wishlist applications. It\'s simply there so you can quickly find out if you\'ve submitted an application already, so you can avoid re-submitting it, or re-applying before a specific buffer period at a given company.'
  },
  {
    question: 'How can I access Traccio more easily on mobile?',
    // tslint:disable-next-line: max-line-length
    answer: 'Traccio was built with responsiveness in mind, and it has a few neat mobile quirks! You can simply add it to your Home Screen so it\'s easier to reach. <br>\
      On iOS: <br>\
      &#8226; &nbsp; Launch Safari, and go to <a href="https://www.traccio.app">traccio.app</a> <br>\
      &#8226; &nbsp; Tap the Share icon (a square with an arrow pointing out) at the bottom of the screen <br>\
      &#8226; &nbsp; Select \'Add to Home Screen\' from the list of actions <br>\
      On Android: <br>\
      &#8226; &nbsp; Launch the Chrome app, and go to <a href="https://www.traccio.app">traccio.app</a> <br>\
      &#8226; &nbsp; Tap the menu icon (three vertical dots icon) at the upper right-hand corner <br>\
      &#8226; &nbsp; Select \'Add to homescreen\' <br>\
      And you\'re all set!'
  },
  {
    question: 'What does the "Application Inactivity" measure in my account preferences mean?',
    // tslint:disable-next-line: max-line-length
    answer: '"Application Inactivity" is the number of days after which an application status is automatically set to \'Stale/Ghosted\'. It is set to <i>90 days</i> by default, but you can change that value to whatever you see fit in your account preferences.'
  },
  {
    question: 'What does the "Journey Inactivity" measure in my account preferences mean?',
    // tslint:disable-next-line: max-line-length
    answer: '"Journey Inactivity" is the number of days after which a given Journey is automatically set to \'inactive\'. It is set to <i>60 days</i> by default, but you can change that value to whatever you see fit in your account preferences.'
  },
  {
    question: 'What should I do if a feature is not behaving as expected?',
    // tslint:disable-next-line: max-line-length
    answer: 'Sorry that you\'re experiencing that! You can email your support request to <a href="mailto: support@traccio.app">support@traccio.app</a> with the subject line "Support Request". Be sure to include any screenshots that might aid in resolving your issue.'
  },
  {
    question: 'What should I do if I would like to report a bug in the application?',
    // tslint:disable-next-line: max-line-length
    answer: 'Bugs are no fun. If you think you\'ve found a bug in the application, you can choose one of the following options: <br>\
      Option 1: <br>\
      &#8226; &nbsp; Email your bug report to <a href="mailto: support@traccio.app">support@traccio.app</a> with the subject line "Bug Report" <br>\
      &#8226; &nbsp; Be sure to include any screenshots or info that might help in squashing it! <br>\
      Option 2: <br>\
      &#8226; &nbsp; Open an issue in the app <a href="https://github.com/Duha-H/Tracker-App">repository</a> <br>\
      &#8226; &nbsp; Be sure to include any screenshots or info that might help'
  },
  {
    question: 'I have a cool feature/functionality idea, how can I request that?',
    // tslint:disable-next-line: max-line-length
    answer: 'Sick! You can choose one of the following options to send out your idea/feature request: <br>\
      Option 1: <br>\
      &#8226; &nbsp; Email your feature request to <a href="mailto: support@traccio.app">support@traccio.app</a> with the subject line "Feature Request" <br>\
      Option 2: <br>\
      &#8226; &nbsp; Open an issue in the app <a href="https://github.com/Duha-H/Tracker-App">repository</a> <br> with your feature request'
  },
  {
    question: 'I have some general feedback about the application that I\'d like to give, where can I do that?',
    // tslint:disable-next-line: max-line-length
    answer: 'Love to hear it! You can email your feedback to <a href="mailto: support@traccio.app">support@traccio.app</a> with the subject line "Feedback".'
  },
  {
    question: 'Is Traccio going to include paid features at any point?',
    // tslint:disable-next-line: max-line-length
    answer: 'Traccio is currently a one (wo)man shop, so as the user-base grows some cool new (potentially) paid features might be added to offset the costs of application-hosting and user-storage. Not to worry though, for users joining now (as in if you can read this message with no indicated updates to it, and you\'re currently signed up, you are one of those users), Traccio will continue to provide its core set of features for free (no switching to a subscription-based model or anything like that). However, tips are most appreciated and welcome! :)'
  },
  {
    question: '"Traccio" is a silly name, why is it called that :)?',
    // tslint:disable-next-line: max-line-length
    answer: 'Funny story! (it\'s actually not that funny at all) The app was originally called Tracker (as in job-search tracker) in development, but try to get <i>tracker.app</i> or <i>tracker-app.com</i> as your domain for cheap (trick question, you can\'t!). So Trac<i>cio</i> was a close-enough, neat-sounding alternative (with an available domain!) that came to me in a daydream.'
  },
];

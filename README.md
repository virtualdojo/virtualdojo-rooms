# VirtualDojo Rooms
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
https://www.virtualdojo.it/

Create and manage classroom sessions with multiple video chat rooms. 

## Motivations
The idea is born from various [CoderDojo](https://coderdojo.com/) mentors that were looking for an open source tool with the following characteristics:

- Can create and manage classroom sessions (we call it events) with an high number participants (more than 50)
- Is meant to be used by multiple teachers(mentors) in the same classroom
- Provides basic video/audio/text chat capabilities
- Has an easy way to share participants' screen at the same time
- Enables teachers to move participants automatically between rooms
- Integrates a document viewer, usually we have a small set of topics per events 

If want to know more, we have some blog posts about our story ([Part1](https://medium.com/@angiulina1984/tutto-quello-che-serve-sapere-per-organizzare-un-virtual-dojo-8f3e5ec45a08) - [Part2](https://medium.com/@gbonanome/virtualdojo-seconda-iterazione-4a9299bd4521)). The posts are in Italian but we're planning to translate them in the future.

Most of the contributors are mentor from several CoderDojo organizations in Italy, we're not directly affiliated with CoderDojo Foundation.

## Development
Create a new Firebase project and copy and rename the `.env` file to `.env.development.local` and add your Firebase Web credentials. Remember to enable anonymous authentication.

To start development run the following commands:

```
npm i
npm start
```

To deploy in production you have to create a new Firebase Web app and add the credentials to `.env.production.local`. Install the Firebase CLI and init your project with hosting enabled, then run:

```
npm run deploy
```

## Technologies

- **Jitsi**: Video/audio/text chat
- **Firebase**: Hosting and Database with subscriptions
- **React**: Frontend

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/andtos90"><img src="https://avatars2.githubusercontent.com/u/2692166?v=4" width="100px;" alt=""/><br /><sub><b>Andrea Tosatto</b></sub></a><br /><a href="https://github.com/virtualdojo/virtualdojo-rooms/commits?author=andtos90" title="Code">💻</a> <a href="https://github.com/virtualdojo/virtualdojo-rooms/commits?author=andtos90" title="Documentation">📖</a> <a href="#design-andtos90" title="Design">🎨</a></td>
    <td align="center"><a href="https://peterampazzo.com"><img src="https://avatars0.githubusercontent.com/u/4621567?v=4" width="100px;" alt=""/><br /><sub><b>Pietro Rampazzo</b></sub></a><br /><a href="https://github.com/virtualdojo/virtualdojo-rooms/commits?author=peterampazzo" title="Code">💻</a> <a href="#ideas-peterampazzo" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/esthercodes"><img src="https://avatars2.githubusercontent.com/u/8407403?v=4" width="100px;" alt=""/><br /><sub><b>Esther</b></sub></a><br /><a href="https://github.com/virtualdojo/virtualdojo-rooms/commits?author=esthercodes" title="Code">💻</a> <a href="#design-esthercodes" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
## Sponsors

<a href="https://www.tes.com"><img src="https://www.tes.com/logo.svg?variation=black" height="50px" /></a>

Some of the contributors are Tes employees. Thanks Tes for giving time to develop and release this tool as an open source project.

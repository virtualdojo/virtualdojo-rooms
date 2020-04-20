# VirtualDojo Rooms
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
https://app.virtualdojo.it/

Create and manage classroom sessions with multiple video chat rooms. It can also be useful to organise small conference or meetup with various topics.

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|<img width="1440" alt="create new event" src="https://user-images.githubusercontent.com/2692166/79786536-e9fee680-8345-11ea-82f7-83e56af343eb.png">  Create New Event |  <img width="1440" alt="join event" src="https://user-images.githubusercontent.com/2692166/79786530-e79c8c80-8345-11ea-85c5-5b3854ac74a5.png"> Join Event | 
| <img width="1440" alt="jitsi view" src="https://user-images.githubusercontent.com/2692166/79785564-5678e600-8344-11ea-9322-069411321969.png"> Main Screen (Jitsi) | <img width="1440" alt="rooms view" src="https://user-images.githubusercontent.com/2692166/79785740-a657ad00-8344-11ea-81b7-0ddf01f0681f.png">  Rooms |
|<img width="1440" alt="documents" src="https://user-images.githubusercontent.com/2692166/79785759-ace62480-8344-11ea-975e-3373000feacb.png"> Shared Documents | <img width="1440" alt="settings" src="https://user-images.githubusercontent.com/2692166/79786349-97bdc580-8345-11ea-9c17-bb6619b16e9b.png"> Settings | 

## Motivations
The idea is born from various [CoderDojo](https://coderdojo.com/) mentors that were looking for an open source tool with the following characteristics:

- Can create and manage classroom sessions (we call it events) with more than 50 participants
- Is meant to be used by multiple teachers(mentors) in the same classroom
- Provides basic video/audio/text chat capabilities
- Has an easy way to share participants' screen at the same time
- Creates new rooms on the fly
- Enables teachers to move participants automatically between rooms
- Integrates a document viewer (usually we have a small set of topics per events)

If want to know more, we have some blog posts about our story ([Part1](https://medium.com/@angiulina1984/tutto-quello-che-serve-sapere-per-organizzare-un-virtual-dojo-8f3e5ec45a08) - [Part2](https://medium.com/@gbonanome/virtualdojo-seconda-iterazione-4a9299bd4521)). The posts are in Italian but we're planning to translate them in the future.

Most of the contributors are mentor from several CoderDojo organizations in Italy, we're not directly affiliated with CoderDojo Foundation.

## Development
Create a new Firebase project and copy and rename the `.env` file to `.env.development.local` and add your Firebase Web credentials. Remember to enable anonymous authentication.

We use also Firebase Functions and to enable local development set up [admin credential](https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional). The key should be located in `/functions/dev-admin.key.json`.

To start development run the following commands:

```
npm i
npm start
```

Then, open another terminal and run the Functions emulator:

```
cd functions
npm run serve
```

## Deploy

To deploy in production you have to create a new Firebase Web app and add the credentials to `.env.production.local`. Install the Firebase CLI and init your project with hosting enabled, then run:

```
npm run deploy
```

Check `package.json` to see how to deploy to dev and production with different environment variables.

## Technologies

- **Jitsi**: Video/audio/text chat
- **Firebase**: Hosting and Database with subscriptions
- **React**: Frontend
- **Comic Neue**: A font that looks similar to Comic Sans 🎨

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

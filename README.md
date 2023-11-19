# Another Todo App

## Intention

Create a Todo app in Typescript without any major frameworks like Firebase or Appwrite.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Development

### Database Migrations

This app uses [sqitch](https://sqitch.org/) for applying database migrations. Note that you do not need to install sqitch in order to run it; instead it runs in a Docker container. You can run sqitch commands using the following script:

```
npm run sqitch -- <supply arguments here>
```

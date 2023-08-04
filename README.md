# Tap Web Platform Local

A web based learning and analytics platform for Tap3d.

## Libraries and Frameworks

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Propel Auth](https://www.propelauth.com/)

## Setup

```
$ yarn install
```

### Dependencies

- Node (runtime)
- Yarn (package manager)

### IDE

The prefered editor is Visual Studio Code (VS Code). It's recommended that contributors install the following extension:

- ESLint
- Prettier

## Local Development

All yarn scripts can be found in the `package.json`. To start a development server run.

```
$ yarn dev
```

## Storybook

Buil the storybook site to preview components.

```
$ yarn storybook
```


### Environment

Environment variables pulled from `.env` files. Copy the `.env.example` file and create a `.env.local` file. All environment variables can be defined here.

## Testing

Unit testing framework is Jest.


```
$ yarn test
```

## Database

PostgreSQL is used as the database, and KnexJS is used as the framework for working with it.

```
$ yarn knex --help
```

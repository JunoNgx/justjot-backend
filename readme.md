# JustJot (backend)

A minimalist keyboard-first note-taking Progressive Web App, tailored for fast operations.

Frontend repository [here](https://github.com/JunoNgx/justjot-frontend).

## Deployment status
[![Deploy to ftp server](https://github.com/JunoNgx/justjot-backend/actions/workflows/main.yml/badge.svg)](https://github.com/JunoNgx/justjot-backend/actions/workflows/main.yml)

This production deployment of JustJot is provided by [PocketHost](https://pockethost.io/).

## Overview

[JustJot](https://justjot.app/) is powered by [PocketBase](https://pocketbase.io/). This repository is a set of JS hooks for PocketBase, catered to specific business logic beyond what PocketBase provided out of the box.

It should be noted that PocketBase's JS hooks are powered by [GoJa](https://github.com/dop251/goja), a VM implementation of JavaScript in Go, which come with a lot of caveats.

## Features

With CRUD and authentication logic provided by PocketBase out of the box, the logic in this repository merely serves as extra fine-tuning and data processing to enrich the user data, such as item type classification, meta-data fetching, and management of test account.

## Schemas and migrations

Related [PocketBase documentation](https://pocketbase.io/docs/js-migrations/).

Migration scripts are stored in the `pb_migrations` directory, and is auto-generated from changes made in the schema in the admin UI (as per default settings).

The directory `_misc` stores the schema of the application at the release candidate milestone (in mid-April 2024). The migration scripts in this repository handles changes in the database schema from this point onwards.

For development purposes, to undo the previous migrations (aka, "migrate down"), run `./pocketbase migrate down [n]` (without brackets), with `n` being the number of migrations.

## Branches

An alternative version of the logics implemented in this repository can be found in the `go` branch (incomplete and not up-to-date), where they are implemented in native Go, with PocketBase as a Go framework, compiling to custom binary executable.

## Running locally

This repository requries a PocketBase executable. JustJot was first developed with PocketBase version `0.22.7`.

With PocketBase executable placed in this repository (which is already `gitignore`'ed):

```
./pocketbase serve
```

## Environment varible

This application does not require any environment variables for runtime.

However, there are CI/CD pipelines via GitHub actions that would deploy the JS hooks into the PocketHost instance, whose secret variables are to be managed on GitHub:
* FTP_PASSWORD
* FTP_SERVER
* FTP_USERNAME


## Schema

The database schema used by JustJot is stored in the directory `_misc`.

## Feature roadmap
* Refactor to TypeScript.
* Unit and integration tests.

## Contribution
For bug reporting, issues, and design suggestions, please open new issues.

Due to the highly personal nature of this, I am selective about what to be developed and merged into production. Please discuss with me prior to investing non-trivial efforts.

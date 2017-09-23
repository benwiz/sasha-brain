# Sasha

Sasha is a decision center. Sasha tracks the current-state-of-the-world and the desired-state-of-the-world. Sasha can be queried for some or all of the world's properties. In addition to responding with both states of the world, Sasha will also include a set of commands/instructions/actions that must take place to modify the current-state-of-the-world so that it matches the desired-state-of-the-world.

Example uses:

- Control the lights
- Control the music
- Analyze my journal and make predictions/suggestions
- Be my to do list and reminder system
- Wake me up in the morning

Basically, my own personal assisant.

## Relationship to Umbra and Zing

Umbra and Zing are collections of microserves that query Sasha in order to know what action to take. They are also frequently reporting in to Sasha so that the current-state-of-the-world is as up-to-date as possible.

## Get up and running locally

Run Sasha

```bash
docker-compose up
```

## To Do

- Maintain the current state of the world (going to see if inmem works, but must create using a module so it's easy to change)
- Maintain the desired state of the world

- Planning/architecture/design
  - Design UI
  - How are people (users) considered in logic? How are they tracked?

## Notes

### Note 1 - 8/30/17

- The first app I created is called _core_. It will probably need to be replaced with more specific apps like _home_, _online_, or other names.
- All apps except for _core_ should begin their endpoint with `/appname/...`

### Note 2 - 9/3/17

- If I start adding more and more background services (e.g. fb listener) I should figure out a better way to run parallel processes in Django or consider separating out these jobs into another Docker container.

### Note 3 - 9/23/17

- Removed all the fb and google sheets stuff
- Decided on a better structure of current/desired states + commands on a query

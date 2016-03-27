# pwr

As of now this is in proof-of-concept mode and I'm too lazy to write docs and
install instructions (you need `electron-prebuilt` and then `npm install` the
deps). There's a lot of work to be done, but it's definitely working out :)

## Notes

* Battery watch interval is currently 5 (seconds). This is way too short, on
  release it should be increased to at least 60 or 120.
* The line that actually quits apps is commented our right now, so that apps
  don't close while testing lol

## TODO

* Right now, each app is quit at every interval, meaning every minute the
  we are trying to close apps that might not be open. Because this app is for
  saving power, we want to do as little as we need to, so only close apps once -
  when the battery threshold is reached.
* Quit apps by full path rather than name, maybe
* Probably want to add the option of multiple thresholds, e.g. close W at X% and
  Y at Z%.
* Want to display current battery percentage in the UI
* Finish right side styling, I'm thinking make the selection smaller. Both
  buttons should remain far from each other to prevent accidental clicking.

# pwr

As of now this is in proof-of-concept mode and I'm too lazy to write docs and
install instructions (you need `electron-prebuilt` and then `npm install` the
deps). There's a lot of work to be done, but it's definitely working out :)

## TODO

* Right now, each app is quit at every interval, meaning every minute the
  we are trying to close apps that might not be open. Because this app is for
  saving power, we want to do as little as we need to, so only close apps once -
  when the battery threshold is reached.
* Basic styling lol
* Probably want to add the option of multiple thresholds, e.g. close W at X% and
  Y at Z%.
* Want to display current battery percentage in the window for funzies and cuz
  it's not hard. Idk if it's worth the extra computation (maybe not, it's like
  right there anyways)
* Want the app to live in the menu bar; the window should just hide and not
  actually close when the red x is clicked.


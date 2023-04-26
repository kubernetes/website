---
title: "zsh Autovervollständigung"
description: "Optionale Konfiguration der zsh Autovervollständigung."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Das kubectl Autovervollständigungsskript für Zsh kann mit folgendem Befehl `kubectl completion zsh` generiert werden.Mit dem Befehl `kubectl completion zsh | source` aktivieren Sie die Autovervollständigung in ihrer aktuellen Sitzung.

Um die Autovervollständigung in allen Sitzungen einzurichten, tragen sie den folgenden Befehl in Ihre `~/.zshrc` Datei ein:

```zsh
source <(kubectl completion zsh)
```

Wenn sie ein Alias für kubectl eingerichtet haben, funktioniert die kubectl Autovervollständung automatisch.

Nach dem Neuladen Ihrer Shell, sollte die kubectl Autovervollständigung funktionieren.

Sollte ein Fehler auftreten wie dieser: `2: command not found: compdef`, fügen Sie bitte folgendes am Anfang Ihrer `~/.zshrc` Datei ein:

```zsh
autoload -Uz compinit
compinit
```
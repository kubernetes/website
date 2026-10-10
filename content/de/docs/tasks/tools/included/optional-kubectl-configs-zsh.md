---
title: "zsh Autovervollständigung"
description: "Optionale Konfiguration der zsh Autovervollständigung."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Das kubectl Autovervollständigungsskript für Zsh kann mit folgendem Befehl `kubectl completion zsh` generiert werden. Mit dem Befehl `kubectl completion zsh | source` wird die Autovervollständigung in der aktuellen Sitzung aktiviert.

Um die Autovervollständigung in allen Sitzungen einzurichten, muss folgender Befehl in die `~/.zshrc` Datei eingetragen werden:

```zsh
source <(kubectl completion zsh)
```

Falls ein Alias für kubectl eingerichtet wurde, funktioniert die kubectl Autovervollständung automatisch.

Nach dem Neuladen der Shell, sollte die kubectl Autovervollständigung funktionieren.

Sollte ein Fehler auftreten wie dieser: `2: command not found: compdef`, muss bitte folgendes am Anfang der `~/.zshrc` Datei eingefügt werden:

```zsh
autoload -Uz compinit
compinit
```
---
title: "fish Autovervollständigung"
description: "Optionale Konfiguration im die fish shell Autovervollständigung einzurichten."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Autovervollständigung für Fish benötigt kubectl 1.23 oder neuer.
{{< /note >}}

Das kubectl Autovervollständigungsskript für Fish kann mit folgendem Befehl `kubectl completion fish` generiert werden. 
The kubectl completion script for Fish can be generated with the command `kubectl completion fish`. Mit dem Befehl `kubectl completion fish | source` aktivieren Sie die Autovervollständigung in ihrer aktuellen Sitzung.

Um die Autovervollständigung in allen Sitzungen einzurichten, tragen sie den folgenden Befehl in Ihre `~/.config/fish/config.fish` Datei ein.

```shell
kubectl completion fish | source
```

Nach dem Neuladen Ihrer Shell, sollte die kubectl Autovervollständigung funktionieren.
---
title: "fish Autovervollständigung"
description: "Optionale Konfiguration um die fish shell Autovervollständigung einzurichten."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Autovervollständigung für Fish benötigt kubectl 1.23 oder neuer.
{{< /note >}}

Das kubectl Autovervollständigungsskript für Fish kann mit folgendem Befehl `kubectl completion fish` generiert werden. Mit dem Befehl `kubectl completion fish | source` wird die Autovervollständigung in der aktuellen Sitzung aktiviert.

Um die Autovervollständigung in allen Sitzungen einzurichten, muss folgender Befehl in die `~/.config/fish/config.fish` Datei eingetragen werden:

```shell
kubectl completion fish | source
```

Nach dem Neuladen der Shell, sollte die kubectl Autovervollständigung funktionieren.
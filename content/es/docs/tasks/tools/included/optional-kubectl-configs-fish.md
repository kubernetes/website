---
title: "autocompletado con fish"
description: "Configuración opcional para habilitar el autocompletado en la shell fish."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
El autocompletado para Fish necesita de kubectl versión 1.23 o superior.
{{< /note >}}

El script de autocompletado de Fish para kubectl puede ser generado con el comando `kubectl completion fish`. Ejecutando este comando en tu shell habilitará el autocompletado de kubectl para Fish.

Para qué funcione en sus futuras sesiones shell, debes agregar la siguiente línea al archivo `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Después de recargar tu shell, el autocompletado para kubectl estará funcionando automáticamente.


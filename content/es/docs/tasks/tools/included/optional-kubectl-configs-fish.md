---
title: "autocompletado con fish"
description: "Configuracion Opcional para habilitar el autocompletado en la shell fish."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
El autocompletado para Fish necesita de kubectl versión 1.23 o superior.
{{< /note >}}

El script de autocompletado de Fish para kubectl puede ser generado con el comando `kubectl completion fish`. Ejecutando este comando en su shell habilitará el autocompletado de kubectl para fish.

Para qué funcione en sus futuras sesiones shell, debe agregar la siguiente línea al archivo `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Después de recargar su shell el autocompletado para kubectl estará funcionando automáticamente.


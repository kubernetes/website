---
title: "Autocompletado con Fish"
description: "Configuración opcional para habilitar el autocompletado de la shell Fish"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Se requiere kubectl 1.23 o superior para utilizar el autocompletado de Fish.
{{< /note >}}

El script de autocompletado de Fish puede ser generado con el comando `kubectl completion fish`. Leyendo este archivo en su Shell habilita el autocompletado de kubectl.

Para hacer esto en todas sus sesiones agregue la siguiente linea a su archivo `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Después de recargar tu shell, el autocompletado para kubectl estará funcionando automáticamente.


---
title: "Autocompletar do fish"
description: "Configurações opcionais para ativar o autocompletar no shell fish."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
O autocompletar para Fish requer kubectl 1.23 ou posterior.
{{< /note >}}

O script de autocompletar do kubectl para Fish pode ser gerado com o comando `kubectl completion fish`. O script permite habilitar o autocompletar do kubectl no seu shell.

Para fazer isso em todas as suas sessões do shell, adicione a seguinte linha ao seu arquivo `~/.config/fish/config.fish`:

```shell
kubectl completion fish | source
```

Depois de recarregar seu shell, o autocompletar do kubectl deve estar funcionando.

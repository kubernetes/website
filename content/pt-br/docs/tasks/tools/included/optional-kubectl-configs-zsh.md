---
title: "Autocompletar zsh"
description: "Configurações opcionais para ativar o autocompletar no shell zsh."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

O script de autocompletar do kubectl para Zsh pode ser gerado com o comando `kubectl completion zsh`. Este script habilita o kubectl autocompletar no seu shell.

Para fazer isso em todas as suas sessões de shell, adicione a seguinte linha no arquivo ~/.zshrc:

```zsh
source <(kubectl completion zsh)
```

Se você tiver um alias para kubectl, o autocompletar funcionará automaticamente com ele.

Depois de recarregar seu shell, o kubectl autocompletar deve estar funcionando.

Se você receber um erro como `2: command not found: compdef`, adicione o seguinte bloco ao início do seu arquivo `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```

---
title: "Autocompletar zsh"
description: "Alguna configuración opcional para la finalización automática de zsh."
headless: true
---

El script de completado de kubectl para Zsh se puede generar con el comando `kubectl completion zsh`. Obtener el script de completado en su shell habilita el autocompletado de kubectl.

Para hacerlo en todas sus sesiones de shell, agregue lo siguiente a su perfil `~/.zshrc`:

```zsh
source <(kubectl completion zsh)
```
Si tiene un alias para kubectl, puede extender el completado del shell para trabajar con ese alias:

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'compdef __start_kubectl k' >>~/.zshrc
```

Después de recargar su shell, el autocompletado de kubectl debería estar funcionando.

Si recibe un error como `complete:13: command not found: compdef`, 
luego agregue lo siguiente al comienzo de su perfil `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```
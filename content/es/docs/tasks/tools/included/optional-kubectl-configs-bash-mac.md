---
title: "Autocompletar bash en macOS"
description: "Alguna configuración opcional para la finalización automática de bash en macOS."
headless: true
---

### Introducción

El script de completado de kubectl para Bash se puede generar con `kubectl completion bash`. Obtener este script en su shell permite el completado de kubectl.

Sin embargo, el script de finalización de kubectl depende de [**bash-completion**](https://github.com/scop/bash-completion) que, por lo tanto, debe instalar previamente.

{{< warning>}}
Hay dos versiones de bash-complete, v1 y v2. V1 es para Bash 3.2 (
que es el predeterminado en macOS), y v2 es para Bash 4.1+. El script de completado de kubectl **no funciona** correctamente con bash-complete v1 y Bash 3.2. Requiere **bash-complete v2** y **Bash 4.1+**. Por lo tanto, para poder usar correctamente la finalización de kubectl en macOS, debe instalar y usar Bash 4.1+ ([*instrucciones*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Las siguientes instrucciones asumen que usa Bash 4.1+ (es decir, cualquier versión de Bash de 4.1 o posterior).
{{< /warning >}}

### Actualizar Bash

Las siguientes instrucciones asumen que usa Bash 4.1+. Puede verificar la versión de su Bash ejecutando:

```bash
echo $BASH_VERSION
```
Si es demasiado antiguo, puede instalarlo o actualizarlo usando Homebrew:

```bash
brew install bash
```
Vuelva a cargar su shell y verifique que se esté utilizando la versión deseada:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew generalmente lo instala en `/usr/local/bin/bash`.

### Instalar bash-complete

{{< note >}}
Como se mencionó antes, estas instrucciones asumen que usa Bash 4.1+, lo que significa que instalará bash-completacion v2 (a diferencia de Bash 3.2 y bash-deployment v1, en cuyo caso el completado de kubectl no funcionará).
{{< /note >}}

Puede probar si ya tiene instalado bash-complete v2 con `type _init_completion`. Si no es así, puede instalarlo con Homebrew:

```bash
brew install bash-completion@2
```

Como se indica en el resultado de este comando, agregue lo siguiente a su archivo `~/.bash_profile`:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Vuelva a cargar su shell y verifique que bash-complete v2 esté instalado correctamente con `type _init_completion`.

### Habilitar el autocompletado de kubectl

Ahora debe asegurarse de que el script de completado de kubectl se obtenga en todas sus sesiones de shell. Hay varias formas de lograrlo:

- Obtenga el script de finalización en su perfil `~/.bash_profile`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Agregue el script de completado al directorio `/usr/local/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Si tiene un alias para kubectl, puede extender el completado del shell para trabajar con ese alias:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- Si instaló kubectl con Homebrew (como se explica [aquí](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)), entonces el script de completado de kubectl ya debería estar en `/usr/local/etc/bash_completion.d/kubectl`. En ese caso, no necesita hacer nada.

   {{< note >}}
   La instalación de Homebrew de bash-completion v2 genera todos los archivos en el directorio `BASH_COMPLETION_COMPAT_DIR`, es por eso que los dos últimos métodos funcionan.
   {{< /note >}}

En cualquier caso, después de recargar su shell, el completado de kubectl debería estar funcionando.
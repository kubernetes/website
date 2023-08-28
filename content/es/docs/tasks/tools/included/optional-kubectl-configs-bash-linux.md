---
title: "Autocompletar bash en Linux"
description: "Alguna configuración opcional para la finalización automática de bash en Linux."
headless: true
---

### Introducción

El script de completado de kubectl para Bash se puede generar con el comando `kubectl completion bash`. Obtener el script de completado en su shell habilita el autocompletado de kubectl.

Sin embargo, el script de completado depende de [**bash-completion**](https://github.com/scop/bash-completion), lo que significa que primero debe instalar este software (puedes probar si tienes bash-completion ya instalado ejecutando `type _init_completion`).

### Instalar bash-complete

El completado de bash es proporcionado por muchos administradores de paquetes (ver [aquí](https://github.com/scop/bash-completion#installation)). Puedes instalarlo con `apt-get install bash-completion` o `yum install bash-completion`, etc.

Los comandos anteriores crean `/usr/share/bash-completion/bash_completion`, que es el script principal de bash-complete. Dependiendo de su administrador de paquetes, debe obtener manualmente este archivo de perfil en su `~/.bashrc`.

Para averiguarlo, recargue su shell y ejecute `type _init_completion`. Si el comando tiene éxito, ya está configurado; de lo contrario, agregue lo siguiente a su archivo `~/.bashrc`:

```bash
source /usr/share/bash-completion/bash_completion
```

Vuelva a cargar su shell y verifique que la finalización de bash esté correctamente instalada escribiendo `type _init_completion`.

### Habilitar el autocompletado de kubectl

Ahora debe asegurarse de que el script de completado de kubectl se obtenga en todas sus sesiones de shell. Hay dos formas de hacer esto:

- Obtenga el script de completado en su perfil `~/.bashrc`:

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bashrc
   ```

- Agregue el script de completado al directorio de `/etc/bash_completion.d`:

   ```bash
   kubectl completion bash >/etc/bash_completion.d/kubectl
   ```

Si tiene un alias para kubectl, puede extender el completado del shell para trabajar con ese alias:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
El código fuente de bash-complete todos los scripts se encuentra en `/etc/bash_completion.d`.
{{< /note >}}

Ambos enfoques son equivalentes. Después de recargar su shell, el autocompletado de kubectl debería estar funcionando.
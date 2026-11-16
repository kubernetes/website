---
title: Define un comando y argumentos para un contenedor
content_type: task
weight: 10
---

<!-- overview -->

Esta página muestra cómo definir comandos y argumentos cuando ejecutas un contenedor
en un {{< glossary_tooltip term_id="pod" >}}.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Define un comando y argumentos cuando creas un Pod

Cuando creas un Pod, puedes definir un comando y/o argumentos para los
contenedores que se ejecutan en el Pod. Para definir un comando, incluye el campo `command`
en el archivo de configuración. Para definir argumentos para el comando, incluye
el campo `args` en el archivo de configuración. El comando y los argumentos que
definas no pueden ser cambiados después de que el Pod haya sido creado.

El comando y los argumentos que definas en el archivo de configuración
sobrescriben el comando y los argumentos predeterminados que proporciona la imagen del contenedor.
Si defines `args`, pero no defines un `command`, se usa el comando por defecto
con tus nuevos argumentos.

{{< note >}}
El campo `command` corresponde a `ENTRYPOINT`, y el campo `args` corresponde a `CMD` en algunos runtimes de contenedores.
{{< /note >}}

En este ejercicio, crearás un Pod que ejecuta un contenedor. El archivo de configuración
para el Pod define un comando y dos argumentos:

{{% code_sample file="pods/commands.yaml" %}}

1. Crea un Pod basado en el archivo de configuración YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/commands.yaml
   ```

1. Lista los Pods en ejecución:

   ```shell
   kubectl get pods
   ```

   La salida muestra que el contenedor que se ejecuta en el Pod command-demo se ha
   completado.

1. Para ver la salida del comando ejecutado en el contenedor, examina los logs
del Pod:

   ```shell
   kubectl logs command-demo
   ```

   La salida muestra los valores de las variables de entorno
   HOSTNAME y KUBERNETES_PORT:

   ```
   command-demo
   tcp://10.3.240.1:443
   ```

## Usa variables de entorno para definir argumentos

En el ejemplo anterior, definiste los argumentos proporcionando directamente
cadenas. Como alternativa a proporcionar directamente cadenas,
puedes definir argumentos utilizando variables de entorno:

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

Esto significa que puedes definir un argumento para un Pod utilizando cualquiera de
las técnicas disponibles para definir variables de entorno, incluyendo
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
y
[Secrets](/docs/concepts/configuration/secret/).

{{< note >}}
La variable de entorno aparece en paréntesis, `"$(VAR)"`. Esto es
requerido para que se expanda en el campo `command` o `args`.
{{< /note >}}

## Ejecuta un comando en una shell

En algunos casos, necesitas que tu comando se ejecute en una shell. Por ejemplo, tu
comando podría consistir en varios comandos encadenados mediante pipes, o podría ser un script de shell.
Para ejecutar un comando en una shell, envuélvelo así:

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## {{% heading "whatsnext" %}}


* Aprende más sobre [Configurar Pods y contenedores](/docs/tasks/).
* Aprende más sobre [Ejecutar comandos en un contenedor](/docs/tasks/debug/debug-application/get-shell-running-container/).
* Ver [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).

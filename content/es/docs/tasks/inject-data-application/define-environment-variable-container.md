---
title: Define variables de entorno para un contenedor
content_type: task
weight: 20
---

<!-- overview -->

Esta página muestra cómo definir variables de entorno para un contenedor
en un Pod de Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Define una variable de entorno para un contenedor

Cuando creas un Pod, puedes configurar variables de entorno para los contenedores
que se ejecutan dentro del Pod. Para configurar variables de entorno, incluye el campo `env` o
`envFrom` en el archivo de configuración.

Los campos `env` y `envFrom` tienen efectos diferentes.

`env`
: Permite configurar variables de entorno para un contenedor, especificando un valor directamente por cada variable que declares.

`envFrom`
: Permite configurar variables de entorno para un contenedor referenciando un ConfigMap o un Secret.
 Cuando utilizas `envFrom`, todos los pares clave-valor en el ConfigMap o Secret referenciado
 se configuran como variables de entorno para el contenedor.
 También puedes especificar una cadena de prefijo común.

Puedes leer más sobre [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
y [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables).

Esta página explica cómo utilizar `env`.

En este ejercicio, crearás un Pod que ejecuta un contenedor. El archivo de
configuración para el Pod define una variable de entorno con nombre `DEMO_GREETING` y
valor `"Hello from the environment"`. Aquí está el manifiesto de configuración para el
Pod:

{{% code_sample file="pods/inject/envars.yaml" %}}

1. Crea un Pod basado en ese manifiesto:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

1. Lista los Pods en ejecución:

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```

   La salida es similar a:

   ```
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

1. Lista las variables de entorno del contenedor que se ejecuta en el Pod:

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   La salida es similar a esto:

   ```
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Hello from the environment
   DEMO_FAREWELL=Such a sweet sorrow
   ```

{{< note >}}
Las variables de entorno configuradas utilizando el campo `env` o `envFrom`
sobrescriben cualquier variable de entorno especificada en la imagen del contenedor.
{{< /note >}}

{{< note >}}
Las variables de entorno pueden referenciarse entre sí; sin embargo, el orden es importante.
Las variables que hacen uso de otras definidas en el mismo contexto deben definirse después
en la lista. Del mismo modo, evita referencias circulares.
{{< /note >}}

## Utiliza variables de entorno dentro de tu configuración

Las variables de entorno que defines en la configuración de un Pod debajo de
`.spec.containers[*].env[*]` pueden ser utilizadas en otras partes de la configuración, por
ejemplo en comandos y argumentos que configuras para los contenedores del Pod.
En el ejemplo de configuración debajo, las variables de entorno `GREETING`, `HONORIFIC`, y
`NAME` se configuran como `Cálidos saludos`, `al más honorable`, y `Kubernetes`, respectivamente. La variable de entorno
`MESSAGE` combina todas estas variables de entorno y luego las utiliza
como un argumento de CLI para el contenedor `env-print-demo`.

El nombre de una variable de entorno puede consistir en cualesquiera [caracteres ASCII imprimibles](https://www.ascii-code.com/characters/printable-characters) excepto '='.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Cálidos saludos"
    - name: HONORIFIC
      value: "al más honorable"
    - name: NAME
      value: "Kubernetes"
    - name: MESSAGE
      value: "$(GREETING) $(HONORIFIC) $(NAME)"
    command: ["echo"]
    args: ["$(MESSAGE)"]
```

Al crearse, el comando `echo Cálidos saludos al más honorable Kubernetes` se ejecuta en el contenedor.

## {{% heading "whatsnext" %}}

* Aprende más sobre [variables de entorno](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Aprende más sobre [utilizar Secrets como variables de entorno](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* Ver [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).


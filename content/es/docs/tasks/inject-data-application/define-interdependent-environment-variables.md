---
title: Define variables de entorno dependientes
content_type: task
weight: 20
---

<!-- overview -->

Esta página muestra como definir variables de entorno dependientes para un contenedor
en un Pod de Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## Define una variable de entorno dependiente para un contenedor

Cuando creas un Pod, puedes establecer variables de entorno dependientes para los contenedores que se ejecutan en un Pod. Para establecer una variable de entorno dependiente, puedes utilizar $(VAR_NAME) en `value` de `env` en el archivo de configuración.

En este ejercicio, crearás un Pod que ejecuta un contenedor. El archivo de configuración
para el Pod define una variable de entorno dependiente con un uso común definido. Aquí está el manifiesto de configuración para el
Pod:

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. Crea un Pod basado en el manifiesto:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```
   ```
   pod/dependent-envars-demo created
   ```

2. Lista los Pods en ejecución:

   ```shell
   kubectl get pods dependent-envars-demo
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. Revisa los logs para el contenedor ejecutándose en el Pod:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

Como se muestra anteriormente, has definido correctamente la referencia de dependencia en `SERVICE_ADDRESS`, una referencia de dependencia incorrecta en `UNCHANGED_REFERENCE` y la omisión de una referencia dependiente en `ESCAPED_REFERENCE`.

Cuando una variable de entorno está definida cuando es referenciada,
la referencia se resuelve correctamente, como en el caso de `SERVICE_ADDRESS`.

Nota que el orden importa en la lista `env`. Una variable de entorno no es considerada
"definida" si se especifica más abajo en la lista. Esa es la razón por la que `UNCHANGED_REFERENCE`
falla al resolver `$(PROTOCOL)` en el ejemplo anterior.

Cuando una variable de entorno está indefinida o solo incluye algunas variables, la variable de entorno indefinida es tratada como una cadena de caracteres, así como `UNCHANGED_REFERENCE`. Nota que las variables de entorno analizadas incorrectamente, en general, no bloquearán la inicialización del contenedor.

La sintaxis `$(VAR_NAME)` puede ser escapada con un doble `$`, ej: `$$(VAR_NAME)`.
Las referencias escapadas nunca son expandidas, sin importar que la variable referenciada
esté definida o no. Puedes visualizarlo en el caso de `ESCAPED_REFERENCE` mostrado anteriormente.

## {{% heading "whatsnext" %}}


* Aprende más sobre [variables de entorno](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Mira [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).


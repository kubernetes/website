---
title: Definir variables de entorno dependientes
content_type: task
weight: 20
---

<!-- overview -->

Esta página muestra cómo definir variables de entorno dependientes para un contenedor
en un Pod de Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## Definir una variable de entorno dependiente para un contenedor

Al crear un Pod, puedes configurar variables de entorno dependientes para los contenedores que se ejecutan en él. Para configurar variables de entorno dependientes, puedes utilizar $(NOMBRE_VARIABLE) en el `value` de `env` dentro del archivo de configuración.

En este ejercicio, crearás un Pod que ejecuta un contenedor. El archivo de configuración
del Pod define una variable de entorno dependiente con un uso común definido. A continuación se muestra el manifiesto de configuración para el
Pod:

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. Crea un Pod basado en ese manifiesto:

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

3. Revisa los registros (logs) del contenedor que se ejecuta en tu Pod:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

Como se muestra anteriormente, has definido la referencia de dependencia correcta en `SERVICE_ADDRESS`, una referencia de dependencia errónea en `UNCHANGED_REFERENCE` y se han omitido las referencias dependientes en `ESCAPED_REFERENCE`.

Cuando una variable de entorno ya está definida al momento de ser referenciada,
la referencia se puede resolver correctamente, como en el caso de `SERVICE_ADDRESS`.

Ten en cuenta que el orden importa en la lista `env`. Una variable de entorno no se considera
"definida" si se especifica más abajo en la lista. Es por eso que `UNCHANGED_REFERENCE`
no logra resolver `$(PROTOCOL)` en el ejemplo anterior.

Cuando la variable de entorno no está definida o solo incluye algunas variables, la variable de entorno no definida se trata como una cadena de texto normal, como `UNCHANGED_REFERENCE`. Ten en cuenta que las variables de entorno analizadas incorrectamente, en general, no impedirán que el contenedor se inicie.

La sintaxis `$(NOMBRE_VARIABLE)` se puede escapar con un doble `$`, es decir: `$$(NOMBRE_VARIABLE)`.
Las referencias escapadas nunca se expanden, independientemente de si la variable referenciada
está definida o no. Esto se puede observar en el caso de `ESCAPED_REFERENCE` mostrado anteriormente.

## {{% heading "whatsnext" %}}


* Aprende más sobre [variables de entorno](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Consulta [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

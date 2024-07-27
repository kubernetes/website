---
title: Actualiza Objetos del API en su sitio (in Place) usando kubectl patch 
description:  Usa kubectl patch para actualizar objetos del API de kubernetes sin reemplazarlos. Usa strategic merge patch o JSON merge patch.
content_type: task
weight: 50
---

<!-- overview -->

Esta tarea muestra cómo utilizar `kubectl patch` para actualizar un objeto del API sin reemplazarlo.
Los ejercicios de esta tarea demuestran el uso de "strategic merge patch" y "JSON merge patch"

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Usa strategic merge patch para actualizar un Deployment

Aquí está el archivo de configuración para un Deployment con dos réplicas. 
Cada réplica es un Pod que tiene un contenedor:

{{% code_sample file="application/deployment-patch.yaml" %}}

Crea el Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
```

Revisa los Pods asociados con tu Deployment:

```shell
kubectl get pods
```
El resultado muestra que el Deployment tiene dos Pods. El `1/1` indica
que cada Pod tiene un contenedor:


```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

Toma nota de los nombres de los Pods que se están ejecutando. Verás que estos Pods son 
terminados y reemplazados posteriormente.

En este punto cada Pod tiene un contenedor que ejecuta una imagen de nginx. Ahora
supón que quieres que cada Pod tenga dos contenedores: uno que ejecute nginx 
y otro que ejecute redis.

Crea un archivo llamado `patch-file.yaml` con el siguiente contenido:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

Modifica tu Deployment usando Patch:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
```

Revisa el Deployment modificado:

```shell
kubectl get deployment patch-demo --output yaml
```

El resultado muestra que el PodSpec del Deployment tiene dos contenedores:

```yaml
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

Revisa los Pods asociados con tu Deployment modificado:

```shell
kubectl get pods
```

El resultado muestra que los Pods tienen un nombre distinto a los que se estaban
ejecutando anteriormente. El Deployment terminó los Pods viejos y creo dos nuevos
que cumplen con la especificación actualizada del Deployment. El `2/2` indica que
cada Pod tiene dos contenedores:

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

Un vistazo más de cerca a uno de los Pods del patch-demo:

```shell
kubectl get pod <your-pod-name> --output yaml
```

El resultado muestra que el Pod tienen dos contenedores: uno ejecutando nginx y otro redis:

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

### Notas acerca de strategic merge patch

El patch que hiciste en el ejercicio anterior se llama *strategic merge patch*.
Toma en cuenta que el path no reemplazó la lista `containers`. Sino que agregó
un contenedor nuevo a la lista. En otras palabras, la lista en el patch fue agregada
a la lista ya existente. Esto no es lo que pasa siempre que se utiliza strategic merge patch
en una lista. En algunos casos la lista existente podría ser reemplazada en lugar de unir ambas.

Con strategic merge patch, la lista existente puede ser reemplazada o unida con la nueva
dependiendo de la estrategia de patch. La estrategia de patch se especifica en el valor de la clave
`patchStrategy`en un campo tag del código fuente de Kubernetes. Por ejemplo el 
campo `Containers` de la struct `PodSpec` tiene un valor de `merge` en su clave `patchStrategy`:

```go
type PodSpec struct {
  ...
  Containers []Container `json:"containers" patchStrategy:"merge" patchMergeKey:"name" ...`
  ...
}
```
También puedes consultar la estrategia de patch en 
[OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.core.v1.PodSpec": {
    ...,
    "containers": {
        "description": "List of containers belonging to the pod.  ...."
    },
    "x-kubernetes-patch-merge-key": "name",
    "x-kubernetes-patch-strategy": "merge"
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

Y puedes consultar la estrategia de patch en la 
[Documentación del API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Crea un archivo llamado `patch-file-tolerations.yaml` que tenga el siguiente contenido:

```yaml
spec:
  template:
    spec:
      tolerations:
      - effect: NoSchedule
        key: disktype
        value: ssd
```

Modifica tu Deployment utilizando Patch:

```shell
kubectl patch deployment patch-demo --patch-file patch-file-tolerations.yaml
```
Revisa el Deployment modificado:

```shell
kubectl get deployment patch-demo --output yaml
```

El resultado muestra que el PodsSpec del Deployment tiene solo un Toleration:

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

Toma en cuenta que la lista de `tolerations` en el PodSpec fue reemplazada, no unida.
Esto es porque el campo de Tolerations del PodSpec no tiene una clave `patchStrategy` en su campo de tag.
por lo tanto strategic merge patch utiliza la estrategia de patch por defecto, la cual es `replace`.

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

## Usa JSON merge patch para actualizar un Deployment

Un strategic merge patch es distinto a un 
[JSON merge patch](https://tools.ietf.org/html/rfc7386).

Con JSON merge patch, si quieres actualizar una lista
tienes que especificar la lista nueva en su totalidad
y reemplazar la lista existente con la lista nueva.

El comando `kubectl patch` tiene un parámetro `type` que acepta los siguientes valores:

<table>
  <tr><th>Valor del parámetro</th><th>tipo de unión</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
</table>

Para una comparación entre JSON patch y JSON merge patch, revisa
[JSON Patch y JSON Merge Patch](https://erosb.github.io/post/json-patch-vs-merge-patch/).

El valor predeterminado para el parámetro `type` es  `strategic`. Entonces en el ejercicio
anterior hiciste un strategic merge patch.

A continuación haz un JSON merge path en el mismo Deployment. Crea un archivo llamado
`patch-file-2.yaml` que tenga el siguiente contenido:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/node-hello:1.0
```

En el comando patch configura el valor de `type` como `merge`

```shell
kubectl patch deployment patch-demo --type merge --patch-file patch-file-2.yaml
```

Revisa el Deployment modificado:

```shell
kubectl get deployment patch-demo --output yaml
```

La lista `containers` que especificaste en el patch solo tiene un contenedor.
el resultado muestra que tu lista con un contenedor reemplazó a la lista `containers` preexistente.

```yaml
spec:
  containers:
  - image: gcr.io/google-samples/node-hello:1.0
    ...
    name: patch-demo-ctr-3
```
Revisa los Pods en ejecución:

```shell
kubectl get pods
```

En el resultado se puede ver que los Pods existentes fueron terminados y se
crearon Pods nuevos. El `1/1` indica que cada Pod nuevo esta ejecutando un solo
contenedor.

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

## Usa strategic merge patch para actualizar un Deployment utilizando la estrategia retainKeys  

Aquí esta el archivo de configuración para un Deployment que usa la estrategia `RollingUpdate`:

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

Crea el Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

En este punto, el Deployment es creado y está usando la estrategia `RollingUpdate`.

Crea un archivo llamado `patch-file-no-retainkeys.yaml` con el siguiente contenido:

```yaml
spec:
  strategy:
    type: Recreate
```

Modifica tu Deployment:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-no-retainkeys.yaml
```

En el resultado se puede ver que no es posible definir el `type` como `Recreate` cuando hay un value definido para `spec.strategy.rollingUpdate`:

```
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

La forma para quitar el valor para `spec.strategy.rollingUpdate` al momento de cambiar el valor `type` es usar la estrategia `retainKeys` para el strategic merge.

Crea otro archivo llamado `patch-file-retainkeys.yaml` con el siguiente contenido:

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

Con este Patch definimos que solo queremos conservar la clave `type` del objeto `strategy`. Por lo tanto la clave `rollingUpdate` será eliminada durante la operación de modificación.

Modifica tu Deployment de nuevo con este nuevo Patch:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-retainkeys.yaml
```
Revisa el contenido del Deployment:

```shell
kubectl get deployment retainkeys-demo --output yaml
```
El resultado muestra que el objeto `strategy` en el Deployment ya no contiene la clave `rollingUpdate`:

```yaml
spec:
  strategy:
    type: Recreate
  template:
```
### Notas acerca de strategic merge patch utilizando la estrategia retainKeys

La modificación realizada en el ejercicio anterior tiene el nombre de *strategic merge patch con estrategia retainKeys*. Este método introduce una
nueva directiva `$retainKeys` que tiene las siguientes estrategias:

- Contiene una lista de strings.
- Todos los campos que necesiten ser preservados deben estar presentes en la lista `$retainKeys`.
- Todos los campos que estén presentes serán combinados con el objeto existente.
- Todos los campos faltantes serán removidos o vaciados al momento de la modificación.
- Todos los campos en la lista `$retainKeys` deberán ser un superconjunto o idéntico a los campos presentes en el Patch.

La estrategia `retainKeys` no funciona para todos los objetos. Solo funciona cuando el valor de la key `patchStrategy`en el campo tag de el código fuente de 
Kubernetes contenga `retainKeys`. Por ejemplo, el campo `Strategy` del struct `DeploymentSpec` tiene un valor de `retainKeys` en su tag `patchStrategy`


```go
type DeploymentSpec struct {
  ...
  // +patchStrategy=retainKeys
  Strategy DeploymentStrategy `json:"strategy,omitempty" patchStrategy:"retainKeys" ...`
  ...
}
```
También puedes revisar la estrategia `retainKeys` en la especificación de [OpenApi](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.apps.v1.DeploymentSpec": {
    ...,
    "strategy": {
        "$ref": "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        "description": "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys"
    },
    ....
}
```
<!-- para los editiores: intencionalmente se utilizó yaml en lugar de json para evitar errores de resaltado por sintaxis. -->

Además puedes revisar la estrategia `retainKeys` en la [documentación del API de k8s](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

### Formas alternativas del comando kubectl patch

El comando `kubectl patch` toma como entrada un archivo en formato YAML o JSON desde el sistema de archivos o la línea de comandos.

Crea un archivo llamado `patch-file.json` que contenga lo siguiente:

```json
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

Los siguientes comandos son equivalentes:


```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

### Actualiza la cantidad de réplicas de un objeto utilizando `kubectl patch` con `--subresource` {#scale-kubectl-patch}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

La bandera `--subresource=[subresource-name]` es utilizada con comandos de kubectl como get,
patch y replace para obtener y actualizar los subrecursos `status` y `scale` de los recursos 
(aplicable para las versiones de kubectl de v1.24 en adelante). Esta bandera se utiliza con
todos los recursos del API (incluidos en k8s o CRs) que tengan los subrecursos `status` o `scale`.
Deployment es un ejemplo de un objeto con estos subrecursos.

A continuación se muestra un ejemplo de un Deployment con dos réplicas:

{{% code_sample file="application/deployment.yaml" %}}

Crea el Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Revisa los Pods asociados al Deployment

```shell
kubectl get pods -l app=nginx
```

En el resultado se puede observar que el Deployment tiene dos Pods:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

Ahora modifica el Deployment utilizando Patch con la bandera `--subresource=[subresource-name]`:

```shell
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

El resultado es :

```shell
scale.autoscaling/nginx-deployment patched
```

Revisa los Pods asociados al Deployment modificado:

```shell
kubectl get pods -l app=nginx
```

En el resultado se puede apreciar que se ha creado un Pod nuevo. Ahora tienes 3 Pods en ejecución.

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          107s
nginx-deployment-7fb96c846b-lxfr2   1/1     Running   0          14s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          107s
```

Revisa el Deployment modificado

```shell
kubectl get deployment nginx-deployment -o yaml
```

```yaml
...
spec:
  replicas: 3
  ...
status:
  ...
  availableReplicas: 3
  readyReplicas: 3
  replicas: 3
```

{{< note >}}
Si ejecutas `kubectl patch` y especificas la bandera `--subresource` para un recurso que no soporte
un subrecurso en particular, el servidor del API regresará un error 404 Not Found.
{{< /note >}}

## Resumen

En este ejercicio utilizaste `kubectl patch` para cambiar la configuración en ejecución de 
un objeto de tipo Deployment. No hubo cambios al archivo de configuración que se utilizó 
originalmente para crear el Deployment. Otros comandos utilizados para actualizar objetos del API 
incluyen:
[kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate),
[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit),
[kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace),
[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale),
y
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply).


{{< note >}}
Strategic merge patch no tiene soporte para Custom Resources (CRs).
{{< /note >}}


## {{% heading "whatsnext" %}}


* [Manejo de Objetos de Kubernetes](/docs/concepts/overview/working-with-objects/object-management/)
* [Manejo de Objetos de Kubernetes usando comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Manejo Imperativo de Objetos de Kubernetes usando archivos de configuración](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Manejo Declarativo de Objetos de Kubernetes usando archivos de configuración](/docs/tasks/manage-kubernetes-objects/declarative-config/)



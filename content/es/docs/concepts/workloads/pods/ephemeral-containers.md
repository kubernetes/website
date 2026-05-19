---
reviewers:
- astuky
- raelga
title: Containers Efímeros
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="alpha" >}}

Esta página proporciona una descripción general de los Containers efímeros: un tipo especial de Container
que se ejecuta temporalmente en un {{< glossary_tooltip text="Pod" term_id="pod" >}} ya existente para cumplir las
acciones iniciadas por el usuario, como por ejemplo, la solución de problemas. En vez de ser utilizadas para
crear aplicaciones, los Containers efímeros se utilizan para examinar los servicios.

{{< warning >}}
Los Containers efímeros se encuentran en una fase alfa inicial y no son aptos para clústers
de producción. Es de esperar que esta característica no funcione en algunas situaciones, por
ejemplo, al seleccionar los Namespaces de un Container. De acuerdo con la [Política de
Deprecación de Kubernetes](/docs/reference/using-api/deprecation-policy/), esta característica
alfa puede variar significativamente en el futuro o ser eliminada por completo.
{{< /warning >}}



<!-- body -->

## Entendiendo los Containers efímeros

{{< glossary_tooltip text="Pods" term_id="pod" >}} son el componente fundamental de las
aplicaciones de Kubernetes. Puesto que los Pods están previstos para ser desechables
y reemplazables, no se puede añadir un Container a un Pod una vez creado. Sin embargo, por lo
general se eliminan y se reemplazan los Pods de manera controlada utilizando
{{< glossary_tooltip text="Deployments" term_id="deployment" >}}.

En ocasiones es necesario examinar el estado de un Pod existente, como por ejemplo,
para poder solucionar un error difícil de reproducir. Puede ejecutar en estos casos
un Container efímero en un Pod ya existente para examinar su estado y para ejecutar
comandos de manera arbitraria.

### Qué es un Container efímero?

Los Containers efímeros se diferencian de otros Containers en que no garantizan ni los
recursos ni la ejecución, y en que nunca se reiniciarán automáticamente, de modo que no
son aptos para la construcción de aplicaciones. Los Containers efímeros se describen
usando la misma [ContainerSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core) que los Containers regulares, aunque muchos campos son
incompatibles y no están habilitados para los Containers efímeros.

- Los Containers efímeros no pueden tener puertos, por lo que campos como `ports`,
  `livenessProbe`, `readinessProbe` no están habilitados.
- Las asignaciones de recursos del Pod son inmutables, por lo que no esta habilitado
  configurar "resources".
- Para obtener una lista completa de los campos habilitados, consulte la documentación
  de referencia [EphemeralContainer] (/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).

En vez de añadirlos de forma directa al `pod.spec`, los Containers efímeros se crean usando un
controlador especial de la API, `ephemeralcontainers`, por lo tanto no es posible añadir un
Container efímero utilizando `kubectl edit`.

Al igual en el caso de los Containers regulares, no se puede modificar o remover un Container
efímero después de haberlo agregado a un Pod.

## Casos de uso para los Containers efímeros

Los Containers efímeros resultan útiles para la solución interactiva de incidencias cuando
`kubectl exec` es insuficiente tanto porque un container se ha caído, como porque la imagen de un
Container no incluye las utilidades de depuración.

En particular, las [imágenes distroless](https://github.com/GoogleContainerTools/distroless)
le permiten desplegar imágenes de Containers mínimos que disminuyen la superficie de ataque
y la exposición a errores y vulnerabilidades. Ya que las imágenes distroless no contienen un
shell ni ninguna utilidad de depuración, resulta difícil solucionar los problemas de las imágenes
distroless usando solamente `kubectl exec`.

Cuando utilice Containers efímeros, es conveniente habilitar el [proceso Namespace de uso
compartido](/docs/tasks/configure-pod-container/share-process-namespace/) para poder ver los
procesos en otros containers.

### Ejemplos

{{< note >}}
Los ejemplos de esta sección requieren que los `EphemeralContainers` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) estén habilitados
y que tanto el cliente como el servidor de Kubernetes tengan la version v1.16 o posterior.
{{< /note >}}

En los ejemplos de esta sección muestran la forma en que los Containers efímeros se
presentan en la API. Los usuarios normalmente usarían un plugin `kubectl` para la solución
de problemas que automatizaría estos pasos.

Los Containers efímeros son creados utilizando el subrecurso `ephemeralcontainers` del Pod,
que puede ser visto utilizando `kubectl --raw`. En primer lugar describa el Container
efímero a añadir como una lista de `EphemeralContainers`:

```json
{
    "apiVersion": "v1",
    "kind": "EphemeralContainers",
    "metadata": {
        "name": "example-pod"
    },
    "ephemeralContainers": [{
        "command": [
            "sh"
        ],
        "image": "busybox",
        "imagePullPolicy": "IfNotPresent",
        "name": "debugger",
        "stdin": true,
        "tty": true,
        "terminationMessagePolicy": "File"
    }]
}
```

Para actualizar los Containers efímeros de los `example-pod` en ejecución:

```shell
kubectl replace --raw /api/v1/namespaces/default/pods/example-pod/ephemeralcontainers  -f ec.json
```

Esto devolverá una nueva lista de Containers efímeros:

```json
{
   "kind":"EphemeralContainers",
   "apiVersion":"v1",
   "metadata":{
      "name":"example-pod",
      "namespace":"default",
      "selfLink":"/api/v1/namespaces/default/pods/example-pod/ephemeralcontainers",
      "uid":"a14a6d9b-62f2-4119-9d8e-e2ed6bc3a47c",
      "resourceVersion":"15886",
      "creationTimestamp":"2019-08-29T06:41:42Z"
   },
   "ephemeralContainers":[
      {
         "name":"debugger",
         "image":"busybox",
         "command":[
            "sh"
         ],
         "resources":{

         },
         "terminationMessagePolicy":"File",
         "imagePullPolicy":"IfNotPresent",
         "stdin":true,
         "tty":true
      }
   ]
}
```

Se puede ver el estado del Container efímero creado usando `kubectl describe`:

```shell
kubectl describe pod example-pod
```

```
...
Ephemeral Containers:
  debugger:
    Container ID:  docker://cf81908f149e7e9213d3c3644eda55c72efaff67652a2685c1146f0ce151e80f
    Image:         busybox
    Image ID:      docker-pullable://busybox@sha256:9f1003c480699be56815db0f8146ad2e22efea85129b5b5983d0e0fb52d9ab70
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
    State:          Running
      Started:      Thu, 29 Aug 2019 06:42:21 +0000
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

Se puede conectar al nuevo Container efímero usando `kubectl attach`:

```shell
kubectl attach -it example-pod -c debugger
```

Si el proceso Namespace de uso compartido está habilitado, se pueden visualizar los procesos de todos los Containers de ese Pod.
Por ejemplo, después de haber conectado, ejecute `ps` en el debugger del container:

```shell
ps auxww
```
La respuesta es semejante a:
```
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    6 root      0:00 nginx: master process nginx -g daemon off;
   11 101       0:00 nginx: worker process
   12 101       0:00 nginx: worker process
   13 101       0:00 nginx: worker process
   14 101       0:00 nginx: worker process
   15 101       0:00 nginx: worker process
   16 101       0:00 nginx: worker process
   17 101       0:00 nginx: worker process
   18 101       0:00 nginx: worker process
   19 root      0:00 /pause
   24 root      0:00 sh
   29 root      0:00 ps auxww
```



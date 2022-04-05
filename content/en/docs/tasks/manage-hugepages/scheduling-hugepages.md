---
revisores:
- jakspok
titulo: Administrar HugePages
content_type: task
descripción: Configure y administre páginas grandes como un recurso programable en un clúster.
---

<!-- overview -->
{{< feature-state state="stable" >}}

Kubernetes admite la asignación y el consumo de páginas enormes preasignadas
por aplicaciones en un Pod. Esta página describe cómo los usuarios pueden consumir páginas enormes.

## {{% heading "prerequisites" %}}


1. Los nodos de Kubernetes deben preasignar páginas grandes para que el nodo informe
   su enorme capacidad de página. Un nodo puede preasignar páginas grandes para múltiples
   tamaños

Los nodos descubrirán e informarán automáticamente todos los recursos de páginas grandes como
recursos programables.


<!-- steps -->

## API

Se pueden consumir páginas enormes a través de los requisitos de recursos a nivel de contenedor utilizando el
nombre del recurso `hugepages-<tamaño>`, donde `<tamaño>` es el binario más compacto
notación que utiliza valores enteros admitidos en un nodo particular. Por ejemplo, si un
nodo admite tamaños de página de 2048 KiB y 1048576 KiB, expondrá un programable
recursos `hugepages-2Mi` y `hugepages-1Gi`. A diferencia de la CPU o la memoria, las páginas enormes
no admita compromisos excesivos. Tenga en cuenta que al solicitar recursos de página enorme, ya sea
También se deben solicitar recursos de memoria o CPU.

Un pod puede consumir varios tamaños de página enormes en una única especificación de pod. En este caso
debe usar la notación `medium: HugePages-<hugepagesize>` para todos los montajes de volumen.


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

Un pod puede usar `medium: HugePages` solo si solicita páginas enormes de un tamaño.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- Las solicitudes de páginas grandes deben igualar los límites. Este es el valor predeterminado si los límites son
  especificado, pero las solicitudes no lo son.
- Las páginas enormes están aisladas en el ámbito de un contenedor, por lo que cada contenedor tiene su propio
  límite en su sandbox de cgroup según lo solicitado en una especificación de contenedor.
- Es posible que los volúmenes de EmptyDir respaldados por páginas grandes no consuman más memoria de página grande
  que la solicitud de pod.
- Las aplicaciones que consumen páginas grandes a través de `shmget()` con `SHM_HUGETLB` deben
  ejecutar con un grupo complementario que coincida con `proc/sys/vm/hugetlb_shm_group`.
- El gran uso de la página en un espacio de nombres se puede controlar a través de ResourceQuota similar
  a otros recursos informáticos como `cpu` o `memory` utilizando `hugepages-<size>`
  simbólico.


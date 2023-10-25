---
reviewers:
  - ramrodo
  - krol3
  - electrocucaracha
title: Volúmenes efímeros
content_type: concept
weight: 30
---

<!-- overview -->

Este documento describe _volúmenes efímeros_ en Kubernetes. Se sugiere tener conocimiento previo sobre [volúmenes](/docs/concepts/storage/volumes/), en particular PersistentVolumeClaim y PersistentVolume.

<!-- body -->

Algunas aplicaciones requieren almacenamiento adicional, pero no les preocupa si esos datos se almacenan de manera persistente entre reinicios. Por ejemplo, los servicios de caché a menudo tienen limitaciones de tamaño de memoria y pueden trasladar datos poco utilizados a un almacenamiento más lento que la memoria, con un impacto mínimo en el rendimiento general.

Otras aplicaciones esperan que algunos datos de entrada de solo lectura estén presentes en archivos, como datos de configuración o claves secretas.

Los _volúmenes efímeros_ están diseñados para estos casos de uso. Debido a que los volúmenes siguen el ciclo de vida del Pod y se crean y eliminan junto con el Pod, los Pods pueden detenerse y reiniciarse sin estar limitados a la disponibilidad de algún volumen persistente.

Los volúmenes efímeros se especifican _en línea_ en la especificación del Pod, lo que simplifica la implementación y gestión de aplicaciones.

### Tipos de volúmenes efímeros

Kubernetes admite varios tipos diferentes de volúmenes efímeros para diversos propósitos:

- [emptyDir](/docs/concepts/storage/volumes/#emptydir): vacíos al inicio del Pod, con el almacenamiento proveniente localmente del directorio base de kubelet (generalmente el disco raíz) o la RAM.
- [configMap](/docs/concepts/storage/volumes/#configmap),
  [downwardAPI](/docs/concepts/storage/volumes/#downwardapi),
  [secret](/docs/concepts/storage/volumes/#secret): inyectar diferentes tipos de datos de Kubernetes en un Pod.

- [CSI volúmenes efímeros](#csi-ephemeral-volumes):
  Similar a los tipos de volumen anteriores, pero proporcionados por controladores especiales {{< glossary_tooltip text="CSI" term_id="csi" >}} que [soportan específicamente esta característica](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [volúmenes efímeros genéricos](#generic-ephemeral-volumes), que pueden proporcionar todos los controladores de almacenamiento que también admiten volúmenes persistentes

`emptyDir`, `configMap`, `downwardAPI`, `secret` se proporcionan como [almacenamiento efímero local](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).
Ellos son administrados por kubelet en cada nodo.

Los volúmenes efímeros CSI _deben_ ser proporcionados por controladores de almacenamiento CSI de terceros.

Los volúmenes efímeros genéricos _pueden_ ser proporcionados por controladores de almacenamiento CSI de terceros, pero también por cualquier otro controlador de almacenamiento que admita la provisión dinámica. Algunos controladores CSI están escritos específicamente para volúmenes efímeros CSI y no admiten la provisión dinámica; por lo tanto, no se pueden utilizar para volúmenes efímeros genéricos.

La ventaja de utilizar controladores de terceros es que pueden ofrecer funcionalidades que Kubernetes en sí mismo no admite, como el almacenamiento con características de rendimiento diferentes al disco gestionado por kubelet o la inyección de datos diversos.

### Volúmenes efímeros de CSI

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

{{< note >}}
Los volúmenes efímeros CSI solo son compatibles con un subconjunto de controladores CSI.
La [lista de controladores](https://kubernetes-csi.github.io/docs/drivers.html) CSI de Kubernetes muestra cuáles controladores admiten volúmenes efímeros.
{{< /note >}}
Conceptualmente, los volúmenes efímeros CSI son similares a los tipos de volumen `configMap`,
`downwardAPI` y `secret`: el almacenamiento se gestiona localmente en cada nodo y se crea junto con otros recursos locales después de que un Pod ha sido programado en un nodo. Kubernetes ya no tiene ningún concepto de reprogramación de Pods en esta etapa. La creación de volúmenes debe ser poco propensa a fallos,
de lo contrario, el inicio del Pod queda atascado. En particular, [la programación de Pods con conciencia de la capacidad de almacenamiento](/docs/concepts/storage/storage-capacity/) _no_ está admitida para estos volúmenes. Actualmente, tampoco están cubiertos por los límites de uso de recursos de almacenamiento de un Pod, porque eso es algo que kubelet solo puede aplicar para el almacenamiento que administra él mismo.

Aquí tienes un ejemplo de manifiesto para un Pod que utiliza almacenamiento efímero CSI:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
        - mountPath: "/data"
          name: my-csi-inline-vol
      command: ["sleep", "1000000"]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

Los `volumeAttributes` determinan qué volumen es preparado por el controlador. Estos atributos son específicos de cada controlador y no están estandarizados. Consulta la documentación de cada controlador CSI para obtener instrucciones adicionales.

### Restricciones del conductor CSI

Los volúmenes efímeros CSI permiten a los usuarios proporcionar `volumeAttributes` directamente al controlador CSI como parte de la especificación del Pod. Un controlador CSI que permite `volumeAttributes` que normalmente están restringidos a administradores NO es adecuado para su uso en un volumen efímero en línea. Por ejemplo, los parámetros que normalmente se definen en la clase de almacenamiento no deben estar expuestos a los usuarios a través del uso de volúmenes efímeros en línea.

Los administradores del clúster que necesiten restringir los controladores CSI que se pueden utilizar como volúmenes en línea dentro de una especificación de Pod pueden hacerlo mediante:

- Eliminar `Ephemeral` de `volumeLifecycleModes` en la especificación de CSIDriver, lo que evita que los controladores CSI admitan volúmenes efímeros en línea.

- Usando un [webhook de admisión](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  para restringir el uso de este controlador.

### Volúmenes efímeros genéricos

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Los volúmenes efímeros genéricos son similares a los volúmenes `emptyDir` en el sentido de que proporcionan un directorio por Pod para datos temporales que generalmente está vacío después de la provisión. Pero también pueden tener características adicionales:

- El almacenamiento puede ser local o conectado a la red.
- Los volúmenes pueden tener un tamaño fijo que los Pods no pueden exceder.
- Los volúmenes pueden tener algunos datos iniciales, dependiendo del controlador y los parámetros.
- Se admiten operaciones típicas en los volúmenes, siempre que el controlador las soporte, incluyendo
  [instantáneas](/docs/concepts/storage/volume-snapshots/),
  [clonación](/docs/concepts/storage/volume-pvc-datasource/),
  [cambiar el tamaño](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims),
  y [seguimiento de la capacidad de almacenamiento](/docs/concepts/storage/storage-capacity/).

Ejemplo:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
        - mountPath: "/scratch"
          name: scratch-volume
      command: ["sleep", "1000000"]
  volumes:
    - name: scratch-volume
      ephemeral:
        volumeClaimTemplate:
          metadata:
            labels:
              type: my-frontend-volume
          spec:
            accessModes: ["ReadWriteOnce"]
            storageClassName: "scratch-storage-class"
            resources:
              requests:
                storage: 1Gi
```

### Ciclo de vida y reclamo de volumen persistente

La idea clave de diseño es que los [parámetros para una solicitud de volumen](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralvolumesource-v1-core)
se permiten dentro de una fuente de volumen del Pod. Se admiten etiquetas, anotaciones y
todo el conjunto de campos para una PersistentVolumeClaim. Cuando se crea un Pod de este tipo, el controlador de volúmenes efímeros crea entonces un objeto PersistentVolumeClaim real en el mismo espacio de nombres que el Pod y asegura que la PersistentVolumeClaim
se elimine cuando se elimina el Pod.

Eso desencadena la vinculación y/o aprovisionamiento de volúmenes, ya sea de inmediato si el {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} utiliza la vinculación inmediata de volúmenes o cuando el Pod está programado provisionalmente en un nodo (modo de vinculación de volumen `WaitForFirstConsumer`). Este último se recomienda para volúmenes efímeros genéricos, ya que permite al planificador elegir libremente un nodo adecuado para el Pod. Con la vinculación inmediata, el planificador está obligado a seleccionar un nodo que tenga acceso al volumen una vez que esté disponible.

En términos de [propiedad de recursos](/docs/concepts/architecture/garbage-collection/#owners-dependents),
un Pod que tiene almacenamiento efímero genérico es el propietario de la PersistentVolumeClaim(s) que proporciona ese almacenamiento efímero. Cuando se elimina el Pod, el recolector de basura de Kubernetes elimina la PVC, lo que suele desencadenar la eliminación del volumen, ya que la política de recuperación predeterminada de las clases de almacenamiento es eliminar los volúmenes.
Puedes crear almacenamiento local cuasi-efímero utilizando una StorageClass con una política de recuperación de `retain`: el almacenamiento sobrevive al Pod y, en este caso, debes asegurarte de que la limpieza del volumen se realice por separado.

Mientras estas PVC existen, pueden usarse como cualquier otra PVC. En particular, pueden ser referenciadas como fuente de datos en la clonación o creación de instantáneas de volúmenes. El objeto PVC también contiene el estado actual del volumen.

### Nomenclatura de PersistentVolumeClaim.

La nomenclatura de las PVC creadas automáticamente es determinista: el nombre es una combinación del nombre del Pod y el nombre del volumen, con un guion medio (`-`) en el medio. En el ejemplo anterior, el nombre de la PVC será `my-app-scratch-volume`. Esta nomenclatura determinista facilita la interacción con la PVC, ya que no es necesario buscarla una vez que se conocen el nombre del Pod y el nombre del volumen.

La nomenclatura determinista también introduce un posible conflicto entre diferentes Pods (un Pod "pod-a" con el volumen "scratch" y otro Pod con nombre "pod" y volumen "a-scratch" terminan teniendo el mismo nombre de PVC "pod-a-scratch") y entre Pods y PVCs creadas manualmente.

Estos conflictos se detectan: una PVC solo se utiliza para un volumen efímero si se creó para el Pod. Esta comprobación se basa en la relación de propiedad. Una PVC existente no se sobrescribe ni se modifica. Pero esto no resuelve el conflicto, ya que sin la PVC adecuada, el Pod no puede iniciarse.

{{< caution >}}
Ten cuidado al nombrar Pods y volúmenes dentro del mismo espacio de nombres para evitar que se produzcan estos conflictos.
{{< /caution >}}

### Seguridad

El uso de volúmenes efímeros genéricos permite a los usuarios crear PVC de forma indirecta si pueden crear Pods, incluso si no tienen permiso para crear PVC directamente. Los administradores del clúster deben ser conscientes de esto. Si esto no encaja en su modelo de seguridad, deberían utilizar un [webhook de admisión](/docs/reference/access-authn-authz/extensible-admission-controllers/) que rechace objetos como Pods que tienen un volumen efímero genérico.

La cuota normal del [espacio de nombres para PVC](/docs/concepts/policy/resource-quotas/#storage-resource-quota) sigue aplicándose, por lo que incluso si a los usuarios se les permite utilizar este nuevo mecanismo, no pueden utilizarlo para eludir otras políticas.

## {{% heading "whatsnext" %}}

### Volúmenes efímeros gestionados por kubelet

Ver [almacenamiento efímero local](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage).

### Volúmenes efímeros de CSI

- Para obtener más información sobre el diseño, consulta el
  [KEP de Volúmenes efímeros en línea de CSI](https://github.com/kubernetes/enhancements/blob/ad6021b3d61a49040a3f835e12c8bb5424db2bbb/keps/sig-storage/20190122-csi-inline-volumes.md).
- Para obtener más información sobre el desarrollo futuro de esta función, consulte el
  [problema de seguimiento de mejoras #596](https://github.com/kubernetes/enhancements/issues/596).

### Volúmenes efímeros genéricos

- Para obtener más información sobre el diseño, consulta el
  [KEP de Volúmenes efímeros genéricos en línea](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1698-generic-ephemeral-volumes/README.md).

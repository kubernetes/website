---
title: Finalizadores
content_type: concept
weight: 80
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

Puedes usar finalizadores para controlar {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
de los recursos alertando a los controladores para que ejecuten tareas de limpieza especificas antes de eliminar el recurso.

Los finalizadores usualmente no especifican codigo a ejecutar, sino que son generalmente listas de parametros referidos a
un recurso especifico, similares a las anotaciones. Kubernetes especifica algunos finalizadores automaticamente,
pero podrías especificar tus propios.

## Cómo funcionan los finalizadores

Cuando creas un recurso utilizando un archivo de manifiesto, puedes especificar 
finalizadores mediante el campo `metadata.finalizers`. Cuando intentas eliminar el
recurso, el servidor API que maneja el pedido de eliminación ve los valores en el
campo `finalizadores` y hace lo siguiente:

  * Modifica el objecto para agregar un campo `metadata.deletionTimestamp` con
    el momento en que comenzaste la eliminación.
  * Previene que el objeto sea eliminado hasta que su campo `metadata.finalizers`
    este vacío.
  * Retorna un codigo de estado `202` (HTTP "Aceptado")

El controlador que meneja ese finalizador recibe la actualización del objecto
configurando el campo `metadata.deletionTimestamp`, indicando que la eliminación
del objeto ha sido solicitada.
El controlador luego intenta satisfacer los requerimientos de los finalizadores
especificados para ese recurso. Cada vez que una condición del finalizador es
satisfecha, el controlador remueve ese parametro del campo `finalizadores`. Cuando
el campo `finalizadores` esta vacío, un objeto con un campo `deletionTimestamp`
configurado es automaticamente borrado. Puedes tambien utilizar finalizadores para
prevenir el borrado de recursos no manejados.

Un ejemplo usual de un finalizador es `kubernetes.io/pv-protection`, el cual
previene el borrado accidental de objetos `PersistentVolume`. Cuando un objeto
`PersistentVolume` está en uso por un Pod, Kubernetes agrega el finalizador
`pv-protection`. Si intentas elimiar el `PersistentVolume`, este pasa a un estado
`Terminating`, pero el controlador no puede eliminarlo ya que existe el finalizador.
Cuando el Pod deja de utilizar el `PersistentVolume`, Kubernetes borra el finalizador
`pv-protection` y el controlador borra el volumen.

## Referencias de dueño, etiquetas y finalizadores (#owners-labels-finalizers)

Al igual que las {{<glossary_tooltip text="etiquetas" term_id="label">}}, las
[referencias de dueño](/docs/concepts/overview/working-with-objects/owners-dependents/)
describen las relaciones entre objetos en Kubernetes, pero son utilizadas para un
propósito diferente. Cuando un
{{<glossary_tooltip text="controlador" term_id="controller">}} maneja objetos como
Pods, utiliza etiquetas para identificar cambios a grupos de objetos relacionados.
Por ejemplo, cuando un {{<glossary_tooltip text="Job" term_id="job">}} crea uno
o más Pods, el controlador del Job agrega etiquetas a esos pods para identificar cambios
a cualquier Pod en el cluster con la misma etiqueta.

El controlador del Job tambien agrega *referencias de dueño* a esos Pods, referidas
al Job que creo a los Pods. Si borras el Job mientras estos Pods estan corriendo,
Kubernetes utiliza las referencias de dueño (no las etiquetas) para determinar
cuáles Pods en el cluster deberían ser borrados.

Kubernetes también procesa finalizadores cuando identifica referencias de dueño en
un recurso que ha sido marcado para eliminación.

En algunas situaciones, los finalizadores pueden bloquear el borrado de objetos
dependientes, causando que el objeto inicial a borrar permanezca más de lo
esperado sin ser completamente eliminado. En esas situaciones, deberías chequear
finalizadores y referencias de dueños en los objetos y sus dependencias para
intentar solucionarlo.

{{<note>}}
En casos donde los objetos queden bloqueados en un estado de eliminación, evita
borrarlos manualmente para que el proceso continue. Los finalizadores usualmente
son agregados a los recursos por una razón, por lo cual eliminarlos forzosamente
puede causar problemas en tu cluster. Borrados manuales sólo deberían ejecutados
cuando el propósito del finalizador es entendido y satisfecho de alguna otra manera (por
ejemplo, borrando manualmente un objeto dependiente).
{{</note>}}

## {{% heading "whatsnext" %}}

* Lea [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  en el blog de Kubernetes.
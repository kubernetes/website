---
reviewers:
- edithturn
- raelga
- electrocucaracha
title: Supervisión del Estado del Volumen
content_type: concept
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

La supervisión del estado del volumen de {{< glossary_tooltip text="CSI" term_id="csi" >}}  permite que los controladores de CSI detecten condiciones de volumen anómalas de los sistemas de almacenamiento subyacentes y las notifiquen como eventos en {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} o {{< glossary_tooltip text="Pods" term_id="pod" >}}.



<!-- body -->

## Supervisión del Estado del Volumen

El _monitoreo del estado del volumen_ de Kubernetes es parte de cómo Kubernetes implementa la Interfaz de Almacenamiento de Contenedores (CSI). La función de supervisión del estado del volumen se implementa en dos componentes: un controlador de supervisión del estado externo y {{< glossary_tooltip term_id="kubelet" text="Kubelet" >}}.

Si un controlador CSI admite la función supervisión del estado del volumen desde el lado del controlador, se informará un evento en el {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC) relacionado cuando se detecte una condición de volumen anormal en un volumen CSI.

El {{< glossary_tooltip text="controlador" term_id="controller" >}} de estado externo también observa los eventos de falla del nodo. Se puede habilitar la supervisión de fallas de nodos configurando el indicador `enable-node-watcher` en verdadero. Cuando el monitor de estado externo detecta un evento de falla de nodo, el controlador reporta que se informará un evento en el PVC para indicar que los Pods que usan este PVC están en un nodo fallido.

Si un controlador CSI es compatible con la función monitoreo del estado del volumen desde el lado del nodo, se informará un evento en cada Pod que use el PVC cuando se detecte una condición de volumen anormal en un volumen CSI.

{{< note >}}
Se necesita habilitar el `CSIVolumeHealth` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) para usar esta función desde el lado del nodo.
{{< /note >}}

## {{% heading "whatsnext" %}}

Ver la [documentación del controlador CSI](https://kubernetes-csi.github.io/docs/drivers.html) para averiguar qué controladores CSI han implementado esta característica.

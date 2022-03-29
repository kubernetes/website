---
title: Límites de Volumen específicos del Nodo
content_type: concept
---

<!-- overview -->

Esta página describe la cantidad máxima de Volúmenes que se pueden adjuntar a un Nodo para varios proveedores de nube.

Los proveedores de la nube como Google, Amazon y Microsoft suelen tener un límite en la cantidad de Volúmenes que se pueden adjuntar a un Nodo. Es importante que Kubernetes respete esos límites. De lo contrario, los Pods planificados en un Nodo podrían quedarse atascados esperando que los Volúmenes se conecten.



<!-- body -->

## Límites predeterminados de Kubernetes

El Planificador de Kubernetes tiene límites predeterminados en la cantidad de Volúmenes que se pueden adjuntar a un Nodo:

<table>
  <tr><th>Servicio de almacenamiento en la nube</th><th>Volúmenes máximos por Nodo</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## Límites personalizados

Puede cambiar estos límites configurando el valor de la variable de entorno KUBE_MAX_PD_VOLS y luego iniciando el Planificador. Los controladores CSI pueden tener un procedimiento diferente, consulte su documentación sobre cómo personalizar sus límites.

Tenga cuidado si establece un límite superior al límite predeterminado. Consulte la documentación del proveedor de la nube para asegurarse de que los Nodos realmente puedan admitir el límite que establezca.

El límite se aplica a todo el clúster, por lo que afecta a todos los Nodos.

## Límites de Volumen dinámico

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Los límites de Volumen dinámico son compatibles con los siguientes tipos de Volumen.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

Para los Volúmenes administrados por in-tree plugins de Volumen, Kubernetes determina automáticamente el tipo de Nodo y aplica la cantidad máxima adecuada de Volúmenes para el Nodo. Por ejemplo:

* En
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
se pueden adjuntar hasta 127 Volúmenes a un Nodo, [según el tipo de Nodo](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* Para los discos de Amazon EBS en los tipos de instancias M5,C5,R5,T3 y Z1D, Kubernetes permite que solo se adjunten 25 Volúmenes a un Nodo. Para otros tipos de instancias en 
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes permite adjuntar 39 Volúmenes a un Nodo.

* En Azure, se pueden conectar hasta 64 discos a un Nodo, según el tipo de Nodo. Para obtener más detalles, consulte [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* Si un controlador de almacenamiento CSI anuncia una cantidad máxima de Volúmenes para un Nodo (usando `NodeGetInfo`), el {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} respeta ese límite.
Consulte las [especificaciones de CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) para obtener más información.

* Para los Volúmenes administrados por in-tree plugins que han sido migrados a un controlador CSI, la cantidad máxima de Volúmenes será la que informe el controlador CSI.



---
reviewers:
- thockin
title: Redes del clúster
content_type: concept
weight: 50
---

<!-- overview -->

Las redes son una parte central de Kubernetes, pero puede resultar difícil
entender con exactitud cómo se espera que funcionen. Hay 4 problemas de red
distintos que resolver:

1. Comunicaciones muy acopladas entre contenedores: esto lo resuelven los
   {{< glossary_tooltip text="Pods" term_id="pod" >}} y las comunicaciones por `localhost`.
2. Comunicaciones de Pod a Pod: este es el foco principal de este documento.
3. Comunicaciones de Pod a Service: esto se cubre en [Services](/docs/concepts/services-networking/service/).
4. Comunicaciones del exterior hacia un Service: esto también lo cubren los Services.

<!-- body -->

Kubernetes trata de compartir máquinas entre aplicaciones. Por lo general,
compartir una máquina exige que dos aplicaciones no intenten usar
los mismos puertos. Coordinar los puertos entre varios desarrolladores es muy
difícil a escala y expone a los usuarios a problemas del clúster que quedan
fuera de su control.

La asignación dinámica de puertos complica mucho el sistema: cada aplicación
tiene que tomar los puertos como flags, los servidores de API tienen que saber
cómo insertar números de puerto dinámicos en los bloques de configuración, los
Services tienen que saber cómo encontrarse, y así sucesivamente. En lugar de
resolver todo eso, Kubernetes toma otro camino.

Para conocer el modelo de red de Kubernetes, consulta [esta página](/docs/concepts/services-networking/).

## Rangos de direcciones IP de Kubernetes

Los clústeres de Kubernetes tienen que asignar direcciones IP que no se solapen
a los Pods, los Services y los nodos, a partir de un rango de direcciones
disponibles configurado en estos componentes:

- El plugin de red se configura para asignar direcciones IP a los Pods.
- El kube-apiserver se configura para asignar direcciones IP a los Services.
- El kubelet o el cloud-controller-manager se configura para asignar direcciones IP a los nodos.

{{< figure src="/docs/images/kubernetes-cluster-network.svg" alt="Figura que ilustra los distintos rangos de red en un clúster de Kubernetes" class="diagram-medium" >}}

## Tipos de red del clúster {#cluster-network-ipfamilies}

Según las familias de IP configuradas, un clúster de Kubernetes puede clasificarse como:

- Solo IPv4: el plugin de red, el kube-apiserver y el kubelet o el cloud-controller-manager se configuran para asignar únicamente direcciones IPv4.
- Solo IPv6: el plugin de red, el kube-apiserver y el kubelet o el cloud-controller-manager se configuran para asignar únicamente direcciones IPv6.
- IPv4/IPv6 o IPv6/IPv4, en [pila dual o dual-stack](/docs/concepts/services-networking/dual-stack/):
  - El plugin de red se configura para asignar direcciones IPv4 e IPv6.
  - El kube-apiserver se configura para asignar direcciones IPv4 e IPv6.
  - El kubelet o el cloud-controller-manager se configura para asignar direcciones IPv4 e IPv6.
  - Todos los componentes deben coincidir en la familia IP primaria configurada.

Los clústeres de Kubernetes solo tienen en cuenta las familias de IP que
aparecen en los objetos Pods, Services y Nodes, con independencia de las demás IP
del objeto representado. Por ejemplo, un servidor o un Pod puede tener varias
direcciones IP en sus interfaces, pero al implementar el modelo de red de
Kubernetes y al definir el tipo de clúster solo cuentan las direcciones de
`node.status.addresses` o `pod.status.ips`.

## Cómo se implementa el modelo de red de Kubernetes

En cada nodo, el modelo de red lo implementa el motor de ejecución de contenedores.
Los motores de ejecución más habituales usan plugins de la
[Container Network Interface](https://github.com/containernetworking/cni) (CNI)
para gestionar la red y la seguridad. Hay muchos plugins CNI, de distintos
proveedores. Algunos solo añaden y quitan interfaces de red. Otros ofrecen
soluciones más elaboradas, como la integración con otros orquestadores, el uso
de varios plugins CNI a la vez o funciones avanzadas de IPAM.

En [esta página](/docs/concepts/cluster-administration/addons/#redes-y-política-de-redes)
hay una lista, no exhaustiva, de complementos de red compatibles con Kubernetes.

## {{% heading "whatsnext" %}}

El diseño inicial del modelo de red y sus motivos se describen con más detalle
en el [documento de diseño de redes](https://git.k8s.io/design-proposals-archive/network/networking.md).
Para los planes futuros y el trabajo en curso que busca mejorar las redes de
Kubernetes, consulta los
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network)
de SIG-Network.

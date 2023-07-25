---
title: Instalación de Complementos 
content_type: concept
weight: 120
---

<!-- overview -->

{{% thirdparty-content %}}

Los complementos amplían las funcionalidades de Kubernetes.

En esta página se listan algunos de los complementos disponibles con sus respectivos enlaces de instrucciones para su instalación y uso. La lista no pretende ser exhaustiva.

<!-- body -->

## Redes y Política de Redes

* [ACI](https://www.github.com/noironetworks/aci-containers) (Cisco ACI) 
  proporciona redes de contenedores integradas y seguridad de red.
* [Antrea](https://antrea.io/) proporciona servicios de red y seguridad
  para Kubernetes, aprovechando Open vSwitch como plano de datos de red,
  opera en la capa 3/4. Antrea es un [proyecto de la CNCF de nivel Sandbox](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) es un proveedor de redes y 
  políticas de red. Calico admite un conjunto flexible de opciones de red, para 
  poder elegir la opción más eficiente para su situación, incluidas las 
  redes superpuestas y no superpuestas, con o sin BGP (Border Gateway Protocol). 
  Calico utiliza el mismo motor para aplicar las políticas de red para hosts, 
  pods (como lo usa Istio y Envoy) aplicaciones de la capa de servicios (service Mesh). 
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)
  Es la unión de Flannel y Calico, proporciona redes y políticas de redes.
* [Cilium](https://github.com/cilium/cilium) es una solución de red, observabilidad 
  y seguridad con un plano de datos basado en eBPF. Cilium proporciona una sencilla
   red plana de capa 3 con la capacidad de abarcar varios clústeres en un modo de 
  enrutamiento nativo o de superposición/encapsulación, y puede aplicar políticas
  de red en L3-L7 utilizando un modelo de seguridad basado en identidad que está 
  desacoplado del direccionamiento de red. Cilium puede actuar como sustituto de
  kube-proxy, también ofrece características adicionales de observabilidad y seguridad de manera opcional.
  Cilium es un [proyecto de la CNCF de nivel Incubación](https://www.cncf.io/projects/cilium/).
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) permite a Kubernetes conectarse 
  sin problemas a una selección de complementos de CNI, como Calico, Canal, Flannel o Weave.
  CNI-Genie es un [proyecto de la CNCF de nivel Sandbox](https://www.cncf.io/projects/cni-genie/).
* [Contiv](https://contivpp.io/) proporciona redes configurables (L3 nativo mediante BGP,
  con superposición mediante vxlan, L2 clásica y Cisco-SDN/ACI) para diversos casos de uso 
  y un vasto marco de políticas.  
  El proyecto Contiv es de  [código abierto](https://github.com/contiv).
  El [instalador](https://github.com/contiv/install) ofrece opciones de instalado basada en kubeadm como no basadas en kubeadm.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/),
  basada en [Tungsten Fabric](https://tungsten.io), es una plataforma de gestión de políticas y
  virtualización de redes multicloud de código abierto. Contrail y Tungsten Fabric se integran
  con sistemas de orquestación como Kubernetes, OpenShift, OpenStack y Mesos, y proporcionan modos
  de aislamiento para máquinas virtuales, contenedores/pods y cargas de trabajo para bare metal (On-premises).
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) es un
  proveedor de red superpuesto que se puede usar con Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) es un complemento que 
  soportar múltiples interfaces de red en un pod de Kubernetes.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) es un complemento múltiple para 
  soporte de diversas redes en Kubernetes, que admite todos los complementos de CNI 
  (ej. Calico, Cilium, Contiv, Flannel), además de SRIOV, DPDK, OVS-DPDK y cargas de 
  trabajo basadas en VPP en Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) es un proveedor de red 
  para Kubernetes basado en [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/),
  es una implementación de red virtual que surgió del proyecto Open vSwitch (OVS). 
  OVN-Kubernetes proporciona una implementación de red basada en la superposición para Kubernetes,
  incluida una implementación basada en OVS de equilibrio de carga y política de red.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) es un complemento de controlador CNI 
  basado en OVN para proporcionar encadenamiento de funciones de servicio (SFC) es basado en la nube (nativo de la nube).
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html)  Container Plug-in (NCP)
  proporciona integración entre VMware NSX-T y orquestadores de contenedores como
  Kubernetes, así como integración entre NSX-T y plataformas CaaS/PaaS basadas 
  en contenedores como Pivotal Container Service (PKS) y OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  es una plataforma SDN que proporciona redes basadas en políticas entre Kubernetes 
  Pods y entornos no Kubernetes con visibilidad y supervisión de la seguridad.
* [Romana](https://github.com/romana) es una solución de red de capa 3 para las redes de pods
  que también son compatible con la API de [NetworkPolicy](/docs/concepts/services-networking/network-policies/).
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)
  proporciona políticas de red, funciona a ambos lados de una partición de 
  red y no requiere una base de datos externa.

## Detecció de Servicio 

* [CoreDNS](https://coredns.io) es un servidor de DNS flexible y extensible que  
  puede [instalarse](https://github.com/coredns/deployment/tree/master/kubernetes)
  como DNS dentro del clúster para los pods.

## Visualización &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)
  es un panel de control con una interfaz web para Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s)
  es una herramienta para visualizar gráficamente tus contenedores, pods, servicios, etc. 
  Utilícela junto con una [cuenta de Weave Cloud](https://cloud.weave.works/)
  o aloje la interfaz de usuario usted mismo.

## Infraestructura

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) es un complemento 
  para ejecutar máquinas virtuales en Kubernetes. Suele ejecutarse en clústeres de Bare metal(On-premises).
* El
  [detector de problemas de nodo](https://github.com/kubernetes/node-problem-detector)
  se ejecuta en nodos Linux e informa de los problemas del sistema como 
  [Eventos](/docs/reference/kubernetes-api/cluster-resources/event-v1/) o
  [Condiciones de nodo](/docs/concepts/architecture/nodes/#condition).

## Complementos Antiguos

Hay otros complementos documentados como obsoletos en este directorio 
[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons).

Los con mejor mantenimiento deben estar vinculados aquí. !Los PR son Bienvenidos!
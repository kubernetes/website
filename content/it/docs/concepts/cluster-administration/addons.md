---
title: Installazione dei componenti aggiuntivi
content_template: templates/concept
---

{{% capture overview %}}


I componenti aggiuntivi estendono la funzionalità di Kubernetes.

Questa pagina elenca alcuni componenti aggiuntivi disponibili e collegamenti alle rispettive istruzioni di installazione.

I componenti aggiuntivi in ogni sezione sono ordinati alfabeticamente - l'ordine non implica uno stato preferenziale.

{{% /capture %}}


{{% capture body %}}

## Networking and Network Policy

* [ACI](https://www.github.com/noironetworks/aci-containers) fornisce funzionalità integrate di networking e sicurezza di rete con Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) è un provider di sicurezza e rete L3 sicuro.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) unisce Flannel e Calico, fornendo i criteri di rete e di rete.
* [Cilium](https://github.com/cilium/cilium) è un plug-in di criteri di rete e di rete L3 in grado di applicare in modo trasparente le politiche HTTP / API / L7. Sono supportate entrambe le modalità di routing e overlay / incapsulamento.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) consente a Kubernetes di connettersi senza problemi a una scelta di plugin CNI, come Calico, Canal, Flannel, Romana o Weave.
* [Contiv](http://contiv.github.io) offre networking configurabile (L3 nativo con BGP, overlay con vxlan, L2 classico e Cisco-SDN / ACI) per vari casi d'uso e un ricco framework di policy. Il progetto Contiv è completamente [open source](http://github.com/contiv). Il [programma di installazione](http://github.com/contiv/install) fornisce sia opzioni di installazione basate su kubeadm che non su Kubeadm.
* [Flanella](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md) è un provider di reti sovrapposte che può essere utilizzato con Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) è una soluzione di rete che supporta più reti in Kubernetes.
* [Multus](https://github.com/Intel-Corp/multus-cni) è un multi-plugin per il supporto di più reti in Kubernetes per supportare tutti i plugin CNI (es. Calico, Cilium, Contiv, Flannel), oltre a SRIOV, DPDK, OVS-DPDK e carichi di lavoro basati su VPP in Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) Container Plug-in (NCP) fornisce l'integrazione tra VMware NSX-T e orchestratori di contenitori come Kubernetes, oltre all'integrazione tra NSX-T e piattaforme CaaS / PaaS basate su container come Pivotal Container Service (PKS) e OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1/docs/kubernetes-1-installation.rst) è una piattaforma SDN che fornisce una rete basata su policy tra i pod di Kubernetes e non Kubernetes con visibilità e monitoraggio della sicurezza.
* [Romana](http://romana.io) è una soluzione di rete Layer 3 per pod network che supporta anche [API NetworkPolicy](/docs/concepts/services-networking/network-policies/). Dettagli di installazione del componente aggiuntivo di Kubeadm disponibili [qui](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) fornisce i criteri di rete e di rete, continuerà a funzionare su entrambi i lati di una partizione di rete e non richiede un database esterno.

## Service Discovery

* [CoreDNS](https://coredns.io) è un server DNS flessibile ed estensibile che può essere [installato](https://github.com/coredns/deployment/tree/master/kubernetes) come in-cluster DNS per pod.

## Visualization & Control

[Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) è un'interfaccia web dashboard per Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) è uno strumento per la visualizzazione grafica di contenitori, pod, servizi, ecc. Utilizzalo in combinazione con un [Weave Cloud account](https://cloud.weave.works/) o ospitali tu stesso.

## Legacy Add-ons

qui ci sono molti altri componenti aggiuntivi documentati nella directory deprecata [cluster / addons](https://git.k8s.io/kubernetes/cluster/addons).

Quelli ben mantenuti dovrebbero essere collegati qui.

{{% /capture %}}

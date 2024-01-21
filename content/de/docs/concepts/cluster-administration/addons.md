---
title: Addons Installieren
content_type: concept
---

<!-- overview -->


Add-Ons erweitern die Funktionalität von Kubernetes.

Diese Seite gibt eine Übersicht über einige verfügbare Add-Ons und verweist auf die entsprechenden Installationsanleitungen.

Die Add-Ons in den einzelnen Kategorien sind alphabetisch sortiert - Die Reihenfolge impliziert keine bevorzugung einzelner Projekte.




<!-- body -->

## Networking und Network Policy

* [ACI](https://www.github.com/noironetworks/aci-containers) bietet Container-Networking und Network-Security mit Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/introduction/) ist ein Networking- und Network-Policy-Provider. Calico unterstützt eine Reihe von Networking-Optionen, damit Du die richtige für deinen Use-Case wählen kannst. Dies beinhaltet Non-Overlaying and Overlaying-Networks mit oder ohne BGP. Calico nutzt die gleiche Engine um Network-Policies für Hosts, Pods und (falls Du Istio & Envoy benutzt) Anwendungen auf Service-Mesh-Ebene durchzusetzen.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) vereint Flannel und Calico um Networking- und Network-Policies bereitzustellen.
* [Cilium](https://github.com/cilium/cilium) ist ein L3 Network- and Network-Policy-Plugin welches das transparent HTTP/API/L7-Policies durchsetzen kann. Sowohl Routing- als auch Overlay/Encapsulation-Modes werden uterstützt. Außerdem kann Cilium auf andere CNI-Plugins aufsetzen.
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) ermöglicht das nahtlose Verbinden von Kubernetes mit einer Reihe an CNI-Plugins wie z.B. Calico, Canal, Flannel, Romana, oder Weave.
* [Contiv](https://contivpp.io/) bietet konfigurierbares Networking (Native L3 auf BGP, Overlay mit vxlan, Klassisches L2, Cisco-SDN/ACI) für verschiedene Anwendungszwecke und auch umfangreiches Policy-Framework. Das Contiv-Projekt ist vollständig [Open Source](http://github.com/contiv). Der [installer](http://github.com/contiv/install) bietet sowohl kubeadm als auch nicht-kubeadm basierte Installationen.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), basierend auf [Tungsten Fabric](https://tungsten.io), ist eine Open Source, multi-Cloud Netzwerkvirtualisierungs- und Policy-Management Plattform. Contrail und Tungsten Fabric sind mit Orechstratoren wie z.B. Kubernetes, OpenShift, OpenStack und Mesos integriert und bieten Isolationsmodi für Virtuelle Maschinen, Container (bzw. Pods) und Bare Metal workloads.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) ist ein Overlay-Network-Provider der mit Kubernetes genutzt werden kann.
* [Knitter](https://github.com/ZTE/Knitter/) ist eine Network-Lösung die Mehrfach-Network in Kubernetes ermöglicht.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) ist ein Multi-Plugin für Mehrfachnetzwerk-Unterstützung um alle CNI-Plugins (z.B. Calico, Cilium, Contiv, Flannel), zusätzlich zu SRIOV-, DPDK-, OVS-DPDK- und VPP-Basierten Workloads in Kubernetes zu unterstützen.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP) bietet eine Integration zwischen VMware NSX-T und einem Orchestator wie z.B. Kubernetes. Außerdem bietet es eine Integration zwischen NSX-T und Containerbasierten CaaS/PaaS-Plattformen wie z.B. Pivotal Container Service (PKS) und OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) ist eine SDN-Plattform die Policy-Basiertes Networking zwischen Kubernetes Pods und nicht-Kubernetes Umgebungen inklusive Sichtbarkeit und Security-Monitoring bereitstellt.
* [Romana](https://github.com/romana/romana) ist eine Layer 3 Network-Lösung für Pod-Netzwerke welche auch die [NetworkPolicy API](/docs/concepts/services-networking/network-policies/) unterstützt. Details zur Installation als kubeadm Add-On sind [hier](https://github.com/romana/romana/tree/master/containerize) verfügbar.
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) bietet Networking and Network-Policies und arbeitet auf beiden Seiten der Network-Partition ohne auf eine externe Datenbank angwiesen zu sein.

## Service-Discovery

* [CoreDNS](https://coredns.io) ist ein flexibler, erweiterbarer DNS-Server der in einem Cluster [installiert](https://github.com/coredns/deployment/tree/master/kubernetes) werden kann und das Cluster-interne DNS für Pods bereitzustellen.

## Visualisierung &amp; Überwachung

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) ist ein Dashboard Web Interface für Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) ist ein Tool um Container, Pods, Services usw. Grafisch zu visualieren. Kann in Verbindung mit einem [Weave Cloud Account](https://cloud.weave.works/) genutzt oder selbst gehosted werden.

## Infrastruktur

* [KubeVirt](https://kubevirt.io/user-guide/docs/latest/administration/intro.html#cluster-side-add-on-deployment) ist ein Add-On um Virtuelle Maschinen in Kubernetes auszuführen. Wird typischer auf Bare-Metal Clustern eingesetzt.

## Legacy Add-Ons

Es gibt einige weitere Add-Ons die in dem abgekündigten [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons)-Verzeichnis dokumentiert sind.

Add-Ons die ordentlich gewartet werden dürfen gerne hier aufgezählt werden. Wir freuen uns auf PRs!

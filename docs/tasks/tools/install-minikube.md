---
title: Instalar Minikube
---

{% capture overview %}

Esta página muestra cómo instalar Minikube.

{% endcapture %}

{% capture prerequisites %}

La virtualización VT-x o AMD-v debe estar habilitada en la BIOS de tu ordenador.

{% endcapture %}

{% capture steps %}

## Instalar un Hypervisor

Si no tienes ya instalado un "hypervisor", instala uno ahora.

* Para OS X, instala
[xhyve driver](https://git.k8s.io/minikube/docs/drivers.md#xhyve-driver),
[VirtualBox](https://www.virtualbox.org/wiki/Downloads), o
[VMware Fusion](https://www.vmware.com/products/fusion).

* Para Linux, instala
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) o
[KVM](http://www.linux-kvm.org/).

* Para Windows, instala
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) o
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).

## Instalar kubectl

* [Instalar kubectl](/docs/tasks/tools/install-kubectl/).

## Instalar Minikube

* Instalar Minikube según las instrucciones para la
[última entrega](https://github.com/kubernetes/minikube/releases).

{% endcapture %}

{% capture whatsnext %}

* [Ejecutar Kubernetes Localment via Minikube](/docs/getting-started-guides/minikube/)

{% endcapture %}

{% include templates/task.md %}

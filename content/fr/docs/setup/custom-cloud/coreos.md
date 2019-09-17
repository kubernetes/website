---
title: CoreOS sur AWS ou GCE
description: Installation Kubernetes CoreOS sur AWS GCE 
content_template: templates/concept
---

{{% capture overview %}}

Il existe plusieurs guides permettant d'utiliser Kubernetes avec [CoreOS](https://coreos.com/kubernetes/docs/latest/).

{{% /capture %}}

{{% capture body %}}

## Guides officiels CoreOS

Ces guides sont maintenus par CoreOS et déploient Kubernetes à la "façon CoreOS" avec du TLS, le composant complémentaire pour le DNS interne, etc. Ces guides passent les tests de conformité Kubernetes et nous vous recommendons de [les tester vous-même] (https://coreos.com/kubernetes/docs/latest/conformance-tests.html).


* [**Multi-noeuds sur AWS**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)

    Guide et outil en ligne de commande pour créer un cluster multi-noeuds sur AWS.
    CloudFormation est utilisé pour créer un noeud maitre ("master") et plusieurs noeuds de type "worker".

* [**Multi-noeuds sur serveurs physiques (Bare Metal)**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)

    Guide et service HTTP / API pour l'initialisation et l'installation d’un cluster à plusieurs nœuds bare metal à partir d'un PXE.
    [Ignition](https://coreos.com/ignition/docs/latest/) est utilisé pour provisionner un cluster composé d'un master et de plusieurs workers lors du démarrage initial des serveurs.

* [**Multi-noeuds sur Vagrant**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)

    Guide pour l'installation d'un cluster multi-noeuds sur Vagrant.
    L'outil de déploiement permet de configurer indépendemment le nombre de noeuds etcd, masters et workers afin d'obtenir un control plane en haute disponibilité.

* [**Noeud unique sur Vagrant**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)

    C'est la façon la plus rapide d'installer un environnement de développement local Kubernetes.
    Il suffit simplement de `git clone`, `vagrant up` puis configurer `kubectl`.


* [**Guide complet pas à pas**](https://coreos.com/kubernetes/docs/latest/getting-started.html)

    Un guide générique qui permet de déployer un cluster en haute disponibilité (avec du TLS) sur n'importe cloud ou sur du bare metal.
    Répéter les étapes pour obtenir plus de noeuds master ou worker

## Guide de la communauté

Ces guides sont maintenus par des membres de la communauté et couvrent des besoins et cas d'usages spécifiques. Ils proposent différentes manières de configurer Kubernetes sur CoreOS.

* [**Cluster multi-noeuds facile sur Google Compute Engine**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)

    Installation scriptée d'un master unique et de plusieurs workers sur GCE.
    Les composants Kubernetes sont gérés par [fleet](https://github.com/coreos/fleet)

* [**Cluster multi-noeuds en utilisant cloud-config et Weave sur Vagrant**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)

    Configure un cluster de 3 machines sur Vagrant, le réseau du cluster étant fourni par Weave.

* [**Cluster multi-noeuds en utilisant cloud-config et Vagrant**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)

    Configure un cluster local composé d'un master et de plusieurs workers sur l'hyperviseur de votre choix: VirtualBox, Parallels, ou VMware

* [**Cluster d'un seul noeud en utilisant une application macOS**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)

    Guide permettant d'obtenir un cluster d'un seul noeud faisant office de master et worker et contrôlé par une application macOS menubar.
    (basé sur xhyve et CoreOS)

* [**Cluster multi-noeuds avec Vagrant et fleet en utilisant une petite application macOS**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)

    Guide permettant d'obtenir un cluster composé d'un master, de plusieurs workers contrôlés par une application macOS menubar.

* [**Multi-node cluster using cloud-config, CoreOS and VMware ESXi**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)

    Configure un cluster composé d'un master et de plusieurs workers sur VMWare ESXi

* [**Cluster Unique/Multi noeuds en utilisant cloud-config, CoreOS et Foreman**](https://github.com/johscheuer/theforeman-coreos-kubernetes)

    Configure un cluster composé d'un ou de plusieurs noeuds avec [Foreman](https://theforeman.org).

## Niveau de support


| IaaS Provider | Config. Mgmt | OS     | Networking | Docs                                        | Conforms | Support Level                                                                                          |
| ------------- | ------------ | ------ | ---------- | ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| GCE           | CoreOS       | CoreOS | flannel    | [docs](/docs/getting-started-guides/coreos) |          | Community ([@pires](https://github.com/pires))                                                         |
| Vagrant       | CoreOS       | CoreOS | flannel    | [docs](/docs/getting-started-guides/coreos) |          | Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles)) |

Pour le niveau de support de toutes les solutions se référer au [Tableau des solutions](/docs/getting-started-guides/#table-of-solutions).

{{% /capture %}}

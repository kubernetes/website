---
title: "Instalar herramientas"
description: Configurar las herramientas de Kubernetes en su computadora.
weight: 10
no_list: true
---

## kubectl

Usa la herramienta de línea de comandos de Kubernetes, [kubectl](/docs/user-guide/kubectl/), para desplegar y gestionar aplicaciones en Kubernetes. Usando kubectl, puedes inspeccionar recursos del clúster; crear, eliminar, y actualizar componentes; explorar tu nuevo clúster y arrancar aplicaciones.

Ver [Instalar y Configurar `kubectl`](/docs/tasks/tools/install-kubectl/) para más información sobre cómo descargar y instalar `kubectl` y configurarlo para acceder su clúster.

<a class="btn btn-primary" href="/docs/tasks/tools/install-kubectl/" role="button" aria-label="Ver la guía de instalación y configuración de kubectl">Ver la guía de instalación y configuración de kubectl</a>

También se puede leer [la documentación de referencia](/docs/reference/kubectl) de `kubectl`.

## kind
[`kind`](https://kind.sigs.k8s.io/docs/) le permite usar Kubernetes en su máquina local. Esta herramienta require que [Docker](https://docs.docker.com/get-docker/) instalado y configurado.

En la página de [inicio rápido](https://kind.sigs.k8s.io/docs/user/quick-start/) encontrarás toda la información necesaria para empezar con kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Ver la guía de inicio rápido">Ver la guía de inicio rápido</a>

## minikube

De forma similar a `kind`, [`minikube`](https://minikube.sigs.k8s.io/) es una herramienta que le permite usar Kubernetes en su máquina local. `minikube` le permite ejecutar un único nodo en su computadora personal (PC de Windows, macOS y Linux) para que se pueda probar Kubernetes, o para su trabajo de desarrollo.

Se puede seguir la guía oficial de [`minikube`](https://minikube.sigs.k8s.io/docs/start/) si su enfoque esta instalando la herramienta. 

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Ver la guía de minikube">Ver la guía de minikube</a>

Una vez `minikube` ha terminado de instalarse, está lista para desplegar un aplicación de ejemplo (/docs/tutorials/hello-minikube/).

## kubeadm

Se puede usar la utilidad {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} para crear y gestionar clústeres de Kubernetes.

En [instalando kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) se muestra como instalar kubeadm. Una vez instalado, se puede utilizar [para crear un clúster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Ver la guía de instalación">Ver la guía de instalación</a>

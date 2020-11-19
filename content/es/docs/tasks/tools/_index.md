---
title: "Instalar herramientas"
description: Configurar las herramientas de Kubernetes en su computadora.
weight: 10
no_list: true
---

## kubectl

La herramienta de linea de commando de Kubernetes, `kubectl`, le permite a ejucutar comandos contra los clùsteres de Kubernetes. También, se puede usar `kubectl` para desplegar aplicaciones, inspeccionar y gestionar los recursos de clústeres, y ver los logs.

Ver [Instalar y Configurar `kubectl`](/docs/tasks/tools/install-kubectl/) para màs información sobre como descargar y instalar `kubectl` y configurarlo para acceder su clúster.

<a class="btn btn-primary" href="/docs/tasks/tools/install-kubectl/" role="button" aria-label="Ver la guía de instalaciòn y configuración de kubectl">Ver la guía de instalación y configuración de kubectl</a>

También se puede leer [la documentación de referencia](/docs/reference/kubectl) de `kubectl`.

## kind
[`kind`](https://kind.sigs.k8s.io/docs/) le permite usar Kubernetes en su máquina local. Esta herramienta require que tiene [Docker](https://docs.docker.com/get-docker/) instalado y configurado.

La página de [inicio rápido](https://kind.sigs.k8s.io/docs/user/quick-start/) de kind se muestra que tiene que hacer para empezar con kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="Ver la guía de inicio rápido">Ver la guía de inicio rápido</a>

## minikube

Como `kind`, [`minikube`](https://minikube.sigs.k8s.io/) es una herramienta que le permite usar Kubernetes en su máquina local. `minikube` le permite ejecutar un único nodo en su computadora personal (inclúyendo PC de Windows, macOS y Linux) para que se pueda probar Kubernetes, o para su trabajo de desarrollo.

Se puede seguir la guía oficial de [`minikube`](https://minikube.sigs.k8s.io/docs/start/) si su enfoque esta instalando la herramienta. 

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="Ver la guía de minikube">Ver la guía de minikube</a>

Una vez `minikube` ha terminado de instalarse, se puede usarla para empezar un aplicación de ejemplo(/docs/tutorials/hello-minikube/).

## kubeadm

Se puede usar la {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} herramienta para crear y gestionar clústeres de Kubernetes. Se ejecutan las acciones necesarias para ejecutar un clúster mínimo en forma fácil.

[Instalando kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) se muestra como instalar kubeadm. Una vez instalado, se puede usarlo [para crear un clúster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="Ver la guía de instalación">Ver la guía de instalación</a>
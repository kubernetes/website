---
title: Ferramentas
content_type: concept
---

<!-- overview -->
O Kubernetes contém várias ferramentas internas para ajudá-lo a trabalhar com o sistema Kubernetes.


<!-- body -->
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/) é a ferramenta de linha de comando para o Kubernetes. Ela controla o gerenciador de cluster do Kubernetes.


## Kubeadm

[`kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) é a ferramenta de linha de comando para provisionar facilmente um cluster Kubernetes seguro sobre servidores físicos ou na nuvem ou em máquinas virtuais (atualmente em alfa).


## Minikube

[`minikube`](/docs/tasks/tools/install-minikube/) é uma ferramenta que facilita a execução local de um cluster Kubernetes de nó único em sua estação de trabalho para fins de desenvolvimento e teste.


## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), a interface Web do Kubernetes, permite implantar aplicativos em contêiner em um cluster do Kubernetes, solucionar problemas e gerenciar o cluster e seus próprios recursos.


## Helm

[`Kubernetes Helm`](https://github.com/kubernetes/helm) é uma ferramenta para gerenciar pacotes de recursos pré-configurados do Kubernetes, também conhecidos como Kubernetes charts.

Use o Helm para:

* Encontrar e usar softwares populares empacotados como Kubernetes charts
* Compartilhar seus próprios aplicativos como Kubernetes charts
* Criar builds reproduzíveis de seus aplicativos Kubernetes
* Gerenciar de forma inteligente os arquivos de manifesto do Kubernetes
* Gerenciar versões dos pacotes Helm


## Kompose

[`Kompose`](https://github.com/kubernetes-incubator/kompose) é uma ferramenta para ajudar os usuários do Docker Compose a migrar para o Kubernetes.

Use o Kompose para:

* Converter um arquivo Docker Compose em objetos Kubernetes
* Ir do desenvolvimento local do Docker ao gerenciamento de seu aplicativo via Kubernetes
* Converter arquivos `yaml` do Docker Compose v1 ou v2 ou [Bundles de Aplicativos Distribuídos](https://docs.docker.com/compose/bundles/)


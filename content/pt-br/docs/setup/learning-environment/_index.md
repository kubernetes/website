---
title: Ambiente de aprendizagem
content_type: concept
weight: 20
---

<!-- overview -->

Para aprender Kubernetes, você precisará de um ambiente para praticar. Esta página apresenta as opções para configurar um ambiente Kubernetes no qual seja possível experimentar e aprender.

<!-- body -->

## Instalando a ferramenta kubectl

Antes de configurar um cluster, você precisa da ferramenta de linha de comando `kubectl`. Essa ferramenta permite a comunicação com um cluster Kubernetes e a execução de comandos nele.

Consulte [Instale e configure o kubectl](/pt-br/docs/tasks/tools/#kubectl) para instruções de instalação.

## Configurando ambientes Kubernetes locais

Executar o Kubernetes localmente oferece um ambiente seguro para aprender e experimentar. Você pode criar e remover clusters sem se preocupar com custos ou afetar sistemas em produção.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) executa clusters Kubernetes utilizando contêineres Docker como nós. É leve e foi desenvolvido especificamente para testar o Kubernetes, mas também pode ser utilizado para aprendizado.

Para começar a usar a ferramenta kind, consulte o [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) executa um cluster Kubernetes de nó único em sua máquina local. O minikube oferece suporte a múltiplos agentes de execução de contêiner e funciona no Linux, macOS e Windows.

Para começar a usar a ferramenta minikube, consulte o guia [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/).

### Outras opções locais

{{% thirdparty-content single="true" %}}

Existem várias ferramentas de terceiros que também podem executar o Kubernetes localmente. O Kubernetes não oferece suporte a essas ferramentas, mas elas podem funcionar bem para o seu aprendizado:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) pode executar um cluster Kubernetes local
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) pode executar um cluster Kubernetes local
- [Rancher Desktop](https://docs.rancherdesktop.io/) disponibiliza o Kubernetes em sua máquina pessoal
- [MicroK8s](https://canonical.com/microk8s) executa um cluster Kubernetes leve
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) executa um cluster OpenShift mínimo localmente (OpenShift é conforme ao Kubernetes)

Consulte a documentação de cada ferramenta para instruções de instalação e suporte.

## Utilizando ambientes para testes online

{{% thirdparty-content single="true" %}}

Ambientes Kubernetes para testes online permitem que você teste o Kubernetes sem precisar instalá-lo em seu computador. Esses ambientes são executados em seu navegador:

- **[Killercoda](https://killercoda.com/kubernetes)** fornece cenários interativos de Kubernetes e um ambiente de testes
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** fornece um cluster Kubernetes temporário no navegador

Essas plataformas são úteis para realizar experimentos rápidos e seguir tutoriais sem a necessidade de instalação local.

## Praticando com clusters para produção

Para praticar com um cluster mais semelhante a um ambiente de produção, você pode utilizar a ferramenta **kubeadm**. A instalação de um cluster com o kubeadm é uma tarefa avançada que requer múltiplas máquinas (físicas ou virtuais) e uma configuração cuidadosa.

Para aprender sobre ambientes de produção, consulte [ambientes de produção](/docs/setup/production-environment/).

{{< note >}}
Instalar um cluster para produção é significativamente mais complexo do que os ambientes de aprendizado descritos acima. Comece primeiro com a ferramenta kind, o minikube ou um ambiente de testes online.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Siga o tutorial [Olá, Minikube!](/pt-br/docs/tutorials/hello-minikube/) para implantar sua primeira aplicação
- Aprenda sobre os [Componentes do Kubernetes](/pt-br/docs/concepts/overview/components/)
- Explore os [comandos do kubectl](/pt-br/docs/reference/kubectl/)

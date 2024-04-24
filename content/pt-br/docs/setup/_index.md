---
no_issue: true
title: Instalação
main_menu: true
weight: 30
content_type: concept
---

<!-- overview -->

Essa seção lista as diferentes formas de instalar e executar o Kubernetes. Quando você realiza a instalação de um cluster Kubernetes, deve decidir o tipo de instalação baseado em critérios como facilidade de manutenção, segurança, controle, quantidade de recursos disponíveis e a experiência necessária para gerenciar e operar o cluster.

Você pode criar um cluster Kubernetes em uma máquina local, na nuvem, em um datacenter on-premises ou ainda escolher uma oferta de um cluster Kubernetes gerenciado pelo seu provedor de computação em nuvem.

Existem ainda diversos outros tipos de soluções customizadas, que você pode se deparar ao buscar formas de instalação e gerenciamento de seu cluster.

<!-- body -->

## Ambientes de aprendizado

Se você está aprendendo ou pretende aprender mais sobre o Kubernetes, use ferramentas suportadas pela comunidade, ou ferramentas no ecossistema que te permitam criar um cluster Kubernetes em sua máquina virtual.

Temos como exemplo aqui o [Minikube](/docs/tasks/tools/install-minikube/) e o [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/)


## Ambientes de produção

Ao analisar uma solução para um ambiente de produção, devem ser considerados quais aspectos de operação de um cluster Kubernetes você deseja gerenciar, ou então delegar ao seu provedor.

Temos diversas opções para esse provisionamento, desde o uso de uma ferramenta de deployment de um cluster tal qual o [Kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) ou o [Kubespray](/docs/setup/production-environment/tools/kubespray/) quando se trata de um cluster local, ou ainda o uso de um cluster gerenciado por seu provedor de nuvem.

Para a escolha do melhor ambiente e da melhor forma para fazer essa instalação, você deve considerar:

* Se você deseja se preocupar com a gestão de backup da sua estrutura do ambiente de gerenciamento
* Se você deseja ter um cluster mais atualizado, com novas funcionalidades, ou se deseja seguir a versão suportada pelo fornecedor
* Se você deseja ter um cluster com um alto nível de serviço, ou com auto provisionamento de alta disponibilidade
* Quanto você deseja pagar por essa produção




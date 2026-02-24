---
no_issue: true
title: Primeiros passos
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Ambiente de aprendizagem
  - anchor: "#production-environment"
    title: Ambiente de produção
---

<!-- overview -->

Essa seção apresenta as diferentes formas de instalar e executar o Kubernetes.
Ao realizar a instalação de um cluster Kubernetes, é necessário decidir o tipo de instalação com base em critérios como facilidade de manutenção, segurança, controle, quantidade de recursos disponíveis e experiência necessária para gerenciar e operar o cluster.

Você pode [baixar o Kubernetes](/releases/download/) para implantar um cluster Kubernetes
em uma máquina local, na nuvem, ou em um data center próprio.

Vários [componentes do Kubernetes](/docs/concepts/overview/components/) como  {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} e o {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, também podem ser implantados como [imagens de contêiner](/releases/download/#container-images) dentro do cluster.

**Recomenda-se** executar os componentes do Kubernetes como imagens de contêiner sempre
que possível, permitindo que o próprio Kubernetes os gerencie.
Componentes responsáveis por executar contêineres - particularmente, o kubelet - não podem ser incluídos nesta categoria.

Caso você não queira gerenciar um cluster Kubernetes por conta própria, pode optar por um serviço gerenciado, incluindo
[plataformas certificadas](/docs/setup/production-environment/turnkey-solutions/).
Também existem outras soluções padronizadas e personalizadas que abrangem uma ampla variedade de ambientes em nuvem e
em servidores dedicados.

<!-- body -->

## Ambiente de aprendizagem

Se você está aprendendo ou pretende aprender mais sobre Kubernetes, utilize ferramentas suportadas pela comunidade
ou ferramentas do ecossistema que permitam criar um cluster Kubernetes em sua máquina virtual.
Consulte [Ambiente de aprendizagem](/docs/setup/learning-environment/)

## Ambiente de produção

Ao analisar uma solução para um [ambiente de produção](/docs/setup/production-environment/), devem ser considerados os aspectos
da operação de um cluster Kubernetes (ou _abstrações_) que você deseja gerenciar,
ou delegar ao seu provedor.

Para um cluster gerenciado por você, a ferramenta oficialmente suportada
para implantar o Kubernetes é o [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Baixe o Kubernetes](/releases/download/)
- Baixe e [instale as ferramentas](/docs/tasks/tools/) incluindo o `kubectl`
- Selecione um [agente de execução de contêiner](/docs/setup/production-environment/container-runtimes/) para o seu novo cluster
- Aprenda sobre [boas práticas](/docs/setup/best-practices/) para a instalação de um cluster

Kubernetes é desenvolvido para que sua {{< glossary_tooltip term_id="control-plane" text="camada de gerenciamento" >}} seja executada em máquinas Linux. Dentro do cluster, as aplicações podem ser executadas em máquinas Linux ou em outros sistemas operacionais, incluindo o Windows.

- Aprenda a [configurar clusters com nós Windows](/docs/concepts/windows/)

---
title: Primeiros passos
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#ambiente-de-aprendizagem"
    title: Ambiente de aprendizagem
  - anchor: "#ambiente-de-produção"
    title: Ambiente de produção  
---

<!-- overview -->

Esta secção lista as diferentes formas de configurar e executar o Kubernetes.
Quando instala o Kubernetes, escolha um tipo de instalação baseado na facilidade de manutenção, segurança,
controlo, recursos disponíveis e conhecimentos necessários para operar e gerir um cluster.

Pode [descarregar o Kubernetes](/releases/download/) para implementar um cluster Kubernetes
numa máquina local, na nuvem ou no seu próprio centro de dados.

Vários [componentes do Kubernetes](/docs/concepts/overview/components/) como o {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} ou o {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} também podem ser
implementados como [imagens de contentor](/releases/download/#container-images) dentro do cluster.

É **recomendado** executar os componentes do Kubernetes como imagens de contentor sempre
que possível, e ter o Kubernetes a gerir esses componentes.
Componentes que executam contentores - notavelmente, o kubelet - não podem ser incluídos nesta categoria.

Se não quiser gerir um cluster Kubernetes por si, pode optar por um serviço gerido, incluindo
[plataformas certificadas](/docs/setup/production-environment/turnkey-solutions/).
Existem também outras soluções padronizadas e personalizadas numa vasta gama de ambientes na nuvem e
em metal nu.

<!-- body -->

## Ambiente de aprendizagem

Se está a aprender Kubernetes, utilize as ferramentas suportadas pela comunidade Kubernetes,
ou ferramentas no ecossistema para configurar um cluster Kubernetes numa máquina local.
Veja [Instalar ferramentas](/docs/tasks/tools/).

## Ambiente de produção

Ao avaliar uma solução para um
[ambiente de produção](/docs/setup/production-environment/), considere quais aspetos de
operar um cluster Kubernetes (ou _abstrações_) deseja gerir por si e quais prefere delegar a um fornecedor.

Para um cluster que está a gerir por si, a ferramenta oficialmente suportada
para implementar o Kubernetes é o [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Descarregar o Kubernetes](/releases/download/)
- Descarregar e [instalar ferramentas](/docs/tasks/tools/) incluindo o `kubectl`
- Selecione um [runtime de contentor](/docs/setup/production-environment/container-runtimes/) para o seu novo cluster
- Aprenda sobre as [melhores práticas](/docs/setup/best-practices/) para a configuração do cluster

O Kubernetes é projetado para que o seu {{< glossary_tooltip term_id="control-plane" text="plano de controlo" >}} 
execute em Linux. Dentro do seu cluster, pode executar aplicações em Linux ou outros sistemas operativos, incluindo
Windows.

- Aprenda a [configurar clusters com nós Windows](/docs/concepts/windows/)

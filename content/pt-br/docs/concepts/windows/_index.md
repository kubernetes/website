---
title: "Windows no Kubernetes"
simple_list: true
weight: 200 # late in list
description: >-
  O Kubernetes oferece suporte a nós que executam Microsoft Windows.
---

O Kubernetes oferece suporte a {{< glossary_tooltip text="nós" term_id="nós" >}} de trabalho que executam Linux ou Microsoft Windows.

{{% thirdparty-content single="true" %}}

A CNCF e sua empresa-mãe, a Linux Foundation, adotam uma abordagem neutra a fornecedores em relação à compatibilidade. É possível adicionar seu [servidor Windows](https://www.microsoft.com/pt-br/windows-server) como um node de trabalho em um cluster Kubernetes.

Você pode [instalar e configurar o kubectl no Windows](/docs/tasks/tools/install-kubectl-windows/), independentemente do sistema operacional que você usa em seu cluster.

Se você estiver usando nodes Windows, pode ler:

* [Rede no Windows](/docs/concepts/services-networking/windows-networking/)
* [Armazenamento no Windows no Kubernetes](/docs/concepts/storage/windows-storage/)
* [Gerenciamento de Recursos para Nodes Windows](/docs/concepts/configuration/windows-resource-management/)
* [Configurar RunAsUserName para Pods e Containers Windows](/docs/tasks/configure-pod-container/configure-runasusername/)
* [Criar um Pod HostProcess no Windows](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [Configurar Contas de Serviço Gerenciadas por Grupo para Pods e Containers Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
* [Segurança para Nodes Windows](/docs/concepts/security/windows-security/)
* [Dicas de Debugging no Windows](/docs/tasks/debug/debug-cluster/windows/)
* [Guia para Agendar Containers Windows no Kubernetes](/docs/concepts/windows/user-guide)

Ou, para uma visão geral, leia:

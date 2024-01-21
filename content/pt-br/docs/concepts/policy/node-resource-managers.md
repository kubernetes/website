---
title: Gerenciadores de Recursos de Nós
content_type: concept
weight: 50
---

<!-- overview -->

Para dar suporte a cargas de trabalho com latência crítica e altas taxas de transferência, o Kubernetes oferece um conjunto de gerenciadores de recursos. Os gerenciadores visam coordenar e otimizar o alinhamento de recursos do nó(s) para Pods configurados com um requisito específico para CPUs, dispositivos e recursos de memória (*hugepages*).

<!-- body -->

O gerenciador principal, o gerenciador de topologia, é um componente do Kubelet que coordena o processo geral de gerenciamento de recursos por meio da sua [política](/docs/tasks/administer-cluster/topology-manager/).

A configuração de gerenciadores individuais é discutida em documentos dedicados:

- [Política de gerenciamento da CPU](/docs/tasks/administer-cluster/cpu-management-policies/)
- [Gerenciador de Dispositivos](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [Políticas do Gerenciador de Memória](/docs/tasks/administer-cluster/memory-manager/)
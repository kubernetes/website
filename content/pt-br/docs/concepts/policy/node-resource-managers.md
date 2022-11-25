---
reviewers:
- derekwaynecarr
- klueska
title: Node Resource Managers 
content_type: concept
weight: 50
---

<!-- overview -->

Para dar suporte a latência crítica e a cargas de trabalho de alta taxa de transferência. O kubernets oferece um conjunto de grenciadores de recursos. Os gerenciadores visam coordenar e otimizar o alinhamento de recursos do nó(s) para pods configurados com um requisito específico para CPUs, dispositivos e recursos de memória (grandes páginas).

<!-- body -->

O gerenciador principal, o Gerenciador de Topologia, é um componente do Kubelet que coordena o processo geral de gerenciamento de recursos por meio de sua [politica](/docs/tasks/administer-cluster/topology-manager/).

A configuração de gerentes individuais é elaborada em documentos dedicados:

- [Politica de gerenciamento de CPU](/docs/tasks/administer-cluster/cpu-management-policies/)
- [Gerenciador de Dispositivos](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [Políticas do Gerenciador de Memória](/docs/tasks/administer-cluster/memory-manager/)
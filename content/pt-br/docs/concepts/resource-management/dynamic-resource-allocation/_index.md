---
title: Alocação Dinâmica de Recursos
content_type: concept
weight: 20
no_list: true
aliases:
- /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Esta seção apresenta a _alocação dinâmica de recursos (DRA)_ no Kubernetes.

{{< glossary_definition prepend="DRA é" term_id="dra" length="all" >}}

Alocar recursos com DRA oferece uma experiência semelhante ao
[provisionamento dinâmico de volumes](/docs/concepts/storage/dynamic-provisioning/),
no qual você utiliza PersistentVolumeClaims para requisitar capacidade de armazenamento a partir de classes de armazenamento,
e solicita a capacidade requisitada para uso nos seus Pods.

<!-- body -->

### Benefícios da DRA {#dra-benefits}

A DRA oferece uma forma flexível de categorizar, solicitar e utilizar dispositivos no seu cluster.
O uso da DRA traz benefícios como os seguintes:

* **Filtragem flexível de dispositivos**: utilize a linguagem de expressão comum (CEL) para realizar
  uma filtragem detalhada de atributos específicos de dispositivos.
* **Compartilhamento de dispositivos**: compartilhe o mesmo recurso entre múltiplos contêineres ou Pods
  referenciando a requisição de recurso correspondente.
* **Configuração de dispositivos**: associe configurações de dispositivo específicas do fornecedor à sua requisição de recurso, possibilitando a configuração de dispositivos por carga de trabalho, em vez da configuração de dispositivos por nó utilizada atualmente
* **Categorização centralizada de dispositivos**: drivers de dispositivo e administradores do cluster podem
  utilizar classes de dispositivo para fornecer aos operadores de aplicações categorias de hardware
  otimizadas para diversos casos de uso. Por exemplo, você pode criar uma classe de dispositivo
  otimizada para custo para cargas de trabalho de uso geral, e uma classe de dispositivo de alto
  desempenho para tarefas críticas.
* **Solicitações de Pod simplificadas**: com a DRA, os operadores de aplicações não precisam especificar
  quantidades de dispositivos nas solicitações de recursos do Pod. Em vez disso, o Pod referencia uma
  requisição de recurso, e a configuração de dispositivo dessa requisição é aplicada ao Pod.

Esses benefícios proporcionam melhorias significativas no fluxo de execução de alocação de dispositivos
quando comparados aos
[plugins de dispositivo](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
que exigem solicitações de dispositivo por contêiner, não suportam compartilhamento de dispositivos e
não suportam filtragem de dispositivos baseada em expressões.

### Tipos de usuários da DRA {#dra-user-types}

O fluxo de execução de uso da DRA para alocar dispositivos envolve os seguintes tipos de usuários:

* **Proprietário do dispositivo**: responsável pelos dispositivos. Os proprietários de dispositivos podem ser fornecedores
  comerciais, o operador do cluster ou outra entidade. Para utilizar a DRA, os dispositivos devem
  possuir drivers compatíveis com DRA que façam o seguinte:

  * Criar ResourceSlices que forneçam ao Kubernetes informações sobre
    nós e recursos.
  * Atualizar ResourceSlices quando a capacidade de recursos no cluster mudar.
  * Configurar os dispositivos de acordo com a requisição e associá-los aos contêineres por meio da Container Device Interface (CDI).
  * Opcionalmente, criar DeviceClasses que os operadores de cargas de trabalho possam utilizar para
    requisitar dispositivos.

* **Administrador do cluster**: responsável por configurar clusters e nós,
  conectar dispositivos, instalar drivers e tarefas semelhantes. Para utilizar a DRA,
  os administradores do cluster fazem o seguinte:

  * Conectam dispositivos aos nós.
  * Instalam drivers de dispositivo que suportam DRA.
  * Opcionalmente, criam DeviceClasses que os operadores de cargas de trabalho possam utilizar para requisitar dispositivos.

* **Operador de cargas de trabalho**: responsável pela implantação e pelo gerenciamento de cargas de trabalho no
  cluster. Para utilizar a DRA para alocar dispositivos aos Pods, os operadores de cargas de trabalho fazem o seguinte:

  * Criam ResourceClaims ou ResourceClaimTemplates para solicitar configurações
    específicas dentro de DeviceClasses.
  * Implantam cargas de trabalho que utilizam ResourceClaims ou ResourceClaimTemplates específicos.

## Limitações

* O alocador do Kubernetes não suporta
  [preempção](/docs/concepts/scheduling-eviction/pod-priority-preemption/) para
  recursos de DRA. Isso significa que um Pod existente que está em execução em um nó e
  utiliza recursos de DRA não pode sofrer preempção por um Pod de prioridade mais alta que também precise
  de recursos de DRA. O Pod de alta prioridade permanecerá em estado pendente até que o dispositivo
  fique disponível, o que ocorre quando o Pod conflitante é encerrado ou é
  excluído manualmente.

## {{% heading "whatsnext" %}}

- [Configurar a DRA em um Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Alocar dispositivos para cargas de trabalho utilizando DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [Acessar metadados de dispositivos da DRA](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- Para mais informações sobre o design, consulte a KEP
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).

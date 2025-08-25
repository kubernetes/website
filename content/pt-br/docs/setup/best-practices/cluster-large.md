---
title: Considerações para clusters grandes
weight: 10
---

Um cluster é um conjunto de {{< glossary_tooltip text="nós" term_id="node" >}} (máquinas físicas ou virtuais) executando agentes do Kubernetes, gerenciados pela {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}}.
O Kubernetes {{< param "version" >}} suporta clusters com até 5.000 nós. Mais especificamente, o Kubernetes foi projetado para acomodar configurações que atendem a *todos* os seguintes critérios:

* Não mais de 110 Pods por nó
* Não mais de 5.000 nós
* Não mais de 150.000 Pods no total
* Não mais de 300.000 contêineres no total

Você pode escalar seu cluster adicionando ou removendo nós. A forma como você faz isso depende de como seu cluster está implantado.

## Cotas de recursos do provedor de nuvem {#quota-issues}

Para evitar problemas de cota do provedor de nuvem ao criar um cluster com muitos nós, considere:
* Solicitar um aumento de cota para recursos de nuvem como:
    * Instâncias de computação
    * CPUs
    * Volumes de armazenamento
    * Endereços IP em uso
    * Conjuntos de regras de filtragem de pacotes
    * Número de balanceadores de carga
    * Sub-redes
    * Fluxos de log
* Controlar as ações de escalonamento do cluster para trazer novos nós em lotes, com uma pausa entre os lotes, porque alguns provedores de nuvem limitam a taxa de criação de novas instâncias.

## Componentes da camada de gerenciamento

Para um cluster grande, você precisa de uma camada de gerenciamento com recursos computacionais e outros recursos suficientes.

Normalmente, você executaria uma ou duas instâncias da camada de gerenciamento por zona de falha, escalonando essas instâncias verticalmente primeiro e depois escalonando horizontalmente, quando o escalonamento vertical não for mais eficiente.

Você deve executar pelo menos uma instância por zona de falha para fornecer tolerância a falhas. Os nós do Kubernetes não direcionam automaticamente o tráfego para endpoints da camada de gerenciamento que estão na mesma zona de falha; no entanto, seu provedor de nuvem pode ter seus próprios mecanismos para fazer isso.

Por exemplo, usando um balanceador de carga gerenciado, você configura o balanceador de carga para enviar tráfego originado do kubelet e Pods na zona de falha _A_, direcionando esse tráfego apenas para os hosts da camada de gerenciamento que também estão na zona _A_. Se um único host da camada de gerenciamento ou endpoint da zona de falha _A_ ficar offline, isso significa que todo o tráfego da camada de gerenciamento para nós na zona _A_ agora está sendo enviado entre zonas. Executar múltiplos hosts da camada de gerenciamento em cada zona torna esse cenário menos provável.

### Armazenamento etcd

Para melhorar o desempenho de clusters grandes, você pode armazenar objetos Event em uma instância etcd dedicada separada.

Ao criar um cluster, você pode (usando ferramentas personalizadas):

* iniciar e configurar uma instância etcd adicional
* configurar o {{< glossary_tooltip term_id="kube-apiserver" text="servidor de API" >}} para usá-la para armazenar eventos

Consulte [Operação de clusters etcd para Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) e
[Configurar um cluster etcd de alta disponibilidade com kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
para detalhes sobre configuração e gerenciamento do etcd para um cluster grande.

## Recursos de complementos

Os [limites de recursos](/pt-br/docs/concepts/configuration/manage-resources-containers/) do Kubernetes
ajudam a minimizar o impacto de vazamentos de memória e outras formas como Pods e contêineres podem
impactar outros componentes. Esses limites de recursos se aplicam a
recursos de {{< glossary_tooltip text="complementos" term_id="addons" >}} assim como se aplicam a cargas de trabalho de aplicação.

Por exemplo, você pode definir limites de CPU e memória para um componente de log:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Os limites padrão dos complementos são tipicamente baseados em dados coletados da experiência de executar cada complemento em clusters Kubernetes pequenos ou médios. Ao executar em clusters grandes, os complementos frequentemente consomem mais recursos do que seus limites padrão.
Se um cluster grande for implantado sem ajustar esses valores, o(s) complemento(s) podem ser continuamente eliminados porque continuam atingindo o limite de memória.
Alternativamente, o complemento pode executar, mas com desempenho ruim devido a restrições de fatia de tempo de CPU.

Para evitar problemas de recursos de complementos do cluster, ao criar um cluster com muitos nós, considere o seguinte:

* Alguns complementos escalonam verticalmente - há uma réplica do complemento para o cluster ou servindo uma zona de falha inteira. Para esses complementos, aumente os requerimentos e limites conforme você escalona seu cluster.
* Muitos complementos escalonam horizontalmente - você adiciona capacidade executando mais Pods - mas com um cluster muito grande, você também pode precisar aumentar ligeiramente os limites de CPU ou memória.
  O [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) pode executar no modo _recommender_ para fornecer valores sugeridos para requerimentos e limites.
* Alguns complementos executam como uma cópia por nó controlados por um {{< glossary_tooltip text="DaemonSet"
term_id="daemonset" >}}: por exemplo, um agregador de log a nível de nó. Similar ao caso com complementos escalonados horizontalmente, você também pode precisar aumentar ligeiramente os limites de CPU ou memória.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` é um recurso personalizado que você pode implantar em seu cluster para ajudá-lo a gerenciar requerimentos e limites de recursos para Pods.  
Saiba mais sobre [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 
e como você pode usá-lo para escalonar componentes do cluster, incluindo complementos críticos do cluster.

* Leia sobre [Escalonamento automático de nós](/docs/concepts/cluster-administration/node-autoscaling/)

* O [redimensionador de complementos](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme) ajuda você a redimensionar os complementos automaticamente conforme a escala do seu cluster muda.
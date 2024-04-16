---
title: Considerações para grandes clusters
weight: 10
---

Um cluster é um conjunto de {{< glossary_tooltip text="nós" term_id="node" >}} (máquinas físicas
ou virtuais) a executar agentes do Kubernetes, geridos pelo
{{< glossary_tooltip text="plano de controlo" term_id="control-plane" >}}.
O Kubernetes {{< param "version" >}} suporta clusters com até 5.000 nós. Mais especificamente,
o Kubernetes é projetado para acomodar configurações que cumpram *todos* os seguintes critérios:

* Não mais do que 110 pods por nó
* Não mais do que 5.000 nós
* Não mais do que 150.000 pods totais
* Não mais do que 300.000 contentores totais

Pode escalar o seu cluster adicionando ou removendo nós. A forma como faz isso depende
de como o seu cluster está implementado.

## Quotas de recursos do fornecedor de nuvem {#quota-issues}

Para evitar problemas de quota com fornecedores de nuvem, ao criar um cluster com muitos nós,
considere:
* Solicitar um aumento de quota para recursos de nuvem, tais como:
    * Instâncias de computação
    * CPUs
    * Volumes de armazenamento
    * Endereços IP em uso
    * Conjuntos de regras de filtragem de pacotes
    * Número de balanceadores de carga
    * Sub-redes de rede
    * Fluxos de log
* Limitar as ações de escalamento do cluster para trazer novos nós em lotes, com uma pausa
  entre lotes, porque alguns fornecedores de nuvem limitam a criação de novas instâncias.

## Componentes do plano de controlo

Para um grande cluster, precisa de um plano de controlo com recursos de computação e outros
recursos suficientes.

Tipicamente, executaria uma ou duas instâncias do plano de controlo por zona de falha,
escalando essas instâncias verticalmente primeiro e depois escalando horizontalmente após atingir
o ponto de retornos decrescentes ao escalar (verticalmente).

Deve executar pelo menos uma instância por zona de falha para fornecer tolerância a falhas. Os
nós do Kubernetes não direcionam automaticamente o tráfego para endpoints do plano de controlo que estão na
mesma zona de falha; no entanto, o seu fornecedor de nuvem pode ter mecanismos próprios para fazer isso.

Por exemplo, usando um balanceador de carga gerido, configura o balanceador de carga para enviar tráfego
que tem origem no kubelet e Pods na zona de falha _A_, e direcionar esse tráfego apenas
para os hosts do plano de controlo que também estão na zona _A_. Se um único host do plano de controlo ou
endpoint da zona de falha _A_ ficar offline, isso significa que todo o tráfego do plano de controlo para
os nós na zona _A_ está agora a ser enviado entre zonas. Executar múltiplos hosts do plano de controlo em
cada zona torna esse resultado menos provável.

### armazenamento etcd

Para melhorar o desempenho de grandes clusters, pode armazenar objetos de evento numa instância dedicada
do etcd.

Ao criar um cluster, pode (usando ferramentas personalizadas):

* iniciar e configurar instância adicional do etcd
* configurar o {{< glossary_tooltip term_id="kube-apiserver" text="servidor API" >}} para usá-lo para armazenar eventos

Veja [Operar clusters etcd para o Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) e
[Configurar um cluster etcd de Alta Disponibilidade com kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
para detalhes sobre configurar e gerir etcd para um grande cluster.

## Recursos de addons

Os [limites de recursos](/docs/concepts/configuration/manage-resources-containers/) do Kubernetes
ajudam a minimizar o impacto de fugas de memória e outras formas como pods e contentores podem
afetar outros componentes. Estes limites de recursos aplicam-se a
recursos de {{< glossary_tooltip text="addons" term_id="addons" >}} tal como aplicam-se a cargas de trabalho de aplicações.

Por exemplo, pode definir limites de CPU e memória para um componente de log:

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

Os limites padrão dos addons são tipicamente baseados em dados recolhidos da experiência a executar
cada addon em clusters Kubernetes pequenos ou médios. Quando executado em grandes
clusters, os addons frequentemente consomem mais de alguns recursos do que os seus limites padrão.
Se um grande cluster for implementado sem ajustar estes valores, o(s) addon(s)
podem ser continuamente mortos porque estão sempre a atingir o limite de memória.
Alternativamente, o addon pode executar, mas com um desempenho fraco devido a restrições de fatia de tempo de CPU.

Para evitar problemas de recursos de addons do cluster, ao criar um cluster com
muitos nós, considere o seguinte:

* Alguns addons escalam verticalmente - há uma réplica do addon para o cluster
  ou a servir uma zona de falha inteira. Para estes addons, aumente os pedidos e limites
  à medida que escala o seu cluster.
* Muitos addons escalam horizontalmente - adiciona capacidade executando mais pods - mas com
  um cluster muito grande, também pode precisar de aumentar ligeiramente os limites de CPU ou memória.
  O VerticalPodAutoscaler pode ser executado no modo _recomendador_ para fornecer figuras sugeridas
  para pedidos e limites.
* Alguns addons executam como uma cópia por nó, controlados por um {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: por exemplo, um agregador de logs a nível de nó. Semelhante
  ao caso com addons escalados horizontalmente, também pode precisar de aumentar ligeiramente os limites de CPU ou memória.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` é um recurso personalizado que pode implementar no seu cluster
para ajudar a gerir pedidos de recursos e limites para pods.
Saiba mais sobre [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 
e como pode usá-lo para escalar componentes do cluster, incluindo addons críticos do cluster.

* Leia sobre [escalamento automático do cluster](/docs/concepts/cluster-administration/cluster-autoscaling/)

* O [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
ajuda-o a redimensionar automaticamente os addons à medida que a escala do seu cluster muda.
```

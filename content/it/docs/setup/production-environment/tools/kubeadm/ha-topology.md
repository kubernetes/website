---
title: Opzioni per una Topologia Atlamente Disponibile 
content_type: concept
weight: 50
---

<!-- panoramica -->

Questa pagina spiega le due opzioni per configurare la topologia dei cluster Kubernetes altamente disponibili (HA).

Puoi configurare un cluster HA:

- Con nodi del piano di controllo "stacked", dove i nodi etcd sono collocati insieme ai nodi del piano di controllo
- Con nodi etcd esterni, dove etcd viene eseguito su nodi separati rispetto al piano di controllo

Dovresti valutare attentamente i vantaggi e gli svantaggi di ciascuna topologia prima di configurare un cluster HA.

{{< note >}}
kubeadm avvia il cluster etcd in modalità statica. Leggi la
[Guida al Clustering di etcd](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
per maggiori dettagli.
{{< /note >}}

<!-- corpo -->

## Topologia etcd "stacked"

Un cluster HA "stacked" è una [topologia](https://it.wikipedia.org/wiki/Topologia_di_rete) in cui il cluster di storage distribuito fornito da etcd è sovrapposto al cluster formato dai nodi gestiti da kubeadm che eseguono i componenti del piano di controllo.

Ogni nodo del piano di controllo esegue un'istanza di `kube-apiserver`, `kube-scheduler` e `kube-controller-manager`.
Il `kube-apiserver` è esposto ai nodi worker tramite un bilanciatore di carico.

Ogni nodo del piano di controllo crea un membro etcd locale e questo membro etcd comunica solo con il `kube-apiserver` di quel nodo. Lo stesso vale per le istanze locali di `kube-controller-manager` e `kube-scheduler`.

Questa topologia accoppia i piani di controllo e i membri etcd sugli stessi nodi. È più semplice da configurare rispetto a un cluster con nodi etcd esterni e più facile da gestire per la replica.

Tuttavia, un cluster "stacked" corre il rischio di accoppiamento fallito. Se un nodo si guasta, si perdono sia un membro etcd che un'istanza del piano di controllo, compromettendo la ridondanza. Puoi mitigare questo rischio aggiungendo più nodi del piano di controllo.

Si consiglia quindi di eseguire almeno tre nodi del piano di controllo "stacked" per un cluster HA.

Questa è la topologia predefinita in kubeadm. Un membro etcd locale viene creato automaticamente sui nodi del piano di controllo quando si utilizza `kubeadm init` e `kubeadm join --control-plane`.

![Topologia etcd stacked](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Topologia etcd esterna

Un cluster HA con etcd esterno è una [topologia](https://it.wikipedia.org/wiki/Topologia_di_rete) in cui il cluster di storage distribuito fornito da etcd è esterno rispetto al cluster formato dai nodi che eseguono i componenti del piano di controllo.

Come nella topologia etcd "stacked", ogni nodo del piano di controllo in una topologia etcd esterna esegue un'istanza di `kube-apiserver`, `kube-scheduler` e `kube-controller-manager`.
Il `kube-apiserver` è esposto ai nodi worker tramite un bilanciatore di carico. Tuttavia, i membri etcd vengono eseguiti su host separati e ciascun host etcd comunica con il `kube-apiserver` di ogni nodo del piano di controllo.

Questa topologia disaccoppia il piano di controllo e i membri etcd. Fornisce quindi una configurazione HA in cui la perdita di un'istanza del piano di controllo o di un membro etcd ha un impatto minore e non compromette la ridondanza del cluster come nella topologia HA "stacked".

Tuttavia, questa topologia richiede il doppio degli host rispetto alla topologia HA "stacked".
Sono necessari almeno tre host per i nodi del piano di controllo e tre host per i nodi etcd per un cluster HA con questa topologia.

![Topologia etcd esterna](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Configura un cluster altamente disponibile con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)

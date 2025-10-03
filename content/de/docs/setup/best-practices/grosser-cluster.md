---
reviewers:
- lavalamp
title: Überlegungen für große Cluster
weight: 10
---

Ein Cluster ist ein Satz von {{< glossary_tooltip text="Nodes" term_id="node" >}} (physikalisch oder virtuell), auf denen Kubernetes-Agents laufen. 
Diese ermöglichen es der Kubernetes-{{< glossary_tooltip text="Control Plane" term_id="control-plane" >}}, die Nodes zu steuern. 
Kubernetes {{< param "version" >}} unterstützt Cluster mit bis zu 5000 Nodes. Genauer gesagt ist Kubernetes auf folgende Konfigurationen ausgelegt:

- Nicht mehr als 110 Pods pro Node
- Nicht mehr als 5000 Nodes
- Nicht mehr als 150000 Pods insgesamt
- Nicht mehr als 300000 Container insgesamt

Ein Cluster kann skaliert werden, indem weitere Nodes hinzugefügt werden. Wie man Nodes hinzufügen kann, hängt von der Art und Weise ab, wie das Cluster initial aufgesetzt wurde.


## Ressourcenlimits von Cloud-Providern {#quota-issues}

Um Probleme mit Quota von Cloud-Providern zu vermeiden, sollten Sie bei der Erstellung eines Clusters mit vielen Nodes Folgendes in Betracht ziehen:

- Beantragen Sie eine Erhöhung der Quota für Cloud-Ressourcen wie:
  - Compute-Instanzen
  - CPUs
  - Speichervolumes
  - Verwendete IP-Adressen
  - Regelwerke zur Paketfilterung
  - Anzahl der Load Balancer
  - Netzwerk-Subnetze
  - Log-Streams
- Skalierungsaktionen in Batches durchzuführen, mit einer Pause zwischen den Batches, da einige Cloud-Provider die Erstellung neuer Instanzen mit Rate Limits versehen.

## Komponenten der Control Plane

Für ein großes Cluster benötigen Sie eine Control Plane mit ausreichenden Rechen- und weiteren Ressourcen.

Typischerweise betreiben Sie eine oder zwei Control-Plane-Instanzen pro Ausfallzone, wobei Sie diese Instanzen zunächst vertikal skalieren und anschließend horizontal erweitern, wenn vertikale Skalierung keine Verbesserungen mehr bringt.

Sie sollten mindestens eine Instanz pro Ausfallzone betreiben, um Fehlertoleranz zu gewährleisten. 
Kubernetes-Nodes leiten den Datenverkehr nicht automatisch zu Control-Plane-Endpunkten in derselben Ausfallzone um; allerdings könnte Ihr Cloud-Provider eigene Mechanismen hierfür anbieten.

Beispielsweise können Sie mit einem Managed Load Balancer den Datenverkehr, der von Kubelets und Pods in der Ausfallzone _A_ stammt, so konfigurieren, dass er nur an die Control-Plane-Hosts in Zone _A_ weitergeleitet wird. 
Fällt ein einzelner Control-Plane-Host oder ein Endpunkt in Zone _A_ aus, bedeutet das, dass der gesamte Control-Plane-Datenverkehr der Nodes in Zone _A_ nun zwischen den Zonen geleitet wird. 
Mehrere Control-Plane-Hosts in jeder Zone reduzieren die Wahrscheinlichkeit dieses Szenarios.

### etcd-Speicher

Um die Leistung großer Cluster zu verbessern, können Sie Event-Objekte in einer separaten, dedizierten etcd-Instanz speichern.

Bei der Erstellung eines Clusters können Sie (mit benutzerdefinierten Tools):

- eine zusätzliche etcd-Instanz starten und konfigurieren
- den {{< glossary_tooltip term_id="kube-apiserver" text="API-Server" >}} so konfigurieren, dass er diese Instanz zur Speicherung von Ereignissen nutzt

Siehe [Betrieb von etcd-Clustern für Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) und 
[Einrichten eines hochverfügbaren etcd-Clusters mit kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) für Details zur Konfiguration und Verwaltung von etcd für große Cluster.

## Addon-Ressourcen

Kubernetes-[Ressourcenlimits](/docs/concepts/configuration/manage-resources-containers/) helfen dabei, die Auswirkungen von Speicherlecks und anderer Probleme zu minimieren, 
bei denen Pods und Container andere Komponenten beeinträchtigen können. 

Diese Ressourcenlimits gelten auch für {{< glossary_tooltip text="Addons" term_id="addons" >}} ebenso wie für Anwendungs-Workloads.

Beispielsweise können Sie CPU- und Speicherlimits für eine Logging-Komponente festlegen:

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

Die Standardlimits von Addons basieren in der Regel auf Daten, die aus dem Betrieb auf kleinen oder mittleren Kubernetes-Clustern gesammelt wurden. 
Bei großen Clustern verbrauchen Addons oft mehr Ressourcen als ihre Standardlimits. 
Wenn ein großer Cluster ohne Anpassung dieser Werte bereitgestellt wird, können Addons kontinuierlich beendet werden, da sie ihr Speicherlimit überschreiten. 
Alternativ laufen die Addons zwar, liefern aber eine schlechte Performance aufgrund von CPU-Zeit-Slice-Beschränkungen.

Um Probleme mit Addon-Ressourcen in großen Clustern zu vermeiden, sollten Sie Folgendes beachten:

- Einige Addons skalieren vertikal – es gibt eine Replik des Addons für das Cluster oder für eine gesamte Ausfallzone. Für diese Addons sollten Sie Anfragen und Limits erhöhen, wenn Sie Ihr Cluster erweitern.
- Viele Addons skalieren horizontal – Sie erhöhen die Kapazität, indem Sie mehr Pods ausführen – aber bei einem sehr großen Cluster müssen Sie möglicherweise auch die CPU- oder Speicherlimits leicht anheben. Der [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) kann im *Recommender*-Modus ausgeführt werden, um empfohlene Werte für Anfragen und Limits bereitzustellen.
- Einige Addons laufen als eine Instanz pro Node, gesteuert durch ein {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, z. B. ein Node-level Log-Aggregator. Ähnlich wie bei horizontal skalierten Addons müssen Sie eventuell CPU- oder Speicherlimits leicht erhöhen.

## {{% heading "whatsnext" %}}

- `VerticalPodAutoscaler` ist eine benutzerdefinierte Ressource, die Sie in Ihr Cluster deployen können, um Ressourcenanforderungen und Limits für Pods zu verwalten. 
Erfahren Sie mehr über den [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) und wie Sie ihn nutzen können, 
um Cluster-Komponenten einschließlich clusterkritischer Addons zu skalieren.

- Lesen Sie mehr über [Node-Autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)

- [Addon Resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme) unterstützt Sie dabei, die Addons automatisch an die Clustergröße anzupassen.

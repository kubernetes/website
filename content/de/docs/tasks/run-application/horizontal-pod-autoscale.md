---
title: Horizontal Pod Autoscaler
feature:
  title: Horizontales Skalieren
  description: >
    Skaliere deine Anwendung mit einem einfachen Befehl, über die Benutzeroberfläche oder automatisch, basierend auf der CPU-Auslastung.

content_template: templates/concept
weight: 90
---

{{% capture overview %}}

Der Horizontal Pod Autoscaler skaliert automatisch die Anzahl der Pods eines Replication Controller, Deployment oder Replikat Set basierend auf der beobachteten CPU-Auslastung (oder, mit Unterstützung von [benutzerdefinierter Metriken](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md), von der Anwendung bereitgestellten Metriken). Beachte, dass die horizontale Pod Autoskalierung nicht für Objekte gilt, die nicht skaliert werden können, z. B. DaemonSets.

Der Horizontal Pod Autoscaler ist als Kubernetes API-Ressource und einem Controller implementiert.
Die Ressource bestimmt das Verhalten des Controllers.
Der Controller passt die Anzahl der Replikate eines Replication Controller oder Deployments regelmäßig an, um die beobachtete durchschnittliche CPU-Auslastung an das vom Benutzer angegebene Ziel anzupassen.

{{% /capture %}}

{{% capture body %}}

## Wie funktioniert der Horizontal Pod Autoscaler?

![Horizontal Pod Autoscaler Diagramm](/images/docs/horizontal-pod-autoscaler.svg)

Der Horizontal Pod Autoscaler ist als Kontrollschleife mit einer Laufzeit implementiert, die durch das Flag `--horizontal-pod-autoscaler-sync-period` am Controller Manager gesteuert wird (mit einem Standardwert von 15 Sekunden).

Während jedem Durchlauf fragt der Controller Manager die Ressourcennutzung anhand der in jeder HorizontalPodAutoscaler Definition angegebenen Metriken ab. Der Controller Manager bezieht die Metriken entweder aus der Resource Metrics API (für Ressourcenmetriken pro Pod) oder aus der Custom Metrics API (für alle anderen Metriken).

* Für jede pro Pod Ressourcenmetriken (wie CPU) ruft der Controller die Metriken über die Ressourcenmetriken API für jeden Pod ab, der vom HorizontalPodAutoscaler angesprochen wird. Sofern ein Zielnutzungswert eingestellt ist, berechnet der Controller den Nutzungswert als Prozentsatz der äquivalenten Ressourcenanforderung der Containern in jedem Pod. Wenn ein Ziel-Rohwert eingestellt ist, werden die Rohmetrikenwerte direkt verwendet. Der Controller nimmt dann den Mittelwert der Auslastung oder den Rohwert (je nach Art des angegebenen Ziels) über alle Zielpods und erzeugt ein Quotienten, mit dem die Anzahl der gewünschten Replikate skaliert wird.

Beachte, dass, wenn einige der Container des Pods nicht über den entsprechenden Ressourcenanforderung verfügen, die CPU-Auslastung für den Pod nicht definiert wird und der Autoscaler keine Maßnahmen bezüglich dieser Metrik ergreift. Weitere Informationen zur Funktionsweise des Autoskalierungsalgorithmus finden Sie im folgenden Abschnitt über den [Algorithmus](#details-zum-algorithmus).

* Bei benutzerdefinierten Metriken pro Pod funktioniert die Steuerung ähnlich wie bei Ressourcenmetriken pro Pod, nur dass diese mit Rohwerten und nicht mit Nutzungswerten arbeitet.

* Für Objektmetriken und externe Metriken wird eine einzelne Metrik abgerufen, die das jeweilige Objekt beschreibt. Diese Kennzahl wird mit dem Sollwert verglichen, um ein Verhältnis wie oben beschrieben zu erhalten. In der API-Version von `autoscaling/v2beta2` kann dieser Wert optional durch die Anzahl der Pods geteilt werden, bevor der Vergleich durchgeführt wird.

Der HorizontalPodAutoscaler holt Metriken normalerweise aus einer Reihe von aggregierten APIs (`metrics.k8s.io`, `custom.metrics.k8s.io` und `external.metrics.k8s.io`).  Die API `metrics.k8s.io` wird normalerweise vom Metrics Server bereitgestellt, der separat gestartet werden muss. Siehe [Metrics Server](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server) für weitere Anweisungen. Der HorizontalPodAutoscaler kann auch Metriken direkt aus dem Heapster beziehen.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.11" >}}
Das Verwenden von Metriken aus Heapster ist seit der Kubernetes Version 1.11 veraltet.
{{< /note >}}

Siehe [Unterstützung der Metrik APIs](#unterstützung-der-metrik-apis) für weitere Details.

Der Autoscaler greift über die Scale Sub-Ressource auf die entsprechenden skalierbaren Controller (z.B. Replication Controller, Deployments und Replika Sets) zu. Scale ist eine Schnittstelle, mit der Sie die Anzahl der Replikate dynamisch einstellen und jeden ihrer aktuellen Zustände untersuchen können. Weitere Details zu der Scale Sub-Ressource findest du [hier](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

### Details zum Algorithmus

Vereinfacht gesagt arbeitet der Horizontal Pod Autoscaler Controller mit dem Verhältnis zwischen dem gewünschten metrischen Wert und dem aktuellen metrischen Wert:

```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```

Wenn beispielsweise der aktuelle metrische Wert `200m` und der gewünschte Wert `100m` ist, wird die Anzahl der Replikate verdoppelt, da `200.0 / 100.0 == 2.0` ist. Wenn der aktuelle Wert jedoch `50m` ist, halbieren sich die Anzahl der Replikate `50.0 / 100.0 == 0.5`.  Es wird auf die Skalierung verzichtet, wenn das Verhältnis ausreichend nahe bei 1,0 liegt (innerhalb einer global konfigurierbaren Toleranz, vom Flag `--horizontal-pod-autoscaler-tolerance`, das standardmäßig auf 0,1 gesetzt ist).

Wenn ein `targetAverageValue` oder `targetAverageUtilization` angegeben wird, wird der `currentMetricValue` berechnet, indem der Mittelwert der gegebenen Metrik über alle Pods im Skalierungsziel des HorizontalPodAutoscaler berechnet wird. Vor der Überprüfung der Toleranz und der Entscheidung über die finalen Werte berücksichtigen wir jedoch die Pod Readiness und fehlende Metriken.

Alle Pods mit einem gesetzten Zeitstempel zur Löschung (d.h. Pods, die gerade heruntergefahren werden) und alle ausgefallenen Pods werden verworfen.

Wenn einem bestimmten Pod Metriken fehlen, wird es für später zurückgestellt; Pods mit fehlenden Metriken werden verwendet, um den endgültigen Skalierungsmenge anzupassen.

Wenn bei der Skalierung anhand der CPU ein Pod noch nicht bereit ist (d.h. er wird noch initialisiert) *oder* der letzte metrische Punkt für den Pod vor dessen Einsatzbereitschaft liegt, wird auch dieser Pod zurückgestellt.

Aufgrund technischer Einschränkungen kann der HorizontalPodAutoscaler Controller nicht genau bestimmen, wann ein Pod zum ersten Mal bereit ist, wenn es darum geht, bestimmte CPU Metriken festzulegen. Stattdessen betrachtet er eine Pod als "not yet ready", wenn dieser noch nicht bereit ist und geht in "unready" über, innerhalb eines kurzen, konfigurierbaren Zeitfensters seit dem Start.
Dieser Wert wird mit dem Flag `--horizontal-pod-autoscaler-initial-readiness-delay` konfiguriert und ist standardmäßig auf 30 Sekunden eingestellt. Sobald ein Pod bereit ist, betrachtet er jeden Übergang zu Bereit als den ersten, wenn dies innerhalb einer längeren, konfigurierbaren Zeit seit seinem Start erfolgt ist. Dieser Wert wird mit dem Flag `--horizontal-pod-autoscaler-cpu-initialization-period` gesetzt und dessen Standardwert beträgt 5 Minuten.

Das Basisskalenverhältnis `currentMetricValue / desiredMetricValue` wird dann mit den restlichen Pods berechnet, die nicht zurückgestellt oder von den oben genannten Kriterien entsorgt wurden.

Wenn es irgendwelche fehlenden Metriken gab, berechnen wir den Durchschnitt konservativer, vorausgesetzt, dass die Pods 100% des gewünschten Wertes bei der Verringerung und 0% bei einer Vergrößerung verbrauchten. Dadurch wird die Dimension einer beliebigen potenziellen Skalierung verringert.

Wenn außerdem noch nicht bereite Pods vorhanden sind und es ohne Berücksichtigung fehlender Metriken oder noch nicht bereiter Pods skaliert wurde, wird konservativ davon ausgegangen, dass die noch nicht bereiten Pods 0% der gewünschten Metrik verbrauchen, was die Dimension einer Skalierung weiter dämpft.

Nach Berücksichtigung der noch nicht bereiten Pods und fehlender Metriken wird der Nutzungsgrad neu berechnet. Wenn das neue Verhältnis die Skalierungsrichtung umkehrt oder innerhalb der Toleranz liegt, wird das weitere Skalieren übersprungen. Andernfalls wird das neue Verhältnis zur Skalierung verwendet.

Beachte, dass der *ursprüngliche* Wert für die durchschnittliche Auslastung über den HorizontalPodAutoscaler Status zurückgemeldet wird, ohne die noch nicht bereiten Pods oder fehlende Metriken zu berücksichtigen, selbst wenn das neue Nutzungsverhältnis verwendet wird.

Wenn mehrere Metriken in einem HorizontalPodAutoscaler angegeben sind, wird die Berechnung für jede Metrik durchgeführt, und dann wird die größte der gewünschten Replikanzahl ausgewählt. Wenn eine dieser Metriken nicht in eine gewünschte Replikanzahl umgewandelt werden kann (z.B. aufgrund eines Fehlers beim Abrufen der Metriken aus den Metrik APIs), wird diese Skalierung übersprungen.

Schließlich, kurz bevor HPA das Ziel skaliert, wird die Skalierungsempfehlung aufgezeichnet. Der Controller berücksichtigt alle Empfehlungen innerhalb eines konfigurierbaren Fensters und wählt aus diesem Fenster die höchste Empfehlung aus. Dieser Wert kann mit dem Flag `--horizontal-pod-autoscaler-downscale-stabilization` konfiguriert werden, das standardmäßig auf 5 Minuten eingestellt ist. Dies bedeutet, dass die Skalierung schrittweise erfolgt, wodurch die Auswirkungen schnell schwankender metrischer Werte ausgeglichen werden.

## API Objekt

Der Horizontal Pod Autoscaler ist eine API Ressource in der Kubernetes `autoscaling` API Gruppe.
Die aktuelle stabile Version, die nur die Unterstützung für die automatische Skalierung der CPU beinhaltet, befindet sich in der `autoscaling/v1` API Version.

Die Beta-Version, weclhe die Skalierung des Speichers und benutzerdefinierte Metriken unterstützt, befindet sich unter `autoscaling/v2beta2`. Die in `autoscaling/v2beta2` neu eingeführten Felder bleiben bei der Arbeit mit `autoscaling/v1` als Anmerkungen erhalten.

Weitere Details über das API Objekt kann unter dem [HorizontalPodAutoscaler Objekt](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object) gefunden werden.

## Unterstützung des Horizontal Pod Autoscaler in kubectl

Der Horizontal Pod Autoscaler wird, wie jede API-Ressource, standardmäßig von `kubectl` unterstützt.
Ein neuer Autoskalierer kann mit dem Befehl `kubectl create` erstellt werden.
Das auflisten der Autoskalierer geschieht über `kubectl get hpa` und eine detaillierte Beschreibung erhält man mit `kubectl describe hpa`.
Letzendlich können wir einen Autoskalierer mit `kubectl delete hpa` löschen.

Zusätzlich gibt es einen speziellen Befehl `kubectl autoscale` zur einfachen Erstellung eines Horizontal Pod Autoscalers.
Wenn du beispielsweise `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80` ausführst, wird ein Autoskalierer für den Replication Set *foo* erstellt, wobei die Ziel-CPU-Auslastung auf `80%` und die Anzahl der Replikate zwischen 2 und 5 gesetzt wird.
Die Detaildokumentation von `kubectl autoscale` kann [hier](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) gefunden werden.

## Autoskalieren während rollierender Updates

Derzeit ist es in Kubernetes möglich, ein [rollierendes Update](/docs/tasks/run-application/rolling-update-replication-controller/) durchzuführen, indem du den Replikationscontroller direkt verwaltest oder das Deployment Objekt verwendest, das die zugrunde liegenden Replica Sets für dich verwaltet.
Der Horizontal Pod Autoscaler unterstützt nur den letztgenannten Ansatz: Der Horizontal Pod Autoscaler ist an das Deployment Objekt gebunden, er legt die Größe für das Deployment Objekt fest, und das Deployment ist für die Festlegung der Größen der zugrunde liegenden Replica Sets verantwortlich.

Der Horizontal Pod Autoscaler funktioniert nicht mit rollierendem Update durch direkte Manipulation vom Replikationscontrollern, d.h. du kannst einen Horizontal Pod Autoscaler nicht an einen Replikationscontroller binden und rollierend aktualisieren (z.B. mit `kubectl rolling-update`).
Der Grund dafür ist, dass beim Erstellen eines neuen Replikationscontrollers durch ein rollierendes Update der Horizontal Pod Autoscaler nicht an den neue Replikationscontroller gebunden wird.

## Unterstützung von Abklingzeiten/Verzögerungen

Bei der Verwaltung der Größe einer Gruppe von Replikaten mit dem Horizontal Pod Autoscaler ist es möglich, dass die Anzahl der Replikate aufgrund der Dynamik der ausgewerteten Metriken häufig schwankt. Dies wird manchmal als *thrashing*, zu deutsch *Flattern*, bezeichnet.

Ab v1.6 kann ein Cluster Operator dieses Problem mitigieren, indem er die globalen HPA Einstellungen anpasst, die als Flags für die Komponente `kube-controller-manager` dargelegt werden:

Ab v1.12 erübrigt ein neues Update des Algorithmus die Notwendigkeit der Verzögerung beim hochskalieren.

- `--horizontal-pod-autoscaler-downscale-stabilization`: Der Wert für diese Option ist eine Dauer, die angibt, wie lange der Autoscaler warten muss, bis nach Abschluss des aktuellen Skalierungsvorgangs ein weiterer Downscale durchgeführt werden kann.
Der Standardwert ist 5 Minuten (`5m0s`).

{{< note >}}
Beim Abstimmen dieser Parameterwerte sollte sich ein Clusterbetreiber der möglichen Konsequenzen bewusst sein. Wenn der Wert für die Verzögerung (Abklingzeit) zu groß eingestellt ist, kann es zu Beschwerden kommen, dass der Horizontal Pod Autoscaler nicht auf Änderungen der Arbeitslast reagiert. Wenn der Verzögerungswert jedoch zu kurz eingestellt ist, kann es vorkommen, dass die Skalierung der eingestellten Replikate wie gewohnt weiter flattert.
{{< /note >}}

## Unterstützung von mehrere Metriken

Kubernetes 1.6 bietet Unterstützung für die Skalierung basierend auf mehreren Metriken. Du kannst die API Version `autoscaling/v2beta2` verwenden, um mehrere Metriken für den Horizontal Pod Autoscaler zum Skalieren festzulegen. Anschließend wertet der Horizontal Pod Autoscaler Controller jede Metrik aus und schlägt eine neue Skalierung basierend auf diesen Metrik vor. Die größte der vorgeschlagenen Skalierung wird als neue Skalierung verwendet.

## Unterstützung von benutzerdefinierte Metriken
{{< note >}}
Kubernetes 1.2 bietet Alpha Unterstützung für die Skalierung basierend auf anwendungsspezifischen Metriken über speziellen Annotations. Die Unterstützung für diese Annotations wurde in Kubernetes 1.6 zugunsten der neuen autoskalierenden API entfernt. Während die alte Methode zum Sammeln von benutzerdefinierten Metriken weiterhin verfügbar ist, stehen diese Metriken dem Horizontal Pod Autoscaler nicht mehr zur Verfügung, ebenso wenig wie die früheren Annotations zur Angabe, welche benutzerdefinierten Metriken zur Skalierung vom Horizontal Pod Autoscaler Controller berücksichtigt werden sollen.
{{< /note >}}

Kubernetes 1.6 bietet Unterstützung für die Verwendung benutzerdefinierter Metriken im Horizontal Pod Autoscaler.
Du kannst benutzerdefinierte Metriken für den Horizontal Pod Autoscaler hinzufügen, die in der `autoscaling/v2beta2` API verwendet werden.
Kubernetes fragt dann die neue API für die benutzerdefinierte Metriken ab, um die Werte der entsprechenden benutzerdefinierten Metriken zu erhalten.

Die Voraussetzungen hierfür werden im nachfolgenden Kapitel [Unterstützung für die Metrik APIs](#unterstützung-der-metrik-apis) geklärt.

## Unterstützung der Metrik APIs

Standardmäßig ruft der HorizontalPodAutoscaler Controller Metriken aus einer Reihe von APIs ab. Damit dieser auf die APIs zugreifen kann, muss der Cluster Administratoren sicherstellen, dass:

* Der [API Aggregations Layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) aktiviert ist.

* Die entsprechenden APIs registriert sind:
  
  *  Für Ressourcenmetriken ist dies die API `metrics.k8s.io`, die im Allgemeinen von [metrics-server](https://github.com/kubernetes-incubator/metrics-server) bereitgestellt wird.
  Es kann als Cluster-Addon gestartet werden.

  * Für benutzerdefinierte Metriken ist dies die API `custom.metrics.k8s.io`. Diese wird vom "Adapter" API Servern bereitgestellt, welches von Anbietern von Metrik Lösungen beliefert wird.
    Überprüfe dies mit deiner Metrik Pipeline oder der [Liste bekannter Lösungen](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api).
     Falls du deinen eigenen schreiben möchtest hilft dir folgender [boilerplate](https://github.com/kubernetes-incubator/custom-metrics-apiserver) um zu starten.
  
  * Für externe Metriken ist dies die `external.metrics.k8s.io` API. Es kann sein, dass dies durch den benutzerdefinierten Metrik Adapter bereitgestellt wird.

* Das Flag `--horizontal-pod-autoscaler-use-rest-clients` ist auf `true` oder ungesetzt. Wird dies auf `false` gesetzt wird die Heapster basierte Autoskalierung aktiviert, welche veraltet ist.

{{% /capture %}}

{{% capture whatsnext %}}

* Design Dokument [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl autoscale Befehl: [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Verwenden des [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

{{% /capture %}}

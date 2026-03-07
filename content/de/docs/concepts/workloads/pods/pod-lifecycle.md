---
title: Pod-Lebenszyklus
content_type: concept
weight: 30
math: true
lang: de
---

<!-- overview -->

Diese Seite beschreibt den Lebenszyklus eines Pods.
Pods folgen einem definierten Lebenszyklus, beginnend in der `Pending` [Phase](#pod-phase), 
übergehend in `Running`, wenn mindestens einer seiner primären Container erfolgreich startet, 
und dann, je nachdem, ob ein Container im Pod fehlerhaft beendet wurde, 
entweder in die `Succeeded`- oder die `Failed`-Phase.

Wie einzelne Anwendung-Container gelten Pods als relativ flüchtige (statt langlebige) Entitäten.
Pods werden erstellt, erhalten eine eindeutige ID ([UID](/docs/concepts/overview/working-with-objects/names/#uids)) zugewiesen
und werden zur Ausführung auf Knoten geplant, wo sie bis zur Beendigung (gemäß der Neustart-Richtlinie) oder Löschung verbleiben.
Wenn ein {{< glossary_tooltip term_id="node" >}} ausfällt, 
werden die Pods, die auf diesem Knoten ausgeführt werden (oder für die Ausführung auf diesem Knoten geplant sind), 
[zur Löschung markiert](#pod-garbage-collection). 
Die Steuerebene markiert die Pods nach einer Timeout-Periode zur Entfernung.

<!-- body -->

## Pod-Lebensdauer

Während ein Pod läuft, ist das Kubelet in der Lage, Container neu zu starten, um
bestimmte Arten von Fehlern zu behandeln. Innerhalb eines Pods verfolgt Kubernetes verschiedene Container-[Zustände](#container-states)
und bestimmt, welche Maßnahme zu ergreifen ist, um den Pod wieder in einen gesunden Zustand
zu versetzen.

In der Kubernetes-API haben Pods sowohl eine Spezifikation als auch einen tatsächlichen Status. Der
Status für ein Pod-Objekt besteht aus einer Reihe von [Pod-Bedingungen](#pod-conditions).
Sie können auch [benutzerdefinierte Readiness-Informationen](#pod-readiness-gate) in die
Bedingungsdaten für einen Pod injizieren, wenn dies für Ihre Anwendung nützlich ist.

Pods werden in ihrer Lebensdauer nur einmal [geplant](/docs/concepts/scheduling-eviction/);
die Zuweisung eines Pods zu einem bestimmten Knoten wird als _Binding_ bezeichnet, und der Prozess der Auswahl
des zu verwendenden Knotens wird als _Scheduling_ bezeichnet. 
Sobald ein Pod geplant und an einen Knoten gebunden wurde, versucht Kubernetes, diesen Pod auf dem Knoten auszuführen.
Der Pod läuft auf diesem Knoten, bis er stoppt oder bis der Pod
[terminiert wird](#pod-termination); wenn Kubernetes den Pod auf dem ausgewählten
Knoten nicht starten kann (zum Beispiel, wenn der Knoten abstürzt, bevor der Pod startet),
dann startet dieser spezielle Pod niemals.

Sie können die [Pod Scheduling Readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
verwenden, um die Planung für einen Pod zu verzögern, bis alle seine _Scheduling Gates_ entfernt wurden. Zum Beispiel,
möchten Sie möglicherweise eine Reihe von Pods definieren, die Planung jedoch erst auslösen,
wenn alle Pods erstellt wurden.

### Pods und Fehlerbehebung {#pod-fault-recovery}

Wenn einer der Container im Pod fehlschlägt, kann Kubernetes versuchen, diesen
spezifischen Container neu zu starten.
Lesen Sie [Wie Pods mit Containerproblemen umgehen](#container-restarts), um mehr zu erfahren.

Pods können jedoch auf eine Weise fehlschlagen, von der sich der Cluster nicht erholen kann.
In diesem Fall versucht Kubernetes nicht, den Pod weiter zu heilen; stattdessen löscht Kubernetes den
Pod und verlässt sich auf andere Komponenten, um eine automatische Heilung bereitzustellen.

Wenn ein Pod auf einem {{< glossary_tooltip text="Knoten" term_id="node" >}} geplant ist
und dieser Knoten dann ausfällt, wird der Pod als ungesund behandelt und Kubernetes löscht den Pod
schließlich. Ein Pod überlebt keine {{< glossary_tooltip text="Eviction" term_id="eviction" >}} aufgrund
von Ressourcenmangel oder Knotenwartung.

Kubernetes verwendet eine Abstraktion höherer Ebene, einen sogenannten
{{< glossary_tooltip term_id="controller" text="Controller" >}}, der die Arbeit der
Verwaltung der relativ entbehrlichen Pod-Instanzen übernimmt.

Ein bestimmter Pod (definiert durch eine UID) wird niemals auf einen anderen Knoten "neu geplant"
(rescheduled); stattdessen kann dieser Pod durch einen neuen, nahezu identischen Pod ersetzt werden. Wenn Sie einen Ersatz-Pod erstellen,
kann dieser sogar denselben Namen (wie in `.metadata.name`) haben wie der alte Pod, aber der Ersatz-Pod
würde eine andere `.metadata.uid` als der alte Pod haben.

Kubernetes garantiert nicht, dass ein Ersatz für einen bestehenden Pod auf demselben Knoten wie der alte Pod
geplant wird, der ersetzt wurde.

### Zugehörige Lebensdauern

Wenn etwas die gleiche Lebensdauer wie ein Pod haben soll, wie beispielsweise ein
{{< glossary_tooltip term_id="volume" text="Volume" >}},
bedeutet das, dass dieses Ding so lange existiert, wie dieser spezifische Pod (mit genau dieser UID)
existiert. Wenn dieser Pod aus irgendeinem Grund gelöscht wird, und selbst wenn ein identischer Ersatz
erstellt wird, wird das zugehörige Ding (ein Volume, in diesem Beispiel) ebenfalls zerstört und
neu erstellt.

{{< figure src="/images/docs/pod.svg" title="Abbildung 1." class="diagram-medium" caption="Ein Pod mit mehreren Containern, der einen Datei-Puller [Sidecar](/docs/concepts/workloads/pods/sidecar-containers/) und einen Webserver enthält. Der Pod verwendet ein [temporäres `emptyDir`-Volume](/docs/concepts/storage/volumes/#emptydir) für den gemeinsam genutzten Speicher zwischen den Containern." >}}

## Pod-Phase

Das `status`-Feld eines Pods ist ein
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)-Objekt,
das ein `phase`-Feld besitzt.

Die Phase eines Pods ist eine einfache, hochrangige Zusammenfassung darüber, wo sich der Pod in seinem
Lebenszyklus befindet. Die Phase ist nicht dazu gedacht, eine umfassende Aufschlüsselung der Beobachtungen
zum Container- oder Pod-Zustand zu sein, noch ist sie als umfassender Zustandsautomat gedacht.

Die Anzahl und Bedeutung der Pod-Phasenwerte werden streng überwacht.
Abgesehen von dem, was hier dokumentiert ist, sollte nichts über Pods angenommen werden,
die einen bestimmten `phase`-Wert aufweisen.

Hier sind die möglichen Werte für `phase`:

| Wert | Beschreibung |
|:---|:---|
| `Pending` | Der Pod wurde vom Kubernetes-Cluster akzeptiert, aber einer oder mehrere der Container wurden noch nicht eingerichtet und zur Ausführung bereitgestellt. Dies beinhaltet die Zeit, die ein Pod wartet, um geplant zu werden, sowie die Zeit, die für das Herunterladen von Container-Images über das Netzwerk aufgewendet wird. |
| `Running` | Der Pod wurde an einen Knoten gebunden, und alle Container wurden erstellt. Mindestens ein Container läuft noch oder befindet sich im Prozess des Startens oder Neustartens. |
| `Succeeded` | Alle Container im Pod wurden erfolgreich beendet und werden nicht neu gestartet. |
| `Failed` | Alle Container im Pod wurden beendet, und mindestens ein Container wurde fehlerhaft beendet. Das heißt, der Container wurde entweder mit einem Status ungleich Null beendet oder wurde vom System terminiert, und ist nicht für den automatischen Neustart eingestellt. |
| `Unknown` | Aus irgendeinem Grund konnte der Zustand des Pods nicht ermittelt werden. Diese Phase tritt typischerweise aufgrund eines Kommunikationsfehlers mit dem Knoten auf, auf dem der Pod ausgeführt werden sollte. |

{{< note >}}

Wenn ein Pod wiederholt nicht gestartet werden kann, kann `CrashLoopBackOff` im `Status`-Feld einiger kubectl-Befehle erscheinen.
In ähnlicher Weise kann `Terminating` im `Status`-Feld einiger kubectl-Befehle erscheinen, wenn ein Pod gelöscht wird.

Achten Sie darauf, den _Status_, ein kubectl-Anzeigefeld für die intuitive Benutzerführung, nicht mit der `phase` des Pods zu verwechseln.
Die Pod-Phase ist ein expliziter Bestandteil des Kubernetes-Datenmodells und der
[Pod API](/docs/reference/kubernetes-api/workload-resources/pod-v1/).


```
  NAMESPACE               NAME               READY   STATUS             RESTARTS   AGE
  alessandras-namespace   alessandras-pod    0/1     CrashLoopBackOff   200        2d9h
```

---

Einem Pod wird eine Frist für die ordnungsgemäße Beendigung gewährt, die standardmäßig 30 Sekunden beträgt.
Sie können das Flag `--force` verwenden, um [einen Pod zwangsweise zu terminieren](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced).
{{< /note >}}

Seit Kubernetes 1.27 lässt das Kubelet gelöschte Pods, mit Ausnahme von
[statischen Pods](/docs/tasks/configure-pod-container/static-pod/) und
[zwangsweise gelöschten Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)
ohne Finalizer, in eine terminale Phase (`Failed` oder `Succeeded`, abhängig von
den Exit-Status der Pod-Container) übergehen, bevor sie vom API-Server gelöscht werden.

Wenn ein Knoten ausfällt oder vom Rest des Clusters getrennt wird, wendet Kubernetes
eine Richtlinie an, um die `phase` aller Pods auf dem verlorenen Knoten auf `Failed` zu setzen.

## Container-Zustände

Neben der [Phase](#pod-phase) des gesamten Pods verfolgt Kubernetes den Zustand jedes
Containers innerhalb eines Pods. Sie können [Container-Lifecycle-Hooks](/docs/concepts/containers/container-lifecycle-hooks/) verwenden, um
Ereignisse auszulösen, die zu bestimmten Zeitpunkten im Lebenszyklus eines Containers ausgeführt werden.

Sobald der {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
einen Pod einem Knoten zuweist, beginnt das Kubelet mit der Erstellung von Containern für diesen Pod
mithilfe einer {{< glossary_tooltip text="Container-Laufzeitumgebung" term_id="container-runtime" >}}.
Es gibt drei mögliche Container-Zustände: `Waiting`, `Running` und `Terminated`.

Um den Zustand der Container eines Pods zu überprüfen, können Sie
`kubectl describe pod <name-of-pod>` verwenden. Die Ausgabe zeigt den Zustand für jeden Container
innerhalb dieses Pods.

Jeder Zustand hat eine spezifische Bedeutung:

### `Waiting` {#container-state-waiting}

Wenn sich ein Container weder im Zustand `Running` noch im Zustand `Terminated` befindet, ist er `Waiting`.
Ein Container im Zustand `Waiting` führt noch die Operationen aus, die er benötigt, um den Start abzuschließen:
zum Beispiel das Abrufen des Container-Images aus einer Container-Image-Registry oder das Anwenden von
{{< glossary_tooltip text="Secret" term_id="secret" >}}-Daten.
Wenn Sie `kubectl` verwenden, um einen Pod mit einem Container im Zustand `Waiting` abzufragen, sehen Sie auch
ein Feld "Reason" (Grund), das zusammenfasst, warum sich der Container in diesem Zustand befindet.

### `Running` {#container-state-running}

Der Zustand `Running` zeigt an, dass ein Container fehlerfrei ausgeführt wird. Wenn ein `postStart`-Hook
konfiguriert war, wurde dieser bereits ausgeführt und abgeschlossen. Wenn Sie `kubectl` verwenden, um einen Pod
mit einem Container im Zustand `Running` abzufragen, sehen Sie auch Informationen darüber, wann der Container
in den Zustand `Running` übergegangen ist.

### `Terminated` {#container-state-terminated}

Ein Container im Zustand `Terminated` hat mit der Ausführung begonnen und ist entweder vollständig
durchgelaufen oder aus irgendeinem Grund fehlgeschlagen. Wenn Sie `kubectl` verwenden, um einen Pod mit
einem Container im Zustand `Terminated` abzufragen, sehen Sie einen Grund (Reason), einen Exit-Code sowie
die Start- und Endzeit für die Ausführungsdauer dieses Containers.

Wenn für einen Container ein `preStop`-Hook konfiguriert ist, wird dieser Hook ausgeführt, bevor der Container
in den Zustand `Terminated` übergeht.

## Wie Pods mit Containerproblemen umgehen {#container-restarts}

Kubernetes verwaltet Container-Fehler innerhalb von Pods mithilfe einer in der Pod-`spec` definierten [`restartPolicy`](#restart-policy). Diese Richtlinie bestimmt, wie Kubernetes auf Container reagiert, die aufgrund von Fehlern oder anderen Gründen beendet werden, was in der folgenden Reihenfolge abläuft:

1. **Anfänglicher Absturz**: Kubernetes versucht einen sofortigen Neustart basierend auf der Pod-`restartPolicy`.
2. **Wiederholte Abstürze**: Nach dem anfänglichen Absturz wendet Kubernetes eine exponentielle
   Backoff-Verzögerung für nachfolgende Neustarts an, wie in [`restartPolicy`](#restart-policy) beschrieben.
   Dies verhindert schnelle, wiederholte Neustartversuche, die das System überlasten würden.
3. **`CrashLoopBackOff`-Zustand**: Dieser Zustand zeigt an, dass der Backoff-Verzögerungsmechanismus
   derzeit für einen bestimmten Container in Kraft ist, der sich in einer Crash-Schleife befindet und wiederholt fehlschlägt und neu startet.
4. **Zurücksetzung des Backoff**: Wenn ein Container über eine bestimmte Dauer
   (z.B. 10 Minuten) erfolgreich läuft, setzt Kubernetes die Backoff-Verzögerung zurück und behandelt jeden neuen Absturz
   als den ersten.

In der Praxis ist ein `CrashLoopBackOff` eine Bedingung oder ein Ereignis, das als Ausgabe
des `kubectl`-Befehls sichtbar wird, wenn Pods beschrieben oder aufgelistet werden,
falls ein Container im Pod nicht ordnungsgemäß gestartet werden kann und dann kontinuierlich
in einer Schleife versucht und scheitert.

Mit anderen Worten, wenn ein Container in die Crash-Schleife eintritt, wendet Kubernetes die
exponentielle Backoff-Verzögerung an, die in der [Container-Neustart-Richtlinie](#restart-policy) erwähnt wird.
Dieser Mechanismus verhindert, dass ein fehlerhafter Container das System mit kontinuierlichen,
fehlgeschlagenen Startversuchen überlastet. 

Der `CrashLoopBackOff` kann durch Probleme wie die folgenden verursacht werden:

* Anwendungsfehler, die dazu führen, dass der Container beendet wird.
* Konfigurationsfehler, wie falsche Umgebungsvariablen oder fehlende
  Konfigurationsdateien.
* Ressourceneinschränkungen, bei denen der Container möglicherweise nicht über genügend
  Arbeitsspeicher oder CPU verfügt, um ordnungsgemäß zu starten.
* Fehlschlagen von Health Checks, wenn die Anwendung nicht innerhalb der
  erwarteten Zeit mit dem Dienst beginnt.
* Fehlerhafte Liveness-Probes oder Startup-Probes des Containers, die ein `Failure`-Ergebnis
  zurückgeben, wie im [Probes-Abschnitt](#container-probes) erwähnt.

Um die Grundursache eines `CrashLoopBackOff`-Problems zu untersuchen, kann ein Benutzer:

1. **Protokolle prüfen**: Verwenden Sie `kubectl logs <name-of-pod>`, um die Protokolle des Containers zu überprüfen.
   Dies ist oft der direkteste Weg, um das Problem zu diagnostizieren, das die Abstürze verursacht.
2. **Ereignisse inspizieren**: Verwenden Sie `kubectl describe pod <name-of-pod>`, um Ereignisse
   für den Pod anzuzeigen, die Hinweise auf Konfigurations- oder Ressourcenprobleme geben können.
3. **Konfiguration überprüfen**: Stellen Sie sicher, dass die Pod-Konfiguration, einschließlich
   der Umgebungsvariablen und gemounteter Volumes, korrekt ist und dass alle erforderlichen
   externen Ressourcen verfügbar sind.
4. **Ressourcenlimits prüfen**: Stellen Sie sicher, dass dem Container ausreichend CPU
   und Arbeitsspeicher zugewiesen sind. Manchmal kann eine Erhöhung der Ressourcen in der Pod-Definition
   das Problem lösen.
5. **Anwendung debuggen**: Es können Bugs oder Fehlkonfigurationen im Anwendungscode vorliegen.
   Das Ausführen dieses Container-Images lokal oder in einer Entwicklungsumgebung kann bei der
   Diagnose anwendungsspezifischer Probleme helfen.

### Container-Neustarts {#restart-policy}

Wenn ein Container in Ihrem Pod stoppt oder einen Fehler feststellt, kann Kubernetes ihn neu starten.
Ein Neustart ist nicht immer angebracht; zum Beispiel laufen
{{< glossary_tooltip text="Init-Container" term_id="init-container" >}} nur einmal,
während des Pod-Starts.
Sie können Neustarts als eine Richtlinie konfigurieren, die für alle Pods gilt, oder mithilfe einer container-spezifischen Konfiguration (zum Beispiel: wenn Sie einen
{{< glossary_tooltip text="Sidecar-Container" term_id="sidecar-container" >}} definieren).

#### Container-Neustarts und Ausfallsicherheit {#container-restart-resilience}

Das Kubernetes-Projekt empfiehlt die Befolgung von Cloud-Native-Prinzipien, einschließlich einer resilienten
Gestaltung, die unangekündigte oder willkürliche Neustarts berücksichtigt. Sie können dies entweder
durch das Fehlschlagen des Pods und das Vertrauen auf den automatischen
[Ersatz](/docs/concepts/workloads/controllers/) erreichen, oder Sie können auf Ausfallsicherheit auf Container-Ebene setzen.
Beide Ansätze tragen dazu bei, dass Ihre gesamte Arbeitslast trotz
teilweiser Fehler verfügbar bleibt.

#### Container-Neustart-Richtlinie auf Pod-Ebene

Die `spec` eines Pods hat ein `restartPolicy`-Feld mit den möglichen Werten `Always`, `OnFailure`
und `Never`. Der Standardwert ist `Always`.

Die `restartPolicy` eines Pods gilt für {{< glossary_tooltip text="App-Container" term_id="app-container" >}}
im Pod und für reguläre [Init-Container](/docs/concepts/workloads/pods/init-containers/).
[Sidecar-Container](/docs/concepts/workloads/pods/sidecar-containers/)
ignorieren das `restartPolicy`-Feld auf Pod-Ebene: In Kubernetes ist ein Sidecar als ein Eintrag
innerhalb von `initContainers` definiert, bei dem die `restartPolicy` auf Containerebene auf `Always` gesetzt ist.
Bei Init-Containern, die mit einem Fehler beendet werden, startet das Kubelet den Init-Container neu,
wenn die `restartPolicy` auf Pod-Ebene entweder `OnFailure` oder `Always` ist:

* `Always`: Startet den Container nach jeder Beendigung automatisch neu.
* `OnFailure`: Startet den Container nur neu, wenn er mit einem Fehler beendet wird (Exit-Status ungleich Null).
* `Never`: Startet den beendeten Container nicht automatisch neu.

Wenn das Kubelet Container-Neustarts gemäß der konfigurierten Neustart-Richtlinie handhabt,
bezieht sich dies nur auf Neustarts, die Ersatzcontainer innerhalb desselben Pods und auf demselben Knoten erstellen.
Nachdem Container in einem Pod beendet wurden, startet das Kubelet sie mit einer exponentiellen Backoff-Verzögerung neu
(10s, 20s, 40s, …), die auf 300 Sekunden (5 Minuten) begrenzt ist.
Sobald ein Container 10 Minuten lang fehlerfrei ausgeführt wurde, setzt das Kubelet den Neustart-Backoff-Timer für diesen Container zurück.
[Sidecar-Container und Pod-Lebenszyklus](/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)
erklärt das Verhalten von `init containers`, wenn das Feld `restartpolicy` darin angegeben wird.

#### Individuelle Container-Neustart-Richtlinie und Regeln {#container-restart-rules}

{{< feature-state
feature_gate_name="ContainerRestartRules" >}}

Wenn in Ihrem Cluster das Feature Gate `ContainerRestartRules` aktiviert ist, können Sie
`restartPolicy` und `restartPolicyRules` für *einzelne Container* festlegen, um die Pod-Neustart-Richtlinie zu überschreiben.
Die Container-Neustart-Richtlinie und die Regeln gelten für {{< glossary_tooltip text="App-Container" term_id="app-container" >}}
im Pod und für reguläre [Init-Container](/docs/concepts/workloads/pods/init-containers/).

Ein Kubernetes-nativer [Sidecar-Container](/docs/concepts/workloads/pods/sidecar-containers/)
hat seine `restartPolicy` auf Containerebene auf `Always` gesetzt und unterstützt keine `restartPolicyRules`.

Die Container-Neustarts folgen derselben exponentiellen Backoff-Verzögerung wie die oben beschriebene Pod-Neustart-Richtlinie.
Unterstützte Container-Neustart-Richtlinien:

* `Always`: Startet den Container nach jeder Beendigung automatisch neu.
* `OnFailure`: Startet den Container nur neu, wenn er mit einem Fehler beendet wird (Exit-Status ungleich Null).
* `Never`: Startet den beendeten Container nicht automatisch neu.

Zusätzlich können *einzelne Container* `restartPolicyRules` angeben. Wenn das Feld `restartPolicyRules`
angegeben ist, **muss** auch die Container-`restartPolicy` angegeben werden. Die `restartPolicyRules`
definieren eine Liste von Regeln, die beim Beenden des Containers angewendet werden. Jede Regel besteht aus einer Bedingung
und einer Aktion. Die unterstützte Bedingung ist `exitCodes`, die den Exit-Code des Containers
mit einer Liste gegebener Werte vergleicht. Die unterstützte Aktion ist `Restart`, was bedeutet, dass der Container
neu gestartet wird. Die Regeln werden der Reihe nach ausgewertet. Beim ersten Treffer wird die Aktion angewendet.
Wenn keine der Bedingungen der Regeln übereinstimmt, fällt Kubernetes auf die konfigurierte
`restartPolicy` des Containers zurück.

Zum Beispiel ein Pod mit der Neustart-Richtlinie `OnFailure`, der einen `try-once`-Container hat. Dies ermöglicht es,
dass der Pod nur bestimmte Container neu startet:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: on-failure-pod
spec:
  restartPolicy: OnFailure
  containers:
  - name: try-once-container    # Dieser Container wird nur einmal ausgeführt, da die restartPolicy Never ist.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Only running once" && sleep 10 && exit 1']
    restartPolicy: Never     
  - name: on-failure-container  # Dieser Container wird bei einem Fehler neu gestartet.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Keep restarting" && sleep 1800 && exit 1']
```
Ein Pod mit der Neustart-Richtlinie Always mit einem Init-Container, der nur einmal ausgeführt wird. Wenn der Init-Container fehlschlägt, schlägt der Pod fehl. Dies ermöglicht es dem Pod, bei fehlerhafter Initialisierung fehlzuschlagen, aber nach erfolgreicher Initialisierung weiterzulaufen:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fail-pod-if-init-fails
spec:
  restartPolicy: Always
  initContainers:
  - name: init-once      # Dieser Init-Container wird nur einmal versuchen. Wenn er fehlschlägt, schlägt der Pod fehl.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Failing initialization" && sleep 10 && exit 1']
    restartPolicy: Never
  containers:
  - name: main-container # Dieser Container wird immer neu gestartet, sobald die Initialisierung erfolgreich ist.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 1800 && exit 0']
```
Ein Pod mit der Neustart-Richtlinie Never und einem Container, der bestimmte Exit-Codes ignoriert und bei diesen neu startet. Dies ist nützlich, um zwischen neu startbaren und nicht neu startbaren Fehlern zu unterscheiden:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restart-on-exit-codes
spec:
  restartPolicy: Never
  containers:
  - name: restart-on-exit-codes
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 60 && exit 0']
    restartPolicy: Never     # Container-Neustart-Richtlinie muss angegeben werden, wenn Regeln angegeben werden
    restartPolicyRules:      # Startet den Container nur neu, wenn er mit Code 42 beendet wird
    - action: Restart
      exitCodes:
        operator: In
        values: [42]
```
Neustart-Regeln können für viele weitere fortgeschrittene Szenarien des Lebenszyklus-Managements verwendet werden. Beachten Sie, dass Neustart-Regeln von denselben Inkonsistenzen betroffen sind wie die reguläre Neustart-Richtlinie. Kubelet-Neustarts, Garbage Collection der Container-Laufzeitumgebung, unterbrochene Verbindungsprobleme mit der Steuerebene können zu Zustandsverlust führen, und Container können erneut ausgeführt werden, auch wenn Sie erwarten, dass ein Container nicht neu gestartet wird.


---
### Verkürzte Verzögerung beim Neustart von Containern

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

Wenn das Alpha-Feature-Gate `ReduceDefaultCrashLoopBackOffDecay` aktiviert ist,
werden die Wiederholungen beim Containerstart in deinem Cluster
reduziert, sodass sie bei 1s beginnen (statt bei 10s) und sich exponentiell
mit dem Faktor 2 bei jedem Neustart erhöhen, bis eine maximale
Verzögerung von 60s erreicht ist (statt 300s, was 5 Minuten entspricht).

Wenn du diese Funktion zusammen mit dem Alpha-Feature
`KubeletCrashLoopBackOffMax` (unten beschrieben) verwendest,
können einzelne Knoten unterschiedliche maximale Verzögerungen haben.

### Verkürzte Verzögerung beim Neustart von Containern

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

Wenn das Alpha-Feature-Gate `ReduceDefaultCrashLoopBackOffDecay` aktiviert ist,
werden die Wiederholungen beim Containerstart in deinem Cluster
reduziert, sodass sie bei 1s beginnen (statt bei 10s) und sich exponentiell
mit dem Faktor 2 bei jedem Neustart erhöhen, bis eine maximale
Verzögerung von 60s erreicht ist (statt 300s, was 5 Minuten entspricht).

Wenn du diese Funktion zusammen mit dem Alpha-Feature
`KubeletCrashLoopBackOffMax` (unten beschrieben) verwendest,
können einzelne Knoten unterschiedliche maximale Verzögerungen haben.

---

### Konfigurierbare Verzögerung beim Neustart von Containern

{{< feature-state feature_gate_name="KubeletCrashLoopBackOffMax" >}}

Wenn das Alpha-Feature-Gate `KubeletCrashLoopBackOffMax` aktiviert ist, kannst du
die maximale Verzögerung zwischen Wiederholungen beim Containerstart vom Standardwert
von 300s (5 Minuten) neu konfigurieren. Diese Konfiguration wird pro Knoten
mittels der Kubelet-Konfiguration festgelegt. In deiner [Kubelet-
Konfiguration](/docs/tasks/administer-cluster/kubelet-config-file/) lege das Feld
`maxContainerRestartPeriod` unter `crashLoopBackOff` auf einen Wert
zwischen `"1s"` und `"300s"` fest. Wie oben in [Container-Neustartrichtlinie](#restart-policy)
beschrieben, beginnen die Verzögerungen auf diesem Knoten weiterhin bei 10s und
erhöhen sich exponentiell mit dem Faktor 2 bei jedem Neustart, werden aber nun
bei dem von dir konfigurierten Maximum begrenzt. Wenn das von dir konfigurierte
`maxContainerRestartPeriod` kleiner als der anfängliche Standardwert von 10s ist,
wird die anfängliche Verzögerung stattdessen auf das konfigurierte Maximum
festgelegt.

Siehe die folgenden Kubelet-Konfigurationsbeispiele:

```yaml
# Verzögerungen beim Container-Neustart beginnen bei 10s und erhöhen sich
# bei jedem Neustart um den Faktor 2 bis zu einem Maximum von 100s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```
```yaml
# Verzögerungen zwischen Container-Neustarts betragen immer 2s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```
Wenn du diese Funktion zusammen mit dem Alpha-Feature `ReduceDefaultCrashLoopBackOffDecay` (oben beschrieben) verwendest, sind deine Cluster-Standardwerte für die anfängliche und maximale Backoff-Zeit nicht mehr 10s und 300s, sondern 1s und 60s. Die Konfiguration pro Knoten hat Vorrang vor den durch `ReduceDefaultCrashLoopBackOffDecay` festgelegten Standardwerten, selbst wenn dies dazu führen würde, dass ein Knoten eine längere maximale Backoff-Zeit als andere Knoten im Cluster hat.

## Pod-Bedingungen

Ein Pod besitzt einen PodStatus, der ein Array von
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
enthält, die der Pod durchlaufen hat oder nicht. Das Kubelet verwaltet die folgenden
PodConditions:

* `PodScheduled`: Der Pod wurde einem Knoten zugewiesen (scheduled).
* `PodReadyToStartContainers`: (Beta-Feature; standardmäßig [aktiviert](#pod-has-network)) Die
  Pod-Sandbox wurde erfolgreich erstellt und das Netzwerk konfiguriert.
* `ContainersReady`: Alle Container im Pod sind bereit.
* `Initialized`: Alle [Init-Container](/docs/concepts/workloads/pods/init-containers/)
  wurden erfolgreich abgeschlossen.
* `Ready`: Der Pod ist in der Lage, Anfragen zu bedienen, und sollte den Load-
  Balancing-Pools aller passenden Services hinzugefügt werden.
* `DisruptionTarget`: Der Pod wird aufgrund einer Unterbrechung (wie Preemption, Eviction oder Garbage Collection) demnächst beendet.
* `PodResizePending`: Eine Pod-Größenänderung wurde angefordert, kann aber nicht angewendet werden. Siehe [Pod-Größenänderungsstatus](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).
* `PodResizeInProgress`: Der Pod befindet sich im Prozess der Größenänderung. Siehe [Pod-Größenänderungsstatus](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).

Feldname             | Beschreibung
:--------------------|:-----------
`type`               | Name dieser Pod-Bedingung.
`status`             | Gibt an, ob die Bedingung zutrifft, mit möglichen Werten "`True`", "`False`" oder "`Unknown`".
`lastProbeTime`      | Zeitstempel, wann die Pod-Bedingung zuletzt überprüft wurde (probed).
`lastTransitionTime` | Zeitstempel, wann der Pod zuletzt von einem Status in einen anderen übergegangen ist.
`reason`             | Maschinell lesbarer Text im UpperCamelCase-Format, der den Grund für den letzten Übergang der Bedingung angibt.
`message`            | Für Menschen lesbare Nachricht, die Details über den letzten Statusübergang angibt.

### Pod-Bereitschaft {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Deine Anwendung kann zusätzliche Rückmeldungen oder Signale in den PodStatus
einfügen: die *Pod-Bereitschaft*. Um dies zu nutzen, setze `readinessGates`
in der `spec` des Pods, um eine Liste zusätzlicher Bedingungen anzugeben,
die das Kubelet für die Pod-Bereitschaft auswertet.

Die Readiness Gates (Bereitschaftstore) werden durch den aktuellen Zustand der
`status.condition`-Felder des Pods bestimmt. Wenn Kubernetes eine solche
Bedingung im Feld `status.conditions` eines Pods nicht finden kann,
wird der Status der Bedingung standardmäßig auf "`False`" gesetzt.

Hier ist ein Beispiel:

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "[www.example.com/feature-1](https://www.example.com/feature-1)"
status:
  conditions:
    - type: Ready                              # eine eingebaute PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "[www.example.com/feature-1](https://www.example.com/feature-1)"        # eine zusätzliche PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Die Pod-Bedingungen, die du hinzufügst, müssen Namen haben, die dem Kubernetes-
[Label-Key-Format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
entsprechen.

### Status für Pod-Bereitschaft {#pod-readiness-status}

Der `kubectl patch`-Befehl unterstützt das Patchen des Objektstatus nicht.
Um diese `status.conditions` für den Pod festzulegen, sollten Anwendungen und
{{< glossary_tooltip term_id="operator-pattern" text="Operators">}} die
`PATCH`-Aktion verwenden.
Du kannst eine [Kubernetes-Client-Bibliothek](/docs/reference/using-api/client-libraries/)
verwenden, um Code zu schreiben, der benutzerdefinierte Pod-Bedingungen für die
Pod-Bereitschaft festlegt.

Für einen Pod, der benutzerdefinierte Bedingungen verwendet, wird dieser Pod **nur**
dann als bereit (ready) bewertet, wenn beide der folgenden Aussagen zutreffen:

* Alle Container im Pod sind bereit.
* Alle in `readinessGates` angegebenen Bedingungen sind `True`.

Wenn die Container eines Pods bereit (`Ready`) sind, aber mindestens eine benutzerdefinierte
Bedingung fehlt oder `False` ist, setzt das Kubelet die
[Bedingung](#pod-conditions) des Pods auf `ContainersReady`.

### Pod-Netzwerk-Bereitschaft {#pod-has-network}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
Während seiner frühen Entwicklung trug diese Bedingung den Namen `PodHasNetwork`.
{{< /note >}}

Nachdem ein Pod auf einem Knoten geplant wurde, muss er vom Kubelet zugelassen werden
und alle erforderlichen Speicher-Volumes müssen gemountet werden. Sobald diese Phasen
abgeschlossen sind, arbeitet das Kubelet mit einer Container-Laufzeitumgebung
(unter Verwendung von {{< glossary_tooltip term_id="cri" >}}) zusammen, um eine
Laufzeit-Sandbox einzurichten und das Networking für den Pod zu konfigurieren.
Wenn das [Feature Gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PodReadyToStartContainersCondition` aktiviert ist (es ist standardmäßig für Kubernetes {{< skew currentVersion >}} aktiviert),
wird die Bedingung `PodReadyToStartContainers` zum Feld `status.conditions` eines Pods hinzugefügt.

Die Bedingung `PodReadyToStartContainers` wird vom Kubelet auf `False` gesetzt,
wenn es feststellt, dass ein Pod keine Laufzeit-Sandbox mit konfiguriertem Networking besitzt.
Dies tritt in den folgenden Szenarien auf:

- Früh im Lebenszyklus des Pods, wenn das Kubelet noch nicht begonnen hat, eine Sandbox
  für den Pod mithilfe der Container-Laufzeitumgebung einzurichten.
- Später im Lebenszyklus des Pods, wenn die Pod-Sandbox aus einem der folgenden
  Gründe zerstört wurde:
  - der Knoten wird neu gestartet, ohne dass der Pod evakuiert wurde
  - bei Container-Laufzeitumgebungen, die virtuelle Maschinen zur Isolation verwenden,
    der Neustart der Pod-Sandbox-VM, was dann die Erstellung einer neuen Sandbox und
    einer frischen Container-Netzwerkkonfiguration erfordert.

Die Bedingung `PodReadyToStartContainers` wird vom Kubelet auf `True` gesetzt,
nachdem die Sandbox-Erstellung und die Netzwerkkonfiguration für den Pod durch
das Laufzeit-Plugin erfolgreich abgeschlossen wurden. Das Kubelet kann beginnen,
Container-Images zu ziehen und Container zu erstellen, nachdem die Bedingung
`PodReadyToStartContainers` auf `True` gesetzt wurde.

Für einen Pod mit Init-Containern setzt das Kubelet die Bedingung `Initialized` auf
`True`, nachdem die Init-Container erfolgreich abgeschlossen wurden (was nach
der erfolgreichen Sandbox-Erstellung und Netzwerkkonfiguration durch das
Laufzeit-Plugin geschieht). Bei einem Pod ohne Init-Container setzt das Kubelet
die Bedingung `Initialized` auf `True`, bevor die Sandbox-Erstellung und
Netzwerkkonfiguration beginnen.

### Ergebnis der Probe

Jede Probe hat eines von drei Ergebnissen:

`Success` (Erfolg)
: Der Container hat die Diagnose bestanden.

`Failure` (Fehlschlag)
: Der Container hat die Diagnose nicht bestanden.

`Unknown` (Unbekannt)
: Die Diagnose ist fehlgeschlagen (es sollte keine Maßnahme ergriffen werden, und das Kubelet
  wird weitere Überprüfungen durchführen).

### Arten von Probes

Das Kubelet kann optional drei Arten von Probes an laufenden
Containern durchführen und darauf reagieren:

`livenessProbe`
: Zeigt an, ob der Container läuft. Schlägt die
  Liveness Probe fehl, beendet das Kubelet den Container, und der Container
  unterliegt seiner [Neustartrichtlinie](#restart-policy). Wenn ein Container
  keine Liveness Probe bereitstellt, ist der Standardzustand `Success`.

`readinessProbe`
: Zeigt an, ob der Container bereit ist, auf Anfragen zu reagieren.
  Schlägt die Readiness Probe fehl, entfernt der {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}-
  Controller die IP-Adresse des Pods aus den EndpointSlices aller Services, die mit dem Pod übereinstimmen.
  Der Standardzustand der Bereitschaft vor der anfänglichen Verzögerung ist `Failure`. Wenn ein Container
  keine Readiness Probe bereitstellt, ist der Standardzustand `Success`.

`startupProbe`
: Zeigt an, ob die Anwendung innerhalb des Containers gestartet wurde.
  Alle anderen Probes sind deaktiviert, wenn eine Startup Probe bereitgestellt wird, bis diese erfolgreich ist.
  Schlägt die Startup Probe fehl, beendet das Kubelet den Container, und der Container
  unterliegt seiner [Neustartrichtlinie](#restart-policy). Wenn ein Container
  keine Startup Probe bereitstellt, ist der Standardzustand `Success`.

Weitere Informationen zur Einrichtung einer Liveness, Readiness oder Startup Probe
findest du unter [Liveness-, Readiness- und Startup-Probes konfigurieren](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

#### Wann solltest du eine Liveness Probe verwenden?

Wenn der Prozess in deinem Container in der Lage ist, bei einem Fehler oder bei
ungesunden Zustand von selbst abzustürzen, benötigst du nicht zwingend eine
Liveness Probe; das Kubelet führt automatisch die korrekte Aktion gemäß der
`restartPolicy` des Pods durch.

Wenn du möchtest, dass dein Container beendet und neu gestartet wird, falls eine
Probe fehlschlägt, dann gib eine Liveness Probe an und lege eine
`restartPolicy` auf `Always` oder `OnFailure` fest.

#### Wann solltest du eine Readiness Probe verwenden?

Wenn du möchtest, dass der Traffic erst an einen Pod gesendet wird, wenn eine
Probe erfolgreich ist, gib eine Readiness Probe an. In diesem Fall könnte die
Readiness Probe dieselbe sein wie die Liveness Probe. Die Existenz der Readiness
Probe in der Spezifikation bedeutet jedoch, dass der Pod ohne Traffic zu
empfangen startet und erst mit dem Empfang von Traffic beginnt, nachdem die Probe
erfolgreich ist.

Wenn dein Container sich selbst für Wartungsarbeiten herunterfahren können soll,
kannst du eine Readiness Probe angeben, die einen Endpunkt prüft, der spezifisch
für die Bereitschaft ist und sich von der Liveness Probe unterscheidet.

Wenn deine Anwendung eine strikte Abhängigkeit von Backend-Services hat, kannst
du sowohl eine Liveness als auch eine Readiness Probe implementieren. Die
Liveness Probe ist erfolgreich, wenn die Anwendung selbst gesund ist, aber die
Readiness Probe prüft zusätzlich, ob jeder erforderliche Backend-Service
verfügbar ist. Dies hilft dir zu verhindern, dass Traffic an Pods geleitet wird,
die nur mit Fehlermeldungen antworten können.

Wenn dein Container während des Starts große Datenmengen, Konfigurationsdateien
oder Migrationen laden muss, kannst du eine [Startup Probe](#when-should-you-use-a-startup-probe)
verwenden. Wenn du jedoch den Unterschied zwischen einer fehlgeschlagenen
Anwendung und einer Anwendung, die noch ihre Startdaten verarbeitet, erkennen
möchtest, könntest du eine Readiness Probe bevorzugen.

{{< note >}}
Wenn du Anfragen beim Löschen des Pods auslaufen lassen können möchtest
(drain requests), benötigst du nicht zwingend eine Readiness Probe; wenn der
Pod gelöscht wird, wird der entsprechende Endpunkt im `EndpointSlice` seine
[Bedingungen](/docs/concepts/services-networking/endpoint-slices/#conditions)
aktualisieren: die Endpunkt-Bedingung `ready` wird auf `false` gesetzt, sodass
Load Balancer den Pod nicht für regulären Traffic verwenden. Siehe
[Pod-Beendigung](#pod-termination) für weitere Informationen darüber, wie das
Kubelet die Pod-Löschung handhabt.
{{< /note >}}

#### Wann solltest du eine Startup Probe verwenden?

Startup Probes sind nützlich für Pods, deren Container lange Zeit benötigen,
um in Betrieb zu gehen. Anstatt ein langes Liveness-Intervall festzulegen,
kannst du eine separate Konfiguration für die Überprüfung des Containers
während des Starts konfigurieren, die eine längere Zeitspanne zulässt,
als das Liveness-Intervall gestatten würde.

Wenn dein Container normalerweise länger als
$$initialDelaySeconds + failureThreshold \times periodSeconds$$
zum Starten benötigt, solltest du eine Startup Probe festlegen, die denselben
Endpunkt wie die Liveness Probe prüft. Der Standardwert für
`periodSeconds` beträgt 10s. Du solltest dann den `failureThreshold`
hoch genug einstellen, um dem Container den Start zu ermöglichen, ohne die
Standardwerte der Liveness Probe zu ändern. Dies hilft, Deadlocks zu vermeiden.

## Beendigung von Pods {#pod-termination}

Da Pods Prozesse darstellen, die auf Knoten im Cluster laufen, ist es wichtig,
diesen Prozessen eine **saubere Beendigung** zu ermöglichen, wenn sie nicht mehr
benötigt werden (anstatt abrupt mit einem `KILL`-Signal gestoppt zu werden und
keine Chance zur Bereinigung zu haben).

Das Designziel ist, dass du die Löschung anfordern kannst und weißt, wann Prozesse
beendet werden, aber auch sicherstellen kannst, dass Löschungen schließlich
abgeschlossen werden. Wenn du die Löschung eines Pods anforderst, zeichnet der Cluster
die beabsichtigte Grace Period (Toleranzperiode) auf und verfolgt diese, bevor dem
Pod gestattet wird, gewaltsam beendet zu werden. Mit dieser Verfolgung der erzwungenen
Abschaltung versucht das {{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} eine
saubere Abschaltung.

Typischerweise sendet das Kubelet bei dieser sauberen Beendigung des Pods zunächst
Anfragen an die Container-Laufzeitumgebung, um zu versuchen, die Container im Pod zu
stoppen, indem es zuerst ein **TERM-Signal (auch bekannt als SIGTERM)** mit einem
Grace-Period-Timeout an den Hauptprozess in jedem Container sendet.
Die Anfragen zum Stoppen der Container werden von der Container-Laufzeitumgebung
asynchron verarbeitet. Es gibt keine Garantie für die Reihenfolge der Verarbeitung
dieser Anfragen. Viele Container-Laufzeitumgebungen respektieren den in
dem Container-Image definierten `STOPSIGNAL`-Wert und senden, falls dieser abweicht,
das im Container-Image konfigurierte STOPSIGNAL anstelle von TERM.
Sobald die Grace Period abgelaufen ist, wird das **KILL-Signal** an alle
verbleibenden Prozesse gesendet, und der Pod wird dann aus dem
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} gelöscht.
Wird das Kubelet oder der Verwaltungsdienst der Container-Laufzeitumgebung neu
gestartet, während auf die Beendigung der Prozesse gewartet wird, wiederholt der
Cluster den Vorgang von Anfang an, einschließlich der gesamten ursprünglichen
Grace Period.

### Stop-Signale {#pod-termination-stop-signals}

Das Stop-Signal, das zum Beenden des Containers verwendet wird, kann im Container-Image mit der Anweisung `STOPSIGNAL` definiert werden.
Wenn im Image kein Stop-Signal definiert ist, wird das Standardsignal der Container-Laufzeitumgebung
(SIGTERM sowohl für containerd als auch CRI-O) verwendet, um den Container zu beenden.

### Definieren benutzerdefinierter Stop-Signale

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

Wenn das Feature Gate `ContainerStopSignals` aktiviert ist, kannst du ein benutzerdefiniertes Stop-Signal
für deine Container über den Container-Lebenszyklus konfigurieren. Wir setzen das Vorhandensein des Feldes
`spec.os.name` des Pods als Voraussetzung für die Definition von Stop-Signalen im Container-Lebenszyklus voraus.
Die Liste der gültigen Signale hängt von dem Betriebssystem ab, auf dem der Pod geplant ist (scheduled).
Für Pods, die auf Windows-Knoten geplant sind, unterstützen wir nur SIGTERM und SIGKILL als gültige Signale.

Hier ist ein Beispiel für eine Pod-Spezifikation, die ein benutzerdefiniertes Stop-Signal definiert:

```yaml
spec:
  os:
    name: linux
  containers:
    - name: my-container
      image: container-image:latest
      lifecycle:
        stopSignal: SIGUSR1
```
Wenn ein Stop-Signal im Lebenszyklus definiert ist, überschreibt dieses das im Container-Image definierte Signal. Wenn in der Container-Spezifikation kein Stop-Signal definiert ist, greift der Container auf das Standardverhalten zurück.

### Pod-Beendigungsablauf {#pod-termination-flow}

Der Pod-Beendigungsablauf, illustriert an einem Beispiel:

1. Du verwendest das `kubectl`-Tool, um einen bestimmten Pod manuell zu löschen, mit der Standard-Grace Period (Toleranzperiode)
   (30 Sekunden).

1. Der Pod im API-Server wird mit der Zeit aktualisiert, nach der der Pod als "tot"
   gilt, zusammen mit der Grace Period.
   Wenn du `kubectl describe` verwendest, um den Pod, den du löschst, zu überprüfen, wird dieser Pod als "Terminating" (wird beendet) angezeigt.
   Auf dem Knoten, auf dem der Pod läuft: Sobald das Kubelet sieht, dass ein Pod als beendend markiert wurde
   (eine Graceful Shutdown Duration wurde gesetzt), beginnt das Kubelet den lokalen Pod-
   Abschaltprozess.

   1. Wenn einer der Container des Pods einen `preStop`-
      [Hook](/docs/concepts/containers/container-lifecycle-hooks) definiert hat und die `terminationGracePeriodSeconds`
      in der Pod-Spezifikation nicht auf 0 gesetzt ist, führt das Kubelet diesen Hook innerhalb des Containers aus.
      Die standardmäßige Einstellung für `terminationGracePeriodSeconds` beträgt 30 Sekunden.

      Wenn der `preStop`-Hook nach Ablauf der Grace Period immer noch läuft, fordert das Kubelet
      eine kleine, einmalige Verlängerung der Grace Period von 2 Sekunden an.
   {{% note %}}
   Wenn der `preStop`-Hook länger zur Fertigstellung benötigt, als die standardmäßige Grace Period zulässt,
   musst du `terminationGracePeriodSeconds` entsprechend anpassen.
   {{% /note %}}

   1. Das Kubelet löst bei der Container-Laufzeitumgebung aus, ein TERM-Signal an den Prozess 1
      innerhalb jedes Containers zu senden.

      Es gibt eine [spezielle Reihenfolge](#termination-with-sidecars), wenn der Pod
      {{< glossary_tooltip text="Sidecar-Container" term_id="sidecar-container" >}} definiert hat.
      Andernfalls erhalten die Container im Pod das TERM-Signal zu unterschiedlichen Zeitpunkten und in
      einer beliebigen Reihenfolge. Wenn die Reihenfolge der Abschaltungen wichtig ist, ziehe die Verwendung eines `preStop`-Hooks
      zur Synchronisierung in Betracht (oder wechsle zur Verwendung von Sidecar-Containern).

1. Gleichzeitig, während das Kubelet die saubere Abschaltung des Pods beginnt,
   prüft die Steuerungsebene (Control Plane), ob dieser sich abschaltende Pod aus EndpointSlice-Objekten
   entfernt werden soll,
   wobei diese Objekte einen {{< glossary_tooltip term_id="service" text="Service" >}}
   mit einem konfigurierten {{< glossary_tooltip text="Selector" term_id="selector" >}} darstellen.
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} und andere Workload-Ressourcen
   behandeln den sich abschaltenden Pod nicht länger als gültige, betriebsbereite Replica.

   Pods, die langsam herunterfahren, sollten den regulären Traffic nicht weiter bedienen und
   sollten beginnen, offene Verbindungen zu beenden und deren Verarbeitung abzuschließen. Einige
   Anwendungen müssen über den Abschluss offener Verbindungen hinaus eine noch sauberere Beendigung
   ermöglichen, z. B. Session Draining und Abschluss.

   Endpunkte, die die beendenden Pods darstellen, werden nicht sofort aus
   EndpointSlices entfernt, und ein Status, der den [Terminating-Zustand](/docs/concepts/services-networking/endpoint-slices/#conditions)
   anzeigt, wird über die EndpointSlice-API offengelegt.
   Beendende Endpunkte haben ihren `ready`-Status immer auf `false` (zur Abwärtskompatibilität
   mit Versionen vor 1.26), sodass Load Balancer ihn nicht für regulären Traffic verwenden.

   Wenn Traffic-Draining auf beendenden Pods erforderlich ist, kann die tatsächliche Bereitschaft
   als Bedingung `serving` überprüft werden. Weitere Details zur Implementierung des Connection Draining
   findest du im Tutorial [Pods und Endpunkte Beendigungsablauf](/docs/tutorials/services/pods-and-endpoint-termination-flow/)

   <a id="pod-termination-beyond-grace-period" />

1. Das Kubelet stellt sicher, dass der Pod abgeschaltet und beendet wird
   1. Wenn die Grace Period abgelaufen ist und immer noch Container im Pod laufen, löst das
      Kubelet die erzwungene Abschaltung aus.
      Die Container-Laufzeitumgebung sendet `SIGKILL` an alle Prozesse, die noch in einem der
      Container im Pod laufen.
      Das Kubelet bereinigt auch einen versteckten `pause`-Container, falls die Container-Laufzeitumgebung einen solchen verwendet.
   1. Das Kubelet versetzt den Pod in eine finale Phase (`Failed` oder `Succeeded`, abhängig vom
      Endzustand seiner Container).
   1. Das Kubelet löst die erzwungene Entfernung des Pod-Objekts vom API-Server aus, indem es die Grace Period auf 0
      setzt (sofortige Löschung).
   1. Der API-Server löscht das API-Objekt des Pods, das dann von keinem Client mehr sichtbar ist.

### Erzwingen der Pod-Beendigung {#pod-termination-forced}

{{< caution >}}
Erzwungene Löschungen können für einige Workloads und deren Pods potenziell störend sein.
{{< /caution >}}

Standardmäßig erfolgen alle Löschungen sauber (graceful) innerhalb von 30 Sekunden. Der
`kubectl delete`-Befehl unterstützt die Option `--grace-period=<seconds>`,
mit der du den Standardwert überschreiben und deinen eigenen Wert angeben kannst.

Das Setzen der Grace Period auf `0` löscht den Pod **gewaltsam und sofort** aus dem
API-Server. Wenn der Pod noch auf einem Knoten lief, löst diese erzwungene Löschung beim
Kubelet eine sofortige Bereinigung aus.

Bei Verwendung von kubectl musst du zusätzlich zur Option `--grace-period=0` ein
zusätzliches Flag `--force` angeben, um erzwungene Löschungen durchzuführen.

Wenn eine erzwungene Löschung durchgeführt wird, wartet der API-Server nicht auf die Bestätigung
des Kubelets, dass der Pod auf dem Knoten, auf dem er lief, beendet wurde. Er entfernt
den Pod sofort aus der API, sodass ein neuer Pod mit demselben Namen erstellt werden kann.
Auf dem Knoten erhalten Pods, die zur sofortigen Beendigung festgelegt sind, dennoch
eine kleine Grace Period, bevor sie zwangsweise beendet werden (`force killed`).

{{< caution >}}
Die sofortige Löschung wartet nicht auf die Bestätigung, dass die laufende Ressource
beendet wurde. Die Ressource läuft möglicherweise auf unbestimmte Zeit im Cluster weiter.
{{< /caution >}}

Wenn du Pods, die Teil eines StatefulSet sind, zwangsweise löschen musst, beziehe dich auf
die Task-Dokumentation zum [Löschen von Pods aus einem StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

### Pod-Abschaltung und Sidecar-Container {##termination-with-sidecars}

Wenn dein Pod einen oder mehrere
[Sidecar-Container](/docs/concepts/workloads/pods/sidecar-containers/)
enthält (Init-Container mit einer `Always`-Neustartrichtlinie), verzögert das Kubelet das Senden
des TERM-Signals an diese Sidecar-Container, bis der letzte Hauptcontainer vollständig beendet wurde.
Die Sidecar-Container werden in umgekehrter Reihenfolge zu ihrer Definition in der Pod-Spezifikation beendet.
Dies stellt sicher, dass Sidecar-Container die anderen Container im Pod weiterhin bedienen,
bis diese nicht mehr benötigt werden.

Dies bedeutet, dass eine langsame Beendigung eines Hauptcontainers auch die Beendigung
der Sidecar-Container verzögert.
Wenn die Grace Period abläuft, bevor der Beendigungsprozess abgeschlossen ist, kann der Pod in die
[erzwungene Beendigung](#pod-termination-beyond-grace-period) übergehen.
In diesem Fall werden alle verbleibenden Container im Pod gleichzeitig mit einer kurzen Grace Period beendet.

Ebenso kann es zu einer Notfallbeendigung kommen, wenn der Pod einen `preStop`-Hook hat, der die
Beendigungs-Grace Period überschreitet.
Generell gilt: Wenn du `preStop`-Hooks verwendet hast, um die Beendigungsreihenfolge ohne Sidecar-Container
zu steuern, kannst du diese nun entfernen und das Kubelet die Sidecar-Beendigung automatisch verwalten lassen.

### Garbage Collection von Pods {#pod-garbage-collection}

Die API-Objekte für fehlgeschlagene Pods verbleiben in der API des Clusters, bis ein Mensch oder ein
{{< glossary_tooltip term_id="controller" text="Controller" >}}-Prozess
sie explizit entfernt.

Der Pod Garbage Collector (PodGC), welcher ein Controller in der Steuerebene ist, bereinigt
terminierte Pods (mit einer Phase von `Succeeded` oder `Failed`), wenn die Anzahl der Pods den
konfigurierten Schwellenwert überschreitet (bestimmt durch `terminated-pod-gc-threshold` im kube-controller-manager).
Dies verhindert ein Ressourcenleck, da Pods im Laufe der Zeit erstellt und terminiert werden.

Zusätzlich bereinigt PodGC alle Pods, welche eine der folgenden Bedingungen erfüllen:

1. Es sind verwaiste Pods – gebunden an einen Node, der nicht mehr existiert,
1. Es sind nicht eingeplante, terminierende Pods,
1. Es sind terminierende Pods, gebunden an einen nicht bereiten Node, der mit
   [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service) taintiert ist.

Zusammen mit der Bereinigung der Pods markiert PodGC sie auch als fehlgeschlagen, wenn sie sich in einer nicht-terminalen
Phase befinden. Außerdem fügt PodGC eine Pod-Disruptionsbedingung hinzu, wenn ein verwaister Pod bereinigt wird.
Weitere Details siehe [Pod-Disruptionsbedingungen](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions).

## {{% heading "whatsnext" %}}

* Sammle praktische Erfahrungen beim
  [Anhängen von Handlern an Container-Lebenszyklusereignisse](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Sammle praktische Erfahrungen beim
  [Konfigurieren von Liveness-, Readiness- und Startup-Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Erfahre mehr über [Container-Lebenszyklus-Hooks](/docs/concepts/containers/container-lifecycle-hooks/).

* Erfahre mehr über [Sidecar-Container](/docs/concepts/workloads/pods/sidecar-containers/).

* Detaillierte Informationen zum Pod- und Container-Status in der API findest du in der
  API-Referenzdokumentation, welche den
  [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) für Pod behandelt.
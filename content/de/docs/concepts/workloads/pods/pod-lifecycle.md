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

### Reduced container restart delay

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

With the alpha feature gate `ReduceDefaultCrashLoopBackOffDecay` enabled,
container start retries across your cluster will be reduced to begin at 1s
(instead of 10s) and increase exponentially by 2x each restart until a maximum
delay of 60s (instead of 300s which is 5 minutes).

If you use this feature along with the alpha feature
`KubeletCrashLoopBackOffMax` (described below), individual nodes may have
different maximum delays.

### Configurable container restart delay

{{< feature-state feature_gate_name="KubeletCrashLoopBackOffMax" >}}

With the alpha feature gate `KubeletCrashLoopBackOffMax` enabled, you can
reconfigure the maximum delay between container start retries from the default
of 300s (5 minutes). This configuration is set per node using kubelet
configuration. In your [kubelet
configuration](/docs/tasks/administer-cluster/kubelet-config-file/), under
`crashLoopBackOff` set the `maxContainerRestartPeriod` field between `"1s"` and
`"300s"`. As described above in [Container restart policy](#restart-policy),
delays on that node will still start at 10s and increase exponentially by 2x
each restart, but will now be capped at your configured maximum. If the
`maxContainerRestartPeriod` you configure is less than the default initial value
of 10s, the initial delay will instead be set to the configured maximum.

See the following kubelet configuration examples:

```yaml
# container restart delays will start at 10s, increasing
# 2x each time they are restarted, to a maximum of 100s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```

```yaml
# delays between container restarts will always be 2s
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```

If you use this feature along with the alpha feature
`ReduceDefaultCrashLoopBackOffDecay` (described above), your cluster defaults
for initial backoff and maximum backoff will no longer be 10s and 300s, but 1s
and 60s. Per node configuration takes precedence over the defaults set by
`ReduceDefaultCrashLoopBackOffDecay`, even if this would result in a node having
a longer maximum backoff than other nodes in the cluster.

## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
through which the Pod has or has not passed. Kubelet manages the following
PodConditions:

* `PodScheduled`: the Pod has been scheduled to a node.
* `PodReadyToStartContainers`: (beta feature; enabled by [default](#pod-has-network)) the
  Pod sandbox has been successfully created and networking configured.
* `ContainersReady`: all containers in the Pod are ready.
* `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers/)
  have completed successfully.
* `Ready`: the Pod is able to serve requests and should be added to the load
  balancing pools of all matching Services.
* `DisruptionTarget`: the pod is about to be terminated due to a disruption (such as preemption, eviction or garbage-collection).
* `PodResizePending`: a pod resize was requested but cannot be applied. See [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).
* `PodResizeInProgress`: the pod is in the process of resizing. See [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status).

Field name           | Description
:--------------------|:-----------
`type`               | Name of this Pod condition.
`status`             | Indicates whether that condition is applicable, with possible values "`True`", "`False`", or "`Unknown`".
`lastProbeTime`      | Timestamp of when the Pod condition was last probed.
`lastTransitionTime` | Timestamp for when the Pod last transitioned from one status to another.
`reason`             | Machine-readable, UpperCamelCase text indicating the reason for the condition's last transition.
`message`            | Human-readable message indicating details about the last status transition.


### Pod readiness {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Your application can inject extra feedback or signals into PodStatus:
_Pod readiness_. To use this, set `readinessGates` in the Pod's `spec` to
specify a list of additional conditions that the kubelet evaluates for Pod readiness.

Readiness gates are determined by the current state of `status.condition`
fields for the Pod. If Kubernetes cannot find such a condition in the
`status.conditions` field of a Pod, the status of the condition
is defaulted to "`False`".

Here is an example:

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # a built-in PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # an extra PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

The Pod conditions you add must have names that meet the Kubernetes
[label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).

### Status for Pod readiness {#pod-readiness-status}

The `kubectl patch` command does not support patching object status.
To set these `status.conditions` for the Pod, applications and
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} should use
the `PATCH` action.
You can use a [Kubernetes client library](/docs/reference/using-api/client-libraries/) to
write code that sets custom Pod conditions for Pod readiness.

For a Pod that uses custom conditions, that Pod is evaluated to be ready **only**
when both the following statements apply:

* All containers in the Pod are ready.
* All conditions specified in `readinessGates` are `True`.

When a Pod's containers are Ready but at least one custom condition is missing or
`False`, the kubelet sets the Pod's [condition](#pod-conditions) to `ContainersReady`.

### Pod network readiness {#pod-has-network}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
During its early development, this condition was named `PodHasNetwork`.
{{< /note >}}

After a Pod gets scheduled on a node, it needs to be admitted by the kubelet and
to have any required storage volumes mounted. Once these phases are complete,
the kubelet works with
a container runtime (using {{< glossary_tooltip term_id="cri" >}}) to set up a
runtime sandbox and configure networking for the Pod. If the
`PodReadyToStartContainersCondition`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
(it is enabled by default for Kubernetes {{< skew currentVersion >}}), the
`PodReadyToStartContainers` condition will be added to the `status.conditions` field of a Pod.

The `PodReadyToStartContainers` condition is set to `False` by the Kubelet when it detects a
Pod does not have a runtime sandbox with networking configured. This occurs in
the following scenarios:

- Early in the lifecycle of the Pod, when the kubelet has not yet begun to set up a sandbox for
  the Pod using the container runtime.
- Later in the lifecycle of the Pod, when the Pod sandbox has been destroyed due to either:
  - the node rebooting, without the Pod getting evicted
  - for container runtimes that use virtual machines for isolation, the Pod
    sandbox virtual machine rebooting, which then requires creating a new sandbox and
    fresh container network configuration.

The `PodReadyToStartContainers` condition is set to `True` by the kubelet after the
successful completion of sandbox creation and network configuration for the Pod
by the runtime plugin. The kubelet can start pulling container images and create
containers after `PodReadyToStartContainers` condition has been set to `True`.

For a Pod with init containers, the kubelet sets the `Initialized` condition to
`True` after the init containers have successfully completed (which happens
after successful sandbox creation and network configuration by the runtime
plugin). For a Pod without init containers, the kubelet sets the `Initialized`
condition to `True` before sandbox creation and network configuration starts.

## Container probes

A _probe_ is a diagnostic performed periodically by the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
on a container. To perform a diagnostic, the kubelet either executes code within the container,
or makes a network request.

### Check mechanisms {#probe-check-methods}

There are four different ways to check a container using a probe.
Each probe must define exactly one of these four mechanisms:

`exec`
: Executes a specified command inside the container. The diagnostic
  is considered successful if the command exits with a status code of 0.

`grpc`
: Performs a remote procedure call using [gRPC](https://grpc.io/).
  The target should implement
  [gRPC health checks](https://grpc.io/grpc/core/md_doc_health-checking.html).
  The diagnostic is considered successful if the `status`
  of the response is `SERVING`.  

`httpGet`
: Performs an HTTP `GET` request against the Pod's IP
  address on a specified port and path. The diagnostic is
  considered successful if the response has a status code
  greater than or equal to 200 and less than 400.

`tcpSocket`
: Performs a TCP check against the Pod's IP address on
  a specified port. The diagnostic is considered successful if
  the port is open. If the remote system (the container) closes
  the connection immediately after it opens, this counts as healthy.

{{< caution >}}
Unlike the other mechanisms, `exec` probe's implementation involves
the creation/forking of multiple processes each time when executed.
As a result, in case of the clusters having higher pod densities, 
lower intervals of `initialDelaySeconds`, `periodSeconds`, 
configuring any probe with exec mechanism might introduce an overhead on the cpu usage of the node.
In such scenarios, consider using the alternative probe mechanisms to avoid the overhead.
{{< /caution >}}

### Probe outcome

Each probe has one of three results:

`Success`
: The container passed the diagnostic.

`Failure`
: The container failed the diagnostic.

`Unknown`
: The diagnostic failed (no action should be taken, and the kubelet
  will make further checks).

### Types of probe

The kubelet can optionally perform and react to three kinds of probes on running
containers:

`livenessProbe`
: Indicates whether the container is running. If
  the liveness probe fails, the kubelet kills the container, and the container
  is subjected to its [restart policy](#restart-policy). If a container does not
  provide a liveness probe, the default state is `Success`.

`readinessProbe`
: Indicates whether the container is ready to respond to requests.
  If the readiness probe fails, the {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}
  controller removes the Pod's IP address from the EndpointSlices of all Services that match the Pod.
  The default state of readiness before the initial delay is `Failure`. If a container does
  not provide a readiness probe, the default state is `Success`.

`startupProbe`
: Indicates whether the application within the container is started.
  All other probes are disabled if a startup probe is provided, until it succeeds.
  If the startup probe fails, the kubelet kills the container, and the container
 is subjected to its [restart policy](#restart-policy). If a container does not
  provide a startup probe, the default state is `Success`.

For more information about how to set up a liveness, readiness, or startup probe,
see [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

#### When should you use a liveness probe?

If the process in your container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.

#### When should you use a readiness probe?

If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.

If you want your container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.

If your app has a strict dependency on back-end services, you can implement both
a liveness and a readiness probe. The liveness probe passes when the app itself
is healthy, but the readiness probe additionally checks that each required
back-end service is available. This helps you avoid directing traffic to Pods
that can only respond with error messages.

If your container needs to work on loading large data, configuration files, or
migrations during startup, you can use a
[startup probe](#when-should-you-use-a-startup-probe). However, if you want to
detect the difference between an app that has failed and an app that is still
processing its startup data, you might prefer a readiness probe.

{{< note >}}
If you want to be able to drain requests when the Pod is deleted, you do not
necessarily need a readiness probe; when the Pod is deleted, the corresponding endpoint
in the `EndpointSlice` will update its [conditions](/docs/concepts/services-networking/endpoint-slices/#conditions):
the endpoint `ready` condition will be set to `false`, so load balancers
will not use the Pod for regular traffic. See [Pod termination](#pod-termination)
for more information about how the kubelet handles Pod deletion.
{{< /note >}}

#### When should you use a startup probe?

Startup probes are useful for Pods that have containers that take a long time to
come into service. Rather than set a long liveness interval, you can configure
a separate configuration for probing the container as it starts up, allowing
a time longer than the liveness interval would allow.

<!-- ensure front matter contains math: true -->
If your container usually starts in more than
\\( initialDelaySeconds + failureThreshold \times  periodSeconds \\), you should specify a
startup probe that checks the same endpoint as the liveness probe. The default for
`periodSeconds` is 10s. You should then set its `failureThreshold` high enough to
allow the container to start, without changing the default values of the liveness
probe. This helps to protect against deadlocks.

## Termination of Pods {#pod-termination}

Because Pods represent processes running on nodes in the cluster, it is important to
allow those processes to gracefully terminate when they are no longer needed (rather
than being abruptly stopped with a `KILL` signal and having no chance to clean up).

The design aim is for you to be able to request deletion and know when processes
terminate, but also be able to ensure that deletes eventually complete.
When you request deletion of a Pod, the cluster records and tracks the intended grace period
before the Pod is allowed to be forcefully killed. With that forceful shutdown tracking in
place, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} attempts graceful
shutdown.

Typically, with this graceful termination of the pod, kubelet makes requests to the container runtime
to attempt to stop the containers in the pod by first sending a TERM (aka. SIGTERM) signal, 
with a grace period timeout, to the main process in each container.
The requests to stop the containers are processed by the container runtime asynchronously.
There is no guarantee to the order of processing for these requests.
Many container runtimes respect the `STOPSIGNAL` value defined in the container image and,
if different, send the container image configured STOPSIGNAL instead of TERM.
Once the grace period has expired, the KILL signal is sent to any remaining
processes, and the Pod is then deleted from the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}. If the kubelet or the
container runtime's management service is restarted while waiting for processes to terminate, the
cluster retries from the start including the full original grace period.

### Stop Signals {#pod-termination-stop-signals}

The stop signal used to kill the container can be defined in the container image with the `STOPSIGNAL` instruction.
If no stop signal is defined in the image, the default signal of the container runtime 
(SIGTERM for both containerd and CRI-O) would be used to kill the container.

### Defining custom stop signals

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

If the `ContainerStopSignals` feature gate is enabled, you can configure a custom stop signal
for your containers from the container Lifecycle. We require the Pod's `spec.os.name` field
to be present as a requirement for defining stop signals in the container lifecycle.
The list of signals that are valid depends on the OS the Pod is scheduled to.
For Pods scheduled to Windows nodes, we only support SIGTERM and SIGKILL as valid signals.

Here is an example Pod spec defining a custom stop signal:

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

If a stop signal is defined in the lifecycle, this will override the signal defined in the container image.
If no stop signal is defined in the container spec, the container would fall back to the default behavior.

### Pod Termination Flow {#pod-termination-flow}

Pod termination flow, illustrated with an example:

1. You use the `kubectl` tool to manually delete a specific Pod, with the default grace period
   (30 seconds).

1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead"
   along with the grace period.
   If you use `kubectl describe` to check the Pod you're deleting, that Pod shows up as "Terminating".
   On the node where the Pod is running: as soon as the kubelet sees that a Pod has been marked
   as terminating (a graceful shutdown duration has been set), the kubelet begins the local Pod
   shutdown process.

   1. If one of the Pod's containers has defined a `preStop`
      [hook](/docs/concepts/containers/container-lifecycle-hooks) and the `terminationGracePeriodSeconds`
      in the Pod spec is not set to 0, the kubelet runs that hook inside of the container.
      The default `terminationGracePeriodSeconds` setting is 30 seconds.

      If the `preStop` hook is still running after the grace period expires, the kubelet requests
      a small, one-off grace period extension of 2 seconds.
   {{% note %}}
   If the `preStop` hook needs longer to complete than the default grace period allows,
   you must modify `terminationGracePeriodSeconds` to suit this.
   {{% /note %}}

   1. The kubelet triggers the container runtime to send a TERM signal to process 1 inside each
      container.

      There is [special ordering](#termination-with-sidecars) if the Pod has any
      {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} defined.
      Otherwise, the containers in the Pod receive the TERM signal at different times and in
      an arbitrary order. If the order of shutdowns matters, consider using a `preStop` hook
      to synchronize (or switch to using sidecar containers).

1. At the same time as the kubelet is starting graceful shutdown of the Pod, the control plane
   evaluates whether to remove that shutting-down Pod from EndpointSlice objects,
   where those objects represent a {{< glossary_tooltip term_id="service" text="Service" >}}
   with a configured {{< glossary_tooltip text="selector" term_id="selector" >}}.
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and other workload resources
   no longer treat the shutting-down Pod as a valid, in-service replica.

   Pods that shut down slowly should not continue to serve regular traffic and should start
   terminating and finish processing open connections.  Some applications need to go beyond
   finishing open connections and need more graceful termination, for example, session draining
   and completion.

   Any endpoints that represent the terminating Pods are not immediately removed from
   EndpointSlices, and a status indicating [terminating state](/docs/concepts/services-networking/endpoint-slices/#conditions)
   is exposed from the EndpointSlice API.
   Terminating endpoints always have their `ready` status as `false` (for backward compatibility
   with versions before 1.26), so load balancers will not use it for regular traffic.

   If traffic draining on terminating Pod is needed, the actual readiness can be checked as a
   condition `serving`.  You can find more details on how to implement connections draining in the
   tutorial [Pods And Endpoints Termination Flow](/docs/tutorials/services/pods-and-endpoint-termination-flow/)

   <a id="pod-termination-beyond-grace-period" />

1. The kubelet ensures the Pod is shut down and terminated
   1. When the grace period expires, if there is still any container running in the Pod, the
      kubelet triggers forcible shutdown.
      The container runtime sends `SIGKILL` to any processes still running in any container in the Pod.
      The kubelet also cleans up a hidden `pause` container if that container runtime uses one.
   1. The kubelet transitions the Pod into a terminal phase (`Failed` or `Succeeded` depending on
      the end state of its containers).
   1. The kubelet triggers forcible removal of the Pod object from the API server, by setting grace period
      to 0 (immediate deletion).
   1. The API server deletes the Pod's API object, which is then no longer visible from any client.


### Forced Pod termination {#pod-termination-forced}

{{< caution >}}
Forced deletions can be potentially disruptive for some workloads and their Pods.
{{< /caution >}}

By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports
the `--grace-period=<seconds>` option which allows you to override the default and specify your
own value.

Setting the grace period to `0` forcibly and immediately deletes the Pod from the API
server. If the Pod was still running on a node, that forcible deletion triggers the kubelet to
begin immediate cleanup.

Using kubectl, You must specify an additional flag `--force` along with `--grace-period=0`
in order to perform force deletions.

When a force deletion is performed, the API server does not wait for confirmation
from the kubelet that the Pod has been terminated on the node it was running on. It
removes the Pod in the API immediately so a new Pod can be created with the same
name. On the node, Pods that are set to terminate immediately will still be given
a small grace period before being force killed.

{{< caution >}}
Immediate deletion does not wait for confirmation that the running resource has been terminated.
The resource may continue to run on the cluster indefinitely.
{{< /caution >}}

If you need to force-delete Pods that are part of a StatefulSet, refer to the task
documentation for
[deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

### Pod shutdown and sidecar containers {##termination-with-sidecars}

If your Pod includes one or more
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
(init containers with an Always restart policy), the kubelet will delay sending
the TERM signal to these sidecar containers until the last main container has fully terminated.
The sidecar containers will be terminated in the reverse order they are defined in the Pod spec.
This ensures that sidecar containers continue serving the other containers in the Pod until they
are no longer needed.

This means that slow termination of a main container will also delay the termination of the sidecar containers.
If the grace period expires before the termination process is complete, the Pod may enter [forced termination](#pod-termination-beyond-grace-period).
In this case, all remaining containers in the Pod will be terminated simultaneously with a short grace period.

Similarly, if the Pod has a `preStop` hook that exceeds the termination grace period, emergency termination may occur.
In general, if you have used `preStop` hooks to control the termination order without sidecar containers, you can now
remove them and allow the kubelet to manage sidecar termination automatically.

### Garbage collection of Pods {#pod-garbage-collection}

For failed Pods, the API objects remain in the cluster's API until a human or
{{< glossary_tooltip term_id="controller" text="controller" >}} process
explicitly removes them.

The Pod garbage collector (PodGC), which is a controller in the control plane, cleans up
terminated Pods (with a phase of `Succeeded` or `Failed`), when the number of Pods exceeds the
configured threshold (determined by `terminated-pod-gc-threshold` in the kube-controller-manager).
This avoids a resource leak as Pods are created and terminated over time.

Additionally, PodGC cleans up any Pods which satisfy any of the following conditions:

1. are orphan Pods - bound to a node which no longer exists,
1. are unscheduled terminating Pods,
1. are terminating Pods, bound to a non-ready node tainted with
   [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service).

Along with cleaning up the Pods, PodGC will also mark them as failed if they are in a non-terminal
phase. Also, PodGC adds a Pod disruption condition when cleaning up an orphan Pod.
See [Pod disruption conditions](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)
for more details.

## {{% heading "whatsnext" %}}

* Get hands-on experience
  [attaching handlers to container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Get hands-on experience
  [configuring Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Learn more about [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

* Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).

* For detailed information about Pod and container status in the API, see
  the API reference documentation covering
  [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus) for Pod.

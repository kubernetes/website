---
reviewers:
- mikedanese
title: Configuration Best Practices
content_type: concept
weight: 10
---

<!-- overview -->
Diese Seite fasst bewährte Konfigurationspraktiken zusammen, die an verschiedenen Stellen der Benutzeranleitung, in den „Erste Schritte“-Dokumenten und Beispielen erläutert werden.

Sie wird kontinuierlich weiterentwickelt. Wenn dir etwas einfällt, das hier fehlt, aber für andere nützlich sein könnte, zögere nicht, ein Issue zu erstellen oder einen Pull Request einzureichen.

<!-- body -->
## Allgemeine Konfigurationstipps

- Verwende beim Definieren von Konfigurationen immer die neueste stabile API-Version.

- Speichere Konfigurationsdateien in einer Versionsverwaltung (z. B. Git), bevor du sie im Cluster anwendest.  
  So kannst du Änderungen bei Bedarf leicht zurücksetzen. Zudem erleichtert das die Wiederherstellung und den Wiederaufbau des Clusters.

- Nutze YAML anstelle von JSON für Konfigurationsdateien. Beide Formate sind in fast allen Fällen austauschbar,  
  YAML ist jedoch in der Praxis oft lesbarer und benutzerfreundlicher.

- Fasse zusammengehörige Objekte möglichst in einer gemeinsamen Datei zusammen. Eine einzelne Datei ist oft einfacher zu verwalten als viele einzelne.  
  Siehe z. B. die Datei [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml) als Beispiel.

- Viele `kubectl`-Befehle lassen sich direkt auf ein Verzeichnis anwenden. So kannst du beispielsweise  
  `kubectl apply` auf einen Ordner mit Konfigurationsdateien ausführen.

- Gib Standardwerte nur dann an, wenn es wirklich nötig ist. Eine einfache und minimale Konfiguration reduziert die Wahrscheinlichkeit von Fehlern.

- Verwende Annotations für Objektbeschreibungen – das erleichtert die spätere Nachvollziehbarkeit und Analyse.

{{< note >}}
In [YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744) wurde eine inkompatible Änderung gegenüber der [YAML 1.1](https://yaml.org/spec/1.1/#id864510)-Spezifikation für boolesche Werte eingeführt.  
Dies stellt ein bekanntes [Problem](https://github.com/kubernetes/kubernetes/issues/34146) in Kubernetes dar.

YAML 1.2 erkennt nur **true** und **false** als gültige boolesche Werte, während YAML 1.1 zusätzlich  
**yes**, **no**, **on** und **off** akzeptiert.  
Da Kubernetes YAML-[Parser](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024) verwendet, die überwiegend mit YAML 1.1 kompatibel sind,  
kann die Verwendung von **yes** oder **no** anstelle von **true** oder **false** zu unerwartetem Verhalten oder Fehlern führen.

Um dieses Problem zu vermeiden, wird empfohlen, in YAML-Manifests immer **true** oder **false** zu verwenden.  
Strings wie **"yes"** oder **"no"**, die mit booleschen Werten verwechselt werden könnten, sollten in Anführungszeichen gesetzt werden.

Neben booleschen Werten gibt es weitere Unterschiede zwischen YAML-Versionen.  
Eine vollständige Liste findest du in der [Dokumentation zu YAML-Spezifikationsänderungen](https://spec.yaml.io/main/spec/1.2.2/ext/changes).
{{< /note >}}

## Nicht verwaltete Pods versus ReplicaSets, Deployments und Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}

- Vermeide nach Möglichkeit nicht verwaltete Pods (also Pods, die nicht an ein [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) oder ein [Deployment](/docs/concepts/workloads/controllers/deployment/) gebunden sind).  
  Nicht verwaltete Pods werden bei einem Knotenausfall nicht erneut gestartet.

  Ein Deployment, das ein ReplicaSet erstellt, um sicherzustellen, dass die gewünschte Anzahl an Pods immer verfügbar ist, und eine Strategie zum Ersetzen von Pods vorgibt (z. B. ein [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), ist fast immer vorzuziehen, außer in bestimmten Fällen mit ausdrücklich gesetzter [restartPolicy: Never](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).  
  In solchen Fällen kann auch ein [Job](/docs/concepts/workloads/controllers/job/) die richtige Wahl sein.

## Services

- Erstelle einen [Service](/docs/concepts/services-networking/service/) vor den zugehörigen Workloads, die auf diesen Service zugreifen müssen.  
  Wenn Kubernetes einen Container startet, stellt es diesem Umgebungsvariablen zu allen Services bereit,  
  die beim Startzeitpunkt des Containers bereits existierten.  
  Wenn zum Beispiel ein Service mit dem Namen `foo` existiert, erhalten alle Container folgende Variablen:

  ```shell
  FOO_SERVICE_HOST=<der Host, auf dem der Service läuft>
  FOO_SERVICE_PORT=<der Port, auf dem der Service läuft>
  ```

  *Das impliziert eine Reihenfolge:* Jeder `Service`, auf den ein `Pod` zugreifen soll,  
  muss vor dem `Pod` selbst erstellt worden sein – andernfalls werden die Umgebungsvariablen nicht gesetzt.  
  DNS ist von dieser Einschränkung ausgenommen.

- Eine optionale (aber stark empfohlene) [Cluster-Erweiterung](/docs/concepts/cluster-administration/addons/) ist ein DNS-Server.  
  Dieser beobachtet die Kubernetes API auf neue `Services` und erzeugt zugehörige DNS-Einträge.  
  Wenn DNS im gesamten Cluster aktiviert ist, können alle `Pods` automatisch die Namen von `Services` auflösen.

- Gib einem Pod nur dann ein `hostPort`, wenn es unbedingt erforderlich ist.  
  Ein Pod mit `hostPort` kann nur auf Knoten geplant werden,  
  auf denen die Kombination aus `<hostIP, hostPort, protocol>` eindeutig ist.  
  Wenn du `hostIP` und `protocol` nicht explizit angibst, nimmt Kubernetes standardmäßig `0.0.0.0` als `hostIP`  
  und `TCP` als `protocol`.

  Falls du nur zu Debugging-Zwecken auf einen Port zugreifen musst,  
  verwende den [API-Server-Proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)  
  oder [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  Falls du explizit einen Pod-Port auf dem Node verfügbar machen willst,  
  erwäge stattdessen einen [NodePort](/docs/concepts/services-networking/service/#type-nodeport)-Service zu verwenden,  
  bevor du zu `hostPort` greifst.

- Vermeide die Verwendung von `hostNetwork`. Aus denselben Gründen wie bei `hostPort`.

- Nutze [headless Services](/docs/concepts/services-networking/service/#headless-services)  
  (mit `ClusterIP: None`) für die Servicediscovery, wenn du kein Load-Balancing durch `kube-proxy` benötigst.

## Labels verwenden

- Definiere und verwende [Labels](/docs/concepts/overview/working-with-objects/labels/),  
  um __semantische Attribute__ deiner Anwendung oder deines Deployments zu kennzeichnen,  
  z. B. `{ app.kubernetes.io/name: MyApp, tier: frontend, phase: test, deployment: v3 }`.  
  Du kannst diese Labels verwenden, um die passenden Pods für andere Ressourcen auszuwählen,  
  z. B. einen Service, der alle `tier: frontend`-Pods auswählt, oder alle `phase: test`-Komponenten  
  von `app.kubernetes.io/name: MyApp`.  
  Siehe die [Guestbook-App](https://github.com/kubernetes/examples/tree/master/guestbook/)  
  für ein Beispiel für diesen Ansatz.

  Ein Service kann mehrere Deployments umfassen, wenn du versionsspezifische Labels aus dem Selector weglässt.  
  Wenn du einen laufenden Service ohne Downtime aktualisieren willst, verwende ein  
  [Deployment](/docs/concepts/workloads/controllers/deployment/).

  Der gewünschte Zustand eines Objekts wird durch ein Deployment beschrieben. Wenn Änderungen an diesem Spec
  _angewendet_ werden, sorgt der Deployment-Controller dafür, dass der tatsächliche Zustand gesteuert  
  an den gewünschten Zustand angepasst wird.

- Verwende die [Kubernetes-Standard-Labels](/docs/concepts/overview/working-with-objects/common-labels/)  
  für gängige Anwendungsfälle. Diese standardisierten Labels bereichern die Metadaten und ermöglichen es Tools  
  wie `kubectl` und dem [Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard),  
  interoperabel zu arbeiten.

- Du kannst Labels für Debugging-Zwecke manipulieren.  
  Da Kubernetes-Controller (z. B. ReplicaSets) und Services Pods anhand von Label-Selektoren zuordnen,  
  führt das Entfernen der relevanten Labels eines Pods dazu, dass dieser nicht mehr von einem Controller gesteuert  
  oder von einem Service mit Traffic versorgt wird.  
  Wenn du einem laufenden Pod die Labels entfernst, erstellt der Controller einen neuen Pod als Ersatz.  
  Das ist eine nützliche Methode, um einen ehemals „aktiven“ Pod in einer „Quarantäne“-Umgebung zu debuggen.  
  Um Labels interaktiv hinzuzufügen oder zu entfernen, verwende [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).

## kubectl verwenden

- Verwende `kubectl apply -f <Verzeichnis>`.  
  Dieser Befehl sucht nach Kubernetes-Konfigurationsdateien mit der Endung `.yaml`, `.yml` oder `.json` im angegebenen `<Verzeichnis>`  
  und übergibt sie an `apply`.

- Verwende Label-Selektoren für `get`- und `delete`-Operationen anstelle von spezifischen Objektnamen.  
  Siehe dazu die Abschnitte zu [Label-Selektoren](/docs/concepts/overview/working-with-objects/labels/#label-selectors)  
  und [Labels effektiv einsetzen](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively).

- Nutze `kubectl create deployment` und `kubectl expose`,  
  um schnell Single-Container-Deployments und zugehörige Services zu erstellen.  
  Siehe [Einen Service verwenden, um auf eine Anwendung im Cluster zuzugreifen](/docs/tasks/access-application-cluster/service-access-application-cluster/) für ein Beispiel.

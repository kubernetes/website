---
title: Produktionsumgebung
description: >-
  Erstellen Sie einen produktionsreifen Kubernetes-Cluster
content_type: concept
weight: 30
no_list: true
---

<!-- overview -->

Ein produktionsreifer Kubernetes-Cluster erfordert Planung und Vorbereitung.
Wenn Ihr Kubernetes-Cluster geschäftskritische Workloads ausführen soll, muss er so konfiguriert sein, dass er belastbar ist.
Diese Seite erläutert Schritte, die Sie unternehmen können, um einen produktionsreifen Cluster einzurichten
oder einen bestehenden Cluster für den Produktionseinsatz vorzubereiten.
Wenn Sie bereits mit der Produktionseinrichtung vertraut sind und nur die Links benötigen, fahren Sie mit [Nächste Schritte](#nächste-schritte) fort.

<!-- body -->

## Überlegungen zur Produktion

Typischerweise hat eine Kubernetes-Produktionsumgebung mehr Anforderungen als eine
Kubernetes-Umgebung für persönliches Lernen, Entwicklung oder Tests. Eine Produktionsumgebung kann
sicheren Zugriff durch viele Benutzer, konsistente Verfügbarkeit und die Ressourcen zur Anpassung
an sich ändernde Anforderungen erfordern.

Wenn Sie entscheiden, wo Ihre Kubernetes-Produktionsumgebung betrieben werden soll
(lokal oder in einer Cloud) und wie viel Verwaltung Sie selbst übernehmen
oder anderen überlassen möchten, berücksichtigen Sie, wie Ihre Anforderungen an einen Kubernetes-Cluster
durch die folgenden Aspekte beeinflusst werden:

- *Verfügbarkeit*: Eine Einzel-Maschinen-Kubernetes-[Lernumgebung](/docs/setup/#learning-environment) hat einen einzelnen Ausfallpunkt. Die Erstellung eines hochverfügbaren Clusters bedeutet die Berücksichtigung von:

  * Trennung der Steuerungsebene von den Worker-Knoten.
  * Replikation der Steuerungsebenen-Komponenten auf mehreren Knoten.
  * Lastverteilung des Datenverkehrs zum {{< glossary_tooltip term_id="kube-apiserver" text="API-Server" >}} des Clusters.
  * Ausreichend Worker-Knoten verfügbar oder bei Bedarf schnell verfügbar, wenn sich die Workloads ändern.

- *Skalierung*: Wenn Sie erwarten, dass Ihre Kubernetes-Produktionsumgebung eine stabile Nachfrage
erhält, können Sie möglicherweise die benötigte Kapazität einrichten und sind fertig. Wenn Sie jedoch
erwarten, dass die Nachfrage im Laufe der Zeit wächst oder sich drastisch ändert, basierend auf
saisonalen Schwankungen oder besonderen Ereignissen, müssen Sie planen, wie Sie skalieren können, um den erhöhten
Druck durch mehr Anfragen an die Steuerungsebene und Worker-Knoten zu bewältigen oder herunterskalieren, um ungenutzte
Ressourcen zu reduzieren.

- *Sicherheit und Zugriffsverwaltung*: Auf Ihrem eigenen
Kubernetes-Lerncluster haben Sie volle Administratorrechte. Bei gemeinsam genutzten Clustern mit wichtigen Workloads und
mehr als ein oder zwei Benutzern ist jedoch ein differenzierterer Ansatz erforderlich, wer und was
auf Cluster-Ressourcen zugreifen kann. Sie können rollenbasierte Zugriffskontrolle
([RBAC](/docs/reference/access-authn-authz/rbac/)) und andere
Sicherheitsmechanismen verwenden, um sicherzustellen, dass Benutzer und Workloads Zugriff auf die
benötigten Ressourcen erhalten, während Workloads und der Cluster selbst sicher bleiben.
Sie können Grenzen für die Ressourcen setzen, auf die Benutzer und Workloads zugreifen können,
indem Sie [Richtlinien](/docs/concepts/policy/) und
[Container-Ressourcen](/docs/concepts/configuration/manage-resources-containers/) verwalten.

Bevor Sie eine Kubernetes-Produktionsumgebung selbst aufbauen, erwägen Sie,
einen Teil oder die gesamte Arbeit an Anbieter von
[schlüsselfertigen Cloud-Lösungen](/docs/setup/production-environment/turnkey-solutions/)
oder andere [Kubernetes-Partner](https://kubernetes.io/partners/) zu übergeben.
Optionen umfassen:

- *Serverlos*: Führen Sie Workloads einfach auf der Infrastruktur von Drittanbietern aus, ohne
einen Cluster selbst zu verwalten. Sie werden für Dinge wie CPU-Nutzung, Speicher und
Festplattenanfragen berechnet.
- *Verwaltete Steuerungsebene*: Lassen Sie den Anbieter die Skalierung und Verfügbarkeit
der Steuerungsebene des Clusters verwalten sowie Patches und Upgrades durchführen.
- *Verwaltete Worker-Knoten*: Konfigurieren Sie Knotenpools nach Ihren Bedürfnissen,
dann stellt der Anbieter sicher, dass diese Knoten verfügbar sind und bei Bedarf Upgrades implementiert werden.
- *Integration*: Es gibt Anbieter, die Kubernetes mit anderen
Diensten integrieren, die Sie möglicherweise benötigen, wie Speicher, Container-Registries, Authentifizierungsmethoden
und Entwicklungswerkzeuge.

Unabhängig davon, ob Sie einen Kubernetes-Produktionscluster selbst erstellen oder mit
Partnern zusammenarbeiten, lesen Sie die folgenden Abschnitte, um Ihre Anforderungen in Bezug
auf die *Steuerungsebene*, die *Worker-Knoten*, die *Benutzerzugriffe* und die
*Workload-Ressourcen* Ihres Clusters zu bewerten.

## Einrichtung eines Produktionsclusters

In einem Kubernetes-Produktionscluster verwaltet die Steuerungsebene den Cluster
über Dienste, die auf viele verschiedene Arten über mehrere Computer verteilt werden können. Jeder
Worker-Knoten stellt jedoch eine einzelne Einheit dar, die für die Ausführung von Kubernetes-Pods konfiguriert ist.

### Steuerungsebene in der Produktion

Der einfachste Kubernetes-Cluster hat die gesamte Steuerungsebene und die Worker-Knoten-Dienste
auf derselben Maschine. Sie können diese Umgebung erweitern, indem Sie Worker-Knoten hinzufügen,
wie im Diagramm in den
[Kubernetes-Komponenten](/docs/concepts/overview/components/) dargestellt.
Wenn der Cluster für eine kurze Zeit oder nach der Identifizierung eines schwerwiegenden Problems verworfen werden kann,
könnte dies Ihren Anforderungen genügen.

Wenn Sie jedoch einen dauerhafteren, hochverfügbaren Cluster benötigen, sollten Sie
Möglichkeiten in Betracht ziehen, die Steuerungsebene zu erweitern. Standardmäßig sollte der
Cluster bei einem Maschinenausfall nicht heruntergefahren werden und die Ausführung des Clusters sollte es ermöglichen,
Komponenten zu reparieren oder auszutauschen, ohne Ausfallzeiten zu verursachen.

- *Deployment-Werkzeuge*: Die Seite
[Kubernetes mit Deployment-Werkzeugen installieren](/docs/setup/production-environment/tools/)
bietet Anleitungen zur Bereitstellung einer produktionsreifen Steuerungsebene.

- *Externe Dienste*: Die Steuerungsebene läuft mit den Diensten etcd, API-Server,
Scheduler und Controller-Manager, die jeweils auf verschiedenen Maschinen laufen können.

- *Replikation*: Für hohe Verfügbarkeit kann die Steuerungsebene und ihre Dienste
über mehrere Knoten repliziert werden. Weitere Informationen finden Sie unter
[Optionen für hochverfügbare Topologie](/docs/setup/production-environment/tools/kubeadm/ha-topology/).

- *Mehrere Zonen*: Wenn es entscheidend ist, dass Ihr Cluster auch dann verfügbar bleibt,
wenn ein gesamtes Rechenzentrum oder eine Region ausfällt, sollten Sie einen Cluster in
[mehreren Zonen](/docs/setup/best-practices/multiple-zones/) in Betracht ziehen.

### Worker-Knoten in der Produktion

Produktionsreife Workloads müssen belastbar sein, und alles, worauf sie angewiesen sind
(wie CoreDNS), muss ebenfalls belastbar sein. Unabhängig davon, ob Sie Ihre eigene
Steuerungsebene verwalten oder einen Cloud-Anbieter dies für Sie tun lassen,
müssen Sie dennoch überlegen, wie Sie Ihre *Worker-Knoten* verwalten möchten
(manchmal auch einfach als *Knoten* bezeichnet).

- *Knoten konfigurieren*: Knoten können physische oder virtuelle Maschinen sein. Wenn Sie
Knoten selbst erstellen und verwalten möchten, können Sie ein unterstütztes Betriebssystem
installieren und dann die entsprechenden
[Knotendienste](/docs/setup/production-environment/tools/) hinzufügen und ausführen.
- *Knoten validieren*: Informationen dazu, wie Sie sicherstellen können, dass ein Knoten
die Anforderungen für den Beitritt zu einem Kubernetes-Cluster erfüllt, finden Sie unter
[Knoteneinrichtung validieren](/docs/setup/best-practices/node-conformance/).
- *Knoten zum Cluster hinzufügen*: Wenn Sie den Cluster selbst verwalten, können Sie
Knoten hinzufügen, indem Sie Ihre eigenen Maschinen einrichten und sie entweder manuell
hinzufügen oder sie sich beim API-Server des Clusters registrieren lassen. Informationen
zum Einrichten von Knoten finden Sie im Abschnitt [Knoten](/docs/concepts/architecture/nodes/).
- *Knoten skalieren*: Haben Sie einen Plan, um die Kapazität zu erweitern, die Ihr Cluster
letztendlich benötigen wird. Siehe [Überlegungen für große Cluster](/docs/setup/best-practices/cluster-large/),
um zu bestimmen, wie viele Knoten Sie benötigen, basierend auf der Anzahl der Pods und
Container, die Sie ausführen müssen.
- *Knoten automatisch skalieren*: Die meisten Cloud-Anbieter unterstützen den
[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme),
um überlastete Knoten durch neue Knoten zu ersetzen. Weitere Informationen finden Sie unter
[Knoten-Autoskalierung](/docs/concepts/cluster-administration/node-autoscaling/)
und zur Dimensionierung von Knotengruppen lesen Sie
[Sizing a node group](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-should-i-configure-the-size-of-my-node-groups).

## Benutzerverwaltung in der Produktion

In der Produktion gehen Sie möglicherweise von einem Modell, in dem Sie oder eine kleine Gruppe
auf den Cluster zugreift, zu einem Modell über, in dem möglicherweise Dutzende oder Hunderte
von Personen Zugriff benötigen. In einer Lern- oder Plattformentwicklungsumgebung haben Sie
möglicherweise ein einzelnes Administratorkonto für alles, was Sie tun. In der Produktion
benötigen Sie mehr Konten mit unterschiedlichen Zugriffsebenen auf verschiedene Namespaces.

Die Einrichtung eines produktionsreifen Clusters bedeutet, zu entscheiden, wie Sie
selektiven Zugriff auf Cluster-Ressourcen gewähren möchten. Insbesondere müssen Sie
die folgenden Strategien auswählen und umsetzen:

- *Authentifizierung*: Der API-Server kann Benutzer mit Client-Zertifikaten,
Bearer-Token, einem Authentifizierungsproxy oder HTTP-Basisauthentifizierung authentifizieren.
Sie können die Authentifizierungsmethoden auswählen, die Sie verwenden möchten. Mithilfe von
Plugins kann der API-Server die vorhandene Benutzerverwaltungsmethode Ihres
Unternehmens nutzen, wie LDAP oder Kerberos. Verschiedene Methoden zur
Authentifizierung von Kubernetes-Benutzern finden Sie unter
[Authentifizierung](/docs/reference/access-authn-authz/authentication/).
- *Autorisierung*: Wenn Sie Ihre regulären Benutzer autorisieren, werden Sie wahrscheinlich
zwischen RBAC- und ABAC-Autorisierung wählen. Informationen zu verschiedenen Modi der
Autorisierung von Benutzerkonten (und des Zugriffs auf Dienstkonten in Ihrem Cluster) finden Sie unter
[Autorisierungsübersicht](/docs/reference/access-authn-authz/authorization/):
  * *Rollenbasierte Zugriffskontrolle* ([RBAC](/docs/reference/access-authn-authz/rbac/)):
  Ermöglicht die Zuweisung von Zugriffsrechten an authentifizierte Benutzer. Berechtigungen können
  für einen bestimmten Namespace (Role) oder clusterübergreifend (ClusterRole) zugewiesen werden.
  Anschließend können mithilfe von RoleBindings und ClusterRoleBindings diese Berechtigungen
  bestimmten Benutzern zugeordnet werden.
  * *Attributbasierte Zugriffskontrolle* ([ABAC](/docs/reference/access-authn-authz/abac/)):
  Ermöglicht die Erstellung von Richtlinien basierend auf Ressourcenattributen im Cluster
  und erlaubt oder verweigert den Zugriff basierend auf diesen Attributen.

Als Administrator, der eine Kubernetes-Produktionsumgebung einrichtet, sind hier
einige Dinge zu beachten:

- *Autorisierungsmodus festlegen*: Wenn der Kubernetes-API-Server
({{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}) gestartet wird,
müssen die unterstützten Autorisierungsmodi mit dem Flag *--authorization-mode* festgelegt werden.
Zum Beispiel wird das Flag in der Datei *kube-apiserver.yaml*
(in */etc/kubernetes/manifests*) auf node,rbac gesetzt. Dies ermöglicht
Knoten- und RBAC-Autorisierung für authentifizierte Anfragen.
- *Benutzer-Zertifikate und Rollen-Bindings erstellen (RBAC)*: Wenn Sie RBAC-Autorisierung
verwenden, können Benutzer ein CertificateSigningRequest (CSR) erstellen, das von
der Cluster-CA signiert werden kann. Dann können Sie Rollen und ClusterRoles an
jeden Benutzer binden. Siehe
[Zertifikats-Signieranfragen](/docs/reference/access-authn-authz/certificate-signing-requests/)
für weitere Informationen.
- *Richtlinien erstellen, die Attribute kombinieren (ABAC)*: Wenn Sie ABAC-Autorisierung
verwenden, können Sie Kombinationen von Attributen zuweisen, um Richtlinien zu erstellen, die
ausgewählte Benutzer oder Gruppen autorisieren, auf bestimmte Ressourcen (z.B. einen Pod),
Namespaces oder apiGroups zuzugreifen. Weitere Informationen finden Sie in der
[ABAC-Autorisierung](/docs/reference/access-authn-authz/abac/).
- *Admission Controller in Betracht ziehen*:
[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/)
sind Plugins, die Anfragen an den Kubernetes-API-Server
abfangen. Eine häufige Verwendung von Admission Controllern ist die Einschränkung
von Anfragen zum Erstellen, Löschen und Ändern von Kubernetes-Objekten. Admission Controller
können den Umfang einer Anfrage auch erweitern, wenn sie mit Webhooks arbeiten.

## Grenzen für Workload-Ressourcen setzen

Die Anforderungen von Produktions-Workloads können sowohl innerhalb als auch außerhalb der
Kubernetes-Steuerungsebene Druck erzeugen. Berücksichtigen Sie diese Punkte, wenn Sie
die Anforderungen der Workloads Ihres Clusters konfigurieren:

- *Namespace-Grenzen setzen*: Setzen Sie Quoten für Dinge wie Speicher und CPU
pro Namespace. Siehe [Speicher-, CPU- und API-Ressourcen verwalten](/docs/tasks/administer-cluster/manage-resources/)
für Details. Sie können auch [hierarchische Namespaces](/blog/2020/08/14/introducing-hierarchical-namespaces/)
einrichten, um Grenzen zu vererben.
- *DNS-Anfragen vorbereiten*: Wenn Sie erwarten, dass Workloads massiv skalieren, muss auch
Ihr DNS-Dienst skalieren. Siehe
[DNS-Dienst im Cluster automatisch skalieren](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Zusätzliche Dienstkonten erstellen*: Benutzerkonten bestimmen, was Benutzer in einem
Cluster tun können, während ein Dienstkonto den Pod-Zugriff innerhalb eines bestimmten
Namespaces definiert. Standardmäßig übernimmt ein Pod das Standard-Dienstkonto seines Namespaces.
Informationen zum Erstellen eines neuen Dienstkontos finden Sie unter
[Dienstkonten verwalten](/docs/reference/access-authn-authz/service-accounts-admin/).
Sie können beispielsweise Folgendes tun:
  * Geheimnisse hinzufügen, die ein Pod verwenden kann, um Images aus einer bestimmten Container-Registry abzurufen. Siehe
  [Dienstkonten für Pods konfigurieren](/docs/tasks/configure-pod-container/configure-service-account/)
  für ein Beispiel.
  * Einem Dienstkonto RBAC-Berechtigungen zuweisen. Siehe
  [Dienstkonto-Berechtigungen](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
  für Details.

## {{% heading "whatsnext" %}}

- Entscheiden Sie, ob Sie Ihre eigene produktionsreife Kubernetes-Umgebung erstellen oder
eine von verfügbaren
[schlüsselfertigen Cloud-Lösungen](/docs/setup/production-environment/turnkey-solutions/)
oder [Kubernetes-Partnern](https://kubernetes.io/partners/) beziehen möchten.
- Wenn Sie Ihren eigenen Cluster erstellen, planen Sie, wie Sie
[Zertifikate](/docs/setup/best-practices/certificates/) handhaben und
Hochverfügbarkeit für Funktionen wie
[etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
und den
[API-Server](/docs/setup/production-environment/tools/kubeadm/ha-topology/) einrichten.
- Wählen Sie zwischen einem [kubeadm](/docs/setup/production-environment/tools/kubeadm/)-
oder [kops](https://kops.sigs.k8s.io/)-basierten Deployment.
- Konfigurieren Sie die Benutzerverwaltung, indem Sie Ihre
[Authentifizierungs-](/docs/reference/access-authn-authz/authentication/) und
[Autorisierungsmethoden](/docs/reference/access-authn-authz/authorization/) festlegen.
- Bereiten Sie die Workloads von Anwendungen vor, indem Sie
[Ressourcengrenzen](/docs/tasks/administer-cluster/manage-resources/),
[DNS-Autoskalierung](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
und [Dienstkonten](/docs/reference/access-authn-authz/service-accounts-admin/) einrichten.

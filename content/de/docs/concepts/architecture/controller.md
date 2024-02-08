---
title: Controller
content_type: concept
weight: 30
---

<!-- overview -->

In der Robotik und der Automatisierung ist eine _Kontrollschleife_ eine endlose Schleife, die den Zustand eines Systems regelt.

Hier ist ein Beispiel einer Kontrollschleife: ein Thermostat in einem Zimmer.

Wenn Sie die Temperatur einstellen, sagen Sie dem Thermostaten was der *Wunschzustand* ist. Die tatsächliche Raumtemperatur ist der *Istzustand*. Der Thermostat agiert um den Istzustand dem Wunschzustand anzunähern, indem er Geräte an oder ausschaltet.

{{< glossary_definition text="Controller" term_id="controller" length="short">}}




<!-- body -->

## Controller Muster

Ein Controller überwacht mindestens einen Kubernetes Ressourcentyp.
Diese {{< glossary_tooltip text="Objekte" term_id="object" >}}
haben ein Spezifikationsfeld, das den Wunschzustand darstellt. Der oder die Controller für diese Ressource sind dafür verantwortlich, dass sich der Istzustand dem Wunschzustand annähert.

Der Controller könnte die Aktionen selbst ausführen; meistens jedoch sendet der Controller Nachrichten an den {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}, die nützliche Effekte haben. Unten sehen Sie Beispiele dafür.

{{< comment >}}
Manche eingebaute Controller, zum Beispiel der Namespace Controller, agieren auf Objekte die keine Spezifikation haben. Zur Vereinfachung lässt diese Seite die Erklärung zu diesem Detail aus.
{{< /comment >}}

### Kontrolle via API Server

Der {{< glossary_tooltip text="Job" term_id="job" >}} Controller ist ein Beispiel eines eingebauten Kubernetes Controllers. Eingebaute Controller verwalten den Zustand durch Interaktion mit dem Cluster API Server.

Ein Job ist eine Kubernetes Ressource, die einen {{< glossary_tooltip text="Pod" term_id="pod" >}}, oder vielleicht mehrere Pods, erstellt, um eine Tätigkeit auszuführen und dann zu beenden.

(Sobald [geplant](/docs/concepts/scheduling-eviction/), werden Pod Objekte Teil des Wunschzustands eines Kubelets).

Wenn der Job Controller eine neue Tätigkeit erkennt, versichert er, dass irgendwo in Ihrem Cluster, die Kubelets auf einem Satz Knoten, die korrekte Anzahl Pods laufen lässt, um die Tätigkeit auszuführen. Der Job Controller selbst lässt keine Pods oder Container laufen. Stattdessen sagt der Job Controller dem API Server, dass er Pods erstellen oder entfernen soll.
Andere Komponenten in der {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} reagieren auf die neue Information (neue Pods müssen geplant werden und müssen laufen), und irgendwann ist die Arbeit beendet.

Nachdem Sie einen neuen Job erstellen, ist der Wunschzustand, dass dieser Job beendet ist. Der Job Controller sorgt dafür, dass der Istzustand sich dem Wunschzustand annähert: Pods, die die Arbeit ausführen, werden erstellt, sodass der Job näher an seine Vollendung kommt.

Controller aktualisieren auch die Objekte die sie konfigurieren. Zum Beispiel: sobald die Arbeit eines Jobs beendet ist, aktualisiert der Job Controller das Job Objekt und markiert es als `beendet`.

(Das ist ungefähr wie ein Thermostat, der ein Licht ausschaltet, um anzuzeigen dass der Raum nun die Wunschtemperatur hat).

### Direkte Kontrolle

Im Gegensatz zum Job Controller, müssen manche Controller auch Sachen außerhalb Ihres Clusters ändern.

Zum Beispiel, wenn Sie eine Kontrollschleife verwenden, um sicherzustellen dass es genug {{< glossary_tooltip text="Knoten" term_id="node" >}} in ihrem Cluster gibt, dann benötigt dieser Controller etwas außerhalb des jetztigen Clusters, um neue Knoten bei Bedarf zu erstellen.

Controller die mit dem externen Status interagieren, erhalten den Wunschzustand vom API Server, und kommunizieren dann direkt mit einem externen System, um den Istzustand näher an den Wunschzustand zu bringen.

(Es gibt tatsächlich einen [Controller](https://github.com/kubernetes/autoscaler/), der die Knoten in Ihrem Cluster horizontal skaliert.)

Wichtig ist hier, dass der Controller Veränderungen vornimmt, um den Wunschzustand zu erreichen, und dann den Istzustand an den API Server Ihres Clusters meldet. Andere Kontrollschleifen können diese Daten beobachten und eigene Aktionen unternehmen.

Im Beispiel des Thermostaten, wenn der Raum sehr kalt ist, könnte ein anderer Controller eine Frostschutzheizung einschalten. Bei Kubernetes Cluster arbeitet die Contol Plane indirekt mit IP Adressen Verwaltungstools, Speicherdienste, Cloud Provider APIs, und andere Dienste, um [Kubernetes zu erweitern](/docs/concepts/extend-kubernetes/) und das zu implementieren.

## Wunschzustand gegen Istzustand {#desired-vs-current}

Kubernetes hat eine Cloud-Native Sicht auf Systeme, und kann ständige Veränderungen verarbeiten.

Ihr Cluster kann sich jederzeit verändern, während Arbeit erledigt wird und Kontrollschleifen automatisch Fehler reparieren. Das bedeutet, dass Ihr Cluster eventuell nie einen stabilen Zustand erreicht.

Solange die Controller Ihres Clusters laufen, und sinnvolle Veränderungen vornehmen können, ist es egal ob der Gesamtzustand stabil ist oder nicht.

## Design

Als Grundlage seines Designs verwendet Kubernetes viele Controller, die alle einen bestimmten Aspekt des Clusterzustands verwalten. Meistens verwendet eine bestimmte Kontrollschleife (Controller) eine Sorte Ressourcen als seinen Wunschzustand, und hat eine andere Art Ressource, dass sie verwaltet um den Wunschzustand zu erreichen. Zum Beispiel, ein Controller für Jobs überwacht Job Objekte (um neue Arbeit zu finden), und Pod Objekte (um die Arbeit auszuführen, und um zu erkennen wann die Arbeit beendet ist). In diesem Fall erstellt etwas anderes die Jobs, während der Job Controller Pods erstellt.

Es ist sinnvoll einfache Controller zu haben, statt eines monolithischen Satzes Kontrollschleifen, die miteinander verbunden sind. Controller können scheitern, also ist Kubernetes entworfen um das zu erlauben.

{{< note >}}
Es kann mehrere Controller geben, die die gleiche Art Objekte erstellen oder aktualisieren können. Im Hintergrund sorgen Kubernetes Controller dafür, dass sie nur auf die Ressourcen achten, die mit den kontrollierenden Ressourcen verbunden sind.

Man kann zum Beispiel Deployments und Jobs haben; beide erstellen Pods.
Der Job Controller löscht nicht die Pods die Ihr Deployment erstellt hat, weil es Informationen ({{< glossary_tooltip term_id="Label" text="Bezeichnungen" >}}) gibt, die der Controller verwenden kann, um die Pods voneinander zu unterscheiden.
{{< /note >}}

## Wege um Controller auszuführen {#running-controllers}

Kubernetes enthält eingebaute Controller, die innerhalb des {{< glossary_tooltip text="Kube Controller Manager" term_id="kube-controller-manager" >}} laufen. Diese eingebaute Controller liefern wichtige grundsätzliche Verhalten.

Der Deployment Controller und Job Controller sind Beispiele für Controller die Teil von Kubernetes selbst sind ("eingebaute" Controller).
Kubernetes erlaubt die Verwendung von resilienten Control Planes, sodass bei Versagen eines eingebauten Controllers ein anderer Teil des Control Planes die Arbeit übernimmt.

Sie finden auch Controller, die außerhalb des Control Planes laufen, um Kubernetes zu erweitern. Oder, wenn Sie möchten, können Sie auch selbst einen neuen Controller entwickeln.
Sie können Ihren Controller als einen Satz Pods oder außerhalb von Kubernetes laufen lassen. Was am besten passt, hängt davon ab was der jeweilige Controller tut.

## {{% heading "whatsnext" %}}

* Lesen Sie über den [Kubernetes Control Plane](/docs/concepts/overview/components/#control-plane-components)
* Entdecke einige der grundlegenden [Kubernetes Objekte](/docs/concepts/overview/working-with-objects/)
* Lerne mehr über die [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* Wenn Sie ihren eigenen Controller entwickeln wollen, siehe [Kubernetes extension patterns](/docs/concepts/extend-kubernetes/#extension-patterns)
  und das [sample-controller](https://github.com/kubernetes/sample-controller) Repository.


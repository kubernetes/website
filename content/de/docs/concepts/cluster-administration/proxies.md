---
title: Proxies in Kubernetes
content_template: templates/concept
weight: 90
---

{{% capture overview %}}
Auf dieser Seite werden die im Kubernetes verwendeten Proxies erläutert.
{{% /capture %}}

{{% capture body %}}

## Proxies

Es gibt mehrere verschiedene Proxies, die bei der Verwendung von Kubernetes begegnen können:

1.  Der [kubectl Proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - läuft auf dem Desktop eines Benutzers oder in einem Pod
    - Proxies von einer lokalen Host-Adresse zum Kubernetes Apiserver 
    - Client zu Proxy verwendet HTTP
    - Proxy zu apiserver verwendet HTTPS
    - lokalisiert den apiserver
    - fügt Authentifizierungs-Header hinzu

1.  Der [apiserver Proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - ist eine Bastion, die in den Apiserver eingebaut ist
    - verbindet einen Benutzer außerhalb des Clusters mit Cluster IPs, die sonst möglicherweise nicht erreichbar wären
    - läuft im apiserver Prozess
    - Client zu Proxy verwendet HTTPS (oder http, wenn apiserver so konfiguriert ist)
    - Proxy zum Ziel kann HTTP oder HTTPS verwenden, der Proxy wählt dies unter Verwendung der verfügbaren Informationen aus
    - kann verwendet werden, um einen Knoten, Pod oder Service zu erreichen
    - führt einen Lastausgleich durch um einen Service zu erreichen, wenn er verwendet wird

1.  Der [kube Proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - läuft auf jedem Knoten
    - Proxies UDP, TCP und SCTP
    - versteht kein HTTP
    - stellt Lastausgleich zur Verfügung
    - wird nur zum erreichen von Services verwendet

1.  Ein Proxy/Load-balancer vor dem apiserver(s):

    - Existenz und Implementierung variieren von Cluster zu Cluster (z.B. nginx)
    - sitzt zwischen allen Clients und einem oder mehreren apiservern
    - fungiert als Load Balancer, wenn es mehrere apiserver gibt

1. Cloud Load Balancer für externe Services:

    - werden von einigen Cloud Anbietern angeboten (z.B. AWS ELB, Google Cloud Load Balancer)
    - werden automatisch erstellt, wenn der Kubernetes Service den Typ `LoadBalancer` hat
    - unterstützt normalerweiße nur UDP/TCP
    - Die SCTP-Unterstützung hängt von der Load Balancer Implementierung des Cloud Providers ab
    - die Implementierung variiert je nach Cloud Anbieter

Kubernetes  Benutzer müssen sich in der Regel um nichts anderes als die ersten beiden Typen kümmern.  Der Cluster Administrator stellt in der Regel sicher, dass die letztgenannten Typen korrekt eingerichtet sind.

## Anforderung von Umleitungen

Proxies haben die Möglichkeit der Umleitung ersetzt. Umleitungen sind veraltet.

{{% /capture %}}
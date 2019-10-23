---
title: Master-Node Kommunikation
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Dieses Dokument katalogisiert die Kommunikationspfade zwischen dem Master (eigentlich dem Apiserver) und des Kubernetes-Clusters. 
Die Absicht besteht darin, Benutzern die Möglichkeit zu geben, ihre Installation so anzupassen, dass die Netzwerkkonfiguration so abgesichert wird, dass der Cluster in einem nicht vertrauenswürdigen Netzwerk (oder mit vollständig öffentlichen IP-Adressen eines Cloud-Providers) ausgeführt werden kann.

{{% /capture %}}


{{% capture body %}}

## Cluster zum Master

Alle Kommunikationspfade vom Cluster zum Master enden beim Apiserver (keine der anderen Master-Komponenten ist dafür ausgelegt, Remote-Services verfügbar zu machen).
In einem typischen Setup ist der Apiserver so konfiguriert, dass er Remote-Verbindungen an einem sicheren HTTPS-Port (443) mit einer oder mehreren Formen der [Clientauthentifizierung](/docs/reference/access-authn-authz/authentication/) überwacht.
Eine oder mehrere Formene von [Autorisierung](/docs/reference/access-authn-authz/authorization/) sollte aktiviert sein, insbesondere wenn [anonyme Anfragen](/docs/reference/access-authn-authz/authentication/#anonymous-requests) oder [Service Account Tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) aktiviert sind.

Nodes sollten mit dem öffentlichen Stammzertifikat für den Cluster konfigurirert werden, sodass sie eine sichere Verbindung zum Apiserver mit gültigen Client-Anmeldeinformationen herstellen können.
Beispielsweise bei einer gewöhnlichen GKE-Konfiguration enstprechen die dem kubelet zur Verfügung gestellten Client-Anmeldeinformationen eines Client-Zertifikats.
Lesen Sie über [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) zur automatisierten Bereitstellung von kubelet-Client-Zertifikaten.

Pods, die eine Verbindung zum Apiserver herstellen möchten, können dies auf sichere Weise tun, indem sie ein Dienstkonto verwenden, sodass Kubernetes das öffentliche Stammzertifikat und ein gültiges Trägertoken automatisch in den Pod einfügt, wenn er instanziert wird.
Der `kubernetes`-Dienst (in allen Namespaces) ist mit einer virtuellen IP-Adresse konfiguriert, die (über den Kube-Proxy) an den HTTPS-Endpunkt auf dem Apiserver umgeleitet wird.

Die Master-Komponenten kommunizieren auch über den sicheren Port mit dem Cluster-Apiserver.

Der Standardbetriebsmodus für Verbindungen vom Cluster (Knoten und Pods, die auf den Knoten ausgeführt werden) zum Master ist daher standardmäßig gesichert und kann über nicht vertrauenswürdige und/oder öffentliche Netzwerke laufen.

## Master zum Cluster

Es gibt zwei primäre Kommunikationspfade vom Master (Apiserver) zum Cluster.
Der erste ist vom Apiserver bis zum Kubelet-Prozess, der auf jedem Node im Cluster ausgeführt wird. 
Der zweite ist vom Apiserver zu einem beliebigen Node, Pod oder Dienst über die Proxy-Funktionalität des Apiservers.

### Apiserver zum kubelet

Die Verbindungen vom Apiserver zum Kubelet werden verwendet für:

  * Abrufen von Protokollen für Pods.
  * Verbinden (durch kubectl) mit laufenden Pods.
  * Bereitstellung der Portweiterleitungsfunktion des kubelet.

Diese Verbindungen enden am HTTPS-Endpunkt des kubelet.
Standardmäßig überprüft der Apiserver das Serverzertifikat des Kubelet nicht, was die Verbindung von angreifbar für Man-in-the-Middle-Angriffe macht, und ist es ist daher **unsicher** wenn die Verbindungen über nicht vertrauenswürdige und/oder öffentliche Netzwerke laufen.

Um diese Verbindung zu überprüfen, verwenden Sie das Flag `--kubelet-certificate-authority`, um dem Apiserver ein Stammzertifikatbündel bereitzustellen, das zur Überprüfung des Server-Zertifikats des kubelet verwendet wird.

Wenn dies nicht möglich ist, verwenden Sie [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)
zwischen dem Apiserver und kubelet, falls erforderlich, um eine Verbindung über ein nicht vertrauenswürdiges oder öffentliches Netz zu vermeiden.

Ausserdem sollte, [Kubelet Authentifizierung und/oder Autorisierung](/docs/admin/kubelet-authentication-authorization/) sollte aktiviert sein, um die kubelet-API zu sichern.

### Apiserver zu Nodes, Pods und Services

Die Verbindungen vom Apiserver zu einem Node, Pod oder Dienst verwenden standardmäßig einfache HTTP-Verbindungen und werden daher weder authentifiziert noch verschlüsselt.
Sie können über eine sichere HTTPS-Verbindung ausgeführt werden, indem dem Node, dem Pod oder dem Servicenamen in der API-URL "https:" vorangestellt wird. Das vom HTTPS-Endpunkt bereitgestellte Zertifikat wird jedoch nicht überprüft, und es werden keine Clientanmeldeinformationen bereitgestellt. Die Verbindung wird zwar verschlüsselt, garantiert jedoch keine Integrität.
Diese Verbindungen **sind derzeit nicht sicher** innerhalb von nicht vertrauenswürdigen und/oder öffentlichen Netzen.

### SSH Tunnels

Kubernetes unterstützt SSH-Tunnel zum Schutz der Kommunikationspfade von Master -> Cluster.
In dieser Konfiguration initiiert der Apiserver einen SSH-Tunnel zu jedem Nodem im Cluster (Verbindung mit dem SSH-Server, der Port 22 läuft), und leitet den gesamten Datenverkehr für ein kubelet, einen Node, einen Pod oder einen Dienst durch den Tunnel.
Dieser Tunnel stellt sicher, dass der Datenverkehr nicht außerhalb des Netzwerks sichtbar ist, in dem die Knoten ausgeführt werden.

SSH-Tunnel sind derzeit nicht mehr unterstützt. Sie sollten sie also nicht verwenden, es sei denn, Sie wissen, was Sie tun. Ein Ersatz für diesen Kommunikationskanal wird entwickelt.

{{% /capture %}}

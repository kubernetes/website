---
title: Control-Plane-Node Kommunikation
content_type: concept
weight: 20
---

<!-- overview -->

Dieses Dokument katalogisiert die Kommunikationspfade zwischen dem Control Plane (eigentlich dem Apiserver) und des Kubernetes-Clusters.
Die Absicht besteht darin, Benutzern die Möglichkeit zu geben, ihre Installation so anzupassen, dass die Netzwerkkonfiguration so abgesichert wird, dass der Cluster in einem nicht vertrauenswürdigen Netzwerk (oder mit vollständig öffentlichen IP-Adressen eines Cloud-Providers) ausgeführt werden kann.




<!-- body -->

## Cluster zum Control Plane

Alle Kommunikationspfade vom Cluster zum Control Plane enden beim Apiserver (keine der anderen Control-Plane-Komponenten ist dafür ausgelegt, Remote-Services verfügbar zu machen).
In einem typischen Setup ist der Apiserver so konfiguriert, dass er Remote-Verbindungen an einem sicheren HTTPS-Port (443) mit einer oder mehreren Formen der [Clientauthentifizierung](/docs/reference/access-authn-authz/authentication/) überwacht.
Eine oder mehrere Formen von [Autorisierung](/docs/reference/access-authn-authz/authorization/) sollte aktiviert sein, insbesondere wenn [anonyme Anfragen](/docs/reference/access-authn-authz/authentication/#anonymous-requests) oder [Service Account Tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) aktiviert sind.

Knoten sollten mit dem öffentlichen Stammzertifikat für den Cluster konfiguriert werden, sodass sie eine sichere Verbindung zum Apiserver mit gültigen Client-Anmeldeinformationen herstellen können.
Beispielsweise bei einer gewöhnlichen GKE-Konfiguration enstprechen die dem kubelet zur Verfügung gestellten Client-Anmeldeinformationen eines Client-Zertifikats.
Lesen Sie über [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) zur automatisierten Bereitstellung von kubelet-Client-Zertifikaten.

Pods, die eine Verbindung zum Apiserver herstellen möchten, können dies auf sichere Weise tun, indem sie ein Dienstkonto verwenden, sodass Kubernetes das öffentliche Stammzertifikat und ein gültiges Trägertoken automatisch in den Pod einfügt, wenn er instanziiert wird.
Der `kubernetes`-Dienst (in allen Namespaces) ist mit einer virtuellen IP-Adresse konfiguriert, die (über den Kube-Proxy) an den HTTPS-Endpunkt auf dem Apiserver umgeleitet wird.

Die Control-Plane-Komponenten kommunizieren auch über den sicheren Port mit dem Cluster-Apiserver.

Der Standardbetriebsmodus für Verbindungen vom Cluster (Knoten und Pods, die auf den Knoten ausgeführt werden) zum Control Plane ist daher standardmäßig gesichert und kann über nicht vertrauenswürdige und/oder öffentliche Netzwerke laufen.

## Control Plane zum Cluster

Es gibt zwei primäre Kommunikationspfade vom Control Plane (Apiserver) zum Cluster.
Der Erste ist vom Apiserver hin zum Kubelet-Prozess, der auf jedem Knoten im Cluster ausgeführt wird.
Der Zweite ist vom Apiserver zu einem beliebigen Knoten, Pod oder Dienst über die Proxy-Funktionalität des Apiservers.

### Apiserver zum kubelet

Die Verbindungen vom Apiserver zum Kubelet werden verwendet für:

  * Das Abrufen von Protokollen für Pods.
  * Das Verbinden (durch kubectl) mit laufenden Pods.
  * Die Bereitstellung der Portweiterleitungsfunktion des kubelet.

Diese Verbindungen enden am HTTPS-Endpunkt des kubelet.
Standardmäßig überprüft der Apiserver das Serverzertifikat des Kubelets nicht, was die Verbindung angreifbar für Man-in-the-Middle-Angriffe macht. Die Kommunikation ist daher **unsicher**, wenn die Verbindungen über nicht vertrauenswürdige und/oder öffentliche Netzwerke laufen.

Um diese Verbindung zu überprüfen, verwenden Sie das Flag `--kubelet-certificate-authority`, um dem Apiserver ein Stammzertifikatbündel bereitzustellen, das zur Überprüfung des Server-Zertifikats des kubelets verwendet wird.

Wenn dies nicht möglich ist, verwenden Sie [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)
zwischen dem Apiserver und dem kubelet, falls es erforderlich ist eine Verbindung über ein nicht vertrauenswürdiges oder öffentliches Netz zu vermeiden.

Außerdem sollte [Kubelet Authentifizierung und/oder Autorisierung](/docs/admin/kubelet-authentication-authorization/) aktiviert sein, um die kubelet-API abzusichern.

### Apiserver zu Knoten, Pods und Services

Die Verbindungen vom Apiserver zu einem Knoten, Pod oder Dienst verwenden standardmäßig einfache HTTP-Verbindungen und werden daher weder authentifiziert noch verschlüsselt.
Sie können über eine sichere HTTPS-Verbindung ausgeführt werden, indem dem Node, dem Pod oder dem Servicenamen in der API-URL "https:" vorangestellt wird. Das vom HTTPS-Endpunkt bereitgestellte Zertifikat wird jedoch nicht überprüft, und es werden keine Clientanmeldeinformationen bereitgestellt. Die Verbindung wird zwar verschlüsselt, garantiert jedoch keine Integrität.
Diese Verbindungen **sind derzeit nicht sicher** innerhalb von nicht vertrauenswürdigen und/oder öffentlichen Netzen.

### SSH-Tunnel

Kubernetes unterstützt SSH-Tunnel zum Schutz der Control Plane -> Cluster Kommunikationspfade.
In dieser Konfiguration initiiert der Apiserver einen SSH-Tunnel zu jedem Knoten im Cluster (Verbindung mit dem SSH-Server, der mit Port 22 läuft), und leitet den gesamten Datenverkehr für ein kubelet, einen Knoten, einen Pod oder einen Dienst durch den Tunnel.
Dieser Tunnel stellt sicher, dass der Datenverkehr nicht außerhalb des Netzwerks sichtbar ist, in dem die Knoten ausgeführt werden.

SSH-Tunnel werden zur Zeit nicht unterstützt. Sie sollten also nicht verwendet werden, sei denn, man weiß, was man tut. Ein Ersatz für diesen Kommunikationskanal wird entwickelt.



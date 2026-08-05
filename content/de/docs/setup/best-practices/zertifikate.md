---
title: PKI Zertifikate and Anforderungen
reviewers:
- antonengelhardt
content_type: concept
weight: 50
---

<!-- Übersicht -->

Kubernetes benötigt PKI Zertifikate für die Authentifzierung über TLS. 
Falls Sie Kubernetes über [kubeadm](/docs/reference/setup-tools/kubeadm/) installieren,
wurden die benötigten Zertifikate bereits automatisch generiert. 
In jedem Fall können Sie diese auch selbst generieren -- beispielsweise um private Schlüssel 
nicht auf dem API Server zu speichern und somit deren Sicherheit zu erhöhen.
Diese Seite erklärt, welche Zertifikate ein Cluster benötigt. 

<!-- Hauptteil -->

## Wie Zertifikate in Ihrem Cluster verwendet werden

Kubernetes benötigt PKI-Zertifikate für die folgenden Vorgänge:

### Server Zertifikate

* Server Zertifikate für den API Server Endpunkt
* Server Zertifikate für den etcd Server
* [Server Zertifikate](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  für jeden kubelet (every {{< glossary_tooltip text="node" term_id="node" >}} runs a kubelet)
* Optionale Server Zertifikate für den [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Client Zertifikate

* Client-Zertifikate für jedes `Kubelet` zur Authentifizierung gegenüber dem API-Server als Client der Kubernetes API
* Client-Zertifikat für jeden `API-Server` zur Authentifizierung gegenüber etcd
* Client-Zertifikat für den `Controller Manager` zur sicheren Kommunikation mit dem API-Server
* Client-Zertifikat für den `Scheduler` zur sicheren Kommunikation mit dem `API-Server`
* Client-Zertifikate, eines pro Node, für `kube-proxy` zur Authentifizierung gegenüber dem `API-Server`
* Optionale Client-Zertifikate für Administratoren des Clusters zur Authentifizierung gegenüber dem API-Server
* Optionales Client-Zertifikat für den [Front-Proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Server- und Client-Zertifikate des Kubelets

Um eine sichere Verbindung herzustellen und sich gegenüber dem Kubelet zu authentifizieren, benötigt der API-Server ein Client-Zertifikat und ein Schlüsselpaar.

In diesem Szenario gibt es zwei Ansätze für die Verwendung von Zertifikaten:

* Gemeinsame Zertifikate: Der kube-apiserver kann dasselbe Zertifikat und Schlüsselpaar verwenden, das er zur Authentifizierung seiner Clients nutzt. 
Das bedeutet, dass bestehende Zertifikate wie `apiserver.crt` und `apiserver.key` für die Kommunikation mit den Kubelet-Servern verwendet werden können.

* Separate Zertifikate: Alternativ kann der kube-apiserver ein neues Client-Zertifikat und Schlüsselpaar zur Authentifizierung seiner Kommunikation mit den Kubelet-Servern generieren. 
In diesem Fall werden ein separates Zertifikat `kubelet-client.crt` und der dazugehörige private Schlüssel `kubelet-client.key` erstellt.

{{< note >}}
`front-proxy`-Zertifikate werden nur benötigt, wenn kube-proxy zur Unterstützung eines [Erweiterungs-API-Servers](/docs/tasks/extend-kubernetes/setup-extension-api-server/) eingesetzt wird.
{{< /note >}}

Auch etcd verwendet gegenseitiges TLS zur Authentifizierung von Clients und deren Gegenstelle.

## Wo Zertifikate gespeichert werden

Wenn Sie Kubernetes mit kubeadm installieren, werden die meisten Zertifikate im Verzeichnis `/etc/kubernetes/pki` gespeichert. 
Alle Pfade in dieser Dokumentation beziehen sich auf dieses Verzeichnis, 
mit Ausnahme der Benutzerzertifikate, die von kubeadm unter `/etc/kubernetes` ablegt werden.

## Zertifikate manuell konfigurieren

Wenn Sie nicht möchten, dass kubeadm die benötigten Zertifikate generiert, 
können Sie diese entweder mithilfe einer einzelnen Root-CA selbst erstellen 
oder alle Zertifikate vollständig manuell bereitstellen. Details zur Erstellung einer eigenen Zertifizierungsstelle finden Sie unter [Zertifikate](/docs/tasks/administer-cluster/certificates/). 
Weitere Informationen zur Verwaltung von Zertifikaten mit kubeadm bietet [Zertifikatsverwaltung mit kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

### Einzelne Root-CA

Sie können eine einzelne Root-CA erstellen, welche dann mehrere Zwischen-CAs generieren  
und die Erstellung weiterer Zertifikate Kubernetes selbst überlassen kann.

Erforderliche CAs:

| Pfad                   | Standard-CN                | Beschreibung                                |
|------------------------|---------------------------|---------------------------------------------|
| ca.crt,key             | kubernetes-ca             | Allgemeine CA für Kubernetes                |
| etcd/ca.crt,key        | etcd-ca                   | Für alle etcd-bezogenen Funktionen          |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Für den [Front-Proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Zusätzlich zu den oben genannten CAs wird auch ein öffentliches/privates Schlüsselpaar für das Service-Account-Management benötigt: `sa.key` und `sa.pub`.

Das folgende Beispiel zeigt die CA-Schlüssel- und Zertifikatsdateien aus der vorherigen Tabelle:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```


### Alle Zertifikate

Wenn Sie die privaten CA-Schlüssel nicht in Ihren Cluster kopieren möchten, können Sie alle Zertifikate selbst generieren.

Erforderliche Zertifikate:

| Standard-CN                   | Ausstellende CA           | O (im Subject)  | Typ            | Hosts (SAN)                                         |
| ----------------------------- | ------------------------- | --------------- | -------------- | --------------------------------------------------- |
| kube-etcd                     | etcd-ca                   |                 | Server, Client | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                 | Server, Client | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                 | Client         |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                 | Client         |                                                     |
| kube-apiserver                | kubernetes-ca             |                 | Server         | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters  | Client         |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                 | Client         |                                                     |

{{< note >}}
Anstelle der Superuser-Gruppe `system:masters` für `kube-apiserver-kubelet-client` kann auch eine weniger privilegierte Gruppe verwendet werden. kubeadm nutzt hierfür die Gruppe `kubeadm:cluster-admins`.
{{< /note >}}

[^1]: Jede andere IP oder jeder andere DNS-Name, unter dem Sie Ihren Cluster erreichen (wie bei [kubeadm](/docs/reference/setup-tools/kubeadm/) verwendet) – die stabile IP und/oder der DNS-Name des Load-Balancers, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`, `kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`.

Der Wert in der Spalte `Typ` entspricht einer oder mehreren x509-Schlüsselverwendungen, die auch in `.spec.usages` eines [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)-Typs dokumentiert sind:

| Typ     | Schlüsselverwendung                                      |
|---------|----------------------------------------------------------|
| Server  | Digitale Signatur, Schlüsselverschlüsselung, Serverauth.  |
| Client  | Digitale Signatur, Schlüsselverschlüsselung, Clientauth.  |

{{< note >}}
Die oben aufgelisteten Hosts/SANs sind die empfohlenen Werte, um einen funktionsfähigen Cluster zu erhalten. 
Falls Ihr Setup es erfordert, können Sie auf allen Server-Zertifikaten zusätzliche SANs ergänzen.
{{< /note >}}

{{< note >}}
Nur für kubeadm-Benutzer:

* Das Szenario, bei dem Sie CA-Zertifikate ohne private Schlüssel in Ihren Cluster kopieren, wird in der kubeadm-Dokumentation als **externe CA** bezeichnet.
* Wenn Sie die obige Liste mit einer von kubeadm generierten PKI vergleichen, beachten Sie bitte, dass `kube-etcd`, `kube-etcd-peer` und `kube-etcd-healthcheck-client` nicht erzeugt werden, wenn ein externer etcd-Cluster verwendet wird.

{{< /note >}}

### Zertifikatspfade

Zertifikate sollten in einem empfohlenen Pfad abgelegt werden (wie von [kubeadm](/docs/reference/setup-tools/kubeadm/) verwendet). 
Die Pfade sollten mit dem angegebenen Argument festgelegt werden, unabhängig vom Speicherort.

| Standard-CN | Empfohlener Schlüsselpfad | Empfohlener Zertifikatspfad | Befehl | Schlüssel-Argument | Zertifikat-Argument |
| ----------- | ------------------------- | --------------------------- | ------ | ------------------ | ------------------- |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Gleiche Überlegungen gelten für das Service-Account-Schlüsselpaar:

| Pfad privater Schlüssel | Pfad öffentlicher Schlüssel | Befehl                  | Argument                             |
|-------------------------|-----------------------------|-------------------------|--------------------------------------|
|  sa.key                 |                             | kube-controller-manager | --service-account-private-key-file   |
|                         | sa.pub                      | kube-apiserver          | --service-account-key-file           |

Das folgende Beispiel zeigt die Dateipfade [aus den vorherigen Tabellen](#zertifikatspfade), die Sie bereitstellen müssen, wenn Sie alle Schlüssel und Zertifikate selbst generieren:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```


## Zertifikate für Benutzerkonten konfigurieren

Sie müssen diese Administrator- und Servicekonten manuell konfigurieren:

| Dateiname               | Anmeldeinformationen-Name | Standard-CN                          | O (im Subject)         |
|-------------------------|---------------------------|--------------------------------------|------------------------|
| admin.conf              | default-admin             | kubernetes-admin                     | `<admin-group>`        |
| super-admin.conf        | default-super-admin       | kubernetes-super-admin               | system:masters         |
| kubelet.conf            | default-auth              | system:node:`<nodeName>` (siehe Hinweis) | system:nodes           |
| controller-manager.conf | default-controller-manager| system:kube-controller-manager       |                        |
| scheduler.conf          | default-scheduler         | system:kube-scheduler                |                        |

{{< note >}}
Der Wert von `<nodeName>` in `kubelet.conf` **muss** exakt mit dem Node-Namen übereinstimmen, den der kubelet beim Registrieren am apiserver angibt. 
Weitere Details finden Sie unter [Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Im obigen Beispiel ist `<admin-group>` implementierungsspezifisch. Manche Tools signieren das Zertifikat in der Standard-`admin.conf`, sodass es Teil der Gruppe `system:masters` ist. 
`system:masters` ist eine Notfall-Superuser-Gruppe, die die Autorisierungsschicht, wie zum Beispiel RBAC, von Kubernetes umgehen kann. Manche Tools erzeugen auch keine separate `super-admin.conf` mit einem Zertifikat, das an diese Superuser-Gruppe gebunden ist.

kubeadm erstellt zwei separate Administratorzertifikate in kubeconfig-Dateien. Eines ist in `admin.conf` und hat `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. 
`kubeadm:cluster-admins` ist eine benutzerdefinierte Gruppe, die an die ClusterRole `cluster-admin` gebunden ist. Diese Datei wird auf allen von kubeadm verwalteten Control-Plane-Maschinen erstellt.

Das andere ist in `super-admin.conf` und hat `Subject: O = system:masters, CN = kubernetes-super-admin`. 
Diese Datei wird nur auf dem Node erzeugt, auf dem `kubeadm init` ausgeführt wurde.
{{< /note >}}

1. Generieren Sie für jede Konfiguration ein x509-Zertifikat/Schlüsselpaar mit dem angegebenen Common Name (CN) und der Organisation (O).

2. Führen Sie für jede Konfiguration `kubectl` wie folgt aus:

   ```
   KUBECONFIG=<Dateiname> kubectl config set-cluster default-cluster --server=https://<Host-IP>:6443 --certificate-authority <Pfad-zur-kubernetes-ca> --embed-certs
   KUBECONFIG=<Dateiname> kubectl config set-credentials <Anmeldeinfo-Name> --client-key <Pfad-zum-Schlüssel>.pem --client-certificate <Pfad-zum-Zertifikat>.pem --embed-certs
   KUBECONFIG=<Dateiname> kubectl config set-context default-system --cluster default-cluster --user <Anmeldeinfo-Name>
   KUBECONFIG=<Dateiname> kubectl config use-context default-system
   ```

Diese Dateien werden wie folgt verwendet:

| Dateiname               | Befehl                  | Kommentar                                                               |
|-------------------------|-------------------------|-------------------------------------------------------------------------|
| admin.conf              | kubectl                 | Konfiguriert den Administrator-Benutzer für den Cluster                 |
| super-admin.conf        | kubectl                 | Konfiguriert den Super-Administrator-Benutzer für den Cluster           |
| kubelet.conf            | kubelet                 | Wird für jeden Node im Cluster benötigt                                 |
| controller-manager.conf | kube-controller-manager | Muss im Manifest `manifests/kube-controller-manager.yaml` eingetragen werden |
| scheduler.conf          | kube-scheduler          | Muss im Manifest `manifests/kube-scheduler.yaml` eingetragen werden     |

Beispielhafte vollständige Pfade zu den Dateien aus der obigen Tabelle:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```


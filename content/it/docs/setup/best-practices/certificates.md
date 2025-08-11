---
title: Certificati PKI e requisiti
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes richiede certificati PKI per l'autenticazione tramite TLS.
Se installi Kubernetes con [kubeadm](/docs/reference/setup-tools/kubeadm/), i certificati
necessari per il tuo cluster vengono generati automaticamente.
Puoi anche generare i tuoi certificati, ad esempio per mantenere le chiavi private più sicure
senza salvarle sul server API.
Questa pagina spiega quali certificati sono richiesti dal tuo cluster.

<!-- body -->

## Come vengono utilizzati i certificati nel cluster

Kubernetes richiede PKI per le seguenti operazioni:

### Certificati server

* Certificato server per l'endpoint del server API
* Certificato server per il server etcd
* [Certificati server](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  per ogni kubelet (ogni {{< glossary_tooltip text="nodo" term_id="node" >}} esegue un kubelet)
* Certificato server opzionale per il [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificati client

* Certificati client per ogni kubelet, usati per autenticarsi al server API come client
  dell'API Kubernetes
* Certificato client per ogni server API, usato per autenticarsi a etcd
* Certificato client per il controller manager per comunicare in modo sicuro con il server API
* Certificato client per lo scheduler per comunicare in modo sicuro con il server API
* Certificati client, uno per ogni nodo, per kube-proxy per autenticarsi al server API
* Certificati client opzionali per gli amministratori del cluster per autenticarsi al server API
* Certificato client opzionale per il [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificati server e client del kubelet

Per stabilire una connessione sicura e autenticarsi al kubelet, il server API
richiede un certificato client e una coppia di chiavi.

In questo scenario, ci sono due approcci per l'uso dei certificati:

* Certificati condivisi: Il kube-apiserver può utilizzare la stessa coppia di certificato e chiave
  che usa per autenticare i suoi client. Questo significa che i certificati esistenti, come
  `apiserver.crt` e `apiserver.key`, possono essere usati per comunicare con i server kubelet.

* Certificati separati: In alternativa, il kube-apiserver può generare una nuova coppia di certificato
  e chiave client per autenticare la comunicazione con i server kubelet. In questo caso,
  viene creato un certificato distinto chiamato `kubelet-client.crt` e la relativa chiave privata,
  `kubelet-client.key`.

{{< note >}}
I certificati `front-proxy` sono richiesti solo se esegui kube-proxy per supportare
[un extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

Anche etcd implementa il mutual TLS per autenticare client e peer.

## Dove sono conservati i certificati

Se installi Kubernetes con kubeadm, la maggior parte dei certificati viene salvata in `/etc/kubernetes/pki`.
Tutti i percorsi in questa documentazione sono relativi a quella directory, ad eccezione dei certificati
degli account utente che kubeadm posiziona in `/etc/kubernetes`.

## Configurare manualmente i certificati

Se non vuoi che kubeadm generi i certificati richiesti, puoi crearli usando una
CA root singola o fornendo tutti i certificati. Consulta [Certificati](/docs/tasks/administer-cluster/certificates/)
per dettagli sulla creazione di una tua autorità di certificazione. Consulta
[Gestione dei certificati con kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
per maggiori informazioni sulla gestione dei certificati.

### CA root singola

Puoi creare una CA root singola, controllata da un amministratore. Questa CA root può poi creare
più CA intermedie e delegare tutta la creazione successiva a Kubernetes stesso.

CA richieste:

| Percorso                | CN predefinito                | Descrizione                         |
|-------------------------|-------------------------------|-------------------------------------|
| ca.crt,key              | kubernetes-ca                 | CA generale di Kubernetes           |
| etcd/ca.crt,key         | etcd-ca                       | Per tutte le funzioni legate a etcd |
| front-proxy-ca.crt,key  | kubernetes-front-proxy-ca     | Per il [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Oltre alle CA sopra, è anche necessario ottenere una coppia chiave pubblica/privata per la gestione
degli account di servizio, `sa.key` e `sa.pub`.
Il seguente esempio mostra i file di chiave e certificato CA elencati nella tabella precedente:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Tutti i certificati

Se non vuoi copiare le chiavi private della CA nel cluster, puoi generare tu stesso tutti i certificati.

Certificati richiesti:

| CN predefinito                 | CA genitore                | O (nel Subject) | tipo             | hosts (SAN)                                         |
|--------------------------------|----------------------------|-----------------|------------------|-----------------------------------------------------|
| kube-etcd                      | etcd-ca                    |                 | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                 | etcd-ca                    |                 | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client   | etcd-ca                    |                 | client           |                                                     |
| kube-apiserver-etcd-client     | etcd-ca                    |                 | client           |                                                     |
| kube-apiserver                 | kubernetes-ca              |                 | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client  | kubernetes-ca              | system:masters  | client           |                                                     |
| front-proxy-client             | kubernetes-front-proxy-ca  |                 | client           |                                                     |

{{< note >}}
Invece di usare il gruppo super-user `system:masters` per `kube-apiserver-kubelet-client`
può essere usato un gruppo meno privilegiato. kubeadm usa il gruppo `kubeadm:cluster-admins`
per questo scopo.
{{< /note >}}

[^1]: qualsiasi altro IP o nome DNS con cui contatti il cluster (come usato da [kubeadm](/docs/reference/setup-tools/kubeadm/))
l'IP stabile del load balancer e/o il nome DNS, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`

dove `tipo` corrisponde a uno o più degli usi chiave x509, documentati anche in
`.spec.usages` di un tipo [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| tipo   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
Gli host/SAN elencati sopra sono quelli raccomandati per ottenere un cluster funzionante; se richiesto
da una configurazione specifica, è possibile aggiungere SAN aggiuntivi su tutti i certificati server.
{{< /note >}}

{{< note >}}
Solo per utenti kubeadm:

* Lo scenario in cui copi nel cluster i certificati CA senza le chiavi private viene
  chiamato external CA nella documentazione di kubeadm.
* Se stai confrontando la lista sopra con una PKI generata da kubeadm, tieni presente che
  i certificati `kube-etcd`, `kube-etcd-peer` e `kube-etcd-healthcheck-client` non vengono generati
  in caso di etcd esterno.

{{< /note >}}

### Percorsi dei certificati

I certificati dovrebbero essere posizionati in un percorso raccomandato (come usato da [kubeadm](/docs/reference/setup-tools/kubeadm/)).
I percorsi devono essere specificati usando l'argomento indicato indipendentemente dalla posizione.

| DefaultCN | percorso chiave consigliato | percorso cert consigliato | comando | argomento chiave | argomento cert |
| --------- | -------------------------- | ------------------------ | ------- | --------------- | -------------- |
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

Le stesse considerazioni valgono per la coppia di chiavi dell'account di servizio:

| percorso chiave privata | percorso chiave pubblica | comando                 | argomento                             |
|------------------------|--------------------------|-------------------------|---------------------------------------|
|  sa.key                |                          | kube-controller-manager | --service-account-private-key-file    |
|                        | sa.pub                   | kube-apiserver          | --service-account-key-file            |

Il seguente esempio mostra i percorsi dei file [dalle tabelle precedenti](#certificate-paths)
che devi fornire se generi tutte le tue chiavi e certificati:

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

## Configurare i certificati per gli account utente

Devi configurare manualmente questi account amministratore e account di servizio:

| Nome file                | Nome credenziale           | CN predefinito                        | O (nel Subject)        |
|--------------------------|----------------------------|---------------------------------------|------------------------|
| admin.conf               | default-admin              | kubernetes-admin                      | `<admin-group>`        |
| super-admin.conf         | default-super-admin        | kubernetes-super-admin                | system:masters         |
| kubelet.conf             | default-auth               | system:node:`<nodeName>` (vedi nota)  | system:nodes           |
| controller-manager.conf  | default-controller-manager | system:kube-controller-manager        |                        |
| scheduler.conf           | default-scheduler          | system:kube-scheduler                 |                        |

{{< note >}}
Il valore di `<nodeName>` per `kubelet.conf` **deve** corrispondere esattamente al valore del nome nodo
fornito dal kubelet quando si registra con l'apiserver. Per ulteriori dettagli, leggi
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Nell'esempio sopra `<admin-group>` è specifico dell'implementazione. Alcuni strumenti firmano il
certificato in `admin.conf` predefinito per far parte del gruppo `system:masters`.
`system:masters` è un gruppo super user che può bypassare il layer di autorizzazione di Kubernetes,
come RBAC. Inoltre, alcuni strumenti non generano un file `super-admin.conf` separato con un certificato
associato a questo gruppo super user.

kubeadm genera due certificati amministratore separati in file kubeconfig.
Uno è in `admin.conf` e ha `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` è un gruppo personalizzato associato al ClusterRole `cluster-admin`.
Questo file viene generato su tutte le macchine del control plane gestite da kubeadm.

Un altro è in `super-admin.conf` che ha `Subject: O = system:masters, CN = kubernetes-super-admin`.
Questo file viene generato solo sul nodo dove è stato eseguito `kubeadm init`.
{{< /note >}}

1. Per ogni configurazione, genera una coppia certificato/chiave x509 con il
   Common Name (CN) e Organization (O) indicati.

1. Esegui `kubectl` come segue per ogni configurazione:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Questi file vengono utilizzati come segue:

| Nome file                | Comando                  | Commento                                                              |
|--------------------------|--------------------------|-----------------------------------------------------------------------|
| admin.conf               | kubectl                  | Configura l'utente amministratore per il cluster                      |
| super-admin.conf         | kubectl                  | Configura l'utente super amministratore per il cluster                |
| kubelet.conf             | kubelet                  | Uno richiesto per ogni nodo del cluster                               |
| controller-manager.conf  | kube-controller-manager  | Da aggiungere al manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf           | kube-scheduler           | Da aggiungere al manifest in `manifests/kube-scheduler.yaml`          |

I seguenti file illustrano i percorsi completi dei file elencati nella tabella precedente:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```

---
title: Comunicazione Control Plane - Nodo
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

Questo documento cataloga le connessioni tra il piano di controllo (_control-plane_), in realtà l'apiserver, e il cluster Kubernetes. L'intento è di consentire agli utenti di personalizzare la loro installazione per rafforzare la configurazione di rete affinché il cluster possa essere eseguito su una rete pubblica (o su IP completamente pubblici resi disponibili da un fornitore di servizi cloud).


<!-- body -->

## Dal Nodo al control-plane{#dal-nodo-al-control-plane}
Kubernetes adotta un pattern per le API di tipo _"hub-and-spoke"_. Tutte le chiamate delle API eseguite sui vari nodi sono effettuate verso l'apiserver (nessuno degli altri componenti principali è progettato per esporre servizi remoti). L'apiserver è configurato per l'ascolto di connessioni remote su una porta HTTPS protetta (443) con una o più forme di [autenticazioni client](/docs/reference/access-authn-authz/authentication/) abilitate. Si dovrebbero abilitare una o più forme di [autorizzazioni](/docs/reference/access-authn-authz/authorization/), in particolare nel caso in cui siano ammesse [richieste anonime](/docs/reference/access-authn-authz/authentication/#anonymous-requests) o [_token_ legati ad un account di servizio (_service account_)](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

Il certificato pubblico (_public root certificate_) relativo al cluster corrente deve essere fornito ai vari nodi di modo che questi possano connettersi in modo sicuro all'apiserver insieme alle credenziali valide per uno specifico _client_. Ad esempio, nella configurazione predefinita di un cluster [GKE](https://cloud.google.com/kubernetes-engine?hl=it), le credenziali del client fornite al kubelet hanno la forma di un certificato client. Si veda
[inizializzazione TLS del kubelet TLS](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) per la fornitura automatica dei certificati client al _kubelet_.

I Pod che desiderano connettersi all'apiserver possono farlo in modo sicuro sfruttando un account di servizio in modo che Kubernetes inserisca automaticamente il certificato pubblico di radice e un token valido al portatore (_bearer token_) all'interno Pod quando questo viene istanziato.
In tutti i namespace è configurato un _Service_ con nome `kubernetes` con un indirizzo IP virtuale che viene reindirizzato (tramite _kube-proxy_) all'endpoint HTTPS dell'apiserver.

Anche i componenti del piano d controllo comunicano con l'apiserver del cluster su di una porta sicura esposta da quest'ultimo.

Di conseguenza, la modalità operativa predefinita per le connessioni dai nodi e dai Pod in esecuzione sui nodi verso il _control-plane_ è protetta da un'impostazione predefinita
e può essere eseguita su reti non sicure e/o pubbliche.

## Dal control-plane al nodo{#dal-control-plane-al-nodo}

Esistono due percorsi di comunicazione principali dal _control-plane_ (apiserver) verso i nodi. Il primo è dall'apiserver verso il processo _kubelet_ in esecuzione su ogni nodo nel cluster. Il secondo è dall'apiserver a ciascun nodo, Pod, o servizio attraverso la funzionalità proxy dell'apiserver.

### Dall'apiserver al _kubelet_

Le connessioni dall'apiserver al _kubelet_ vengono utilizzate per:

  * Prendere i log relativi ai vari Pod.
  * Collegarsi (attraverso kubectl) ai Pod in esecuzione.
  * Fornire la funzionalità di _port-forwarding_ per i _kubelet_.

Queste connessioni terminano all'endpoint HTTPS del _kubelet_. Di default, l'apiserver non verifica il certificato servito dal _kubelet_, il che rende la connessione soggetta ad attacchi _man-in-the-middle_, e tale  da essere considerato **non sicuro (unsafe)** se eseguito su reti non protette e/o pubbliche.

Per verificare questa connessione, si utilizzi il parametro `--kubelet-certificate-authority` al fine di fornire all'apiserver un insieme di certificati radice da utilizzare per verificare il
il certificato servito dal _kubelet_.

Se questo non è possibile, si usi un [tunnel SSH](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) tra l'apiserver e il _kubelet_, se richiesto, per evitare il collegamento su una rete non protetta o pubblica.

In fine, l'[autenticazione e/o l'autorizzazione del kubelet](/docs/admin/kubelet-authentication-authorization/) dovrebbe essere abilitate per proteggere le API esposte dal _kubelet_.

### Dall'apiserver ai nodi, Pod, e servizi{#dal-apiserver-ai-nodi-pod-servizi}

Le connessioni dall'apiserver verso un nodo, Pod o servizio avvengono in modalità predefinita su semplice connessione HTTP e quindi non sono né autenticate né criptata. Queste connessioni possono essere eseguite su una connessione HTTPS sicura mediante il prefisso `https:` al nodo, Pod o nome del servizio nell'URL dell'API, ma non valideranno il certificato fornito dall'endpoint HTTPS né forniranno le credenziali del client così anche se la connessione verrà criptata, non fornirà alcuna garanzia di integrità. **Non è attualmente sicuro** eseguire queste connessioni  su reti non protette e/o pubbliche.

### I tunnel SSH

Kubernetes supporta i _tunnel_ SSH per proteggere la comunicazione tra il _control-plane_ e i nodi. In questa configurazione, l'apiserver inizializza un tunnel SSH con ciascun nodo del cluster (collegandosi al server SSH in ascolto sulla porta 22) e fa passare tutto il traffico verso il _kubelet_, il nodo, il Pod, o il servizio attraverso questo tunnel. Questo tunnel assicura che il traffico non sia esposto al di fuori della rete su cui sono in esecuzioni i vari nodi.

I tunnel SSH sono al momento deprecati ovvero non dovrebbero essere utilizzati a meno che ci siano delle esigenze particolari. Il servizio `Konnectivity` è pensato per rimpiazzare questo canale di comunicazione.

### Il servizio _Konnectivity_

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Come rimpiazzo dei tunnel SSH, il servizio _Konnectivity_ fornisce un proxy a livello TCP per la comunicazione tra il _control-plane_ e il cluster. Il servizio _Konnectivity_ consiste in due parti: il _Konnectivity_ server e gli agenti _Konnectivity_, in esecuzione rispettivamente sul _control-plane_ e sui vari nodi.  Gli agenti _Konnectivity_ inizializzano le connessioni verso il server _Konnectivity_ e mantengono le connessioni di rete. Una volta abilitato il servizio _Konnectivity_, tutto il traffico tra il _control-plane_ e i nodi passa attraverso queste connessioni.

Si può fare riferimento al [tutorial per il servizio _Konnectivity_](/docs/tasks/extend-kubernetes/setup-konnectivity/) per configurare il servizio _Konnectivity_ all'interno del cluster
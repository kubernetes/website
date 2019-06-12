---
title: Comunicazione Master-Node
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Questo documento cataloga i percorsi di comunicazione tra il master (in realtà il
apiserver) e il cluster Kubernetes. L'intento è di consentire agli utenti di
personalizzare la loro installazione per rafforzare la configurazione di rete in questo modo
il cluster può essere eseguito su una rete non affidabile (o su IP completamente pubblici su a
fornitore di servizi cloud).

{{% /capture %}}


{{% capture body %}}

## Cluster to Master

Tutti i percorsi di comunicazione dal cluster al master terminano in
apiserver (nessuno degli altri componenti principali è progettato per esporre il telecomando
Servizi). In una distribuzione tipica, l'apiserver è configurato per l'ascolto
connessioni remote su una porta HTTPS protetta (443) con una o più forme di
client [authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/)
dovrebbe essere abilitato, specialmente se [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
o [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
sono ammessi.

I nodi devono essere forniti con il certificato di root pubblico per il cluster
in modo tale che possano connettersi in modo sicuro all'apiserver insieme al client valido
credenziali. Ad esempio, in una distribuzione GKE predefinita, le credenziali del client
fornito al kubelet hanno la forma di un certificato client. Vedere
[kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
per il provisioning automatico dei certificati client kubelet.

I pod che desiderano connettersi all'apiserver possono farlo in modo sicuro sfruttando a
account di servizio in modo che Kubernetes inserisca automaticamente la radice pubblica
certificato e un token al portatore valido nel pod quando viene istanziato.
Il servizio `kubernetes` (in tutti gli spazi dei nomi) è configurato con un IP virtuale
indirizzo che viene reindirizzato (tramite kube-proxy) all'endpoint HTTPS sul
apiserver.

I componenti master comunicano anche con l'apiserver del cluster sulla porta sicura.

Di conseguenza, la modalità operativa predefinita per le connessioni dal cluster
(nodi e pod in esecuzione sui nodi) sul master è protetto per impostazione predefinita
e può funzionare su reti non sicure e / o pubbliche.

## Master to Cluster

Esistono due percorsi di comunicazione principali dal master (apiserver) al
grappolo. Il primo è dal processo apiserver al processo kubelet su cui gira
ogni nodo nel cluster. Il secondo è dall'Apiserver a qualsiasi nodo, pod,
o servizio attraverso la funzionalità proxy dell'apiserver.

### apiserver to kubelet

Le connessioni dall'apiserver al kubelet vengono utilizzate per:

  * Recupero dei log per i pod.
  * Allegare (tramite kubectl) ai pod in esecuzione.
  * Fornire la funzionalità di port forwarding di kubelet.

Queste connessioni terminano all'endpoint HTTPS di kubelet. Di default,
l'apiserver non verifica il certificato di servizio di Kubelet,
che rende la connessione soggetta ad attacchi man-in-the-middle, e
** non sicuro ** da eseguire su reti non sicure e / o pubbliche.

Per verificare questa connessione, utilizzare il flag `--kubelet-certificate-authority` su
fornire all'apiserver un pacchetto di certificati radice da utilizzare per verificare il
il certificato di servizio di kubelet.

Se questo non è possibile, usa [SSH tunneling](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
btra l'apiserver e il kubelet se richiesto per evitare il collegamento su un
rete non attendibile o pubblica.

Finalmente, [Kubelet authentication and/or authorization](/docs/admin/kubelet-authentication-authorization/)
dovrebbe essere abilitato per proteggere l'API kubelet.

### apiserver to nodes, pods, and services

Le connessioni dall'apiserver a un nodo, pod o servizio predefinito su semplice
Connessioni HTTP e quindi non sono né autenticate né crittografate. Essi
può essere eseguito su una connessione HTTPS sicura mediante il prefisso `https:` al nodo,
pod o nome del servizio nell'URL dell'API, ma non convalideranno il certificato
fornito dall'endpoint HTTPS né fornire le credenziali del client così mentre il file
la connessione verrà crittografata, non fornirà alcuna garanzia di integrità.
Queste connessioni ** non sono attualmente al sicuro ** da eseguire su non attendibili e / o
reti pubbliche.

{{% /capture %}}

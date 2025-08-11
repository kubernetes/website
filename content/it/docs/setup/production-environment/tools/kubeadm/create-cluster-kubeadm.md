---
title: Creare un cluster con kubeadm
content_type: task
weight: 30
---

<!-- panoramica -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Usando `kubeadm`, puoi creare un cluster Kubernetes minimo conforme alle best practice.
Infatti, puoi utilizzare `kubeadm` per configurare un cluster che supererà i
[test di conformità Kubernetes](/blog/2017/10/software-conformance-certification/).
`kubeadm` supporta anche altre funzioni del ciclo di vita del cluster, come
[token di bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/) e aggiornamenti del cluster.

Lo strumento `kubeadm` è utile se hai bisogno di:

- Un modo semplice per provare Kubernetes, magari per la prima volta.
- Un modo per automatizzare la configurazione di un cluster e testare la tua applicazione.
- Un componente di base per altri strumenti dell’ecosistema o installer con uno scopo più ampio.

Puoi installare e utilizzare `kubeadm` su diverse macchine: il tuo laptop, un set
di server cloud, un Raspberry Pi e altro ancora. Che tu stia distribuendo nel
cloud o on-premises, puoi integrare `kubeadm` in sistemi di provisioning come
Ansible o Terraform.

## {{% heading "prerequisites" %}}

Per seguire questa guida, hai bisogno di:

- Una o più macchine con un sistema operativo Linux compatibile con deb/rpm; ad esempio: Ubuntu o CentOS.
- 2 GiB o più di RAM per macchina: meno lascia poco spazio per le tue app.
- Almeno 2 CPU sulla macchina che utilizzi come nodo di controllo (control-plane).
- Connettività di rete completa tra tutte le macchine del cluster. Puoi usare una rete pubblica o privata.

Devi anche utilizzare una versione di `kubeadm` che possa distribuire la versione
di Kubernetes che desideri utilizzare nel nuovo cluster.

[La policy di supporto delle versioni e degli skew di Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions)
si applica sia a `kubeadm` che a Kubernetes in generale.
Controlla questa policy per sapere quali versioni di Kubernetes e `kubeadm`
sono supportate. Questa pagina è scritta per Kubernetes {{< param "version" >}}.

Lo stato generale delle funzionalità di `kubeadm` è General Availability (GA). Alcune sotto-funzionalità sono
ancora in sviluppo attivo. L’implementazione della creazione del cluster può cambiare
leggermente man mano che lo strumento evolve, ma l’implementazione generale dovrebbe essere abbastanza stabile.

{{< note >}}
Tutti i comandi sotto `kubeadm alpha` sono, per definizione, supportati a livello alpha.
{{< /note >}}

<!-- passaggi -->

## Obiettivi

* Installare un cluster Kubernetes con un solo nodo di controllo (control-plane)
* Installare una rete Pod nel cluster in modo che i tuoi Pod possano
  comunicare tra loro

## Istruzioni

### Preparazione degli host

#### Installazione dei componenti

Installa un {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}
e kubeadm su tutti gli host. Per istruzioni dettagliate e altri prerequisiti, vedi
[Installare kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Se hai già installato kubeadm, consulta i primi due passaggi del documento
[Aggiornare i nodi Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)
per istruzioni su come aggiornare kubeadm.

Durante l’aggiornamento, kubelet si riavvia ogni pochi secondi mentre attende in crashloop che
kubeadm gli dica cosa fare. Questo crashloop è previsto e normale.
Dopo aver inizializzato il control-plane, kubelet funzionerà normalmente.
{{< /note >}}

#### Configurazione della rete

kubeadm, come altri componenti Kubernetes, cerca di trovare un IP utilizzabile sulle
interfacce di rete associate a un gateway predefinito sull’host. Tale
IP viene poi usato per l’advertising e/o l’ascolto da parte di un componente.

Per scoprire quale sia questo IP su un host Linux puoi usare:

```shell
ip route show # Cerca una riga che inizia con "default via"
```

{{< note >}}
Se sono presenti due o più gateway predefiniti sull’host, un componente Kubernetes cercherà
di usare il primo che trova con un indirizzo IP unicast globale adatto.
Durante questa scelta, l’ordinamento esatto dei gateway può variare tra diversi
sistemi operativi e versioni del kernel.
{{< /note >}}

I componenti Kubernetes non accettano un’interfaccia di rete personalizzata come opzione,
quindi un indirizzo IP personalizzato deve essere passato come flag a tutte le istanze dei componenti
che necessitano di tale configurazione.

{{< note >}}
Se l’host non ha un gateway predefinito e se non viene passato un indirizzo IP personalizzato
a un componente Kubernetes, il componente potrebbe terminare con un errore.
{{< /note >}}

Per configurare l’indirizzo di advertising dell’API server per i nodi control-plane creati sia con
`init` che con `join`, puoi usare il flag `--apiserver-advertise-address`.
Preferibilmente, questa opzione può essere impostata nell’[API di kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4)
come `InitConfiguration.localAPIEndpoint` e `JoinConfiguration.controlPlane.localAPIEndpoint`.

Per i kubelet su tutti i nodi, l’opzione `--node-ip` può essere passata in
`.nodeRegistration.kubeletExtraArgs` all’interno di un file di configurazione kubeadm
(`InitConfiguration` o `JoinConfiguration`).

Per dual-stack vedi
[Supporto dual-stack con kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

Gli indirizzi IP assegnati ai componenti del control-plane diventano parte dei campi subject alternative name dei loro certificati X.509.
Cambiare questi indirizzi IP richiederebbe
la firma di nuovi certificati e il riavvio dei componenti interessati, in modo che la modifica nei
file di certificato sia riflessa. Vedi
[Rinnovo manuale dei certificati](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
per maggiori dettagli su questo argomento.

{{< warning >}}
Il progetto Kubernetes sconsiglia questo approccio (configurare tutte le istanze dei componenti
con indirizzi IP personalizzati). Invece, i manutentori Kubernetes raccomandano di configurare la rete dell’host,
in modo che l’IP del gateway predefinito sia quello che i componenti Kubernetes auto-rilevano e usano.
Sui nodi Linux, puoi usare comandi come `ip route` per configurare la rete; il tuo sistema operativo
potrebbe anche fornire strumenti di gestione della rete di livello superiore. Se il gateway predefinito del nodo
è un indirizzo IP pubblico, dovresti configurare filtri di pacchetti o altre misure di sicurezza che
proteggano i nodi e il tuo cluster.
{{< /warning >}}

### Preparazione delle immagini container richieste

Questo passaggio è opzionale e si applica solo se desideri che `kubeadm init` e `kubeadm join`
non scarichino le immagini container predefinite ospitate su `registry.k8s.io`.

Kubeadm dispone di comandi che possono aiutarti a pre-scaricare le immagini richieste
quando crei un cluster senza connessione Internet sui nodi.
Vedi [Eseguire kubeadm senza connessione Internet](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
per maggiori dettagli.

Kubeadm ti permette di usare un repository di immagini personalizzato per le immagini richieste.
Vedi [Utilizzare immagini personalizzate](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
per maggiori dettagli.

### Inizializzazione del nodo control-plane

Il nodo control-plane è la macchina su cui vengono eseguiti i componenti del control-plane, inclusi
{{< glossary_tooltip term_id="etcd" >}} (il database del cluster) e il
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(con cui lo strumento da linea di comando {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
comunica).

1. (Consigliato) Se prevedi di aggiornare questo cluster `kubeadm` con un solo control-plane
   a [alta disponibilità](/docs/setup/production-environment/tools/kubeadm/high-availability/)
   dovresti specificare `--control-plane-endpoint` per impostare l’endpoint condiviso per tutti i nodi control-plane.
   Tale endpoint può essere un nome DNS o un indirizzo IP di un load-balancer.
1. Scegli un add-on di rete Pod e verifica se richiede argomenti da
   passare a `kubeadm init`. A seconda del provider
   di terze parti scelto, potresti dover impostare `--pod-network-cidr` su
   un valore specifico del provider. Vedi [Installare un add-on di rete Pod](#pod-network).
1. (Opzionale) `kubeadm` cerca di rilevare il container runtime usando una lista di endpoint noti.
   Per usare un container runtime diverso o se ne hai più di uno installato
   sul nodo, specifica l’argomento `--cri-socket` a `kubeadm`. Vedi
   [Installare un runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Per inizializzare il nodo control-plane esegui:

```bash
kubeadm init <args>
```

### Considerazioni su apiserver-advertise-address e ControlPlaneEndpoint

Mentre `--apiserver-advertise-address` può essere usato per impostare l’indirizzo pubblicizzato per l’API server
di questo nodo control-plane, `--control-plane-endpoint` può essere usato per impostare l’endpoint condiviso
per tutti i nodi control-plane.

`--control-plane-endpoint` accetta sia indirizzi IP che nomi DNS che possono essere associati a indirizzi IP.
Contatta il tuo amministratore di rete per valutare possibili soluzioni rispetto a tale associazione.

Esempio di associazione:

```
192.168.0.102 cluster-endpoint
```

Dove `192.168.0.102` è l’indirizzo IP di questo nodo e `cluster-endpoint` è un nome DNS personalizzato che punta a questo IP.
Questo ti permetterà di passare `--control-plane-endpoint=cluster-endpoint` a `kubeadm init` e lo stesso nome DNS a
`kubeadm join`. Successivamente potrai modificare `cluster-endpoint` per puntare all’indirizzo del load-balancer in uno
scenario ad alta disponibilità.

Convertire un cluster con un solo control-plane creato senza `--control-plane-endpoint` in un cluster ad alta disponibilità
non è supportato da kubeadm.

### Ulteriori informazioni

Per maggiori informazioni sugli argomenti di `kubeadm init`, vedi la [guida di riferimento di kubeadm](/docs/reference/setup-tools/kubeadm/).

Per configurare `kubeadm init` con un file di configurazione vedi
[Utilizzare kubeadm init con un file di configurazione](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Per personalizzare i componenti del control-plane, inclusa l’assegnazione opzionale di IPv6 alle liveness probe
per i componenti del control-plane e il server etcd, fornisci argomenti extra a ciascun componente come documentato in
[argomenti personalizzati](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Per riconfigurare un cluster già creato vedi
[Riconfigurare un cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Per eseguire nuovamente `kubeadm init`, devi prima [smantellare il cluster](#tear-down).

Se aggiungi un nodo con un’architettura diversa al cluster, assicurati che i DaemonSet distribuiti
abbiano immagini container compatibili con questa architettura.

`kubeadm init` esegue prima una serie di precheck per assicurarsi che la macchina
sia pronta per eseguire Kubernetes. Questi precheck mostrano avvisi ed escono in caso di errori. `kubeadm init`
quindi scarica e installa i componenti del control-plane del cluster. Questo può richiedere alcuni minuti.
Al termine dovresti vedere:

```none
Il tuo control-plane Kubernetes è stato inizializzato con successo!

Per iniziare a usare il tuo cluster, devi eseguire quanto segue come utente normale:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Ora dovresti distribuire una rete Pod nel cluster.
Esegui "kubectl apply -f [podnetwork].yaml" con una delle opzioni elencate su:
  /docs/concepts/cluster-administration/addons/

Ora puoi aggiungere qualsiasi numero di macchine eseguendo il seguente comando su ciascun nodo
come root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Per far funzionare kubectl per il tuo utente non-root, esegui questi comandi, che sono
anche parte dell’output di `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

In alternativa, se sei l’utente `root`, puoi eseguire:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Il file kubeconfig `admin.conf` generato da `kubeadm init` contiene un certificato con
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Il gruppo `kubeadm:cluster-admins`
è associato al ClusterRole integrato `cluster-admin`.
Non condividere il file `admin.conf` con nessuno.

`kubeadm init` genera un altro file kubeconfig `super-admin.conf` che contiene un certificato con
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` è un gruppo superuser di emergenza che bypassa il layer di autorizzazione (ad esempio RBAC).
Non condividere il file `super-admin.conf` con nessuno. Si consiglia di spostare il file in una posizione sicura.

Vedi
[Generare file kubeconfig per utenti aggiuntivi](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
per sapere come usare `kubeadm kubeconfig user` per generare file kubeconfig per utenti aggiuntivi.
{{< /warning >}}

Prendi nota del comando `kubeadm join` che `kubeadm init` restituisce. Ti
servirà per [aggiungere nodi al cluster](#join-nodes).

Il token viene utilizzato per l’autenticazione reciproca tra il nodo control-plane e i nodi che si uniscono.
Il token incluso qui è segreto. Conservalo con cura, perché chiunque abbia questo
token può aggiungere nodi autenticati al cluster. Questi token possono essere elencati,
creati e cancellati con il comando `kubeadm token`. Vedi la
[guida di riferimento di kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Installare un add-on di rete Pod {#pod-network}

{{< caution >}}
Questa sezione contiene informazioni importanti sulla configurazione della rete e
sull’ordine di distribuzione.
Leggi attentamente tutti questi consigli prima di procedere.

**Devi distribuire un
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) basato su add-on di rete Pod affinché i tuoi Pod possano comunicare tra loro.
Cluster DNS (CoreDNS) non si avvierà prima che una rete sia installata.**

- Fai attenzione che la tua rete Pod non si sovrapponga a nessuna delle reti host:
  potresti avere problemi in caso di sovrapposizione.
  (Se trovi una collisione tra la rete preferita del tuo plugin di rete Pod
  e alcune delle reti host, scegli un CIDR adatto da usare durante `kubeadm init` con
  `--pod-network-cidr` e come sostituto nello YAML del plugin di rete).

- Per impostazione predefinita, `kubeadm` configura il cluster per usare e imporre l’uso di
  [RBAC](/docs/reference/access-authn-authz/rbac/) (controllo degli accessi basato sui ruoli).
  Assicurati che il tuo plugin di rete Pod supporti RBAC, così come i manifest che usi per distribuirlo.

- Se vuoi usare IPv6 (dual-stack o solo IPv6)
  per il tuo cluster, assicurati che il plugin di rete Pod
  supporti IPv6.
  Il supporto IPv6 è stato aggiunto a CNI nella [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Kubeadm dovrebbe essere agnostico rispetto al CNI e la validazione dei provider CNI non rientra nell’ambito dei nostri attuali test e2e.
Se trovi un problema relativo a un plugin CNI, dovresti aprire un ticket nel rispettivo issue tracker
invece che in quelli di kubeadm o kubernetes.
{{< /note >}}

Diversi progetti esterni forniscono reti Pod Kubernetes usando CNI, alcuni dei quali supportano anche
[Network Policy](/docs/concepts/services-networking/network-policies/).

Consulta un elenco di add-on che implementano il
[modello di networking Kubernetes](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

Consulta la pagina [Installare Addons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
per un elenco non esaustivo di addon di rete supportati da Kubernetes.
Puoi installare un add-on di rete Pod con il seguente comando sul nodo control-plane o su un nodo che abbia le credenziali kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Solo pochi plugin CNI supportano Windows. Maggiori dettagli e istruzioni di configurazione sono disponibili in
[Aggiungere nodi worker Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

Puoi installare solo una rete Pod per cluster.

Una volta installata una rete Pod, puoi confermare che funziona controllando che il Pod CoreDNS sia in stato `Running` nell’output di `kubectl get pods --all-namespaces`.
E una volta che il Pod CoreDNS è attivo e funzionante, puoi continuare aggiungendo i tuoi nodi.

Se la rete non funziona o CoreDNS non è in stato `Running`, consulta la
[guida alla risoluzione dei problemi](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
per `kubeadm`.

### Etichette gestite sui nodi

Per impostazione predefinita, kubeadm abilita l’admission controller [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
che limita quali etichette possono essere auto-applicate dai kubelet durante la registrazione del nodo.
La documentazione dell’admission controller copre quali etichette sono consentite con l’opzione kubelet `--node-labels`.
L’etichetta `node-role.kubernetes.io/control-plane` è una di queste etichette ristrette e kubeadm la applica manualmente usando
un client privilegiato dopo che il nodo è stato creato. Per farlo manualmente puoi usare `kubectl label`
e assicurarti di usare un kubeconfig privilegiato come `/etc/kubernetes/admin.conf` gestito da kubeadm.

### Isolamento del nodo control-plane

Per impostazione predefinita, il cluster non pianifica Pod sui nodi control-plane per motivi di sicurezza.
Se vuoi poter pianificare Pod anche sui nodi control-plane,
ad esempio per un cluster Kubernetes su una sola macchina, esegui:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

L’output sarà simile a:

```
node "test-01" untainted
...
```

Questo rimuoverà la taint `node-role.kubernetes.io/control-plane:NoSchedule`
da tutti i nodi che la hanno, inclusi i nodi control-plane, consentendo al
scheduler di pianificare Pod ovunque.

Inoltre, puoi eseguire il seguente comando per rimuovere l’etichetta
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)
dal nodo control-plane, che lo esclude dall’elenco dei backend server:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Aggiungere altri nodi control-plane

Consulta [Creare cluster ad alta disponibilità con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
per i passaggi su come creare un cluster kubeadm ad alta disponibilità aggiungendo altri nodi control-plane.

### Aggiungere nodi worker {#join-nodes}

I nodi worker sono dove vengono eseguiti i tuoi workload.

Le seguenti pagine mostrano come aggiungere nodi worker Linux e Windows al cluster usando
il comando `kubeadm join`:

* [Aggiungere nodi worker Linux](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Aggiungere nodi worker Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Opzionale) Controllare il cluster da macchine diverse dal nodo control-plane

Per far sì che un kubectl su un altro computer (ad esempio un laptop) possa parlare con il tuo
cluster, devi copiare il file kubeconfig amministratore dal nodo control-plane
alla tua workstation così:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
L’esempio sopra presume che l’accesso SSH sia abilitato per root. Se non lo è,
puoi copiare il file `admin.conf` in modo che sia accessibile da un altro utente
e usare `scp` con quell’utente.

Il file `admin.conf` dà all’utente privilegi _superuser_ sul cluster.
Questo file dovrebbe essere usato con parsimonia. Per gli utenti normali, è consigliato
generare una credenziale unica a cui concedere privilegi. Puoi farlo con il comando
`kubeadm kubeconfig user --client-name <CN>`.
Quel comando stamperà un file KubeConfig su STDOUT che dovresti salvare su file e distribuire all’utente. Dopo, concedi
i privilegi usando `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Opzionale) Proxy dell’API Server su localhost

Se vuoi connetterti all’API Server dall’esterno del cluster, puoi usare
`kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Ora puoi accedere all’API Server localmente su `http://localhost:8001/api/v1`

## Pulizia {#tear-down}

Se hai usato server usa e getta per il cluster, per test, puoi
spegnere quelli e non fare altro. Puoi usare
`kubectl config delete-cluster` per eliminare i riferimenti locali al
cluster.

Tuttavia, se vuoi deprovisionare il cluster in modo più pulito, dovresti
prima [drainare il nodo](/docs/reference/generated/kubectl/kubectl-commands#drain)
e assicurarti che il nodo sia vuoto, poi deconfigurare il nodo.

### Rimuovere il nodo

Collegandoti al nodo control-plane con le credenziali appropriate, esegui:

```bash
kubectl drain <nome-nodo> --delete-emptydir-data --force --ignore-daemonsets
```

Prima di rimuovere il nodo, reimposta lo stato installato da `kubeadm`:

```bash
kubeadm reset
```

Il processo di reset non reimposta o pulisce le regole iptables o le tabelle IPVS.
Se vuoi resettare iptables, devi farlo manualmente:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Se vuoi resettare le tabelle IPVS, esegui il seguente comando:

```bash
ipvsadm -C
```

Ora rimuovi il nodo:

```bash
kubectl delete node <nome-nodo>
```

Se vuoi ricominciare, esegui `kubeadm init` o `kubeadm join` con gli
argomenti appropriati.

### Pulizia del control-plane

Puoi usare `kubeadm reset` sull’host control-plane per avviare una pulizia best-effort.

Consulta la documentazione di riferimento [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
per maggiori informazioni su questo subcomando e le sue opzioni.

## Policy di version skew {#version-skew-policy}

Sebbene kubeadm consenta uno skew di versione rispetto ad alcuni componenti che gestisce, si raccomanda di
allineare la versione di kubeadm con le versioni dei componenti del control-plane, kube-proxy e kubelet.

### Skew di kubeadm rispetto alla versione di Kubernetes

kubeadm può essere usato con componenti Kubernetes della stessa versione di kubeadm
o di una versione precedente. La versione di Kubernetes può essere specificata a kubeadm usando il
flag `--kubernetes-version` di `kubeadm init` o il campo
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
quando si usa `--config`. Questa opzione controllerà le versioni
di kube-apiserver, kube-controller-manager, kube-scheduler e kube-proxy.

Esempio:

* kubeadm è alla versione {{< skew currentVersion >}}
* `kubernetesVersion` deve essere {{< skew currentVersion >}} o {{< skew currentVersionAddMinor -1 >}}

### Skew di kubeadm rispetto a kubelet

Analogamente alla versione di Kubernetes, kubeadm può essere usato con una versione di kubelet che sia
la stessa di kubeadm o fino a tre versioni precedenti.

Esempio:

* kubeadm è alla versione {{< skew currentVersion >}}
* kubelet sull’host deve essere alla versione {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} o {{< skew currentVersionAddMinor -3 >}}

### Skew di kubeadm rispetto a kubeadm

Ci sono alcune limitazioni su come i comandi kubeadm possono operare su nodi esistenti o interi cluster
gestiti da kubeadm.

Se nuovi nodi vengono aggiunti al cluster, il binario kubeadm usato per `kubeadm join` deve corrispondere
all’ultima versione di kubeadm usata per creare il cluster con `kubeadm init` o per aggiornare
lo stesso nodo con `kubeadm upgrade`. Regole simili si applicano al resto dei comandi kubeadm
ad eccezione di `kubeadm upgrade`.

Esempio per `kubeadm join`:

* kubeadm versione {{< skew currentVersion >}} è stato usato per creare un cluster con `kubeadm init`
* I nodi che si uniscono devono usare un binario kubeadm alla versione {{< skew currentVersion >}}

I nodi che vengono aggiornati devono usare una versione di kubeadm che sia la stessa versione MINOR
o una versione MINOR successiva rispetto a quella usata per gestire il nodo.

Esempio per `kubeadm upgrade`:

* kubeadm versione {{< skew currentVersionAddMinor -1 >}} è stato usato per creare o aggiornare il nodo
* La versione di kubeadm usata per aggiornare il nodo deve essere {{< skew currentVersionAddMinor -1 >}}
  o {{< skew currentVersion >}}

Per saperne di più sullo skew di versione tra i diversi componenti Kubernetes vedi
la [Version Skew Policy](/releases/version-skew-policy/).

## Limitazioni {#limitations}

### Resilienza del cluster {#resilience}

Il cluster creato qui ha un solo nodo control-plane, con un solo database etcd
in esecuzione su di esso. Questo significa che se il nodo control-plane fallisce, il cluster potrebbe perdere
dati e potrebbe essere necessario ricrearlo da zero.

Soluzioni alternative:

* Esegui regolarmente il [backup di etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). La
  directory dati di etcd configurata da kubeadm è `/var/lib/etcd` sul nodo control-plane.

* Usa più nodi control-plane. Puoi leggere
  [Opzioni per una topologia ad alta disponibilità](/docs/setup/production-environment/tools/kubeadm/ha-topology/) per scegliere una topologia di cluster
  che fornisca [alta disponibilità](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Compatibilità della piattaforma {#multi-platform}

I pacchetti deb/rpm e i binari di kubeadm sono costruiti per amd64, arm (32-bit), arm64, ppc64le e s390x
seguendo la [proposta multi-piattaforma](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Le immagini container multiplatform per il control-plane e gli addon sono supportate dalla v1.12.

Solo alcuni provider di rete offrono soluzioni per tutte le piattaforme. Consulta l’elenco dei
provider di rete sopra o la documentazione di ciascun provider per verificare se il provider
supporta la piattaforma scelta.

## Risoluzione dei problemi {#troubleshooting}

Se riscontri difficoltà con kubeadm, consulta la nostra
[documentazione di troubleshooting](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

<!-- discussione -->

## {{% heading "whatsnext" %}}

* Verifica che il tuo cluster funzioni correttamente con [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />Consulta [Aggiornare i cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  per dettagli su come aggiornare il cluster usando `kubeadm`.
* Scopri l’uso avanzato di `kubeadm` nella [documentazione di riferimento di kubeadm](/docs/reference/setup-tools/kubeadm/)
* Approfondisci i [concetti](/docs/concepts/) di Kubernetes e [`kubectl`](/docs/reference/kubectl/).
* Consulta la pagina [Cluster Networking](/docs/concepts/cluster-administration/networking/) per un elenco più ampio
  di add-on di rete Pod.
* <a id="other-addons" />Consulta l’[elenco degli add-on](/docs/concepts/cluster-administration/addons/) per
  esplorare altri add-on, inclusi strumenti per logging, monitoraggio, network policy, visualizzazione e
  controllo del tuo cluster Kubernetes.
* Configura come il cluster gestisce i log degli eventi di cluster e delle applicazioni in esecuzione nei Pod.
  Consulta [Logging Architecture](/docs/concepts/cluster-administration/logging/) per
  una panoramica di ciò che è coinvolto.

### Feedback {#feedback}

* Per bug, visita il [tracker delle issue di kubeadm su GitHub](https://github.com/kubernetes/kubeadm/issues)
* Per supporto, visita il canale Slack
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* Canale Slack generale di sviluppo SIG Cluster Lifecycle:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* [Informazioni SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* Mailing list SIG Cluster Lifecycle:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)


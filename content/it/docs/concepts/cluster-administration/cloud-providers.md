---
draft: True
title: Cloud Providers
content_type: concept
weight: 30
---

<!-- overview -->
Questa pagina spiega come gestire Kubernetes in esecuzione su uno specifico
fornitore di servizi cloud.



<!-- body -->

### kubeadm
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) è un'opzione popolare per la creazione di cluster di kuberneti.
kubeadm ha opzioni di configurazione per specificare le informazioni di configurazione per i provider cloud. Ad esempio
un tipico il provider cloud in-tree può essere configurato utilizzando kubeadm come mostrato di seguito:

```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
---
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
controllerManager:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
```

I provider cloud in-tree in genere richiedono sia `--cloud-provider` e `--cloud-config` specificati nelle righe di
comando per [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/)
e il [Kubelet](/docs/admin/kubelet/). Anche il contenuto del file specificato in `--cloud-config` per ciascun provider
è documentato di seguito.

Per tutti i fornitori di servizi cloud esterni, seguire le istruzioni sui singoli repository.

## AWS
Questa sezione descrive tutte le possibili configurazioni che possono essere utilizzato durante l'esecuzione di
Kubernetes su Amazon Web Services.

### Node Name
Il provider cloud AWS utilizza il nome DNS privato dell'istanza AWS come nome dell'oggetto Nodo Kubernetes.

### Load Balancers
È possibile impostare [bilanciamento del carico esterno](/docs/tasks/access-application-cluster/create-external-load-balancer/)
per utilizzare funzionalità specifiche in AWS configurando le annotazioni come mostrato di seguito.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #replace this value
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```
È possibile applicare impostazioni diverse a un servizio di bilanciamento del carico in AWS utilizzando _annotations_. Quanto segue descrive le annotazioni supportate su ELB AWS:

* `service.beta.kubernetes.io / aws-load-balancer-access-log-emit-interval`: utilizzato per specificare l'intervallo di emissione del registro di accesso.
* `service.beta.kubernetes.io / aws-load-balancer-access-log-enabled`: utilizzato sul servizio per abilitare o disabilitare i log di accesso.
* `service.beta.kubernetes.io / aws-load-balancer-access-log-s3-bucket-name`: usato per specificare il nome del bucket di log degli accessi s3.
* `service.beta.kubernetes.io / aws-load-balancer-access-log-s3-bucket-prefix`: utilizzato per specificare il prefisso del bucket del registro di accesso s3.
* `service.beta.kubernetes.io / aws-load-balancer-additional-resource-tags`: utilizzato sul servizio per specificare un elenco separato da virgole di coppie chiave-valore che verranno registrate come tag aggiuntivi nel ELB. Ad esempio: `"Key1 = Val1, Key2 = Val2, KeyNoVal1 =, KeyNoVal2"`.
* `service.beta.kubernetes.io / aws-load-balancer-backend-protocol`: utilizzato sul servizio per specificare il protocollo parlato dal backend (pod) dietro un listener. Se `http` (predefinito) o `https`, viene creato un listener HTTPS che termina la connessione e analizza le intestazioni. Se impostato su `ssl` o `tcp`, viene utilizzato un listener SSL "raw". Se impostato su `http` e `aws-load-balancer-ssl-cert` non viene utilizzato, viene utilizzato un listener HTTP.
* `service.beta.kubernetes.io / aws-load-balancer-ssl-cert`: utilizzato nel servizio per richiedere un listener sicuro. Il valore è un certificato ARN valido. Per ulteriori informazioni, vedere [ELB Listener Config](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html) CertARN è un ARN certificato IAM o CM, ad es. `ARN: AWS: ACM: US-est-1: 123456789012: certificato / 12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io / aws-load-balancer-connection-draining-enabled`: utilizzato sul servizio per abilitare o disabilitare il drenaggio della connessione.
* `service.beta.kubernetes.io / aws-load-balancer-connection-draining-timeout`: utilizzato sul servizio per specificare un timeout di drenaggio della connessione.
* `service.beta.kubernetes.io / aws-load-balancer-connection-idle-timeout`: utilizzato sul servizio per specificare il timeout della connessione inattiva.
* `service.beta.kubernetes.io / aws-load-balancer-cross-zone-load-bilanciamento-abilitato`: utilizzato sul servizio per abilitare o disabilitare il bilanciamento del carico tra zone.
* `service.beta.kubernetes.io / aws-load-balancer-extra-security-groups`: utilizzato sul servizio per specificare gruppi di sicurezza aggiuntivi da aggiungere a ELB creato
* `service.beta.kubernetes.io / aws-load-balancer-internal`: usato nel servizio per indicare che vogliamo un ELB interno.
* `service.beta.kubernetes.io / aws-load-balancer-proxy-protocol`: utilizzato sul servizio per abilitare il protocollo proxy su un ELB. Al momento accettiamo solo il valore `*` che significa abilitare il protocollo proxy su tutti i backend ELB. In futuro potremmo regolarlo per consentire l'impostazione del protocollo proxy solo su determinati backend.
* `service.beta.kubernetes.io / aws-load-balancer-ssl-ports`: utilizzato sul servizio per specificare un elenco di porte separate da virgole che utilizzeranno listener SSL / HTTPS. Il valore predefinito è `*` (tutto)

Le informazioni per le annotazioni per AWS sono tratte dai commenti su [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)

## Azure

### Node Name
Il provider cloud di Azure utilizza il nome host del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il nome del nodo Kubernetes deve
corrispondere al nome VM di Azure.

## CloudStack

### Node Name
Il provider cloud CloudStack utilizza il nome host del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il nome del nodo Kubernetes deve
corrispondere al nome VM di CloudStack.

## GCE

### Node Name
Il provider cloud GCE utilizza il nome host del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il primo segmento del nome del nodo
Kubernetes deve corrispondere al nome dell'istanza GCE (ad esempio, un nodo denominato `kubernetes-node-2.c.my-proj.internal`
deve corrispondere a un'istanza denominata `kubernetes-node-2`) .

## OpenStack
Questa sezione descrive tutte le possibili configurazioni che possono
essere utilizzato quando si utilizza OpenStack con Kubernetes.

### Node Name
Il provider cloud OpenStack utilizza il nome dell'istanza (come determinato dai metadati OpenStack) come nome dell'oggetto Nodo Kubernetes.
Si noti che il nome dell'istanza deve essere un nome nodo Kubernetes valido affinché kubelet registri correttamente il suo oggetto Node.

### Services
Il provider cloud OpenStack implementazione per Kubernetes supporta l'uso di questi servizi OpenStack da la nuvola
sottostante, ove disponibile:

| Servizio | Versioni API | Richiesto |
| -------------------------- | ---------------- | ----- ----- |
| Block Storage (Cinder) | V1 †, V2, V3 | No |
| Calcola (Nova) | V2 | No |
| Identity (Keystone) | V2 ‡, V3 | Sì |
| Load Balancing (Neutron) | V1§, V2 | No |
| Load Balancing (Octavia) | V2 | No |

† Il supporto dell'API di storage block V1 è obsoleto, il supporto dell'API di Storage Block V3 era
aggiunto in Kubernetes 1.9.

‡ Il supporto dell'API di Identity V2 è obsoleto e verrà rimosso dal provider in
una versione futura. A partire dalla versione "Queens", OpenStack non esporrà più il file
Identity V2 API.


§ Il supporto per il bilanciamento del carico V1 API è stato rimosso in Kubernetes 1.9.

La scoperta del servizio si ottiene elencando il catalogo dei servizi gestito da
OpenStack Identity (Keystone) usando `auth-url` fornito nel provider
configurazione. Il fornitore si degraderà garbatamente in funzionalità quando
I servizi OpenStack diversi da Keystone non sono disponibili e semplicemente disconoscono
supporto per le caratteristiche interessate. Alcune funzionalità sono anche abilitate o disabilitate
in base all'elenco delle estensioni pubblicate da Neutron nel cloud sottostante.

### cloud.conf
Kubernetes sa come interagire con OpenStack tramite il file cloud.conf. È
il file che fornirà a Kubernetes le credenziali e il percorso per l'endpoint auth di OpenStack.
È possibile creare un file cloud.conf specificando i seguenti dettagli in esso

#### Typical configuration
Questo è un esempio di una configurazione tipica che tocca i valori più
spesso devono essere impostati. Punta il fornitore al Keystone del cloud di OpenStack
endpoint, fornisce dettagli su come autenticarsi con esso e configura il
bilanciamento del carico:

```yaml
[Global]
username=user
password=pass
auth-url=https://<keystone_ip>/identity/v3
tenant-id=c869168a828847f39f7f06edd7305637
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a
```

##### Global
Queste opzioni di configurazione per il provider OpenStack riguardano la sua globalità
configurazione e dovrebbe apparire nella sezione `[Globale]` di `cloud.conf`
file:

* `auth-url` (obbligatorio): l'URL dell'API keystone utilizzata per l'autenticazione. Sopra
  Pannelli di controllo OpenStack, questo può essere trovato in Access and Security> API
  Accesso> Credenziali.
* `username` (obbligatorio): si riferisce al nome utente di un set utente valido in keystone.
* `password` (obbligatorio): fa riferimento alla password di un set utente valido in keystone.
* `tenant-id` (obbligatorio): usato per specificare l'id del progetto dove si desidera
  per creare le tue risorse.
* `tenant-name` (Opzionale): utilizzato per specificare il nome del progetto in cui si trova
  vuoi creare le tue risorse.
* `trust-id` (Opzionale): utilizzato per specificare l'identificativo del trust da utilizzare
  autorizzazione. Un trust rappresenta l'autorizzazione di un utente (il fidato) a
  delegare i ruoli a un altro utente (il trustee) e facoltativamente consentire al trustee
  per impersonare il fiduciario. I trust disponibili si trovano sotto
  `/v3/OS-TRUST/trust` endpoint dell'API Keystone.
* `domain-id` (Opzionale): usato per specificare l'id del dominio a cui appartiene l'utente
  a.
* `domain-name` (Opzionale): utilizzato per specificare il nome del dominio dell'utente
  appartiene a.
* `region` (Opzionale): utilizzato per specificare l'identificatore della regione da utilizzare quando
  in esecuzione su un cloud OpenStack multiregionale. Una regione è una divisione generale di
  una distribuzione OpenStack. Anche se una regione non ha una geografia rigorosa
  connotazione, una distribuzione può utilizzare un nome geografico per un identificatore di regione
  come `us-east`. Le regioni disponibili si trovano sotto `/v3/region`
  endpoint dell'API Keystone.
* `ca-file` (Opzionale): utilizzato per specificare il percorso del file CA personalizzato.


Quando si usa Keystone V3 - che cambia il titolare del progetto - il valore `tenant-id`
viene automaticamente associato al costrutto del progetto nell'API.

#####  Load Balancer
Queste opzioni di configurazione per il provider OpenStack riguardano il carico
bilanciamento e dovrebbe apparire nella sezione `[LoadBalancer]` di `cloud.conf`
file:

* `lb-version` (Opzionale): usato per sovrascrivere il rilevamento automatico della versione. Valido
  i valori sono `v1` o` v2`. Dove non viene fornito alcun valore, lo sarà il rilevamento automatico
  seleziona la versione supportata più alta esposta dal sottostante OpenStack
  nube.
* `use-octavia` (Opzionale): utilizzato per determinare se cercare e utilizzare un
  Octavia LBaaS V2 endpoint del catalogo di servizi. I valori validi sono `true` o` false`.
  Dove `true` è specificato e non è possibile trovare una voce V2 Octaiva LBaaS, il
  il provider si ritirerà e tenterà di trovare un endpoint Neutron LBaaS V2
  anziché. Il valore predefinito è `false`.
* `subnet-id` (Opzionale): usato per specificare l'id della sottorete che si desidera
  crea il tuo loadbalancer su Può essere trovato su Rete> Reti. Clicca sul
  rispettiva rete per ottenere le sue sottoreti.
* `floating-network-id` (Opzionale): se specificato, creerà un IP mobile per
  il bilanciamento del carico.
* `lb-method` (Opzionale): utilizzato per specificare l'algoritmo in base al quale verrà caricato il carico
  distribuito tra i membri del pool di bilanciamento del carico. Il valore può essere
  `ROUND_ROBIN`, `LEAST_CONNECTIONS` o `SOURCE_IP`. Il comportamento predefinito se
  nessuno è specificato è `ROUND_ROBIN`.
* `lb-provider` (Opzionale): utilizzato per specificare il provider del servizio di bilanciamento del carico.
  Se non specificato, sarà il servizio provider predefinito configurato in neutron
  Usato.
* `create-monitor` (Opzionale): indica se creare o meno una salute
  monitorare il bilanciamento del carico Neutron. I valori validi sono `true` e` false`.
  L'impostazione predefinita è `false`. Quando è specificato `true` quindi` monitor-delay`,
  `monitor-timeout`, e` monitor-max-retries` deve essere impostato.
* `monitor-delay` (Opzionale): il tempo tra l'invio delle sonde a
  membri del servizio di bilanciamento del carico. Assicurati di specificare un'unità di tempo valida. Le unità di tempo
  valide sono "ns", "us" (o "μs"), "ms", "s", "m", "h"
* `monitor-timeout` (Opzionale): tempo massimo di attesa per un monitor
  per una risposta ping prima che scada. Il valore deve essere inferiore al ritardo
  valore. Assicurati di specificare un'unità di tempo valida. Le unità di tempo valide sono "ns", "us" (o "μs"), "ms", "s", "m", "h"
* `monitor-max-retries` (Opzionale): numero di errori ping consentiti prima
  cambiare lo stato del membro del bilanciamento del carico in INATTIVO. Deve essere un numero
  tra 1 e 10.
* `manage-security-groups` (Opzionale): Determina se il carico è o meno
  il sistema di bilanciamento dovrebbe gestire automaticamente le regole del gruppo di sicurezza. Valori validi
  sono `true` e` false`. L'impostazione predefinita è `false`. Quando è specificato `true`
  `node-security-group` deve anche essere fornito.
* `node-security-group` (Opzionale): ID del gruppo di sicurezza da gestire.

##### Block Storage
Queste opzioni di configurazione per il provider OpenStack riguardano lo storage a blocchi
e dovrebbe apparire nella sezione `[BlockStorage]` del file `cloud.conf`:

* `bs-version` (Opzionale): usato per sovrascrivere il rilevamento automatico delle versioni. Valido
  i valori sono `v1`, `v2`, `v3` e `auto`. Quando `auto` è specificato automatico
  il rilevamento selezionerà la versione supportata più alta esposta dal sottostante
  Cloud OpenStack. Il valore predefinito se nessuno è fornito è `auto`.
* `trust-device-path` (Opzionale): Nella maggior parte degli scenari i nomi dei dispositivi a blocchi
  fornito da Cinder (ad esempio `/dev/vda`) non può essere considerato attendibile. Questo commutatore booleano
  questo comportamento Impostandolo su `true` risulta fidarsi dei nomi dei dispositivi a blocchi
  fornito da Cinder. Il valore predefinito di `false` risulta nella scoperta di
  il percorso del dispositivo in base al suo numero di serie e mappatura `/dev/disk/by-id` ed è
  l'approccio raccomandato
* `ignore-volume-az` (Opzionale): usato per influenzare l'uso della zona di disponibilità quando
  allegando i volumi di Cinder. Quando Nova e Cinder hanno una diversa disponibilità
  zone, questo dovrebbe essere impostato su `true`. Questo è più comunemente il caso in cui
  ci sono molte zone di disponibilità Nova ma solo una zona di disponibilità Cinder.
  Il valore predefinito è `false` per preservare il comportamento utilizzato in precedenza
  rilasci, ma potrebbero cambiare in futuro.

Se si distribuiscono le versioni di Kubernetes <= 1.8 su una distribuzione OpenStack che utilizza
percorsi piuttosto che porte per distinguere tra endpoint potrebbe essere necessario
per impostare in modo esplicito il parametro `bs-version`. Un endpoint basato sul percorso è del
forma `http://foo.bar/ volume` mentre un endpoint basato sulla porta è del modulo
`Http://foo.bar: xxx`.

In ambienti che utilizzano endpoint basati sul percorso e Kubernetes utilizza il precedente
logica di auto-rilevamento un errore dell'autodeterminazione della versione API BS non riuscito. Errore
restituito al tentativo di distacco del volume. Per risolvere questo problema lo è
possibile forzare l'uso dell'API di Cinder versione 2 aggiungendo questo al cloud
configurazione del provider:

```yaml
[BlockStorage]
bs-version=v2
```

##### Metadata
Queste opzioni di configurazione per il provider OpenStack riguardano i metadati e
dovrebbe apparire nella sezione `[Metadata]` del file `cloud.conf`:

* `ricerca-ordine` (facoltativo): questo tasto di configurazione influenza il modo in cui il
  il provider recupera i metadati relativi alle istanze in cui viene eseguito. Il
  il valore predefinito di `configDrive, metadataService` risulta nel provider
  recuperare i metadati relativi all'istanza dall'unità di configurazione prima se
  disponibile e quindi il servizio di metadati. I valori alternativi sono:
  * `configDrive` - recupera solo i metadati dell'istanza dalla configurazione
    guidare.
  * `metadataService`: recupera solo i metadati dell'istanza dai metadati
    servizio.
  * `metadataService, configDrive` - Recupera i metadati dell'istanza dai metadati
    prima assistenza se disponibile, quindi l'unità di configurazione.

  Influenzare questo comportamento può essere desiderabile come i metadati sul
  l'unità di configurazione può diventare obsoleta nel tempo, mentre il servizio di metadati
  fornisce sempre la vista più aggiornata. Non tutti i cloud di OpenStack forniscono
  sia l'unità di configurazione che il servizio di metadati e solo l'uno o l'altro
  potrebbe essere disponibile, motivo per cui l'impostazione predefinita è controllare entrambi.

##### Router

Queste opzioni di configurazione per il provider OpenStack riguardano [kubenet]
Il plugin di rete di Kubernetes dovrebbe apparire nella sezione `[Router]` di
File `cloud.conf`:

* `router-id` (opzionale): se supporta la distribuzione Neutron del cloud sottostante
   l'estensione `extraroutes` quindi usa` router-id` per specificare un router da aggiungere
   percorsi per. Il router scelto deve estendersi alle reti private che contengono il tuo
   nodi del cluster (in genere esiste solo una rete di nodi e questo valore dovrebbe essere
   il router predefinito per la rete di nodi). Questo valore è necessario per utilizzare [kubenet]
   su OpenStack.

[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet



## OVirt

### Node Name
Il provider di cloud OVirt utilizza il nome host del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il nome del nodo Kubernetes deve
corrispondere al FQDN del VM (riportato da OVirt in `<vm> <guest_info> <fqdn> ... </fqdn> </guest_info> </vm>`)

## Photon

### Node Name
Il provider cloud Photon utilizza il nome host del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il nome del nodo Kubernetes deve
corrispondere al nome VM Photon (o se "overrideIP` è impostato su true in` --cloud-config`, il nome del nodo Kubernetes
deve corrispondere all'indirizzo IP della macchina virtuale Photon).

## VSphere

### Node Name
Il provider cloud VSphere utilizza il nome host rilevato del nodo (come determinato dal kubelet) come nome dell'oggetto
Nodo Kubernetes.

Il parametro `--hostname-override` viene ignorato dal fornitore di cloud VSphere.

## IBM Cloud Kubernetes Service

### Compute nodes
Utilizzando il provider di servizi IBM Cloud Kubernetes, è possibile creare cluster con una combinazione di nodi
virtuali e fisici (bare metal) in una singola zona o su più zone in una regione. Per ulteriori informazioni,
consultare [Pianificazione dell'installazione di cluster e nodo di lavoro](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters#plan_clusters).

Il nome dell'oggetto Nodo Kubernetes è l'indirizzo IP privato dell'istanza del nodo di lavoro IBM Cloud Kubernetes Service.

### Networking
Il fornitore di servizi IBM Cloud Kubernetes fornisce VLAN per le prestazioni di rete di qualità e l'isolamento della
rete per i nodi. È possibile configurare firewall personalizzati e criteri di rete Calico per aggiungere un ulteriore
livello di sicurezza per il cluster o per connettere il cluster al data center on-prem tramite VPN. Per ulteriori
informazioni, vedere [Pianificazione in-cluster e rete privata](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_cluster#cs_network_cluster).

Per esporre le app al pubblico o all'interno del cluster, è possibile sfruttare i servizi NodePort, LoadBalancer o
Ingress. È anche possibile personalizzare il bilanciamento del carico dell'applicazione Ingress con le annotazioni.
Per ulteriori informazioni, vedere [Pianificazione per esporre le app con reti esterne](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning).

### Storage
Il fornitore di servizi IBM Cloud Kubernetes sfrutta i volumi persistenti nativi di Kubernetes per consentire agli
utenti di montare archiviazione di file, blocchi e oggetti cloud nelle loro app. È inoltre possibile utilizzare il
componente aggiuntivo database-as-a-service e di terze parti per la memorizzazione permanente dei dati. Per ulteriori
informazioni, vedere [Pianificazione dell'archiviazione persistente altamente disponibile](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning).

## Baidu Cloud Container Engine

### Node Name
Il provider di cloud Baidu utilizza l'indirizzo IP privato del nodo (come determinato dal kubelet o sovrascritto
con `--hostname-override`) come nome dell'oggetto Nodo Kubernetes. Si noti che il nome del nodo Kubernetes deve
corrispondere all'IP privato VM di Baidu.

---
draft: True
title: Cluster Networking
content_type: concept
weight: 50
---

<!-- overview -->
Il networking è una parte centrale di Kubernetes, ma può essere difficile capire esattamente come dovrebbe funzionare.
Ci sono 4 reti distinte problemi da affrontare:

1. Comunicazioni container-to-container altamente accoppiate: questo è risolto da
    [pod](/docs/concepts/workloads/pods/pod/) e comunicazioni `localhost`.
2. Comunicazioni Pod-to-Pod: questo è l'obiettivo principale di questo documento.
3. Comunicazioni Pod-to-Service: questo è coperto da [servizi](/docs/concepts/services-networking/service/).
4. Comunicazioni da esterno a servizio: questo è coperto da [servizi](/docs/concepts/services-networking/service/).



<!-- body -->

Kubernetes è tutto basato sulla condivisione di macchine tra le applicazioni. Tipicamente,
la condivisione di macchine richiede che due applicazioni non provino a utilizzare il
stesse porte. È molto difficile coordinare le porte tra più sviluppatori
fare su larga scala ed esporre gli utenti a problemi a livello di cluster al di fuori del loro controllo.

L'allocazione dinamica delle porte apporta molte complicazioni al sistema: tutte
l'applicazione deve prendere le porte come flag, i server API devono sapere come
inserire numeri di porta dinamici in blocchi di configurazione, i servizi devono sapere
come trovarsi, ecc. Piuttosto che occuparsene, Kubernetes prende un
approccio diverso.

## Il modello di rete di Kubernetes

Ogni `Pod` ottiene il proprio indirizzo IP. Ciò significa che non è necessario esplicitamente
crea collegamenti tra `Pod 'e non hai quasi mai bisogno di gestire la mappatura
porte del contenitore per ospitare le porte. Questo crea un pulito, retrocompatibile
modello in cui `Pods` può essere trattato in modo molto simile a VM o host fisici da
prospettive di allocazione delle porte, denominazione, individuazione dei servizi, bilanciamento del carico,
configurazione dell'applicazione e migrazione.

Kubernetes impone i seguenti requisiti fondamentali su qualsiasi rete
implementazione (salvo eventuali politiche di segmentazione di rete intenzionale):

   * i pod su un nodo possono comunicare con tutti i pod su tutti i nodi senza NAT
   * agenti su un nodo (ad esempio i daemon di sistema, kubelet) possono comunicare con tutti
     pod su quel nodo

Nota: per quelle piattaforme che supportano `Pods` in esecuzione nella rete host (ad es.
Linux):

   * i pod nella rete host di un nodo possono comunicare con tutti i pod su tutti
     nodi senza NAT

Questo modello non è solo complessivamente meno complesso, ma è principalmente compatibile
con il desiderio di Kubernetes di abilitare il porting a bassa frizione di app da VM
ai contenitori. Se il tuo lavoro è già stato eseguito in una macchina virtuale, la tua macchina virtuale ha avuto un indirizzo IP e potrebbe
parla con altre macchine virtuali nel tuo progetto. Questo è lo stesso modello base.

Gli indirizzi IP di Kubernetes esistono nello scope `Pod` - contenitori all'interno di un 'Pod`
condividere i loro spazi dei nomi di rete, compreso il loro indirizzo IP. Ciò significa che
i contenitori all'interno di un `Pod` possono raggiungere tutti gli altri porti su `localhost`. Questo
significa anche che i contenitori all'interno di un 'Pod` devono coordinare l'utilizzo della porta, ma questo
non è diverso dai processi in una VM. Questo è chiamato il modello "IP-per-pod".

Il modo in cui viene implementato è un dettaglio del particolare runtime del contenitore in uso.

È possibile richiedere le porte sul `Node` stesso che inoltrerà al tuo 'Pod`
(chiamate porte host), ma questa è un'operazione molto di nicchia. Come è quella spedizione
implementato è anche un dettaglio del runtime del contenitore. Il `Pod` stesso è
cieco all'esistenza o alla non esistenza dei porti di accoglienza.

## Come implementare il modello di rete di Kubernetes

Ci sono diversi modi in cui questo modello di rete può essere implementato. Questo il documento non è uno studio
esaustivo dei vari metodi, ma si spera che serva come introduzione a varie tecnologie e serve da punto di partenza.

Le seguenti opzioni di networking sono ordinate alfabeticamente - l'ordine no implica uno stato preferenziale.

### ACI

[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html)
offers an integrated overlay and underlay SDN solution that supports containers, virtual machines, and bare metal
servers. [ACI](https://www.github.com/noironetworks/aci-containers) provides container networking integration for ACI.
An overview of the integration is provided [here](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).

### AOS da Apstra

[AOS](http://www.apstra.com/products/aos/) è un sistema di rete basato sull'intento che crea e gestisce ambienti di
data center complessi da una semplice piattaforma integrata. AOS sfrutta un design distribuito altamente scalabile per
eliminare le interruzioni di rete riducendo al minimo i costi.

Il progetto di riferimento AOS attualmente supporta gli host connessi Layer-3 che eliminano i problemi di commutazione
Layer-2 legacy. Questi host Layer-3 possono essere server Linux (Debian, Ubuntu, CentOS) che creano relazioni vicine
BGP direttamente con gli switch top of rack (TOR). AOS automatizza le adiacenze di routing e quindi fornisce un
controllo a grana fine sulle iniezioni di integrità del percorso (RHI) comuni in una distribuzione di Kubernetes.

AOS dispone di un ricco set di endpoint REST API che consentono a Kubernetes di modificare rapidamente i criteri di
rete in base ai requisiti dell'applicazione. Ulteriori miglioramenti integreranno il modello AOS Graph utilizzato per
la progettazione della rete con il provisioning del carico di lavoro, consentendo un sistema di gestione end-to-end per
cloud privati ​​e pubblici.

AOS supporta l'utilizzo di apparecchiature di produttori comuni di produttori quali Cisco, Arista, Dell, Mellanox, HPE
e un gran numero di sistemi white-box e sistemi operativi di rete aperti come Microsoft SONiC, Dell OPX e Cumulus Linux.

I dettagli su come funziona il sistema AOS sono disponibili qui: http://www.apstra.com/products/how-it-works/

### Big Cloud Fabric da Big Switch Networks

[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) è un'architettura di rete nativa cloud, progettata per eseguire Kubernetes in ambienti cloud privati ​​/ on-premise. Utilizzando un SDN fisico e virtuale unificato, Big Cloud Fabric affronta problemi intrinseci di rete di container come bilanciamento del carico, visibilità, risoluzione dei problemi, politiche di sicurezza e monitoraggio del traffico container.

Con l'aiuto dell'architettura multi-tenant del pod virtuale di Big Cloud Fabric, i sistemi di orchestrazione di container come Kubernetes, RedHat OpenShift, Mesosphere DC / OS e Docker Swarm saranno integrati nativamente con i sistemi di orchestrazione VM come VMware, OpenStack e Nutanix. I clienti saranno in grado di interconnettere in modo sicuro qualsiasi numero di questi cluster e abilitare la comunicazione tra i titolari, se necessario.

BCF è stato riconosciuto da Gartner come un visionario nell'ultimo [Magic Quadrant](http://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). Viene anche fatto riferimento a una delle distribuzioni on-premises BCF Kubernetes (che include Kubernetes, DC / OS e VMware in esecuzione su più DC in diverse regioni geografiche) [https://portworx.com/architects-corner-kubernetes-satya -komala-nio /).
### Cilium

[Cilium](https://github.com/cilium/cilium) è un software open source per
fornire e proteggere in modo trasparente la connettività di rete tra le applicazioni
contenitori. Cilium è consapevole di L7 / HTTP e può applicare i criteri di rete su L3-L7
utilizzando un modello di sicurezza basato sull'identità che è disaccoppiato dalla rete
indirizzamento.

### CNI-Genie from Huawei

[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) è un plugin CNI che consente a Kubernetes
di [avere simultaneamente accesso a diverse implementazioni](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables)
del [modello di rete Kubernetes](https://git.k8s.io/website/docs/concepts/cluster-administration/networking.md#kubernetes-model) in runtime.
Ciò include qualsiasi implementazione che funziona come un [plugin CNI](https://github.com/containernetworking/cni#3rd-party-plugins),
come [Flannel](https://github.com/coreos/flannel#flanella), [Calico](http://docs.projectcalico.org/),
[Romana](https://github.com/romana/romana), [Weave-net](https://www.weave.works/products/tessere-net/).

CNI-Genie supporta anche [assegnando più indirizzi IP a un pod](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-indirizzi-per-pod), ciascuno da un diverso plugin CNI.

### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) contiene un set
di plugin CNI e IPAM per fornire una semplice, host-local, bassa latenza, alta
throughput e stack di rete conforme per Kubernetes in Amazon Virtual
Ambienti Private Cloud (VPC) facendo uso di Amazon Elastic Network
Interfacce (ENI) e associazione degli IP gestiti da AWS in pod usando il kernel di Linux
Driver IPvlan in modalità L2.

I plugin sono progettati per essere semplici da configurare e distribuire all'interno di
VPC. Kubelets si avvia e quindi autoconfigura e ridimensiona il loro utilizzo IP secondo necessità
senza richiedere le complessità spesso raccomandate della gestione della sovrapposizione
reti, BGP, disabilitazione dei controlli sorgente / destinazione o regolazione del percorso VPC
tabelle per fornire sottoreti per istanza a ciascun host (che è limitato a 50-100
voci per VPC). In breve, cni-ipvlan-vpc-k8s riduce significativamente il
complessità della rete richiesta per implementare Kubernetes su larga scala all'interno di AWS.


### Contiv


226/5000
[Contiv](https://github.com/contiv/netplugin) fornisce un networking configurabile (nativo l3 usando BGP,
overlay usando vxlan, classic l2 o Cisco-SDN / ACI) per vari casi d'uso. [Contiv](https://contivpp.io/) è tutto aperto.

### Contrail / Tungsten Fabric

[Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), basato su
[Tungsten Fabric](https://tungsten.io), è un virtualizzazione della rete e piattaforma di gestione delle
policy realmente aperte e multi-cloud. Contrail e Tungsten Fabric sono integrati con vari sistemi di
orchestrazione come Kubernetes, OpenShift, OpenStack e Mesos e forniscono diverse modalità di isolamento
per macchine virtuali, contenitori / pod e carichi di lavoro bare metal.

### DANM

[DANM](https://github.com/nokia/danm) è una soluzione di rete per carichi di lavoro di telco in esecuzione in un cluster Kubernetes. È costituito dai seguenti componenti:

   * Un plugin CNI in grado di fornire interfacce IPVLAN con funzionalità avanzate
    * Un modulo IPAM integrato con la capacità di gestire reti L3 multiple, a livello di cluster e discontinue e fornire uno schema di allocazione IP dinamico, statico o nullo su richiesta
    * Metaplugin CNI in grado di collegare più interfacce di rete a un contenitore, tramite il proprio CNI o delegando il lavoro a qualsiasi soluzione CNI come SRI-OV o Flannel in parallelo
    * Un controller Kubernetes in grado di gestire centralmente sia le interfacce VxLAN che VLAN di tutti gli host Kubernetes
    * Un altro controller di Kubernetes che estende il concetto di rilevamento dei servizi basato sui servizi di Kubernetes per funzionare su tutte le interfacce di rete di un pod

Con questo set di strumenti DANM è in grado di fornire più interfacce di rete separate, la possibilità di utilizzare diversi back-end di rete e funzionalità IPAM avanzate per i pod.

### Flannel

[Flannel](https://github.com/coreos/flannel#flannel) è un overlay molto semplice rete che soddisfa i requisiti di
Kubernetes. Molti le persone hanno riportato il successo con Flannel e Kubernetes.

### Google Compute Engine (GCE)

Per gli script di configurazione del cluster di Google Compute Engine,
[avanzato routing](https://cloud.google.com/vpc/docs/routes) è usato per assegna a ciascuna VM una sottorete
(l'impostazione predefinita è `/ 24` - 254 IP). Qualsiasi traffico vincolato per questo la sottorete verrà instradata
direttamente alla VM dal fabric di rete GCE. Questo è dentro aggiunta all'indirizzo IP "principale" assegnato alla VM,
a cui è stato assegnato NAT accesso a Internet in uscita. Un bridge linux (chiamato `cbr0`) è configurato per esistere
su quella sottorete, e viene passato al flag `--bridge` della finestra mobile.

Docker è avviato con:

```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

Questo bridge è creato da Kubelet (controllato da `--network-plugin = kubenet` flag) in base al Nodo `.spec.podCIDR`.

Docker ora assegna gli IP dal blocco `cbr-cidr`. I contenitori possono raggiungere l'un l'altro e `Nodi` sul
ponte `cbr0`. Questi IP sono tutti instradabili all'interno della rete del progetto GCE.

GCE non sa nulla di questi IP, quindi non lo farà loro per il traffico internet in uscita. Per ottenere ciò viene
utilizzata una regola iptables masquerade (aka SNAT - per far sembrare che i pacchetti provengano dal `Node` stesso)
traffico che è vincolato per IP al di fuori della rete del progetto GCE (10.0.0.0/8).

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

Infine l'inoltro IP è abilitato nel kernel (quindi il kernel elaborerà
pacchetti per contenitori a ponte):

```shell
sysctl net.ipv4.ip_forward=1
```

Il risultato di tutto questo è che tutti i `Pods` possono raggiungere l'altro e possono uscire
traffico verso internet.

### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) è una soluzione open source per la rete di Kubernetes basata
su OpenDaylight. Jaguar fornisce una rete overlay utilizzando vxlan e Jaguar. CNIPlugin fornisce un indirizzo
IP per pod.

### Knitter

363/5000
[Knitter](https://github.com/ZTE/Knitter/) è una soluzione di rete che supporta più reti in Kubernetes.
Fornisce la capacità di gestione dei titolari e gestione della rete. Knitter include una serie di soluzioni
di rete container NFV end-to-end oltre a più piani di rete, come mantenere l'indirizzo IP per le applicazioni,
la migrazione degli indirizzi IP, ecc.

### Kube-router

430/5000
[Kube-router](https://github.com/cloudnativelabs/kube-router) è una soluzione di rete sviluppata appositamente
per Kubernetes che mira a fornire alte prestazioni e semplicità operativa. Kube-router fornisce un proxy di
servizio basato su Linux [LVS / IPVS](http://www.linuxvirtualserver.org/software/ipvs.html), una soluzione di
rete pod-to-pod basata sul kernel di inoltro del kernel Linux senza sovrapposizioni, e il sistema di sicurezza
della politica di rete basato su iptables / ipset.

### L2 networks and linux bridging

Se hai una rete L2 "stupida", come un semplice switch in un "bare metal"
ambiente, dovresti essere in grado di fare qualcosa di simile alla precedente configurazione GCE.
Si noti che queste istruzioni sono state provate solo molto casualmente - a quanto pare
lavoro, ma non è stato testato a fondo. Se usi questa tecnica e
perfezionare il processo, fatecelo sapere.

Segui la sezione "Con dispositivi Linux Bridge" di [questo molto bello
tutorial](http://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) da
Lars Kellogg-Stedman.

### Multus (a Multi Network plugin)

[Multus](https://github.com/k8snetworkplumbingwg/multus-cni) è un plugin Multi CNI per supportare la funzionalità Multi
Networking in Kubernetes utilizzando oggetti di rete basati su CRD in Kubernetes.

Multus supporta tutti i [plug-in di riferimento](https://github.com/containernetworking/plugins)
(ad esempio [Flannel](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel),
[DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp),
[Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) che implementano
le specifiche CNI e i plugin di terze parti (ad esempio [Calico](https://github.com/projectcalico/cni-plugin),
[Weave](https://github.com/weaveworks/weave) ), [Cilium](https://github.com/cilium/cilium),
[Contiv](https://github.com/contiv/netplugin)). Oltre a ciò, Multus supporta
[SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni),
[OVS- DPDK e VPP](https://github.com/intel/vhost-user-net-plugin) carichi di lavoro in Kubernetes con applicazioni
cloud native e basate su NFV in Kubernetes.

### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) è una piattaforma di virtualizzazione e sicurezza
della rete. NSX-T può fornire la virtualizzazione di rete per un ambiente multi-cloud e multi-hypervisor ed è
focalizzato su architetture applicative emergenti e architetture con endpoint eterogenei e stack tecnologici. Oltre
agli hypervisor vSphere, questi ambienti includono altri hypervisor come KVM, container e bare metal.

[Plug-in contenitore NSX-T (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) fornisce
integrazione tra NSX-T e orchestratori di contenitori come Kubernetes, così come l'integrazione tra NSX-T e piattaforme
CaaS / PaaS basate su container come Pivotal Container Service (PKS) e OpenShift.

### Nuage Networks VCS (Servizi cloud virtualizzati)

[Nuage](http://www.nuagenetworks.net) fornisce una piattaforma Software-Defined Networking (SDN) altamente scalabile
basata su policy. Nuage utilizza open source Open vSwitch per il piano dati insieme a un controller SDN ricco di
funzionalità basato su standard aperti.

La piattaforma Nuage utilizza gli overlay per fornire una rete basata su policy senza soluzione di continuità tra i
Pod di Kubernetes e gli ambienti non Kubernetes (VM e server bare metal). Il modello di astrazione delle policy di
Nuage è stato progettato pensando alle applicazioni e semplifica la dichiarazione di policy a grana fine per le
applicazioni. Il motore di analisi in tempo reale della piattaforma consente la visibilità e il monitoraggio della
sicurezza per le applicazioni Kubernetes.

### OVN (Apri rete virtuale)

OVN è una soluzione di virtualizzazione della rete opensource sviluppata da
Apri la community di vSwitch. Permette di creare switch logici, router logici,
ACL di stato, bilanciamento del carico ecc. per costruire reti virtuali diverse
topologie. Il progetto ha un plugin e una documentazione specifici per Kubernetes
a [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).

### Progetto Calico

[Project Calico](http://docs.projectcalico.org/) è un provider di rete contenitore open source e
motore di criteri di rete.

Calico offre una soluzione di rete e di rete altamente scalabile per il collegamento di pod Kubernetes basati sugli
stessi principi di rete IP di Internet, sia per Linux (open source) che per Windows (proprietario - disponibile da
[Tigera](https://www.tigera.io/essenziali/)). Calico può essere distribuito senza incapsulamento o sovrapposizioni per
fornire reti di data center ad alte prestazioni e su vasta scala. Calico fornisce inoltre una politica di sicurezza di
rete basata su intere grane per i pod Kubernetes tramite il firewall distribuito.

Calico può anche essere eseguito in modalità di applicazione della policy insieme ad altre soluzioni di rete come
Flannel, alias [canal](https://github.com/tigera/canal) o native GCE, AWS o networking Azure.

### Romana

[Romana](https://github.com/romana/romana) è una soluzione di automazione della sicurezza e della rete open source che consente di
distribuire Kubernetes senza una rete di overlay. Romana supporta Kubernetes
[Politica di rete](/docs/concepts/services-networking/network-policies/) per fornire isolamento tra gli spazi dei nomi
di rete.

### Weave Net di Weaveworks

[Weave Net](https://www.weave.works/products/weave-net/) è un rete resiliente e semplice da usare per Kubernetes e le
sue applicazioni in hosting. Weave Net funziona come un plug-in [CNI](https://www.weave.works/docs/net/latest/cni-plugin/)
o stand-alone. In entrambe le versioni, non richiede alcuna configurazione o codice aggiuntivo per eseguire, e in
entrambi i casi, la rete fornisce un indirizzo IP per pod, come è standard per Kubernetes.



## {{% heading "whatsnext" %}}


Il progetto iniziale del modello di rete e la sua logica, e un po 'di futuro i piani sono descritti in maggior
dettaglio nella [progettazione della rete documento](https://git.k8s.io/community/contributors/design-proposals/network/networking.md).

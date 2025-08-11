---
title: Container Runtimes
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

Devi installate un
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
in ogni nodo del cluster in modo che i pod possano essere eseguiti. Questa pagina descrive cosa è necessario fare e illustra le attività correlate per configurare i nodi.

Kubernetes {{< skew currentVersion >}} richiede l'utilizzo di un runtime che sia conforme alla
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Vedi le [versioni supportate CRI](#cri-versions) per maggiori informazioni.

Questa pagina fornisce una panoramica su come utilizzare diversi runtime di container comuni con Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)
{{< note >}}
Le versioni di Kubernetes precedenti alla v1.24 includevano un'integrazione diretta con Docker Engine,
tramite un componente chiamato _dockershim_. Questa integrazione speciale non fa più parte di Kubernetes
(la sua rimozione è stata
[annunciata](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
come parte della release v1.20).
Puoi leggere
[Verifica se la rimozione di Dockershim ti riguarda](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
per capire come questa rimozione potrebbe influenzarti. Per informazioni sulla migrazione da dockershim, consulta
[Migrazione da dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Se stai utilizzando una versione di Kubernetes diversa da v{{< skew currentVersion >}},
controlla la documentazione relativa a quella versione.
{{< /note >}}

<!-- body -->
## Installa e configura i prerequisiti

### Configurazione della rete

Per impostazione predefinita, il kernel Linux non consente l'instradamento dei pacchetti IPv4 tra le interfacce. La maggior parte delle implementazioni di rete per cluster Kubernetes modificherà questa impostazione (se necessario), ma alcune potrebbero aspettarsi che sia l'amministratore a farlo. (Alcune potrebbero anche richiedere che vengano impostati altri parametri sysctl, caricati moduli del kernel, ecc.; consulta la documentazione della tua specifica implementazione di rete.)

### Abilita l'inoltro dei pacchetti IPv4 {#prerequisite-ipv4-forwarding-optional}

Per abilitare manualmente l'inoltro dei pacchetti IPv4:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Verifica che `net.ipv4.ip_forward` è impostato ad 1 con:

```bash
sysctl net.ipv4.ip_forward
```

## cgroup drivers

Su Linux, i {{< glossary_tooltip text="control groups" term_id="cgroup" >}} vengono utilizzati per limitare le risorse allocate ai processi.

Sia il {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} che il runtime dei container sottostante devono interfacciarsi con i control groups per applicare la
[gestione delle risorse per pod e container](/docs/concepts/configuration/manage-resources-containers/)
e impostare risorse come richieste e limiti di cpu/memoria. Per interfacciarsi con i control groups, kubelet e il runtime dei container devono utilizzare un *cgroup driver*.
È fondamentale che kubelet e il runtime dei container utilizzino lo stesso cgroup driver e siano configurati allo stesso modo.

Sono disponibili due cgroup driver:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### driver cgroupfs {#cgroupfs-cgroup-driver}

Il driver `cgroupfs` è il [driver cgroup predefinito nel kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
Quando viene utilizzato il driver `cgroupfs`, kubelet e il runtime dei container si interfacciano direttamente con il filesystem dei cgroup per configurare i cgroup.

Il driver `cgroupfs` **non è** raccomandato quando
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) è il sistema init, perché systemd si aspetta un unico gestore dei cgroup sul sistema. Inoltre, se utilizzi [cgroup v2](/docs/concepts/architecture/cgroups), usa il driver cgroup `systemd` invece di `cgroupfs`.

### driver cgroup systemd {#systemd-cgroup-driver}

Quando [systemd](https://www.freedesktop.org/wiki/Software/systemd/) è scelto come sistema init
per una distribuzione Linux, il processo init genera e utilizza un gruppo di controllo radice
(`cgroup`) e agisce come gestore dei cgroup.

systemd ha un'integrazione stretta con i cgroup e assegna un cgroup per ogni unità systemd.
Di conseguenza, se utilizzi `systemd` come sistema init con il driver `cgroupfs`,
il sistema avrà due diversi gestori dei cgroup.

Due gestori dei cgroup portano a due viste delle risorse disponibili e in uso nel
sistema. In alcuni casi, i nodi configurati per usare `cgroupfs` per kubelet e runtime dei container,
ma che usano `systemd` per il resto dei processi, possono diventare instabili sotto pressione di risorse.

L'approccio per mitigare questa instabilità è utilizzare `systemd` come driver dei cgroup sia per
il kubelet che per il runtime dei container quando systemd è il sistema init selezionato.

Per impostare `systemd` come driver dei cgroup, modifica l'opzione
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
`cgroupDriver` e impostala su `systemd`. Ad esempio:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```
{{< note >}}
A partire dalla versione v1.22 e successive, quando si crea un cluster con kubeadm, se l'utente non imposta
il campo `cgroupDriver` in `KubeletConfiguration`, kubeadm lo imposta di default su `systemd`.
{{< /note >}}

Se configuri `systemd` come driver dei cgroup per il kubelet, devi anche
configurare `systemd` come driver dei cgroup per il runtime dei container. Consulta
la documentazione del tuo runtime per le istruzioni. Ad esempio:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

In Kubernetes {{< skew currentVersion >}}, con il
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletCgroupDriverFromCRI`
abilitato e un runtime dei container che supporta la CRI RPC `RuntimeConfig`,
il kubelet rileva automaticamente il driver cgroup appropriato dal runtime,
ignorando l'impostazione `cgroupDriver` nella configurazione del kubelet.

{{< caution >}}
Cambiare il driver dei cgroup di un nodo già unito a un cluster è un'operazione delicata.
Se il kubelet ha creato dei Pod utilizzando la semantica di un driver cgroup, cambiare il runtime
dei container su un altro driver cgroup può causare errori durante la ricreazione del Pod sandbox
per tali Pod esistenti. Riavviare il kubelet potrebbe non risolvere questi errori.

Se hai automazioni che lo permettono, sostituisci il nodo con uno nuovo usando la configurazione aggiornata,
oppure reinstallalo tramite automazione.
{{< /caution >}}

### Migrazione al driver `systemd` nei cluster gestiti con kubeadm

Se desideri migrare al driver cgroup `systemd` in cluster esistenti gestiti con kubeadm,
segui la guida su [configurazione del driver cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Supporto delle versioni CRI {#cri-versions}

Il runtime dei container deve supportare almeno la versione v1alpha2 della Container Runtime Interface (CRI).

A partire da Kubernetes [v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_viene supportata solo_ la versione v1 dell'API CRI. Le versioni precedenti usano di default la versione v1, tuttavia se un runtime dei container non supporta l'API v1, kubelet torna a utilizzare la (deprecata) API v1alpha2.

## Runtime dei container

{{% thirdparty-content %}}

### containerd

Questa sezione descrive i passaggi necessari per utilizzare containerd come runtime CRI.

Per installare containerd sul tuo sistema, segui le istruzioni su
[getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Torna a questo passaggio una volta che hai creato un file di configurazione `config.toml` valido.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
Puoi trovare questo file nel percorso `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
Puoi trovare questo file nel percorso `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

Su Linux il socket CRI predefinito per containerd è `/run/containerd/containerd.sock`.
Su Windows l'endpoint CRI predefinito è `npipe://./pipe/containerd-containerd`.

#### Configurazione del driver cgroup `systemd` {#containerd-systemd}

Per utilizzare il driver cgroup `systemd` in `/etc/containerd/config.toml` con `runc`,
imposta la seguente configurazione in base alla versione di containerd:

Containerd versione 1.x:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Containerd versione 2.x:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Il driver cgroup `systemd` è raccomandato se utilizzi [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
Se hai installato containerd da un pacchetto (ad esempio, RPM o `.deb`), potresti trovare
che il plugin di integrazione CRI è disabilitato di default.

Devi abilitare il supporto CRI per usare containerd con Kubernetes. Assicurati che `cri`
non sia incluso nella lista `disabled_plugins` all'interno di `/etc/containerd/config.toml`;
se hai modificato questo file, riavvia anche `containerd`.

Se riscontri crash loop dei container dopo l'installazione iniziale del cluster o dopo
aver installato un CNI, la configurazione di containerd fornita dal pacchetto potrebbe contenere
parametri incompatibili. Considera di reimpostare la configurazione di containerd con
`containerd config default > /etc/containerd/config.toml` come specificato in
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
e poi imposta i parametri di configurazione sopra indicati.
{{< /note >}}

Dopo aver applicato questa modifica, assicurati di riavviare containerd:

```shell
sudo systemctl restart containerd
```

Se usi kubeadm, configura manualmente il
[driver cgroup per kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

In Kubernetes v1.28 puoi abilitare il rilevamento automatico del
driver cgroup come funzionalità alpha. Consulta [driver cgroup systemd](#systemd-cgroup-driver)
per maggiori dettagli.

#### Sovrascrivere l'immagine sandbox (pause) {#override-pause-image-containerd}

Nel tuo [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) puoi sovrascrivere
l'immagine sandbox impostando la seguente configurazione:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Potresti dover riavviare anche `containerd` dopo aver aggiornato il file di configurazione: `systemctl restart containerd`.

### CRI-O

Questa sezione contiene i passaggi necessari per installare CRI-O come runtime dei container.

Per installare CRI-O, segui le [istruzioni di installazione di CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage).

#### driver cgroup

CRI-O utilizza di default il driver cgroup systemd, che dovrebbe funzionare correttamente
nella maggior parte dei casi. Per passare al driver cgroup `cgroupfs`, modifica
`/etc/crio/crio.conf` oppure aggiungi una configurazione drop-in in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, ad esempio:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Nota anche la modifica di `conmon_cgroup`, che deve essere impostato su `pod`
quando si usa CRI-O con `cgroupfs`. È importante mantenere la configurazione del driver cgroup
del kubelet (di solito tramite kubeadm) e di CRI-O allineate.

In Kubernetes v1.28 puoi abilitare il rilevamento automatico del
driver cgroup come funzionalità alpha. Consulta [driver cgroup systemd](#systemd-cgroup-driver)
per maggiori dettagli.

Per CRI-O, il socket CRI predefinito è `/var/run/crio/crio.sock`.

#### Sovrascrivere l'immagine sandbox (pause) {#override-pause-image-cri-o}

Nel tuo [configurazione CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) puoi impostare il seguente
valore di configurazione:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Questa opzione supporta il reload live della configurazione per applicare la modifica: `systemctl reload crio` oppure inviando
`SIGHUP` al processo `crio`.

### Docker Engine {#docker}

{{< note >}}
Queste istruzioni assumono che tu stia utilizzando l'adapter
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) per integrare
Docker Engine con Kubernetes.
{{< /note >}}

1. Su ciascun nodo, installa Docker per la tua distribuzione Linux come descritto in
  [Installazione di Docker Engine](https://docs.docker.com/engine/install/#server).

2. Installa [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), seguendo le istruzioni nella sezione installazione della documentazione.

Per `cri-dockerd`, il socket CRI predefinito è `/run/cri-dockerd.sock`.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) è un runtime dei container commerciale precedentemente noto come Docker Enterprise Edition.

Puoi utilizzare Mirantis Container Runtime con Kubernetes tramite il componente open source
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) incluso in MCR.

Per maggiori informazioni su come installare Mirantis Container Runtime,
consulta la [Guida al deployment di MCR](https://docs.mirantis.com/mcr/25.0/install.html).

Verifica l'unità systemd chiamata `cri-docker.socket` per trovare il percorso del socket CRI.

#### Sovrascrivere l'immagine sandbox (pause) {#override-pause-image-cri-dockerd-mcr}

L'adapter `cri-dockerd` accetta un argomento da linea di comando per
specificare quale immagine container utilizzare come Pod infrastructure container (“pause image”).
L'argomento da utilizzare è `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

Oltre a un runtime dei container, il tuo cluster avrà bisogno di un
[plugin di rete funzionante](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

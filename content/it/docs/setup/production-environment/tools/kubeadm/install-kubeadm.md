---
title: Installare kubeadm
content_type: task
weight: 10
card:
name: setup
weight: 40
title: Installa lo strumento di configurazione kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Questa pagina mostra come installare lo strumento `kubeadm`.
Per informazioni su come creare un cluster con kubeadm dopo aver completato questo processo di installazione,
consulta la pagina [Creare un cluster con kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}}

* Un host Linux compatibile. Il progetto Kubernetes fornisce istruzioni generiche per distribuzioni Linux
   basate su Debian e Red Hat, e per quelle senza un gestore di pacchetti.
* 2 GB o più di RAM per macchina (meno lascerà poco spazio per le tue applicazioni).
* 2 CPU o più per le macchine del control plane.
* Connettività di rete completa tra tutte le macchine del cluster (rete pubblica o privata va bene).
* Hostname, indirizzo MAC e product_uuid unici per ogni nodo. Vedi [qui](#verify-mac-address) per maggiori dettagli.
* Alcune porte devono essere aperte sulle tue macchine. Vedi [qui](#check-required-ports) per maggiori dettagli.

{{< note >}}
L’installazione di `kubeadm` avviene tramite binari che usano il linking dinamico e presuppone che il sistema target fornisca `glibc`.
Questa è un’ipotesi ragionevole su molte distribuzioni Linux (inclusi Debian, Ubuntu, Fedora, CentOS, ecc.)
ma non sempre è il caso con distribuzioni personalizzate e leggere che non includono `glibc` di default, come Alpine Linux.
Si presume che la distribuzione includa `glibc` o un
[layer di compatibilità](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
che fornisca i simboli richiesti.
{{< /note >}}

<!-- steps -->

## Verifica la versione del sistema operativo

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* Il progetto kubeadm supporta i kernel LTS. Vedi [Elenco dei kernel LTS](https://www.kernel.org/category/releases.html).
* Puoi ottenere la versione del kernel con il comando `uname -r`

Per maggiori informazioni, consulta [Requisiti del kernel Linux](/docs/reference/node/kernel-version-requirements/).

{{% /tab %}}

{{% tab name="Windows" %}}

* Il progetto kubeadm supporta versioni recenti del kernel. Per un elenco, vedi [Informazioni sulle versioni di Windows Server](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info).
* Puoi ottenere la versione del kernel (anche chiamata versione OS) con il comando `systeminfo`

Per maggiori informazioni, consulta [Compatibilità delle versioni di Windows OS](/docs/concepts/windows/intro/#windows-os-version-support).

{{% /tab %}}
{{< /tabs >}}

Un cluster Kubernetes creato da kubeadm dipende da software che utilizzano funzionalità del kernel.
Questo software include, ma non è limitato a,
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}},
{{< glossary_tooltip term_id="kubelet" text="kubelet">}} e un plugin {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}.

Per aiutarti a evitare errori dovuti a una versione del kernel non supportata, kubeadm esegue il controllo pre-flight `SystemVerification`.
Questo controllo fallisce se la versione del kernel non è supportata.

Puoi scegliere di saltare il controllo se sai che il tuo kernel
fornisce le funzionalità richieste, anche se kubeadm non supporta la sua versione.

## Verifica che indirizzo MAC e product_uuid siano unici per ogni nodo {#verify-mac-address}

* Puoi ottenere l’indirizzo MAC delle interfacce di rete con il comando `ip link` o `ifconfig -a`
* Il product_uuid può essere verificato con il comando `sudo cat /sys/class/dmi/id/product_uuid`

È molto probabile che i dispositivi hardware abbiano indirizzi unici, anche se alcune macchine virtuali potrebbero avere
valori identici. Kubernetes usa questi valori per identificare univocamente i nodi nel cluster.
Se questi valori non sono unici per ogni nodo, il processo di installazione
potrebbe [fallire](https://github.com/kubernetes/kubeadm/issues/31).

## Verifica gli adattatori di rete

Se hai più di un adattatore di rete e i componenti Kubernetes non sono raggiungibili tramite la route predefinita,
si consiglia di aggiungere una o più route IP affinché gli indirizzi del cluster Kubernetes passino tramite l’adattatore appropriato.

## Verifica le porte richieste {#check-required-ports}

Queste [porte richieste](/docs/reference/networking/ports-and-protocols/)
devono essere aperte affinché i componenti Kubernetes possano comunicare tra loro.
Puoi usare strumenti come [netcat](https://netcat.sourceforge.net) per verificare se una porta è aperta. Ad esempio:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Il plugin di rete pod che utilizzi potrebbe richiedere anche l’apertura di alcune porte.
Poiché questo varia a seconda del plugin, consulta la
documentazione del plugin per sapere quali porte sono necessarie.

## Configurazione dello swap {#swap-configuration}

Il comportamento predefinito di kubelet è di non avviarsi se viene rilevata memoria swap su un nodo.
Questo significa che lo swap deve essere disabilitato o tollerato da kubelet.

* Per tollerare lo swap, aggiungi `failSwapOn: false` alla configurazione di kubelet o come argomento da linea di comando.
   Nota: anche se viene fornito `failSwapOn: false`, i workload non avranno accesso allo swap di default.
   Questo può essere cambiato impostando un `swapBehavior`, sempre nel file di configurazione di kubelet. Per usare lo swap,
   imposta un valore di `swapBehavior` diverso dal valore predefinito `NoSwap`.
   Consulta [Gestione della memoria swap](/docs/concepts/cluster-administration/swap-memory-management) per maggiori dettagli.
* Per disabilitare lo swap, puoi usare `sudo swapoff -a` per disabilitarlo temporaneamente.
   Per rendere questa modifica persistente dopo il riavvio, assicurati che lo swap sia disabilitato nei
   file di configurazione come `/etc/fstab`, `systemd.swap`, a seconda di come è stato configurato sul tuo sistema.

## Installazione di un container runtime {#installing-runtime}

Per eseguire i container nei Pod, Kubernetes utilizza un
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.

Per impostazione predefinita, Kubernetes usa la
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
per interfacciarsi con il container runtime scelto.

Se non specifichi un runtime, kubeadm cerca automaticamente di rilevare un container runtime installato
scorrendo un elenco di endpoint noti.

Se vengono rilevati più runtime o nessuno, kubeadm restituirà un errore
e ti chiederà di specificare quale vuoi usare.

Consulta [container runtime](/docs/setup/production-environment/container-runtimes/)
per maggiori informazioni.

{{< note >}}
Docker Engine non implementa la [CRI](/docs/concepts/architecture/cri/)
che è un requisito per funzionare con Kubernetes.
Per questo motivo, è necessario installare un servizio aggiuntivo [cri-dockerd](https://mirantis.github.io/cri-dockerd/).
cri-dockerd è un progetto basato sul supporto legacy integrato
per Docker Engine che è stato [rimosso](/dockershim) dal kubelet nella versione 1.24.
{{< /note >}}

Le tabelle seguenti includono gli endpoint noti per i sistemi operativi supportati:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Container runtime per Linux" >}}
| Runtime                            | Percorso Unix domain socket                  |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (usando cri-dockerd) | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Container runtime per Windows" >}}
| Runtime                            | Percorso Windows named pipe                  |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (usando cri-dockerd) | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Installazione di kubeadm, kubelet e kubectl

Dovrai installare questi pacchetti su tutte le tue macchine:

* `kubeadm`: il comando per avviare il cluster.

* `kubelet`: il componente che gira su tutte le macchine del cluster
   e si occupa di avviare pod e container.

* `kubectl`: l’utilità da linea di comando per interagire con il cluster.

kubeadm **non installerà** né gestirà `kubelet` o `kubectl` per te, quindi dovrai
assicurarti che corrispondano alla versione del control plane Kubernetes che vuoi
installare con kubeadm. In caso contrario, c’è il rischio di uno skew di versione che
può portare a comportamenti inaspettati o bug. Tuttavia, è supportato uno _skew_ di una sola minor version tra
kubelet e control plane, ma la versione di kubelet non può mai superare quella dell’API server.
Ad esempio, kubelet in versione 1.7.0 dovrebbe essere pienamente compatibile con un API server 1.8.0,
ma non viceversa.

Per informazioni sull’installazione di `kubectl`, consulta [Installa e configura kubectl](/docs/tasks/tools/).

{{< warning >}}
Queste istruzioni escludono tutti i pacchetti Kubernetes dagli aggiornamenti di sistema.
Questo perché kubeadm e Kubernetes richiedono
[attenzione particolare per l’aggiornamento](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Per maggiori informazioni sugli skew di versione, consulta:

* [Politica di versioni e version-skew di Kubernetes](/docs/setup/release/version-skew-policy/)
* [Politica di version skew specifica per kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
Esiste un repository di pacchetti dedicato per ogni minor version di Kubernetes. Se vuoi installare
una minor version diversa da v{{< skew currentVersion >}}, consulta la guida di installazione per
la versione desiderata.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Distribuzioni basate su Debian" %}}

Queste istruzioni sono per Kubernetes v{{< skew currentVersion >}}.

1. Aggiorna l’indice dei pacchetti `apt` e installa i pacchetti necessari per usare il repository `apt` di Kubernetes:

    ```shell
    sudo apt-get update
    # apt-transport-https potrebbe essere un pacchetto dummy; in tal caso puoi saltarlo
    sudo apt-get install -y apt-transport-https ca-certificates curl gpg
    ```

2. Scarica la chiave pubblica di firma per i repository dei pacchetti Kubernetes.
    La stessa chiave viene usata per tutti i repository, quindi puoi ignorare la versione nell’URL:

    ```shell
    # Se la directory `/etc/apt/keyrings` non esiste, creala prima del comando curl, leggi la nota sotto.
    # sudo mkdir -p -m 755 /etc/apt/keyrings
    curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
    ```

{{< note >}}
Nelle versioni precedenti a Debian 12 e Ubuntu 22.04, la directory `/etc/apt/keyrings` non esiste
di default e deve essere creata prima del comando curl.
{{< /note >}}

3. Aggiungi il repository `apt` di Kubernetes. Nota che questo repository contiene pacchetti
    solo per Kubernetes {{< skew currentVersion >}}; per altre minor version, devi
    cambiare la versione nell’URL per quella desiderata
    (controlla anche di leggere la documentazione per la versione di Kubernetes che intendi installare).

    ```shell
    # Questo sovrascrive qualsiasi configurazione esistente in /etc/apt/sources.list.d/kubernetes.list
    echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
    ```

4. Aggiorna l’indice dei pacchetti `apt`, installa kubelet, kubeadm e kubectl, e blocca la loro versione:

    ```shell
    sudo apt-get update
    sudo apt-get install -y kubelet kubeadm kubectl
    sudo apt-mark hold kubelet kubeadm kubectl
    ```

5. (Opzionale) Abilita il servizio kubelet prima di eseguire kubeadm:

    ```shell
    sudo systemctl enable --now kubelet
    ```

{{% /tab %}}
{{% tab name="Distribuzioni basate su Red Hat" %}}

1. Imposta SELinux in modalità `permissive`:

    Queste istruzioni sono per Kubernetes {{< skew currentVersion >}}.

    ```shell
    # Imposta SELinux in modalità permissive (di fatto lo disabilita)
    sudo setenforce 0
    sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
    ```

{{< caution >}}
- Impostare SELinux in modalità permissive tramite `setenforce 0` e `sed ...`
   di fatto lo disabilita. Questo è richiesto per permettere ai container di accedere al filesystem host; ad esempio, alcuni plugin di rete lo richiedono. Devi
   farlo finché il supporto SELinux nel kubelet non sarà migliorato.
- Puoi lasciare SELinux abilitato se sai come configurarlo, ma potrebbe richiedere
   impostazioni non supportate da kubeadm.
{{< /caution >}}

2. Aggiungi il repository `yum` di Kubernetes. Il parametro `exclude` nella
    definizione del repository assicura che i pacchetti relativi a Kubernetes non vengano
    aggiornati con `yum update`, poiché per aggiornare Kubernetes serve una procedura speciale. Nota che questo repository
    contiene pacchetti solo per Kubernetes {{< skew currentVersion >}}; per altre
    minor version, devi cambiare la versione nell’URL per quella desiderata (controlla anche di leggere la documentazione per la versione di Kubernetes che intendi installare).

    ```shell
    # Questo sovrascrive qualsiasi configurazione esistente in /etc/yum.repos.d/kubernetes.repo
    cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=Kubernetes
    baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
    enabled=1
    gpgcheck=1
    gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
    exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
    EOF
    ```

3. Installa kubelet, kubeadm e kubectl:

    ```shell
    sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
    ```

4. (Opzionale) Abilita il servizio kubelet prima di eseguire kubeadm:

    ```shell
    sudo systemctl enable --now kubelet
    ```

{{% /tab %}}
{{% tab name="Senza un gestore di pacchetti" %}}
Installa i plugin CNI (richiesti per la maggior parte delle reti pod):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Definisci la directory dove scaricare i file dei comandi:

{{< note >}}
La variabile `DOWNLOAD_DIR` deve essere impostata su una directory scrivibile.
Se stai usando Flatcar Container Linux, imposta `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Installa opzionalmente crictl (richiesto per interagire con la Container Runtime Interface (CRI), opzionale per kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Installa `kubeadm`, `kubelet` e aggiungi un servizio systemd per `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Consulta la nota nella sezione [Prima di iniziare](#before-you-begin) per le distribuzioni Linux
che non includono `glibc` di default.
{{< /note >}}

Installa `kubectl` seguendo le istruzioni nella pagina [Install Tools](/docs/tasks/tools/#kubectl).

Opzionalmente, abilita il servizio kubelet prima di eseguire kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
La distribuzione Flatcar Container Linux monta la directory `/usr` come filesystem di sola lettura.
Prima di avviare il cluster, devi eseguire ulteriori passaggi per configurare una directory scrivibile.
Consulta la [Guida alla risoluzione dei problemi di Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
per sapere come configurare una directory scrivibile.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Il kubelet ora si riavvia ogni pochi secondi, in attesa che kubeadm gli dica cosa fare.

## Configurazione del cgroup driver

Sia il container runtime che kubelet hanno una proprietà chiamata
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), importante
per la gestione dei cgroup sulle macchine Linux.

{{< warning >}}
È necessario che il cgroup driver del container runtime e quello di kubelet coincidano, altrimenti il processo kubelet fallirà.

Consulta [Configurare il cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) per maggiori dettagli.
{{< /warning >}}

## Risoluzione dei problemi

Se riscontri difficoltà con kubeadm, consulta la nostra
[documentazione di troubleshooting](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Usare kubeadm per creare un cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)


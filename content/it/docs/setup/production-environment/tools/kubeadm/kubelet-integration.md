---
reviewers:
- sig-cluster-lifecycle
title: Configurare ogni kubelet nel cluster usando kubeadm
content_type: concept
weight: 80
---

<!-- panoramica -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

Il ciclo di vita dello strumento CLI kubeadm è separato da quello del
[kubelet](/docs/reference/command-line-tools-reference/kubelet), che è un demone che viene eseguito
su ogni nodo all'interno del cluster Kubernetes. Lo strumento kubeadm viene eseguito dall'utente quando Kubernetes viene
iniziato o aggiornato, mentre il kubelet è sempre in esecuzione in background.

Poiché il kubelet è un demone, deve essere gestito da un qualche tipo di sistema di init
o service manager. Quando il kubelet viene installato tramite pacchetti DEB o RPM,
systemd viene configurato per gestire il kubelet. Puoi utilizzare un altro service manager,
ma dovrai configurarlo manualmente.

Alcuni dettagli di configurazione del kubelet devono essere uguali su tutti i kubelet del cluster, mentre
altri aspetti devono essere impostati per ogni kubelet per adattarsi alle diverse
caratteristiche di ciascuna macchina (come sistema operativo, storage e rete). Puoi gestire la configurazione
dei kubelet manualmente, ma kubeadm ora fornisce un tipo API `KubeletConfiguration` per
[gestire centralmente le configurazioni dei kubelet](#configure-kubelets-using-kubeadm).

<!-- corpo -->

## Pattern di configurazione del kubelet

Le sezioni seguenti descrivono i pattern di configurazione del kubelet che sono semplificati
utilizzando kubeadm, invece di gestire manualmente la configurazione del kubelet per ogni nodo.

### Propagazione della configurazione a livello di cluster su ogni kubelet

Puoi fornire al kubelet valori predefiniti da utilizzare con i comandi `kubeadm init` e `kubeadm join`.
Esempi interessanti includono l'utilizzo di un runtime container diverso o l'impostazione della subnet predefinita
utilizzata dai servizi.

Se vuoi che i tuoi servizi utilizzino la subnet `10.96.0.0/12` come predefinita, puoi passare
il parametro `--service-cidr` a kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Gli IP virtuali per i servizi verranno ora allocati da questa subnet. Devi anche impostare l'indirizzo DNS utilizzato
dal kubelet, tramite il flag `--cluster-dns`. Questa impostazione deve essere la stessa per ogni kubelet
su ogni manager e nodo del cluster. Il kubelet fornisce un oggetto API strutturato e versionato
che può configurare la maggior parte dei parametri del kubelet e distribuire questa configurazione a ogni kubelet in esecuzione
nel cluster. Questo oggetto si chiama
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
`KubeletConfiguration` consente all'utente di specificare flag come gli indirizzi IP DNS del cluster espressi come
elenco di valori per una chiave in camelCase, come nell'esempio seguente:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

Per maggiori dettagli su `KubeletConfiguration` consulta [questa sezione](#configure-kubelets-using-kubeadm).

### Fornire dettagli di configurazione specifici per istanza

Alcuni host richiedono configurazioni kubelet specifiche a causa di differenze nell'hardware, nel sistema operativo,
nella rete o in altri parametri specifici dell'host. Ecco alcuni esempi:

- Il percorso del file di risoluzione DNS, specificato dal flag di configurazione kubelet `--resolv-conf`,
  può variare tra sistemi operativi o a seconda che venga utilizzato `systemd-resolved`. Se questo percorso è errato,
  la risoluzione DNS fallirà sul nodo il cui kubelet è configurato in modo errato.

- L'oggetto API Node `.metadata.name` viene impostato di default sul nome host della macchina,
  a meno che non si utilizzi un cloud provider. Puoi usare il flag `--hostname-override` per sovrascrivere il
  comportamento predefinito se hai bisogno di specificare un nome nodo diverso dal nome host della macchina.

- Attualmente, il kubelet non può rilevare automaticamente il driver cgroup utilizzato dal runtime container,
  ma il valore di `--cgroup-driver` deve corrispondere al driver cgroup usato dal runtime container per garantire
  la salute del kubelet.

- Per specificare il runtime container devi impostare il suo endpoint con il flag
`--container-runtime-endpoint=<path>`.

Il modo raccomandato per applicare queste configurazioni specifiche per istanza è tramite
[patch di `KubeletConfiguration`](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Configurare i kubelet usando kubeadm

È possibile configurare il kubelet che kubeadm avvierà se viene passato un oggetto API personalizzato
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
tramite un file di configurazione, ad esempio `kubeadm ... --config some-config-file.yaml`.

Eseguendo `kubeadm config print init-defaults --component-configs KubeletConfiguration` puoi
vedere tutti i valori predefiniti per questa struttura.

È anche possibile applicare patch specifiche per istanza sopra la `KubeletConfiguration` di base.
Consulta [Personalizzare il kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
per maggiori dettagli.

### Workflow usando `kubeadm init`

Quando esegui `kubeadm init`, la configurazione del kubelet viene scritta su disco
in `/var/lib/kubelet/config.yaml`, e anche caricata in un ConfigMap `kubelet-config` nel namespace `kube-system`
del cluster. Un file di configurazione kubelet viene anche scritto in `/etc/kubernetes/kubelet.conf`
con la configurazione di base valida per tutti i kubelet del cluster. Questo file di configurazione
punta ai certificati client che permettono al kubelet di comunicare con l'API server. Questo
risponde all'esigenza di
[propagare la configurazione a livello di cluster su ogni kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

Per rispondere al secondo pattern di
[fornire dettagli di configurazione specifici per istanza](#providing-instance-specific-configuration-details),
kubeadm scrive un file di ambiente in `/var/lib/kubelet/kubeadm-flags.env`, che contiene una lista di
flag da passare al kubelet all'avvio. I flag sono presentati nel file in questo modo:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

Oltre ai flag usati all'avvio del kubelet, il file contiene anche parametri dinamici
come il driver cgroup e l'eventuale utilizzo di un socket runtime container diverso
(`--cri-socket`).

Dopo aver scritto questi due file su disco, kubeadm tenta di eseguire i seguenti due
comandi, se stai usando systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Se il reload e il riavvio hanno successo, il normale workflow di `kubeadm init` continua.

### Workflow usando `kubeadm join`

Quando esegui `kubeadm join`, kubeadm utilizza il Bootstrap Token per eseguire
un TLS bootstrap, che recupera le credenziali necessarie per scaricare il
ConfigMap `kubelet-config` e lo scrive in `/var/lib/kubelet/config.yaml`. Il file di ambiente dinamico
viene generato esattamente come in `kubeadm init`.

Successivamente, `kubeadm` esegue i seguenti due comandi per caricare la nuova configurazione nel kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Dopo che il kubelet ha caricato la nuova configurazione, kubeadm scrive il
file KubeConfig `/etc/kubernetes/bootstrap-kubelet.conf`, che contiene un certificato CA e il Bootstrap
Token. Questi vengono usati dal kubelet per eseguire il TLS Bootstrap e ottenere una credenziale unica,
che viene salvata in `/etc/kubernetes/kubelet.conf`.

Quando il file `/etc/kubernetes/kubelet.conf` viene scritto, il kubelet ha terminato il TLS Bootstrap.
Kubeadm elimina il file `/etc/kubernetes/bootstrap-kubelet.conf` dopo aver completato il TLS Bootstrap.

##  Il file drop-in del kubelet per systemd

`kubeadm` fornisce la configurazione su come systemd deve eseguire il kubelet.
Nota che il comando kubeadm CLI non modifica mai questo file drop-in.

Questo file di configurazione installato dal pacchetto
[kubeadm](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) viene scritto in
`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` e viene usato da systemd.
Integra il file base
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

Se vuoi ulteriormente sovrascrivere questa configurazione, puoi creare la directory `/etc/systemd/system/kubelet.service.d/`
(non `/usr/lib/systemd/system/kubelet.service.d/`) e inserire lì le tue personalizzazioni in un file.
Ad esempio, puoi aggiungere un nuovo file locale `/etc/systemd/system/kubelet.service.d/local-overrides.conf`
per sovrascrivere le impostazioni dell'unit configurate da kubeadm.

Ecco cosa probabilmente troverai in `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
I contenuti sotto sono solo un esempio. Se non vuoi usare un package manager
segui la guida nella sezione ([Senza un package manager](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)).
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# Questo è un file che "kubeadm init" e "kubeadm join" generano a runtime, popolando
# dinamicamente la variabile KUBELET_KUBEADM_ARGS
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# Questo è un file che l'utente può usare per sovrascrivere i flag del kubelet come ultima risorsa. Preferibilmente,
# l'utente dovrebbe usare l'oggetto .NodeRegistration.KubeletExtraArgs nei file di configurazione.
# KUBELET_EXTRA_ARGS dovrebbe essere caricato da questo file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Questo file specifica i percorsi predefiniti di tutti i file gestiti da kubeadm per il kubelet.

- Il file KubeConfig da usare per il TLS Bootstrap è `/etc/kubernetes/bootstrap-kubelet.conf`,
  ma viene usato solo se `/etc/kubernetes/kubelet.conf` non esiste.
- Il file KubeConfig con l'identità unica del kubelet è `/etc/kubernetes/kubelet.conf`.
- Il file che contiene la ComponentConfig del kubelet è `/var/lib/kubelet/config.yaml`.
- Il file di ambiente dinamico che contiene `KUBELET_KUBEADM_ARGS` viene caricato da `/var/lib/kubelet/kubeadm-flags.env`.
- Il file che può contenere flag di override specificati dall'utente tramite `KUBELET_EXTRA_ARGS` viene caricato da
  `/etc/default/kubelet` (per DEB), o `/etc/sysconfig/kubelet` (per RPM). `KUBELET_EXTRA_ARGS`
  è l'ultimo nella catena dei flag e ha la priorità più alta in caso di conflitti.

## Binari e contenuti dei pacchetti Kubernetes

I pacchetti DEB e RPM distribuiti con le release di Kubernetes sono:

| Nome pacchetto | Descrizione |
|----------------|-------------|
| `kubeadm`      | Installa lo strumento CLI `/usr/bin/kubeadm` e il [file drop-in del kubelet](#the-kubelet-drop-in-file-for-systemd) per il kubelet. |
| `kubelet`      | Installa il binario `/usr/bin/kubelet`. |
| `kubectl`      | Installa il binario `/usr/bin/kubectl`. |
| `cri-tools`    | Installa il binario `/usr/bin/crictl` dal [repository cri-tools](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Installa i binari in `/opt/cni/bin` dal [repository plugins](https://github.com/containernetworking/plugins). |

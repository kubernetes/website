---
title: Personalizzazione dei componenti con l'API kubeadm
content_type: concept
weight: 40
---

<!-- overview -->

Questa pagina spiega come personalizzare i componenti distribuiti da kubeadm. Per i componenti del control plane
puoi usare i flag nella struttura `ClusterConfiguration` o patch per nodo. Per kubelet
e kube-proxy puoi usare rispettivamente `KubeletConfiguration` e `KubeProxyConfiguration`.

Tutte queste opzioni sono disponibili tramite l'API di configurazione di kubeadm.
Per maggiori dettagli su ciascun campo della configurazione consulta le nostre
[pagine di riferimento API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
La personalizzazione del deployment di CoreDNS tramite kubeadm attualmente non è supportata. Devi modificare manualmente
la {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} `kube-system/coredns`
e ricreare i {{< glossary_tooltip text="Pod" term_id="pod" >}} di CoreDNS dopo la modifica. In alternativa,
puoi saltare il deployment predefinito di CoreDNS e distribuire una tua variante.
Per maggiori dettagli consulta [Utilizzo delle fasi di init con kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
{{< /note >}}

{{< note >}}
Per riconfigurare un cluster già creato consulta
[Riconfigurazione di un cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Personalizzazione del control plane con i flag in `ClusterConfiguration`

L'oggetto `ClusterConfiguration` di kubeadm permette agli utenti di sovrascrivere i flag predefiniti
passati ai componenti del control plane come APIServer, ControllerManager, Scheduler ed Etcd.
I componenti sono definiti tramite le seguenti strutture:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Queste strutture contengono un campo comune `extraArgs`, che consiste in coppie `nome` / `valore`.
Per sovrascrivere un flag di un componente del control plane:

1.  Aggiungi i `extraArgs` appropriati alla tua configurazione.
2.  Aggiungi i flag al campo `extraArgs`.
3.  Esegui `kubeadm init` con `--config <IL TUO FILE YAML DI CONFIGURAZIONE>`.

{{< note >}}
Puoi generare un oggetto `ClusterConfiguration` con i valori predefiniti eseguendo `kubeadm config print init-defaults`
e salvando l'output in un file a tua scelta.
{{< /note >}}

{{< note >}}
L'oggetto `ClusterConfiguration` è attualmente globale nei cluster kubeadm. Questo significa che tutti i flag aggiunti
si applicheranno a tutte le istanze dello stesso componente su nodi diversi. Per applicare configurazioni individuali per componente
su nodi diversi puoi usare le [patch](#patches).
{{< /note >}}

{{< note >}}
Flag duplicati (chiavi), o il passaggio dello stesso flag `--foo` più volte, attualmente non sono supportati.
Per aggirare questa limitazione devi usare le [patch](#patches).
{{< /note >}}

### Flag di APIServer

Per dettagli, consulta la [documentazione di riferimento per kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Esempio di utilizzo:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### Flag di ControllerManager

Per dettagli, consulta la [documentazione di riferimento per kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Esempio di utilizzo:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### Flag di Scheduler

Per dettagli, consulta la [documentazione di riferimento per kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Esempio di utilizzo:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Flag di Etcd

Per dettagli, consulta la [documentazione di etcd](https://etcd.io/docs/).

Esempio di utilizzo:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Personalizzazione tramite patch {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm permette di passare una directory con file di patch a `InitConfiguration` e `JoinConfiguration`
su singoli nodi. Queste patch possono essere usate come ultimo passaggio di personalizzazione prima che la configurazione dei componenti
venga scritta su disco.

Puoi passare questo file a `kubeadm init` con `--config <IL TUO FILE YAML DI CONFIGURAZIONE>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
Per `kubeadm init` puoi passare un file contenente sia una `ClusterConfiguration` che una `InitConfiguration`
separate da `---`.
{{< /note >}}

Puoi passare questo file a `kubeadm join` con `--config <IL TUO FILE YAML DI CONFIGURAZIONE>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

La directory deve contenere file chiamati `target[suffix][+patchtype].extension`.
Ad esempio, `kube-apiserver0+merge.yaml` oppure semplicemente `etcd.json`.

- `target` può essere uno tra `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`
e `kubeletconfiguration`.
- `suffix` è una stringa opzionale che può essere usata per determinare quali patch vengono applicate per prime
in ordine alfanumerico.
- `patchtype` può essere uno tra `strategic`, `merge` o `json` e deve corrispondere ai formati di patch
[supportati da kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
Il valore predefinito di `patchtype` è `strategic`.
- `extension` deve essere `json` o `yaml`.

{{< note >}}
Se utilizzi `kubeadm upgrade` per aggiornare i nodi kubeadm devi fornire nuovamente le stesse
patch, in modo che la personalizzazione venga mantenuta dopo l'aggiornamento. Per farlo puoi usare il flag `--patches`,
che deve puntare alla stessa directory. `kubeadm upgrade` attualmente non supporta una struttura API di configurazione
che possa essere usata per lo stesso scopo.
{{< /note >}}

## Personalizzazione del kubelet {#kubelet}

Per personalizzare il kubelet puoi aggiungere una [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
accanto a `ClusterConfiguration` o `InitConfiguration`, separata da `---` nello stesso file di configurazione.
Questo file può poi essere passato a `kubeadm init` e kubeadm applicherà la stessa base `KubeletConfiguration`
a tutti i nodi del cluster.

Per applicare una configurazione specifica per istanza sopra la base `KubeletConfiguration` puoi usare il
[target di patch `kubeletconfiguration`](#patches).

In alternativa, puoi usare i flag del kubelet come override passandoli nel campo
`nodeRegistration.kubeletExtraArgs` supportato sia da `InitConfiguration` che da `JoinConfiguration`.
Alcuni flag del kubelet sono deprecati, quindi verifica il loro stato nella
[documentazione di riferimento del kubelet](/docs/reference/command-line-tools-reference/kubelet) prima di usarli.

Per ulteriori dettagli consulta [Configurare ogni kubelet nel cluster usando kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

## Personalizzazione di kube-proxy

Per personalizzare kube-proxy puoi passare una `KubeProxyConfiguration` accanto a `ClusterConfiguration` o
`InitConfiguration` a `kubeadm init`, separata da `---`.

Per maggiori dettagli consulta le nostre [pagine di riferimento API](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm distribuisce kube-proxy come un {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, il che significa
che la `KubeProxyConfiguration` si applicherà a tutte le istanze di kube-proxy nel cluster.
{{< /note >}}

---
title: Troubleshooting kubeadm
content_type: concept
weight: 20
---

<!-- panoramica -->

Come per qualsiasi programma, potresti riscontrare errori durante l'installazione o l'esecuzione di kubeadm.
Questa pagina elenca alcuni scenari comuni di errore e fornisce passaggi che possono aiutarti a comprendere e risolvere il problema.

Se il tuo problema non è elencato di seguito, segui questi passaggi:

- Se pensi che il tuo problema sia un bug di kubeadm:
  - Vai su [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) e cerca problemi già esistenti.
  - Se non esiste nessun problema, [aprine uno nuovo](https://github.com/kubernetes/kubeadm/issues/new) seguendo il template.

- Se non sei sicuro di come funzioni kubeadm, puoi chiedere su [Slack](https://slack.k8s.io/) nel canale `#kubeadm`,
  oppure aprire una domanda su [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Includi
  tag rilevanti come `#kubernetes` e `#kubeadm` per ricevere aiuto.

<!-- corpo -->

## Non è possibile aggiungere un nodo v1.18 a un cluster v1.17 a causa di RBAC mancante

In kubeadm v1.18 è stata aggiunta la prevenzione dell'aggiunta di un nodo se esiste già un nodo con lo stesso nome.
Questo ha richiesto l'aggiunta di RBAC per l'utente bootstrap-token per poter eseguire GET su un oggetto Node.

Tuttavia, questo causa un problema per cui `kubeadm join` da v1.18 non può unirsi a un cluster creato da kubeadm v1.17.

Per aggirare il problema hai due opzioni:

Esegui `kubeadm init phase bootstrap-token` su un nodo control-plane usando kubeadm v1.18.
Nota che questo abilita anche il resto dei permessi bootstrap-token.

oppure

Applica manualmente il seguente RBAC usando `kubectl apply -f ...`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## `ebtables` o eseguibili simili non trovati durante l'installazione

Se vedi i seguenti avvisi durante l'esecuzione di `kubeadm init`

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Potresti non avere installato `ebtables`, `ethtool` o eseguibili simili sul nodo.
Puoi installarli con i seguenti comandi:

- Per utenti Ubuntu/Debian, esegui `apt install ebtables ethtool`.
- Per utenti CentOS/Fedora, esegui `yum install ebtables ethtool`.

## kubeadm si blocca in attesa del control plane durante l'installazione

Se noti che `kubeadm init` si blocca dopo aver stampato la seguente riga:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Questo può essere causato da diversi problemi. I più comuni sono:

- problemi di connessione di rete. Verifica che la macchina abbia piena connettività di rete prima di continuare.
- il driver cgroup del runtime dei container è diverso da quello del kubelet. Per capire come
  configurarlo correttamente, vedi [Configurare un driver cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- i container del control plane sono in crashloop o bloccati. Puoi verificarlo eseguendo `docker ps`
  e investigando ogni container con `docker logs`. Per altri runtime, vedi
  [Debug dei nodi Kubernetes con crictl](/docs/tasks/debug/debug-cluster/crictl/).

## kubeadm si blocca durante la rimozione dei container gestiti

Questo può succedere se il runtime dei container si blocca e non rimuove
i container gestiti da Kubernetes:

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(blocco)
```

Una possibile soluzione è riavviare il runtime dei container e poi rieseguire `kubeadm reset`.
Puoi anche usare `crictl` per fare debug dello stato del runtime. Vedi
[Debug dei nodi Kubernetes con crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Pod in stato `RunContainerError`, `CrashLoopBackOff` o `Error`

Subito dopo `kubeadm init` non dovrebbero esserci pod in questi stati.

- Se ci sono pod in uno di questi stati _subito dopo_ `kubeadm init`, apri una issue nel repo kubeadm. `coredns` (o `kube-dns`) dovrebbe essere in stato `Pending`
  finché non hai distribuito il network add-on.
- Se vedi Pod in stato `RunContainerError`, `CrashLoopBackOff` o `Error`
  dopo aver distribuito il network add-on e nulla succede a `coredns` (o `kube-dns`),
  è molto probabile che il Pod Network add-on installato sia difettoso.
  Potresti dover concedere più permessi RBAC o usare una versione più recente. Apri una issue
  nel tracker del provider del network add-on.

## `coredns` bloccato in stato `Pending`

Questo è **previsto** e fa parte del design. kubeadm è agnostico rispetto al provider di rete, quindi l'amministratore deve [installare il pod network add-on](/docs/concepts/cluster-administration/addons/)
di sua scelta. Devi installare una Pod Network
prima che CoreDNS possa essere distribuito completamente. Quindi lo stato `Pending` prima che la rete sia configurata è normale.

## I servizi `HostPort` non funzionano

La funzionalità `HostPort` e `HostIP` è disponibile a seconda del provider di Pod Network.
Contatta l'autore del network add-on per sapere se
`HostPort` e `HostIP` sono supportati.

I provider CNI Calico, Canal e Flannel sono verificati per supportare HostPort.

Per maggiori informazioni, vedi la
[documentazione CNI portmap](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Se il tuo provider di rete non supporta il plugin portmap CNI, potresti dover usare la
[funzionalità NodePort dei servizi](/docs/concepts/services-networking/service/#type-nodeport)
o usare `HostNetwork=true`.

## I pod non sono accessibili tramite il loro Service IP

- Molti network add-on non abilitano ancora la [hairpin mode](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  che permette ai pod di accedere a se stessi tramite il proprio Service IP. Questo è un problema relativo a
  [CNI](https://github.com/containernetworking/cni/issues/476). Contatta il provider del network add-on per sapere se supporta la hairpin mode.

- Se usi VirtualBox (direttamente o tramite Vagrant), assicurati che `hostname -i` restituisca un IP raggiungibile. Di default, la prima
  interfaccia è collegata a una rete host-only non raggiungibile. Un workaround
  è modificare `/etc/hosts`, vedi questo
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)
  come esempio.

## Errori di certificato TLS

Il seguente errore indica un possibile mismatch di certificato.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Verifica che il file `$HOME/.kube/config` contenga un certificato valido e
  rigenera il certificato se necessario. I certificati in kubeconfig sono codificati in base64. Il comando `base64 --decode` può essere usato per decodificare il certificato
  e `openssl x509 -text -noout` per visualizzare le informazioni.

- Rimuovi la variabile d'ambiente `KUBECONFIG` usando:

  ```sh
  unset KUBECONFIG
  ```

  Oppure impostala sulla posizione di default:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Un altro workaround è sovrascrivere il kubeconfig esistente per l'utente "admin":

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Rotazione del certificato client kubelet fallita {#kubelet-client-cert}

Di default, kubeadm configura kubelet con la rotazione automatica dei certificati client usando il
symlink `/var/lib/kubelet/pki/kubelet-client-current.pem` specificato in `/etc/kubernetes/kubelet.conf`.
Se questo processo fallisce potresti vedere errori come `x509: certificate has expired or is not yet valid`
nei log di kube-apiserver. Per risolvere il problema segui questi passaggi:

1. Fai backup ed elimina `/etc/kubernetes/kubelet.conf` e `/var/lib/kubelet/pki/kubelet-client*` dal nodo fallito.
1. Da un nodo control plane funzionante che ha `/etc/kubernetes/pki/ca.key` esegui
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
   `$NODE` deve essere impostato al nome del nodo fallito.
   Modifica manualmente il `kubelet.conf` risultante per regolare il nome del cluster e l'endpoint server,
   oppure passa `kubeconfig user --config` (vedi [Generare kubeconfig per utenti aggiuntivi](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)). Se il cluster non ha
   il `ca.key` devi firmare i certificati embedded in `kubelet.conf` esternamente.
1. Copia il `kubelet.conf` risultante in `/etc/kubernetes/kubelet.conf` sul nodo fallito.
1. Riavvia kubelet (`systemctl restart kubelet`) sul nodo fallito e attendi che
   `/var/lib/kubelet/pki/kubelet-client-current.pem` venga ricreato.
1. Modifica manualmente il `kubelet.conf` per puntare ai certificati client ruotati, sostituendo
   `client-certificate-data` e `client-key-data` con:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. Riavvia kubelet.
1. Assicurati che il nodo diventi `Ready`.

## NIC di default usando flannel come pod network in Vagrant

Il seguente errore può indicare un problema nella pod network:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Se usi flannel come pod network dentro Vagrant, dovrai
  specificare il nome dell'interfaccia di default per flannel.

  Vagrant tipicamente assegna due interfacce a tutte le VM. La prima, a cui tutti gli host
  sono assegnati l'indirizzo IP `10.0.2.15`, è per il traffico esterno che viene NATtato.

  Questo può causare problemi con flannel, che di default usa la prima interfaccia.
  Tutti gli host pensano di avere lo stesso IP pubblico. Per evitarlo,
  passa il flag `--iface eth1` a flannel così che venga scelta la seconda interfaccia.

## IP non pubblico usato per i container

In alcune situazioni i comandi `kubectl logs` e `kubectl run` possono restituire i seguenti errori in un cluster apparentemente funzionante:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Questo può essere dovuto al fatto che Kubernetes usa un IP che non può comunicare con altri IP sulla stessa subnet, forse per policy del provider.
- DigitalOcean assegna un IP pubblico a `eth0` e uno privato da usare internamente
  come anchor per il floating IP, ma `kubelet` sceglie quest'ultimo come `InternalIP` invece del pubblico.

  Usa `ip addr show` per verificare questo scenario invece di `ifconfig` perché `ifconfig` non mostra l'IP alias. In alternativa, un endpoint API specifico di
  DigitalOcean permette di interrogare l'anchor IP dal droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Il workaround è dire a `kubelet` quale IP usare tramite `--node-ip`.
  Su DigitalOcean, può essere quello pubblico (assegnato a `eth0`) o
  quello privato (assegnato a `eth1`) se vuoi usare la rete privata opzionale. La sezione `kubeletExtraArgs` della struttura kubeadm
  [`NodeRegistrationOptions`](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  può essere usata per questo.

  Poi riavvia `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Pod `coredns` in stato `CrashLoopBackOff` o `Error`

Se hai nodi che eseguono SELinux con una vecchia versione di Docker, potresti riscontrare che i pod `coredns` non partono. Per risolvere, puoi provare una delle seguenti opzioni:

- Aggiorna a una [versione più recente di Docker](/docs/setup/production-environment/container-runtimes/#docker).

- [Disabilita SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Modifica il deployment di `coredns` per impostare `allowPrivilegeEscalation` a `true`:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

Un'altra causa per cui CoreDNS va in `CrashLoopBackOff` è quando un Pod CoreDNS rileva un loop.
[Alcuni workaround](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
sono disponibili per evitare che Kubernetes provi a riavviare il Pod ogni volta che CoreDNS rileva il loop ed esce.

{{< warning >}}
Disabilitare SELinux o impostare `allowPrivilegeEscalation` a `true` può compromettere
la sicurezza del cluster.
{{< /warning >}}

## I pod etcd si riavviano continuamente

Se riscontri il seguente errore:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

Questo problema si verifica se usi CentOS 7 con Docker 1.13.1.84.
Questa versione di Docker può impedire al kubelet di eseguire comandi nel container etcd.

Per risolvere, scegli una di queste opzioni:

- Torna a una versione precedente di Docker, come la 1.13.1-75

  ```
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Installa una delle versioni raccomandate più recenti, come la 18.06:

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## Non è possibile passare una lista di valori separati da virgola agli argomenti nel flag `--component-extra-args`

I flag di `kubeadm init` come `--component-extra-args` permettono di passare argomenti personalizzati a un componente del control-plane
come kube-apiserver. Tuttavia, questo meccanismo è limitato dal tipo usato per il parsing
dei valori (`mapStringString`).

Se provi a passare un argomento che supporta valori multipli separati da virgola come
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"` questo flag fallirà con
`flag: malformed pair, expect string=string`. Questo perché la lista di argomenti per
`--apiserver-extra-args` si aspetta coppie `key=value` e in questo caso `NamespacesExists` viene considerato
come chiave senza valore.

In alternativa, puoi provare a separare le coppie `key=value` così:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
ma in questo modo la chiave `enable-admission-plugins` avrà solo il valore `NamespaceExists`.

Un workaround noto è usare il [file di configurazione di kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).

## kube-proxy schedulato prima che il nodo sia inizializzato dal cloud-controller-manager

In scenari cloud provider, kube-proxy può essere schedulato su nuovi nodi worker prima che
il cloud-controller-manager abbia inizializzato gli indirizzi del nodo. Questo fa sì che kube-proxy non rilevi correttamente l'IP del nodo e abbia effetti a catena sulla gestione dei load balancer.

Il seguente errore può essere visto nei Pod kube-proxy:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Una soluzione nota è patchare il DaemonSet di kube-proxy per permettere la schedulazione sui nodi control-plane
indipendentemente dalle loro condizioni, tenendolo fuori dagli altri nodi finché le condizioni iniziali non vengono meno:

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

La issue di tracking è [qui](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` è montata in sola lettura sui nodi {#usr-mounted-read-only}

Su distribuzioni Linux come Fedora CoreOS o Flatcar Container Linux, la directory `/usr` è montata come filesystem in sola lettura.
Per il [supporto flex-volume](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
componenti Kubernetes come kubelet e kube-controller-manager usano il percorso di default
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, ma la directory flex-volume _deve essere scrivibile_
per funzionare.

{{< note >}}
FlexVolume è stato deprecato nella release Kubernetes v1.23.
{{< /note >}}

Per aggirare il problema, puoi configurare la directory flex-volume usando il
[file di configurazione di kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).

Sul nodo control-plane primario (creato con `kubeadm init`), passa il seguente
file con `--config`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Sui nodi che si uniscono:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

In alternativa, puoi modificare `/etc/fstab` per rendere `/usr` scrivibile, ma
questo modifica un principio di design della distribuzione Linux.

## `kubeadm upgrade plan` mostra errore `context deadline exceeded`

Questo errore viene mostrato durante l'aggiornamento di un cluster Kubernetes con `kubeadm` nel caso di etcd esterno.
Non è un bug critico e succede perché
le vecchie versioni di kubeadm eseguono un controllo di versione sul cluster etcd esterno.
Puoi procedere con `kubeadm upgrade apply ...`.

Il problema è risolto dalla versione 1.19.

## `kubeadm reset` smonta `/var/lib/kubelet`

Se `/var/lib/kubelet` è montata, eseguendo `kubeadm reset` verrà effettivamente smontata.

Per aggirare il problema, rimonta la directory `/var/lib/kubelet` dopo aver eseguito `kubeadm reset`.

Questo è un bug introdotto in kubeadm 1.15. Il problema è risolto in 1.20.

## Non è possibile usare metrics-server in modo sicuro in un cluster kubeadm

In un cluster kubeadm, il [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
può essere usato in modo insicuro passando `--kubelet-insecure-tls`. Questo non è raccomandato in produzione.

Se vuoi usare TLS tra metrics-server e kubelet c'è un problema,
poiché kubeadm distribuisce un certificato self-signed per kubelet. Questo può causare i seguenti errori
lato metrics-server:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

Vedi [Abilitare certificati firmati per kubelet](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
per capire come configurare i kubelet in un cluster kubeadm con certificati firmati correttamente.

Vedi anche [Come eseguire metrics-server in modo sicuro](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## L'upgrade fallisce a causa dell'hash di etcd che non cambia

Applicabile solo all'aggiornamento di un nodo control plane con kubeadm v1.28.3 o successivo,
dove il nodo è attualmente gestito da kubeadm v1.28.0, v1.28.1 o v1.28.2.

Ecco il messaggio di errore che potresti vedere:

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
  cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
  cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
  cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

La causa di questo errore è che le versioni interessate generano un manifest etcd con
valori di default indesiderati nella PodSpec. Questo porta a una differenza nel confronto dei manifest,
e kubeadm si aspetta un cambiamento nell'hash del Pod, ma kubelet non aggiornerà mai l'hash.

Ci sono due modi per aggirare il problema:

- L'upgrade di etcd può essere saltato tra le versioni interessate e la v1.28.3 (o successiva) usando:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Questo non è raccomandato se una nuova versione di etcd è stata introdotta da una patch successiva.

- Prima dell'upgrade, patcha il manifest dello static pod etcd per rimuovere gli attributi di default problematici:

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

Maggiori informazioni nella
[issue di tracking](https://github.com/kubernetes/kubeadm/issues/2927) per questo bug.

---
reviewers:
- sig-cluster-lifecycle
title: Impostare un cluster etcd Altamente Disponibile con kubeadm
content_type: task
weight: 70
---

<!-- panoramica -->

Per impostazione predefinita, kubeadm esegue un'istanza etcd locale su ogni nodo del piano di controllo.
È anche possibile trattare il cluster etcd come esterno e predisporre
istanze etcd su host separati. Le differenze tra i due approcci sono descritte nella pagina
[Opzioni per una topologia Altamente Disponibile](/docs/setup/production-environment/tools/kubeadm/ha-topology).

Questa attività illustra il processo di creazione di un cluster etcd esterno ad alta disponibilità
composto da tre membri che può essere utilizzato da kubeadm durante la creazione del cluster.

## {{% heading "prerequisites" %}}

- Tre host che possano comunicare tra loro sulle porte TCP 2379 e 2380.
  Questo documento presume queste porte predefinite, ma sono configurabili tramite il file di configurazione di kubeadm.
- Ogni host deve avere installati systemd e una shell compatibile con bash.
- Ogni host deve [avere installato un runtime container, kubelet e kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Ogni host dovrebbe avere accesso al registro delle immagini container di Kubernetes (`registry.k8s.io`) oppure elencare/scaricare l'immagine etcd richiesta usando
  `kubeadm config images list/pull`. Questa guida configurerà le istanze etcd come
  [static pod](/docs/tasks/configure-pod-container/static-pod/) gestite da kubelet.
- Alcuna infrastruttura per copiare file tra host. Ad esempio `ssh` e `scp`
  possono soddisfare questo requisito.

<!-- passaggi -->

## Configurazione del cluster

L'approccio generale consiste nel generare tutti i certificati su un nodo e distribuire solo
i file _necessari_ agli altri nodi.

{{< note >}}
kubeadm contiene tutta la crittografia necessaria per generare
i certificati descritti di seguito; non sono richiesti altri strumenti crittografici per
questo esempio.
{{< /note >}}

{{< note >}}
Gli esempi seguenti utilizzano indirizzi IPv4 ma è anche possibile configurare kubeadm, kubelet ed etcd
per usare indirizzi IPv6. Il dual-stack è supportato da alcune opzioni di Kubernetes, ma non da etcd. Per maggiori dettagli
sul supporto dual-stack in Kubernetes vedi [Supporto dual-stack con kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Configura kubelet come gestore di servizio per etcd.

   {{< note >}}Devi eseguire questa operazione su ogni host dove deve essere eseguito etcd.{{< /note >}}
   Poiché etcd è stato creato per primo, devi sovrascrivere la priorità del servizio creando un nuovo file unit
   che abbia una precedenza superiore rispetto al file unit kubelet fornito da kubeadm.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Sostituisci "systemd" con il driver cgroup del tuo runtime container. Il valore predefinito in kubelet è "cgroupfs".
   # Sostituisci il valore di "containerRuntimeEndpoint" per un runtime container diverso se necessario.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   Controlla lo stato di kubelet per assicurarti che sia in esecuzione.

   ```sh
   systemctl status kubelet
   ```

1. Crea i file di configurazione per kubeadm.

   Genera un file di configurazione kubeadm per ogni host che eseguirà un membro etcd
   utilizzando il seguente script.

   ```sh
   # Aggiorna HOST0, HOST1 e HOST2 con gli IP dei tuoi host
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Aggiorna NAME0, NAME1 e NAME2 con i nomi host dei tuoi host
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Crea directory temporanee per memorizzare i file che finiranno sugli altri host
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. Genera l'autorità di certificazione.

   Se hai già una CA, l'unica azione richiesta è copiare i file `crt` e
   `key` della CA in `/etc/kubernetes/pki/etcd/ca.crt` e
   `/etc/kubernetes/pki/etcd/ca.key`. Dopo aver copiato questi file,
   procedi al passaggio successivo, "Crea i certificati per ogni membro".

   Se non hai già una CA, esegui questo comando su `$HOST0` (dove hai
   generato i file di configurazione per kubeadm).

   ```
   kubeadm init phase certs etcd-ca
   ```

   Questo crea due file:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Crea i certificati per ogni membro.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # pulizia dei certificati non riutilizzabili
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # Non è necessario spostare i certificati perché sono per HOST0

   # pulizia dei certificati che non devono essere copiati da questo host
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Copia certificati e configurazioni kubeadm.

   I certificati sono stati generati e ora devono essere spostati sui rispettivi host.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Verifica che tutti i file attesi esistano.

   L'elenco completo dei file richiesti su `$HOST0` è:

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   Su `$HOST1`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   Su `$HOST2`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Crea i manifest static pod.

   Ora che certificati e configurazioni sono a posto, è il momento di creare i manifest
   static pod. Su ogni host esegui il comando `kubeadm` per generare un manifest statico
   per etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Facoltativo: verifica lo stato di salute del cluster.

    Se `etcdctl` non è disponibile, puoi eseguire questo strumento all'interno di una container image.
    Puoi farlo direttamente con il tuo runtime container usando uno strumento come
    `crictl run` e non tramite Kubernetes

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 è in salute: proposta impegnata con successo: took = 16.283339ms
    https://[HOST1 IP]:2379 è in salute: proposta impegnata con successo: took = 19.44402ms
    https://[HOST2 IP]:2379 è in salute: proposta impegnata con successo: took = 35.926451ms
    ```

    - Imposta `${HOST0}` sull'indirizzo IP dell'host che stai testando.


## {{% heading "whatsnext" %}}

Una volta che hai un cluster etcd con 3 membri funzionanti, puoi continuare la configurazione di un
control plane altamente disponibile usando il
[metodo etcd esterno con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).


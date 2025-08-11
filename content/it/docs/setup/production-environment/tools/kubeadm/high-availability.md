---
reviewers:
- sig-cluster-lifecycle
title: Creare clusters Altamente Disponibile con kubeadm
content_type: task
weight: 60
---

<!-- panoramica -->

Questa pagina spiega due diversi approcci per configurare un cluster Kubernetes altamente disponibile utilizzando kubeadm:

- Con nodi del piano di controllo "stacked". Questo approccio richiede meno infrastruttura. I membri etcd e i nodi del piano di controllo sono co-localizzati.
- Con un cluster etcd esterno. Questo approccio richiede più infrastruttura. I nodi del piano di controllo e i membri etcd sono separati.

Prima di procedere, valuta attentamente quale approccio soddisfa meglio le esigenze delle tue applicazioni e del tuo ambiente. [Opzioni per la topologia altamente disponibile](/docs/setup/production-environment/tools/kubeadm/ha-topology/) illustra i vantaggi e gli svantaggi di ciascuno.

Se riscontri problemi durante la configurazione del cluster HA, segnalali nel [issue tracker di kubeadm](https://github.com/kubernetes/kubeadm/issues/new).

Consulta anche la [documentazione sull'aggiornamento](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).

{{< caution >}}
Questa pagina non tratta l'esecuzione del cluster su un cloud provider. In un ambiente cloud, nessuno degli approcci documentati qui funziona con oggetti Service di tipo LoadBalancer o con PersistentVolumes dinamici.
{{< /caution >}}

## {{% heading "prerequisiti" %}}

I prerequisiti dipendono dalla topologia scelta per il piano di controllo del cluster:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="Stacked etcd" %}}
<!--
  nota per i revisori: questi prerequisiti devono corrispondere all'inizio della
  tab esterna etcd
-->

Hai bisogno di:

- Tre o più macchine che soddisfino i [requisiti minimi di kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) per i nodi del piano di controllo. Avere un numero dispari di nodi del piano di controllo può aiutare nella selezione del leader in caso di guasto di una macchina o zona.
  - incluso un {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, già configurato e funzionante
- Tre o più macchine che soddisfino i [requisiti minimi di kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) per i nodi worker
  - incluso un container runtime, già configurato e funzionante
- Connettività di rete completa tra tutte le macchine del cluster (rete pubblica o privata)
- Privilegi di superutente su tutte le macchine tramite `sudo`
  - Puoi usare un altro strumento; questa guida utilizza `sudo` negli esempi.
- Accesso SSH da un dispositivo a tutti i nodi del sistema
- `kubeadm` e `kubelet` già installati su tutte le macchine.

_Vedi [Topologia stacked etcd](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology) per il contesto._

{{% /tab %}}
{{% tab name="External etcd" %}}
<!--
  nota per i revisori: questi prerequisiti devono corrispondere all'inizio della
  tab stacked etcd
-->
Hai bisogno di:

- Tre o più macchine che soddisfino i [requisiti minimi di kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) per i nodi del piano di controllo. Avere un numero dispari di nodi del piano di controllo può aiutare nella selezione del leader in caso di guasto di una macchina o zona.
  - incluso un {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, già configurato e funzionante
- Tre o più macchine che soddisfino i [requisiti minimi di kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) per i nodi worker
  - incluso un container runtime, già configurato e funzionante
- Connettività di rete completa tra tutte le macchine del cluster (rete pubblica o privata)
- Privilegi di superutente su tutte le macchine tramite `sudo`
  - Puoi usare un altro strumento; questa guida utilizza `sudo` negli esempi.
- Accesso SSH da un dispositivo a tutti i nodi del sistema
- `kubeadm` e `kubelet` già installati su tutte le macchine.

<!-- fine dei prerequisiti condivisi -->

E inoltre:

- Tre o più macchine aggiuntive, che diventeranno membri del cluster etcd. Avere un numero dispari di membri nel cluster etcd è necessario per ottenere un quorum di voto ottimale.
  - Anche queste macchine devono avere `kubeadm` e `kubelet` installati.
  - Queste macchine richiedono anche un container runtime, già configurato e funzionante.

_Vedi [Topologia etcd esterna](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) per il contesto._
{{% /tab %}}
{{< /tabs >}}

### Immagini dei container

Ogni host deve poter leggere e scaricare le immagini dal registro delle immagini container di Kubernetes, `registry.k8s.io`. Se vuoi distribuire un cluster altamente disponibile in cui gli host non hanno accesso per scaricare le immagini, è possibile. Devi assicurarti con altri mezzi che le immagini container corrette siano già disponibili sugli host rilevanti.

### Interfaccia a riga di comando {#kubectl}

Per gestire Kubernetes una volta che il cluster è stato configurato, dovresti [installare kubectl](/docs/tasks/tools/#kubectl) sul tuo PC. È anche utile installare lo strumento `kubectl` su ogni nodo del piano di controllo, poiché può essere utile per la risoluzione dei problemi.

<!-- passaggi -->

## Primi passi per entrambi i metodi

### Crea un load balancer per kube-apiserver

{{< note >}}
Esistono molte configurazioni per i load balancer. Il seguente esempio è solo una delle opzioni. I requisiti del tuo cluster potrebbero richiedere una configurazione diversa.
{{< /note >}}

1. Crea un load balancer per kube-apiserver con un nome che risolva in DNS.

   - In un ambiente cloud dovresti posizionare i nodi del piano di controllo dietro un load balancer TCP forwarding. Questo load balancer distribuisce il traffico a tutti i nodi del piano di controllo sani nel suo elenco di destinazione. Il controllo dello stato per un apiserver è un controllo TCP sulla porta su cui kube-apiserver è in ascolto (valore predefinito `:6443`).

   - Non è consigliato utilizzare direttamente un indirizzo IP in un ambiente cloud.

   - Il load balancer deve poter comunicare con tutti i nodi del piano di controllo sulla porta dell'apiserver. Deve anche consentire il traffico in ingresso sulla sua porta di ascolto.

   - Assicurati che l'indirizzo del load balancer corrisponda sempre all'indirizzo di `ControlPlaneEndpoint` di kubeadm.

   - Leggi la guida [Opzioni per il bilanciamento del carico software](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing) per maggiori dettagli.

1. Aggiungi il primo nodo del piano di controllo al load balancer e testa la connessione:

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Un errore di "connection refused" è previsto perché l'API server non è ancora in esecuzione. Un timeout, invece, significa che il load balancer non può comunicare con il nodo del piano di controllo. Se si verifica un timeout, riconfigura il load balancer per comunicare con il nodo del piano di controllo.

1. Aggiungi i restanti nodi del piano di controllo al gruppo di destinazione del load balancer.

## Nodi del piano di controllo e etcd "stacked"

### Passaggi per il primo nodo del piano di controllo

1. Inizializza il piano di controllo:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Puoi usare il flag `--kubernetes-version` per impostare la versione di Kubernetes da utilizzare. Si raccomanda che le versioni di kubeadm, kubelet, kubectl e Kubernetes corrispondano.
   - Il flag `--control-plane-endpoint` deve essere impostato sull'indirizzo o DNS e porta del load balancer.

   - Il flag `--upload-certs` viene utilizzato per caricare i certificati che devono essere condivisi tra tutte le istanze del piano di controllo nel cluster. Se invece preferisci copiare i certificati manualmente o tramite strumenti di automazione, rimuovi questo flag e consulta la sezione [Distribuzione manuale dei certificati](#manual-certs) qui sotto.

   {{< note >}}
   I flag `--config` e `--certificate-key` di `kubeadm init` non possono essere usati insieme, quindi se vuoi usare la [configurazione di kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/) devi aggiungere il campo `certificateKey` nelle posizioni appropriate della configurazione (sotto `InitConfiguration` e `JoinConfiguration: controlPlane`).
   {{< /note >}}

   {{< note >}}
   Alcuni plugin di rete CNI richiedono una configurazione aggiuntiva, ad esempio specificare il pod IP CIDR, mentre altri no. Consulta la [documentazione della rete CNI](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network). Per aggiungere un pod CIDR passa il flag `--pod-network-cidr`, oppure se usi un file di configurazione kubeadm imposta il campo `podSubnet` sotto l'oggetto `networking` di `ClusterConfiguration`.
   {{< /note >}}

   L'output sarà simile a:

   ```sh
   ...
   Ora puoi aggiungere qualsiasi numero di nodi del piano di controllo eseguendo il seguente comando su ciascuno come root:
     kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Nota che la chiave del certificato dà accesso a dati sensibili del cluster, mantienila segreta!
   Come misura di sicurezza, i certificati caricati verranno eliminati dopo due ore; se necessario, puoi usare kubeadm init phase upload-certs per ricaricare i certificati successivamente.

   Poi puoi aggiungere qualsiasi numero di nodi worker eseguendo il seguente comando su ciascuno come root:
     kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Copia questo output in un file di testo. Ti servirà più avanti per aggiungere nodi del piano di controllo e worker al cluster.
   - Quando si usa `--upload-certs` con `kubeadm init`, i certificati del piano di controllo primario vengono crittografati e caricati nel Secret `kubeadm-certs`.
   - Per ricaricare i certificati e generare una nuova chiave di decrittazione, usa il seguente comando su un nodo del piano di controllo già unito al cluster:

   ```sh
   sudo kubeadm init phase upload-certs --upload-certs
   ```

   - Puoi anche specificare una `--certificate-key` personalizzata durante `init` che può essere usata successivamente da `join`. Per generare tale chiave puoi usare il seguente comando:

   ```sh
   kubeadm certs certificate-key
   ```

   La chiave del certificato è una stringa esadecimale che rappresenta una chiave AES di 32 byte.

   {{< note >}}
   Il Secret `kubeadm-certs` e la chiave di decrittazione scadono dopo due ore.
   {{< /note >}}

   {{< caution >}}
   Come indicato nell'output del comando, la chiave del certificato dà accesso a dati sensibili del cluster, mantienila segreta!
   {{< /caution >}}

1. Applica il plugin CNI che preferisci:
   [Segui queste istruzioni](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
   per installare il provider CNI. Assicurati che la configurazione corrisponda al Pod CIDR specificato nel file di configurazione kubeadm (se applicabile).

   {{< note >}}
   Devi scegliere un plugin di rete adatto al tuo caso d'uso e distribuirlo prima di passare al passaggio successivo. Se non lo fai, non sarai in grado di avviare correttamente il cluster.
   {{< /note >}}

1. Digita il seguente comando e osserva l'avvio dei pod dei componenti del piano di controllo:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Passaggi per gli altri nodi del piano di controllo

Per ogni nodo aggiuntivo del piano di controllo devi:

1. Eseguire il comando di join che ti è stato fornito dall'output di `kubeadm init` sul primo nodo. Dovrebbe essere simile a questo:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - Il flag `--control-plane` indica a `kubeadm join` di creare un nuovo piano di controllo.
   - Il flag `--certificate-key ...` farà sì che i certificati del piano di controllo vengano scaricati dal Secret `kubeadm-certs` nel cluster e decrittografati usando la chiave fornita.

Puoi unire più nodi del piano di controllo in parallelo.

## Nodi etcd esterni

Configurare un cluster con nodi etcd esterni è simile alla procedura utilizzata per etcd stacked, con l'eccezione che devi prima configurare etcd e fornire le informazioni di etcd nel file di configurazione di kubeadm.

### Configura il cluster etcd

1. Segui queste [istruzioni](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) per configurare il cluster etcd.

1. Configura SSH come descritto [qui](#manual-certs).

1. Copia i seguenti file da qualsiasi nodo etcd del cluster al primo nodo del piano di controllo:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Sostituisci il valore di `CONTROL_PLANE` con `user@host` del primo nodo del piano di controllo.

### Configura il primo nodo del piano di controllo

1. Crea un file chiamato `kubeadm-config.yaml` con il seguente contenuto:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # modifica questo (vedi sotto)
   etcd:
   external:
     endpoints:
     - https://ETCD_0_IP:2379 # modifica ETCD_0_IP opportunamente
     - https://ETCD_1_IP:2379 # modifica ETCD_1_IP opportunamente
     - https://ETCD_2_IP:2379 # modifica ETCD_2_IP opportunamente
     caFile: /etc/kubernetes/pki/etcd/ca.crt
     certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
     keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   La differenza tra etcd stacked ed etcd esterno qui è che la configurazione etcd esterna richiede un file di configurazione con gli endpoint etcd sotto l'oggetto `external` per `etcd`. Nel caso della topologia stacked etcd, questo viene gestito automaticamente.
   {{< /note >}}

   - Sostituisci le seguenti variabili nel template di configurazione con i valori appropriati per il tuo cluster:

   - `LOAD_BALANCER_DNS`
   - `LOAD_BALANCER_PORT`
   - `ETCD_0_IP`
   - `ETCD_1_IP`
   - `ETCD_2_IP`

I passaggi successivi sono simili alla configurazione stacked etcd:

1. Esegui `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` su questo nodo.

1. Scrivi i comandi di join restituiti in un file di testo per un uso successivo.

1. Applica il plugin CNI che preferisci.

   {{< note >}}
   Devi scegliere un plugin di rete adatto al tuo caso d'uso e distribuirlo prima di passare al passaggio successivo. Se non lo fai, non sarai in grado di avviare correttamente il cluster.
   {{< /note >}}

### Passaggi per gli altri nodi del piano di controllo

I passaggi sono gli stessi della configurazione stacked etcd:

- Assicurati che il primo nodo del piano di controllo sia completamente inizializzato.
- Unisci ogni nodo del piano di controllo con il comando di join che hai salvato in un file di testo. Si consiglia di unire i nodi del piano di controllo uno alla volta.
- Ricorda che la chiave di decrittazione da `--certificate-key` scade dopo due ore, per impostazione predefinita.

## Attività comuni dopo il bootstrap del piano di controllo

### Installa i worker

I nodi worker possono essere aggiunti al cluster con il comando che hai precedentemente salvato come output del comando `kubeadm init`:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Distribuzione manuale dei certificati {#manual-certs}

Se scegli di non usare `kubeadm init` con il flag `--upload-certs`, dovrai copiare manualmente i certificati dal nodo primario del piano di controllo ai nodi del piano di controllo che si uniscono.

Ci sono molti modi per farlo. Il seguente esempio utilizza `ssh` e `scp`:

SSH è necessario se vuoi controllare tutti i nodi da una singola macchina.

1. Abilita ssh-agent sul tuo dispositivo principale che ha accesso a tutti gli altri nodi nel sistema:

   ```shell
   eval $(ssh-agent)
   ```

1. Aggiungi la tua identità SSH alla sessione:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. Esegui SSH tra i nodi per verificare che la connessione funzioni correttamente.

   - Quando esegui SSH su un nodo, aggiungi il flag `-A`. Questo flag consente al nodo su cui hai effettuato l'accesso tramite SSH di accedere all'agente SSH sul tuo PC. Considera metodi alternativi se non ti fidi completamente della sicurezza della sessione utente sul nodo.

   ```shell
   ssh -A 10.0.0.7
   ```

   - Quando usi sudo su un nodo, assicurati di preservare l'ambiente affinché il forwarding SSH funzioni:

   ```shell
   sudo -E -s
   ```

1. Dopo aver configurato SSH su tutti i nodi, esegui il seguente script sul primo nodo del piano di controllo dopo aver eseguito `kubeadm init`. Questo script copierà i certificati dal primo nodo del piano di controllo agli altri nodi del piano di controllo:

   Nell'esempio seguente, sostituisci `CONTROL_PLANE_IPS` con gli indirizzi IP degli altri nodi del piano di controllo.

   ```sh
   USER=ubuntu # personalizzabile
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
     scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
     scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
     scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
     scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
     scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
     scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
     scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
     # Salta la riga successiva se stai usando etcd esterno
     scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   Copia solo i certificati nell'elenco sopra. kubeadm si occuperà di generare il resto dei certificati con i SAN richiesti per le istanze del piano di controllo che si uniscono. Se copi per errore tutti i certificati, la creazione di nodi aggiuntivi potrebbe fallire a causa della mancanza dei SAN richiesti.
   {{< /caution >}}

1. Poi, su ciascun nodo del piano di controllo che si unisce, devi eseguire il seguente script prima di eseguire `kubeadm join`. Questo script sposterà i certificati precedentemente copiati dalla home directory a `/etc/kubernetes/pki`:

   ```sh
   USER=ubuntu # personalizzabile
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Salta la riga successiva se stai usando etcd esterno
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```


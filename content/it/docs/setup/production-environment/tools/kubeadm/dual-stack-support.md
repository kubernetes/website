---
title: Support Dual-stack con kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- panoramica -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Il tuo cluster Kubernetes include il networking [dual-stack](/docs/concepts/services-networking/dual-stack/),
il che significa che il networking del cluster ti permette di usare entrambe le famiglie di indirizzi.
In un cluster, il control plane può assegnare sia un indirizzo IPv4 che un indirizzo IPv6 a un singolo
{{< glossary_tooltip text="Pod" term_id="pod" >}} o a un {{< glossary_tooltip text="Service" term_id="service" >}}.

<!-- corpo -->

## {{% heading "prerequisites" %}}

Devi aver installato lo strumento {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}},
seguendo i passaggi da [Installare kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Per ogni server che vuoi usare come {{< glossary_tooltip text="node" term_id="node" >}},
assicurati che consenta l'inoltro IPv6.

### Abilitare l'inoltro dei pacchetti IPv6 {#prerequisite-ipv6-forwarding}

Per verificare se l'inoltro dei pacchetti IPv6 è abilitato:

```bash
sysctl net.ipv6.conf.all.forwarding
```
Se l'output è `net.ipv6.conf.all.forwarding = 1` è già abilitato.
Altrimenti non è ancora abilitato.

Per abilitare manualmente l'inoltro dei pacchetti IPv6:

```bash
# Parametri sysctl richiesti dall'installazione, persistono dopo il riavvio
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Applica i parametri sysctl senza riavviare
sudo sysctl --system
```

Devi avere un intervallo di indirizzi IPv4 e uno IPv6 da utilizzare. Gli operatori di cluster tipicamente
usano intervalli di indirizzi privati per IPv4. Per IPv6, un operatore di cluster di solito sceglie un blocco
di indirizzi unicast globali all'interno di `2000::/3`, utilizzando un intervallo assegnato all'operatore.
Non è necessario instradare gli intervalli di indirizzi IP del cluster su Internet pubblica.

La dimensione delle allocazioni di indirizzi IP dovrebbe essere adatta al numero di Pod e
Service che prevedi di eseguire.

{{< note >}}
Se stai aggiornando un cluster esistente con il comando `kubeadm upgrade`,
`kubeadm` non supporta la modifica dell'intervallo di indirizzi IP dei pod
(“cluster CIDR”) né dell'intervallo di indirizzi dei Service (“Service CIDR”).
{{< /note >}}

### Creare un cluster dual-stack

Per creare un cluster dual-stack con `kubeadm init` puoi passare argomenti da linea di comando
simili al seguente esempio:

```shell
# Questi intervalli di indirizzi sono di esempio
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Per maggiore chiarezza, ecco un esempio di file di configurazione kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` per il nodo di controllo dual-stack primario.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

`advertiseAddress` in InitConfiguration specifica l'indirizzo IP che l'API Server
pubblicizzerà come in ascolto. Il valore di `advertiseAddress` corrisponde al flag
`--apiserver-advertise-address` di `kubeadm init`.

Esegui kubeadm per inizializzare il nodo di controllo dual-stack:

```shell
kubeadm init --config=kubeadm-config.yaml
```

I flag kube-controller-manager `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
sono impostati con valori predefiniti. Vedi [configurare dual stack IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Il flag `--apiserver-advertise-address` non supporta il dual-stack.
{{< /note >}}

### Aggiungere un nodo a un cluster dual-stack

Prima di aggiungere un nodo, assicurati che il nodo abbia un'interfaccia di rete IPv6 instradabile e consenta l'inoltro IPv6.

Ecco un esempio di file di configurazione kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` per aggiungere un nodo worker al cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # modifica le informazioni di autenticazione sopra per adattarle al token e hash CA del tuo cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Inoltre, ecco un esempio di file di configurazione kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` per aggiungere un altro nodo di controllo al cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # modifica le informazioni di autenticazione sopra per adattarle al token e hash CA del tuo cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` in JoinConfiguration.controlPlane specifica l'indirizzo IP che
l'API Server pubblicizzerà come in ascolto. Il valore di `advertiseAddress` corrisponde
al flag `--apiserver-advertise-address` di `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Creare un cluster single-stack

{{< note >}}
Il supporto dual-stack non significa che devi usare indirizzamenti dual-stack.
Puoi distribuire un cluster single-stack che ha la funzionalità di networking dual-stack abilitata.
{{< /note >}}

Per maggiore chiarezza, ecco un esempio di file di configurazione kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` per il nodo di controllo single-stack.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [Validare il networking dual-stack IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* Leggi il networking [Dual-stack](/docs/concepts/services-networking/dual-stack/) del cluster
* Scopri di più sul [formato di configurazione](/docs/reference/config-api/kubeadm-config.v1beta4/) di kubeadm
---
title: Panoramica sull'amministrazione del cluster
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
La panoramica dell'amministrazione del cluster è per chiunque crei o gestisca un cluster Kubernetes.
Presuppone una certa dimestichezza con i core Kubernetes [concetti](/docs/concepts/).
{{% /capture %}}

{{% capture body %}}
## Progettare un cluster

Consulta le guide di [Setup](/docs/setup) per avere degli esempi su come pianificare, impostare e configurare cluster Kubernetes. Le soluzioni elencate in questo articolo sono chiamate *distribuzioni*.

Prima di scegliere una guida, ecco alcune considerazioni:

 - Vuoi provare Kubernetes sul tuo computer o vuoi creare un cluster multi-nodo ad alta disponibilità? Scegli le distro più adatte alle tue esigenze.
 - **Se si sta progettando per l'alta disponibilità**, imparare a configurare [cluster in più zone](/docs/concepts/cluster-administration/federation/).
 - Utilizzerai **un cluster di Kubernetes ospitato**, come [Motore di Google Kubernetes](https://cloud.google.com/kubernetes-engine/) o **che ospita il tuo cluster**?
 - Il tuo cluster sarà **on-premises** o **nel cloud (IaaS)**? Kubernetes non supporta direttamente i cluster ibridi. Invece, puoi impostare più cluster.
 - **Se si sta configurando Kubernetes on-premises**, considerare quale [modello di rete](/docs/concepts/cluster-administration/networking/) si adatta meglio.
 - Avvierai Kubernetes su **hardware "bare metal"** o su **macchine virtuali (VM)**?
 - Vuoi **solo eseguire un cluster**, oppure ti aspetti di fare **lo sviluppo attivo del codice del progetto di Kubernetes**? Se la
   Quest'ultimo, scegliere una distribuzione attivamente sviluppata. Alcune distribuzioni usano solo versioni binarie, ma
   offrire una maggiore varietà di scelte.
 - Familiarizzare con i [componenti](/docs/admin/cluster-components/) necessari per eseguire un cluster.

Nota: non tutte le distro vengono mantenute attivamente. Scegli le distro che sono state testate con una versione recente di Kubernetes.

## Managing a cluster

* [Gestione di un cluster](/docs/tasks/administration-cluster/cluster-management/) descrive diversi argomenti relativi al ciclo di vita di un cluster: creazione di un nuovo cluster, aggiornamento dei nodi master e worker del cluster, esecuzione della manutenzione del nodo (ad esempio kernel aggiornamenti) e aggiornamento della versione dell'API di Kubernetes di un cluster in esecuzione.

* Scopri come [gestire i nodi](/docs/concepts/nodi/node/).

* Scopri come impostare e gestire la [quota di risorse](/docs/concepts/policy/resource-quote/) per i cluster condivisi.

## Proteggere un cluster

* [Certificati](/docs/concepts/cluster-administration/certificates/) descrive i passaggi per generare certificati utilizzando diverse catene di strumenti.

* [Kubernetes Container Environment](/docs/concepts/containers/container-environment-variables/) descrive l'ambiente per i contenitori gestiti Kubelet su un nodo Kubernetes.

* [Controllo dell'accesso all'API di Kubernetes](/docs/reference/access-authn-authz/controlling-access/) descrive come impostare le autorizzazioni per gli utenti e gli account di servizio.

* [Autenticazione](/docs/reference/access-authn-authz/authentication/) spiega l'autenticazione in Kubernetes, incluse le varie opzioni di autenticazione.

* [Autorizzazione](/docs/reference/access-authn-authz/authorization/) è separato dall'autenticazione e controlla come vengono gestite le chiamate HTTP.

* [Utilizzo dei controller di ammissione](/docs/reference/access-authn-authz/admission-controller/) spiega i plug-in che intercettano le richieste al server API Kubernetes dopo l'autenticazione e l'autorizzazione.

* [Uso di Sysctls in un cluster Kubernetes](/docs/concepts/cluster-administration/sysctl-cluster/) descrive a un amministratore come utilizzare lo strumento da riga di comando `sysctl` per impostare i parametri del kernel.

* [Controllo](/docs/tasks/debug-application-cluster/audit/) descrive come interagire con i log di controllo di Kubernetes.


### Securing the kubelet
  * [Master-Node communication](/docs/concepts/architecture/master-node-communication/)
  * [TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Kubelet authentication/authorization](/docs/admin/kubelet-authentication-authorization/)

## Optional Cluster Services

* [Integrazione DNS](/docs/concepts/services-networking/dns-pod-service/) descrive come risolvere un nome DNS direttamente su un servizio Kubernetes.

* [Registrazione e monitoraggio delle attività del cluster](/docs/concepts/cluster-administration/logging/) spiega come funziona il logging in Kubernetes e come implementarlo.

{{% /capture %}}



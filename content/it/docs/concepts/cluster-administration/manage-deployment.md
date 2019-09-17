---
title: Gestione delle risorse
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Hai distribuito la tua applicazione e l'hai esposta tramite un servizio. Ora cosa? Kubernetes fornisce una serie di 
strumenti per aiutarti a gestire la distribuzione delle applicazioni, compreso il ridimensionamento e l'aggiornamento. 
Tra le caratteristiche che discuteremo in modo più approfondito ci sono [file di configurazione](/docs/concepts/configuration/overview/) 
e [labels](/docs/concepts/overview/working-with-objects/labels/).

{{% /capture %}}


{{% capture body %}}

## Organizzazione delle configurazioni delle risorse

Molte applicazioni richiedono la creazione di più risorse, ad esempio una distribuzione e un servizio. La gestione di più risorse può essere semplificata raggruppandole nello stesso file (separate da `---` in YAML). Per esempio:

{{< codenew file="application/nginx-app.yaml" >}}

Multiple resources can be created the same way as a single resource:

```shell
$ kubectl create -f https://k8s.io/examples/application/nginx-app.yaml
service/my-nginx-svc created
deployment.apps/my-nginx created
```

Le risorse verranno create nell'ordine in cui appaiono nel file. Pertanto, è meglio specificare prima il servizio, poiché ciò assicurerà che lo scheduler possa distribuire i pod associati al servizio man mano che vengono creati dal / i controller, ad esempio Deployment.

`kubectl create` accetta anche più argomenti` -f`:

```shell
$ kubectl create -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

E una directory può essere specificata piuttosto che o in aggiunta ai singoli file:
```shell
$ kubectl create -f https://k8s.io/examples/application/nginx/
```

`kubectl` leggerà tutti i file con suffissi` .yaml`, `.yml` o` .json`.

Si consiglia di inserire nello stesso file risorse correlate allo stesso livello di microservice o di applicazione e di raggruppare tutti i file associati all'applicazione nella stessa directory. Se i livelli dell'applicazione si associano tra loro tramite DNS, è quindi possibile distribuire in massa tutti i componenti dello stack.

Un URL può anche essere specificato come origine di configurazione, utile per la distribuzione direttamente dai file di configurazione controllati in github:

```shell
$ kubectl create -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx created
```

## Bulk operations in kubectl

La creazione di risorse non è l'unica operazione che `kubectl` può eseguire alla rinfusa. Può anche estrarre i nomi delle risorse dai file di configurazione per eseguire altre operazioni, in particolare per eliminare le stesse risorse che hai creato:

```shell
$ kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Nel caso di due sole risorse, è anche facile specificare entrambi sulla riga di comando usando la sintassi risorsa / nome:

```shell
$ kubectl delete deployments/my-nginx services/my-nginx-svc
```

Per un numero maggiore di risorse, troverai più semplice specificare il selettore (query etichetta) specificato usando `-l` o` --selector`, per filtrare le risorse in base alle loro etichette:

```shell
$ kubectl delete deployment,services -l app=nginx
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

130/5000
Poiché `kubectl` restituisce i nomi delle risorse nella stessa sintassi che accetta, è facile concatenare le operazioni usando` $ () `o` xargs`:

```shell
$ kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

Con i suddetti comandi, prima creiamo le risorse sotto `examples/application/nginx/` e stampiamo le risorse create con il formato di output `-o name`
(stampa ogni risorsa come risorsa / nome). Quindi `grep` solo il" servizio ", e poi lo stampiamo con` kubectl get`.

Se si organizzano le risorse su più sottodirectory all'interno di una particolare directory, è possibile eseguire ricorsivamente anche le operazioni nelle sottodirectory, specificando `--recursive` o` -R` accanto al flag `--filename, -f`.

Ad esempio, supponiamo che ci sia una directory `project/k8s/development` che contiene tutti i manifesti necessari per l'ambiente di sviluppo, organizzati per tipo di risorsa:

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

Per impostazione predefinita, l'esecuzione di un'operazione bulk su `project/k8s/development` si interromperà al primo livello della directory, senza elaborare alcuna sottodirectory. Se avessimo provato a creare le risorse in questa directory usando il seguente comando, avremmo riscontrato un errore:

```shell
$ kubectl create -f project/k8s/development
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Invece, specifica il flag `--recursive` o` -R` con il flag `--filename, -f` come tale:

```shell
$ kubectl create -f project/k8s/development --recursive
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Il flag `--recursive` funziona con qualsiasi operazione che accetta il flag` --filename, -f` come: `kubectl {crea, ottieni, cancella, descrivi, implementa} ecc .`

Il flag `--recursive` funziona anche quando sono forniti più argomenti` -f`:

```shell
$ kubectl create -f project/k8s/namespaces -f project/k8s/development --recursive
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Se sei interessato a saperne di più su `kubectl`, vai avanti e leggi [Panoramica di kubectl](/docs/reference/kubectl/overview/).

## Usare le etichette in modo efficace

Gli esempi che abbiamo utilizzato fino ad ora si applicano al massimo una singola etichetta a qualsiasi risorsa. Esistono molti scenari in cui è necessario utilizzare più etichette per distinguere i set l'uno dall'altro.

Ad esempio, diverse applicazioni utilizzerebbero valori diversi per l'etichetta `app`, ma un'applicazione multilivello, come l'esempio [guestbook](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/), avrebbe inoltre bisogno di distinguere ogni livello. Il frontend potrebbe contenere le seguenti etichette:

```yaml
     labels:
        app: guestbook
        tier: frontend
```

while the Redis master and slave would have different `tier` labels, and perhaps even an additional `role` label:

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

and

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

Le etichette ci permettono di tagliare e tagliare le nostre risorse lungo qualsiasi dimensione specificata da un'etichetta:

```shell
$ kubectl create -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
$ kubectl get pods -Lapp -Ltier -Lrole
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
$ kubectl get pods -lapp=guestbook,role=slave
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## Distribuzioni canarie

Un altro scenario in cui sono necessarie più etichette è quello di distinguere distribuzioni di diverse versioni o 
configurazioni dello stesso componente. È prassi comune distribuire un * canarino * di una nuova versione 
dell'applicazione (specificata tramite il tag immagine nel modello pod) parallelamente alla versione precedente in 
modo che la nuova versione possa ricevere il traffico di produzione in tempo reale prima di distribuirlo completamente.

Ad esempio, puoi usare un'etichetta `track` per differenziare le diverse versioni.

La versione stabile e primaria avrebbe un'etichetta `track` con valore come` stable`:

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

e quindi puoi creare una nuova versione del frontend del guestbook che porta l'etichetta `track` con un valore diverso 
(ad esempio` canary`), in modo che due gruppi di pod non si sovrappongano:

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

Il servizio di frontend coprirebbe entrambe le serie di repliche selezionando il sottoinsieme comune delle loro 
etichette (ad esempio omettendo l'etichetta `track`), in modo che il traffico venga reindirizzato ad entrambe le 
applicazioni:

```yaml
  selector:
     app: guestbook
     tier: frontend
```

452/5000
È possibile modificare il numero di repliche delle versioni stable e canary per determinare il rapporto tra ciascuna 
versione che riceverà il traffico di produzione live (in questo caso, 3: 1). Una volta che sei sicuro, puoi aggiornare 
la traccia stabile alla nuova versione dell'applicazione e rimuovere quella canarino.

Per un esempio più concreto, controlla il [tutorial di distribuzione di Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).

## Updating labels

A volte i pod esistenti e altre risorse devono essere rinominati prima di creare nuove risorse. Questo può essere fatto 
con l'etichetta `kubectl`. Ad esempio, se desideri etichettare tutti i tuoi pod nginx come livello frontend, esegui 
semplicemente:

```shell
$ kubectl label pods -l app=nginx tier=fe
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Questo prima filtra tutti i pod con l'etichetta "app = nginx", quindi li etichetta con il "tier = fe". Per vedere i pod 
appena etichettati, esegui:

```shell
$ kubectl get pods -l app=nginx -L tier
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

questo produce tutti i pod "app = nginx", con un'ulteriore colonna di etichette del livello dei pod (specificata
con `-L` o` --label-columns`).

Per ulteriori informazioni, consultare [labels](/docs/concepts/overview/working-with-objects/labels/) e 
[kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## Aggiornare annotazioni

A volte vorresti allegare annotazioni alle risorse. Le annotazioni sono metadati arbitrari non identificativi per il 
recupero da parte di client API come strumenti, librerie, ecc. Questo può essere fatto con `kubectl annotate`. Per 
esempio:

```shell
$ kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
$ kubectl get pods my-nginx-v4-9gw19 -o yaml
apiversion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

Per ulteriori informazioni, consultare il documento [annotazioni](/docs/concepts/overview/working-with-objects/annotations/) 
e [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate).

## Ridimensionamento dell'applicazione

Quando si carica o si riduce la richiesta, è facile ridimensionare con `kubectl`. Ad esempio, per ridurre il numero di 
repliche nginx da 3 a 1, fare:

```shell
$ kubectl scale deployment/my-nginx --replicas=1
deployment.extensions/my-nginx scaled
```

Ora hai solo un pod gestito dalla distribuzione

```shell
$ kubectl get pods -l app=nginx
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Per fare in modo che il sistema scelga automaticamente il numero di repliche nginx secondo necessità, da 1 a 3, fare:

```shell
$ kubectl autoscale deployment/my-nginx --min=1 --max=3
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Ora le repliche di nginx verranno ridimensionate automaticamente in base alle esigenze.

Per maggiori informazioni, vedi [scala kubectl](/docs/reference/generated/kubectl/kubectl-commands/#scale),
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) e documento 
[orizzontale pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/).

## Aggiornamenti sul posto delle risorse

A volte è necessario apportare aggiornamenti stretti e senza interruzioni alle risorse che hai creato.

### kubectl apply

Si consiglia di mantenere un set di file di configurazione nel controllo del codice sorgente (vedere 
[configurazione come codice](http://martinfowler.com/bliki/InfrastructureAsCode.html)), in modo che possano essere 
mantenuti e versionati insieme al codice per le risorse che configurano. Quindi, puoi usare 
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) per inviare le modifiche alla configurazione
nel cluster.

Questo comando confronterà la versione della configurazione che stai spingendo con la versione precedente e applicherà 
le modifiche che hai apportato, senza sovrascrivere le modifiche automatiche alle proprietà che non hai specificato.

```shell
$ kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

Si noti che `kubectl apply` allega un'annotazione alla risorsa per determinare le modifiche alla configurazione 
dall'invocazione precedente. Quando viene invocato, `kubectl apply` fa una differenza a tre tra la configurazione 
precedente, l'input fornito e la configurazione corrente della risorsa, al fine di determinare come modificare la 
risorsa.

Attualmente, le risorse vengono create senza questa annotazione, quindi la prima chiamata di `kubectl apply` ricadrà su 
una differenza a due vie tra l'input fornito e la configurazione corrente della risorsa. Durante questa prima chiamata, 
non è in grado di rilevare l'eliminazione delle proprietà impostate al momento della creazione della risorsa. Per questo 
motivo, non li rimuoverà.

Tutte le chiamate successive a `kubectl apply`, e altri comandi che modificano la configurazione, come `kubectl replace` 
e `kubectl edit`, aggiorneranno l'annotazione, consentendo le successive chiamate a` kubectl apply` per rilevare ed 
eseguire cancellazioni usando un tre via diff.

{{< note >}}
To use apply, always create resource initially with either `kubectl apply` or `kubectl create --save-config`.
{{< /note >}}

### kubectl edit

In alternativa, puoi anche aggiornare le risorse con `kubectl edit`:

```shell
$ kubectl edit deployment/my-nginx
```

Questo equivale a prima "get` la risorsa, modificarla nell'editor di testo e quindi" applicare "la risorsa con la 
versione aggiornata:

```shell
$ kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
$ vi /tmp/nginx.yaml
# do some edit, and then save the file
$ kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured
$ rm /tmp/nginx.yaml
```

Questo ti permette di fare più cambiamenti significativi più facilmente. Nota che puoi specificare l'editor con le 
variabili di ambiente `EDITOR` o` KUBE_EDITOR`.

Per ulteriori informazioni, consultare il documento [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit).

### kubectl patch

You can use `kubectl patch` to update API objects in place. This command supports JSON patch,
JSON merge patch, and strategic merge patch. See
[Update API Objects in Place Using kubectl patch](/docs/tasks/run-application/update-api-object-kubectl-patch/)
and
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).


## Disruptive updates

375/5000
In alcuni casi, potrebbe essere necessario aggiornare i campi di risorse che non possono essere aggiornati una volta 
inizializzati, oppure si può semplicemente voler fare immediatamente una modifica ricorsiva, come per esempio correggere 
i pod spezzati creati da una distribuzione. Per cambiare tali campi, usa `replace --force`, che elimina e ricrea la 
risorsa. In questo caso, puoi semplicemente modificare il tuo file di configurazione originale:

```shell
$ kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## Aggiornamento dell'applicazione senza un'interruzione del servizio

A un certo punto, alla fine sarà necessario aggiornare l'applicazione distribuita, in genere specificando una nuova 
immagine o un tag immagine, come nello scenario di distribuzione canarino precedente. `kubectl` supporta diverse 
operazioni di aggiornamento, ognuna delle quali è applicabile a diversi scenari.

Ti guideremo attraverso come creare e aggiornare le applicazioni con le distribuzioni. Se l'applicazione distribuita è 
gestita dai controller di replica, dovresti leggere 
[come usare `kubectl rolling-update`](/docs/tasks/run-application/rolling-update-replication-controller/).

Diciamo che stavi usando la versione 1.7.9 di nginx:

```shell
$ kubectl run my-nginx --image=nginx:1.7.9 --replicas=3
deployment.apps/my-nginx created
```

Per aggiornare alla versione 1.9.1, cambia semplicemente `.spec.template.spec.containers [0] .image` da `nginx: 1.7.9` 
a `nginx: 1.9.1`, con i comandi kubectl che abbiamo imparato sopra.

```shell
$ kubectl edit deployment/my-nginx
```

Questo è tutto! La distribuzione aggiornerà in modo dichiarativo l'applicazione nginx distribuita progressivamente 
dietro la scena. Garantisce che solo un certo numero di vecchie repliche potrebbe essere inattivo mentre vengono 
aggiornate e solo un certo numero di nuove repliche può essere creato sopra il numero desiderato di pod. Per ulteriori 
informazioni su di esso, visitare [Pagina di distribuzione](/docs/concepts/workloads/controller/deployment/).

{{% /capture %}}

{{% capture whatsnext %}}

- [[Scopri come usare `kubectl` per l'introspezione e il debug delle applicazioni.](/Docs/tasks/debug-application-cluster/debug-application-introspection/)
- [Best practice e suggerimenti sulla configurazione](/docs/concepts/configuration/overview/)

{{% /capture %}}

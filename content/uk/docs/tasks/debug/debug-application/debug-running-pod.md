---
title: Налагодження запущених Podʼів
content_type: task
---

<!-- overview -->

Ця сторінка пояснює, як налагоджувати Podʼи, що працюють (або аварійно завершуються) на вузлі.

## {{% heading "prerequisites" %}} {#before-you-begin}

* Ваш {{< glossary_tooltip text="Pod" term_id="pod" >}} уже має бути запланований і запущений. Якщо ваш Pod ще не запущений, почніть з [Налагодження Podʼів](/docs/tasks/debug/debug-application/).
* Для деяких з розширених кроків налагодження вам потрібно знати, на якому вузлі запущений Pod, і мати доступ до оболонки для виконання команд на цьому вузлі. Вам не потрібен такий доступ для виконання стандартних кроків налагодження, що використовують `kubectl`.

## Використання `kubectl describe pod` для отримання деталей про Podʼи {#using-kubectl-describe-pod-to-fetch-details-about-pods}

У цьому прикладі ми використаємо Deployment для створення двох Podʼів, подібно до попереднього прикладу.

{{% code_sample file="application/nginx-with-request.yaml" %}}

Створіть Deployment такою командою:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

Перевірте статус Podʼів такою командою:

```shell
kubectl get pods
```

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

Набагато більше інформації про кожен із цих Podʼів можна отримати за допомогою `kubectl describe pod`. Наприклад:

```shell
kubectl describe pod nginx-deployment-67d4bdd6f5-w6kd7
```

```none
Name:         nginx-deployment-67d4bdd6f5-w6kd7
Namespace:    default
Priority:     0
Node:         kube-worker-1/192.168.0.113
Start Time:   Thu, 17 Feb 2022 16:51:01 -0500
Labels:       app=nginx
              pod-template-hash=67d4bdd6f5
Annotations:  <none>
Status:       Running
IP:           10.88.0.3
IPs:
  IP:           10.88.0.3
  IP:           2001:db8::1
Controlled By:  ReplicaSet/nginx-deployment-67d4bdd6f5
Containers:
  nginx:
    Container ID:   containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 17 Feb 2022 16:51:05 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-bgsgp (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  kube-api-access-bgsgp:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  34s   default-scheduler  Successfully assigned default/nginx-deployment-67d4bdd6f5-w6kd7 to kube-worker-1
  Normal  Pulling    31s   kubelet            Pulling image "nginx"
  Normal  Pulled     30s   kubelet            Successfully pulled image "nginx" in 1.146417389s
  Normal  Created    30s   kubelet            Created container nginx
  Normal  Started    30s   kubelet            Started container nginx
```

Тут ви можете побачити інформацію про конфігурацію контейнерів і Podʼа (мітки, вимоги до ресурсів тощо), а також інформацію про статус контейнерів і Podʼа (стан, готовність, кількість перезапусків, події тощо).

Стан контейнера — Waiting, Running або Terminated. Залежно від стану надається додаткова інформація: тут видно, що для контейнера в стані Running система повідомляє, коли контейнер запустився.

Ready показує, чи пройшов контейнер останню пробу готовності. (У цьому випадку контейнер не має налаштованої проби готовності; вважається, що контейнер готовий, якщо проба готовності не налаштована.)

Restart Count показує, скільки разів контейнер перезапускався; ця інформація може бути корисною для виявлення циклів аварійного перезапуску в контейнерах з політикою перезапуску `Always`.

Наразі єдиний стан (Condition), повʼязаний з Podʼом, — двійковий стан Ready, який показує, що Pod може обслуговувати запити й має бути доданий до пулів балансування навантаження всіх відповідних Service.

Нарешті, ви бачите журнал останніх подій, повʼязаних з вашим Podʼом. "From" вказує на компонент, який записує подію в лог. "Reason" і "Message" пояснюють, що сталося.

## Приклад: налагодження Podʼів у стані Pending {#example-debugging-pending-pods}

Поширений сценарій, який можна виявити за допомогою подій, — коли ви створили Pod, що не вміщується на жодному вузлі. Наприклад, Pod може запитувати більше ресурсів, ніж вільно на будь-якому вузлі, або вказувати селектор міток, якому не відповідає жоден вузол. Скажімо, ми створили попередній Deployment з 5 репліками (замість 2), які запитують 600 мілі-ядер замість 500, у кластері з чотирьох вузлів, де кожна (віртуальна) машина має 1 CPU. У такому разі один з Podʼів не вдасться запланувати. (Зверніть увагу, що через Podʼи надбудов кластера, такі як fluentd, skydns тощо, які працюють на кожному вузлі, якби ми запросили 1000 мілі-ядер, жоден з Podʼів не вдалося б запланувати.)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

Щоб дізнатися, чому Pod nginx-deployment-1370807587-fz9sd не працює, можна виконати `kubectl describe pod` для Podʼа в стані Pending і переглянути його події:

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

Тут видно подію, створену планувальником, яка повідомляє, що Pod не вдалося запланувати з причиною `FailedScheduling` (і, можливо, з іншими). Повідомлення каже, що на жодному з вузлів не було достатньо ресурсів для Podʼа.

Щоб виправити ситуацію, можна за допомогою `kubectl scale` оновити Deployment і вказати чотири або менше реплік. (Або можна залишити один Pod у стані Pending, це нешкідливо.)

Події, подібні до тих, що ви бачили в кінці виводу `kubectl describe pod`, зберігаються в etcd і дають загальне уявлення про те, що відбувається в кластері. Щоб вивести всі події, можна використати

```shell
kubectl get events
```

але памʼятайте, що події належать до простору імен. Це означає, що якщо вас цікавлять події для обʼєкта в просторі імен (наприклад, що сталося з Podʼами в просторі імен `my-namespace`), потрібно явно вказати простір імен у команді:

```shell
kubectl get events --namespace=my-namespace
```

Щоб побачити події з усіх просторів імен, ви можете використовувати аргумент `--all-namespaces`.

Крім `kubectl describe pod`, ще один спосіб отримати додаткову інформацію про Pod (понад ту, що надає `kubectl get pod`) — передати команді `kubectl get pod` прапорець формату виводу `-o yaml`. Так ви отримаєте у форматі YAML ще більше інформації, ніж від `kubectl describe pod`, — фактично всю інформацію, яку система має про Pod. Тут ви побачите, зокрема, анотації (метадані у вигляді пар ключ-значення без обмежень, що діють для міток, які внутрішньо використовують компоненти системи Kubernetes), політику перезапуску, порти й томи.

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-02-17T21:51:01Z"
  generateName: nginx-deployment-67d4bdd6f5-
  labels:
    app: nginx
    pod-template-hash: 67d4bdd6f5
  name: nginx-deployment-67d4bdd6f5-w6kd7
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nginx-deployment-67d4bdd6f5
    uid: 7d41dfd4-84c0-4be4-88ab-cedbe626ad82
  resourceVersion: "1364"
  uid: a6501da1-0447-4262-98eb-c03d4002222e
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-bgsgp
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: kube-worker-1
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: kube-api-access-bgsgp
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    image: docker.io/library/nginx:latest
    imageID: docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2022-02-17T21:51:05Z"
  hostIP: 192.168.0.113
  phase: Running
  podIP: 10.88.0.3
  podIPs:
  - ip: 10.88.0.3
  - ip: 2001:db8::1
  qosClass: Guaranteed
  startTime: "2022-02-17T21:51:01Z"
```

## Перегляд логів Podʼа {#examine-pod-logs}

Спочатку перегляньте логи ураженого контейнера:

```shell
kubectl logs ${POD_NAME} -c ${CONTAINER_NAME}
```

Якщо ваш контейнер раніше аварійно завершився, лог аварійного завершення попереднього контейнера можна переглянути так:

```shell
kubectl logs ${POD_NAME} -c ${CONTAINER_NAME} --previous
```

## Налагодження за допомогою виконання команд у контейнері {#container-exec}

Якщо {{< glossary_tooltip text="образ контейнера" term_id="image" >}} містить утиліти для налагодження, як-от образи, зібрані на основі базових образів ОС Linux і Windows, можна виконувати команди в конкретному контейнері за допомогою `kubectl exec`:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` є необовʼязковим. Ви можете опустити його для Podʼів, які містять лише один контейнер.
{{< /note >}}

Наприклад, щоб переглянути логи запущеного Podʼа Cassandra, можна виконати

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

Можна запустити оболонку, підʼєднану до вашого термінала, за допомогою аргументів `-i` і `-t` команди `kubectl exec`, наприклад:

```shell
kubectl exec -it cassandra -- sh
```

Докладніше дивіться [Отримання доступу до оболонки запущеного контейнера](
/docs/tasks/debug/debug-application/get-shell-running-container/).

## Налагодження за допомогою ефемерного контейнера налагодження {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

{{< glossary_tooltip text="Ефемерні контейнери" term_id="ephemeral-container" >}} корисні для інтерактивного усунення несправностей, коли `kubectl exec` недостатньо, тому що контейнер аварійно завершився або образ контейнера не містить утиліт налагодження, як, наприклад, [образи distroless](
https://github.com/GoogleContainerTools/distroless).

### Дозволи для ефемерних контейнерів {#ephemeral-container-permissions}

З міркувань безпеки для додавання ефемерного контейнера до запущеного Podʼа використовується підресурс `ephemeralcontainers` цього Podʼа. На рівні API це запит **update** до `pods/ephemeralcontainers`. Самого лише дозволу на **patch** Podʼа недостатньо, щоб користувачі могли додавати до нього ефемерні контейнери.

Підресурс `pods/ephemeralcontainers` навмисно не входить до стандартних [ClusterRole для користувачів](/docs/reference/access-authn-authz/rbac/#user-facing-roles) `admin` і `edit`. Чому так, дивіться в розділі [Ефемерні контейнери: контроль доступу](/docs/concepts/workloads/pods/ephemeral-containers/#access-control).

Якщо запустити `kubectl debug`, щоб додати ефемерний контейнер, без потрібного дозволу, ви побачите помилку, подібну до такої:

```
Error from server (Forbidden): pods "example" is forbidden: User "alice" cannot
patch resource "pods/ephemeralcontainers" in API group "" in the namespace "example-ns"
```

Якщо ви керуєте доступом до кластера і ваш кластер використовує [RBAC Kubernetes](/docs/reference/access-authn-authz/rbac/), цей дозвіл можна надати одним із двох способів.

Щоб розширити вбудовані ClusterRole `edit` і `admin` для всього кластера, створіть агреговану ClusterRole з міткою для [агрегації ClusterRole](/docs/reference/access-authn-authz/rbac/#aggregated-clusterroles). Достатньо мітки `aggregate-to-edit`, оскільки стандартна ClusterRole `edit` сама агрегується в `admin`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-ephemeralcontainers-edit
  labels:
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: [""]
  resources: ["pods/ephemeralcontainers"]
  verbs: ["patch", "update"]
```

Щоб надати дозвіл лише певним користувачам або групам (наприклад, окремій групі для налагодження або SRE), створіть вужчу ClusterRole і привʼяжіть її безпосередньо:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: debug-ephemeralcontainers
rules:
- apiGroups: [""]
  resources: ["pods/ephemeralcontainers"]
  verbs: ["patch", "update"]
```

{{< note >}}
Ефемерні контейнери перевіряються механізмом [Pod Security admission](/docs/concepts/security/pod-security-admission/) на відповідність тим самим [стандартам безпеки Podʼів](/docs/concepts/security/pod-security-standards/), що й звичайні контейнери. Надаючи дозвіл на додавання ефемерних контейнерів до Podʼів, на які поширюється політика `baseline` або `restricted`, виберіть відповідний [профіль налагодження](#debugging-profiles), наприклад `--profile=baseline` або `--profile=restricted` для `kubectl debug`.

Вебхуки допуску або політики допуску у вашому кластері, які не перевіряють поле `ephemeralContainers`, також може знадобитися оновити, щоб вони перехоплювали ресурс `pods/ephemeralcontainers` і перевіряли поле `ephemeralContainers` у специфікації Podʼа.
{{< /note >}}

### Приклад налагодження за допомогою ефемерних контейнерів {#ephemeral-container-example}

Ви можете використовувати команду `kubectl debug`, щоб додати ефемерні контейнери до запущеного Podʼа. Спочатку створіть Pod для прикладу:

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

Приклади в цьому розділі використовують образ контейнера `pause`, оскільки він не містить утиліт налагодження, але цей метод працює з усіма образами контейнерів.

Якщо ви спробуєте використати `kubectl exec` для створення оболонки, ви побачите помилку, оскільки в цьому образі контейнера немає оболонки.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

Натомість можна додати контейнер налагодження за допомогою `kubectl debug`. Якщо вказати аргумент `-i`/`--interactive`, `kubectl` автоматично підʼєднається до консолі ефемерного контейнера.

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

Ця команда додає новий контейнер busybox і підʼєднується до нього. Параметр `--target` вказує на простір імен процесів іншого контейнера. Він потрібен тут, тому що `kubectl run` не вмикає [спільний простір імен процесів](
/docs/tasks/configure-pod-container/share-process-namespace/) у Podʼі, який створює.

{{< note >}}
Параметр `--target` має підтримуватися {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}. Якщо його не підтримано, ефемерний контейнер може не запуститися або запуститися з ізольованим простором імен процесів, і `ps` не показуватиме процеси в інших контейнерах.
{{< /note >}}

Стан новоствореного ефемерного контейнера можна переглянути за допомогою `kubectl describe`:

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

Коли закінчите, видаліть Pod за допомогою `kubectl delete`:

```shell
kubectl delete pod ephemeral-demo
```

## Налагодження за допомогою копії Podʼа {#debugging-using-a-copy-of-the-pod}

Іноді параметри конфігурації Podʼа ускладнюють усунення несправностей у певних ситуаціях. Наприклад, не можна виконати `kubectl exec`, щоб усунути несправності контейнера, якщо образ контейнера не містить оболонки або якщо ваш застосунок аварійно завершується під час запуску. У таких ситуаціях можна за допомогою `kubectl debug` створити копію Podʼа зі зміненими значеннями конфігурації, що полегшують налагодження.

### Копіювання Podʼа з додаванням нового контейнера {#copying-a-pod-while-adding-a-new-container}

Додавання нового контейнера може бути корисним, коли ваш застосунок працює, але поводиться не так, як ви очікуєте, і ви хочете додати до Podʼа додаткові утиліти для усунення несправностей.

Наприклад, можливо, образи контейнерів вашого застосунку зібрані на основі `busybox`, але вам потрібні утиліти налагодження, яких немає в `busybox`. Цей сценарій можна змоделювати за допомогою `kubectl run`:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Виконайте цю команду, щоб створити копію `myapp` з назвою `myapp-debug`, яка додає новий контейнер Ubuntu для налагодження:

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}

* `kubectl debug` автоматично генерує назву контейнера, якщо ви не задали її прапорцем `--container`.
* Прапорець `-i` стандартно змушує `kubectl debug` підʼєднатися до нового контейнера. Щоб цього уникнути, вкажіть `--attach=false`. Якщо сесію буде розірвано, можна знову підʼєднатися за допомогою `kubectl attach`.
* `--share-processes` дозволяє контейнерам у цьому Podʼі бачити процеси інших контейнерів Podʼа. Докладніше про те, як це працює, дивіться [Спільний простір імен процесів для контейнерів у Podʼі](
  /docs/tasks/configure-pod-container/share-process-namespace/).
{{< /note >}}

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

### Копіювання Podʼа зі зміною його команди {#copying-a-pod-while-changing-its-command}

Іноді корисно змінити команду для контейнера, наприклад, щоб додати прапорець для налагодження або через те, що застосунок аварійно завершується.

Щоб симулювати аварійне завершення застосунку, використайте `kubectl run`, щоб створити контейнер, який негайно завершується:

```
kubectl run --image=busybox:1.28 myapp -- false
```

Ви можете побачити за допомогою `kubectl describe pod myapp`, що цей контейнер аварійно завершується:

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

Можна за допомогою `kubectl debug` створити копію цього Podʼа з командою, заміненою на інтерактивну оболонку:

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

Тепер у вас є інтерактивна оболонка, яку ви можете використовувати для виконання завдань, таких як перевірка шляхів файлової системи або виконання команди контейнера вручну.

{{< note >}}

* Щоб змінити команду для конкретного контейнера, вам потрібно вказати його назву за допомогою `--container`, інакше `kubectl debug` створить новий контейнер для виконання вказаної вами команди.
* Прапорець `-i` стандартно змушує `kubectl debug` підʼєднатися до контейнера. Щоб цього уникнути, вкажіть `--attach=false`. Якщо сесію буде розірвано, можна знову підʼєднатися за допомогою `kubectl attach`.
{{< /note >}}

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

### Копіювання Podʼа з заміною образів контейнерів {#copying-a-pod-while-changing-container-images}

У деяких ситуаціях вам може знадобитися замінити звичайні робочі образи контейнерів Podʼа, що поводиться неправильно, на образ зі збіркою для налагодження або з додатковими утилітами.

Наприклад, створіть Pod за допомогою `kubectl run`:

```
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Тепер за допомогою `kubectl debug` створіть копію та змініть її образ контейнера на `ubuntu`:

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

Синтаксис `--set-image` використовує той самий синтаксис `container_name=image`, що й `kubectl set image`. `*=ubuntu` означає зміну образу всіх контейнерів на `ubuntu`.

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

## Налагодження через оболонку на вузлі {#node-shell-session}

Якщо жоден з цих підходів не працює, ви можете знайти вузол, на якому працює Pod, і створити Pod, який буде виконуватися на цьому вузлі. Щоб створити інтерактивну оболонку на вузлі за допомогою `kubectl debug`, виконайте:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

Створюючи сесію налагодження на вузлі, памʼятайте, що:

* `kubectl debug` автоматично генерує назву нового Podʼа на основі назви вузла.
* Коренева файлова система вузла буде змонтована в `/host`.
* Контейнер працює в просторах імен IPC, Network і PID хоста, хоча Pod не привілейований, тому читання деякої інформації про процеси може не вдатися, і `chroot /host` може не спрацювати.
* Якщо вам потрібен привілейований Pod, створіть його вручну або використайте прапорець `--profile=sysadmin`.

Не забудьте прибрати Pod для налагодження, коли ви закінчите з ним:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

### Захоплення та аналіз трафіку вузла/Podʼа {#capturing-and-analyzing-node-pod-traffic}

Під час налагодження проблем з мережею захоплення та аналіз мережевого трафіку з вузлів/Podʼів може дати цінну інформацію про проблеми зі зʼєднанням, збої розвʼязання DNS або неочікувану поведінку мережі.

Ви можете використовувати `kubectl debug` з прапорцем `--profile=sysadmin`, щоб запускати інструменти захоплення мережевого трафіку на вузлі. Спочатку створіть сесію налагодження на вузлі, де працює ваш Pod:

```shell
kubectl debug --profile=sysadmin node/${NODE_NAME} -it --image=ubuntu:latest
```

Після входу в контейнер налагодження встановіть tcpdump і захопіть трафік на мережевих інтерфейсах вузла:

```shell
apt-get update && apt-get install -y tcpdump
tcpdump -i any -n
```

{{< note >}}
Не забудьте прибрати Pod для налагодження, коли ви закінчите з ним:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

{{< /note >}}

Ви також можете захоплювати трафік з конкретного Podʼа:

```shell
kubectl debug --profile=sysadmin pod/${POD_NAME} -n ${NAMESPACE} -it --image=ubuntu:latest
```

Потім виконайте ту саму команду `tcpdump` у контейнері налагодження, щоб захопити трафік з мережевого простору імен Podʼа.

## Налагодження Podʼа або вузла із застосуванням профілю {#debugging-profiles}

Коли ви використовуєте `kubectl debug` для налагодження вузла через Pod налагодження, Podʼа через ефемерний контейнер або скопійованого Podʼа, до них можна застосувати профіль. Застосування профілю встановлює певні властивості, такі як [securityContext](/docs/tasks/configure-pod-container/security-context/), що дає змогу пристосуватися до різних сценаріїв. Є два типи профілів: static і custom.

### Застосування профілю static {#static-profile}

Профіль static — це набір наперед визначених властивостей, які можна застосувати за допомогою прапорця `--profile`. Доступні такі профілі:

| Профіль      | Опис                                                               |
| ------------ | ------------------------------------------------------------------ |
| legacy       | Набір властивостей для зворотної сумісності з поведінкою 1.22      |
| general      | Обґрунтований набір загальних властивостей для будь-якого налагодження |
| baseline     | Набір властивостей, сумісних з [політикою baseline PodSecurityStandard](/docs/concepts/security/pod-security-standards/#baseline) |
| restricted   | Набір властивостей, сумісних з [політикою restricted PodSecurityStandard](/docs/concepts/security/pod-security-standards/#restricted) |
| netadmin     | Набір властивостей, включаючи привілеї адміністратора мережі       |
| sysadmin     | Набір властивостей, включаючи привілеї системного адміністратора (root) |

{{< note >}}
Якщо ви не вкажете `--profile`, стандартно використовується профіль `legacy`, але його планується найближчим часом визнати застарілим. Тому рекомендується використовувати інші профілі, такі як `general`.
{{< /note >}}

Припустимо, що ви створюєте Pod і налагоджуєте його. Спочатку створіть Pod з назвою `myapp`, наприклад:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Потім налагодьте Pod за допомогою ефемерного контейнера. Якщо ефемерному контейнеру потрібні привілеї, можна використати профіль `sysadmin`:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=sysadmin
```

```
Targeting container "myapp". If you don't see processes from this container it may be because the container runtime doesn't support this feature.
Defaulting debug container name to debugger-6kg4x.
If you don't see a command prompt, try pressing enter.
/ #
```

Перевірте можливості процесу ефемерного контейнера, виконавши таку команду в контейнері:

```shell
/ # grep Cap /proc/$$/status
```

```
...
CapPrm:	000001ffffffffff
CapEff:	000001ffffffffff
...
```

Це означає, що завдяки профілю `sysadmin` процесу контейнера надано всі можливості, як привілейованому контейнеру. Докладніше про [можливості](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Ви також можете перевірити, що ефемерний контейнер був створений як привілейований контейнер:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"privileged":true}
```

Приберіть Pod, коли закінчите з ним:

```shell
kubectl delete pod myapp
```

### Застосування профілю custom {#custom-profile}

{{< feature-state for_k8s_version="v1.32" state="stable" >}}

Можна визначити часткову специфікацію контейнера для налагодження як профіль custom у форматі YAML або JSON і застосувати його за допомогою прапорця `--custom`.

{{< note >}}
Профіль custom підтримує лише зміну специфікації контейнера, але зміни полів `name`, `image`, `command`, `lifecycle` і `volumeDevices` специфікації контейнера не дозволені. Зміну специфікації Podʼа він не підтримує.
{{< /note >}}

Створіть Pod з назвою `myapp`, наприклад:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Створіть профіль custom у форматі YAML або JSON. Тут створимо файл у форматі YAML з назвою `custom-profile.yaml`:

```yaml
env:
- name: ENV_VAR_1
  value: value_1
- name: ENV_VAR_2
  value: value_2
securityContext:
  capabilities:
    add:
    - NET_ADMIN
    - SYS_TIME

```

Виконайте цю команду, щоб налагодити Pod за допомогою ефемерного контейнера з профілем custom:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=general --custom=custom-profile.yaml
```

Можна перевірити, що ефемерний контейнер додано до цільового Podʼа із застосованим профілем custom:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].env}'
```

```
[{"name":"ENV_VAR_1","value":"value_1"},{"name":"ENV_VAR_2","value":"value_2"}]
```

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"capabilities":{"add":["NET_ADMIN","SYS_TIME"]}}
```

Закінчивши роботу, приберіть Pod:

```shell
kubectl delete pod myapp
```

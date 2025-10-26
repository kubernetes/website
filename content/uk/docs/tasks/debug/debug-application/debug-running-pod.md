---
title: Налагодження запущених Podʼів
content_type: task
---

<!-- overview -->

Ця сторінка пояснює, як налагоджувати Podʼи, що запущені (або зазнають збою) на вузлі.

## {{% heading "prerequisites" %}}

* Ваш {{< glossary_tooltip text="Pod" term_id="pod" >}} вже повинен бути запланований та запущений. Якщо ваш Pod ще не запущений, почніть з [Налагодження Podʼів](/docs/tasks/debug/debug-application/).
* Для деяких з розширених кроків налагодження вам потрібно знати, на якому вузлі запущений Pod, і мати доступ до оболонки для виконання команд на цьому вузлі. Вам не потрібен такий доступ для виконання стандартних кроків налагодження, що використовують `kubectl`.

## Використання `kubectl describe pod` для отримання деталей про Podʼи {#using-kubectl-describe-pod-to-fetch-details-about-pods}

Для цього прикладу ми використовуватимемо Deployment для створення двох Podʼів, схожих на попередній приклад.

{{% code_sample file="application/nginx-with-request.yaml" %}}

Створіть Deployment, запустивши наступну команду:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

Перевірте статус Podʼа за допомогою наступної команди:

```shell
kubectl get pods
```

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

Ми можемо отримати більше інформації про кожен з цих Podʼів, використовуючи `kubectl describe pod`. Наприклад:

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

Тут ви можете побачити інформацію про конфігурацію контейнерів та Podʼа (мітки, вимоги до ресурсів і т. д.), а також інформацію про статус контейнерів та Podʼа (стан, готовність, кількість перезапусків, події й т.д.).

Стан контейнера може бути Waiting (очікування), Running (виконання) або Terminated (завершено). Залежно від стану, буде надано додаткову інформацію — наприклад, ви можете побачити, коли контейнер був запущений, якщо він перебуває в стані Running.

Ready показує, чи пройшов контейнер останню пробу готовності. (У цьому випадку контейнер не має налаштованої проби готовності; вважається, що контейнер готовий, якщо проба готовності не налаштована.)

Restart Count показує, скільки разів контейнер був перезапущений; ця інформація може бути корисною для виявлення циклів аварійного перезапуску в контейнерах, які налаштовані на перезапуск `Always` (завжди).

Наразі єдина умова, повʼязана з Podʼом, — це бінарна умова Ready, яка вказує, що Pod може обслуговувати запити та повинен бути доданий до пулів балансування навантаження всіх відповідних Serviceʼів.

Нарешті, ви бачите логи недавніх подій, що стосуються вашого Podʼа. "From" вказує на компонент, який реєструє подію. "Reason" та "Message" розповідають вам, що сталося.

## Приклад: налагодження Podʼів у стані Pending {#example-debugging-pending-pods}

Одна з поширених ситуацій, яку ви можете виявити за допомогою подій, — це коли ви створили Pod, який не може бути розміщений на жодному вузлі. Наприклад, Pod може вимагати більше ресурсів, ніж вільно на будь-якому вузлі, або він може вказати селектор міток, який не відповідає жодному вузлу. Скажімо, ми створили Deployment з 5 репліками (замість 2) і вимагаємо 600 міліядер замість 500, на чотирьох вузловому кластері, де кожна (віртуальна) машина має 1 ЦП. У цьому випадку один з Podʼів не зможе бути запланованим. (Зауважте, що через надбудови кластера, такі як fluentd, skydns тощо, які працюють на кожному вузлі, якби ми запросили 1000 міліядер, то жоден з Podʼів не міг би бути запланованим.)

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

Щоб дізнатися, чому Pod nginx-deployment-1370807587-fz9sd не працює, ми можемо використовувати `kubectl describe pod` у Podʼі у стані Pending та переглянути його події:

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

Тут ви можете побачити подію, створену планувальником, яка говорить, що Pod не вдалося запланувати з причиною `FailedScheduling` (і, можливо, інші). Повідомлення говорить нам, що на будь-якому з вузлів не було достатньо ресурсів для Podʼа.

Для виправлення цієї ситуації ви можете використовувати `kubectl scale`, щоб оновити ваш Deployment та вказати чотири або менше реплік. (Або ви можете залишити один Pod у стані Pending, що нешкідливо.)

Події, такі як ті, які ви бачили в кінці `kubectl describe pod`, зберігаються в etcd та надають високорівневу інформацію про те, що відбувається в кластері. Щоб переглянути всі події, ви можете використовувати

```shell
kubectl get events
```

але вам потрібно памʼятати, що події належать до простору імен. Це означає, що якщо вас цікавлять події для обʼєкта з простором імен (наприклад, що сталося з Podʼами в просторі імен `my-namespace`), вам потрібно явно вказати простір імен для команди:

```shell
kubectl get events --namespace=my-namespace
```

Щоб побачити події з усіх просторів імен, ви можете використовувати аргумент `--all-namespaces`.

Крім команди `kubectl describe pod`, інший спосіб отримати додаткову інформацію про Pod (поза тим, що надає `kubectl get pod`) — це передати прапорець формату виводу `-o yaml` команді `kubectl get pod`. Це надасть вам, у форматі YAML, ще більше інформації, ніж `kubectl describe pod` — фактично всю інформацію, яку система має про Pod. Тут ви побачите такі речі, як анотації (це метадані ключ-значення без обмежень міток, які використовуються внутрішньо компонентами системи Kubernetes), політику перезапуску, порти та томи.

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

## Перегляд логі Podʼа {#examine-pod-logs}

Спочатку перегляньте журнали ураженого контейнера:

```shell
kubectl logs ${POD_NAME} -c ${CONTAINER_NAME}
```

Якщо ваш контейнер раніше впав, ви можете отримати доступ до попереднього логу аварії контейнера за допомогою:

```shell
kubectl logs ${POD_NAME} -c ${CONTAINER_NAME} --previous
```

## Налагодження за допомогою виконання команд у контейнері {#container-exec}

Якщо {{< glossary_tooltip text="образ контейнера" term_id="image" >}} містить утиліти для налагодження, як це трапляється в образах, побудованих на основі базових образів операційних систем Linux і Windows, ви можете виконати команди всередині конкретного контейнера за допомогою `kubectl exec`:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` є необовʼязковим. Ви можете опустити його для Podʼів, які містять лише один контейнер.
{{< /note >}}

Наприклад, щоб переглянути логи з робочого Podʼа Cassandra, ви можете виконати

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

Ви можете запустити оболонку, яка підключена до вашого термінала, використовуючи аргументи `-i` і `-t` для `kubectl exec`, наприклад:

```shell
kubectl exec -it cassandra -- sh
```

Для отримання додаткових відомостей дивіться [Отримання оболонки до запущеного контейнера](/docs/tasks/debug/debug-application/get-shell-running-container/).

## Налагодження за допомогою ефемерного контейнера {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

{{< glossary_tooltip text="Ефемерні контейнери" term_id="ephemeral-container" >}} корисні для інтерактивного усунення несправностей, коли `kubectl exec` недостатній через аварію контейнера або те, що образ контейнера не містить утиліт для налагодження, наприклад, в [образах distroless](https://github.com/GoogleContainerTools/distroless).

### Приклад налагодження за допомогою ефемерних контейнерів {#ephemeral-container-example}

Ви можете використовувати команду `kubectl debug`, щоб додати ефемерні контейнери до запущеного Podʼа. Спочатку створіть Pod для прикладу:

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

У цьому розділі приклади використовують образ контейнера `pause`, оскільки він не містить утиліт для налагодження, але цей метод працює з будь-якими образом контейнера.

Якщо ви спробуєте використати `kubectl exec` для створення оболонки, ви побачите помилку, оскільки в цьому образі контейнера немає оболонки.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```none
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

Замість цього ви можете додати контейнер для налагодження за допомогою `kubectl debug`. Якщо ви вказуєте аргумент `-i`/`--interactive`, `kubectl` автоматично приєднується до консолі ефемерного контейнера.

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
```

```none
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

Ця команда додає новий контейнер busybox і приєднується до нього. Параметр `--target` спрямовує простір імен процесу до іншого контейнера. Це необхідно тут, оскільки `kubectl run` не ввімкнув [процес спільного використання простору імен](/docs/tasks/configure-pod-container/share-process-namespace/) у Pod, який він створює.

{{< note >}}
Параметр `--target` повинен підтримуватись {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}. Якщо не підтримується, то ефемерний контейнер не може бути запущений, або він може бути запущений з ізольованим простором імен процесу, так що команда `ps` не відображатиме процеси в інших контейнерах.
{{< /note >}}

Ви можете переглянути стан нового ефемерного контейнера, використовуючи `kubectl describe`:

```shell
kubectl describe pod ephemeral-demo
```

```none
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

Використовуйте `kubectl delete`, щоб видалити Pod, коли ви закінчите:

```shell
kubectl delete pod ephemeral-demo
```

## Налагодження за допомогою копії Podʼа {#debuging-using-copy-of-the-pod}

Іноді параметри конфігурації Podʼа ускладнюють усунення несправностей у певних ситуаціях. Наприклад, ви не можете виконувати `kubectl exec`, щоб усунути несправності у вашому контейнері, якщо ваш образ контейнера не містить оболонки або якщо ваш застосунок аварійно завершується при запуску. У цих ситуаціях ви можете використовувати `kubectl debug`, щоб створити копію Podʼа зі зміненими значеннями конфігурації для полегшення налагодження.

### Копіювання Podʼа з додаванням нового контейнера {#copying-a-pod-while-adding-a-new-container}

Додавання нового контейнера може бути корисним, коли ваш застосунок працює, але не так, як ви очікували, і ви хочете додати додаткові засоби усунення несправностей до Podʼа.

Наприклад, можливо, образ контейнера вашого застосунку збудований на основі `busybox`, але вам потрібні засоби для налагодження, які не включені в `busybox`. Ви можете симулювати цей сценарій за допомогою `kubectl run`:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Виконайте цю команду, щоб створити копію `myapp` з назвою `myapp-debug`, яка додає новий контейнер Ubuntu для налагодження:

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```none
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}

* `kubectl debug` автоматично генерує назву контейнера, якщо ви не вибрали одну за допомогою прапорця `--container`.
* Прапорець `-i` стандартно призводить до приєднання `kubectl debug` до нового контейнера. Ви можете запобігти цьому, вказавши `--attach=false`. Якщо ваша сесія розірвана, ви можете повторно приєднатися за допомогою `kubectl attach`.
* `--share-processes` дозволяє контейнерам в цьому Podʼі бачити процеси з інших контейнерів у Podʼі. Для отримання додаткової інформації про те, як це працює, див. [Спільне використання простору імен процесу між контейнерами в Podʼі](/docs/tasks/configure-pod-container/share-process-namespace/).
{{< /note >}}

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

### Копіювання Podʼа зі зміною його команди {#copying-a-pod-while-changing-its-command}

Іноді корисно змінити команду для контейнера, наприклад, щоб додати прапорець для налагодження або через те, що застосунок аварійно завершується.

Щоб симулювати аварійне завершення застосунку, використайте `kubectl run`, щоб створити контейнер, який негайно завершується:

```shell
kubectl run --image=busybox:1.28 myapp -- false
```

Ви можете побачити за допомогою `kubectl describe pod myapp`, що цей контейнер аварійно завершується:

```none
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

Ви можете використовувати `kubectl debug`, щоб створити копію цього Podʼа з командою зміненою на інтерактивну оболонку:

```shell
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```none
If you don't see a command prompt, try pressing enter.
/ #
```

Тепер у вас є інтерактивна оболонка, яку ви можете використовувати для виконання завдань, таких як перевірка шляхів файлової системи або виконання команди контейнера вручну.

{{< note >}}

* Щоб змінити команду для конкретного контейнера, вам потрібно вказати його назву за допомогою `--container`, інакше `kubectl debug` створить новий контейнер для виконання вказаної вами команди.
* Прапорець `-i` призводить до того, що `kubectl debug` автоматично приєднується до контейнера. Ви можете це запобігти, вказавши `--attach=false`. Якщо ваша сесія розірвана, ви можете повторно приєднатися за допомогою `kubectl attach`.
{{< /note >}}

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

### Копіювання Podʼа з заміною образів контейнерів {#copying-a-pod-while-changing-container-images}

Іноді вам може знадобитися змінити образ Podʼа, який поводитися неналежним чином, зі звичайного образу, що використовується в операційній діяльності, на образ, що містить збірку для налагодження або додаткові утиліти.

Наприклад, створіть Pod за допомогою `kubectl run`:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Тепер використовуйте `kubectl debug`, щоб створити копію та змінити його образ контейнера на `ubuntu`:

```shell
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

Синтаксис `--set-image` використовує ту ж синтаксис `container_name=image`, що й `kubectl set image`. `*=ubuntu` означає зміну образу всіх контейнерів на `ubuntu`.

Не забудьте прибрати Pod для налагодження, коли ви закінчите:

```shell
kubectl delete pod myapp myapp-debug
```

## Налагодження через оболонку на вузлі {#node-shell-session}

Якщо жоден з цих підходів не працює, ви можете знайти вузол, на якому працює Pod, і створити Pod, який буде виконуватися на цьому вузлі. Щоб створити інтерактивну оболонку на вузлі за допомогою `kubectl debug`, виконайте:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```none
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

При створенні сесії налагодження на вузлі майте на увазі, що:

* `kubectl debug` автоматично генерує назву нового Podʼа на основі назви вузла.
* Коренева файлова система вузла буде змонтована в `/host`.
* Контейнер працює у просторах імен IPC, мережі та PID вузла, хоча Pod не є привілейованим, тому читання деякої інформації про процеси може не вдатися, і `chroot /host` може не спрацювати.
* Якщо вам потрібен привілейований Pod, створіть його вручну або використовуйте прапорець `--profile=sysadmin`

Не забудьте прибрати Pod для налагодження, коли ви закінчите з ним:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

## Налагодження Pod або Node під час застосування профілю {#debugging-profiles}

Коли ви використовуєте `kubectl debug` для налагодження вузла за допомогою Podʼа налагодження, Pod за ефемерним контейнером або скопійованого Pod, ви можете застосувати до них профіль. Застосовуючи профіль, ви можете встановити конкретні властивості, такі як [securityContext](/docs/tasks/configure-pod-container/security-context/), що дозволяє адаптуватися до різних сценаріїв. Наразі використовується два типи профілів: static та custom.

### Застосування профілю static {#static-profile}

Профіль static є набором наперед визначених властивостей які ви можете застосовувати за допомогою прапорця `--profile`. Доступні наступні профілі:

| Профіль      | Опис                                                               |
| ------------ | ------------------------------------------------------------------ |
| legacy       | Набір властивостей для зворотної сумісності з поведінкою 1.22      |
| general      | Розумний набір загальних властивостей для кожного завдання налагодження |
| baseline     | Набір властивостей, сумісних з [Політикою базової безпеки PodSecurityStandard](/docs/concepts/security/pod-security-standards/#baseline) |
| restricted   | Набір властивостей, сумісних з [Політикою обмеженої безпеки PodSecurityStandard](/docs/concepts/security/pod-security-standards/#restricted) |
| netadmin     | Набір властивостей, включаючи привілеї адміністратора мережі       |
| sysadmin     | Набір властивостей, включаючи привілеї системного адміністратора (root) |

{{< note >}}
Якщо ви не вкажете `--profile`, стандартно використовується профіль `legacy`, але його планується найближчим часом визнати застарілим. Тому рекомендується використовувати інші профілі, такі як `general`.
{{< /note >}}

Припустимо, що ви створюєте Pod і налагоджуєте його. Спочатку створіть Pod з назвою `myapp`, наприклад:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Потім, перевірте Pod за допомогою ефемерного контейнера. Якщо ефемерному контейнеру потрібно мати привілеї, ви можете використовувати профіль `sysadmin`:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=sysadmin
```

```none
Targeting container "myapp". If you don't see processes from this container it may be because the container runtime doesn't support this feature.
Defaulting debug container name to debugger-6kg4x.
If you don't see a command prompt, try pressing enter.
/ #
```

Перевірте можливості процесу ефемерного контейнера, виконавши наступну команду всередині контейнера:

```shell
/ # grep Cap /proc/$$/status
```

```none
...
CapPrm:	000001ffffffffff
CapEff:	000001ffffffffff
...
```

Це означає, що процес контейнера наділений усіма можливостями як привілейований контейнер завдяки застосуванню профілю `sysadmin`. Дивіться більше деталей про [можливості](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Ви також можете перевірити, що ефемерний контейнер був створений як привілейований контейнер:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```none
{"privileged":true}
```

Очистіть Pod, коли ви закінчите з ним:

```shell
kubectl delete pod myapp
```

### Застосування профілю custom {#custom-profile}

{{< feature-state for_k8s_version="v1.32" state="stable" >}}

Ви можете визначити часткову специфікацію контейнера для налагодження як профіль custom у форматі JSON або YAML, та застосувати її з прапорцем `--custom`.

{{< note >}}
Профіль custom підтримує лише зміну специфікації контейнера, однак зміни полів `name`, `image`, `command`, `lifecycle` та `volumeDevices` не дозволяються. Також не підтримується зміна специфікації Podʼа.
{{< /note >}}

Створіть Pod з назвою `myapp`, наприклад:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Створіть профіль custom у форматі JSON або YAML. Тут ми створимо файл `сustom-profile.yaml` з наступним вмістом:

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

Виконайте наступну команду для налагодження Podʼа з використанням ефемерного контейнера з профілем custom:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=general --custom=custom-profile.yaml
```

Ви можете перевірити, що ефемерний контейнер було додано до Podʼа з вказаним профілем custom:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].env}'
```

```none
[{"name":"ENV_VAR_1","value":"value_1"},{"name":"ENV_VAR_2","value":"value_2"}]
```

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```none
{"capabilities":{"add":["NET_ADMIN","SYS_TIME"]}}
```

Закінчивши роботу, очистіть Pod:

```shell
kubectl delete pod myapp
```

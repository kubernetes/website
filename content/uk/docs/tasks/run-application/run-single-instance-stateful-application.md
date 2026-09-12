---
title: Запуск одноекземплярного застосунку зі збереженням стану
content_type: task
weight: 20
---

<!-- overview -->

На цій сторінці показано, як запустити одноекземплярний застосунок зі збереженням стану (Stateful) в Kubernetes, використовуючи PersistentVolume та Deployment. Застосунок — MySQL.

## {{% heading "objectives" %}}

- Створити PersistentVolume, посилаючись на диск у вашому середовищі.
- Створити Deployment MySQL.
- Використання MySQL для інших Podʼів в кластері за відомим DNS-імʼям.

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## Розгортання MySQL

Ви можете запустити stateful застосунок, створивши Deployment Kubernetes та підʼєднавши його до наявного PersistentVolume за допомогою PersistentVolumeClaim. Наприклад, цей файл YAML описує Deployment, що запускає MySQL та посилається на PersistentVolumeClaim. Файл визначає монтування тому для `/var/lib/mysql`, а потім створює PersistentVolumeClaim, який шукає том 20G. Ця заявка виконується будь-яким наявним томом, який відповідає вимогам, або за допомогою динамічного провізора.

Примітка: пароль визначений в файлі конфігурації yaml, і це не є безпечним. Див. [Kubernetes Secrets](/docs/concepts/configuration/secret/) для безпечнішого рішення.

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

1. Розгорніть PV та PVC з файлу YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

2. Розгорніть вміст файлу YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

3. Показати інформацію про Deployment:

   ```shell
   kubectl describe deployment mysql
   ```

   Вивід схожий на:

   ```none
   Name:                 mysql
   Namespace:            default
   CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
   Labels:               app=mysql
   Annotations:          deployment.kubernetes.io/revision=1
   Selector:             app=mysql
   Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
   StrategyType:         Recreate
   MinReadySeconds:      0
   Pod Template:
     Labels:       app=mysql
     Containers:
       mysql:
       Image:      mysql:9
       Port:       3306/TCP
       Environment:
         MYSQL_ROOT_PASSWORD:      password
       Mounts:
         /var/lib/mysql from mysql-persistent-storage (rw)
     Volumes:
       mysql-persistent-storage:
       Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
       ClaimName:  mysql-pv-claim
       ReadOnly:   false
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     False   MinimumReplicasUnavailable
     Progressing   True    ReplicaSetUpdated
   OldReplicaSets:       <none>
   NewReplicaSet:        mysql-63082529 (1/1 replicas created)
   Events:
     FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
     ---------    --------    -----    ----                -------------    --------    ------            -------
     33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1
   ```

4. Перегляньте Podʼи, створені Deployment:

   ```shell
   kubectl get pods -l app=mysql
   ```

   Вивід схожий на:

   ```none
   NAME                   READY     STATUS    RESTARTS   AGE
   mysql-63082529-2z3ki   1/1       Running   0          3m
   ```

5. Перевірка PersistentVolumeClaim:

   ```shell
   kubectl describe pvc mysql-pv-claim
   ```

   Вивід схожий на:

   ```none
   Name:         mysql-pv-claim
   Namespace:    default
   StorageClass:
   Status:       Bound
   Volume:       mysql-pv-volume
   Labels:       <none>
   Annotations:    pv.kubernetes.io/bind-completed=yes
                   pv.kubernetes.io/bound-by-controller=yes
   Capacity:     20Gi
   Access Modes: RWO
   Events:       <none>
   ```

## Доступ до екземпляра MySQL {#accessing-the-mysql-instance}

Попередній YAML-файл створює Service, який дозволяє іншим Podʼам в кластері отримувати доступ до бази даних. Опція Service `clusterIP: None` дозволяє імені DNS Serviceʼа безпосередньо посилатись на IP-адресу Podʼа. Це оптимально, коли у вас є лише один Pod за Service і ви не маєте наміру збільшувати кількість Podʼів.

Запустіть клієнта MySQL, щоб підʼєднатися до сервера:

```shell
kubectl run -it --rm --image=mysql:9 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

Ця команда створює новий Pod у кластері, що виконує клієнта MySQL та підʼєднується до сервера через Service. Якщо підʼєднання вдалося, ви знаєте, що ваша stateful база даних MySQL працює.

```none
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## Оновлення {#updating}

Образ або будь-яку іншу частину Deployment можна оновити як зазвичай за допомогою команди `kubectl apply`. Ось деякі заходи обережності, які специфічні для застосунків зі збереженням стану:

- Не масштабуйте застосунок. Цей варіант призначений лише для застосунків з одним екземпляром. Основний PersistentVolume можна примонтувати лише до одного Podʼа. Для кластеризованих застосунків зі збереженням стану див. [документацію StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
- Використовуйте `strategy:` `type: Recreate` в файлі конфігурації YAML Deployment. Це вказує Kubernetes _не_ використовувати постійні (rolling) оновлення. Такі оновлення не працюватимуть, оскільки ви не можете мати більше одного Podʼа, що працює одночасно. Стратегія `Recreate` зупинить перший Pod перед створенням нового з оновленою конфігурацією.

## Видалення Deployment {#deleting-a-deployment}

Видаліть розгорнуті обʼєкти за іменем:

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

Якщо ви вручну вказували PersistentVolume, вам також потрібно вручну видалити його, а також звільнити основний ресурс. Якщо ви використовували динамічного провізора, він автоматично видаляє PersistentVolume, коли бачить, що ви видалили PersistentVolumeClaim. Деякі динамічні провізори (наприклад, ті, що стосуються EBS та PD) також звільняють основний ресурс після видалення PersistentVolume.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [обʼєкти Deployment](/docs/concepts/workloads/controllers/deployment/).

- Дізнайтеся більше про [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/)

- [документація kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run)

- [Томи](/docs/concepts/storage/volumes/) та [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

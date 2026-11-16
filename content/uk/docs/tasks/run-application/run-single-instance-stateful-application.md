---
title: Запуск одноекземплярного застосунку зі збереженням стану
content_type: tutorial
weight: 20
---

<!-- overview -->

На цій сторінці показано, як запустити одноекземплярний застосунок зі збереженням стану в Kubernetes, використовуючи PersistentVolume та Deployment. Застосунок — MySQL.

## {{% heading "objectives" %}} {#objectives}

- Створити PersistentVolume, що посилається на диск у вашому середовищі.
- Створити Deployment MySQL.
- Відкрити доступ до MySQL іншим Podʼам у кластері за відомим DNS-імʼям.

## {{% heading "prerequisites" %}} {#before-you-begin}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## Розгортання MySQL {#deploy-mysql}

Ви можете запустити застосунок зі збереженням стану, створивши Deployment Kubernetes і підʼєднавши його до наявного PersistentVolume за допомогою PersistentVolumeClaim. Наприклад, цей файл YAML описує Deployment, який запускає MySQL і посилається на PersistentVolumeClaim. Файл визначає монтування тому для /var/lib/mysql, а потім створює PersistentVolumeClaim, що шукає том на 20G. Цю заявку задовольняє будь-який наявний том, що відповідає вимогам, або динамічний provisioner.

Примітка: пароль визначено у файлі конфігурації yaml, і це небезпечно. Безпечне рішення дивіться в розділі [Kubernetes Secrets](/docs/concepts/configuration/secret/).

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

1. Розгорніть PV та PVC з файлу YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

1. Розгорніть вміст файлу YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

1. Виведіть інформацію про Deployment:

   ```shell
   kubectl describe deployment mysql
   ```

   Вивід подібний до такого:

   ```
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

1. Перегляньте Podʼи, створені Deployment:

   ```shell
   kubectl get pods -l app=mysql
   ```

   Вивід подібний до такого:

   ```
   NAME                   READY     STATUS    RESTARTS   AGE
   mysql-63082529-2z3ki   1/1       Running   0          3m
   ```

1. Перевірте PersistentVolumeClaim:

   ```shell
   kubectl describe pvc mysql-pv-claim
   ```

   Вивід подібний до такого:

   ```
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

Наведений вище файл YAML створює сервіс, який дає іншим Podʼам у кластері змогу отримувати доступ до бази даних. Параметр Service `clusterIP: None` дозволяє DNS-імені Service розвʼязуватися безпосередньо в IP-адресу Podʼа. Це оптимально, коли за Service стоїть лише один Pod і ви не маєте наміру збільшувати кількість Podʼів.

Запустіть клієнта MySQL, щоб підʼєднатися до сервера:

```shell
kubectl run -it --rm --image=mysql:9 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

Ця команда створює в кластері новий Pod, у якому працює клієнт MySQL, і підʼєднує його до сервера через Service. Якщо зʼєднання встановлено, значить, ваша база даних MySQL зі збереженням стану запущена й працює.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## Оновлення {#updating}

Образ або будь-яку іншу частину Deployment можна оновити як зазвичай за допомогою команди `kubectl apply`. Ось деякі запобіжні заходи, специфічні для застосунків зі збереженням стану:

- Не масштабуйте застосунок. Це налаштування призначене лише для одноекземплярних застосунків. Базовий PersistentVolume можна змонтувати лише в один Pod. Про кластеризовані застосунки зі збереженням стану дивіться [документацію StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
- Використовуйте `strategy:` `type: Recreate` у файлі конфігурації YAML для Deployment. Це вказує Kubernetes _не_ використовувати поетапні оновлення. Поетапні оновлення не працюватимуть, оскільки одночасно не може працювати більше одного Podʼа. Стратегія `Recreate` зупинить перший Pod перед створенням нового з оновленою конфігурацією.

## Видалення Deployment {#deleting-a-deployment}

Видаліть розгорнуті обʼєкти за назвою:

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

Якщо ви надали PersistentVolume вручну, вам також потрібно вручну видалити його й звільнити базовий ресурс. Якщо ви використовували динамічний provisioner, він автоматично видаляє PersistentVolume, коли бачить, що ви видалили PersistentVolumeClaim. Деякі динамічні provisioners (наприклад, для EBS і PD) також звільняють базовий ресурс під час видалення PersistentVolume.

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [обʼєкти Deployment](/docs/concepts/workloads/controllers/deployment/).

- Дізнайтеся більше про [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/)

- [документація kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run)

- [Томи](/docs/concepts/storage/volumes/) і [постійні томи](/docs/concepts/storage/persistent-volumes/)

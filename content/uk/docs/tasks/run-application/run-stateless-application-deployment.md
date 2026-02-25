---
title: Запуск застосунку без збереження стану за допомогою Deployment
min-kubernetes-server-version: v1.9
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка показує, як запустити застосунок за допомогою обʼєкта Deployment в Kubernetes.

## {{% heading "objectives" %}}

- Створити розгортання nginx.
- Використання kubectl для виведення інформації про розгортання.
- Оновити розгортання.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

## Створення та дослідження розгортання nginx {#creating-and-exploring-an-nginx-deployment}

Ви можете запустити застосунок, створивши обʼєкт Kubernetes Deployment, і ви можете описати Deployment у файлі YAML. Наприклад, цей файл YAML описує Deployment, який використовує образ Docker nginx:1.14.2:

{{% code_sample file="application/deployment.yaml" %}}

1. Створіть Deployment на основі файлу YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

1. Виведіть інформацію про Deployment:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   Вивід схожий на:

   ```none
   Name:     nginx-deployment
   Namespace:    default
   CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
   Labels:     app=nginx
   Annotations:    deployment.kubernetes.io/revision=1
   Selector:   app=nginx
   Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:   RollingUpdate
   MinReadySeconds:  0
   RollingUpdateStrategy:  1 max unavailable, 1 max surge
   Pod Template:
     Labels:       app=nginx
     Containers:
       nginx:
       Image:              nginx:1.14.2
       Port:               80/TCP
       Environment:        <none>
       Mounts:             <none>
     Volumes:              <none>
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     True    MinimumReplicasAvailable
     Progressing   True    NewReplicaSetAvailable
   OldReplicaSets:   <none>
   NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
   No events.
   ```

1. Перегляньте Podʼи, створені розгортанням:

   ```shell
   kubectl get pods -l app=nginx
   ```

   Вивід схожий на:

   ```none
   NAME                                READY     STATUS    RESTARTS   AGE
   nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
   nginx-deployment-1771418926-r18az   1/1       Running   0          16h
   ```

1. Виведіть інформацію про Pod:

   ```shell
   kubectl describe pod <pod-name>
   ```

   де `<pod-name>` — це імʼя одного з ваших Podʼів.

## Оновлення розгортання

Ви можете оновити розгортання, застосувавши новий файл YAML. Цей файл YAML вказує, що розгортання повинне бути оновлене до nginx 1.16.1.

{{% code_sample file="application/deployment-update.yaml" %}}

1. Застосуйте новий файл YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
   ```

2. Спостерігайте, як розгортання створює Podʼи з новими іменами і видаляє старі Podʼи:

   ```shell
   kubectl get pods -l app=nginx
   ```

## Масштабування застосунку шляхом збільшення кількості реплік {#scaling-the-application-by-increasing-the-replica-count}

Ви можете збільшити кількість Podʼів у вашому Deployment, застосувавши новий YAML файл. Цей файл YAML встановлює `replicas` на 4, що вказує, що Deployment повиннен мати чотири Podʼи:

{{% code_sample file="application/deployment-scale.yaml" %}}

1. Застосуйте новий файл YAML:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
   ```

1. Перевірте, що Deployment має чотири Podʼи:

   ```shell
   kubectl get pods -l app=nginx
   ```

   Вивід схожий на:

   ```none
   NAME                               READY     STATUS    RESTARTS   AGE
   nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
   nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
   nginx-deployment-148880595-fxcez   1/1       Running   0          2m
   nginx-deployment-148880595-rwovn   1/1       Running   0          2m
   ```

## Видалення Deployment {#deleting-a-deployment}

Видаліть Deployment за іменем:

```shell
kubectl delete deployment nginx-deployment
```

## ReplicationControllers — Старий спосіб {#replicationcontrollers-the-old-way}

Перевагою створення реплікованих застосунків є використання Deployment, який своєю чергою використовує ReplicaSet. До того, як в Kubernetes були додані Deployment та ReplicaSet, репліковані застосунки конфігурувалися за допомогою [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [обʼєкти Deployment](/docs/concepts/workloads/controllers/deployment/).

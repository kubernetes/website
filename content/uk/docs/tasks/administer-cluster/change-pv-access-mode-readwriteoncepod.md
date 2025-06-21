---
title: Зміна режиму доступу до PersistentVolume на ReadWriteOncePod
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
---

<!-- overview -->

Ця сторінка показує, як змінити режим доступу наявного PersistentVolume на `ReadWriteOncePod`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Режим доступу `ReadWriteOncePod` став стабільним у релізі Kubernetes v1.29. Якщо ви використовуєте версію Kubernetes старішу за v1.29, можливо, вам доведеться увімкнути feature gate. Перевірте документацію для вашої версії Kubernetes.
{{< /note >}}

{{< note >}}
Режим доступу `ReadWriteOncePod` підтримується тільки для {{< glossary_tooltip text="CSI" term_id="csi" >}} томів. Щоб застосувати цей режим доступу до тому, вам потрібно оновити наступні [CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html) до цих версій або вище:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

## Чому слід використовувати `ReadWriteOncePod`? {#why-should-i-use-readwriteoncepod}

До версії Kubernetes v1.22 часто використовувався режим доступу `ReadWriteOnce`, щоб обмежити доступ до PersistentVolume для робочих навантажень, яким потрібен доступ одноосібного запису до сховища. Однак цей режим доступу мав обмеження: він обмежував доступ до тому одним *вузлом*, дозволяючи кільком Podʼам на одному вузлі одночасно читати та записувати в один і той же том. Це могло становити ризик для застосунків, які вимагають строгого доступу одноосібного запису для безпеки даних.

Якщо забезпечення доступу одноосібного запису є критичним для ваших робочих навантажень, розгляньте можливість міграції ваших томів на `ReadWriteOncePod`.

<!-- steps -->

## Міграція наявних PersistentVolumes {#migrating-existing-persistentvolumes}

Якщо у вас є наявні PersistentVolumes, їх можна мігрувати на використання `ReadWriteOncePod`. Підтримується тільки міграція з `ReadWriteOnce` на `ReadWriteOncePod`.

У цьому прикладі вже є `ReadWriteOnce` "cat-pictures-pvc" PersistentVolumeClaim, який привʼязаний до "cat-pictures-pv" PersistentVolume, і "cat-pictures-writer" Deployment, який використовує цей PersistentVolumeClaim.

{{< note >}}
Якщо ваш втулок сховища підтримує [Динамічне впровадження](/docs/concepts/storage/dynamic-provisioning/), "cat-pictures-pv" буде створено для вас, але його назва може відрізнятися. Щоб дізнатися назву вашого PersistentVolume, виконайте:

```shell
kubectl get pvc cat-pictures-pvc -o jsonpath='{.spec.volumeName}'
```

{{< /note >}}

І ви можете переглянути PVC перед тим, як робити зміни. Перегляньте маніфест локально або виконайте `kubectl get pvc <name-of-pvc> -o yaml`. Вивід буде схожий на:

```yaml
# cat-pictures-pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: cat-pictures-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Ось приклад Deployment, який залежить від цього PersistentVolumeClaim:

```yaml
# cat-pictures-writer-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cat-pictures-writer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cat-pictures-writer
  template:
    metadata:
      labels:
        app: cat-pictures-writer
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
        volumeMounts:
        - name: cat-pictures
          mountPath: /mnt
      volumes:
      - name: cat-pictures
        persistentVolumeClaim:
          claimName: cat-pictures-pvc
          readOnly: false
```

На першому етапі вам потрібно відредагувати `spec.persistentVolumeReclaimPolicy` вашого PersistentVolume і встановити його на `Retain`. Це забезпечить, що ваш PersistentVolume не буде видалений, коли ви видалите відповідний PersistentVolumeClaim:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

Потім вам потрібно зупинити будь-які робочі навантаження, які використовують PersistentVolumeClaim, повʼязаний з PersistentVolume, який ви хочете мігрувати, а потім видалити PersistentVolumeClaim. Уникайте вносити будь-які інші зміни до PersistentVolumeClaim, такі як зміна розміру тому, поки міграція не буде завершена.

Якщо це зроблено, вам потрібно очистити `spec.claimRef.uid` вашого PersistentVolume, щоб забезпечити можливість звʼязування PersistentVolumeClaims з ним під час перестворення:

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

Після цього замініть список дійсних режимів доступу до PersistentVolume, щоб був (тільки) `ReadWriteOncePod`:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
Режим доступу `ReadWriteOncePod` не може бути поєднаний з іншими режимами доступу. Переконайтеся, що `ReadWriteOncePod` — єдиний режим доступу до PersistentVolume при оновленні, в іншому випадку запит буде невдалим.
{{< /note >}}

Після цього вам потрібно змінити ваш PersistentVolumeClaim, щоб встановити `ReadWriteOncePod` як єдиний режим доступу. Ви також повинні встановити `spec.volumeName` PersistentVolumeClaim на назву вашого PersistentVolume, щоб забезпечити його привʼязку саме до цього конкретного PersistentVolume.

Після цього ви можете перестворити ваш PersistentVolumeClaim та запустити ваші робочі навантаження:

```shell
# ВАЖЛИВО: Переконайтеся, що ви відредагували свій PVC в cat-pictures-pvc.yaml перед застосуванням. Вам потрібно:
# - Встановити ReadWriteOncePod як єдиний режим доступу
# - Встановити spec.volumeName на "cat-pictures-pv"

kubectl apply -f cat-pictures-pvc.yaml
kubectl apply -f cat-pictures-writer-deployment.yaml
```

Нарешті, ви можете відредагувати `spec.persistentVolumeReclaimPolicy` вашого PersistentVolume і встановити його знову на `Delete`, якщо ви раніше змінювали його.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся більше про [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
* Дізнайтеся більше про [Конфігурацію Pod для використання PersistentVolume для зберігання](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)

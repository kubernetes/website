---
title: Зміна режиму доступу до PersistentVolume на ReadWriteOncePod
content_type: task
weight: 90
min-kubernetes-server-version: v1.22
---

<!-- overview -->

Ця сторінка показує, як змінити режим доступу наявного PersistentVolume на `ReadWriteOncePod`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Режим доступу `ReadWriteOncePod` став стабільним у релізі Kubernetes v1.29. Якщо ви використовуєте версію Kubernetes, старішу за v1.29, можливо, вам доведеться увімкнути функціональну можливість. Перевірте документацію для вашої версії Kubernetes.
{{< /note >}}

{{< note >}}
Режим доступу `ReadWriteOncePod` підтримується тільки для томів {{< glossary_tooltip text="CSI" term_id="csi" >}}. Щоб використовувати цей режим доступу до тому, вам потрібно оновити такі [CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html) до цих або новіших версій:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

## Чому слід використовувати `ReadWriteOncePod`? {#why-should-i-use-readwriteoncepod}

До версії Kubernetes v1.22 часто використовувався режим доступу `ReadWriteOnce`, щоб обмежити доступ до PersistentVolume для робочих навантажень, яким потрібен доступ одноосібного запису до сховища. Однак цей режим доступу мав обмеження: він обмежував доступ до тому одним *вузлом*, дозволяючи кільком Podʼам на одному вузлі одночасно читати та записувати в один і той же том. Це могло становити ризик для застосунків, які вимагають строгого доступу одноосібного запису для безпеки даних.

Якщо забезпечення доступу одноосібного запису є критичним для ваших робочих навантажень, розгляньте можливість міграції ваших томів на `ReadWriteOncePod`.

<!-- steps -->

## Міграція наявних PersistentVolumes {#migrating-existing-persistentvolumes}

Якщо у вас є наявні PersistentVolume, їх можна мігрувати на використання `ReadWriteOncePod`. Підтримується тільки міграція з `ReadWriteOnce` на `ReadWriteOncePod`.

У цьому прикладі вже є PersistentVolumeClaim "cat-pictures-pvc" з режимом `ReadWriteOnce`, привʼязаний до PersistentVolume "cat-pictures-pv", і Deployment "cat-pictures-writer", який використовує цей PersistentVolumeClaim.

{{< note >}}
Якщо ваш втулок сховища підтримує [динамічне надання](/docs/concepts/storage/dynamic-provisioning/), "cat-pictures-pv" буде створено для вас, але його назва може відрізнятися. Щоб дізнатися назву вашого PersistentVolume, виконайте:

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

Спочатку вам потрібно відредагувати `spec.persistentVolumeReclaimPolicy` вашого PersistentVolume і встановити значення `Retain`. Це гарантує, що ваш PersistentVolume не буде видалено, коли ви видалите відповідний PersistentVolumeClaim:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
```

Потім вам потрібно зупинити будь-які робочі навантаження, які використовують PersistentVolumeClaim, повʼязаний з PersistentVolume, який ви хочете мігрувати, а потім видалити PersistentVolumeClaim. Уникайте вносити будь-які інші зміни до PersistentVolumeClaim, такі як зміна розміру тому, поки міграція не буде завершена.

Після цього вам потрібно очистити `spec.claimRef.uid` вашого PersistentVolume, щоб PersistentVolumeClaim могли привʼязатися до нього після перестворення:

```shell
kubectl scale --replicas=0 deployment cat-pictures-writer
kubectl delete pvc cat-pictures-pvc
kubectl patch pv cat-pictures-pv -p '{"spec":{"claimRef":{"uid":""}}}'
```

Далі замініть список дійсних режимів доступу PersistentVolume на (лише) `ReadWriteOncePod`:

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"accessModes":["ReadWriteOncePod"]}}'
```

{{< note >}}
Режим доступу `ReadWriteOncePod` не можна поєднувати з іншими режимами доступу. Під час оновлення переконайтеся, що `ReadWriteOncePod` — єдиний режим доступу PersistentVolume, інакше запит не буде виконано.
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

Нарешті, ви можете відредагувати `spec.persistentVolumeReclaimPolicy` вашого PersistentVolume і знову встановити значення `Delete`, якщо раніше змінювали його.

```shell
kubectl patch pv cat-pictures-pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Delete"}}'
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся більше про [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
* Дізнайтеся більше про [налаштування Podʼа для використання PersistentVolume як сховища](/docs/tutorials/configuration/configure-persistent-volume-storage/)

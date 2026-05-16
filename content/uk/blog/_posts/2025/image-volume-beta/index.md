---
layout: blog
title: "Kubernetes v1.33: Томи Image (Image Volumes) переходять в стан бета!"
date: 2025-04-29T10:30:00-08:00
slug: kubernetes-v1-33-image-volume-beta
author: Sascha Grunert (Red Hat)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

[Томи Image](/blog/2024/08/16/kubernetes-1-31-image-volume-source) було представлено як альфа фіункціонал в Kubernetes v1.31, як частину [KEP-4639](https://github.com/kubernetes/enhancements/issues/4639). В Kubernetes v1.33, ця функція переходить в стан **бета**.

Зверніть увагу, що стандартно цю можливість все ще _вимкнено_, оскільки не всі [контейнерні середовища](/docs/setup/production-environment/container-runtimes) мають повну підтримку цієї можливості. [CRI-O](https://cri-o.io) підтримує початкову можливість, починаючи з версії v1.31, а у версії v1.33 буде додано підтримку Томів Image як бета-версію. containerd [додав](https://github.com/containerd/containerd/pull/10579) підтримку можливості як альфа-версію, яка буде частиною випуску v2.1.0, і працює над бета-версією в рамках [PR #11578](https://github.com/containerd/containerd/pull/11578).

### Що нового {#what-s-new}

Основною зміною у бета-версії Томів Image є підтримка монтувань [`subPath`](/docs/concepts/storage/volumes/#using-subpath) і [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) для контейнерів за допомогою `spec.containers[*].volumeMounts.[subPath,subPathExpr]`. Це дозволяє кінцевим користувачам змонтувати певну теку тому image, яку досі змонтовано у режимі лише для читання (`ro`). Це означає, що відсутні теки не можуть бути стандартно змонтовані. Що стосується інших значень `subPath` та `subPathExpr`, то Kubernetes переконається, що у вказаному шляху немає компонентів абсолютного шляху або відносного шляху, що входять до складу підшляху. З міркувань безпеки, середовища виконання контейнерів також зобовʼязані перевіряти ці вимоги двічі. Якщо вказана тека не існує у томі, то середовище виконання не зможе створити контейнер і надасть користувачеві відгук, використовуючи події kubelet.

Крім того, для томів образів додано три нові метрики для kubelet-зображень:

- `kubelet_image_volume_requested_total`: Показує кількість запитаних томів образів.
- `kubelet_image_volume_mounted_succeed_total`: Підраховує кількість успішних змонтованих томів образів.
- `kubelet_image_volume_mounted_errors_total`: Підраховує кількість невдалих монтувань томів образів.

Для використання наявної теки для конкретного тому image, використовуйте її як значення [`subPath`](/docs/concepts/storage/volumes/#using-subpath) (чи [`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment)) параметра `volumeMounts`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: image-volume
spec:
  containers:
  - name: shell
    command: ["sleep", "infinity"]
    image: debian
    volumeMounts:
    - name: volume
      mountPath: /volume
      subPath: dir
  volumes:
  - name: volume
    image:
      reference: quay.io/crio/artifact:v2
      pullPolicy: IfNotPresent
```

Потім створіть pod у вашому кластері:

```shell
kubectl apply -f image-volumes-subpath.yaml
```

Тепер ви можете приєднатись до контейнера:

```shell
kubectl attach -it image-volume bash
```

І перевірте вміст файлу з теки `dir` у цьому томі:

```shell
cat /volume/file
```

На виході ми отримаємо приблизно таке:

```none
1
```

Дякуємо, що дочитали цю статтю до кінця! SIG Node з гордістю і радістю представляє цей перехід функції в стан бета в рамках Kubernetes v1.33.

Як автор цієї статті, я хотів би підкреслити свою особливу подяку **всім** залученим особам, які брали участь у розробці!

Якщо ви хочете залишити відгук або пропозиції, не соромтеся звертатися до SIG Node, використовуючи канал [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node) або [список розсилки SIG Node](https://groups.google.com/g/kubernetes-sig-node).

## Ознайомтесь також {#further-reading}

- [Використання Томів Image в Podʼах](/docs/tasks/configure-pod-container/image-volumes)
- [Огляд томів `image`](/docs/concepts/storage/volumes/#image)

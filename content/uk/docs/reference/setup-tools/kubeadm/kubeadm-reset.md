---
title: kubeadm reset
content_type: concept
weight: 60
---

<!-- overview -->

Виконує максимально можливий відкат змін, зроблених командами `kubeadm init` або `kubeadm join`.

<!-- body -->

{{< include "generated/kubeadm_reset/_index.md" >}}

### Робочий процес {#reset-workflow}

`kubeadm reset` відповідає за очищення файлової системи вузла від файлів, створених за допомогою команд `kubeadm init` або `kubeadm join`. Для вузлів панелі управління `reset` також видаляє локального учасника стека etcd цього вузла з кластера etcd.

`kubeadm reset phase` можна використовувати для виконання окремих фаз наведеного вище робочого процесу. Щоб пропустити список фаз, ви можете використовувати прапорець `--skip-phases`, який працює аналогічно до роботи з фазами `kubeadm join` та `kubeadm init`.

### Очищення зовнішнього etcd {#external-etcd-clean-up}

`kubeadm reset` не видалить жодних даних etcd, якщо використовується зовнішній etcd. Це означає, що якщо ви знову виконаєте `kubeadm init` з використанням тих самих точок доступу etcd, ви побачите стан від попередніх кластерів.

Щоб видалити дані etcd, рекомендується використовувати клієнт, такий як etcdctl, наприклад:

```bash
etcdctl del "" --prefix
```

Дивіться [документацію etcd](https://github.com/coreos/etcd/tree/master/etcdctl) для отримання додаткової інформації.

### Відповідне завершення роботи kube-apiserver {#graceful-kube-apiserver-shutdown}

Якщо ваш `kube-apiserver` налаштований з прапорцем `--shutdown-delay-duration`, ви можете виконати наступні команди, щоб спробувати завершити роботу відповідним чином для запущеного Pod API сервера, перед тим як виконати `kubeadm reset`:

```bash
yq eval -i '.spec.containers[0].command = []' /etc/kubernetes/manifests/kube-apiserver.yaml
timeout 60 sh -c 'while pgrep kube-apiserver >/dev/null; do sleep 1; done' || true
```

## {{% heading "whatsnext" %}}

* [kubeadm init](/uk/docs/reference/setup-tools/kubeadm/kubeadm-init/) для створення вузла панелі управління Kubernetes
* [kubeadm join](/uk/docs/reference/setup-tools/kubeadm/kubeadm-join/) для приєднання робочого вузла Kubernetes до кластера

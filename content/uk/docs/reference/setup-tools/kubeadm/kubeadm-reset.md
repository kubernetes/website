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

`kubeadm reset` також підтримує прапорець `--config` для передачі структури [`ResetConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/).

### Очищення зовнішніх членів etcd {#cleanup-of-external-etcd-members}

`kubeadm reset` не видалить жодних даних etcd, якщо використовується зовнішній etcd. Це означає, що якщо ви знову виконаєте `kubeadm init` з використанням тих самих точок доступу etcd, ви побачите стан від попередніх кластерів.

Щоб видалити дані etcd, рекомендується використовувати клієнт, такий як etcdctl, наприклад:

```bash
etcdctl del "" --prefix
```

Дивіться [документацію etcd](https://github.com/coreos/etcd/tree/master/etcdctl) для отримання додаткової інформації.

### Очищення конфігурації CNI {#cleanup-of-cni-configuration}

Втулки CNI використовують теку `/etc/cni/net.d` для зберігання своїх конфігурацій. Команда `kubeadm reset` не очищує цю теку. Залишення конфігурації втулка CNI на хості може бути проблематичним, якщо той самий хост пізніше буде використано як новий вузол Kubernetes, а у цьому кластері буде розгорнуто інший втулок CNI. Це може призвести до конфлікту конфігурації між втулками CNI.

Щоб очистити теку, створіть резервну копію її вмісту, якщо потрібно, а потім виконайте наступну команду:

```bash
sudo rm -rf /etc/cni/net.d
```

### Очищення правил мережевого трафіку {#cleanup-of-network-traffic-rules}

Команда `kubeadm reset` не очищує правила iptables, nftables або IPVS, застосовані до вузла kube-proxy. Цикл контролю в kube-proxy гарантує, що правила на кожному вузлі будуть синхронізовані. Додаткові відомості наведено у статті [Віртуальні IP-адреси та службові проксі-сервери](/docs/reference/networking/virtual-ips/).

Якщо залишити правила без очищення, не повинно виникнути жодних проблем, якщо хост пізніше буде повторно використано як вузол Kubernetes або якщо він слугуватиме для інших цілей.

Якщо ви бажаєте виконати таке очищення, ви можете використати той самий контейнер kube-proxy, який використовувався у вашому кластері, і прапорець `--cleanup` у бінарному файлі `kube-proxy`:

```bash
docker run --privileged --rm registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}} sh -c "kube-proxy --cleanup && echo DONE"
```

У результаті виконання наведеної вище команди має бути виведено `DONE`. Замість Docker для запуску контейнера ви можете скористатися вашим улюбленим середовищем виконання контейнерів.

### Очищення $HOME/.kube {#cleanup-of-home-kube}

Тека `$HOME/.kube` зазвичай містить конфігураційні файли та кеш kubectl. Хоча не очищення вмісту `$HOME/.kube/cache` не є проблемою, у цій теці є один важливий файл. Це `$HOME/.kube/config` і він використовується kubectl для автентифікації на сервері Kubernetes API. Після завершення `kubeadm init` користувачеві буде запропоновано скопіювати файл `/etc/kubernetes/admin.conf` до теки `$HOME/.kube/config` і надати доступ до нього поточному користувачеві.

Команда `kubeadm reset` не очищує вміст теки `$HOME/.kube`. Залишення файлу `$HOME/.kube/config` без видалення може бути проблематичним, залежно від того, хто матиме доступ до цього хосту після виклику `kubeadm reset`. Якщо той самий кластер продовжує існувати, наполегливо рекомендуємо видалити цей файл, оскільки облікові дані адміністратора, що зберігаються в ньому, залишатимуться дійсними.

Щоб очистити теку, перегляньте її вміст, виконайте резервне копіювання, якщо потрібно, і виконайте наступну команду:

```bash
rm -rf $HOME/.kube
```

### Відповідне завершення роботи kube-apiserver {#graceful-kube-apiserver-shutdown}

Якщо ваш `kube-apiserver` налаштований з прапорцем `--shutdown-delay-duration`, ви можете виконати наступні команди, щоб спробувати завершити роботу відповідним чином для запущеного Pod API сервера, перед тим як виконати `kubeadm reset`:

```bash
yq eval -i '.spec.containers[0].command = []' /etc/kubernetes/manifests/kube-apiserver.yaml
timeout 60 sh -c 'while pgrep kube-apiserver >/dev/null; do sleep 1; done' || true
```

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для створення вузла панелі управління Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для приєднання робочого вузла Kubernetes до кластера

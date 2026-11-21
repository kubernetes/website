---
title: Виправлення помилок, повʼязаних з втулками CNI
content_type: task
weight: 40
---

<!-- overview -->

Щоб уникнути помилок, повʼязаних з втулками CNI, переконайтеся, що ви використовуєте середовище виконання контейнерів (або оновлюєтеся до такого), яке протестовано на коректну роботу з вашою версією Kubernetes.

## Про помилки "Incompatible CNI versions" та "Failed to destroy network for sandbox" {#about-the-incompatible-cni-versions-and-failed-to-destroy-network-for-sandbox-errors}

У containerd v1.6.0-v1.6.3 існують проблеми з налаштуванням і демонтажем мережі CNI для Podʼів, коли втулки CNI не оновлено та/або версію конфігурації CNI не вказано у файлах конфігурації CNI. Команда containerd повідомляє, що "ці проблеми вирішені в containerd v1.6.4."

З containerd v1.6.0-v1.6.3, якщо ви не оновите втулки CNI та/або не вкажете версію конфігурації CNI, ви можете зіткнутися з такими помилками "Incompatible CNI versions" або "Failed to destroy network for sandbox".

### Помилка "Incompatible CNI versions" {#incompatible-cni-versions-error}

Якщо версія вашого втулка CNI не відповідає версії втулка в конфігурації, тому що версія конфігурації новіша за версію втулка, у лозі containerd, найімовірніше, під час запуску Pod зʼявиться повідомлення про помилку, подібне до:

```
incompatible CNI versions; config is \"1.0.0\", plugin supports [\"0.1.0\" \"0.2.0\" \"0.3.0\" \"0.3.1\" \"0.4.0\"]"
```

Щоб виправити цю проблему, [оновіть свої втулки CNI та файли конфігурації CNI](#updating-your-cni-plugins-and-cni-config-files).

### Помилка "Failed to destroy network for sandbox" {#failed-to-destroy-network-for-sandbox-error}

Якщо версія втулка відсутня в конфігурації втулка CNI, Pod може працювати. Однак зупинка Podʼа призводить до помилки, подібної до:

```
ERROR[2022-04-26T00:43:24.518165483Z] StopPodSandbox for "b" failed
error="failed to destroy network for sandbox \"bbc85f891eaf060c5a879e27bba9b6b06450210161dfdecfbb2732959fb6500a\": invalid version \"\": the version is empty"
```

Ця помилка залишає Pod у стані "not-ready" з усе ще приєднаним мережевим простором імен. Щоб відновити роботу після цієї проблеми, [відредагуйте файл конфігурації CNI](#updating-your-cni-plugins-and-cni-config-files), щоб додати відсутню інформацію про версію. Наступна спроба зупинити Pod повинна бути успішною.

### Оновлення ваших втулків CNI та файлів конфігурації CNI {#updating-your-cni-plugins-and-cni-config-files}

Якщо ви використовуєте containerd v1.6.0-v1.6.3 та зіткнулися з помилками "Incompatible CNI versions" або "Failed to destroy network for sandbox", розгляньте можливість оновлення ваших втулків CNI та редагування файлів конфігурації CNI.

Ось огляд типових кроків для кожного вузла:

1. [Безпечно виконайте drain і cordon вузла](/docs/tasks/administer-cluster/safely-drain-node/).
1. Після зупинки ваших служб середовища виконання контейнерів та kubelet виконайте наступні операції оновлення:

   - Якщо ви використовуєте втулки CNI, оновіть їх до останньої версії.
   - Якщо ви використовуєте не-CNI втулки, замініть їх втулками CNI. Використовуйте останню версію втулків.
   - Оновіть файл конфігурації втулка, щоб вказати версію специфікації CNI, яку підтримує втулок, або узгодити з нею наявну, як показано в розділі нижче ["Приклад файлу конфігурації containerd"](#an-example-containerd-configuration-file).
   - Для `containerd` переконайтеся, що ви встановили останню версію (v1.0.0 або пізніше) втулка CNI loopback.
   - Оновіть компоненти вузла (наприклад, kubelet) до Kubernetes v1.24.
   - Оновіть або встановіть найновішу версію середовища виконання контейнерів.
1. Поверніть вузол у ваш кластер, перезапустивши ваше середовище виконання контейнерів та kubelet. Виконайте uncordon вузла (`kubectl uncordon <імʼя_вузла>`).

## Приклад файлу конфігурації containerd {#an-example-containerd-configuration-file}

Наведений нижче приклад показує конфігурацію для середовища виконання `containerd` v1.6.x, яке підтримує нещодавню версію специфікації CNI (v1.0.0).

Перегляньте документацію вашого втулка та постачальника мережі для подальших інструкцій з налаштування вашої системи.

У Kubernetes середовище виконання containerd стандартно додає до Podʼів інтерфейс loopback `lo`. Середовище виконання containerd налаштовує інтерфейс loopback через втулок CNI `loopback`. Втулок `loopback` розповсюджується як частина пакунків релізу `containerd`, які мають позначення `cni`. `containerd` v1.6.0 та новіші містять сумісний з CNI v1.0.0 втулок loopback, а також інші стандартні втулки CNI. Налаштування втулка loopback containerd виконує самостійно, і воно передбачає використання CNI v1.0.0. Це також означає, що під час запуску цієї новішої версії `containerd` версія втулка `loopback` має бути v1.0.0 або новішою.

Наведена нижче команда bash генерує приклад конфігурації CNI. Тут значення 1.0.0 для версії конфігурації призначено полю `cniVersion`, щоб використовувати його, коли `containerd` викликає втулок CNI bridge.

```bash
cat << EOF | tee /etc/cni/net.d/10-containerd-net.conflist
{
 "cniVersion": "1.0.0",
 "name": "containerd-net",
 "plugins": [
   {
     "type": "bridge",
     "bridge": "cni0",
     "isGateway": true,
     "ipMasq": true,
     "promiscMode": true,
     "ipam": {
       "type": "host-local",
       "ranges": [
         [{
           "subnet": "10.88.0.0/16"
         }],
         [{
           "subnet": "2001:db8:4860::/64"
         }]
       ],
       "routes": [
         { "dst": "0.0.0.0/0" },
         { "dst": "::/0" }
       ]
     }
   },
   {
     "type": "portmap",
     "capabilities": {"portMappings": true},
     "externalSetMarkChain": "KUBE-MARK-MASQ"
   }
 ]
}
EOF
```

Оновіть діапазони IP-адрес у наведеному вище прикладі відповідно до вашого сценарію використання та плану адресації мережі.

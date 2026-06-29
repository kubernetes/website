---
title: Обмежте доступ контейнера до ресурсів за допомогою AppArmor
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

Ця сторінка показує, як завантажити профілі AppArmor на ваших вузлах та забезпечити їх виконання в Podʼах. Щоб дізнатися більше про те, як Kubernetes може обмежувати Podʼи за допомогою AppArmor, див. [Обмеження безпеки ядра Linux для Podʼів та контейнерів](/docs/concepts/security/linux-kernel-security-constraints/#apparmor).

## {{% heading "objectives" %}}

* Ознайомитись з прикладом того, як завантажити профіль на Вузол
* Дізнайтеся, як забезпечити виконання профілю в Podʼі
* Дізнайтеся, як перевірити, що профіль завантажено
* Побачте, що відбувається, коли умови профілю порушуються
* Побачте, що відбувається, якщо профіль не може бути завантажено

## {{% heading "prerequisites" %}}

AppArmor — це необовʼязковий модуль ядра та функція Kubernetes, тому переконайтеся, що він підтримується на ваших  вузлах перед продовженням:

1. Модуль ядра AppArmor увімкнено — для того, щоб ядро Linux застосовувало профіль AppArmor, модуль ядра AppArmor повинен бути встановлений та увімкнений. Декілька дистрибутивів стандартно вмикають модуль, такі як Ubuntu і SUSE, і багато інших надають опціональну підтримку. Щоб перевірити, чи модуль увімкнено, перевірте файл `/sys/module/apparmor/parameters/enabled`:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   Kubelet перевіряє, чи AppArmor увімкнено на хості, перед тим як допустити Pod з явно налаштованим AppArmor.

2. Середовище виконання контейнерів підтримує AppArmor — всі загальні середовища виконання контейнерів, що підтримуються Kubernetes, мають підтримку AppArmor, включаючи {{< glossary_tooltip term_id="containerd" >}} та {{< glossary_tooltip term_id="cri-o" >}}. Будь ласка, зверніться до відповідної документації середовища та перевірте, що кластер відповідає вимогам до використання AppArmor.

3. Профіль завантажено — AppArmor застосовується до Podʼа, вказуючи профіль AppArmor, з яким кожен контейнер повинен працювати. Якщо будь-які вказані профілі не завантажені в ядро, Kubelet відхилить Pod. Ви можете переглянути завантажені профілі на вузлі, перевіривши файл `/sys/kernel/security/apparmor/profiles`. Наприклад:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```

   ```none
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   Для отримання додаткової інформації щодо завантаження профілів на вузли, див. [Налаштування вузлів з профілями](#setting-up-nodes-with-profiles).

<!-- lessoncontent -->

## Захист Podʼа {#securing-a-pod}

{{< note >}}
До версії Kubernetes v1.30, AppArmor вказувався через анотації. Використовуйте потрбну версію документації для перегляду документації з цим застарілим API.
{{< /note >}}

Профілі AppArmor можна вказати на рівні Podʼа або на рівні контейнера. Профіль AppArmor контейнера перевагу перед профілем Podʼа.

```yaml
securityContext:
  appArmorProfile:
    type: <тип_профілю>
```

Де `<тип_профілю>` є одним з:

* `RuntimeDefault` для використання типового профілю виконавчого середовища
* `Localhost` для використання профілю, завантаженого на хост (див. нижче)
* `Unconfined` для запуску без AppArmor

Для отримання повної інформації про API профілю AppArmor див. [Вказівки щодо обмеження AppArmor](#specifying-apparmor-confinement).

Щоб перевірити, що профіль був застосований, ви можете перевірити, що кореневий процес контейнера працює з правильним профілем, переглянувши його атрибут proc:

```shell
kubectl exec <імʼя_пода> -- cat /proc/1/attr/current
```

Вивід повинен виглядати приблизно так:

```none
cri-containerd.apparmor.d (enforce)
```

## Приклад {#example}

*Цей приклад передбачає, що ви вже налаштували кластер з підтримкою AppArmor.*

Спочатку завантажте профіль, який ви хочете використовувати на вузлах. Цей профіль блокує всі операції запису файлів:

```none
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

   # Deny all file writes.
  deny /** w,
}
```

Профіль повинен бути завантажений на всі вузли, оскільки ви не знаєте, де буде заплановано Pod. Для цього прикладу ви можете використовувати SSH для встановлення профілів, але існують інші методи, які обговорюються в [Налаштуваннях вузлів з профілями](#setting-up-nodes-with-profiles).

```shell
# Цей приклад передбачає, що імена вузлів відповідають іменам хостів і доступні через SSH.
NODES=($( kubectl get node -o jsonpath='{.items[*].status.addresses[?(.type == "Hostname")].address}' ))

for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Заборонити всі записи файлів.
  deny /** w,
}
EOF'
done
```

Потім запустіть простий Pod "Hello AppArmor" з профілем deny-write:

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

Ви можете перевірити, що контейнер дійсно працює з тим профілем, перевіривши `/proc/1/attr/current`:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

Вивід повинен бути:

```none
k8s-apparmor-example-deny-write (enforce)
```

Нарешті, ви можете побачити, що відбудеться, якщо ви порушите профіль, здійснивши спробу запису у файл:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```

```none
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

Щоб завершити, подивіться, що станеться, якщо ви спробуєте вказати профіль, який не був завантажений:

```shell
kubectl create -f /dev/stdin <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
```

```none
pod/hello-apparmor-2 created
```

Хоча Pod було створено успішно, подальший огляд покаже, що він застряг в стані очікування:

```shell
kubectl describe pod hello-apparmor-2
```

```none
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/10.128.0.27
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
...
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  10s              default-scheduler  Successfully assigned default/hello-apparmor to gke-test-default-pool-239f5d02-x1kf
  Normal   Pulled     8s               kubelet            Successfully pulled image "busybox:1.28" in 370.157088ms (370.172701ms including waiting)
  Normal   Pulling    7s (x2 over 9s)  kubelet            Pulling image "busybox:1.28"
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found k8s-apparmor-example-allow-write
  Normal   Pulled     7s               kubelet            Successfully pulled image "busybox:1.28" in 90.980331ms (91.005869ms including waiting)
```

Event надає повідомлення про помилку з причиною, конкретне формулювання залежить від виконавчого середовища:

```none
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found
```

## Адміністрування {#administration}

### Налаштування вузлів з профілями {#setting-up-nodes-with-profiles}

Kubernetes {{< skew currentVersion >}} не надає вбудованих механізмів для завантаження профілів AppArmor на Вузли. Профілі можна завантажити через власну інфраструктуру або інструменти, такі як [Оператор профілів безпеки Kubernetes](https://github.com/kubernetes-sigs/security-profiles-operator).

Планувальник не знає, які профілі завантажені на який Вузол, тому повний набір профілів повинні бути завантажені на кожен Вузол. Альтернативним підходом є додавання мітки Вузла для кожного профілю (або клас профілів) на Вузлі та використання [селектора вузла](/docs/concepts/scheduling-eviction/assign-pod-node/), щоб забезпечити виконання Podʼа на
Вузлі з потрібним профілем.

## Створення профілів {#authoring-profiles}

Встановлення правильних профілів AppArmor може бути складною справою. На щастя, існують деякі інструменти, що допомагають у цьому:

* `aa-genprof` та `aa-logprof` генерують правила профілю, моніторячи діяльність програми та логи та дозволяючи дії, які вона виконує. Додаткові інструкції надаються у [документації AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) — генератор профілів AppArmor для Docker, який використовує спрощену мову профілю.

Для дослідження проблем з AppArmor ви можете перевірити системні логи, щоб побачити, що саме було заборонено. AppArmor логує вичерпні повідомлення в `dmesg`, а помилки зазвичай можна знайти в системних логах або за допомогою `journalctl`. Більше інформації надається в розділі [AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures).

## Вказівки щодо обмеження AppArmor {#specifying-apparmor-confinement}

{{< caution >}}
До версії Kubernetes v1.30, AppArmor вказувався через анотації. Використовуйте відповідну версію документації для перегляду з цим застарілим API.
{{< /caution >}}

### Профіль AppArmor у контексті безпеки {#appArmorProfile}

Ви можете вказати `appArmorProfile` як у контексті безпеки контейнера, так і в контексті безпеки Podʼа. Якщо профіль встановлено на ні Podʼа, він буде використовуватися як стандартний профіль всіх контейнерів у Podʼі (включаючи контейнери ініціалізації, допоміжний та тимчасовий контейнери). Якщо вказані профілі Podʼа та контейнера, буде використано профіль контейнера.

Профіль AppArmor має 2 поля:

`type` *(обовʼязково)* — вказує, який тип профілю AppArmor буде застосований. Дійсні варіанти:

`Localhost`
: профіль, завантажений на вузол (вказаний як `localhostProfile`).

`RuntimeDefault`
: типовий профіль виконавчого середовища контейнера.

`Unconfined`
: без застосування AppArmor.

`localhostProfile` — Назва профілю, завантаженого на вузол, який слід використовувати. Профіль повинен бути попередньо налаштований на вузлі, щоб працювати. Цей параметр потрібно вказувати лише в разі, якщо `type` — `Localhost`.

## {{% heading "whatsnext" %}}

Додаткові ресурси:

* [Швидкий посібник до мови профілів AppArmor](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [Довідник з базової політики AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)

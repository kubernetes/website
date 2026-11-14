---
title: Обмежте доступ контейнера до ресурсів за допомогою AppArmor
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

Ця сторінка показує, як завантажити профілі AppArmor на ваші вузли та примусово застосовувати ці профілі в Podʼах. Щоб дізнатися більше про те, як Kubernetes може обмежувати Podʼи за допомогою AppArmor, див. [Обмеження безпеки ядра Linux для Podʼів та контейнерів](/docs/concepts/security/linux-kernel-security-constraints/#apparmor).

## {{% heading "objectives" %}} {#objectives}

* Ознайомтеся з прикладом того, як завантажити профіль на вузол
* Дізнайтеся, як примусово застосувати профіль у Podʼі
* Дізнайтеся, як перевірити, що профіль завантажено
* Подивіться, що відбувається, коли профіль порушується
* Подивіться, що відбувається, якщо профіль не вдається завантажити

## {{% heading "prerequisites" %}} {#before-you-begin}

AppArmor — це необовʼязковий модуль ядра та можливість Kubernetes, тому перш ніж продовжити, переконайтеся, що він підтримується на ваших вузлах:

1. Модуль ядра AppArmor увімкнено — щоб ядро Linux застосовувало профіль AppArmor, модуль ядра AppArmor має бути встановлений і увімкнений. Деякі дистрибутиви, як-от Ubuntu і SUSE, стандартно вмикають цей модуль, а багато інших надають необовʼязкову підтримку. Щоб перевірити, чи увімкнено модуль, перегляньте файл `/sys/module/apparmor/parameters/enabled`:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   kubelet перевіряє, чи AppArmor увімкнено на хості, перш ніж допустити Pod з явно налаштованим AppArmor.

1. Середовище виконання контейнерів підтримує AppArmor — усі поширені середовища виконання контейнерів, які підтримує Kubernetes, мають підтримувати AppArmor, зокрема {{< glossary_tooltip term_id="containerd" >}} і {{< glossary_tooltip term_id="cri-o" >}}. Зверніться до документації відповідного середовища виконання та переконайтеся, що кластер відповідає вимогам для використання AppArmor.

1. Профіль завантажено — AppArmor застосовується до Podʼа шляхом зазначення профілю AppArmor, з яким має працювати кожен контейнер. Якщо будь-який із вказаних профілів не завантажено в ядро, kubelet відхилить Pod. Переглянути, які профілі завантажено на вузлі, можна у файлі `/sys/kernel/security/apparmor/profiles`. Наприклад:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```

   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   Докладніше про завантаження профілів на вузли див. у розділі [Налаштування вузлів з профілями](#setting-up-nodes-with-profiles).

<!-- lessoncontent -->

## Захист Podʼа {#securing-a-pod}

{{< alert color="info" title="Примітка" >}}
До Kubernetes v1.30 AppArmor вказувався через анотації. Скористайтеся перемикачем версій документації, щоб переглянути документацію з цим застарілим API.
{{< /alert >}}

Профілі AppArmor можна вказати на рівні Podʼа або на рівні контейнера. Профіль AppArmor контейнера має перевагу перед профілем Podʼа.

```yaml
securityContext:
  appArmorProfile:
    type: <profile_type>
```

Де `<profile_type>` — одне з таких значень:

* `RuntimeDefault` для використання стандартного профілю середовища виконання
* `Localhost` для використання профілю, завантаженого на хості (див. нижче)
* `Unconfined` для запуску без AppArmor

Повну інформацію про API профілю AppArmor див. у розділі [Визначення обмежень AppArmor](#specifying-apparmor-confinement).

Щоб перевірити, що профіль застосовано, ви можете переконатися, що кореневий процес контейнера працює з правильним профілем, переглянувши його атрибут proc:

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

Вивід повинен виглядати приблизно так:

```
cri-containerd.apparmor.d (enforce)
```

## Приклад {#example}

*Цей приклад передбачає, що ви вже налаштували кластер з підтримкою AppArmor.*

Спочатку завантажте на свої вузли профіль, який ви хочете використовувати. Цей профіль блокує всі операції запису у файли:

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

   # Deny all file writes.
  deny /** w,
}
```

Профіль має бути завантажений на всі вузли, оскільки ви не знаєте, на який вузол буде заплановано Pod. У цьому прикладі для встановлення профілів можна використати SSH, а інші підходи розглянуто в розділі [Налаштування вузлів з профілями](#setting-up-nodes-with-profiles).

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

Потім запустіть простий Pod «Hello AppArmor» з профілем deny-write:

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

Ви можете перевірити, що контейнер справді працює з цим профілем, переглянувши `/proc/1/attr/current`:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

Вивід повинен бути:

```
k8s-apparmor-example-deny-write (enforce)
```

Нарешті, ви можете побачити, що відбудеться, якщо ви порушите профіль, здійснивши спробу запису у файл:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```

```
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

```
pod/hello-apparmor-2 created
```

Хоча Pod було створено успішно, подальша перевірка покаже, що він застряг у стані pending:

```shell
kubectl describe pod hello-apparmor-2
```

```
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

Подія (Event) містить повідомлення про помилку з причиною; конкретне формулювання залежить від середовища виконання:

```
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found
```

## Адміністрування {#administration}

### Налаштування вузлів з профілями {#setting-up-nodes-with-profiles}

Kubernetes {{< skew currentVersion >}} не надає вбудованих механізмів для завантаження профілів AppArmor на вузли. Профілі можна завантажувати через власну інфраструктуру або інструменти, як-от [Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).

Планувальник не знає, які профілі завантажено на який вузол, тому повний набір профілів має бути завантажений на кожен вузол. Альтернативний підхід — додати на вузол мітку для кожного профілю (або класу профілів) і використовувати [селектор вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/), щоб Pod запускався на вузлі з потрібним профілем.

## Створення профілів {#authoring-profiles}

Правильно задати профілі AppArmor може бути непростою справою. На щастя, є інструменти, що допомагають у цьому:

* `aa-genprof` та `aa-logprof` генерують правила профілю, відстежуючи активність і логи застосунку та дозволяючи дії, які він виконує. Додаткові інструкції наведено в [документації AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) — генератор профілів AppArmor для Docker, який використовує спрощену мову профілю.

Для налагодження проблем з AppArmor ви можете переглянути системні логи, щоб побачити, що саме було заборонено. AppArmor записує докладні повідомлення в `dmesg`, а помилки зазвичай можна знайти в системних логах або за допомогою `journalctl`. Більше інформації наведено в розділі [AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures).

## Визначення обмежень AppArmor {#specifying-apparmor-confinement}

{{< alert color="caution" title="Увага" >}}
До Kubernetes v1.30 AppArmor вказувався через анотації. Скористайтеся перемикачем версій документації, щоб переглянути документацію з цим застарілим API.
{{< /alert >}}

### Профіль AppArmor у контексті безпеки {#appArmorProfile}

Ви можете вказати `appArmorProfile` як у `securityContext` контейнера, так і в `securityContext` Podʼа. Якщо профіль встановлено на рівні Podʼа, він використовуватиметься як стандартний профіль для всіх контейнерів у Podʼі (зокрема init-контейнерів, допоміжних і ефемерних контейнерів). Якщо встановлено профілі AppArmor і для Podʼа, і для контейнера, буде використано профіль контейнера.

Профіль AppArmor має 2 поля:

`type` *(обовʼязково)* — вказує, який тип профілю AppArmor буде застосовано. Допустимі значення:

`Localhost`
: профіль, попередньо завантажений на вузол (вказується в `localhostProfile`).

`RuntimeDefault`
: стандартний профіль середовища виконання контейнерів.

`Unconfined`
: без застосування AppArmor.

`localhostProfile` — назва профілю, завантаженого на вузол, який слід використовувати. Щоб це працювало, профіль має бути попередньо налаштований на вузлі. Цей параметр потрібно вказувати тоді й лише тоді, коли `type` — `Localhost`.

## {{% heading "whatsnext" %}} {#what-s-next}

Додаткові ресурси:

* [Швидкий посібник до мови профілів AppArmor](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [Довідник з базової політики AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)

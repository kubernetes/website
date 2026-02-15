---
title: Обмеження системних викликів контейнера за допомогою seccomp
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

Seccomp походить від secure computing mode (безпечний режим обчислення) і є функцією ядра Linux з версії 2.6.12. Його можна використовувати для ізоляції привілеїв процесу, обмежуючи виклики, які він може здійснювати з простору користувача в ядро. Kubernetes дозволяє автоматично застосовувати профілі seccomp, завантажені на вузол, до ваших Podʼів та контейнерів.

Визначення необхідних привілеїв для ваших робочих навантажень може бути важким завданням. У цьому посібнику ви дізнаєтеся, як завантажувати профілі seccomp в локальний кластер Kubernetes, як застосовувати їх до Podʼа та як ви можете почати створювати профілі, які надають лише необхідні привілеї процесам вашого контейнера.

## {{% heading "objectives" %}}

* Навчитися завантажувати профілі seccomp на вузол
* Навчитися застосовувати профіль seccomp до контейнера
* Спостерігати за аудитом системних викликів, здійснюваних процесом контейнера
* Спостерігати поведінку при відсутності вказаного профілю
* Спостерігати порушення профілю seccomp
* Навчитися створювати деталізовані профілі seccomp
* Навчитися застосовувати стандартний профіль seccomp для контейнера

## {{% heading "prerequisites" %}}

Для завершення всіх кроків у цьому посібнику вам потрібно встановити [kind](/docs/tasks/tools/#kind) та [kubectl](/docs/tasks/tools/#kubectl).

Команди, які використовуються в посібнику, передбачають, що ви використовуєте [Docker](https://www.docker.com/) як ваше середовище для виконання контейнерів. (Кластер, який створює `kind`, може використовувати інше контейнерне середовище також). Ви також можете використовувати [Podman](https://podman.io/), але у цьому випадку вам доведеться дотримуватися відповідних [інструкцій](https://kind.sigs.k8s.io/docs/user/rootless/), щоб успішно виконати завдання.

У цьому посібнику показано деякі приклади, які є бета-версією (починаючи з v1.25) і інші, які використовують лише загальнодоступну функціональність seccomp. Вам слід переконатися, що ваш кластер [правильно налаштований](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version) для версії, яку ви використовуєте.

У посібнику також використовується інструмент `curl` для завантаження прикладів на ваш компʼютер. Ви можете адаптувати кроки, щоб використовувати інший інструмент, якщо вам це зручно.

{{< note >}}
Неможливо застосувати профіль seccomp до контейнера, який працює з параметром `privileged: true`, встановленим в `securityContext` контейнера. Привілейовані контейнери завжди виконуються як `Unconfined`.
{{< /note >}}

<!-- steps -->

## Завантаження прикладів профілів seccomp {#download-profiles}

Вміст цих профілів буде досліджено пізніше, але наразі продовжте та завантажте їх у теку з назвою `profiles/`, щоб їх можна було завантажити в кластер.

{{< tabs name="tab_with_code" >}}
{{< tab name="audit.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/audit.json" %}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/violation.json" %}}
{{< /tab >}}
{{< tab name="fine-grained.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/fine-grained.json" %}}
{{< /tab >}}
{{< /tabs >}}

Виконайте ці команди:

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

Ви повинні побачити три профілі, перераховані в кінці останнього кроку:

```none
audit.json  fine-grained.json  violation.json
```

## Створення локального кластера Kubernetes за допомогою kind {#create-a-local-kubernetes-cluster-with-kind}

Для спрощення можна використовувати [kind](https://kind.sigs.k8s.io/), щоб створити одновузловий кластер з завантаженими профілями seccomp. Kind запускає Kubernetes в Docker, тому кожен вузол кластера є контейнером. Це дозволяє монтувати файли в файлову систему кожного контейнера, схоже на завантаження файлів на вузол.

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

Завантажте цей приклад конфігурації kind та збережіть його у файлі з назвою `kind.yaml`:

```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

Ви можете встановити конкретну версію Kubernetes, встановивши образ контейнера вузла. Дивіться [Вузли](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) в документації kind щодо конфігурації для отримання більш детальної інформації з цього питання. Цей посібник передбачає, що ви використовуєте Kubernetes {{< param "version" >}}.

Як бета-функція, ви можете налаштувати Kubernetes на використання профілю, який обирає стандартне {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}, замість того, щоб використовувати `Unconfined`. Якщо ви хочете спробувати це, дивіться
[увімкнення використання `RuntimeDefault` як типового стандартного профілю для всіх завдань](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads) перш ніж продовжувати.

Як тільки у вас буде конфігурація kind, створіть кластер kind з цією конфігурацією:

```shell
kind create cluster --config=kind.yaml
```

Після створення нового кластера Kubernetes ідентифікуйте контейнер Docker, що працює як одновузловий кластер:

```shell
docker ps
```

Ви повинні побачити вивід, який вказує на те, що контейнер працює з назвою `kind-control-plane`, подібний до:

```none
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

Якщо спостерігати файлову систему цього контейнера, ви побачите, що тека `profiles/` була успішно завантажена в стандартний шлях seccomp з kubelet. Використовуйте `docker exec`, щоб виконати команду в Podʼі:

```shell
docker exec -it kind-control-plane ls /var/lib/kubelet/seccomp/profiles
```

```none
audit.json  fine-grained.json  violation.json
```

Ви перевірили, що ці профілі seccomp доступні для kubelet, що працює всередині kind.

## Створення Pod, що використовує стандартний профіль seccomp середовища виконання контейнерів {#create-a-pod-that-uses-the-container-runtime-default-seccomp-profile}

Більшість контейнерних середовищ надають типовий перелік системних викликів, які дозволені або заборонені. Ви можете використовувати ці стандартні налаштування для вашого робочого навантаження, встановивши тип seccomp у контексті безпеки Pod або контейнера на `RuntimeDefault`.

{{< note >}}
Якщо у вас увімкнуто параметр [конфігурації](/docs/reference/config-api/kubelet-config.v1beta1/) `seccompDefault`, то Podʼи використовують профіль seccomp `RuntimeDefault`, якщо не вказано жодного іншого профілю seccomp. В іншому випадку, використовується `Unconfined`.
{{< /note >}}

Ось маніфест Podʼа, який запитує профіль seccomp `RuntimeDefault` для всіх своїх контейнерів:

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

Створіть цей Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

Под повинен бути запущений успішно:

```none
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

Видаліть Pod перед переходом до наступного розділу:

```shell
kubectl delete pod default-pod --wait --now
```

## Створення Podʼа з профілем seccomp для аудиту системних викликів {#create-a-pod-with-a-seccomp-profile-for-syscall-auditing}

Для початку, застосуйте профіль `audit.json`, який буде записувати всі системні виклики процесу, до нового Podʼа.

Ось маніфест для цього Podʼа:

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< note >}}
Старі версії Kubernetes дозволяли налаштовувати поведінку seccomp за допомогою {{< glossary_tooltip text="анотацій" term_id="annotation" >}}. Kubernetes {{< skew currentVersion >}} підтримує лише використання полів у межах `.spec.securityContext` для налаштування seccomp, і цей посібник пояснює саме цей підхід.
{{< /note >}}

Створіть Pod у кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

Цей профіль не обмежує жодні системні виклики, тому Pod повинен успішно запуститися.

```shell
kubectl get pod audit-pod
```

```none
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

Щоб мати можливість взаємодіяти з цим точкою доступу, створіть {{< glossary_tooltip text="Service" term_id="service" >}} NodePort, який дозволяє доступ до точки доступу зсередини контейнера панелі управління kind.

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

Перевірте, який порт було призначено Service на вузлі.

```shell
kubectl get service audit-pod
```

Вивід буде схожим на:

```none
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

Тепер ви можете використовувати `curl`, щоб отримати доступ до цієї точки доступу зсередини контейнера панелі управління kind на порту, який було відкрито цим Service. Використовуйте `docker exec`, щоб виконати команду `curl` всередині контейнера панелі управління:

```shell
# Замініть 32373 на номер порту, який ви побачили в "kubectl get service audit-pod"
docker exec -it kind-control-plane curl localhost:32373
```

```none
just made some syscalls!
```

Ви можете бачити, що процес працює, але які саме системні виклики він робить? Оскільки цей Pod працює у локальному кластері, ви повинні бачити їх у `/var/log/syslog` у вашій локальній системі. Відкрийте нове вікно термінала та використовуйте команду `tail`, щоб переглянути виклики від `http-echo`:

```shell
# Шлях до логу на вашому компʼютері може відрізнятися від "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```

Ви вже повинні бачити деякі логи системних викликів, зроблених `http-echo`, і якщо ви знову запустите `curl` всередині контейнера панелі управління, ви побачите більше записів у лозі.

Наприклад:

```log
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

Ви можете почати розуміти системні виклики, необхідні для процесу `http-echo`, переглядаючи запис `syscall=` на кожному рядку. Хоча ці виклики навряд чи охоплюють усі системні виклики, які він використовує, це може слугувати основою для профілю seccomp для цього контейнера.

Видаліть Service та Pod перед переходом до наступного розділу:

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

## Створення Podʼа з профілем seccomp, що спричиняє порушення правил{#create-a-pod-with-a-seccomp-profile-that-causes-a-violation}

Для демонстрації застосуйте до Podʼа профіль, який не дозволяє жодних системних викликів.

Ось маніфест для цієї демонстрації:

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

Спробуйте створити Pod у кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

Pod буде створено, але виникне проблема. Якщо ви перевірите стан Podʼа, ви побачите, що його не вдалося запустити.

```shell
kubectl get pod violation-pod
```

```none
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

Як видно з попереднього прикладу, процес `http-echo` потребує досить багато системних викликів. У цьому випадку seccomp було налаштовано на помилку при будь-якому системному виклику, встановивши `"defaultAction": "SCMP_ACT_ERRNO"`. Це надзвичайно безпечно, але робить неможливим виконання будь-яких значущих дій. Насправді ви хочете надати робочим навантаженням тільки ті привілеї, які їм потрібні.

Видаліть Pod перед переходом до наступного розділу:

```shell
kubectl delete pod violation-pod --wait --now
```

## Створення Podʼа з профілем seccomp, що дозволяє лише необхідні системні виклики {#create-a-pod-with-a-seccomp-profile-that-allows-only-necessary-syscalls}

Якщо ви подивитеся на профіль `fine-grained.json`, ви помітите деякі з системних викликів, які спостерігалися в syslog у першому прикладі, де профіль встановлював `"defaultAction": "SCMP_ACT_LOG"`. Тепер профіль встановлює `"defaultAction": "SCMP_ACT_ERRNO"`, але явно дозволяє набір системних викликів у блоці `"action": "SCMP_ACT_ALLOW"`. Ідеально, якщо контейнер буде успішно працювати, і ви не побачите жодних повідомлень у `syslog`.

Маніфест для цього прикладу:

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

Створіть Pod у вашому кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

Pod має успішно запуститися:

```none
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

Відкрийте нове вікно термінала і використовуйте `tail` для моніторингу записів лога, які згадують виклики від `http-echo`:

```shell
# Шлях до лога на вашому компʼютері може відрізнятися від "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```

Далі, опублікуйте Pod за допомогою Service NodePort:

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

Перевірте, який порт було призначено для цього сервісу на вузлі:

```shell
kubectl get service fine-pod
```

Вихідні дані можуть виглядати приблизно так:

```none
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

Використовуйте `curl` для доступу до цієї точки доступу з контейнера панелі управління kind:

```shell
# Змініть 6a96207fed4b на ID контейнера панелі управління і 32373 на номер порту, який ви побачили у "docker ps"
docker exec -it 6a96207fed4b curl localhost:32373
```

```none
just made some syscalls!
```

Ви не повинні побачити жодних записів у `syslog`. Це тому, що профіль дозволив усі необхідні системні виклики та вказав, що повинна статися помилка, якщо буде викликано виклик, який не входить до списку. Це ідеальна ситуація з погляду безпеки, але потребує певних зусиль для аналізу програми. Було б добре, якби існував простий спосіб наблизитися до такої безпеки без стількох зусиль.

Видаліть Service і Pod перед переходом до наступного розділу:

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

## Увімкнення використання `RuntimeDefault` як стандартного профілю seccomp для всіх робочих навантажень {#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads}

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

Для використання стандартного профілю seccomp, необхідно запустити kubelet з параметром командного рядка `--seccomp-default` увімкненим для кожного вузла, де ви хочете його використовувати.

Якщо ця функція увімкнена, kubelet буде використовувати як типовий профіль seccomp `RuntimeDefault`, який визначений середовищем виконання контейнерів, замість використання режиму `Unconfined` (seccomp вимкнений). Типові профілі прагнуть забезпечити сильний набір налаштувань безпеки, зберігаючи функціональність робочих навантажень. Можливо, типові профілі відрізняються між середовищами виконання контейнерів та їх версіями випуску, наприклад, порівнюючи профілів CRI-O та containerd.

{{< note >}}
Увімкнення цієї функції не змінює поле API `securityContext.seccompProfile` у Kubernetes і не додає застарілі анотації робочих навантажень. Це дає користувачам можливість повернутися до попереднього стану в будь-який час без фактичної зміни конфігурації робочих навантажень. Такі інструменти, як [`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools), можуть бути використані для перевірки, який профіль seccomp використовується контейнером.
{{< /note >}}

Деякі робочі навантаження можуть вимагати меншої кількості обмежень системних викликів, ніж інші. Це означає, що вони можуть зазнати невдачі під час виконання навіть із профілем `RuntimeDefault`. Для помʼякшення таких невдач можна:

* Запустити робоче навантаження явно як `Unconfined`.
* Вимкнути функцію `SeccompDefault` для вузлів, забезпечуючи, щоб робочі навантаження виконувалися на вузлах, де ця функція вимкнена.
* Створити власний профіль seccomp для робочого навантаження.

Якщо ви вводите цю функцію до кластера подібного до операційного, проєкт Kubernetes рекомендує увімкнути цю функцію на підмножині ваших вузлів та перевірити виконання робочих навантажень перед повсюдним впровадженням змін.

Детальнішу інформацію про можливу стратегію оновлення та відкату ви можете знайти в повʼязаній пропозиції щодо поліпшення Kubernetes (KEP): [Увімкнення seccomp стандартно](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy).

Kubernetes {{< skew currentVersion >}} дозволяє налаштувати профіль seccomp, який застосовується, коли специфікація для Podʼа не визначає конкретний профіль seccomp. Однак, вам все одно потрібно увімкнути це налаштування як типове для кожного вузла, де ви хочете його використовувати.

Якщо ви працюєте у кластері Kubernetes {{< skew currentVersion >}} і хочете увімкнути цю функцію, ви можете запустити kubelet з параметром командного рядка `--seccomp-default` або увімкнути її через [файл конфігурації kubelet](/docs/tasks/administer-cluster/kubelet-config-file/). Щоб увімкнути цю функцію у [kind](https://kind.sigs.k8s.io), переконайтеся, що kind забезпечує мінімально необхідну версію Kubernetes і вмикає функцію `SeccompDefault` [у конфігурації kind](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster):

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
```

Якщо кластер готовий, тоді запустіть Pod:

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

тепер він повинен мати прикріплений типовий профіль seccomp. Це можна перевірити, використовуючи `docker exec` для запуску `crictl inspect` для контейнера на вузлі kind:

```shell
docker exec -it kind-worker bash -c \
    'crictl inspect $(crictl ps --name=alpine -q) | jq .info.runtimeSpec.linux.seccomp'
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
  "syscalls": [
    {
      "names": ["..."]
    }
  ]
}
```

## {{% heading "whatsnext" %}}

Ви можете дізнатися більше про Linux seccomp:

* [Огляд seccomp](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles для Docker](https://docs.docker.com/engine/security/seccomp/)

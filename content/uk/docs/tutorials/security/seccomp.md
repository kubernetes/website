---
title: Обмеження системних викликів контейнера за допомогою seccomp
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

Seccomp — це скорочення від secure computing mode (безпечний режим обчислень), і це можливість ядра Linux з версії 2.6.12. Його можна використовувати для ізоляції привілеїв процесу, обмежуючи виклики, які він може здійснювати з простору користувача в ядро. Kubernetes дає змогу автоматично застосовувати профілі seccomp, завантажені на {{< glossary_tooltip text="вузол" term_id="node" >}}, до ваших Podʼів і контейнерів.

Визначення необхідних привілеїв для ваших робочих навантажень може бути важким завданням. У цьому посібнику ви дізнаєтеся, як завантажувати профілі seccomp в локальний кластер Kubernetes, як застосовувати їх до Podʼа та як ви можете почати створювати профілі, які надають лише необхідні привілеї процесам вашого контейнера.

## {{% heading "objectives" %}} {#objectives}

* Навчитися завантажувати профілі seccomp на вузол
* Навчитися застосовувати профіль seccomp до контейнера
* Спостерігати за аудитом системних викликів, здійснюваних процесом контейнера
* Спостерігати поведінку, коли вказано відсутній профіль
* Спостерігати порушення профілю seccomp
* Навчитися створювати деталізовані профілі seccomp
* Навчитися застосовувати стандартний профіль seccomp середовища виконання контейнерів

## {{% heading "prerequisites" %}} {#before-you-begin}

Щоб виконати всі кроки цього посібника, вам потрібно встановити [kind](/docs/tasks/tools/#kind) і [kubectl](/docs/tasks/tools/#kubectl).

Команди, які використовуються в посібнику, передбачають, що ви використовуєте [Docker](https://www.docker.com/) як середовище виконання контейнерів. (Кластер, який створює `kind`, всередині може використовувати інше середовище виконання контейнерів.) Ви також можете використовувати [Podman](https://podman.io/), але в такому разі вам доведеться дотримуватися окремих [інструкцій](https://kind.sigs.k8s.io/docs/user/rootless/), щоб успішно виконати завдання.

У цьому посібнику показано деякі приклади, які досі в бета-версії (з v1.25), та інші, що використовують лише загальнодоступні можливості seccomp. Переконайтеся, що ваш кластер [правильно налаштований](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version) для версії, яку ви використовуєте.

У посібнику також використовується інструмент `curl` для завантаження прикладів на ваш компʼютер. За бажанням ви можете адаптувати кроки під інший інструмент.

{{< alert color="info" title="Примітка" >}}
Неможливо застосувати профіль seccomp до контейнера, який працює з параметром `privileged: true`, встановленим в `securityContext` контейнера. Привілейовані контейнери завжди виконуються як `Unconfined`.
{{< /alert >}}

<!-- steps -->

## Завантаження прикладів профілів seccomp {#download-profiles}

Вміст цих профілів буде розглянуто пізніше, а поки що завантажте їх у теку з назвою `profiles/`, щоб їх можна було завантажити в кластер.

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

Наприкінці останнього кроку ви маєте побачити список із трьох профілів:

```
audit.json  fine-grained.json  violation.json
```

## Створення локального кластера Kubernetes за допомогою kind {#create-a-local-kubernetes-cluster-with-kind}

Для простоти можна використати [kind](https://kind.sigs.k8s.io/), щоб створити одновузловий кластер із завантаженими профілями seccomp. Kind запускає Kubernetes у Docker, тому кожен вузол кластера є контейнером. Це дає змогу монтувати файли у файлову систему кожного контейнера, подібно до завантаження файлів на вузол.

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

Завантажте цей приклад конфігурації kind та збережіть його у файлі з назвою `kind.yaml`:

```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

Ви можете встановити конкретну версію Kubernetes, задавши образ контейнера вузла. Докладніше про це див. у розділі [Nodes](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) документації kind про конфігурацію. Цей посібник передбачає, що ви використовуєте Kubernetes {{< param "version" >}}.

Як бета-можливість, ви можете налаштувати Kubernetes на використання профілю, якому стандартно надає перевагу {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}}, замість повернення до `Unconfined`. Якщо ви хочете спробувати це, перш ніж продовжити, див. [увімкнення використання `RuntimeDefault` як стандартного профілю seccomp для всіх робочих навантажень](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads).

Коли конфігурація kind готова, створіть кластер kind з цією конфігурацією:

```shell
kind create cluster --config=kind.yaml
```

Коли новий кластер Kubernetes буде готовий, визначте контейнер Docker, що працює як одновузловий кластер:

```shell
docker ps
```

Ви маєте побачити вивід, який показує, що працює контейнер з назвою `kind-control-plane`. Вивід подібний до цього:

```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

Якщо переглянути файлову систему цього контейнера, ви побачите, що теку `profiles/` успішно завантажено в стандартний шлях seccomp kubelet. Використайте `docker exec`, щоб виконати команду в Podʼі:

```shell
docker exec -it kind-control-plane ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

Ви перевірили, що ці профілі seccomp доступні для kubelet, що працює всередині kind.

## Створення Podʼа, що використовує стандартний профіль seccomp середовища виконання контейнерів {#create-a-pod-that-uses-the-container-runtime-default-seccomp-profile}

Більшість середовищ виконання контейнерів надають розумний стандартний набір дозволених і заборонених системних викликів. Ви можете застосувати ці стандартні налаштування для вашого робочого навантаження, встановивши тип seccomp у контексті безпеки Podʼа або контейнера в `RuntimeDefault`.

{{< alert color="info" title="Примітка" >}}
Якщо у вас увімкнено параметр [конфігурації](/docs/reference/config-api/kubelet-config.v1beta1/) `seccompDefault`, Podʼи використовують профіль seccomp `RuntimeDefault`, коли не вказано жодного іншого профілю seccomp. В іншому разі стандартно використовується `Unconfined`.
{{< /alert >}}

Ось маніфест Podʼа, який запитує профіль seccomp `RuntimeDefault` для всіх своїх контейнерів:

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

Створіть цей Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

Pod має відображатися як успішно запущений:

```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

Видаліть Pod перед переходом до наступного розділу:

```shell
kubectl delete pod default-pod --wait --now
```

## Створення Podʼа з профілем seccomp для аудиту системних викликів {#create-a-pod-with-a-seccomp-profile-for-syscall-auditing}

Для початку застосуйте до нового Podʼа профіль `audit.json`, який записуватиме в лог усі системні виклики процесу.

Ось маніфест для цього Podʼа:

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< alert color="info" title="Примітка" >}}
Старіші версії Kubernetes дозволяли налаштовувати поведінку seccomp за допомогою {{< glossary_tooltip text="анотацій" term_id="annotation" >}}. Kubernetes {{< skew currentVersion >}} підтримує налаштування seccomp лише через поля в `.spec.securityContext`, і цей посібник пояснює саме цей підхід.
{{< /alert >}}

Створіть Pod у кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

Цей профіль не обмежує жодні системні виклики, тому Pod повинен успішно запуститися.

```shell
kubectl get pod audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

Щоб мати змогу взаємодіяти з точкою доступу, яку відкриває цей контейнер, створіть {{< glossary_tooltip text="Service" term_id="service" >}} NodePort, який надає доступ до точки доступу зсередини контейнера панелі управління kind.

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

Перевірте, який порт було призначено Service на вузлі.

```shell
kubectl get service audit-pod
```

Вивід буде схожим на:

```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

Тепер ви можете за допомогою `curl` звернутися до цієї точки доступу зсередини контейнера панелі управління kind на порту, відкритому цим Service. Використайте `docker exec`, щоб виконати команду `curl` всередині контейнера панелі управління:

```shell
# Замініть 32373 на номер порту, який ви побачили в "kubectl get service audit-pod"
docker exec -it kind-control-plane curl localhost:32373
```

```
just made some syscalls!
```

Ви бачите, що процес працює, але які саме системні виклики він зробив? Оскільки цей Pod працює в локальному кластері, ви маєте бачити їх у `/var/log/syslog` у вашій локальній системі. Відкрийте нове вікно термінала й за допомогою `tail` перегляньте виклики від `http-echo`:

```shell
# Шлях до логу на вашому компʼютері може відрізнятися від "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```

Ви вже маєте бачити деякі записи логу про системні виклики, зроблені `http-echo`, а якщо знову виконаєте `curl` всередині контейнера панелі управління, у лог буде записано ще більше.

Наприклад:

```
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

## Створення Podʼа з профілем seccomp, що спричиняє порушення {#create-a-pod-with-a-seccomp-profile-that-causes-violation}

Для демонстрації застосуйте до Podʼа профіль, який не дозволяє жодних системних викликів.

Ось маніфест для цієї демонстрації:

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

Спробуйте створити Pod у кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

Pod створюється, але виникає проблема. Якщо ви перевірите стан Podʼа, то побачите, що його не вдалося запустити.

```shell
kubectl get pod violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

Як видно з попереднього прикладу, процесу `http-echo` потрібно чимало системних викликів. Тут seccomp налаштовано повертати помилку на будь-який системний виклик через `"defaultAction": "SCMP_ACT_ERRNO"`. Це надзвичайно безпечно, але унеможливлює будь-які змістовні дії. Насправді ж ви хочете надати робочим навантаженням лише ті привілеї, які їм потрібні.

Видаліть Pod перед переходом до наступного розділу:

```shell
kubectl delete pod violation-pod --wait --now
```

## Створення Podʼа з профілем seccomp, що дозволяє лише необхідні системні виклики {#create-a-pod-with-a-seccomp-profile-that-only-allows-necessary-syscalls}

Якщо ви подивитеся на профіль `fine-grained.json`, то помітите деякі із системних викликів, які було видно в syslog у першому прикладі, де профіль встановлював `"defaultAction": "SCMP_ACT_LOG"`. Тепер профіль встановлює `"defaultAction": "SCMP_ACT_ERRNO"`, але явно дозволяє набір системних викликів у блоці `"action": "SCMP_ACT_ALLOW"`. В ідеалі контейнер успішно запуститься, і ви не побачите жодних повідомлень у `syslog`.

Маніфест для цього прикладу:

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

Створіть Pod у вашому кластері:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

Pod має відображатися як успішно запущений:

```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

Відкрийте нове вікно термінала й за допомогою `tail` відстежуйте записи логу, у яких згадуються виклики від `http-echo`:

```shell
# Шлях до логу на вашому компʼютері може відрізнятися від "/var/log/syslog"
tail -f /var/log/syslog | grep 'http-echo'
```

Далі відкрийте доступ до Pod за допомогою Service NodePort:

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

Перевірте, який порт на вузлі призначено цьому Service:

```shell
kubectl get service fine-pod
```

Вивід подібний до:

```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

Використовуйте `curl` для доступу до цієї точки доступу з контейнера панелі управління kind:

```shell
# Замініть 32373 на номер порту, який ви побачили в "kubectl get service fine-pod"
docker exec -it kind-control-plane curl localhost:32373
```

```
just made some syscalls!
```

Ви не маєте побачити жодних записів у `syslog`. Це тому, що профіль дозволив усі необхідні системні виклики та вказав, що в разі виклику поза списком має виникати помилка. З погляду безпеки це ідеальна ситуація, але вона потребувала певних зусиль з аналізу програми. Було б добре мати простий спосіб наблизитися до такого рівня безпеки без стількох зусиль.

Видаліть Service і Pod перед переходом до наступного розділу:

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

## Увімкнення використання `RuntimeDefault` як стандартного профілю seccomp для всіх робочих навантажень {#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads}

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

Щоб використовувати стандартне призначення профілю seccomp, потрібно запускати kubelet з увімкненим [прапорцем командного рядка](/docs/reference/command-line-tools-reference/kubelet) `--seccomp-default` на кожному вузлі, де ви хочете це використовувати.

Якщо це увімкнено, kubelet стандартно використовуватиме профіль seccomp `RuntimeDefault`, визначений середовищем виконання контейнерів, замість режиму `Unconfined` (seccomp вимкнено). Стандартні профілі мають на меті забезпечити надійний набір стандартних налаштувань безпеки, зберігаючи працездатність робочого навантаження. Стандартні профілі можуть відрізнятися між середовищами виконання контейнерів і їхніми версіями, наприклад у CRI-O і containerd.

{{< alert color="info" title="Примітка" >}}
Увімкнення цієї можливості не змінює поле API Kubernetes `securityContext.seccompProfile` і не додає до робочого навантаження застарілі анотації. Це дає користувачам змогу будь-коли повернутися до попереднього стану без фактичної зміни конфігурації робочого навантаження. Перевірити, який профіль seccomp використовує контейнер, можна за допомогою інструментів на кшталт [`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools).
{{< /alert >}}

Деяким робочим навантаженням може знадобитися менше обмежень системних викликів, ніж іншим. Це означає, що вони можуть зазнавати збоїв під час виконання навіть із профілем `RuntimeDefault`. Щоб запобігти таким збоям, можна:

* Запустити робоче навантаження явно як `Unconfined`.
* Вимкнути можливість `SeccompDefault` для вузлів, а також подбати, щоб робочі навантаження планувалися на вузли, де цю можливість вимкнено.
* Створити власний профіль seccomp для робочого навантаження.

Якщо ви впроваджуєте цю можливість у кластер, наближений до промислового, проєкт Kubernetes рекомендує увімкнути цю функціональну можливість на частині ваших вузлів і перевірити виконання робочих навантажень, перш ніж поширювати зміну на весь кластер.

Детальнішу інформацію про можливу стратегію оновлення та відкату ви можете знайти в повʼязаній пропозиції щодо поліпшення Kubernetes (KEP): [Увімкнення seccomp стандартно](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy).

Kubernetes {{< skew currentVersion >}} дає змогу налаштувати профіль seccomp, який застосовується, коли специфікація Podʼа не визначає конкретного профілю seccomp. Однак вам однаково потрібно ввімкнути таке стандартне призначення на кожному вузлі, де ви хочете його використовувати.

Якщо ви працюєте з кластером Kubernetes {{< skew currentVersion >}} і хочете ввімкнути цю можливість, запустіть kubelet з прапорцем командного рядка `--seccomp-default` або ввімкніть її через [файл конфігурації kubelet](/docs/tasks/administer-cluster/kubelet-config-file/). Щоб увімкнути цю функціональну можливість у [kind](https://kind.sigs.k8s.io), переконайтеся, що `kind` забезпечує мінімально необхідну версію Kubernetes і вмикає можливість `SeccompDefault` [у конфігурації kind](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster):

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

Якщо кластер готовий, то Pod, запущений так:

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

тепер має отримати стандартний профіль seccomp. Це можна перевірити, виконавши за допомогою `docker exec` команду `crictl inspect` для контейнера на робочому вузлі kind:

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

## {{% heading "whatsnext" %}} {#what-s-next}

Ви можете дізнатися більше про Linux seccomp:

* [Огляд seccomp](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles для Docker](https://docs.docker.com/engine/security/seccomp/)

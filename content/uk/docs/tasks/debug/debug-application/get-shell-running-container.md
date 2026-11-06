---
title: Отримання доступу до оболонки запущеного контейнера
content_type: task
---

<!-- overview -->

Ця сторінка показує, як використовувати `kubectl exec` для отримання доступу до оболонки запущеного контейнера.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Отримання доступу до оболонки контейнера {#getting-a-shell-to-a-container}

У цій вправі ви створюєте Pod з одним контейнером. Контейнер запускає образ nginx. Ось файл конфігурації Podʼа:

{{% code_sample file="application/shell-demo.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Перевірте, що контейнер працює:

```shell
kubectl get pod shell-demo
```

Отримайте доступ до оболонки запущеного контейнера:

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}
Подвійне тире (`--`) відокремлює аргументи, які ви хочете передати команді, від аргументів kubectl.
{{< /note >}}

У своїй оболонці виведіть список кореневої теки:

```shell
# Виконайте це всередині контейнера
ls /
```

У своїй оболонці експериментуйте з іншими командами. Ось деякі приклади:

```shell
# Ви можете виконати ці приклади команд всередині контейнера
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

## Запис головної сторінки для nginx {#writing-the-root-page-for-nginx}

Знову перегляньте файл конфігурації вашого Podʼа. Pod має том `emptyDir`, і контейнер монтує цей том в `/usr/share/nginx/html`.

У своїй оболонці створіть файл `index.html` у теці `/usr/share/nginx/html`:

```shell
# Виконайте це всередині контейнера
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

У своїй оболонці надішліть GET-запит до сервера nginx:

```shell
# Виконайте це в оболонці всередині вашого контейнера
apt-get update
apt-get install curl
curl http://localhost/
```

Вивід показує текст, який ви записали у файл `index.html`:

```
Hello shell demo
```

Коли закінчите роботу з оболонкою, введіть `exit`.

```shell
exit # Щоб вийти з оболонки в контейнері
```

## Виконання окремих команд в контейнері {#running-individual-commands-in-a-container}

У звичайному вікні команд, а не у своїй оболонці, виведіть змінні середовища запущеного контейнера:

```shell
kubectl exec shell-demo -- env
```

Експериментуйте з виконанням інших команд. Ось деякі приклади:

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```

<!-- discussion -->

## Відкриття оболонки, коли в Podʼі є більше одного контейнера {#opening-a-shell-when-a-pod-has-more-than-one-container}

Якщо в Podʼі більше одного контейнера, використовуйте `--container` або `-c`, щоб вказати контейнер у команді `kubectl exec`. Наприклад, припустимо, у вас є Pod з назвою my-pod, і в ньому є два контейнери з назвами _main-app_ і _helper-app_. Наведена нижче команда відкриє оболонку в контейнері _main-app_.

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
Короткі параметри `-i` і `-t` — те саме, що довгі параметри `--stdin` і `--tty`
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте про [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)

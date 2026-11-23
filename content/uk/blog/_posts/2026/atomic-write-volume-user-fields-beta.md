---
layout: blog
title: "Kubernetes v1.38: кращий спосіб налаштувати власника файлів у томі"
slug: kubernetes-v1-38-atomic-write-volume-user-fields-beta
draft: true
author: >
  [Gavin Lam](https://github.com/gavinkflam)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

У нещодавньому випуску Kubernetes v1.38 поля UID власника файлів для томів `configMap`, `secret`, `downwardAPI` та `projected` отримали статус beta.

Ця функціональність типово увімкнена за допомогою функціональної можливості `AtomicWriteVolumeUserFields`.

## Проблема {#the-problem}

Багатьом популярним програмам потрібні файли з певним власником, наприклад файли ключів [набору реплік MongoDB][mongodb-key-files] і [ключі хостів SSHD][sshd-host-keys]. У наявній реалізації файли створюються власником root, тому не відповідають таким вимогам. Відомий обхідний шлях — запускати контейнери init від імені root, щоб виконати `chown`.

Однак цей обхідний шлях непридатний для кластерів, у яких вимагається відповідність Podʼів [_restricted_][pss-restricted] стандарту безпеки Podʼів. Такий стандарт вимагає, щоб усі контейнери Podʼа, зокрема контейнери init і sidecar, працювали не від імені root і відкидали всі можливості (capabilities). Тому скористатися цим обхідним шляхом неможливо.

Навіть у менш захищених кластерах такий обхідний шлях із контейнерами init створює зайві труднощі й потребує додаткового обслуговування.

[mongodb-key-files]: https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/#enforce-keyfile-access-control-on-existing-replica-set
[sshd-host-keys]: https://man.openbsd.org/sshd_config#HostKey
[pss-restricted]: /docs/concepts/security/pod-security-standards/#restricted

## Як це працює {#how-it-works}

Якщо на рівні тому вказано `defaultUser`, це поле встановлює UID власника всіх файлів даних тому під час їх створення. На рівні окремого елемента поле `user` задає UID власника конкретного файлу й має перевагу над `defaultUser`.

У наступному прикладі показано, як за новими полями визначається UID власника файлів.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-user-fields-example
spec:
  containers:
  - name: test
    image: busybox:1.28
    command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
    volumeMounts:
    - name: vol-a
      mountPath: /mnt/volA
    - name: vol-b
      mountPath: /mnt/volB
    - name: vol-c
      mountPath: /mnt/volC
  volumes:
  - name: vol-a
    configMap:
      defaultUser: 1000
      name: cm1
      items:
      - key: foo # Власник=defaultUser
        path: foo
      - key: bar # Власник=user
        path: bar
        user: 1001
  - name: vol-b
    secret: # Власник=defaultUser
      defaultUser: 1000
      secretName: secret1
  - name: vol-c
    projected:
      sources:
      - secret:
          name: secret2
          items:
          - key: moo # Власник=root
            path: moo
          - key: baa # Власник=user
            path: baa
            user: 1000
```

## Де дізнатися більше? {#how-can-i-learn-more}

Дивіться розділ [Власник файлів (UID)](/docs/concepts/storage/volumes/#user-ownership-uid) у документації про томи.

Також можна ознайомитися з пропозицією щодо вдосконалення [KEP-5936](https://www.kubernetes.dev/resources/keps/5936/).

---
title: Застосування Стандартів безпеки Podʼів на рівні простору імен
content_type: tutorial
weight: 20
---

{{% alert title="Примітка" %}}
Цей посібник призначено лише для нових кластерів.
{{% /alert %}}

Pod Security Admission — це контролер допуску, який застосовує [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) під час створення Podʼів. Ця можливість загальнодоступна (GA) з v1.25. У цьому посібнику ви примусово застосуєте Стандарт безпеки Podʼів `baseline`, по одному простору імен за раз.

Ви також можете застосувати Стандарти безпеки Podʼів одразу до кількох просторів імен на рівні кластера. Інструкції див. у розділі [Застосування Стандартів безпеки Podʼів на рівні кластера](/docs/tutorials/security/cluster-level-pss/).

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть на свою робочу станцію:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## Створення кластера {#create-cluster}

1. Створіть кластер `kind` так:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   Вивід буде подібний до цього:

   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-ns-level"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-ns-level

   Not sure what to do next? 😅  Check out https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

1. Встановіть контекст kubectl для нового кластера:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```

   Вивід буде подібний до цього:

   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

## Створення простору імен {#create-a-namespace}

Створіть новий простір імен з назвою `example`:

```shell
kubectl create ns example
```

Вивід буде подібний до цього:

```
namespace/example created
```

## Увімкнення перевірки Стандартів безпеки Podʼів для цього простору імен {#enable-pod-security-standards-checking-for-that-namespace}

1. Увімкніть Стандарти безпеки Podʼів у цьому просторі імен за допомогою міток, які підтримує вбудований Pod Security Admission. На цьому кроці ви налаштуєте перевірку, яка попереджатиме про Podʼи, що не відповідають останній версії стандарту безпеки Podʼів _baseline_.

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. Ви можете налаштувати кілька перевірок стандартів безпеки Podʼів для будь-якого простору імен за допомогою міток. Ця команда застосовуватиме (`enforce`) Стандарт безпеки Podʼів `baseline`, а для Стандартів безпеки Podʼів `restricted` за останньою версією (стандартне значення) виконуватиме `warn` і `audit`

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## Перевірка примусового застосування Стандарту безпеки Podʼів {#verify-the-pod-security-standard-enforcement}

1. Створіть Pod рівня baseline у просторі імен `example`:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Pod запускається успішно; вивід містить попередження. Наприклад:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. Створіть Pod рівня baseline у просторі імен `default`:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Вивід буде подібний до такого:

   ```
   pod/nginx created
   ```

Налаштування примусового застосування Стандартів безпеки Podʼів і попереджень застосовано лише до простору імен `example`. Ви могли б створити такий самий Pod у просторі імен `default` без жодних попереджень.

## Очищення {#clean-up}

Тепер видаліть кластер, який ви створили вище, виконавши цю команду:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Виконайте [скрипт оболонки](/examples/security/kind-with-namespace-level-baseline-pod-security.sh), щоб виконати всі попередні кроки за один раз:

  1. Створіть кластер kind.
  2. Створіть новий простір імен.
  3. Застосуйте Стандарт безпеки Podʼів `baseline` у режимі `enforce`, водночас застосувавши Стандарт безпеки Podʼів `restricted` у режимах `warn` і `audit`.
  4. Створіть новий Pod, до якого застосовано такі стандарти безпеки Podʼів

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/)
- [Застосування Стандартів безпеки Podʼів на рівні кластера](/docs/tutorials/security/cluster-level-pss/)

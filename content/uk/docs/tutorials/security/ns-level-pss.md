---
title: Застосування Стандартів безпеки Pod на рівні простору імен
content_type: tutorial
weight: 20
---

{{% alert title="Примітка" %}}
Цей посібник застосовується лише для нових кластерів.
{{% /alert %}}

Pod Security Admission — це контролер допуску, який застосовує [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/) при створенні Podʼів. Це функція, яка є загально доступною з v1.25. У цьому посібнику ви будете застосовувати Стандарт безпеки Pod `baseline`, по одному простору імен за раз.

Ви також можете застосовувати Стандарти безпеки Pod до кількох просторів імен одночасно на рівні кластера. Щоб дізнатися більше, перейдіть за посиланням [Застосування Стандартів безпеки Pod на рівні кластера](/docs/tutorials/security/cluster-level-pss/).

## {{% heading "prerequisites" %}}

Встановіть на ваш компʼютер наступне:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## Створення кластера {#create-cluster}

1. Створіть кластер `kind` наступним чином:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   Вивід буде подібний до цього:

   ```none
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

2. Встановіть контекст kubectl для нового кластера:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```

   Вивід буде подібний до цього:

   ```none
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

```none
namespace/example created
```

## Увімкнення перевірки Стандартів безпеки Pod для цього простору імен

1. Увімкніть Стандарти безпеки Pod на цьому просторі імен за допомогою підтримуваних міток, вбудованих в Pod Security Admission. На цьому кроці ви налаштуєте перевірку, щоб система попереджувала про Podʼи, які не відповідають останньої версії стандарту безпеки підсистеми _baseline_.

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. Ви можете налаштувати кілька перевірок стандартів безпеки Podʼів для будь-якого простору імен за допомогою міток. Наступна команда буде застосовувати стандарт безпеки Pod `baseline`, але `warn` та `audit` для стандартів безпеки Pod `restricted` згідно з останньою версією (стандартне значення)

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## Перевірте дотримання стандарту безпеки Podʼів {#Verify-the-pod-security-standard-enforcement}

1. Створіть Pod з базовим стандартом в просторі імен `example`:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Pod дійсно запускається; вивід містить попередження. Наприклад:

   ```none
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. Створіть Pod з базовим стандартом у просторі імен `default`:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Вивід буде подібний до такого:

   ```none
   pod/nginx створено
   ```

Виконання стандартів безпеки Podʼів та налаштування попереджень було застосовано лише до простору імен `example`. Ви можете створити такий самий Pod в просторі імен `default` без будь-яких попереджень.

## Очищення {#clean-up}

Тепер видаліть кластер, який було створено:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}}

- Виконайте [скрипт](/examples/security/kind-with-namespace-level-baseline-pod-security.sh) для виконання всіх попередніх кроків одночасно.

  1. Створіть кластер kind.
  2. Створіть новий простір імен.
  3. Застосуйте стандарт безпеки підсистеми `baseline` в режимі `enforce`, при цьому застосовуючи стандарт безпеки підсистеми `restricted` також у режимі `warn` та `audit`.
  4. Створіть новий Pod з застосованими стандартами безпеки Podʼів.

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/)
- [Застосування Стандартів безпеки Pod на рівні кластера](/docs/tutorials/security/cluster-level-pss/)

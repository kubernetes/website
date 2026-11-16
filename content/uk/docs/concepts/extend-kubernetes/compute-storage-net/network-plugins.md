---
title: Мережеві втулки
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes (з версії 1.3 до останньої {{< skew latestVersion >}} і, ймовірно, надалі) дозволяє використовувати втулки [Container Network Interface](https://github.com/containernetworking/cni) (CNI) для мережі кластера. Ви повинні використовувати втулок CNI, сумісний з вашим кластером, який відповідає вашим потребам. У ширшій екосистемі Kubernetes доступні різні втулки (як з відкритим, так і із закритим кодом).

Втулок CNI потрібен для реалізації [мережевої моделі Kubernetes](/docs/concepts/services-networking/#the-kubernetes-network-model).

Ви повинні використовувати втулок CNI, сумісний зі специфікацією CNI [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) або новішими випусками. Проєкт Kubernetes рекомендує використовувати втулок, сумісний зі специфікацією CNI [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md) (втулки можуть бути сумісними з кількома версіями специфікації).

<!-- body -->

## Встановлення {#installation}

Середовище виконання контейнерів (Container Runtime) у контексті мережі — це демон на вузлі, налаштований для надання сервісів CRI для kubelet. Зокрема, середовище виконання контейнерів повинно бути налаштоване на завантаження втулків CNI, необхідних для реалізації мережевої моделі Kubernetes.

{{< note >}}
До Kubernetes 1.24 втулками CNI також можна було керувати через kubelet за допомогою параметрів командного рядка `cni-bin-dir` та `network-plugin`. Ці параметри командного рядка було вилучено в Kubernetes 1.24, і керування CNI більше не входить до сфери відповідальності kubelet.

Дивіться [Усунення помилок, повʼязаних із втулками CNI](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/), якщо ви стикаєтеся з проблемами після вилучення dockershim.
{{< /note >}}

Конкретну інформацію про те, як середовище виконання контейнерів керує втулками CNI, дивіться в документації цього середовища виконання контейнерів, наприклад:

- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

Конкретну інформацію про те, як встановити втулок CNI та керувати ним, дивіться в документації цього втулка або [мережевого провайдера](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

## Вимоги до мережевих втулків {#network-plugin-requirements}

### Loopback CNI

Крім втулка CNI, встановленого на вузлах для реалізації мережевої моделі Kubernetes, Kubernetes також вимагає, щоб середовища виконання контейнерів надавали інтерфейс loopback `lo`, який використовується для кожної пісочниці (пісочниці Podʼів, пісочниці віртуальних машин тощо). Реалізувати інтерфейс loopback можна, повторно використавши [втулок CNI loopback](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) або розробивши для цього власний код (дивіться [цей приклад від CRI-O](https://github.com/cri-o/ocicni/blob/release-1.24/pkg/ocicni/util_linux.go#L91)).

### Підтримка `hostPort` {#support-hostport}

Мережевий втулок CNI підтримує `hostPort`. Ви можете використовувати офіційний втулок [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap), який пропонує команда втулків CNI, або власний втулок із функціональністю portMapping.

Якщо ви хочете увімкнути підтримку `hostPort`, ви повинні вказати `portMappings capability` у своєму `cni-conf-dir`. Наприклад:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true},
      "externalSetMarkChain": "KUBE-MARK-MASQ"
    }
  ]
}
```

### Підтримка формування трафіку {#support-traffic-shaping}

**Експериментальна можливість**

Мережевий втулок CNI також підтримує формування вхідного та вихідного трафіку Podʼів. Ви можете використовувати офіційний втулок [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth), який пропонує команда втулків CNI, або власний втулок із функціональністю контролю пропускної здатності.

Якщо ви хочете увімкнути підтримку формування трафіку, ви повинні додати втулок `bandwidth` до файлу конфігурації CNI (стандартно `/etc/cni/net.d`) і переконатися, що його бінарний файл є у вашій теці бінарних файлів CNI (стандартно `/opt/cni/bin`).

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

Тепер ви можете додати анотації `kubernetes.io/ingress-bandwidth` та `kubernetes.io/egress-bandwidth` до вашого Podʼа. Наприклад:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся більше про [мережу кластера](/docs/concepts/cluster-administration/networking/)
- Дізнайтеся більше про [мережеві політики](/docs/concepts/services-networking/network-policies/)
- Дізнайтеся про [усунення помилок, повʼязаних із втулками CNI](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)

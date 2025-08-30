---
title: Мережеві втулки
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes (з версії 1.3 і до останньої версії {{< skew currentVersion >}} та можливо й потім) дозволяє використовувати [мережевий інтерфейс контейнерів](https://github.com/containernetworking/cni) (CNI, Container Network Interface) для втулків мережі кластера. Вам потрібно використовувати втулок CNI, який сумісний з вашим кластером та відповідає вашим потребам. В екосистемі Kubernetes доступні різні втулки (як з відкритим, так і закритим кодом).

Для імплементації [мережевої моделі Kubernetes](/docs/concepts/services-networking/#the-kubernetes-network-model) необхідно використовувати втулок CNI.

Вам потрібно використовувати втулок CNI, який сумісний з [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) або більш пізніми версіями специфікації CNI. Проєкт Kubernetes рекомендує використовувати втулок, який сумісний з [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md) специфікації CNI (втулки можуть бути сумісними з кількома версіями специфікації).

<!-- body -->

## Встановлення {#installation}

Середовище виконання контейнерів (Container Runtime) у контексті мережі — це служба на вузлі, налаштована для надання сервісів CRI для kubelet. Зокрема, середовище виконання контейнерів повинно бути налаштоване для завантаження втулків CNI, необхідних для реалізації мережевої моделі Kubernetes.

{{< note >}}
До Kubernetes 1.24 втулками CNI також можна було керувати через kubelet за допомогою параметрів командного рядка `cni-bin-dir` та `network-plugin`. Ці параметри командного рядка були видалені в Kubernetes 1.24, і управління CNI більше не входить до сфери обовʼязків kubelet.

Дивіться [Вирішення помилок, повʼязаних з втулками CNI](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/) якщо ви стикаєтеся з проблемами після видалення dockershim.
{{< /note >}}

Для конкретної інформації про те, як середовище виконання контейнерів керує втулками CNI, дивіться документацію для цього середовища виконання контейнерів, наприклад:

- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

Для конкретної інформації про те, як встановити та керувати втулком CNI, дивіться документацію для цього втулка або [постачальника мережі](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

## Вимоги до мережевих втулків {#network-plugin-requirements}

### Loopback CNI

Крім втулка CNI, встановленого на вузлах для реалізації мережевої моделі Kubernetes, Kubernetes також вимагає, щоб середовища виконання контейнерів надавали loopback інтерфейс `lo`, який використовується для кожної пісочниці (пісочниці Podʼів, пісочниці віртуальних машин тощо). Реалізацію інтерфейсу loopback можна виконати, використовуючи [втулок loopback CNI](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) або розробивши власний код для досягнення цього (дивіться [цей приклад від CRI-O](https://github.com/cri-o/ocicni/blob/release-1.24/pkg/ocicni/util_linux.go#L91)).

### Підтримка `hostPort` {#support-hostport}

Втулок мережі CNI підтримує `hostPort`. Ви можете використовувати офіційний втулок [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap), який пропонується командою втулків CNI, або використовувати свій власний втулок з функціональністю portMapping.

Якщо ви хочете ввімкнути підтримку `hostPort`, вам потрібно вказати `capability portMappings` у вашому `cni-conf-dir`. Наприклад:

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

**Експериментальна функція**

Втулок мережі CNI також підтримує формування вхідного та вихідного трафіку для Podʼів. Ви можете використовувати офіційний [втулок bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth), що пропонується командою втулків CNI, або використовувати власний втулок з функціональністю контролю ширини смуги.

Якщо ви хочете ввімкнути підтримку формування трафіку, вам потрібно додати втулок `bandwidth` до вашого файлу конфігурації CNI (типово `/etc/cni/net.d`) та забезпечити наявність відповідного виконавчого файлу у вашій теці виконавчих файлів CNI (типово `/opt/cni/bin`).

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

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [мережі в кластерах](/docs/concepts/cluster-administration/networking/)
- Дізнайтеся більше про [мережеві політики](/docs/concepts/services-networking/network-policies/)
- Ознайомтеся з [Вирішення помилок, повʼязаних з втулками CNI](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)

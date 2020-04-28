---
title: HostAliases로 파드의 /etc/hosts 항목 추가하기
content_template: templates/concept
weight: 60
---

{{< toc >}}

{{% capture overview %}}
파드의 /etc/hosts 파일에 항목을 추가하는 것은 DNS나 다른 방법들이 적용되지 않을 때 파드 수준의 호스트네임 해석을 제공한다. 1.7 버전에서는, 사용자들이 PodSpec의 HostAliases 항목을 사용하여 이러한 사용자 정의 항목들을 추가할 수 있다.

HostAliases를 사용하지 않은 수정은 권장하지 않는데, 이는 호스트 파일이 Kubelet에 의해 관리되고, 파드 생성/재시작 중에 덮어쓰여질 수 있기 때문이다.
{{% /capture %}}

{{% capture body %}}

## 기본 호스트 파일 내용

파드 IP가 할당된 Nginx 파드를 시작해보자.

```shell
kubectl run nginx --image nginx --generator=run-pod/v1
```

```shell
pod/nginx created
```

파드 IP를 확인해보자.

```shell
kubectl get pods --output=wide
```

```shell
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

호스트 파일의 내용은 아래와 같을 것이다.

```shell
kubectl exec nginx -- cat /etc/hosts
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

기본적으로, `hosts` 파일은 `localhost`와 자기 자신의 호스트네임과 같은 IPv4와 IPv6 
상용구들만 포함하고 있다.

## HostAliases를 사용하여 추가 항목들 추가하기

기본 상용구 이외에, `foo.local`, `bar.local`이 `127.0.0.1`로, `foo.remote`, 
`bar.remote`가 `10.1.2.3`로 해석될 수 있도록 추가 항목들을 `hosts` 파일에 추가할 수 있으며, 
이는 `.spec.hostAliases` 항목에서 정의하여 
파드에 HostAliases를 추가하면 가능하다.


{{< codenew file="service/networking/hostaliases-pod.yaml" >}}

이 파드는 다음의 명령어를 통해 시작될 수 있다.

```shell
kubectl apply -f hostaliases-pod.yaml
```

```shell
pod/hostaliases-pod created
```

파드의 IP와 상태를 확인해보자.

```shell
kubectl get pod --output=wide
```

```shell
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

`hosts` 파일 내용은 아래와 같을 것이다.

```shell
kubectl logs hostaliases-pod
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

가장 마지막에 추가 항목들이 정의되어 있는 것을 확인할 수 있다.

## 왜 Kubelet이 호스트 파일을 관리하는가?

컨테이너가 이미 시작되고 난 후 Docker가 파일을 [수정](https://github.com/moby/moby/issues/17190)
하는 것을 방지하기 위해 Kubelet은 파드의 각 컨테이너의 `hosts` 파일을 
[관리](https://github.com/kubernetes/kubernetes/issues/14633)
한다.

호스트 파일이 관리된다는 특성으로 인해, 컨테이너 재시작이나 파드 리스케줄 이벤트로 
`hosts` 파일이 Kubelet에 의해 다시 마운트될 때마다 사용자가 작성한 모든 내용이
덮어쓰여진다. 따라서, 호스트 파일의 내용을 
직접 바꾸는 것은 권장하지 않는다.

{{% /capture %}}

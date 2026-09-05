---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm으로 고가용성 etcd 클러스터 설정하기
content_type: task
weight: 70
---

<!-- overview -->


기본적으로 kubeadm은 각 컨트롤 플레인 노드에서 로컬 etcd 인스턴스를 실행한다.
etcd 클러스터를 외부 클러스터로 간주하고 호스트를 분리하여 etcd 인스턴스를 프로비저닝할 수도 있다.
두 접근 방식의 차이점은
[고가용성 토폴로지 선택](/docs/setup/production-environment/tools/kubeadm/ha-topology) 페이지에서 다룬다.

이 작업에서는 클러스터 생성 중 kubeadm이 사용할 수 있는 멤버 3개로 구성된
고가용성 외부 etcd 클러스터를 만드는 과정을 안내한다.

## {{% heading "prerequisites" %}}

- TCP 포트 2379와 2380을 통해 서로 통신할 수 있는 호스트 3개가 필요하다. 이 문서에서는
  이 기본 포트를 가정한다.
  하지만 kubeadm 구성 파일을 통해 포트를 구성할 수 있다.
- 각 호스트에는 systemd와 bash 호환 셸이 설치되어 있어야 한다.
- 각 호스트에는 [컨테이너 런타임, kubelet 및 kubeadm이 설치되어 있어야 한다](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- 각 호스트는 Kubernetes 컨테이너 이미지 레지스트리(`registry.k8s.io`)에 접근할 수 있거나
  `kubeadm config images list/pull`을 사용하여 필요한 etcd 이미지를 나열하거나 가져올 수 있어야 한다.
  이 가이드에서는 kubelet이 관리하는 [스태틱(static) 파드](/docs/tasks/configure-pod-container/static-pod/)로
  etcd 인스턴스를 설정한다.
- 호스트 간에 파일을 복사할 수 있는 수단이 필요하다. 예를 들어 `ssh`와 `scp`로 이 요구 사항을 충족할 수 있다.

<!-- steps -->

## 클러스터 설정하기

일반적인 방법은 한 노드에서 모든 인증서를 생성한 다음 _필요한_ 파일만
다른 노드에 배포하는 것이다.

{{< note >}}
kubeadm에는 아래에서 설명하는 인증서를 생성하는 데 필요한
모든 암호화 기능이 포함되어 있으므로,
이 예시에서는 다른 암호화 도구가 필요하지 않다.
{{< /note >}}

{{< note >}}
아래 예시에서는 IPv4 주소를 사용하지만 kubeadm, kubelet 및 etcd가 IPv6 주소를 사용하도록 구성할 수도 있다.
Kubernetes 옵션 일부는 이중 스택을 지원하지만 etcd는 지원하지 않는다. Kubernetes 이중 스택 지원에 관한 자세한 내용은
[kubeadm에서 이중 스택 지원](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)을 참고한다.
{{< /note >}}

1. etcd의 서비스 관리자로 kubelet을 구성한다.

   {{< note >}}etcd가 실행되어야 하는 모든 호스트에서 이 작업을 수행해야 한다.{{< /note >}}
   etcd를 먼저 생성했으므로, kubeadm에서 제공하는 kubelet 유닛 파일보다 우선순위가 높은
   새 유닛 파일을 만들어 서비스 우선순위를 덮어써야 한다.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # "systemd"를 컨테이너 런타임의 cgroup 드라이버로 바꾼다. kubelet의 기본값은 "cgroupfs"이다.
   # 다른 컨테이너 런타임을 사용하는 경우, 필요에 따라 "containerRuntimeEndpoint" 값을 바꾼다.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   kubelet이 실행 중인지 확인하려면 상태를 점검한다.

   ```sh
   systemctl status kubelet
   ```

1. kubeadm의 구성 파일을 만든다.

   다음 스크립트를 사용하여 etcd 멤버를 실행할 각 호스트에 대한 kubeadm 구성 파일을 하나씩
   생성한다.

   ```sh
   # HOST0, HOST1 및 HOST2를 호스트의 IP 주소로 변경한다
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # NAME0, NAME1 및 NAME2를 각 호스트의 호스트네임으로 변경한다
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # 다른 호스트로 옮길 파일을 저장할 임시 디렉터리를 만든다
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. 인증 기관을 생성한다.

   이미 인증 기관(CA)이 있다면 CA의 `crt` 및 `key` 파일을 `/etc/kubernetes/pki/etcd/ca.crt`와
   `/etc/kubernetes/pki/etcd/ca.key`에 복사하기만 하면 된다.
   이 파일을 복사한 후에는
   다음 단계인 "각 멤버의 인증서 생성하기"로 진행한다.

   아직 CA가 없다면 (kubeadm 구성 파일을 생성한)
   `$HOST0`에서 다음 명령을 실행한다.

   ```
   kubeadm init phase certs etcd-ca
   ```

   이 명령으로 다음 두 파일을 만든다.

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. 각 멤버의 인증서를 생성한다.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # 재사용할 수 없는 인증서를 정리한다
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # HOST0용 인증서이므로 옮길 필요가 없다

   # 이 호스트에서 복사하면 안 되는 인증서를 정리한다
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. 인증서와 kubeadm 구성을 복사한다.

   인증서를 생성했으므로 이제
   인증서를 해당 호스트로 옮겨야 한다.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. 필요한 파일이 모두 있는지 확인한다.

   `$HOST0`에 필요한 파일의 전체 목록은 다음과 같다.

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST1`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST2`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. 스태틱 파드 매니페스트를 생성한다.

   이제 인증서와 구성이 준비되었으므로 매니페스트를 만들 차례다.
   각 호스트에서 `kubeadm` 명령을 실행하여
   etcd의 스태틱 매니페스트를 생성한다.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. 선택 사항: 클러스터 헬스를 확인한다.

    만약 `etcdctl`을 사용할 수 없다면 컨테이너 이미지 안에서 이 도구를 실행할 수 있다.
    이 작업은 `crictl run` 같은 도구를 사용해 Kubernetes를 거치지 않고 
    컨테이너 런타임에서 직접 수행한다.

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - `${HOST0}`을 테스트할 호스트의 IP 주소로 설정한다.


## {{% heading "whatsnext" %}}

멤버 3개가 정상적으로 작동하는 etcd 클러스터를 만들었다면,
[kubeadm의 외부 etcd 방식](/docs/setup/production-environment/tools/kubeadm/high-availability/)을 사용하여
고가용성 컨트롤 플레인을 계속 설정할 수 있다.

---
reviewers:
- sig-cluster-lifecycle
title: kubeadm 으로 HA 클러스터 구성하기
content_template: templates/task
weight: 60
---

{{% capture overview %}}

이 문서는 kubeadm 을 사용해 쿠버네티스 클러스터의 HA 구성을 하는 두 가지 방법을 설명한다.

* 스택 구성이 된 컨트롤 영역 (stacked control plane) 노드로 구성. 인프라가 더 적게 필요. etcd 멤버와 컨트롤 영역 노드들을 같은 곳에 위치한다.
* 외부 etcd 컨트롤러로 구성. 이 경우 인프라 자원이 더 많이 필요하다. 컨트롤 영역 노드와 etcd 멤버는 분리된다. 

더 진행하기 전에 어플리케이션과 주변 환경의 니즈를 위해 어떤 방법을 선택하는 것이 좋은지 주의 깊게 생각해보아야 한다. 이 [비교 문서](/docs/setup/independent/ha-topology/)에서 각각에 대한 장점과 단점을 찾아볼 수 있다.

클러스터에서 실행되는 쿠버네티스의 버전이 1.12 이후 버전이어야 한다. 또한 Kubeadm 을 통한 HA 클러스터 구성이 아직 실험 단계이며 미래 릴리즈 버전에서 더 간단해질 수 있음을 양지하고 있어야 한다. 예를 들어 클러스터 업그레이드를 할 때 이슈가 발생할 수 있다. 쿠버네티스 팀은 둘 중 한 방법을 사용해보고 이에 대한 피드백을 kubeadm [issue tracker](https://github.com/kubernetes/kubeadm/issues/new)에 공유해주기를 요청한다.

[업그레이드 문서](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14)도 함께 참고하기를 권고한다.

{{< caution >}}
이 문서는 클러스터가 클라우드 프로바이더 위에서 동작하는 케이스를 고려하지 않는다.
클라우드 환경에서 위와 같은 방법으로 HA 구성을 하면 로드밸런서나 동적 PersistentVolume 서비스 객체를 사용할 수 없다.
{{< /caution >}}

{{% /capture %}}

{{% capture prerequisites %}}

두 방법 모두 다음과 같은 인프라를 필요로 한다:
* 마스터 [kubeadm 최소 설치요건](/docs/setup/independent/install-kubeadm/#before-you-begin) 을 만족시키는 서버 세 대
* 워커노드 [kubeadm 최소 설치요건](/docs/setup/independent/install-kubeadm/#before-you-begin) 을 만족시키는 서버 세 대
* 클러스터 내 모든 머신 간의 모든 네트워크 통신 허용 (퍼블릭/프라이빗 관계 없음)
* 모든 서버의 최고권한 계정
* 한 서버에서 모든 노드로 SSH 가능하도록 설정
* 모든 머신에  `kubeadm`과 `kubelet` 설치. `kubectl`은 선택사항.

외부 etcd 클러스터를 사용하는 경우에는 다음 자원을 추가로 필요로 한다:
* etcd 멤버들을 위한 추가 서버 세 대 

{{% /capture %}}

{{% capture steps %}}

## 첫 단계 (두 방법 모두)

### kube-apiserver 를 위한 로드밸런서 생성 

{{< note >}}
로드밸런서를 위한 설정은 굉장히 많다. 다음 예제는 그 중 하나 만을 사용한다. 클러스터 요건에 따라 다른 설정을 사용해야 할 수 있다.
{{< /note >}}

1.  DNS에 등록된 이름으로 kube-apiserver 로드밸런서를 생성한다.


    - 클라우드 환경에서는 컨트롤 영역 노드를, TCP 포워딩하는 로드 밸런서 뒤에 두어야 한다. 이 로드 밸런서가 정상 상태의 컨트롤 영역 노드에 트래픽을 분산해주어야 하기 때문이다. apiserver의 헬스체크는 kube-apiserver (기본으로 6443 포트에서 리슨) 포트의 TCP 체크로 수행한다.

    - 클라우드 환경의 IP 주소를 바로 사용하는 것은 권장하지 않는다.

    - 로드밸런서는 apiserver 포트를 통해 모든 컨트롤 영역 노드와 통신할 수 있어야 한다. 로드밸런서는 리스닝하는 포트로 들어오는 트래픽을 수용할 수 있어야 한다.

    - [HAProxy](http://www.haproxy.org/) 를 로드 밸런서로 사용할 수 있다.

    - 로드밸런서의 주소가 kubeadm의 `ControlPlaneEndpoint` 값과 항상 동일해야 한다.

1.  첫번째 컨트롤 영역 노드를 로드 밸런서에 추가하고 연결을 테스트한다:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - 커넥션 거부 에러는 apiserver가 아직 실행 중이지 않아서 발생하는 것일 수 있다. 그렇지만 타임아웃은 로드밸런서가 컨트롤 영역 노드와 통신할 수 없다는 것을 의미한다. 타임아웃이 발생하면 로드밸런서와 컨트롤 영역 노드 통신 설정하는 부분을 다시 설정한다.

1.  남은 컨트롤 영역 노드들을 로드 밸런서 타겟 그룹에 추가한다.

## 스택형 컨트롤 영역과 etcd 노드
### 첫번째 컨트롤 영역 노드 구성 절차

1.  첫번째 컨트롤 영역 노드에서, `kubeadm-config.yaml` 설정 파일을 생성한다:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"

    - `kubernetesVersion` 은 설치된 쿠버네티스 버전을 반영한다. 이 예제에서는 `stable` 버전을 사용한다.
    - `controlPlaneEndpoint` 은 로드밸런서의 주소나 DNS, 포트와 일치해야 한다.
    - kubeadm, kubelet, kubectl, 쿠버네티스의 버전이 일치하는 것을 권장한다.

{{< note >}}
Calico와 같은 CNI 네트워크 플러그인은 `192.168.0.0/16`과 같이 CIDR을 사용해야 하는 반면, Weave 등은 그렇지 않다. 자세한 내용은 [CNI 네트워크 문서](/docs/setup/independent/create-cluster-kubeadm/#pod-network)를 참조한다.
파드에 CIDR를 추가하려면 `ClusterConfiguration`의 `networking` 객체 아래에 있는 `podSubnet: 192.168.0.0/16` 필드값을 설정한다.
{{< /note >}}

1.  노드를 초기화한다:

    ```sh
    sudo kubeadm init --config=kubeadm-config.yaml --experimental-upload-certs
    ```
    - `--experimental-upload-certs` 플래그는 클러스터 내의 모든 컨트롤 영역 인스턴스에서 공유되어야 하는 인증서를 업로드할 때 사용한다. 수동으로 인증서를 복사하거나 별도의 자동화 툴을 사용하고자 하는 경우 이 플래그를 뺀다. 수동 설정의 자세한 내용은 아래 [인증서 수동 복사](#manual-certs) 섹션을 확인한다.

    명령어 실행이 완료되면 다음과 같은 결과가 출력된다:
    
    ```sh
    ...
    You can now join any number of control-plane node by running the following command on each as a root:
      kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --experimental-control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    
    Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
    As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

    Then you can join any number of worker nodes by running the following on each as root:
      kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
    ```

    - 이 결과를 텍스트 파일에 복사한다. 다른 컨트롤 영역 노드들을 클러스터에 조인시킬 때 필요하다.
    - `--experimental-upload-certs`이 `kubeadm init`과 함께 사용되면 주요 컨트롤 영역의 인증서는 암호화되고 `kubeadm-certs` Secret에 업로드 된다. 
    - 인증서를 다시 업로드하고 새 복호화키를 생성하기 위해서는, 클러스터에 조인되어 있는 컨트롤 영역 노드에 다음과 같은 명령어를 실행한다.

      ```sh
      sudo kubeadm init phase upload-certs --experimental-upload-certs
      ```

{{< note >}}
`kubeadm-certs` Secret과 복호화키는 두 시간 뒤에 만료된다.
{{< /note >}}

{{< caution >}}
명령어 결과에도 써있듯, certificate-key는 클러스터의 민감한 정보에 접근할 수 있도록 해주므로 비공개로 잘 관리해야 한다.
{{< /caution >}}

1.  선택한 CNI 플러그인을 적용한다:

    CNI 프로바이더 설치를 위해 [이 소개 문서를 참고한다](/docs/setup/independent/create-cluster-kubeadm/#pod-network). CIDR을 사용하는 경우 kubeadm의 설정 파일에 파드 CIDR 정보가 반영되도록 한다.

    이 예시에서는 Weave Net을 사용한다:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  다음 명령어를 수행하여 컨트롤 영역 컴포넌트의 파드가 시작되는 것을 확인한다:

    ```sh
    kubectl get pod -n kube-system -w
    ```

### 나머지 컨트롤 영역 노드를 위한 절차

{{< caution >}}
첫번째 노드가 초기화되고 나서 새 컨트롤 영역 노드를 순차적으로 조인시켜야 한다.
{{< /caution >}}

추가 컨트롤 영역 노드에 대해 다음 조치를 수행해야 한다:

1.  첫번재 노드에서 `kubeadm init`을 수행한 결과에서 출력된 조인 명령어를 수행한다. 다음과 같은 형태다:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --experimental-control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - `--experimental-control-plane` 플래그는 `kubeadm join` 가 새로운 컨트롤 영역을 생성하도록 해준다.
    - `--certificate-key ...`는 컨트롤 영역 인증서가 클러스터의 `kubeadm-certs` Secret 에서 다운로드 되고, 주어진 키로 복호화되도록 한다.

## 외부 etcd 노드

외부 etcd 노드와 클러스터를 설정하는 것은 스택형 etcd 의 절차와 비슷하다. 다만 여기서는 etcd를 먼저 설정하고, etcd 정보를 kubeadm 설정 파일에 넘겨줘야 하는 것이 조금 다르다. 

### etcd 클러스터 설정

1.  etcd 클러스터 설정을 위해서는 [이 가이드](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)를 따른다.

1.  [여기](#manual-certs)에 설명된 대로 SSH를 설정한다.

1.  클러스터의 etcd 노드에서 다음 파일을 복사하여 첫번째 컨트롤 영역 노드에 추가한다:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - `CONTROL_PLANE` 의 값을 첫번째 컨트롤 영역 서버의 `user@host` 형식으로 수정한다.

### 첫번째 컨트롤 영역 노드 설정

1.  디음과 같은 내용으로 `kubeadm-config.yaml` 설정 파일을 생성한다:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
            external:
                endpoints:
                - https://ETCD_0_IP:2379
                - https://ETCD_1_IP:2379
                - https://ETCD_2_IP:2379
                caFile: /etc/kubernetes/pki/etcd/ca.crt
                certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
                keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key

{{< note >}}
스택형 etcd와 외부 etcd의 차이는 kubeadm 설정 파일의 `etcd` 필드에 `external` 값을 넣는 데에서 찾을 수 있다. 스택형 etcd 토폴로지에서는 이 부분이 별도 설정 없이 자동으로 처리된다.
{{< /note >}}

    -  설정 템플릿의 다음 값들을 클러스터에 맞게 수정한다:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

다음 절차는 스택형 etcd 설치 과정과 똑같이 수행한다:

1.  `sudo kubeadm init --config kubeadm-config.yaml --experimental-upload-certs` 실행.

1.  결과 부분의 조인 명령어를 별도로 저장하여 나중에 사용할 수 있도록 한다.

1.  선택한 CNI 플러그인을 설치한다. 이 예시에서는 Weave Net를 사용한다:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### 나머지 컨트롤 영역 노드를 위한 절차

스택형 etcd 설치를 위한 절차와 동일하다:

- 첫번째 컨트롤 영역 노드가 완벽하게 초기화 됐는지 확인한다.
- 별도로 빼놓은 조인 명령어를 각각의 컨트롤 영역 노드에 실행한다. 한 노드씩 조인시키는 것을 권장한다.
- `--certificate-key`로 추출된 복호화키는 기본적으로 두 시간 후에 만료된다.

## 컨트롤 영역 부트스트래핑 이후 보통 수행하는 일들

### 워커노드 설치

워커노드는 이전에 저장해놓은 `kubeadm init` 결과로 출력된 명령어로 클러스터에 조인할 수 있다:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## 인증서 수동 복사 {#manual-certs}

`--experimental-upload-certs`와 함께 `kubeadm init`을 실행하지 않으면, 메인 컨트롤 영역 노드의 인증서를 수동으로 다른 컨트롤 영역 노드에 복사해야 한다.

여러 방법으로 수동 복사를 할 수 있다. 다음 예시에서는 `ssh`와 `scp`를 사용하는 방법을 소개한다:
한 서버에서 모든 노드를 관리하기 위해서는 SSH가 필요하다.

1.  메인 서버에서 다른 모든 노드로 접속할 수 있도록 ssh-agent를 활성화한다.

    ```
    eval $(ssh-agent)
    ```

1.  세션에 SSH 인증정보를 추가한다.

    ```
    ssh-add ~/.ssh/path_to_private_key
    ```

1.  연결 상태 확인을 위해 노드 간 SSH 접속을 해본다.

    - SSH로 다른 노드에 들어가려고 할 때, `-A` 플래그를 붙인다.
        ```
        ssh -A 10.0.0.7
        ```

    - 어떤 노드에서 sudo 명령어를 사용할 때, SSH 포워딩 작업을 위해 sudo 환경을 유지한다.
      forwarding works:

        ```
        sudo -E -s
        ```


1. 모든 노드에 SSH를 설정한 후, `kubeadm init` 실행이 되고 난 첫번째 컨트롤 영역 노드에 다음 스크립트를 실행해야 한다. 이 스크리브는 첫번째 노드에서 인증서를 복사하여 다른 컨트롤 영역 노드에 복사한다:
    다음 예시에서 `CONTROL_PLANE_IPS` 부분을 다른 컨트롤 영역 노드의 IP 주소로 대체한다.
    ```sh
    USER=ubuntu # customizable
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
    done
    ```

{{< caution >}}
위 리스트에서 인증서만 복사한다. kubeadm이 SAN을 통해 나머지 인증서 생성을 처리해준다. 실수로 모든 인증서를 복사한 경우, SAN 부족으로 인해 추가 노드 생성이 실패할 것이다.
{{< /caution >}}

1. 복사가 완료되고 나면 각각의 컨트롤 영역 노드에 다음 스크립트를 실행하고 난 뒤 `kubeadm join`을 실행한다. 이 스크립트는 이전에 복사된 인즏서들을 홈 디렉토리에서 `/etc/kuberentes/pki`로 옮겨준다.

    ```sh
    USER=ubuntu # customizable
    mkdir -p /etc/kubernetes/pki/etcd
    mv /home/${USER}/ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/ca.key /etc/kubernetes/pki/
    mv /home/${USER}/sa.pub /etc/kubernetes/pki/
    mv /home/${USER}/sa.key /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
    mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    ```

{{% /capture %}}
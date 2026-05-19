---
title: 파드 간 통신이 활성화된 잡
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

<!-- overview -->

이 예제에서는, 파드의 IP 주소 대신 호스트네임으로 상호 통신할 수 있도록 파드를 생성하는 잡을
[색인된 완료 모드(Indexed completion mode)](/blog/2021/04/19/introducing-indexed-jobs/)로 구성하여 실행한다.

잡 내부의 파드들이 서로 통신해야 하는 경우가 있다. 각 파드에서 실행되는 사용자 워크로드에서 쿠버네티스 API 서버에
질의하여 다른 파드의 IP를 알아낼 수도 있지만, 쿠버네티스에 내장된 DNS 변환(resolution)을 활용하는 것이 훨씬 간편하다.

색인된 완료 모드의 잡은 자동으로 파드의 호스트네임을 `${jobName}-${completionIndex}` 형식으로 설정한다.
이 형식을 활용하면 파드 호스트네임을 결정론적(deterministically)으로 빌드하고 파드 간 통신을 활성화할 수 있다.
쿠버네티스 컨트롤 플레인에 대해 클라이언트 연결을 생성하고 API 요청으로 파드 호스트네임 및 IP를 알아낼 필요 없이 말이다.

이러한 설정은 파드 네트워킹이 필요하지만
쿠버네티스 API 서버와의 네트워크 연결에 의존하지 않고 싶은 경우에 유용하다.

## {{% heading "prerequisites" %}}

기본적으로 [잡](/ko/docs/concepts/workloads/controllers/job/) 사용 방법에 익숙하다는 것을 가정한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{<note>}}
MiniKube 혹은 유사한 도구를 사용하고 있다면 DNS 셋업을 위해
[추가적인 작업](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)이
필요할 수 있다.
{{</note>}}

<!-- steps -->

## 파드 간 통신이 활성화된 잡 시작하기

잡의 파드 호스트네임을 활용한 파드 간 통신을 활성화하기 위해서는 다음 작업을 진행해야 한다.

1. 잡으로 생성되는 파드들에 대한 레이블 셀렉터를 지닌 [헤드리스 서비스](/ko/docs/concepts/services-networking/service/#헤드리스-headless-서비스)를 만든다.
헤드리스 서비스는 반드시 잡과 동일한 네임스페이스에 생성해야 한다. 
쿠버네티스에 의해 `job-name` 레이블이 자동으로 생성되므로 `job-name: <your-job-name>` 셀렉터를 활용하면 간단하다. 
해당 설정은 잡에서 실행 중인 파드들의 호스트네임에 대한 레코드를 생성하도록 DNS 시스템을 트리거할 것이다.

2. 잡 템플릿 스펙에 아래 값을 추가함으로써 헤드리스 서비스를 잡의 파드들의 서브도메인 서비스로 설정한다.

   ```yaml
   subdomain: <headless-svc-name>
   ```

### 예제
아래는 파드 호스트네임을 통해 파드 간 통신이 활성화된 잡의 예시이다.
해당 잡은 모든 파드들이 호스트네임으로 상호 핑(ping)을 성공한 경우에만 완료된다.
{{<note>}}
네임스페이스 외부에서 잡의 파드들에 접근해야 한다면, 아래 예시의 
각 파드에서 실행되는 배쉬(Bash) 스크립트에서 파드 호스트네임에 네임스페이스를 접두사로 추가하면 된다.
{{</note>}}

```yaml

apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # 헤드리스 서비스를 생성하기 위해서는 clusterIP가 반드시 None이어야 한다.
  selector:
    job-name: example-job # 잡의 name과 일치해야 한다.
---
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      subdomain: headless-svc # 서비스의 name과 일치해야 한다.
      restartPolicy: Never
      containers:
      - name: example-workload
        image: bash:latest
        command:
        - bash
        - -c
        - |
          for i in 0 1 2
          do
            gotStatus="-1"
            wantStatus="0"             
            while [ $gotStatus -ne $wantStatus ]
            do                                       
              ping -c 1 example-job-${i}.headless-svc > /dev/null 2>&1
              gotStatus=$?                
              if [ $gotStatus -ne $wantStatus ]; then
                echo "Failed to ping pod example-job-${i}.headless-svc, retrying in 1 second..."
                sleep 1
              fi
            done                                                         
            echo "Successfully pinged pod: example-job-${i}.headless-svc"
          done
```

위의 예제를 적용한 이후, `<pod-hostname>.<headless-service-name>`를 사용하여 네트워크 상으로 서로 통신해보자.
아래와 유사한 내용이 출력될 것이다.

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{<note>}}
해당 예제에서 사용된 `<pod-hostname>.<headless-service-name>` 이름 형식은 
DNS 정책을 `None` 혹은 `Default`로 설정할 경우 제대로 동작하지 않을 것임에 유의해야 한다. 
파드 DNS 정책에 대해 더 배우고 싶다면 
[여기](/ko/docs/concepts/services-networking/dns-pod-service/#파드의-dns-정책)를 참고하자.
{{</note>}}

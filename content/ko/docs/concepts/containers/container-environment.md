---



title: 컨테이너 환경 변수
content_type: concept
weight: 20
---

<!-- overview -->

이 페이지는 컨테이너 환경에서 컨테이너에 가용한 리소스에 대해 설명한다.




<!-- body -->

## 컨테이너 환경

쿠버네티스 컨테이너 환경은 컨테이너에 몇 가지 중요한 리소스를 제공한다.

* 하나의 [이미지](/ko/docs/concepts/containers/images/)와 하나 이상의 [볼륨](/ko/docs/concepts/storage/volumes/)이 결합된 파일 시스템.
* 컨테이너 자신에 대한 정보.
* 클러스터 내의 다른 오브젝트에 대한 정보.

### 컨테이너 정보

컨테이너의 *호스트네임* 은 컨테이너가 동작 중인 파드의 이름과 같다.
그것은 `hostname` 커맨드 또는 libc의
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)
함수 호출을 통해서 구할 수 있다.

파드 이름과 네임스페이스는
[다운워드(Downward) API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)를 통해 환경 변수로 구할 수 있다.

Docker 이미지에 정적으로 명시된 환경 변수와 마찬가지로,
파드 정의에서의 사용자 정의 환경 변수도 컨테이너가 사용할 수 있다.

### 클러스터 정보

컨테이너가 생성될 때 실행 중이던 모든 서비스의 목록은 환경 변수로 해당 컨테이너에서 사용할 수
있다.
이 목록은 새로운 컨테이너의 파드 및 쿠버네티스 컨트롤 플레인 서비스와 동일한 네임스페이스 내에 있는 서비스로 한정된다.
이러한 환경 변수는 Docker 링크 구문과 일치한다.

*bar* 라는 이름의 컨테이너에 매핑되는 *foo* 라는 이름의 서비스에 대해서는,
다음의 형태로 변수가 정의된다.

```shell
FOO_SERVICE_HOST=<서비스가 동작 중인 호스트>
FOO_SERVICE_PORT=<서비스가 동작 중인 포트>
```

서비스에 지정된 IP 주소가 있고 [DNS 애드온](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/)이 활성화된 경우, DNS를 통해서 컨테이너가 서비스를 사용할 수 있다.



## {{% heading "whatsnext" %}}


* [컨테이너 라이프사이클 훅(hooks)](/ko/docs/concepts/containers/container-lifecycle-hooks/)에 대해 더 배워 보기.
* [컨테이너 라이프사이클 이벤트에 핸들러 부착](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)
  실제 경험 얻기.

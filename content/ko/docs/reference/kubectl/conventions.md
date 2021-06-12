---


title: kubectl 사용 규칙
content_type: concept
---

<!-- overview -->
`kubectl`에 대한 권장 사용 규칙.


<!-- body -->

## 재사용 가능한 스크립트에서 `kubectl` 사용

스크립트의 안정적인 출력을 위해서

* `-o name`, `-o json`, `-o yaml`, `-o go-template` 혹은 `-o jsonpath`와 같은 머신 지향(machine-oriented) 출력 양식 중 하나를 요청한다.
* 예를 들어 `jobs.v1.batch/myjob`과 같이 전체 버전을 사용한다. 이를 통해 `kubectl`이 시간이 지남에 따라 변경될 수 있는 기본 버전을 사용하지 않도록 한다.
* 문맥, 설정 또는 기타 암묵적 상태에 의존하지 않는다.

## 모범 사례

### `kubectl run`

`kubectl run`으로 infrastructure as code를 충족시키기 위해서

* 버전이 명시된 태그로 이미지를 태그하고 그 태그를 새로운 버전으로 이동하지 않는다. 예를 들어, `:latest`가 아닌 `:v1234`, `v1.2.3`, `r03062016-1-4`를 사용한다(자세한 정보는 [구성 모범 사례](/ko/docs/concepts/configuration/overview/#컨테이너-이미지)를 참고한다).
* 많은 파라미터가 적용된 이미지를 위한 스크립트를 작성한다.
* 필요하지만 `kubectl run` 플래그를 통해 표현할 수 없는 기능은 구성 파일을 소스 코드 버전 관리 시스템에 넣어서 전환한다.

`--dry-run` 플래그를 사용하여 실제로 제출하지 않고 클러스터로 보낼 오브젝트를 미리 볼 수 있다.

{{< note >}}
모든 `kubectl run`의 생성기(generator)는 더 이상 사용 할 수 없다. 생성기 [목록](https://v1-17.docs.kubernetes.io/docs/reference/kubectl/conventions/#generators) 및 사용 방법은 쿠버네티스 v1.17 문서를 참고한다.
{{< /note >}}

#### 생성기
`kubectl create --dry-run -o yaml`라는 kubectl 커맨드를 통해 다음과 같은 리소스를 생성할 수 있다.

* `clusterrole`: 클러스터롤(ClusterRole)를 생성한다.
* `clusterrolebinding`: 특정 클러스터롤에 대한 클러스터롤바인딩(ClusterRoleBinding)을 생성한다.
* `configmap`: 로컬 파일, 디렉토리 또는 문자 그대로의 값으로 컨피그맵(ConfigMap)을 생성한다.
* `cronjob`: 지정된 이름으로 크론잡(CronJob)을 생성한다.
* `deployment`: 지정된 이름으로 디플로이먼트(Deployment)를 생성한다.
* `job`: 지정된 이름으로 잡(Job)을 생성한다.
* `namespace`: 지정된 이름으로 네임스페이스(Namespace)를 생성한다.
* `poddisruptionbudget`: 지정된 이름으로 PodDisruptionBudget을 생성한다.
* `priorityclass`: 지정된 이름으로 프라이어리티클래스(PriorityClass)을 생성한다.
* `quota`: 지정된 이름으로 쿼터(Quota)를 생성한다.
* `role`: 단일 규칙으로 롤(Role)을 생성한다.
* `rolebinding`: 특정 롤 또는 클러스터롤에 대한 롤바인딩(RoleBinding)을 생성한다.
* `secret`: 지정된 하위 커맨드를 사용하여 시크릿(Secret)을 생성한다.
* `service`: 지정된 하위 커맨드를 사용하여 서비스(Service)를 생성한다.
* `serviceaccount`: 지정된 이름으로 서비스어카운트(ServiceAccount)을 생성한다.

### `kubectl apply`

* `kubectl apply`를 사용해서 리소스를 생성하거나 업데이트 할 수 있다. kubectl apply를 사용하여 리소스를 업데이트하는 방법에 대한 자세한 정보는 [Kubectl 책](https://kubectl.docs.kubernetes.io)을 참고한다.

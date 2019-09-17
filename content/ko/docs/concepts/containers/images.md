---
title: 이미지
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

사용자 Docker 이미지를 생성하고 레지스트리에 푸시(push)하여 쿠버네티스 파드에서 참조되기 이전에 대비한다. 

컨테이너의 `image` 속성은 `docker` 커맨드에서 지원하는 문법과 같은 문법을 지원한다. 이는 프라이빗 레지스트리와 태그를 포함한다.

{{% /capture %}}


{{% capture body %}}

## 이미지 업데이트

기본 풀(pull) 정책은 `IfNotPresent`이며, 이것은 Kubelet이 이미 
존재하는 이미지에 대한 풀을 생략하게 한다. 만약 항상 풀을 강제하고 싶다면, 
다음 중 하나를 수행하면 된다.

- 컨테이너의 `imagePullPolicy`를 `Always`로 설정.
- `imagePullPolicy`를 생략하고 `:latest`를 사용할 이미지의 태그로 사용.
- `imagePullPolicy`와 사용할 이미지의 태그를 생략.
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) 어드미션 컨트롤러를 활성화.

`:latest` 태그 사용은 피해야 한다는 것을 참고하고, 자세한 정보는 [구성을 위한 모범 사례](/docs/concepts/configuration/overview/#container-images)를 참고한다.

## 매니페스트로 멀티-아키텍처 이미지 빌드

Docker CLI는 현재 `docker manifest` 커맨드와 `create`, `annotate`, `push`와 같은 서브 커맨드를 함께 지원한다. 이 커맨드는 매니페스트를 빌드하고 푸시하는데 사용할 수 있다. 매니페스트를 보기 위해서는 `docker manifest inspect`를 사용하면 된다.

다음에서 docker 문서를 확인하기 바란다.
https://docs.docker.com/edge/engine/reference/commandline/manifest/

이것을 사용하는 방법에 대한 예제는 빌드 하니스(harness)에서 참조한다. 
https://cs.k8s.io/?q=docker%20manifest%20(create%7Cpush%7Cannotate)&i=nope&files=&repos=

이 커맨드는 Docker CLI에 의존하며 그에 전적으로 구현된다. `$HOME/.docker/config.json` 편집 및 `experimental` 키를 `enabled`로 설정하거나, CLI 커맨드 호출 시 간단히  `DOCKER_CLI_EXPERIMENTAL` 환경 변수를 `enabled`로만 설정해도 된다.

{{< note >}}
Docker *18.06 또는 그 이상* 을 사용하길 바란다. 더 낮은 버전은 버그가 있거나 실험적인 명령줄 옵션을 지원하지 않는다. 예를 들어 https://github.com/docker/cli/issues/1135 는 containerd에서 문제를 일으킨다.
{{< /note >}}

오래된 매니페스트 업로드를 실행하는 데 어려움을 겪는다면, `$HOME/.docker/manifests`에서 오래된 매니페스트를 정리하여 새롭게 시작하면 된다.

쿠버네티스의 경우, 일반적으로 접미사 `-$(ARCH)`가 있는 이미지를 사용해 왔다. 하위 호환성을 위해, 접미사가 있는 구형 이미지를 생성하길 바란다. 접미사에 대한 아이디어는 모든 아키텍처를 위한 매니페스트를 가졌다는 의미가 내포된 `pause` 이미지를 생성하고, 접미사가 붙은 이미지가 하드 코드되어 있을 오래된 구성 또는 YAML 파일에 대해 하위 호환된다는 의미가 내포되어 있는 `pause-amd64`를 생성하기 위한 것이다.

## 프라이빗 레지스트리 사용

프라이빗 레지스트리는 해당 레지스트리에서 이미지를 읽을 수 있는 키를 요구할 것이다.
자격 증명(credential)은 여러 가지 방법으로 제공될 수 있다.

  - Google 컨테이너 레지스트리 사용
    - 각 클러스터에 대하여
    - Google 컴퓨트 엔진 또는 Google 쿠버네티스 엔진에서 자동적으로 구성됨
    - 모든 파드는 해당 프로젝트의 프라이빗 레지스트리를 읽을 수 있음
  - AWS Elastic Container Registry(ECR) 사용
    - IAM 역할 및 정책을 사용하여 ECR 저장소에 접근을 제어함
    - ECR 로그인 자격 증명은 자동으로 갱신됨
  - Oracle 클라우드 인프라스트럭처 레지스트리(OCIR) 사용
    - IAM 역할과 정책을 사용하여 OCIR 저장소에 접근을 제어함
  - Azure 컨테이너 레지스트리(ACR) 사용
  - IBM 클라우드 컨테이너 레지스트리 사용
  - 프라이빗 레지스트리에 대한 인증을 위한 노드 구성
    - 모든 파드는 구성된 프라이빗 레지스트리를 읽을 수 있음
    - 클러스터 관리자에 의한 노드 구성 필요
  - 미리 내려받은(pre-pulled) 이미지
    - 모든 파드는 노드에 캐시된 모든 이미지를 사용 가능
    - 셋업을 위해서는 모든 노드에 대해서 root 접근이 필요
  - 파드에 ImagePullSecrets을 명시
    - 자신의 키를 제공하는 파드만 프라이빗 레지스트리에 접근 가능

각 옵션은 아래에서 더 자세히 설명한다.


### Google 컨테이너 레지스트리 사용

쿠버네티스는 Google 컴퓨트 엔진(GCE)에서 동작할 때, [Google 컨테이너 
레지스트리(GCR)](https://cloud.google.com/tools/container-registry/)를 자연스럽게 
지원한다. 사용자의 클러스터가 GCE 또는 Google 쿠버네티스 엔진에서 동작 중이라면, 간단히 
이미지의 전체 이름(예: gcr.io/my_project/image:tag)을 사용하면 된다.

클러스터 내에서 모든 파드는 해당 레지스트리에 있는 이미지에 읽기 접근 권한을 가질 것이다.

Kubelet은 해당 인스턴스의 Google 서비스 계정을 이용하여 GCR을 인증할 것이다.
인스턴스의 서비스 계정은 `https://www.googleapis.com/auth/devstorage.read_only`라서,
프로젝트의 GCR로부터 풀은 할 수 있지만 푸시는 할 수 없다.

### Amazon Elastic Container Registry 사용

쿠버네티스는 노드가 AWS EC2 인스턴스일 때, [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/)를 자연스럽게 지원한다.

간단히 이미지의 전체 이름(예: `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)을 
파드 정의에 사용하면 된다.

파드를 생성할 수 있는 클러스터의 모든 사용자는 ECR 레지스트리에 있는 어떠한 
이미지든지 파드를 실행하는데 사용할 수 있다.

kubelet은 ECR 자격 증명을 가져오고 주기적으로 갱신할 것이다. 이것을 위해서는 다음에 대한 권한이 필요하다.

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:GetRepositoryPolicy`
- `ecr:DescribeRepositories`
- `ecr:ListImages`
- `ecr:BatchGetImage`

요구 사항:

- Kubelet 버전 `v1.2.0` 이상을 사용해야 한다.  (예: `/usr/bin/kubelet --version=true`를 실행).
- 노드가 지역 A에 있고 레지스트리가 다른 지역 B에 있다면, 버전 `v1.3.0` 이상이 필요하다.
- 사용자의 지역에서 ECR이 지원되어야 한다.

문제 해결:

- 위의 모든 요구 사항을 확인한다.
- 워크스테이션에서 $REGION (예: `us-west-2`)의 자격 증명을 얻는다. 그 자격 증명을 사용하여 해당 호스트로 SSH를 하고 Docker를 수동으로 실행한다. 작동하는가?
- kubelet이 `--cloud-provider=aws`로 실행 중인지 확인한다.
- kubelet 로그에서 (예: `journalctl -u kubelet`) 다음과 같은 로그 라인을 확인한다.
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`

### Azure 컨테이너 레지스트리(ACR) 사용
[Azure 컨테이너 레지스트리](https://azure.microsoft.com/en-us/services/container-registry/)를 사용하는 경우 
관리자 역할의 사용자나 서비스 주체(principal) 중 하나를 사용하여 인증할 수 있다.
어느 경우라도, 인증은 표준 Docker 인증을 통해서 수행된다. 이러한 지침은 
[azure-cli](https://github.com/azure/azure-cli) 명령줄 도구 사용을 가정한다.

우선 레지스트리를 생성하고 자격 증명을 만들어야한다. 이에 대한 전체 문서는 
[Azure 컨테이너 레지스트리 문서](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)에서 찾을 수 있다.

컨테이너 레지스트리를 생성하고 나면, 다음의 자격 증명을 사용하여 로그인한다.

   * `DOCKER_USER` : 서비스 주체 또는 관리자 역할의 사용자명
   * `DOCKER_PASSWORD`: 서비스 주체 패스워드 또는 관리자 역할의 사용자 패스워드
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`

해당 변수에 대한 값을 채우고 나면 
[쿠버네티스 시크릿을 구성하고 그것을 파드 디플로이를 위해서 사용](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)할 수 있다.

### IBM 클라우드 컨테이너 레지스트리 사용
IBM 클라우드 컨테이너 레지스트리는 멀티-테넌트 프라이빗 이미지 레지스트리를 제공하여 사용자가 Docker 이미지를 안전하게 저장하고 공유할 수 있도록 한다. 기본적으로, 
프라이빗 레지스트리의 이미지는 통합된 취약점 조언기(Vulnerability Advisor)를 통해 조사되어 보안 이슈와 잠재적 취약성을 검출한다. IBM 클라우드 계정의 모든 사용자가 이미지에 접근할 수 있도록 하거나, 레지스트리 네임스페이스에 접근을 승인하는 토큰을 생성할 수 있다.

IBM 클라우드 컨테이너 레지스트리 CLI 플러그인을 설치하고 사용자 이미지를 위한 네임스페이스를 생성하기 위해서는, [IBM 클라우드 컨테이너 레지스트리 시작하기](https://cloud.ibm.com/docs/services/Registry?topic=registry-index#index)를 참고한다.

[IBM 클라우드 퍼블릭 이미지](https://cloud.ibm.com/docs/services/Registry?topic=registry-public_images#public_images) 및 사용자의 프라이빗 이미지로부터 컨테이너를 사용자의 IBM 클라우드 쿠버네티스 서비스 클러스터의 `default` 네임스페이스에 디플로이하기 위해서 IBM 클라우드 컨테이너 레지스트리를 사용하면 된다. 컨테이너를 다른 네임스페이스에 디플로이하거나, 다른 IBM 클라우드 컨테이너 레지스트리 지역 또는 IBM 클라우드 계정을 사용하기 위해서는, 쿠버네티스 `imagePullSecret`를 생성한다. 더 자세한 정보는, [이미지로부터 컨테이너 빌드하기](https://cloud.ibm.com/docs/containers?topic=containers-images#images)를 참고한다.

### 프라이빗 레지스트리에 대한 인증을 위한 노드 구성

{{< note >}}
Google 쿠버네티스 엔진에서 동작 중이라면, 이미 각 노드에 Google 컨테이너 레지스트리에 대한 자격 증명과 함께 `.dockercfg`가 있을 것이다. 그렇다면 이 방법은 쓸 수 없다.
{{< /note >}}

{{< note >}}
AWS EC2에서 동작 중이고 EC2 컨테이너 레지스트리(ECR)을 사용 중이라면, 각 노드의 kubelet은 
ECR 로그인 자격 증명을 관리하고 업데이트할 것이다. 그렇다면 이 방법은 쓸 수 없다.
{{< /note >}}

{{< note >}}
이 방법은 노드의 구성을 제어할 수 있는 경우에만 적합하다. 이 방법은 
GCE 및 자동 노드 교체를 수행하는 다른 클라우드 제공자에 대해서는 신뢰성 있게 작동하지 
않을 것이다.
{{< /note >}}

{{< note >}}
현재 쿠버네티스는 docker 설정의 `auths`와 `HttpHeaders` 섹션만 지원한다. 이는 자격증명 도우미(`credHelpers` 또는 `credStore`)가 지원되지 않는다는 뜻이다.
{{< /note >}}


Docker는 프라이빗 레지스트리를 위한 키를 `$HOME/.dockercfg` 또는 `$HOME/.docker/config.json` 파일에 저장한다. 만약 동일한 파일을 
아래의 검색 경로 리스트에 넣으면, kubelete은 이미지를 풀 할 때 해당 파일을 자격 증명 공급자로 사용한다.

*   `{--root-dir:-/var/lib/kubelet}/config.json`
*   `{cwd of kubelet}/config.json`
*   `${HOME}/.docker/config.json`
*   `/.docker/config.json`
*   `{--root-dir:-/var/lib/kubelet}/.dockercfg`
*   `{cwd of kubelet}/.dockercfg`
*   `${HOME}/.dockercfg`
*   `/.dockercfg`

{{< note >}}
아마도 kubelet을 위한 사용자의 환경 파일에 `HOME=/root`을 명시적으로 설정해야 할 것이다.
{{< /note >}}

프라이빗 레지스트리를 사용도록 사용자의 노드를 구성하기 위해서 권장되는 단계는 다음과 같다. 이 
예제의 경우, 사용자의 데스크탑/랩탑에서 아래 내용을 실행한다.

   1. 사용하고 싶은 각 자격 증명 세트에 대해서 `docker login [서버]`를 실행한다. 이것은 `$HOME/.docker/config.json`를 업데이트한다.
   1. 편집기에서 `$HOME/.docker/config.json`를 보고 사용하고 싶은 자격 증명만 포함하고 있는지 확인한다. 
   1. 노드의 리스트를 구한다. 예를 들면 다음과 같다.
      - 이름을 원하는 경우: `nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - IP를 원하는 경우: `nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. 로컬의 `.docker/config.json`를 위의 검색 경로 리스트 중 하나에 복사한다.
      - 예: `for n in $nodes; do scp ~/.docker/config.json root@$n:/var/lib/kubelet/config.json; done`

프라이빗 이미지를 사용하는 파드를 생성하여 검증한다. 예를 들면 다음과 같다.

```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
pod/private-image-test-1 created
```

만약 모든 것이 잘 작동한다면, 잠시 후에, 다음 메시지를 볼 것이다.

```shell
kubectl logs private-image-test-1
SUCCESS
```

만약 실패했다면, 다음 메시지를 볼 것이다.

```shell
kubectl describe pods/private-image-test-1 | grep "Failed"
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```

클러스터의 모든 노드가 반드시 동일한 `.docker/config.json`를 가져야 한다. 그렇지 않으면, 파드가 
일부 노드에서만 실행되고 다른 노드에서는 실패할 것이다. 예를 들어, 노드 오토스케일링을 사용한다면, 각 인스턴스 
템플릿은 `.docker/config.json`을 포함하거나 그것을 포함한 드라이브를 마운트해야 한다.

프라이빗 레지스트리 키가 `.docker/config.json`에 추가되고 나면 모든 파드는 
프라이빗 레지스트리의 이미지에 읽기 접근 권한을 가지게 될 것이다.

### 미리 내려받은 이미지

{{< note >}}
Google 쿠버네티스 엔진에서 동작 중이라면, 이미 각 노드에 Google 컨테이너 레지스트리에 대한 자격 증명과 함께 `.dockercfg`가 있을 것이다. 그렇다면 이 방법은 쓸 수 없다.
{{< /note >}}

{{< note >}}
이 방법은 노드의 구성을 제어할 수 있는 경우에만 적합하다. 이 방법은 
GCE 및 자동 노드 교체를 수행하는 다른 클라우드 제공자에 대해서는 신뢰성 있게 작동하지 
않을 것이다.
{{< /note >}}

기본적으로, kubelet은 지정된 레지스트리에서 각 이미지를 풀 하려고 할 것이다.
그러나, 컨테이너의 `imagePullPolicy` 속성이 `IfNotPresent` 또는 `Never`으로 설정되어 있다면, 
로컬 이미지가 사용된다(우선적으로 또는 배타적으로).

레지스트리 인증의 대안으로 미리 풀 된 이미지에 의존하고 싶다면, 
클러스터의 모든 노드가 동일한 미리 내려받은 이미지를 가지고 있는지 확인해야 한다.

이것은 특정 이미지를 속도를 위해 미리 로드하거나 프라이빗 레지스트리에 대한 인증의 대안으로 사용될 수 있다.

모든 파드는 미리 내려받은 이미지에 대해 읽기 접근 권한을 가질 것이다.

### 파드에 ImagePullSecrets 명시

{{< note >}}
이 방법은 현재 Google 쿠버네티스 엔진, GCE 및 노드 생성이 자동화된 모든 클라우드 제공자에게 
권장된다.
{{< /note >}}

쿠버네티스는 파드에 레지스트리 키를 명시하는 것을 지원한다.

#### Docker 구성으로 시크릿 생성

대문자 값을 적절히 대체하여, 다음 커맨드를 실행한다.

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

만약 Docer 자격 증명 파일이 이미 존재한다면, 위의 명령을 사용하지 않고, 
자격 증명 파일을 쿠버네티스 시크릿으로 가져올 수 있다.
[기존 Docker 자격 증명으로 시크릿 생성](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)에서 관련 방법을 설명하고 있다.
`kubectl create secret docker-registry`는 
하나의 개인 레지스트리에서만 작동하는 시크릿을 생성하기 때문에,
여러 개인 컨테이너 레지스트리를 사용하는 경우 특히 유용하다.

{{< note >}}
파드는 이미지 풀 시크릿을 자신의 네임스페이스에서만 참조할 수 있다.
따라서 이 과정은 네임스페이스 당 한 번만 수행될 필요가 있다.
{{< /note >}}

#### 파드의 imagePullSecrets 참조

이제, `imagePullSecrets` 섹션을 파드의 정의에 추가함으로써 해당 시크릿을 
참조하는 파드를 생성할 수 있다.

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

이것은 프라이빗 레지스트리를 사용하는 각 파드에 대해서 수행될 필요가 있다.

그러나, 이 필드의 셋팅은 [서비스 어카운트](/docs/user-guide/service-accounts) 리소스에 
imagePullSecrets을 셋팅하여 자동화할 수 있다.
자세한 지침을 위해서는 [서비스 어카운트에 ImagePullSecrets 추가](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)를 확인한다.

이것은 노드 당 `.docker/config.json`와 함께 사용할 수 있다. 자격 증명은 
병합될 것이다. 이 방법은 Google 쿠버네티스 엔진에서 작동될 것이다.

### 유스케이스

프라이빗 레지스트리를 구성하기 위한 많은 솔루션이 있다. 다음은 여러 가지 
일반적인 유스케이스와 제안된 솔루션이다. 

1. 비소유 이미지(예를 들어, 오픈소스)만 실행하는 클러스터의 경우. 이미지를 숨길 필요가 없다.
   - Docker hub의 퍼블릭 이미지를 사용한다.
     - 설정이 필요 없다.
     - GCE 및 Google 쿠버네티스 엔진에서는, 속도와 가용성 향상을 위해서 로컬 미러가 자동적으로 사용된다. 
1. 모든 클러스터 사용자에게는 보이지만, 회사 외부에는 숨겨야하는 일부 독점 이미지를 
   실행하는 클러스터의 경우.
   - 호스트 된 프라이빗 [Docker 레지스트리](https://docs.docker.com/registry/)를 사용한다.
     - 그것은 [Docker Hub](https://hub.docker.com/signup)에 호스트 되어 있거나, 다른 곳에 되어 있을 것이다.
     - 위에 설명된 바와 같이 수동으로 .docker/config.json을 구성한다.
   - 또는, 방화벽 뒤에서 읽기 접근 권한을 가진 내부 프라이빗 레지스트리를 실행한다.
     - 쿠버네티스 구성은 필요 없다. 
   - 또는, GCE 및 Google 쿠버네티스 엔진에서는, 프로젝트의 Google 컨테이너 레지스트리를 사용한다.
     - 그것은 수동 노드 구성에 비해서 클러스터 오토스케일링과 더 잘 동작할 것이다.
   - 또는, 노드의 구성 변경이 불편한 클러스터에서는, `imagePullSecrets`를 사용한다.
1. 독점 이미지를 가진 클러스터로, 그 중 일부가 더 엄격한 접근 제어를 필요로 하는 경우.
   - [AlwaysPullImages 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)가 활성화되어 있는지 확인한다. 그렇지 않으면, 모든 파드가 잠재적으로 모든 이미지에 접근 권한을 가진다.
   - 민감한 데이터는 이미지 안에 포장하는 대신, "시크릿" 리소스로 이동한다. 
1. 멀티-테넌트 클러스터에서 각 테넌트가 자신의 프라이빗 레지스트리를 필요로 하는 경우.
   - [AlwaysPullImages 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)가 활성화되어 있는지 확인한다. 그렇지 않으면, 모든 파드가 잠재적으로 모든 이미지에 접근 권한을 가진다.
   - 인가가 요구되도록 프라이빗 레지스트리를 실행한다. 
   - 각 테넌트에 대한 레지스트리 자격 증명을 생성하고, 시크릿에 넣고, 각 테넌트 네임스페이스에 시크릿을 채운다.
   - 테넌트는 해당 시크릿을 각 네임스페이스의 imagePullSecrets에 추가한다.

{{% /capture %}}

다중 레지스트리에 접근해야 하는 경우, 각 레지스트리에 대해 하나의 시크릿을 생성할 수 있다.
Kubelet은 모든`imagePullSecrets` 파일을 하나의 가상`.docker / config.json` 파일로 병합한다.

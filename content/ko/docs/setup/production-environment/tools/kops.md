---
title: Kops로 쿠버네티스 설치하기
content_type: task
weight: 20
---

<!-- overview -->

이곳 빠른 시작에서는 사용자가 얼마나 쉽게 AWS에 쿠버네티스 클러스터를 설치할 수 있는지 보여준다.
[`kops`](https://github.com/kubernetes/kops)라는 이름의 툴을 이용할 것이다.

kops는 자동화된 프로비저닝 시스템인데,

* 완전 자동화된 설치
* DNS를 통해 클러스터들의 신원 확인
* 자체 복구: 모든 자원이 Auto-Scaling Groups에서 실행
* 다양한 OS 지원(Debian, Ubuntu 16.04 supported, CentOS & RHEL, Amazon Linux and CoreOS) - [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md) 보기
* 고가용성 지원 - [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/operations/high_availability.md) 보기
* 직접 프로비저닝 하거나 또는 할 수 있도록 terraform 매니페스트를 생성 - [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md) 보기



## {{% heading "prerequisites" %}}


* [kubectl](/ko/docs/tasks/tools/install-kubectl/)을 반드시 설치해야 한다.

* 반드시 64-bit (AMD64 그리고 Intel 64)디바이스 아키텍쳐 위에서 `kops` 를 [설치](https://github.com/kubernetes/kops#installing) 한다.

* [AWS 계정](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html)이 있고 [IAM 키](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)를 생성하고 [구성](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration)해야 한다. IAM 사용자는 [적절한 권한](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user)이 필요하다.



<!-- steps -->

## 클러스터 구축

### (1/5) kops 설치

#### 설치

[releases page](https://github.com/kubernetes/kops/releases)에서 kops를 다운로드 한다(소스 코드로부터 빌드하는 것도 역시 편리하다).

{{< tabs name="kops_installation" >}}
{{% tab name="macOS" %}}

최신 버전의 릴리즈를 다운받는 명령어:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest
| grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
```

특정 버전을 다운로드 받는다면 명령의 다음 부분을 특정 kops 버전으로 변경한다.

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

예를 들어 kops 버전을 v1.15.0을 다운로드 하려면 다음을 입력한다.

```shell
curl -LO  https://github.com/kubernetes/kops/releases/download/1.15.0/kops-darwin-amd64
```

kops 바이너리를 실행 가능하게 만든다.

```shell
chmod +x kops-darwin-amd64
```

kops 바이너리를 사용자의 PATH로 이동한다.

```shell
sudo mv kops-darwin-amd64 /usr/local/bin/kops
```

사용자는 [Homebrew](https://brew.sh/)를 이용해서 kops를 설치할 수 있다.

```shell
brew update && brew install kops
```

{{% /tab %}}
{{% tab name="리눅스" %}}

최신 릴리즈를 다운로드 받는 명령어:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
```

특정 버전의 kops를 다운로드하려면 명령의 다음 부분을 특정 kops 버전으로 변경한다.
```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```
예를 들어 kops 버전을 v1.15.0을 다운로드 하려면 다음을 입력한다.

```shell
curl -LO  https://github.com/kubernetes/kops/releases/download/1.15.0/kops-linux-amd64
```

kops 바이너리를 실행 가능하게 만든다.

```shell
chmod +x kops-linux-amd64
```

kops 바이너리를 사용자의 PATH로 이동한다.

```shell
sudo mv kops-linux-amd64 /usr/local/bin/kops
```

사용자는 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)를 이용해서 kops를 설치할 수 있다.

```shell
brew update && brew install kops
```

{{% /tab %}}
{{< /tabs >}}


### (2/5) 클러스터에 사용할 route53 domain 생성

kops는 클러스터 내부와 외부 모두에서 검색을 위해 DNS을 사용하기에 클라이언트에서 쿠버네티스 API 서버에 연결할
수 있다.

이런 클러스터 이름에 kops는 명확한 견해을 가지는데: 반드시 유효한 DNS 이름이어야 한다. 이렇게 함으로써
사용자는 클러스터를 헷갈리지 않을것이고, 동료들과 혼선없이 공유할 수 있으며,
IP를 기억할 필요없이 접근할 수 있다.

그렇게 하고 있겠지만, 클러스터를 구분하기 위해 서브도메인을 활용할 수 있다. 예를 들어
`useast1.dev.example.com`을 이용한다면, API 서버 엔드포인트는 `api.useast1.dev.example.com`가 될 것이다.

Route53 hosted zone은 서브도메인도 지원한다. 여러분의 hosted zone은 `useast1.dev.example.com`,
`dev.example.com` 그리고 `example.com` 같은 것도 될 수 있다. kops는 이것들 모두와 잘 동작하며,
사용자는 보통 조직적인 부분을 고려해 결정한다(예를 들어, 사용자가 `dev.example.com`하위에 레코드를 생성하는것은 허용되지만,
`example.com`하위에는 그렇지 않을 수 있다).

`dev.example.com`을 hosted zone으로 사용하고 있다고 가정해보자.
보통 사용자는 [일반적인 방법](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html) 에 따라 생성하거나
`aws route53 create-hosted-zone --name dev.example.com --caller-reference 1` 와 같은 커맨드를 이용한다.

그 후 도메인 내 레코드들을 확인할 수 있도록 상위 도메인내에 NS 레코드를 생성해야 한다. 여기서는,
`dev` NS 레코드를 `example.com`에 생성한다. 만약 이것이 루트 도메인 네임이라면 이 NS 레코드들은
도메인 등록기관을 통해서 생성해야 한다(예를 들어, `example.com`는 `example.com`를 구매한 곳에서 설정 할 수 있다).

route53 도메인 설정을 확인한다(문제를 만드는 가장 큰 이유이다!). dig 툴을 실행해서
클러스터 설정이 정확한지 한번 더 확인한다.

`dig NS dev.example.com`

당신의 hosted zone용으로 할당된 3~4개의 NS 레코드를 Route53에서 확인할 수 있어야 한다.

### (3/5) 클러스터 상태 저장용 S3 버킷 생성

kops는 설치 이후에도 클러스터를 관리할 수 있다. 이를 위해 사용자가 생성한 클러스터의 상태나
사용하는 키 정보들을 지속적으로 추적해야 한다. 이 정보가 S3에 저장된다.
이 버킷의 접근은 S3 권한으로 제어한다.

다수의 클러스터는 동일한 S3 버킷을 이용할 수 있고, 사용자는 이 S3 버킷을 같은 클러스트를
운영하는 동료에게 공유할 수 있다. 하지만 이 S3 버킷에 접근 가능한 사람은 사용자의
모든 클러스터에 관리자 접근이 가능하게 되니, 운영팀 이외로
공유되지 않도록 해야 한다.

그래서 보통 한 운영팀 당 하나의 S3 버킷을 가지도록 하기도 한다.(그리고 종종 운영팀
이름은 위에서 언급한 hosted zone과 동일하게 짓기도 한다!)

우리 예제에서는, `dev.example.com`를 hosted zone으로 했으니 `clusters.dev.example.com`를
S3 버킷 이름으로 정하자.

* `AWS_PROFILE`를 선언한다. (AWS CLI 동작을 위해 다른 profile을 선택해야 할 경우)

* `aws s3 mb s3://clusters.dev.example.com`를 이용해 S3 버킷을 생성한다.

* `export KOPS_STATE_STORE=s3://clusters.dev.example.com` 하면, kops는 이 위치를 기본값으로 인식할 것이다.
   이 부분을 bash profile등에 넣어두는것을 권장한다.


### (4/5) 클러스터 설정 구성

클러스터 설정하려면, `kops create cluster` 를 실행한다:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops는 클러스터에 사용될 설정을 생성할것이다. 여기서 주의할 점은 실제 클러스트 리소스가 아닌 _설정_
만을 생성한다는 것에 주의하자 - 이 부분은 다음 단계에서 `kops update cluster` 으로
구성해볼 것이다. 그 때 만들어진 설정을 점검하거나 변경할 수 있다.

더 자세한 내용을 알아보기 위한 커맨드가 출력된다.

* 클러스터 조회: `kops get cluster`
* 클러스트 수정: `kops edit cluster useast1.dev.example.com`
* 인스턴스 그룹 수정: `kops edit ig --name=useast1.dev.example.com nodes`
* 마스터 인스턴스 그룹 수정: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

만약 kops사용이 처음이라면, 얼마 걸리지 않으니 이들을 시험해 본다. 인스턴스 그룹은
쿠버네티스 노드로 등록된 인스턴스의 집합을 말한다. AWS상에서는 auto-scaling-groups를
통해 만들어진다. 사용자는 여러 개의 인스턴스 그룹을 관리할 수 있는데,
예를 들어, spot과 on-demand 인스턴스 조합 또는 GPU 와 non-GPU 인스턴스의 조합으로 구성할 수 있다.


### (5/5) AWS에 클러스터 생성

`kops update cluster`를 실행해 AWS에 클러스터를 생성한다.

`kops update cluster useast1.dev.example.com --yes`

실행은 수 초 만에 되지만, 실제로 클러스터가 준비되기 전까지 수 분이 걸릴 수 있다.
언제든 `kops update cluster`로 클러스터 설정을 변경할 수 있다. 사용자가
변경한 클러스터 설정을 그대로 반영해 줄 것이며, 필요다하면 AWS 나 쿠버네티스를 재설정 해 줄것이다.

예를 들면, `kops edit ig nodes` 뒤에 `kops update cluster --yes`를 실행해 설정을 반영한다.
그리고 `kops rolling-update cluster`로 설정을 즉시 원복시킬 수 있다.

`--yes`를 명시하지 않으면 `kops update cluster` 커맨드 후 어떤 설정이 변경될지가 표시된다.
운영계 클러스터 관리할 때 사용하기 좋다!

### 다른 애드온 탐험

[애드온 리스트](/ko/docs/concepts/cluster-administration/addons/) 에서 쿠버네티스 클러스터용 로깅, 모니터링, 네트워크 정책, 시각화 &amp; 제어 등을 포함한 다른 애드온을 확인해본다.

## 정리하기

* `kops delete cluster useast1.dev.example.com --yes` 로 클러스터를 삭제한다.



## {{% heading "whatsnext" %}}


* 쿠버네티스 [개념](/ko/docs/concepts/) 과 [`kubectl`](/ko/docs/reference/kubectl/overview/)에 대해 더 알아보기.
* 튜토리얼, 모범사례 및 고급 구성 옵션에 대한 `kops` [고급 사용법](https://kops.sigs.k8s.io/)에 대해 더 자세히 알아본다.
* 슬랙(Slack)에서 `kops` 커뮤니티 토론을 할 수 있다: [커뮤니티 토론](https://github.com/kubernetes/kops#other-ways-to-communicate-with-the-contributors)
* 문제를 해결하거나 이슈를 제기하여 `kops` 에 기여한다. [깃헙 이슈](https://github.com/kubernetes/kops/issues)

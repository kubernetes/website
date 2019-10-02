---
title: Kops로 쿠버네티스 설치하기
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

이곳 빠른 시작에서는 사용자가 얼마나 쉽게 AWS에 쿠버네티스 클러스터를 설치할 수 있는지 보여준다.
[`kops`](https://github.com/kubernetes/kops)라는 이름의 툴을 이용할 것이다.

kops는 강력한 프로비저닝 시스템인데, 

* 완전 자동화된 설치
* DNS를 통해 클러스터들의 신원 확인
* 자체 복구: 모든 자원이 Auto-Scaling Groups에서 실행
* 다양한 OS 지원(Debian, Ubuntu 16.04 supported, CentOS & RHEL, Amazon Linux and CoreOS) - [images.md](https://github.com/kubernetes/kops/blob/master/docs/images.md) 보기
* 고가용성 지원 - [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md) 보기
* 직접 프로비저닝 하거나 또는 할 수 있도록 terraform 매니페스트를 생성 - [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md) 보기

만약 클러스터를 구축하는데 있어 이런 방법이 사용자의 생각과 다르다면 일종의 블록처럼 [kubeadm](/docs/admin/kubeadm/)를 이용할 수도 있다. 
kops는 kubeadmin 위에서도 잘 동작한다.

{{% /capture %}}

{{% capture body %}}

## 클러스터 구축

### (1/5) kops 설치

#### 요구사항

kops를 이용하기 위해서는 [kubectl](/docs/tasks/tools/install-kubectl/)이 설치되어 있어야 한다.

#### 설치

[releases page](https://github.com/kubernetes/kops/releases)에서 kops를 다운로드 한다(소스코드로부터 빌드하는것도 역시 어렵지 않다).

MacOS에서:

```shell
curl -OL https://github.com/kubernetes/kops/releases/download/1.10.0/kops-darwin-amd64
chmod +x kops-darwin-amd64
mv kops-darwin-amd64 /usr/local/bin/kops
# Homebrew를 통해 설치할 수도 있다.
brew update && brew install kops
```

Linux에서:

```shell
wget https://github.com/kubernetes/kops/releases/download/1.10.0/kops-linux-amd64
chmod +x kops-linux-amd64
mv kops-linux-amd64 /usr/local/bin/kops
```

### (2/5) 클러스터에 사용할 route53 domain 생성
kops는 디스커버리를 위해 클러스터 내외부에서 DNS를 이용하고 이를 통해 사용자는 쿠버네티스 API서버에 도달할 수 있다.

이런 클러스터 이름에 kops는 명확한 견해을 가지는데: 반드시 유효한 DNS 이름이어야 한다. 이렇게 함으로써 
사용자는 클러스터를 헷갈리지 않을것이고, 동료들과 혼선없이 공유할 수 있으며, IP를 기억할 필요없이 접근할 수 있다.

그렇게 하고 있겠지만, 클러스터를 구분하기 위해 서브도메인을 활용할 수 있다. 예를 들어 `useast1.dev.example.com`을 이용한다면, API 서버 엔드포인트는 `api.useast1.dev.example.com`가 될 것이다.

Route53 hosted zone은 서브도메인도 지원한다. 여러분의 hosted zone은 `useast1.dev.example.com`, `dev.example.com` 그리고 `example.com` 같은 것도 될 수 있다.
kops는 이것들 모두와 잘 동작하며, 사용자는 보통 조직적인 부분을 고려해 결정한다(예를 들어, 사용자가 `dev.example.com`하위에 레코드를 생성하는것은 허용되지만,
`example.com`하위에는 그렇지 않을 수 있다).

`dev.example.com`을 hosted zone으로 사용하고 있다고 가정해보자.
보통 사용자는 [일반적인 방법](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html) 에 따라 생성하거나 
`aws route53 create-hosted-zone --name dev.example.com --caller-reference 1` 와 같은 커맨드를 이용한다.
그 후 도메인 내 레코드들을 확인할 수 있도록 상위 도메인내에 NS 레코드를 생성해야 한다. 여기서는, `dev` NS 레코드를 `example.com`에 생성한다. 만약 이것이 루트 도메인 네임이라면 이 NS 레코드들은 도메인 등록기관을 통해서 생성해야 한다(예를 들어, `example.com`는 `example.com`를 구매한 곳에서 설정 할 수 있다).

이 단계에서 문제가 되기 쉽다.(문제를 만드는 가장 큰 이유이다!) dig 툴을 실행해서 클러스터 설정이 정확한지 한번 더 확인 한다.

`dig NS dev.example.com`

당신의 hosted zone용으로 할당된 3~4개의 NS 레코드를 Route53에서 확인할 수 있어야 한다.

### (3/5) 클러스터 상태 저장용 S3 버킷 생성
kops는 설치 이후에도 클러스터를 관리할 수 있다. 이를 위해 사용자가 생성한 클러스터의 상태나 사용하는 키 정보들을 지속적으로 추적해야 한다. 이 정보가 S3에 저장된다.
이 버킷의 접근은 S3 권한으로 제어한다.

다수의 클러스터는 동일한 S3 버킷을 이용할 수 있고, 사용자는 이 S3 버킷을 같은 클러스트를 운영하는 동료에게 공유할 수 있다. 하지만 이 S3 버킷에 접근 가능한 사람은 사용자의 모든 클러스터에 관리자 접근이 가능하게 되니, 운영팀 이외로 공유되지 않도록 해야 한다.

그래서 보통 한 운영팀 당 하나의 S3 버킷을 가지도록 하기도 한다.(그리고 종종 운영팀 이름은 위에서 언급한 hosted zone과 동일하게 짓기도 한다!)

우리 예제에서는, `dev.example.com`를 hosted zone으로 했으니 `clusters.dev.example.com`를 S3 버킷 이름으로 정하자.

* `AWS_PROFILE`를 선언한다. (AWS CLI 동작을 위해 다른 profile을 선택해야 할 경우)

* `aws s3 mb s3://clusters.dev.example.com`를 이용해 S3 버킷을 생성한다.

* `export KOPS_STATE_STORE=s3://clusters.dev.example.com` 하면, kops는 이 위치를 기본값으로 인식할 것이다. 
   이 부분을 bash profile등에 넣어두는것을 권장한다.

### (4/5) 클러스터 설정 구성
클러스터 설정하려면, `kops create cluster` 를 실행한다:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops는 클러스터에 사용될 설정을 생성할것이다. 여기서 주의할 점은 실제 클러스트 리소스가 아닌 _설정_ 만을 생성한다는 것에 주의하자 - 이 부분은 다음 단계에서 `kops update cluster` 으로 구성해볼 것이다. 그 때 만들어진 설정을 점검하거나 변경할 수 있다.

더 자세한 내용을 알아보기 위한 커맨드가 출력된다.

* 클러스터 조회: `kops get cluster`
* 클러스트 수정: `kops edit cluster useast1.dev.example.com`
* 인스턴스 그룹 수정: `kops edit ig --name=useast1.dev.example.com nodes`
* 마스터 인스턴스 그룹 수정: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

만약 kops사용이 처음이라면, 얼마 걸리지 않으니 이들을 시험해 본다. 인스턴스 그룹은 쿠버네티스 노드로 등록된 인스턴스의 집합을 말한다. AWS상에서는 auto-scaling-groups를 통해 만들어진다. 사용자는 여러개의 인스턴스 그룹을 관리할 수 있는데, 예를 들어, spot과 on-demand 인스턴스 조합 또는 GPU 와 non-GPU 인스턴스의 조합으로 구성할 수 있다.


### (5/5) AWS에 클러스터 생성

`kops update cluster`를 실행해 AWS에 클러스터를 생성한다.

`kops update cluster useast1.dev.example.com --yes`

실행은 수 초 만에 되지만, 실제로 클러스터가 준비되기 전까지 수 분이 걸릴 수 있다.
언제든 `kops update cluster`로 클러스트 설정을 변경할 수 있다. 사용자가 변경한 클러스트 설정을 그대로 반영해 줄 것이며, 필요다하면 AWS 나 쿠버네티스를 재설정 해 줄것이다.

예를 들면, `kops edit ig nodes` 뒤에 `kops update cluster --yes`를 실행해 설정을 반영한다. 그리고 `kops rolling-update cluster`로 설정을 즉시 원복시킬 수 있다.

`--yes`를 명시하지 않으면 `kops update cluster` 커맨드 후 어떤 설정이 변경될지가 표시된다. 운영계 클러스터 관리할 때 사용하기 좋다!


### 다른 애드온 탐험
[애드온 리스트](/docs/concepts/cluster-administration/addons/) 에서 쿠버네티스 클러스터용 로깅, 모니터링, 네트워크 정책, 시각화 &amp; 제어 등을 포함한 다른 애드온을 확인해본다.

## 정리하기

* `kops delete cluster useast1.dev.example.com --yes` 로 클러스터를 삭제한다.

## Feedback

* Slack Channel: [#kops-users](https://kubernetes.slack.com/messages/kops-users/)
* [GitHub Issues](https://github.com/kubernetes/kops/issues)

{{% /capture %}}

{{% capture whatsnext %}}

* 쿠버네티스 [개념](/docs/concepts/) 과 [`kubectl`](/docs/user-guide/kubectl-overview/)에 대해 더 알아보기.
* `kops` [고급 사용법](https://github.com/kubernetes/kops) 알아보기.
* 튜토리얼, 모범사례, 고급 설정 옵션을 위해 `kops` [문서](https://github.com/kubernetes/kops) 부분 보기.

{{% /capture %}}

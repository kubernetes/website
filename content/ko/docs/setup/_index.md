<<<<<<< HEAD
---
no_issue: true
title: 설치
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

Use this page to find the type of solution that best fits your needs.

Deciding where to run Kubernetes depends on what resources you have available 
and how much flexibility you need. You can run Kubernetes almost anywhere, 
from your laptop to VMs on a cloud provider to a rack of bare metal servers. 
You can also set up a fully-managed cluster by running a single command or craft 
your own customized cluster on your bare metal servers.

{{% /capture %}}

{{% capture body %}}

## Local-machine Solutions

A local-machine solution is an easy way to get started with Kubernetes. You
can create and test Kubernetes clusters without worrying about consuming cloud
resources and quotas.

You should pick a local solution if you want to:

* Try or start learning about Kubernetes
* Develop and test clusters locally

Pick a [local-machine solution](/docs/setup/pick-right-solution/#local-machine-solutions).

## Hosted Solutions

Hosted solutions are a convenient way to create and maintain Kubernetes clusters. They 
manage and operate your clusters so you don’t have to.  

You should pick a hosted solution if you:

* Want a fully-managed solution
* Want to focus on developing your apps or services  
* Don’t have dedicated site reliability engineering (SRE) team but want high availability
* Don't have resources to host and monitor your clusters 

Pick a [hosted solution](/docs/setup/pick-right-solution/#hosted-solutions).

## Turnkey – Cloud Solutions


These solutions allow you to create Kubernetes clusters with only a few commands and 
are actively developed and have active community support. They can also be hosted on 
a range of Cloud IaaS providers, but they offer more freedom and flexibility in 
exchange for effort. 

You should pick a turnkey cloud solution if you:

* Want more control over your clusters than the hosted solutions allow
* Want to take on more operations ownership 

Pick a [turnkey cloud solution](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)

## Turnkey – On-Premises Solutions

These solutions allow you to create Kubernetes clusters on your internal, secure,
cloud network with only a few commands.

You should pick a on-prem turnkey cloud solution if you:

* Want to deploy clusters on your private cloud network
* Have a dedicated SRE team
* Have the the resources to host and monitor your clusters

Pick an [on-prem turnkey cloud solution](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).

## Custom Solutions

Custom solutions give you the most freedom over your clusters but require the 
most expertise. These solutions range from bare-metal to cloud providers on 
different operating systems.

Pick a [custom solution](/docs/setup/pick-right-solution/#custom-solutions).

{{% /capture %}}

{{% capture whatsnext %}}
Go to [Picking the Right Solution](/docs/setup/pick-right-solution/) for a complete
list of solutions.
{{% /capture %}}
||||||| merged common ancestors
=======
---
no_issue: true
title: 설치
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

니즈에 가장 적합한 솔루션 유형을 찾기 위해서는 이 페이지를 사용하길 바란다.

쿠버네티스를 어디에서 동작시킬지 결정하는 것은 가용한 자원과 요구되는 유연성의 정도에 의존적이다. 쿠버네티스는 랩톱부터, 클라우드 프로바이더의 VM, 베어메탈(bare metal) 서버로 이루어진 랙까지 거의 모든 곳에서 동작시킬 수 있다. 또한 단 하나의 명령어 실행으로 완전-관리되는(fully-managed) 클러스터를 설치할 수도 있고, 베어메탈 서버에 자신만의 맞춤형 클러스터를 만들 수도 있다.

{{% /capture %}}

{{% capture body %}}

## 로컬 머신(Local-machine) 솔루션

로컬 머신 솔루션은 쿠버네티스를 시작하기에 쉬운 방법이다. 클라우드 자원(resource)과 한도(quota)에 대한 걱정 없이 쿠버네티스 클러스터를 생성하고 테스트할 수 있다.

다음과 같은 사항을 원한다면 로컬 솔루션을 선택해야 한다. 

* 쿠버네티스를 써 보거나 배우기 시작하려고 함
* 내부적으로 클러스터를 개발하거나 테스트하려고 함

[로컬 머신 솔루션](/docs/setup/pick-right-solution/#local-machine-solutions) 중 하나를 선택하길 바란다.

## 호스트 된(Hosted) 솔루션

호스트 된 솔루션은 쿠버네티스 클러스터를 생성하고 유지 관리하는데 편리한 방법이다. 호스트가 사용자의 클러스터를 관리하고 운영하기 때문에 사용자는 관리와 운영에서 자유롭다.

다음의 경우 호스트 된 솔루션이 필요하다.

* 완전히 관리된 솔루션을 원함
* 사용자의 앱 또는 서비스를 개발에만 집중하고 싶음 
* 지정된 사이트 신뢰성 엔지니어링(SRE) 팀은 없지만 고가용성을 원함
* 클러스터를 호스팅하고 모니터할 자원이 없음 

[호스트 된 솔루션](/docs/setup/pick-right-solution/#hosted-solutions) 중 하나를 선택하길 바란다.

## 턴키(Turnkey) – 클라우드 솔루션

이와 같은 솔루션들은 쿠버네티스 클러스터를 단지 몇 가지 명령어로 생성하게 해준다. 솔루션들은 활발히 개발되며 활동적인 커뮤니티의 지원을 받는다. 또한 넓은 범위의 IaaS 클라우드 프로바이더들에 호스트 될 수 있음에도, 노력의 대가로 솔루션들은 더욱 더 큰 자유와 유연성을 제공한다.

다음의 경우 턴키 클라우드 솔루션을 선택해야 한다.

* 호스트 된 솔루션이 허용하는 것보다는 클러스터에 대한 더 높은 제어권을 원함
* 운영에 대한 더 큰 소유권을 가지고 싶음 

[턴키 클라우드 솔루션](/docs/setup/pick-right-solution/#turnkey-cloud-solutions) 중 하나를 선택하길 바란다.

## 턴키(Turnkey) – 온-프레미스(On-Premise) 솔루션

이와 같은 솔루션들은 내부의, 안전한, 클라우드 네트워크에 쿠버네티스 클러스터를 단 몇 가지 명령어로 생성하게 해준다.

다음의 경우 온-프레미스 턴키 솔루션을 선택해야 한다.

* 프라이빗 클라우드 네트워크에 클러스터를 디플로이하길 원함 
* 지정된 사이트 신뢰성 엔지니어링(SRE) 팀을 보유함
* 클러스터를 호스팅하고 모니터할 수 있는 자원을 보유함

[온-프레미스 턴키 클라우드 솔루션](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions) 중 하나를 선택하길 바란다.

## 사용자 지정(Custom) 솔루션

사용자 지정 솔루션들은 클러스터에 대해서 가장 큰 자유를 제공하지만, 그 대신 높은 전문성을 필요로 한다. 이 솔루션들은 서로 다른 운영체제들에 대해서 베어메탈부터 클라우드 프로바이더들까지의 지원을 포함한다. 

[사용자 지정 솔루션](/docs/setup/pick-right-solution/#custom-solutions) 중 하나를 선택하길 바란다.

{{% /capture %}}

{{% capture whatsnext %}}
완전한 솔루션 리스트를 확인하기 위해서는 [올바른 솔루션 선택하기](/docs/setup/pick-right-solution/)로 가길 바란다.
{{% /capture %}}
>>>>>>> master

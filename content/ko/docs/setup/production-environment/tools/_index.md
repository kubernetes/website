---
title: 배포 도구로 쿠버네티스 설치하기
weight: 30
no_list: true
---

자체 프로덕션 쿠버네티스 클러스터를 설정하는 데는 다양한 방법과 도구가 있다.
예를 들면 다음과 같다.

- [kubeadm](/ko/docs/setup/production-environment/tools/kubeadm/)

- [클러스터 API](https://cluster-api.sigs.k8s.io/): 여러 쿠버네티스 클러스터의 프로비저닝, 
  업그레이드 및 운영을 단순화하는 선언적 API와 도구를 제공하는 데 중점을 둔 
  쿠버네티스 하위 프로젝트이다.

- [kops](https://kops.sigs.k8s.io/): 자동화된 클러스터 프로비저닝 도구이다. 
  튜토리얼, 모범 사례, 구성 옵션 및 커뮤니티 
  참여에 대한 정보는 
  [`kOps` 웹사이트](https://kops.sigs.k8s.io/)에서 자세히 확인할 수 있다.

- [kubespray](https://kubespray.io/): 
  일반적인 OS/쿠버네티스 클러스터 구성 관리 작업을 위한 [Ansible](https://docs.ansible.com/) 
  플레이북, [인벤토리](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md), 
  프로비저닝 도구 및 도메인 지식의 
  조합이다. [#kubespray](https://kubernetes.slack.com/messages/kubespray/) 
  슬랙 채널에서 커뮤니티에 참여할 수 있다.
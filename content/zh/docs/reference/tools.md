<!--
---
reviewers:
- janetkuo
title: Tools
content_template: templates/concept
---
-->
---
reviewers:
- janetkuo
title: ����
content_template: templates/concept
---

<!--
Kubernetes contains several built-in tools to help you work with the Kubernetes system.
-->
{{% capture overview %}}
Kubernetes ����һЩ���ù��ߣ����԰����û����õ�ʹ�� Kubernetes ϵͳ��
{{% /capture %}}

{{% capture body %}}
## Kubectl

<!--
[`kubectl`](/docs/tasks/tools/install-kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.
-->
[`kubectl`](/docs/tasks/tools/install-kubectl/) �� Kubernetes �����й��ߣ����������ٿ� Kubernetes ��Ⱥ��

## Kubeadm 

<!--
[`kubeadm`](/docs/tasks/tools/install-kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).
-->
[`kubeadm`](/docs/tasks/tools/install-kubeadm/) ��һ�������й��ߣ�������������������Ʒ��������������Ŀǰ���� alpha �׶Σ������ɲ���һ����ȫ�ɿ��� Kubernetes ��Ⱥ��

## Kubefed

<!--
[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is the command line tool
to help you administrate your federated clusters.
-->
[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) ��һ�������й��ߣ��������������û��������Ⱥ��


## Minikube

<!--
[`minikube`](/docs/tasks/tools/install-minikube/) is a tool that makes it
easy to run a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->
[`minikube`](/docs/tasks/tools/install-minikube/) ��һ�����Է����û����乤��վ�㱾�ز���һ�����ڵ� Kubernetes ��Ⱥ�Ĺ��ߣ����ڿ����Ͳ��ԡ�


## Dashboard 

<!--
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. 
-->
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), �� Kubernetes ���� Web ���û�������棬�����û�����������Ӧ�õ� Kubernetes ��Ⱥ�����й����Ų��Լ�����Ⱥ�ͼ�Ⱥ��Դ�� 

## Helm

<!--
[`Kubernetes Helm`](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.
-->
[`Kubernetes Helm`](https://github.com/kubernetes/helm) ��һ������Ԥ������ Kubernetes ��Դ���Ĺ��ߣ��������Դ�� Helm ��Ҳ������ Kubernetes charts��

<!--
Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->
ʹ�� Helm��

*���Ҳ�ʹ���Ѿ����Ϊ Kubernetes charts ���������
*�������Լ���Ӧ����Ϊ Kubernetes charts
*Ϊ Kubernetes Ӧ�ô������ظ�ִ�еĹ���
*Ϊ���� Kubernetes �嵥�ļ��ṩ�����ܻ��Ĺ���
*���� Helm ������ķ���

## Kompose

<!--
[`Kompose`](https://github.com/kubernetes-incubator/kompose) is a tool to help Docker Compose users move to Kubernetes.
-->
[`Kompose`](https://github.com/kubernetes-incubator/kompose) һ��ת�����ߣ��������� Docker Compose �û�Ǩ���� Kubernetes��

<!--
Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
-->
ʹ�� Kompose:

* ��һ�� Docker Compose �ļ����ͳ� Kubernetes ����
* ������ Docker ���� ת���ͨ�� Kubernetes ������
* ת�� v1 �� v2 Docker Compose `yaml` �ļ� �� [�ֲ�ʽӦ�ó����](https://docs.docker.com/compose/bundles/)
{{% /capture %}}
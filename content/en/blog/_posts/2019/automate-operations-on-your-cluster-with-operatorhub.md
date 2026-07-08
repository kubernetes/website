---
title: Automate Operations on your Cluster with OperatorHub.io
date: 2019-02-28
author: >
  Diane Mueller (Red Hat)
---

One of the important challenges facing developers and Kubernetes administrators has been a lack of ability to quickly find common services that are operationally ready for Kubernetes. Typically, the presence of an Operator for a specific service - a pattern that was introduced in 2016 and has gained momentum - is a good signal for the operational readiness of the service on Kubernetes. However, there has to date not existed a registry of Operators to simplify the discovery of such services.   

To help address this challenge, today Red Hat is launching OperatorHub.io in collaboration with AWS, Google Cloud and Microsoft. OperatorHub.io enables developers and Kubernetes administrators to find and install curated Operator-backed services with a base level of documentation, active maintainership by communities or vendors, basic testing, and packaging for optimized life-cycle management on Kubernetes.  

The Operators currently in OperatorHub.io are just the start. We invite the Kubernetes community to join us in building a vibrant community for Operators by developing, packaging, and publishing Operators on OperatorHub.io. 

## What does OperatorHub.io provide?

OperatorHub.io is designed to address the needs of both Kubernetes developers and users. For the former it provides a common registry where they can publish their Operators alongside with descriptions, relevant details like version, image, code repository and have them be readily packaged for installation. They can also update already published Operators to new versions when they are released.


Users get the ability to discover and download Operators at a central location, that has content which has been screened for the previously mentioned criteria and scanned for known vulnerabilities. In addition, developers can guide users of their Operators with prescriptive examples of the `CustomResources` that they introduce to interact with the application.

## What is an Operator?

Operators were first introduced in 2016 by CoreOS and have been used by Red Hat and the Kubernetes community as a way to package, deploy and manage a Kubernetes-native application. A Kubernetes-native application is an application that is both deployed on Kubernetes and managed using the Kubernetes APIs and well-known tooling, like kubectl.

An Operator is implemented as a custom controller that watches for certain Kubernetes resources to appear, be modified or deleted. These are typically `CustomResourceDefinitions` that the Operator “owns.” In the spec properties of these objects the user declares the desired state of the application or the operation. The Operator’s reconciliation loop will pick these up and perform the required actions to achieve the desired state. For example, the intent to create a highly available etcd cluster could be expressed by creating an new resource of type `EtcdCluster`:

```
apiVersion: "etcd.database.coreos.com/v1beta2"
kind: "EtcdCluster"
metadata:
  name: "my-etcd-cluster"
spec:
  size: 3
  version: "3.3.12"
```

The `EtcdOperator` would be responsible for creating a 3-node etcd cluster running version v3.3.12 as a result. Similarly, an object of type `EtcdBackup` could be defined to express the intent to create a consistent backup of the etcd database to an S3 bucket.

## How do I create and run an Operator?

One way to get started is with the [Operator Framework](https://github.com/operator-framework), an open source toolkit that provides an SDK, lifecycle management, metering and monitoring capabilities. It enables developers to build, test, and package Operators. Operators can be implemented in several programming and automation languages, including Go, Helm, and Ansible, all three of which are supported directly by the SDK.

If you are interested in creating your own Operator, we recommend checking out the Operator Framework to [get started](https://github.com/operator-framework/getting-started).

Operators vary in where they fall along [the capability spectrum](https://github.com/operator-framework/operator-sdk/blob/master/doc/images/operator-capability-level.png) ranging from basic functionality to having specific operational logic for an application to automate advanced scenarios like backup, restore or tuning. Beyond basic installation, advanced Operators are designed to handle upgrades more seamlessly and react to failures automatically. Currently, Operators on OperatorHub.io span the maturity spectrum, but we anticipate their continuing maturation over time.

While Operators on OperatorHub.io don’t need to be implemented using the SDK, they are packaged for deployment through the [Operator Lifecycle Manager](https://github.com/operator-framework/operator-lifecycle-manager) (OLM). The format mainly consists of a YAML manifest referred to as `[ClusterServiceVersion]`(https://github.com/operator-framework/operator-lifecycle-manager/blob/master/doc/design/building-your-csv.md) which provides information about the `CustomResourceDefinitions` the Operator owns or requires, which RBAC definition it needs, where the image is stored, etc. This file is usually accompanied by additional YAML files which define the Operators’ own CRDs. This information is processed by OLM at the time a user requests to install an Operator to provide dependency resolution and automation.

## What does listing of an Operator on OperatorHub.io mean?

To be listed, Operators must successfully show cluster lifecycle features, be packaged as a CSV to be maintained through OLM, and have acceptable documentation for its intended users.  

Some examples of Operators that are currently listed on OperatorHub.io include: Amazon Web Services Operator, Couchbase Autonomous Operator, CrunchyData’s PostgreSQL, etcd Operator, Jaeger Operator for Kubernetes, Kubernetes Federation Operator, MongoDB Enterprise Operator, Percona MySQL Operator, PlanetScale’s Vitess Operator, Prometheus Operator, and Redis Operator.

## Want to add your Operator to OperatorHub.io? Follow these steps

If you have an existing Operator, follow the [contribution guide](https://www.operatorhub.io/contribute) using a fork of the [community-operators](https://github.com/operator-framework/community-operators/) repository. Each contribution contains the CSV, all of the `CustomResourceDefinitions`, access control rules and references to the container image needed to install and run your Operator, plus other info like a description of its features and supported Kubernetes versions. A complete example, including multiple versions of the Operator, can be found with the [EtcdOperator](https://github.com/operator-framework/community-operators/tree/master/community-operators/etcd).

After testing out your Operator on your own cluster, submit a PR to the [community repository](https://github.com/operator-framework/community-operators) with all of YAML files following [this directory structure](https://github.com/operator-framework/community-operators#adding-your-operator). Subsequent versions of the Operator can be published in the same way. At first this will be reviewed manually, but automation is on the way. After it’s merged by the maintainers, it will show up on OperatorHub.io along with its documentation and a convenient installation method.

## Want to learn more?

- Attend one of the upcoming Kubernetes Operator Framework hands-on workshops at [ScaleX](https://www.socallinuxexpo.org/scale/17x/presentations/workshop-kubernetes-operator-framework) in Pasadena on March 7 and at the [OpenShift Commons Gathering on Operating at Scale in Santa Clara on March 11](https://commons.openshift.org/gatherings/Santa_Clara_2019.html)
- Listen to this [OpenShift Commons Briefing on “The State of Operators” with Daniel Messer and Diane Mueller](https://www.youtube.com/watch?v=GgEKEYH9MMM&feature=youtu.be)
- Join in on the online conversations in the community [Kubernetes-Operator Slack Channel](https://kubernetes.slack.com/messages/CAW0GV7A5) and the [Operator Framework Google Group](https://groups.google.com/forum/#!forum/operator-framework)
- Finally, read up on how to add your Operator to OperatorHub.io: https://operatorhub.io/contribute

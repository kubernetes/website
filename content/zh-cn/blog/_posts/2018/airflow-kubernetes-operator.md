---
layout: blog
date:   2018-06-28
title: 'Airflow 在 Kubernetes 中的使用（第一部分）：一种不同的操作器'
slug: airflow-on-kubernetes-part-1-a-different-kind-of-operator
---
<!-- 
layout: blog
title:  'Airflow on Kubernetes (Part 1): A Different Kind of Operator'
date:   2018-06-28
-->

<!--
Author: Daniel Imberman (Bloomberg LP)
-->
作者: Daniel Imberman (Bloomberg LP)

<!--
## Introduction

As part of Bloomberg's [continued commitment to developing the Kubernetes ecosystem](https://www.techatbloomberg.com/blog/bloomberg-awarded-first-cncf-end-user-award-contributions-kubernetes/), we are excited to announce the Kubernetes Airflow Operator; a mechanism for [Apache Airflow](https://airflow.apache.org/), a popular workflow orchestration framework to natively launch arbitrary Kubernetes Pods using the Kubernetes API.
-->
## 介绍

作为 Bloomberg [持续致力于开发 Kubernetes 生态系统](https://www.techatbloomberg.com/blog/bloomberg-awarded-first-cncf-end-user-award-contributions-kubernetes/)的一部分，
我们很高兴能够宣布 Kubernetes Airflow Operator 的发布;
[Apache Airflow](https://airflow.apache.org/)的一种机制，一种流行的工作流程编排框架，
使用 Kubernetes API 可以在本机启动任意的 Kubernetes Pod。

<!--
## What Is Airflow?

Apache Airflow is one realization of the DevOps philosophy of "Configuration As Code." Airflow allows users to launch multi-step pipelines using a simple Python object DAG (Directed Acyclic Graph). You can define dependencies, programmatically construct complex workflows, and monitor scheduled jobs in an easy to read UI.
-->
## 什么是 Airflow?

Apache Airflow 是“配置即代码”的 DevOps 理念的一种实现。
Airflow 允许用户使用简单的 Python 对象 DAG（有向无环图）启动多步骤流水线。
你可以在易于阅读的 UI 中定义依赖关系，以编程方式构建复杂的工作流，并监视调度的作业。

<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow_dags.png" width="85%" alt="Airflow DAGs" />
<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow.png" width="85%" alt="Airflow UI" />

<!--
## Why Airflow on Kubernetes?

Since its inception, Airflow's greatest strength has been its flexibility. Airflow offers a wide range of integrations for services ranging from Spark and HBase, to services on various cloud providers. Airflow also offers easy extensibility through its plug-in framework. However, one limitation of the project is that Airflow users are confined to the frameworks and clients that exist on the Airflow worker at the moment of execution. A single organization can have varied Airflow workflows ranging from data science pipelines to application deployments. This difference in use-case creates issues in dependency management as both teams might use vastly different libraries for their workflows.

To address this issue, we've utilized Kubernetes to allow users to launch arbitrary Kubernetes pods and configurations. Airflow users can now have full power over their run-time environments, resources, and secrets, basically turning Airflow into an "any job you want" workflow orchestrator.
-->
## 为什么在 Kubernetes 上使用 Airflow？

自成立以来，Airflow 的最大优势在于其灵活性。
Airflow 提供广泛的服务集成，包括Spark和HBase，以及各种云提供商的服务。
Airflow 还通过其插件框架提供轻松的可扩展性。
但是，该项目的一个限制是 Airflow 用户仅限于执行时 Airflow 站点上存在的框架和客户端。
单个组织可以拥有各种 Airflow 工作流程，范围从数据科学流到应用程序部署。
用例中的这种差异会在依赖关系管理中产生问题，因为两个团队可能会在其工作流程使用截然不同的库。

为了解决这个问题，我们使 Kubernetes 允许用户启动任意 Kubernetes Pod 和配置。
Airflow 用户现在可以在其运行时环境，资源和机密上拥有全部权限，基本上将 Airflow 转变为“你想要的任何工作”工作流程协调器。

<!--
## The Kubernetes Operator

Before we move any further, we should clarify that an Operator in Airflow is a task definition. When a user creates a DAG, they would use an operator like the "SparkSubmitOperator" or the "PythonOperator" to submit/monitor a Spark job or a Python function respectively. Airflow comes with built-in operators for frameworks like Apache Spark, BigQuery, Hive, and EMR. It also offers a Plugins entrypoint that allows DevOps engineers to develop their own connectors.

Airflow users are always looking for ways to make deployments and ETL pipelines simpler to manage. Any opportunity to decouple pipeline steps, while increasing monitoring, can reduce future outages and fire-fights. The following is a list of benefits provided by the Airflow Kubernetes Operator:
-->
## Kubernetes Operator

在进一步讨论之前，我们应该澄清 Airflow 中的 [Operator](https://airflow.apache.org/concepts.html#operators) 是一个任务定义。
当用户创建 DAG 时，他们将使用像 “SparkSubmitOperator” 或 “PythonOperator” 这样的 Operator 分别提交/监视 Spark 作业或 Python 函数。
Airflow 附带了 Apache Spark，BigQuery，Hive 和 EMR 等框架的内置运算符。
它还提供了一个插件入口点，允许DevOps工程师开发自己的连接器。

Airflow 用户一直在寻找更易于管理部署和 ETL 流的方法。
在增加监控的同时，任何解耦流程的机会都可以减少未来的停机等问题。
以下是 Airflow Kubernetes Operator 提供的好处：

<!--
 * **Increased flexibility for deployments:**  
Airflow's plugin API has always offered a significant boon to engineers wishing to test new functionalities within their DAGs. On the downside, whenever a developer wanted to create a new operator, they had to develop an entirely new plugin. Now, any task that can be run within a Docker container is accessible through the exact same operator, with no extra Airflow code to maintain.
-->
 * **提高部署灵活性：**
Airflow 的插件 API一直为希望在其 DAG 中测试新功能的工程师提供了重要的福利。
不利的一面是，每当开发人员想要创建一个新的 Operator 时，他们就必须开发一个全新的插件。
现在，任何可以在 Docker 容器中运行的任务都可以通过完全相同的运算符访问，而无需维护额外的 Airflow 代码。

<!--
 * **Flexibility of configurations and dependencies:**
For operators that are run within static Airflow workers, dependency management can become quite difficult. If a developer wants to run one task that requires [SciPy](https://www.scipy.org) and another that requires [NumPy](http://www.numpy.org), the developer would have to either maintain both dependencies within all Airflow workers or offload the task to an external machine (which can cause bugs if that external machine changes in an untracked manner). Custom Docker images allow users to ensure that the tasks environment, configuration, and dependencies are completely idempotent.  
-->
 * **配置和依赖的灵活性：**

对于在静态 Airflow 工作程序中运行的 Operator，依赖关系管理可能变得非常困难。
如果开发人员想要运行一个需要 [SciPy](https://www.scipy.org) 的任务和另一个需要 [NumPy](http://www.numpy.org) 的任务，
开发人员必须维护所有 Airflow 节点中的依赖关系或将任务卸载到其他计算机（如果外部计算机以未跟踪的方式更改，则可能导致错误）。
自定义 Docker 镜像允许用户确保任务环境，配置和依赖关系完全是幂等的。

<!--
 * **Usage of kubernetes secrets for added security:**
Handling sensitive data is a core responsibility of any DevOps engineer. At every opportunity, Airflow users want to isolate any API keys, database passwords, and login credentials on a strict need-to-know basis. With the Kubernetes operator, users can utilize the Kubernetes Vault technology to store all sensitive data. This means that the Airflow workers will never have access to this information, and can simply request that pods be built with only the secrets they need.
-->
 * **使用kubernetes Secret以增加安全性：**
处理敏感数据是任何开发工程师的核心职责。Airflow 用户总有机会在严格条款的基础上隔离任何API密钥，数据库密码和登录凭据。
使用 Kubernetes 运算符，用户可以利用 Kubernetes Vault 技术存储所有敏感数据。
这意味着 Airflow 工作人员将永远无法访问此信息，并且可以容易地请求仅使用他们需要的密码信息构建 Pod。

<!--
# Architecture

The Kubernetes Operator uses the [Kubernetes Python Client](https://github.com/kubernetes-client/Python) to generate a request that is processed by the APIServer (1). Kubernetes will then launch your pod with whatever specs you've defined (2). Images will be loaded with all the necessary environment variables, secrets and dependencies, enacting a single command. Once the job is launched, the operator only needs to monitor the health of track logs (3). Users will have the choice of gathering logs locally to the scheduler or to any distributed logging service currently in their Kubernetes cluster.
-->
# 架构

<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow-architecture.png" width="85%" alt="Airflow Architecture" />

Kubernetes Operator 使用 [Kubernetes Python客户端](https://github.com/kubernetes-client/Python)生成由 APIServer 处理的请求（1）。
然后，Kubernetes将使用你定义的需求启动你的 Pod（2）。
镜像文件中将加载环境变量，Secret 和依赖项，执行单个命令。
一旦启动作业，Operator 只需要监视跟踪日志的状况（3）。
用户可以选择将日志本地收集到调度程序或当前位于其 Kubernetes 集群中的任何分布式日志记录服务。

<!--
# Using the Kubernetes Operator

## A Basic Example

The following DAG is probably the simplest example we could write to show how the Kubernetes Operator works. This DAG creates two pods on Kubernetes: a Linux distro with Python and a base Ubuntu distro without it. The Python pod will run the Python request correctly, while the one without Python will report a failure to the user. If the Operator is working correctly, the `passing-task` pod should complete, while the `failing-task` pod returns a failure to the Airflow webserver.
-->
# 使用 Kubernetes Operator
## 一个基本的例子

以下 DAG 可能是我们可以编写的最简单的示例，以显示 Kubernetes Operator 的工作原理。
这个 DAG 在 Kubernetes 上创建了两个 Pod：一个带有 Python 的 Linux 发行版和一个没有它的基本 Ubuntu 发行版。
Python Pod 将正确运行 Python 请求，而没有 Python 的那个将向用户报告失败。
如果 Operator 正常工作，则应该完成 “passing-task” Pod，而“ falling-task” Pod 则向 Airflow 网络服务器返回失败。

```Python
from airflow import DAG
from datetime import datetime, timedelta
from airflow.contrib.operators.kubernetes_pod_operator import KubernetesPodOperator
from airflow.operators.dummy_operator import DummyOperator


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime.utcnow(),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'kubernetes_sample', default_args=default_args, schedule_interval=timedelta(minutes=10))


start = DummyOperator(task_id='run_this_first', dag=dag)

passing = KubernetesPodOperator(namespace='default',
                          image="Python:3.6",
                          cmds=["Python","-c"],
                          arguments=["print('hello world')"],
                          labels={"foo": "bar"},
                          name="passing-test",
                          task_id="passing-task",
                          get_logs=True,
                          dag=dag
                          )

failing = KubernetesPodOperator(namespace='default',
                          image="ubuntu:1604",
                          cmds=["Python","-c"],
                          arguments=["print('hello world')"],
                          labels={"foo": "bar"},
                          name="fail",
                          task_id="failing-task",
                          get_logs=True,
                          dag=dag
                          )

passing.set_upstream(start)
failing.set_upstream(start)
```
<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-basic-dag-run.png" width="85%" alt="Basic DAG Run" />

<!--
## But how does this relate to my workflow?

While this example only uses basic images, the magic of Docker is that this same DAG will work for any image/command pairing you want. The following is a recommended CI/CD pipeline to run production-ready code on an Airflow DAG.

### 1: PR in github

Use Travis or Jenkins to run unit and integration tests, bribe your favorite team-mate into PR'ing your code, and merge to the master branch to trigger an automated CI build.

### 2: CI/CD via Jenkins -> Docker Image

[Generate your Docker images and bump release version within your Jenkins build](https://getintodevops.com/blog/building-your-first-docker-image-with-jenkins-2-guide-for-developers).

### 3: Airflow launches task

Finally, update your DAGs to reflect the new release version and you should be ready to go!
-->
## 但这与我的工作流程有什么关系？

虽然这个例子只使用基本映像，但 Docker 的神奇之处在于，这个相同的 DAG 可以用于你想要的任何图像/命令配对。
以下是推荐的 CI/CD 管道，用于在 Airflow DAG 上运行生产就绪代码。

### 1：github 中的 PR

使用Travis或Jenkins运行单元和集成测试，请你的朋友PR你的代码，并合并到主分支以触发自动CI构建。

### 2：CI/CD 构建 Jenkins - > Docker 镜像

[在 Jenkins 构建中生成 Docker 镜像和更新版本](https://getintodevops.com/blog/building-your-first-Docker-image-with-jenkins-2-guide-for-developers)。

### 3：Airflow 启动任务

最后，更新你的 DAG 以反映新版本，你应该准备好了！

```Python
production_task = KubernetesPodOperator(namespace='default',
                          # image="my-production-job:release-1.0.1", <-- old release
                          image="my-production-job:release-1.0.2",
                          cmds=["Python","-c"],
                          arguments=["print('hello world')"],
                          name="fail",
                          task_id="failing-task",
                          get_logs=True,
                          dag=dag
                          )
```

<!--
# Launching a test deployment

Since the Kubernetes Operator is not yet released, we haven't released an official [helm](https://helm.sh/) chart or operator (however both are currently in progress). However, we are including instructions for a basic deployment below and are actively looking for foolhardy beta testers to try this new feature. To try this system out please follow these steps:

## Step 1: Set your kubeconfig to point to a kubernetes cluster

## Step 2: Clone the Airflow Repo:

Run `git clone https://github.com/apache/incubator-airflow.git` to clone the official Airflow repo.

## Step 3: Run

To run this basic deployment, we are co-opting the integration testing script that we currently use for the Kubernetes Executor (which will be explained in the next article of this series). To launch this deployment, run these three commands:
-->
# 启动测试部署

由于 Kubernetes Operator 尚未发布，我们尚未发布官方
[helm](https://helm.sh/) 图表或 Operator（但两者目前都在进行中）。
但是，我们在下面列出了基本部署的说明，并且正在积极寻找测试人员来尝试这一新功能。
要试用此系统，请按以下步骤操作：

## 步骤1：将 kubeconfig 设置为指向 kubernetes 集群

## 步骤2：克隆 Airflow 仓库：

运行 `git clone https://github.com/apache/incubator-airflow.git` 来克隆官方 Airflow 仓库。

## 步骤3：运行

为了运行这个基本 Deployment，我们正在选择我们目前用于 Kubernetes Executor 的集成测试脚本（将在本系列的下一篇文章中对此进行解释）。
要启动此部署，请运行以下三个命令：

```
sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml
./scripts/ci/kubernetes/Docker/build.sh
./scripts/ci/kubernetes/kube/deploy.sh
```

<!--
Before we move on, let's discuss what these commands are doing:

### sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml

The Kubernetes Executor is another Airflow feature that allows for dynamic allocation of tasks as idempotent pods. The reason we are switching this to the LocalExecutor is simply to introduce one feature at a time. You are more then welcome to skip this step if you would like to try the Kubernetes Executor, however we will go into more detail in a future article.

### ./scripts/ci/kubernetes/Docker/build.sh

This script will tar the Airflow master source code build a Docker container based on the Airflow distribution

### ./scripts/ci/kubernetes/kube/deploy.sh

Finally, we create a full Airflow deployment on your cluster. This includes Airflow configs, a postgres backend, the webserver + scheduler, and all necessary services between. One thing to note is that the role binding supplied is a cluster-admin, so if you do not have that level of permission on the cluster, you can modify this at scripts/ci/kubernetes/kube/airflow.yaml

## Step 4: Log into your webserver

Now that your Airflow instance is running let's take a look at the UI! The UI lives in port 8080 of the Airflow pod, so simply run
-->
在我们继续之前，让我们讨论这些命令正在做什么：

### sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml

Kubernetes Executor 是另一种 Airflow 功能，允许动态分配任务已解决幂等 Pod 的问题。
我们将其切换到 LocalExecutor 的原因只是一次引入一个功能。
如果你想尝试 Kubernetes Executor，欢迎你跳过此步骤，但我们将在以后的文章中详细介绍。

### ./scripts/ci/kubernetes/Docker/build.sh

此脚本将对Airflow主分支代码进行打包，以根据Airflow的发行文件构建Docker容器

### ./scripts/ci/kubernetes/kube/deploy.sh

最后，我们在你的集群上创建完整的Airflow部署。这包括 Airflow 配置，postgres 后端，web 服务器和调度程序以及之间的所有必要服务。
需要注意的一点是，提供的角色绑定是集群管理员，因此如果你没有该集群的权限级别，可以在 scripts/ci/kubernetes/kube/airflow.yaml 中进行修改。

## 步骤4：登录你的网络服务器

现在你的 Airflow 实例正在运行，让我们来看看 UI！
用户界面位于 Airflow Pod的 8080 端口，因此只需运行即可：

```
WEB=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' | grep "airflow" | head -1)
kubectl port-forward $WEB 8080:8080
```

<!--
 Now the Airflow UI will exist on http://localhost:8080. To log in simply enter `airflow`/`airflow` and you should have full access to the Airflow web UI.

## Step 5: Upload a test document

To modify/add your own DAGs, you can use `kubectl cp` to upload local files into the DAG folder of the Airflow scheduler. Airflow will then read the new DAG and automatically upload it to its system. The following command will upload any local file into the correct directory:
-->
现在，Airflow UI 将存在于 http://localhost:8080上。
要登录，只需输入`airflow`/`airflow`，你就可以完全访问 Airflow Web UI。

## 步骤5：上传测试文档

要修改/添加自己的 DAG，可以使用 `kubectl cp` 将本地文件上传到 Airflow 调度程序的 DAG 文件夹中。
然后，Airflow 将读取新的 DAG 并自动将其上传到其系统。以下命令将任何本地文件上载到正确的目录中：

`kubectl cp <local file> <namespace>/<pod>:/root/airflow/dags -c scheduler`

<!--
## Step 6: Enjoy!

# So when will I be able to use this?

 While this feature is still in the early stages, we hope to see it released for wide release in the next few months.

# Get Involved

This feature is just the beginning of multiple major efforts to improves Apache Airflow integration into Kubernetes. The Kubernetes Operator has been merged into the [1.10 release branch of Airflow](https://github.com/apache/incubator-airflow/tree/v1-10-test) (the executor in experimental mode), along with a fully k8s native scheduler called the Kubernetes Executor (article to come). These features are still in a stage where early adopters/contributers can have a huge influence on the future of these features.

For those interested in joining these efforts, I'd recommend checkint out these steps:

 * Join the airflow-dev mailing list at dev@airflow.apache.org.
 * File an issue in [Apache Airflow JIRA](https://issues.apache.org/jira/projects/AIRFLOW/issues/)
 * Join our SIG-BigData meetings on Wednesdays at 10am PST.
 * Reach us on slack at #sig-big-data on kubernetes.slack.com

Special thanks to the Apache Airflow and Kubernetes communities, particularly Grant Nicholas, Ben Goldberg, Anirudh Ramanathan, Fokko Dreisprong, and Bolke de Bruin, for your awesome help on these features as well as our future efforts.
-->
## 步骤6：使用它！
# 那么我什么时候可以使用它？

虽然此功能仍处于早期阶段，但我们希望在未来几个月内发布该功能以进行广泛发布。

# 参与其中

此功能只是将 Apache Airflow 集成到 Kubernetes 中的多项主要工作的开始。
Kubernetes Operator 已合并到 [Airflow 的 1.10 发布分支](https://github.com/apache/incubator-airflow/tree/v1-10-test)（实验模式中的执行模块），
以及完整的 k8s 本地调度程序称为 Kubernetes Executor（即将发布文章）。
这些功能仍处于早期采用者/贡献者可能对这些功能的未来产生巨大影响的阶段。

对于有兴趣加入这些工作的人，我建议按照以下步骤：

 * 加入 airflow-dev 邮件列表 dev@airflow.apache.org。
 * 在 [Apache Airflow JIRA](https://issues.apache.org/jira/projects/AIRFLOW/issues/)中提出问题
 * 周三上午 10点 太平洋标准时间加入我们的 SIG-BigData 会议。
 * 在 kubernetes.slack.com 上的 #sig-big-data 找到我们。

特别感谢 Apache Airflow 和 Kubernetes 社区，特别是 Grant Nicholas，Ben Goldberg，Anirudh Ramanathan，Fokko Dreisprong 和 Bolke de Bruin，
感谢你对这些功能的巨大帮助以及我们未来的努力。

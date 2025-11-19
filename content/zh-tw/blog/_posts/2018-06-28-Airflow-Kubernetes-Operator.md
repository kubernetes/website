---
layout: blog
date:   2018-06-28
title: 'Airflow 在 Kubernetes 中的使用（第一部分）：一種不同的操作器'
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
## 介紹

作爲 Bloomberg [持續致力於開發 Kubernetes 生態系統](https://www.techatbloomberg.com/blog/bloomberg-awarded-first-cncf-end-user-award-contributions-kubernetes/)的一部分，
我們很高興能夠宣佈 Kubernetes Airflow Operator 的發佈;
[Apache Airflow](https://airflow.apache.org/)的一種機制，一種流行的工作流程編排框架，
使用 Kubernetes API 可以在本機啓動任意的 Kubernetes Pod。

<!--
## What Is Airflow?

Apache Airflow is one realization of the DevOps philosophy of "Configuration As Code." Airflow allows users to launch multi-step pipelines using a simple Python object DAG (Directed Acyclic Graph). You can define dependencies, programmatically construct complex workflows, and monitor scheduled jobs in an easy to read UI.
-->
## 什麼是 Airflow?

Apache Airflow 是“設定即代碼”的 DevOps 理念的一種實現。
Airflow 允許使用者使用簡單的 Python 對象 DAG（有向無環圖）啓動多步驟流水線。
你可以在易於閱讀的 UI 中定義依賴關係，以編程方式構建複雜的工作流，並監視調度的作業。

<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow_dags.png" width="85%" alt="Airflow DAGs" />
<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow.png" width="85%" alt="Airflow UI" />

<!--
## Why Airflow on Kubernetes?

Since its inception, Airflow's greatest strength has been its flexibility. Airflow offers a wide range of integrations for services ranging from Spark and HBase, to services on various cloud providers. Airflow also offers easy extensibility through its plug-in framework. However, one limitation of the project is that Airflow users are confined to the frameworks and clients that exist on the Airflow worker at the moment of execution. A single organization can have varied Airflow workflows ranging from data science pipelines to application deployments. This difference in use-case creates issues in dependency management as both teams might use vastly different libraries for their workflows.

To address this issue, we've utilized Kubernetes to allow users to launch arbitrary Kubernetes pods and configurations. Airflow users can now have full power over their run-time environments, resources, and secrets, basically turning Airflow into an "any job you want" workflow orchestrator.
-->
## 爲什麼在 Kubernetes 上使用 Airflow？

自成立以來，Airflow 的最大優勢在於其靈活性。
Airflow 提供廣泛的服務集成，包括Spark和HBase，以及各種雲提供商的服務。
Airflow 還通過其插件框架提供輕鬆的可擴展性。
但是，該項目的一個限制是 Airflow 使用者僅限於執行時 Airflow 站點上存在的框架和客戶端。
單個組織可以擁有各種 Airflow 工作流程，範圍從數據科學流到應用程序部署。
用例中的這種差異會在依賴關係管理中產生問題，因爲兩個團隊可能會在其工作流程使用截然不同的庫。

爲了解決這個問題，我們使 Kubernetes 允許使用者啓動任意 Kubernetes Pod 和設定。
Airflow 使用者現在可以在其運行時環境，資源和機密上擁有全部權限，基本上將 Airflow 轉變爲“你想要的任何工作”工作流程協調器。

<!--
## The Kubernetes Operator

Before we move any further, we should clarify that an Operator in Airflow is a task definition. When a user creates a DAG, they would use an operator like the "SparkSubmitOperator" or the "PythonOperator" to submit/monitor a Spark job or a Python function respectively. Airflow comes with built-in operators for frameworks like Apache Spark, BigQuery, Hive, and EMR. It also offers a Plugins entrypoint that allows DevOps engineers to develop their own connectors.

Airflow users are always looking for ways to make deployments and ETL pipelines simpler to manage. Any opportunity to decouple pipeline steps, while increasing monitoring, can reduce future outages and fire-fights. The following is a list of benefits provided by the Airflow Kubernetes Operator:
-->
## Kubernetes Operator

在進一步討論之前，我們應該澄清 Airflow 中的 [Operator](https://airflow.apache.org/concepts.html#operators) 是一個任務定義。
當使用者創建 DAG 時，他們將使用像 “SparkSubmitOperator” 或 “PythonOperator” 這樣的 Operator 分別提交/監視 Spark 作業或 Python 函數。
Airflow 附帶了 Apache Spark，BigQuery，Hive 和 EMR 等框架的內置運算符。
它還提供了一個插件入口點，允許DevOps工程師開發自己的連接器。

Airflow 使用者一直在尋找更易於管理部署和 ETL 流的方法。
在增加監控的同時，任何解耦流程的機會都可以減少未來的停機等問題。
以下是 Airflow Kubernetes Operator 提供的好處：

<!--
 * **Increased flexibility for deployments:**  
Airflow's plugin API has always offered a significant boon to engineers wishing to test new functionalities within their DAGs. On the downside, whenever a developer wanted to create a new operator, they had to develop an entirely new plugin. Now, any task that can be run within a Docker container is accessible through the exact same operator, with no extra Airflow code to maintain.
-->
 * **提高部署靈活性：**
Airflow 的插件 API一直爲希望在其 DAG 中測試新功能的工程師提供了重要的福利。
不利的一面是，每當開發人員想要創建一個新的 Operator 時，他們就必須開發一個全新的插件。
現在，任何可以在 Docker 容器中運行的任務都可以通過完全相同的運算符訪問，而無需維護額外的 Airflow 代碼。

<!--
 * **Flexibility of configurations and dependencies:**
For operators that are run within static Airflow workers, dependency management can become quite difficult. If a developer wants to run one task that requires [SciPy](https://www.scipy.org) and another that requires [NumPy](http://www.numpy.org), the developer would have to either maintain both dependencies within all Airflow workers or offload the task to an external machine (which can cause bugs if that external machine changes in an untracked manner). Custom Docker images allow users to ensure that the tasks environment, configuration, and dependencies are completely idempotent.  
-->
 * **設定和依賴的靈活性：**

對於在靜態 Airflow 工作程序中運行的 Operator，依賴關係管理可能變得非常困難。
如果開發人員想要運行一個需要 [SciPy](https://www.scipy.org) 的任務和另一個需要 [NumPy](http://www.numpy.org) 的任務，
開發人員必須維護所有 Airflow 節點中的依賴關係或將任務卸載到其他計算機（如果外部計算機以未跟蹤的方式更改，則可能導致錯誤）。
自定義 Docker 映像檔允許使用者確保任務環境，設定和依賴關係完全是冪等的。

<!--
 * **Usage of kubernetes secrets for added security:**
Handling sensitive data is a core responsibility of any DevOps engineer. At every opportunity, Airflow users want to isolate any API keys, database passwords, and login credentials on a strict need-to-know basis. With the Kubernetes operator, users can utilize the Kubernetes Vault technology to store all sensitive data. This means that the Airflow workers will never have access to this information, and can simply request that pods be built with only the secrets they need.
-->
 * **使用kubernetes Secret以增加安全性：**
處理敏感數據是任何開發工程師的核心職責。Airflow 使用者總有機會在嚴格條款的基礎上隔離任何API密鑰，數據庫密碼和登錄憑據。
使用 Kubernetes 運算符，使用者可以利用 Kubernetes Vault 技術存儲所有敏感數據。
這意味着 Airflow 工作人員將永遠無法訪問此信息，並且可以容易地請求僅使用他們需要的密碼信息構建 Pod。

<!--
# Architecture

The Kubernetes Operator uses the [Kubernetes Python Client](https://github.com/kubernetes-client/Python) to generate a request that is processed by the APIServer (1). Kubernetes will then launch your pod with whatever specs you've defined (2). Images will be loaded with all the necessary environment variables, secrets and dependencies, enacting a single command. Once the job is launched, the operator only needs to monitor the health of track logs (3). Users will have the choice of gathering logs locally to the scheduler or to any distributed logging service currently in their Kubernetes cluster.
-->
# 架構

<img src="/images/blog/2018-05-25-Airflow-Kubernetes-Operator/2018-05-25-airflow-architecture.png" width="85%" alt="Airflow Architecture" />

Kubernetes Operator 使用 [Kubernetes Python客戶端](https://github.com/kubernetes-client/Python)生成由 APIServer 處理的請求（1）。
然後，Kubernetes將使用你定義的需求啓動你的 Pod（2）。
映像檔文件中將加載環境變量，Secret 和依賴項，執行單個命令。
一旦啓動作業，Operator 只需要監視跟蹤日誌的狀況（3）。
使用者可以選擇將日誌本地收集到調度程序或當前位於其 Kubernetes 叢集中的任何分佈式日誌記錄服務。

<!--
# Using the Kubernetes Operator

## A Basic Example

The following DAG is probably the simplest example we could write to show how the Kubernetes Operator works. This DAG creates two pods on Kubernetes: a Linux distro with Python and a base Ubuntu distro without it. The Python pod will run the Python request correctly, while the one without Python will report a failure to the user. If the Operator is working correctly, the `passing-task` pod should complete, while the `failing-task` pod returns a failure to the Airflow webserver.
-->
# 使用 Kubernetes Operator
## 一個基本的例子

以下 DAG 可能是我們可以編寫的最簡單的示例，以顯示 Kubernetes Operator 的工作原理。
這個 DAG 在 Kubernetes 上創建了兩個 Pod：一個帶有 Python 的 Linux 發行版和一個沒有它的基本 Ubuntu 發行版。
Python Pod 將正確運行 Python 請求，而沒有 Python 的那個將向使用者報告失敗。
如果 Operator 正常工作，則應該完成 “passing-task” Pod，而“ falling-task” Pod 則向 Airflow 網路伺服器返回失敗。

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
## 但這與我的工作流程有什麼關係？

雖然這個例子只使用基本映像，但 Docker 的神奇之處在於，這個相同的 DAG 可以用於你想要的任何圖像/命令配對。
以下是推薦的 CI/CD 管道，用於在 Airflow DAG 上運行生產就緒代碼。

### 1：github 中的 PR

使用Travis或Jenkins運行單元和集成測試，請你的朋友PR你的代碼，併合併到主分支以觸發自動CI構建。

### 2：CI/CD 構建 Jenkins - > Docker 映像檔

[在 Jenkins 構建中生成 Docker 映像檔和更新版本](https://getintodevops.com/blog/building-your-first-Docker-image-with-jenkins-2-guide-for-developers)。

### 3：Airflow 啓動任務

最後，更新你的 DAG 以反映新版本，你應該準備好了！

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
# 啓動測試部署

由於 Kubernetes Operator 尚未發佈，我們尚未發佈官方
[helm](https://helm.sh/) 圖表或 Operator（但兩者目前都在進行中）。
但是，我們在下面列出了基本部署的說明，並且正在積極尋找測試人員來嘗試這一新功能。
要試用此係統，請按以下步驟操作：

## 步驟1：將 kubeconfig 設置爲指向 kubernetes 叢集

## 步驟2：克隆 Airflow 倉庫：

運行 `git clone https://github.com/apache/incubator-airflow.git` 來克隆官方 Airflow 倉庫。

## 步驟3：運行

爲了運行這個基本 Deployment，我們正在選擇我們目前用於 Kubernetes Executor 的集成測試腳本（將在本系列的下一篇文章中對此進行解釋）。
要啓動此部署，請運行以下三個命令：

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
在我們繼續之前，讓我們討論這些命令正在做什麼：

### sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml

Kubernetes Executor 是另一種 Airflow 功能，允許動態分配任務已解決冪等 Pod 的問題。
我們將其切換到 LocalExecutor 的原因只是一次引入一個功能。
如果你想嘗試 Kubernetes Executor，歡迎你跳過此步驟，但我們將在以後的文章中詳細介紹。

### ./scripts/ci/kubernetes/Docker/build.sh

此腳本將對Airflow主分支代碼進行打包，以根據Airflow的發行文件構建Docker容器

### ./scripts/ci/kubernetes/kube/deploy.sh

最後，我們在你的叢集上創建完整的Airflow部署。這包括 Airflow 設定，postgres 後端，web 伺服器和調度程序以及之間的所有必要服務。
需要注意的一點是，提供的角色綁定是叢集管理員，因此如果你沒有該叢集的權限級別，可以在 scripts/ci/kubernetes/kube/airflow.yaml 中進行修改。

## 步驟4：登錄你的網路伺服器

現在你的 Airflow 實例正在運行，讓我們來看看 UI！
使用者界面位於 Airflow Pod的 8080 端口，因此只需運行即可：

```
WEB=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' | grep "airflow" | head -1)
kubectl port-forward $WEB 8080:8080
```

<!--
 Now the Airflow UI will exist on http://localhost:8080. To log in simply enter `airflow`/`airflow` and you should have full access to the Airflow web UI.

## Step 5: Upload a test document

To modify/add your own DAGs, you can use `kubectl cp` to upload local files into the DAG folder of the Airflow scheduler. Airflow will then read the new DAG and automatically upload it to its system. The following command will upload any local file into the correct directory:
-->
現在，Airflow UI 將存在於 http://localhost:8080上。
要登錄，只需輸入`airflow`/`airflow`，你就可以完全訪問 Airflow Web UI。

## 步驟5：上傳測試文檔

要修改/添加自己的 DAG，可以使用 `kubectl cp` 將本地文件上傳到 Airflow 調度程序的 DAG 文件夾中。
然後，Airflow 將讀取新的 DAG 並自動將其上傳到其系統。以下命令將任何本地文件上載到正確的目錄中：

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
## 步驟6：使用它！
# 那麼我什麼時候可以使用它？

雖然此功能仍處於早期階段，但我們希望在未來幾個月內發佈該功能以進行廣泛發佈。

# 參與其中

此功能只是將 Apache Airflow 集成到 Kubernetes 中的多項主要工作的開始。
Kubernetes Operator 已合併到 [Airflow 的 1.10 發佈分支](https://github.com/apache/incubator-airflow/tree/v1-10-test)（實驗模式中的執行模塊），
以及完整的 k8s 本地調度程序稱爲 Kubernetes Executor（即將發佈文章）。
這些功能仍處於早期採用者/貢獻者可能對這些功能的未來產生巨大影響的階段。

對於有興趣加入這些工作的人，我建議按照以下步驟：

 * 加入 airflow-dev 郵件列表 dev@airflow.apache.org。
 * 在 [Apache Airflow JIRA](https://issues.apache.org/jira/projects/AIRFLOW/issues/)中提出問題
 * 週三上午 10點 太平洋標準時間加入我們的 SIG-BigData 會議。
 * 在 kubernetes.slack.com 上的 #sig-big-data 找到我們。

特別感謝 Apache Airflow 和 Kubernetes 社區，特別是 Grant Nicholas，Ben Goldberg，Anirudh Ramanathan，Fokko Dreisprong 和 Bolke de Bruin，
感謝你對這些功能的巨大幫助以及我們未來的努力。

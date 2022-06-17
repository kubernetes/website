---

layout: blog

title:  'Airflow on Kubernetes (Part 1): A Different Kind of Operator'

date:   2018-06-28

title: 'Airflow在Kubernetes中的使用（第一部分）：一種不同的操作器'

cn-approvers:

- congfairy

---


<!--

Author: Daniel Imberman (Bloomberg LP)

-->



作者: Daniel Imberman (Bloomberg LP)



<!--

## Introduction



As part of Bloomberg's continued commitment to developing the Kubernetes ecosystem, we are excited to announce the Kubernetes Airflow Operator; a mechanism for Apache Airflow, a popular workflow orchestration framework to natively launch arbitrary Kubernetes Pods using the Kubernetes API.

-->



## 介紹



作為Bloomberg [繼續致力於開發Kubernetes生態系統]的一部分（https://www.techatbloomberg.com/blog/bloomberg-awarded-first-cncf-end-user-award-contributions-kubernetes/），我們很高興能夠宣佈Kubernetes Airflow Operator的釋出; [Apache Airflow](https://airflow.apache.org/)的機制，一種流行的工作流程編排框架，使用Kubernetes API可以在本機啟動任意的Kubernetes Pod。



<!--

## What Is Airflow?



Apache Airflow is one realization of the DevOps philosophy of "Configuration As Code." Airflow allows users to launch multi-step pipelines using a simple Python object DAG (Directed Acyclic Graph). You can define dependencies, programmatically construct complex workflows, and monitor scheduled jobs in an easy to read UI.







-->



## 什麼是Airflow?



Apache Airflow是DevOps“Configuration As Code”理念的一種實現。 Airflow允許使用者使用簡單的Python物件DAG（有向無環圖）啟動多步驟流水線。 您可以在易於閱讀的UI中定義依賴關係，以程式設計方式構建複雜的工作流，並監視排程的作業。



<img src =“/ images / blog / 2018-05-25-Airflow-Kubernetes-Operator / 2018-05-25-airflow_dags.png”width =“85％”alt =“Airflow DAGs”/>

<img src =“/ images / blog / 2018-05-25-Airflow-Kubernetes-Operator / 2018-05-25-airflow.png”width =“85％”alt =“Airflow UI”/>



<!--

## Why Airflow on Kubernetes?



Since its inception, Airflow's greatest strength has been its flexibility. Airflow offers a wide range of integrations for services ranging from Spark and HBase, to services on various cloud providers. Airflow also offers easy extensibility through its plug-in framework. However, one limitation of the project is that Airflow users are confined to the frameworks and clients that exist on the Airflow worker at the moment of execution. A single organization can have varied Airflow workflows ranging from data science pipelines to application deployments. This difference in use-case creates issues in dependency management as both teams might use vastly different libraries for their workflows.



To address this issue, we've utilized Kubernetes to allow users to launch arbitrary Kubernetes pods and configurations. Airflow users can now have full power over their run-time environments, resources, and secrets, basically turning Airflow into an "any job you want" workflow orchestrator.

-->



## 為什麼在Kubernetes上使用Airflow?



自成立以來，Airflow的最大優勢在於其靈活性。 Airflow提供廣泛的服務整合，包括Spark和HBase，以及各種雲提供商的服務。 Airflow還透過其外掛框架提供輕鬆的可擴充套件性。但是，該專案的一個限制是Airflow使用者僅限於執行時Airflow站點上存在的框架和客戶端。單個組織可以擁有各種Airflow工作流程，範圍從資料科學流到應用程式部署。用例中的這種差異會在依賴關係管理中產生問題，因為兩個團隊可能會在其工作流程使用截然不同的庫。



為了解決這個問題，我們使Kubernetes允許使用者啟動任意Kubernetes pod和配置。 Airflow使用者現在可以在其執行時環境，資源和機密上擁有全部許可權，基本上將Airflow轉變為“您想要的任何工作”工作流程協調器。



<!--

## The Kubernetes Operator



Before we move any further, we should clarify that an Operator in Airflow is a task definition. When a user creates a DAG, they would use an operator like the "SparkSubmitOperator" or the "PythonOperator" to submit/monitor a Spark job or a Python function respectively. Airflow comes with built-in operators for frameworks like Apache Spark, BigQuery, Hive, and EMR. It also offers a Plugins entrypoint that allows DevOps engineers to develop their own connectors.



Airflow users are always looking for ways to make deployments and ETL pipelines simpler to manage. Any opportunity to decouple pipeline steps, while increasing monitoring, can reduce future outages and fire-fights. The following is a list of benefits provided by the Airflow Kubernetes Operator:

-->



## Kubernetes運營商



在進一步討論之前，我們應該澄清Airflow中的[Operator](https://airflow.apache.org/concepts.html#operators)是一個任務定義。 當用戶建立DAG時，他們將使用像“SparkSubmitOperator”或“PythonOperator”這樣的operator分別提交/監視Spark作業或Python函式。 Airflow附帶了Apache Spark，BigQuery，Hive和EMR等框架的內建運算子。 它還提供了一個外掛入口點，允許DevOps工程師開發自己的聯結器。



Airflow使用者一直在尋找更易於管理部署和ETL流的方法。 在增加監控的同時，任何解耦流程的機會都可以減少未來的停機等問題。 以下是Airflow Kubernetes Operator提供的好處：



<!--

 * Increased flexibility for deployments:

Airflow's plugin API has always offered a significant boon to engineers wishing to test new functionalities within their DAGs. On the downside, whenever a developer wanted to create a new operator, they had to develop an entirely new plugin. Now, any task that can be run within a Docker container is accessible through the exact same operator, with no extra Airflow code to maintain.

-->



* 提高部署靈活性：

Airflow的外掛API一直為希望在其DAG中測試新功能的工程師提供了重要的福利。 不利的一面是，每當開發人員想要建立一個新的operator時，他們就必須開發一個全新的外掛。 現在，任何可以在Docker容器中執行的任務都可以透過完全相同的運算子訪問，而無需維護額外的Airflow程式碼。



<!--

 * Flexibility of configurations and dependencies:

For operators that are run within static Airflow workers, dependency management can become quite difficult. If a developer wants to run one task that requires SciPy and another that requires NumPy, the developer would have to either maintain both dependencies within all Airflow workers or offload the task to an external machine (which can cause bugs if that external machine changes in an untracked manner). Custom Docker images allow users to ensure that the tasks environment, configuration, and dependencies are completely idempotent.

-->



* 配置和依賴的靈活性：

對於在靜態Airflow工作程式中執行的operator，依賴關係管理可能變得非常困難。 如果開發人員想要執行一個需要[SciPy](https://www.scipy.org)的任務和另一個需要[NumPy](http://www.numpy.org)的任務，開發人員必須維護所有Airflow節點中的依賴關係或將任務解除安裝到其他計算機（如果外部計算機以未跟蹤的方式更改，則可能導致錯誤）。 自定義Docker映象允許使用者確保任務環境，配置和依賴關係完全是冪等的。



<!--

 * Usage of kubernetes secrets for added security:

Handling sensitive data is a core responsibility of any DevOps engineer. At every opportunity, Airflow users want to isolate any API keys, database passwords, and login credentials on a strict need-to-know basis. With the Kubernetes operator, users can utilize the Kubernetes Vault technology to store all sensitive data. This means that the Airflow workers will never have access to this information, and can simply request that pods be built with only the secrets they need.

-->



* 使用kubernetes Secret以增加安全性：

處理敏感資料是任何開發工程師的核心職責。 Airflow使用者總有機會在嚴格條款的基礎上隔離任何API金鑰，資料庫密碼和登入憑據。 使用Kubernetes運算子，使用者可以利用Kubernetes Vault技術儲存所有敏感資料。 這意味著Airflow工作人員將永遠無法訪問此資訊，並且可以容易地請求僅使用他們需要的密碼資訊構建pod。



<!--

# Architecture







The Kubernetes Operator uses the Kubernetes Python Client to generate a request that is processed by the APIServer (1). Kubernetes will then launch your pod with whatever specs you've defined (2). Images will be loaded with all the necessary environment variables, secrets and dependencies, enacting a single command. Once the job is launched, the operator only needs to monitor the health of track logs (3). Users will have the choice of gathering logs locally to the scheduler or to any distributed logging service currently in their Kubernetes cluster.

-->



＃架構



<img src =“/ images / blog / 2018-05-25-Airflow-Kubernetes-Operator / 2018-05-25-airflow-architecture.png”width =“85％”alt =“Airflow Architecture”/>



Kubernetes Operator使用[Kubernetes Python客戶端](https://github.com/kubernetes-client/Python)生成由APIServer處理的請求（1）。 然後，Kubernetes將使用您定義的需求啟動您的pod（2）。映像檔案中將載入環境變數，Secret和依賴項，執行單個命令。 一旦啟動作業，operator只需要監視跟蹤日誌的狀況（3）。 使用者可以選擇將日誌本地收集到排程程式或當前位於其Kubernetes叢集中的任何分散式日誌記錄服務。



<!--

# Using the Kubernetes Operator



## A Basic Example



The following DAG is probably the simplest example we could write to show how the Kubernetes Operator works. This DAG creates two pods on Kubernetes: a Linux distro with Python and a base Ubuntu distro without it. The Python pod will run the Python request correctly, while the one without Python will report a failure to the user. If the Operator is working correctly, the passing-task pod should complete, while the failing-task pod returns a failure to the Airflow webserver.

-->



＃使用Kubernetes Operator



##一個基本的例子



以下DAG可能是我們可以編寫的最簡單的示例，以顯示Kubernetes Operator的工作原理。 這個DAG在Kubernetes上建立了兩個pod：一個帶有Python的Linux發行版和一個沒有它的基本Ubuntu發行版。 Python pod將正確執行Python請求，而沒有Python的那個將向用戶報告失敗。 如果Operator正常工作，則應該完成“passing-task”pod，而“falling-task”pod則向Airflow網路伺服器返回失敗。





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

<!--

## But how does this relate to my workflow?



While this example only uses basic images, the magic of Docker is that this same DAG will work for any image/command pairing you want. The following is a recommended CI/CD pipeline to run production-ready code on an Airflow DAG.



### 1: PR in github

Use Travis or Jenkins to run unit and integration tests, bribe your favorite team-mate into PR'ing your code, and merge to the master branch to trigger an automated CI build.



### 2: CI/CD via Jenkins -> Docker Image



Generate your Docker images and bump release version within your Jenkins build.



### 3: Airflow launches task



Finally, update your DAGs to reflect the new release version and you should be ready to go!

-->

##但這與我的工作流程有什麼關係？



雖然這個例子只使用基本映像，但Docker的神奇之處在於，這個相同的DAG可以用於您想要的任何影象/命令配對。 以下是推薦的CI / CD管道，用於在Airflow DAG上執行生產就緒程式碼。



### 1：github中的PR

使用Travis或Jenkins執行單元和整合測試，請您的朋友PR您的程式碼，併合併到主分支以觸發自動CI構建。



### 2：CI / CD構建Jenkins - > Docker Image



[在Jenkins構建中生成Docker映象和緩衝版本](https://getintodevops.com/blog/building-your-first-Docker-image-with-jenkins-2-guide-for-developers)。



### 3：Airflow啟動任務



最後，更新您的DAG以反映新版本，您應該準備好了！



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



Since the Kubernetes Operator is not yet released, we haven't released an official helm chart or operator (however both are currently in progress). However, we are including instructions for a basic deployment below  and are actively looking for foolhardy beta testers to try this new feature. To try this system out please follow these steps:



## Step 1: Set your kubeconfig to point to a kubernetes cluster



## Step 2: Clone the Airflow Repo:



Run git clone https://github.com/apache/incubator-airflow.git to clone the official Airflow repo.



## Step 3: Run



To run this basic deployment, we are co-opting the integration testing script that we currently use for the Kubernetes Executor (which will be explained in the next article of this series). To launch this deployment, run these three commands:

-->



＃啟動測試部署



由於Kubernetes運營商尚未釋出，我們尚未釋出官方[helm](https://helm.sh/) 圖表或operator（但兩者目前都在進行中）。 但是，我們在下面列出了基本部署的說明，並且正在積極尋找測試人員來嘗試這一新功能。 要試用此係統，請按以下步驟操作：



##步驟1：將kubeconfig設定為指向kubernetes叢集



##步驟2：clone Airflow 倉庫：



執行git clone https：// github.com / apache / incubator-airflow.git來clone官方Airflow倉庫。



##步驟3：執行



為了執行這個基本Deployment，我們正在選擇我們目前用於Kubernetes Executor的整合測試指令碼（將在本系列的下一篇文章中對此進行解釋）。 要啟動此部署，請執行以下三個命令：



```

sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml

./scripts/ci/kubernetes/Docker/build.sh

./scripts/ci/kubernetes/kube/deploy.sh

```

<!--

Before we move on, let's discuss what these commands are doing:



### sed -ie "s/KubernetesExecutor/LocalExecutor/g" scripts/ci/kubernetes/kube/configmaps.yaml



The Kubernetes Executor is another Airflow feature that allows for dynamic allocation  of tasks as idempotent pods. The reason we are switching this to the LocalExecutor is simply to introduce one feature at a time. You are more then welcome to skip this step if you would like to try the Kubernetes Executor, however we will go into more detail in a future article.



### ./scripts/ci/kubernetes/Docker/build.sh



This script will tar the Airflow master source code build a Docker container based on the Airflow distribution



### ./scripts/ci/kubernetes/kube/deploy.sh



Finally, we create a full Airflow deployment on your cluster. This includes Airflow configs, a postgres backend, the webserver + scheduler, and all necessary services between. One thing to note is that the role binding supplied is a cluster-admin, so if you do not have that level of permission on the cluster, you can modify this at scripts/ci/kubernetes/kube/airflow.yaml



## Step 4: Log into your webserver



Now that your Airflow instance is running let's take a look at the UI! The UI lives in port 8080 of the Airflow pod, so simply run

-->



在我們繼續之前，讓我們討論這些命令正在做什麼：



### sed -ie“s / KubernetesExecutor / LocalExecutor / g”scripts / ci / kubernetes / kube / configmaps.yaml



Kubernetes Executor是另一種Airflow功能，允許動態分配任務已解決冪等pod的問題。我們將其切換到LocalExecutor的原因只是一次引入一個功能。如果您想嘗試Kubernetes Executor，歡迎您跳過此步驟，但我們將在以後的文章中詳細介紹。



### ./scripts/ci/kubernetes/Docker/build.sh



此指令碼將對Airflow主分支程式碼進行打包，以根據Airflow的發行檔案構建Docker容器



### ./scripts/ci/kubernetes/kube/deploy.sh



最後，我們在您的叢集上建立完整的Airflow部署。這包括Airflow配置，postgres後端，webserver +排程程式以及之間的所有必要服務。需要注意的一點是，提供的角色繫結是叢集管理員，因此如果您沒有該叢集的許可權級別，可以在scripts / ci / kubernetes / kube / airflow.yaml中進行修改。



##步驟4：登入您的網路伺服器



現在您的Airflow例項正在執行，讓我們來看看UI！使用者介面位於Airflow pod的8080埠，因此只需執行即可



```

WEB=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}' | grep "airflow" | head -1)

kubectl port-forward $WEB 8080:8080

 ```

<!--

 Now the Airflow UI will exist on http://localhost:8080. To log in simply enter airflow/airflow and you should have full access to the Airflow web UI.



## Step 5: Upload a test document



To modify/add your own DAGs, you can use kubectl cp to upload local files into the DAG folder of the Airflow scheduler. Airflow will then read the new DAG and automatically upload it to its system. The following command will upload any local file into the correct directory:

-->



現在，Airflow UI將存在於http://localhost:8080上。 要登入，只需輸入airflow /airflow，您就可以完全訪問Airflow Web UI。



##步驟5：上傳測試文件



要修改/新增自己的DAG，可以使用kubectl cp將本地檔案上傳到Airflow排程程式的DAG資料夾中。 然後，Airflow將讀取新的DAG並自動將其上傳到其系統。 以下命令將任何本地檔案上載到正確的目錄中：



kubectl cp <local file> <namespace>/<pod>:/root/airflow/dags -c scheduler



<!--

## Step 6: Enjoy!



# So when will I be able to use this?



 While this feature is still in the early stages, we hope to see it released for wide release in the next few months.



# Get Involved



This feature is just the beginning of multiple major efforts to improves Apache Airflow integration into Kubernetes. The Kubernetes Operator has been merged into the 1.10 release branch of Airflow (the executor in experimental mode), along with a fully k8s native scheduler called the Kubernetes Executor (article to come). These features are still in a stage where early adopters/contributors can have a huge influence on the future of these features.



For those interested in joining these efforts, I'd recommend checkint out these steps:



 * Join the airflow-dev mailing list at dev@airflow.apache.org.

 * File an issue in Apache Airflow JIRA

 * Join our SIG-BigData meetings on Wednesdays at 10am PST.

 * Reach us on slack at #sig-big-data on kubernetes.slack.com



Special thanks to the Apache Airflow and Kubernetes communities, particularly Grant Nicholas, Ben Goldberg, Anirudh Ramanathan, Fokko Dreisprong, and Bolke de Bruin, for your awesome help on these features as well as our future efforts.

-->



##步驟6：使用它！



#那麼我什麼時候可以使用它？



 雖然此功能仍處於早期階段，但我們希望在未來幾個月內釋出該功能以進行廣泛釋出。



#參與其中



此功能只是將Apache Airflow整合到Kubernetes中的多項主要工作的開始。 Kubernetes Operator已合併到[Airflow的1.10釋出分支](https://github.com/apache/incubator-airflow/tree/v1-10-test)（實驗模式中的執行模組），以及完整的k8s本地排程程式稱為Kubernetes Executor（即將釋出文章）。這些功能仍處於早期採用者/貢獻者可能對這些功能的未來產生巨大影響的階段。



對於有興趣加入這些工作的人，我建議按照以下步驟：



 *加入airflow-dev郵件列表dev@airflow.apache.org。

 *在[Apache Airflow JIRA]中提出問題（https://issues.apache.org/jira/projects/AIRFLOW/issues/）

 *週三上午10點太平洋標準時間加入我們的SIG-BigData會議。

 *在kubernetes.slack.com上的＃sig-big-data找到我們。



特別感謝Apache Airflow和Kubernetes社群，特別是Grant Nicholas，Ben Goldberg，Anirudh Ramanathan，Fokko Dreisprong和Bolke de Bruin，感謝您對這些功能的巨大幫助以及我們未來的努力。

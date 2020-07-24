---
reviewers:
title: Kubernetesとは何か？
description: >
  Kubernetesは、宣言的な構成管理と自動化を促進し、コンテナ化されたワークロードやサービスを管理するための、ポータブルで拡張性のあるオープンソースのプラットフォームです。Kubernetesは巨大で急速に成長しているエコシステムを備えており、それらのサービス、サポート、ツールは幅広い形で利用可能です。
content_type: concept
weight: 10
card:
  name: concepts
  weight: 10
---

<!-- overview -->
このページでは、Kubernetesの概要について説明します。


<!-- body -->
Kubernetesは、宣言的な構成管理と自動化を促進し、コンテナ化されたワークロードやサービスを管理するための、ポータブルで拡張性のあるオープンソースのプラットフォームです。Kubernetesは巨大で急速に成長しているエコシステムを備えており、それらのサービス、サポート、ツールは幅広い形で利用可能です。

Kubernetesの名称は、ギリシャ語に由来し、操舵手やパイロットを意味しています。Googleは2014年にKubernetesプロジェクトをオープンソース化しました。Kubernetesは、[Googleが本番環境で大規模なワークロードを稼働させた15年以上の経験](/blog/2015/04/borg-predecessor-to-kubernetes/)と、コミュニティからの最高のアイディアや実践を組み合わせています。

## 過去を振り返ってみると

過去を振り返って、Kubernetesがなぜこんなに便利なのかを見てみましょう。

![Deployment evolution](/images/docs/Container_Evolution.svg)

**トラディショナルなデプロイメントの時代 (Traditional deployment):** 初期の頃は、組織は物理サーバー上にアプリケーションを実行させていました。物理サーバー上でアプリケーションのリソース制限を設定する方法がなかった為、リソースの割当問題が発生していました。

Early on, organizations ran applications on physical servers. There was no way to define resource boundaries for applications in a physical server, and this caused resource allocation issues. 

例えば、複数のアプリケーションを実行させた場合、ひとつのアプリケーションがリソースの大半を消費してしまうと、他のアプリケーションのパフォーマンスが低下してしまうことがありました。

For example, if multiple applications run on a physical server, there can be instances where one application would take up most of the resources, and as a result, the other applications would underperform. 

この解決方法は、それぞれのアプリケーションを別々の物理サーバーに稼働することでした。しかし、リソースが十分に活用できなかった為、拡大しませんでした。また組織にとって多くの物理サーバーを維持することは費用がかかりました。

A solution for this would be to run each application on a different physical server. But this did not scale as resources were underutilized, and it was expensive for organizations to maintain many physical servers.

**仮想化されたデプロイメントの時代 (Virtualized deployment):**  ひとつの解決方法として、仮想化が導入されました。1台の物理サーバーのCPU上で、複数の仮想マシン (VM) を実行させることができるようになりました。仮想化によりアプリケーションをVM毎に隔離する事ができ、ひとつのアプリケーションの情報が他のアプリケーションから自由にアクセスさせないといったセキュリティレベルを提供することができます。

As a solution, virtualization was introduced. It allows you to run multiple Virtual Machines (VMs) on a single physical server's CPU. Virtualization allows applications to be isolated between VMs and provides a level of security as the information of one application cannot be freely accessed by another application.

仮想化により、物理サーバー内のリソース使用率が向上し、アプリケーションの追加や更新が容易になり、ハードウェアコストの削減などスケーラビリティが向上します。仮想化を利用すると、物理リソースのセットを使い捨て可能な仮想マシンのクラスターとして提示することができます。

Virtualization allows better utilization of resources in a physical server and allows better scalability because an application can be added or updated easily, reduces hardware costs, and much more. With virtualization you can present a set of physical resources as a cluster of disposable virtual machines.

各VMは、仮想ハードウェア上で各自のOSを含んだ全コンポーネントを実行する完全なマシンです。

Each VM is a full machine running all the components, including its own operating system, on top of the virtualized hardware.


**コンテナを利用したデプロイメントの時代 (Container deployment):** コンテナはVMと似ていますが、アプリケーション間でオペレーティング・システム(OS)を共有できる緩和された分離特性を持っています。したがって、コンテナは軽量です。VMと同じように、コンテナは各自のファイルシステム、CPU、メモリー、プロセス空間等を持っています。基盤のインフラストラクチャから分離されているため、クラウドやOSディストリビューションを越えて移動することが可能です。

Containers are similar to VMs, but they have relaxed isolation properties to share the Operating System (OS) among the applications. Therefore, containers are considered lightweight. Similar to a VM, a container has its own filesystem, CPU, memory, process space, and more. As they are decoupled from the underlying infrastructure, they are portable across clouds and OS distributions.

コンテナは、その他にも次のようなメリットを提供するため、人気が高まっています。

Containers have become popular because they provide extra benefits, such as:

* アジャイルアプリケーションの作成とデプロイメント: VMイメージの利用時と比較して、コンテナイメージ作成の容易さと効率性が向上します。

* Agile application creation and deployment: increased ease and efficiency of container image creation compared to VM image use.


* 継続的な開発、インテグレーションとデプロイメント: 信頼できる頻繁なコンテナイメージのビルドと、素早く簡単にロールバックすることが可能なデプロイメントを提供します。(イメージが不変であれば)

* Continuous development, integration, and deployment: provides for reliable and frequent container image build and deployment with quick and easy rollbacks (due to image immutability).


* 開発者と運用者の関心を分離: アプリケーションコンテナイメージの作成は、デプロイメント時ではなく、ビルド/リリース時に行います。それによって、インフラストラクチャとアプリケーションを分離します。

* Dev and Ops separation of concerns: create application container images at build/release time rather than deployment time, thereby decoupling applications from infrastructure.


* 可観測性は OSレベルの情報とメトリックスだけではなく, アプリケーションの稼働状態やその他の警告も表示します。

* Observability not only surfaces OS-level information and metrics, but also application health and other signals.


* 開発、テスト、本番環境を越えた環境の一貫性: クラウドで実行させるのと同じようにノートPCでも実行させる事ができます。

* Environmental consistency across development, testing, and production: Runs the same on a laptop as it does in the cloud.


* クラウドとOSディストリビューションの可搬性: Ubuntu、RHEL、CoreOS上でも、オンプレミスも、主要なパブリッククラウドでも、それ以外のどんな環境でも、実行できます。

* Cloud and OS distribution portability: Runs on Ubuntu, RHEL, CoreOS, on-premises, on major public clouds, and anywhere else.


* アプリケーション中心の管理: 仮想マシン上でOSを実行するから、論理リソースを使用してOS上でアプリケーションを実行するへと抽象度のレベルを向上させます。

* Application-centric management: Raises the level of abstraction from running an OS on virtual hardware to running an application on an OS using logical resources.


* 疎結合、分散化、拡張性、柔軟性のあるマイクロサービス: アプリケーションを小さく、同時にデプロイと管理が可能な独立した部品に分割されます。1台の大きな単一目的のマシン上に実行するモノリシックなスタックではありません。

* Loosely coupled, distributed, elastic, liberated micro-services: applications are broken into smaller, independent pieces and can be deployed and managed dynamically – not a monolithic stack running on one big single-purpose machine.

* リソースの分割: アプリケーションのパフォーマンスが予測可能になります。

* Resource isolation: predictable application performance.


* リソースの効率的な利用: 高い効率性と集約性が可能になります。

* Resource utilization: high efficiency and density.

## Kubernetesが必要な理由と提供する機能 {#why-you-need-kubernetes-and-what-can-it-do}

コンテナは、アプリケーションを集約して実行する良い方法です。本番環境では、アプリケーションを実行しダウンタイムが発生しないように、コンテナを管理する必要があります。例えば、コンテナがダウンした場合、他のコンテナを起動する必要があります。このような動作がシステムに組込まれていると、管理が簡単になるのではないでしょうか？

Containers are a good way to bundle and run your applications. In a production environment, you need to manage the containers that run the applications and ensure that there is no downtime. For example, if a container goes down, another container needs to start. Wouldn't it be easier if this behavior was handled by a system?

そこを助けてくれるのがKubernetesです! Kubernetesは分散システムを弾力的に実行するフレームワークを提供してくれます。あなたのアプリケーションのためにスケーリングとフェイルオーバーの面倒を見てくれて、デプロイメントパターンなどを提供します。例えば、Kubernetesはシステムにカナリアデプロイメントを簡単に管理することができます。

That's how Kubernetes comes to the rescue! Kubernetes provides you with a framework to run distributed systems resiliently. It takes care of scaling and failover for your application, provides deployment patterns, and more. For example, Kubernetes can easily manage a canary deployment for your system.

Kubernetesは以下を提供します。

Kubernetes provides you with:


* **サービスディスカバリーと負荷分散**  
Kubernetesは、DNS名または独自のIPアドレスを使ってコンテナを公開することができます。コンテナへのトラフィックが多い場合は、Kubernetesは負荷分散し、ネットワークトラフィックを振り分けることができるので、デプロイメントが安定します。

* **Service discovery and load balancing**  
Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.


* **ストレージ オーケストレーション**  
Kubernetesは、ローカルストレージやパブリッククラウドプロバイダーなど、選択したストレージシステムを自動でマウントすることができます。

* **Storage orchestration**  
Kubernetes allows you to automatically mount a storage system of your choice, such as local storages, public cloud providers, and more.


* **自動化されたロールアウトとロールバック**  
Kubernetesを使うとデプロイしたコンテナのあるべき状態を記述することができ、制御されたスピードで実際の状態をあるべき状態に変更することができます。例えば、アプリケーションのデプロイメントのために、新しいコンテナの作成や既存コンテナの削除、新しいコンテナにあらゆるリソースを適用する作業を、Kubernetesで自動化できます。

* **Automated rollouts and rollbacks**  
You can describe the desired state for your deployed containers using Kubernetes, and it can change the actual state to the desired state at a controlled rate. For example, you can automate Kubernetes to create new containers for your deployment, remove existing containers and adopt all their resources to the new container.


* **自動ビンパッキング**  
コンテナ化されたタスクを実行するノード群をKubernetesへ提供します。各コンテナがどれくらいCPUやメモリー(RAM)を必要とするのかをKubernetesに宣言することができます。Kubernetesはコンテナをノードにあわせて調整することができ、リソースを最大限に活用してくれます。

* **Automatic bin packing**  
You provide Kubernetes with a cluster of nodes that it can use to run containerized tasks. You tell Kubernetes how much CPU and memory (RAM) each container needs. Kubernetes can fit containers onto your nodes to make the best use of your resources.


* **セルフヒーリング**  
Kubernetesは、処理が失敗した時、コンテナを入れ替えした時、定義したヘルスチェックに応答しないコンテナを強制終了した時、コンテナを再起動します。処理の準備ができるまでは、クライアントに通知しません。

* **Self-healing**  
Kubernetes restarts containers that fail, replaces containers, kills containers that don’t respond to your user-defined health check, and doesn’t advertise them to clients until they are ready to serve.


* **機密情報と構成管理**  
Kubernetesは、パスワードやOAuthトークン、SSHキーのような公にしにくい情報を保持し、管理することができます。機密情報をデプロイし、コンテナイメージを再作成することなくアプリケーションの構成情報を更新することができます。スタック構成の中で機密情報を晒してしまうこともありません。

* **Secret and configuration management**  
Kubernetes lets you store and manage sensitive information, such as passwords, OAuth tokens, and SSH keys. You can deploy and update secrets and application configuration without rebuilding your container images, and without exposing secrets in your stack configuration.



## Kubernetesにないもの

Kubernetesは、従来型の全部入りなPaaS(Platform as a Service)のシステムではありません。Kubernetesはハードウェアレベルではなく、コンテナレベルで動作するようになった時から、デプロイメント、スケーリング、負荷分散、ロギングやモニタリングといったPasSが提供するのと共通の機能をいくつか提供しています。また一方、Kubernetesはモノリシックでなく、標準のソリューションは選択が自由で、追加と削除が容易な構成になっています。Kubernetesは開発プラットフォーム構築の為にビルディングブロックを提供しますが、重要な部分はユーザーの選択と柔軟性を維持しています。

Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system. 
Since Kubernetes operates at the container level rather than at the hardware level, it provides some generally applicable features common to PaaS offerings, such as deployment, scaling, load balancing, logging, and monitoring. However, Kubernetes is not monolithic, and these default solutions are optional and pluggable. Kubernetes provides the building blocks for building developer platforms, but preserves user choice and flexibility where it is important.

Kubernetesは...

Kubernetes:

* サポートするアプリケーションの種類を制限しません。Kubernetesは、スレートレス、ステートフルやデータ処理のワークロードなど、非常に多様なワークロードをサポートすることを目的としています。アプリケーションがコンテナで実行できるのであれば、Kubernetes上で問題なく実行できるはずです。

* Does not limit the types of applications supported. Kubernetes aims to support an extremely diverse variety of workloads, including stateless, stateful, and data-processing workloads. If an application can run in a container, it should run great on Kubernetes.


* ソースコードのデプロイやアプリケーションのビルドは行いません。継続的なインテグレーション、デリバリー、デプロイメント(CI/CD)のワークフローは、組織の文化や好みだけでなく技術的な要件で決められます。

* Does not deploy source code and does not build your application. Continuous Integration, Delivery, and Deployment (CI/CD) workflows are determined by organization cultures and preferences as well as technical requirements.



* ミドルウェア(例:メッセージバス)、データ処理フレームワーク(例:Spark)、データベース(例:MySQL)、キャッシュ、クラスターストレージシステム(例:Ceph)といったアプリケーションレベルの機能を組み込んで提供しません。それらのコンポーネントは、Kubernetes上で実行することもできますし、[Open Service Broker](https://openservicebrokerapi.org/)のようなポータブルメカニズムを経由してKubernetes上で実行されるアプリケーションからアクセスすることも可能です。

* Does not provide application-level services, such as middleware (for example, message buses), data-processing frameworks (for example, Spark), databases (for example, MySQL), caches, nor cluster storage systems (for example, Ceph) as built-in services. Such components can run on Kubernetes, and/or can be accessed by applications running on Kubernetes through portable mechanisms, such as the [Open Service Broker](https://openservicebrokerapi.org/).


* ロギング、モニタリングやアラートを行うソリューションは指定しません。PoCとしていくつかのインテグレーションとメトリックスを収集し出力するメカニズムを提供します。

* Does not dictate logging, monitoring, or alerting solutions. It provides some integrations as proof of concept, and mechanisms to collect and export metrics.


* 構成言語/システム(例:Jsonnet)の提供も指示もしません。任意で宣言仕様のフォームの対象になる可能性がある宣言的APIを提供します。

* Does not provide nor mandate a configuration language/system (for example, Jsonnet). It provides a declarative API that may be targeted by arbitrary forms of declarative specifications.


* 統合的なマシンの構成、メンテナンス、管理、またはセルフヒーリングを行うシステムは提供も採用もおこないません。

* Does not provide nor adopt any comprehensive machine configuration, maintenance, management, or self-healing systems.



* さらに、Kubernetesは単なるオーケストレーションシステムではありません。実際には、オーケストレーションの必要性はありません。オーケストレーションの技術的な定義は、最初にAを実行し、次にB、その次にCを実行のような定義されたワークフローの実行です。対照的にKubernetesは、現在の状態から提示されたあるべき状態にあわせて継続的に維持するといった、独立していて構成可能な制御プロセスのセットを提供します。AからCへどのように移行するかは問題ではありません。集中管理も必要ありません。これにより、使いやすく、より強力で、堅牢で、弾力性と拡張性があるシステムが実現します。

* Additionally, Kubernetes is not a mere orchestration system. In fact, it eliminates the need for orchestration. The technical definition of orchestration is execution of a defined workflow: first do A, then B, then C. In contrast, Kubernetes comprises a set of independent, composable control processes that continuously drive the current state towards the provided desired state. It shouldn’t matter how you get from A to C. Centralized control is also not required. This results in a system that is easier to use and more powerful, robust, resilient, and extensible.


## {{% heading "whatsnext" %}}

*   [Kubernetesのコンポーネント](/ja/docs/concepts/overview/components/)を御覧ください。
*   [はじめる](/ja/docs/setup/)準備はできましたか？
---
reviewers:
- bgrant0607
- mikedanese
title: Kubernetesとは何か?
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
このページでは、Kubernetesの概要について説明します。
{{% /capture %}}

{{% capture body %}}
Kubernetesは、宣言的な設定と自動化を簡素化し、コンテナ化されたワークロードやサービスを管理するための、ポータブルで拡張性のあるオープンソースプラットホームです。
膨大で、急速に成長しているエコシステムを備えています。Kubernetesのサービス、サポート、ツールは幅広い形で利用可能です。

Googleは2014年のKubernetesプロジェクトをオープンソース化しました。Kubernetesは[Googleが大規模な本番ワークロードを動かしてきた10年半の経験
](<https://research.google.com/pubs/pub43438.html>)と、コミュニティから得られた最善のアイデア、プラクティスに基づいています。

## なぜKubernetesが必要で、どんなことができるのか?

Kubernetesには多くの機能があります。考えられるものとしては

- コンテナ基盤
- マイクロサービス基盤
- ポータブルなクラウド基盤など、他にもいろいろ

Kubernetsは、**コンテナを中心とした**管理環境です。ユーザーワークロードの代表格であるコンピューティング、ネットワーキング、ストレージインフラストラクチャを指揮します。それによって、Platform as a Service (PaaS)の簡単さの大部分を、Infrastructure as a Service (IaaS)の柔軟さとともに提供し、インフラストラクチャプロバイダの垣根を超えたポータビリティを実現します。

## Kubernetesが基盤になるってどういうこと?

Kubernetesが多くの機能を提供すると言いつつも、新しい機能から恩恵を受ける新しいシナリオは常にあります。アプリケーション固有のワークフローを効率化して開発者のスピードを早めることができます。最初は許容できるアドホックなオーケストレーションでも、大規模な堅牢な自動化が必要となることはしばしばあります。これが、Kubernetesが、アプリケーションのデプロイ、拡張、および管理を容易にするために、コンポーネントとツールのエコシステムを構築するための基盤としても機能するように設計された理由です。

[ラベル](/docs/concepts/overview/working-with-objects/labels/)を使用すると、ユーザーは自分のリソースを整理できます。 [アノテーション](/docs/concepts/overview/working-with-objects/annotations/)を使用すると、ユーザーは自分のワークフローを容易にし、管理ツールが状態をチェックするための簡単な方法を提供するためにカスタムデータを使ってリソースを装飾できるようになります。

さらに、[Kunernetesコントロールプレーン](/docs/concepts/overview/components/)は、開発者やユーザーが使える[API](/docs/reference/using-api/api-overview/)の上で成り立っています。ユーザーは[スケジューラー](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/scheduler.md)などの独自のコントローラーを、一般的な[コマンドラインツール](/docs/user-guide/kubectl-overview/)で使える[独自のAPI](/docs/concepts/api-extension/custom-resources/)を持たせて作成することができます。

この[デザイン](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md)によって、他の多くのシステムがKubernetes上で構築できるようになりました。

## Kubernetesにないこと

Kubernetesは伝統的な何でも入りのPaaSシステムではありません。Kubernetesはハードウェアレベルではなくコンテナレベルで動作するため、PaaS製品が提供するような、共通のいくつかの一般的に適用可能な機能(デプロイ、拡張、負荷分散、ログ記録、監視など)を提供します。ただし、Kubernetesはモノリシックではなく、これらのデフォルトのソリューションは任意に脱着可能です。Kubernetesは開発者の基盤を構築するための構成要素を提供しますが、重要な場合はユーザーの選択と柔軟性を維持します。

Kubernetesは...

* サポートするアプリケーションの種類を限定しません。Kubernetesはステートレス、ステートフル、およびデータ処理ワークロードなど、非常に多様なワークロードをサポートするように作られています。アプリケーションをコンテナ内で実行できる場合は、Kubernetes上でもうまく動作するはずです。
* ソースコードのデプロイやアプリケーションのビルドを行いません。継続的インテグレーション、デリバリー、デプロイ(CI/CD)ワークフローは、技術選定がそうであるように、組織の文化や好みによって決まるからです。
* ミドルウェア(例: message buses)、データ処理フレームワーク(例: Spark)、データベース(例: mysql)、キャッシュ、クラスターストレージシステム(例: Ceph)のような、アプリケーションレベルの機能は組み込みでは提供しません。これらのコンポーネントはKubernetesの上で動作できますし、Open Service Brokerのようなポータブルメカニズムを経由してKubernetes上のアプリケーションからアクセスすることもできます。
* ロギング、モニタリング、アラーティングソリューションへの指示は行いません。概念実証(PoC)としていくつかのインテグレーション、およびメトリックを収集およびエクスポートするためのメカニズムを提供します。
* 設定言語/システム（例：jsonnet）を提供も強制もしません。任意の形式の宣言仕様の対象となる可能性がある宣言APIを提供します。
* 包括的なインフラ構成、保守、管理、またはセルフヒーリングシステムを提供、導入しません。

さらに、Kubernetesは単なる*オーケストレーションシステム*ではありません。実際、オーケストレーションは不要です。*オーケストレーション*の技術的定義は、定義されたワークフローの実行です。最初にA、次にB、次にCを実行します。対照的に、Kubernetesは現在の状態を提供された望ましい状態に向かって継続的に推進する一連の独立した構成可能な制御プロセスで構成されます。AからCへのアクセス方法は関係ありません。集中管理も必要ありません。これにより、使いやすく、より強力で、堅牢で、回復力があり、そして拡張性のあるシステムが得られます。

## なぜコンテナなのか?

なぜコンテナを使うべきかの理由をお探しですか?

![なぜコンテナなのか?](/images/docs/why_containers.svg)

The *Old Way* to deploy applications was to install the applications
on a host using the operating-system package manager. This had the
disadvantage of entangling the applications' executables,
configuration, libraries, and lifecycles with each other and with the
host OS. One could build immutable virtual-machine images in order to
achieve predictable rollouts and rollbacks, but VMs are heavyweight
and non-portable.

The *New Way* is to deploy containers based on operating-system-level
virtualization rather than hardware virtualization. These containers
are isolated from each other and from the host: they have their own
filesystems, they can't see each others' processes, and their
computational resource usage can be bounded. They are easier to build
than VMs, and because they are decoupled from the underlying
infrastructure and from the host filesystem, they are portable across
clouds and OS distributions.

Because containers are small and fast, one application can be packed
in each container image. This one-to-one application-to-image
relationship unlocks the full benefits of containers. With containers,
immutable container images can be created at build/release time rather
than deployment time, since each application doesn't need to be
composed with the rest of the application stack, nor married to the
production infrastructure environment. Generating container images at
build/release time enables a consistent environment to be carried from
development into production.  Similarly, containers are vastly more
transparent than VMs, which facilitates monitoring and
management. This is especially true when the containers' process
lifecycles are managed by the infrastructure rather than hidden by a
process supervisor inside the container. Finally, with a single
application per container, managing the containers becomes tantamount
to managing deployment of the application.

Summary of container benefits:

* **アジャイルなアプリケーション作成とデプロイ**:
    Increased ease and efficiency of container image creation compared to VM image use.
* **継続的な開発、インテグレーション、デプロイ**:
    Provides for reliable and frequent container image build and
    deployment with quick and easy rollbacks (due to image
    immutability).
* **Dev and Ops separation of concerns**:
    Create application container images at build/release time rather
    than deployment time, thereby decoupling applications from
    infrastructure.
* **可観測性**
    Not only surfaces OS-level information and metrics, but also application
    health and other signals.
* **Environmental consistency across development, testing, and production**:
    Runs the same on a laptop as it does in the cloud.
* **Cloud and OS distribution portability**:
    Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, and anywhere else.
* **アプリケーション中心の管理**:
    Raises the level of abstraction from running an OS on virtual
    hardware to running an application on an OS using logical resources.
* **Loosely coupled, distributed, elastic, liberated [micro-services](https://martinfowler.com/articles/microservices.html)**:
    Applications are broken into smaller, independent pieces and can
    be deployed and managed dynamically -- not a monolithic stack
    running on one big single-purpose machine.
* **Resource isolation**:
    Predictable application performance.
* **Resource utilization**:
    High efficiency and density.

## Kubernetesってどういう意味? K8sって何?

**Kubernetes**という名前はギリシャ語で*操舵手*やパイロットという意味があり、知事や[サイバネティックス](http://www.etymonline.com/index.php?term=cybernetics)の語源にもなっています。K8sは、8文字の「ubernete」を「8」に置き換えた略語です。

{{% /capture %}}

{{% capture whatsnext %}}
*   [はじめる](/docs/setup/)準備はできましたか?
*   さらなる詳細については、[Kubernetesのドキュメント](/docs/home/)を御覧ください。
{{% /capture %}}



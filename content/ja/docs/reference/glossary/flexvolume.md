---
title: FlexVolume
id: flexvolume
date: 2018-06-25
full_link: /ja/docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolumeは、ツリー外のボリュームプラグインを作成するための非推奨なインターフェースです。{{< glossary_tooltip text="コンテナストレージインターフェース(CSI)" term_id="csi" >}}は、FlexVolumeのいくつかの問題に対処する新しいインターフェースです。


aka: 
tags:
- storage 
---
 FlexVolumeは、ツリー外のボリュームプラグインを作成するための非推奨なインターフェースです。{{< glossary_tooltip text="コンテナストレージインターフェース(CSI)" term_id="csi" >}}は、FlexVolumeのいくつかの問題に対処する新しいインターフェースです。

<!--more--> 

FlexVolumeを使用すると、ユーザーは独自のドライバーを作成し、Kubernetesでそれらのボリュームをサポートすることができます。
FlexVolumeドライバーのバイナリと依存関係は、ホストマシンにインストールする必要があります。
これにはrootアクセスが必要です。
Storage SIGは、FlexVolumeの制約に対処するために可能であれば{{< glossary_tooltip text="CSI" term_id="csi" >}}ドライバーを実装することを推奨しています。

* [KubernetesドキュメントのFlexVolume](/ja/docs/concepts/storage/volumes/#flexvolume)
* [FlexVolumesの詳細な情報](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [ストレージベンダー向けボリュームプラグインに関するFAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)

---
title: マニフェスト
id: manifest
date: 2019-06-28
short_description: >
  1つ以上のKubernetes APIオブジェクトをシリアライズした仕様です。

aka:
tags:
- fundamental
---
[JSON](https://www.json.org/json-en.html)または[YAML](https://yaml.org/)形式で記述されたKubernetes APIオブジェクトの仕様です。

<!--more-->
マニフェストは、適用時にKubernetesが維持するオブジェクトの望ましい状態を指定します。
YAML形式の場合、1つのファイルに複数のマニフェストを含めることができます。
---
reviewers:
  - Random-Liu
title: Valider la configuration du nœud
weight: 30
---

## Test de conformité des nœuds

Le _test de conformité des nœuds_ est un framework de test conteneurisé qui fournit une vérification système ainsi qu’un test fonctionnel d’un nœud. Ce test permet de vérifier si le nœud respecte les exigences minimales de Kubernetes ; un nœud qui réussit ce test est considéré comme apte à rejoindre un cluster Kubernetes.

## Prérequis du nœud

Pour exécuter le test de conformité des nœuds, un nœud doit satisfaire les mêmes prérequis qu’un nœud Kubernetes standard. Au minimum, le nœud doit disposer des daemons suivants installés :

* Des runtimes de conteneurs compatibles CRI tels que Docker, containerd et CRI-O
* kubelet

## Exécution du test de conformité des nœuds

Pour exécuter le test de conformité des nœuds, procédez comme suit :

1. Déterminez la valeur de l’option `--kubeconfig` du kubelet ; par exemple :
   `--kubeconfig=/var/lib/kubelet/config.yaml`.

   Comme le framework de test démarre un plan de contrôle local pour tester le kubelet,
   utilisez `http://localhost:8080` comme URL de l’API server.

   Vous pouvez également utiliser certains autres paramètres en ligne de commande du kubelet :
   * `--cloud-provider` : si vous utilisez `--cloud-provider=gce`, vous devez
     supprimer ce flag pour exécuter le test.

2. Exécutez le test de conformité des nœuds avec la commande suivante :

   ```shell
   # $CONFIG_DIR est le chemin des manifests pods du kubelet.
   # $LOG_DIR est le répertoire de sortie des logs du test.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Exécution du test de conformité des nœuds sur d’autres architectures

Kubernetes fournit également des images Docker de test de conformité des nœuds pour d’autres
architectures :

| Architecture | Image           |
| ------------ | --------------- |
| amd64        | node-test-amd64 |
| arm          | node-test-arm   |
| arm64        | node-test-arm64 |

## Exécution de tests sélectionnés

Pour exécuter des tests spécifiques, remplacez la variable d’environnement `FOCUS`
par l’expression régulière des tests que vous souhaitez exécuter.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Exécute uniquement le test MirrorPod
  registry.k8s.io/node-test:0.2
```

Le test de conformité des nœuds est une version conteneurisée des
[tests e2e des nœuds](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md).
Par défaut, il exécute tous les tests de conformité.

En théorie, vous pouvez exécuter n’importe quel test e2e des nœuds si vous configurez correctement le conteneur et
montez les volumes requis. Cependant, **il est fortement recommandé de n’exécuter que les tests de conformité**, car l’exécution de tests non conformes nécessite une configuration beaucoup plus complexe.

## Limitations

* Le test laisse certaines images Docker sur le nœud, notamment l’image du test de conformité des nœuds
  ainsi que les images des conteneurs utilisés dans les tests fonctionnels.
* Le test laisse des conteneurs arrêtés sur le nœud. Ces conteneurs sont créés
  pendant les tests fonctionnels.
  
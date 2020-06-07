;(function () {
	var partners = [
		{
			type: 0,
			name: 'Sysdig',
			logo: 'sys_dig',
			link: 'https://sysdig.com/blog/monitoring-kubernetes-with-sysdig-cloud/',
			blurb: "Sysdig est la société de renseignements sur les conteneurs. Sysdig a créé la seule plate-forme unifiée pour la surveillance, la sécurité et le dépannage dans une architecture compatible avec les microservices. "
		},
		{
			type: 0,
			name: 'Puppet',
			logo: 'puppet',
			link: 'https://puppet.com/blog/announcing-kream-and-new-kubernetes-helm-and-docker-modules',
			blurb: "Nous avons développé des outils et des produits pour que votre adoption de Kubernetes soit aussi efficace que possible, et qu'elle couvre l'ensemble du cycle de vos flux de travail, du développement à la production. Et maintenant, Puppet Pipelines for Containers est votre tableau de bord complet DevOps pour Kubernetes. "
		},
		{
			type: 0,
			name: 'Citrix',
			logo: 'citrix',
			link: 'https://www.citrix.com/networking/microservices.html',
			blurb: "Netscaler CPX offre aux développeurs d'applications toutes les fonctionnalités dont ils ont besoin pour équilibrer leurs microservices et leurs applications conteneurisées avec Kubernetes."
		},
		{
			type: 0,
			name: 'Cockroach Labs',
			logo: 'cockroach_labs',
			link: 'https://www.cockroachlabs.com/blog/running-cockroachdb-on-kubernetes/',
			blurb: 'CockroachDB est une base de données SQL distribuée dont le modèle de réplication et de capacité de survie intégré se combine à Kubernetes pour simplifier réellement les données.'
		},
		{
			type: 2,
			name: 'Weaveworks',
			logo: 'weave_works',
			link: ' https://weave.works/kubernetes',
			blurb: 'Weaveworks permet aux développeurs et aux équipes de développement / développement de connecter, déployer, sécuriser, gérer et dépanner facilement les microservices dans Kubernetes.'
		},
		{
			type: 0,
			name: 'Intel',
			logo: 'intel',
			link: 'https://tectonic.com/press/intel-coreos-collaborate-on-openstack-with-kubernetes.html',
			blurb: "Activer GIFEE (l'infrastructure de Google pour tous les autres), pour exécuter les déploiements OpenStack sur Kubernetes."
		},
		{
			type: 3,
			name: 'Platform9',
			logo: 'platform9',
			link: 'https://platform9.com/products/kubernetes/',
			blurb: "Platform9 est la société open source en tant que service qui exploite tout le bien de Kubernetes et le fournit sous forme de service géré."
		},
		{
			type: 0,
			name: 'Datadog',
			logo: 'datadog',
			link: 'http://docs.datadoghq.com/integrations/kubernetes/',
			blurb: 'Observabilité totale pour les infrastructures et applications dynamiques. Inclut des alertes de précision, des analyses et des intégrations profondes de Kubernetes. '
		},
		{
			type: 0,
			name: 'AppFormix',
			logo: 'appformix',
			link: 'http://www.appformix.com/solutions/appformix-for-kubernetes/',
			blurb: "AppFormix est un service d'optimisation des performances d'infrastructure cloud aidant les entreprises à rationaliser leurs opérations cloud sur n'importe quel cloud Kubernetes. "
		},
		{
			type: 0,
			name: 'Crunchy',
			logo: 'crunchy',
			link: 'http://info.crunchydata.com/blog/advanced-crunchy-containers-for-postgresql',
			blurb: 'Crunchy PostgreSQL Container Suite est un ensemble de conteneurs permettant de gérer PostgreSQL avec des microservices DBA exploitant Kubernetes et Helm.'
		},
		{
			type: 0,
			name: 'Aqua',
			logo: 'aqua',
			link: 'http://blog.aquasec.com/security-best-practices-for-kubernetes-deployment',
			blurb: "Sécurité complète et automatisée pour vos conteneurs s'exécutant sur Kubernetes."
		},
		{
			type: 0,
			name: 'Distelli',
			logo: 'distelli',
			link: 'https://www.distelli.com/',
			blurb: "Pipeline de vos référentiels sources vers vos clusters Kubernetes sur n'importe quel cloud."
		},
		{
			type: 0,
			name: 'Nuage networks',
			logo: 'nuagenetworks',
			link: 'https://github.com/nuagenetworks/nuage-kubernetes',
			blurb: "La plate-forme Nuage SDN fournit une mise en réseau à base de règles entre les pods Kubernetes et les environnements autres que Kubernetes avec une surveillance de la visibilité et de la sécurité."
		},
		{
			type: 0,
			name: 'Sematext',
			logo: 'sematext',
			link: 'https://sematext.com/kubernetes/',
			blurb: 'Journalisation et surveillance: collecte et traitement automatiques des métriques, des événements et des journaux pour les pods à découverte automatique et les noeuds Kubernetes.'
		},
		{
			type: 0,
			name: 'Diamanti',
			logo: 'diamanti',
			link: 'https://www.diamanti.com/products/',
			blurb: "Diamanti déploie des conteneurs à performances garanties en utilisant Kubernetes dans la première appliance hyperconvergée spécialement conçue pour les applications conteneurisées."
				},
		{
			type: 0,
			name: 'Aporeto',
			logo: 'aporeto',
			link: 'https://aporeto.com/trireme',
			blurb: "Aporeto sécurise par défaut les applications natives en nuage sans affecter la vélocité des développeurs et fonctionne à toute échelle, sur n'importe quel nuage."
				},
		{
		type: 2,
			name: 'Giant Swarm',
			logo: 'giantswarm',
			link: 'https://giantswarm.io',
			blurb: "Giant Swarm vous permet de créer et d'utiliser simplement et rapidement des clusters Kubernetes à la demande, sur site ou dans le cloud. Contactez Garm Swarm pour en savoir plus sur le meilleur moyen d'exécuter des applications natives en nuage où que vous soyez."
				},
		{
			type: 3,
			name: 'Giant Swarm',
			logo: 'giantswarm',
			link: 'https://giantswarm.io/product/',
			blurb: "Giant Swarm vous permet de créer et d'utiliser simplement et rapidement des clusters Kubernetes à la demande, sur site ou dans le cloud. Contactez Garm Swarm pour en savoir plus sur le meilleur moyen d'exécuter des applications natives en nuage où que vous soyez."
				},
		{
			type: 3,
			name: 'Hasura',
			logo: 'hasura',
			link: 'https://hasura.io',
			blurb: "Hasura est un PaaS basé sur Kubernetes et un BaaS basé sur Postgres qui accélère le développement d'applications avec des composants prêts à l'emploi."
				},
		{
			type: 3,
			name: 'Mirantis',
			logo: 'mirantis',
			link: 'https://www.mirantis.com/software/kubernetes/',
			blurb: 'Mirantis - Plateforme Cloud Mirantis'
				},
		{
			type: 2,
			name: 'Mirantis',
			logo: 'mirantis',
			link: 'https://content.mirantis.com/Containerizing-OpenStack-on-Kubernetes-Video-Landing-Page.html',
			blurb: "Mirantis construit et gère des clouds privés avec des logiciels open source tels que OpenStack, déployés sous forme de conteneurs orchestrés par Kubernetes."
				},
		{
			type: 0,
			name: 'Kubernetic',
			logo: 'kubernetic',
			link: 'https://kubernetic.com/',
			blurb: 'Kubernetic est un client Kubernetes Desktop qui simplifie et démocratise la gestion de clusters pour DevOps.'
				},
		{
			type: 1,
			name: 'Reactive Ops',
			logo: 'reactive_ops',
			link: 'https://www.reactiveops.com/the-kubernetes-experts/',
			blurb: "ReactiveOps a écrit l'automatisation des meilleures pratiques pour l'infrastructure sous forme de code sur GCP & AWS utilisant Kubernetes, vous aidant ainsi à construire et à maintenir une infrastructure de classe mondiale pour une fraction du prix d'une embauche interne."
		},
		{
			type: 2,
			name: 'Livewyer',
			logo: 'livewyer',
			link: 'https://livewyer.io/services/kubernetes-experts/',
			blurb: "Les experts de Kubernetes qui implémentent des applications intégrées et permettent aux équipes informatiques de tirer le meilleur parti de la technologie conteneurisée."
		},
		{
			type: 2,
			name: 'Samsung SDS',
			logo: 'samsung_sds',
			link: 'http://www.samsungsdsa.com/cloud-infrastructure_kubernetes',
			blurb: "L'équipe Cloud Native Computing de Samsung SDS propose des conseils d'experts couvrant tous les aspects techniques liés à la création de services destinés à un cluster Kubernetes."
		},
		{
			type: 2,
			name: 'Container Solutions',
			logo: 'container_solutions',
			link: 'http://container-solutions.com/resources/kubernetes/',
			blurb: 'Container Solutions est une société de conseil en logiciels haut de gamme qui se concentre sur les infrastructures programmables. Elle offre notre expertise en développement, stratégie et opérations logicielles pour vous aider à innover à grande vitesse et à grande échelle.'
		},
		{
			type: 4,
			name: 'Container Solutions',
			logo: 'container_solutions',
			link: 'http://container-solutions.com/resources/kubernetes/',
			blurb: 'Container Solutions est une société de conseil en logiciels haut de gamme qui se concentre sur les infrastructures programmables. Elle offre notre expertise en développement, stratégie et opérations logicielles pour vous aider à innover à grande vitesse et à grande échelle.'
		},
		{
			type: 2,
			name: 'Jetstack',
			logo: 'jetstack',
			link: 'https://www.jetstack.io/',
			blurb: "Jetstack est une organisation entièrement centrée sur Kubernetes. Ils vous aideront à tirer le meilleur parti de Kubernetes grâce à des services professionnels spécialisés et à des outils open source. Entrez en contact et accélérez votre projet."
		},
		{
			type: 0,
			name: 'Tigera',
			logo: 'tigera',
			link: 'http://docs.projectcalico.org/latest/getting-started/kubernetes/',
			blurb: "Tigera crée des solutions de réseautage en nuage natif hautes performances et basées sur des règles pour Kubernetes."
		},
		{
			type: 1,
			name: 'Harbur',
			logo: 'harbur',
			link: 'https://harbur.io/',
			blurb: "Basé à Barcelone, Harbur est un cabinet de conseil qui aide les entreprises à déployer des solutions d'auto-guérison basées sur les technologies de conteneur"
		},
		{
			type: 0,
			name: 'Spotinst',
			logo: 'spotinst',
			link: 'http://blog.spotinst.com/2016/08/04/elastigroup-kubernetes-minions-steroids/',
			blurb: "Votre Kubernetes à 80% de moins. Exécutez des charges de travail K8s sur des instances ponctuelles avec une disponibilité totale pour économiser au moins 80% de la mise à l'échelle automatique de vos Kubernetes avec une efficacité maximale dans des environnements hétérogènes."
		},
		{
			type: 2,
			name: 'InwinSTACK',
			logo: 'inwinstack',
			link: 'http://www.inwinstack.com/index.php/en/solutions-en/',
			blurb: "Notre service de conteneur exploite l'infrastructure basée sur OpenStack et son moteur Magnum d'orchestration de conteneur pour gérer les clusters Kubernetes."
		},
	{
			type: 4,
			name: 'InwinSTACK',
			logo: 'inwinstack',
			link: 'http://www.inwinstack.com/index.php/en/solutions-en/',
			blurb: "Notre service de conteneur exploite l'infrastructure basée sur OpenStack et son moteur Magnum d'orchestration de conteneur pour gérer les clusters Kubernetes."
			},
		{
			type: 3,
			name: 'InwinSTACK',
			logo: 'inwinstack',
			link: 'https://github.com/inwinstack/kube-ansible',
			blurb: 'inwinSTACK - être-ansible'
		},
		{
			type: 1,
			name: 'Semantix',
			logo: 'semantix',
			link: 'http://www.semantix.com.br/',
			blurb: "Semantix est une entreprise qui travaille avec l’analyse de données et les systèmes distribués. Kubernetes est utilisé pour orchestrer des services pour nos clients."
		},
		{
			type: 0,
			name: 'ASM Technologies Limited',
			logo: 'asm',
			link: 'http://www.asmtech.com/',
			blurb: "Notre portefeuille de chaînes logistiques technologiques permet à vos logiciels d'être accessibles, viables et disponibles plus efficacement."
		},
		{
			type: 1,
			name: 'InfraCloud Technologies',
			logo: 'infracloud',
			link: 'http://blog.infracloud.io/state-of-kubernetes/',
			blurb: "InfraCloud Technologies est une société de conseil en logiciels qui fournit des services dans les conteneurs, le cloud et le développement."
		},
		{
			type: 0,
			name: 'SignalFx',
			logo: 'signalfx',
			link: 'https://github.com/signalfx/integrations/tree/master/kubernetes',
			blurb: "Obtenez une visibilité en temps réel sur les métriques et les alertes les plus intelligentes pour les architectures actuelles, y compris une intégration poussée avec Kubernetes"
		},
		{
			type: 0,
			name: 'NATS',
			logo: 'nats',
			link: 'https://github.com/pires/kubernetes-nats-cluster',
			blurb: "NATS est un système de messagerie natif en nuage simple, sécurisé et évolutif."
		},
		{
			type: 2,
			name: 'RX-M',
			logo: 'rxm',
			link: 'http://rx-m.com/training/kubernetes-training/',
			blurb: 'Services de formation et de conseil Kubernetes Dev, DevOps et Production neutres sur le marché.'
		},
		{
			type: 4,
			name: 'RX-M',
			logo: 'rxm',
			link: 'http://rx-m.com/training/kubernetes-training/',
			blurb: 'Services de formation et de conseil Kubernetes Dev, DevOps et Production neutres sur le marché.'
		},
		{
			type: 1,
			name: 'Emerging Technology Advisors',
			logo: 'eta',
			link: 'https://www.emergingtechnologyadvisors.com/services/kubernetes.html',
			blurb: "ETA aide les entreprises à concevoir, mettre en œuvre et gérer des applications évolutives utilisant Kubernetes sur un cloud public ou privé."
		},
		{
			type: 0,
			name: 'CloudPlex.io',
			logo: 'cloudplex',
			link: 'http://www.cloudplex.io',
			blurb: "CloudPlex permet aux équipes d'exploitation de déployer, d'orchestrer, de gérer et de surveiller de manière visuelle l'infrastructure, les applications et les services dans un cloud public ou privé."
		},
		{
			type: 2,
			name: 'Kumina',
			logo: 'kumina',
			link: 'https://www.kumina.nl/managed_kubernetes',
			blurb: "Kumina combine la puissance de Kubernetes à plus de 10 ans d'expérience dans les opérations informatiques. Nous créons, construisons et prenons en charge des solutions Kubernetes entièrement gérées sur votre choix d’infrastructure. Nous fournissons également des services de conseil et de formation."
		},
		{
			type: 0,
			name: 'CA Technologies',
			logo: 'ca',
			link: 'https://docops.ca.com/ca-continuous-delivery-director/integrations/en/plug-ins/kubernetes-plug-in',
			blurb: "Le plug-in Kubernetes de CA Continuous Delivery Director orchestre le déploiement d'applications conteneurisées dans un pipeline de version de bout en bout."
		},
		{
			type: 0,
			name: 'CoScale',
			logo: 'coscale',
			link: 'http://www.coscale.com/blog/how-to-monitor-your-kubernetes-cluster',
			blurb: "Surveillance complète de la pile de conteneurs et de microservices orchestrés par Kubernetes. Propulsé par la détection des anomalies pour trouver les problèmes plus rapidement."
		},
		{
			type: 2,
			name: 'Supergiant.io',
			logo: 'supergiant',
			link: 'https://supergiant.io/blog/supergiant-packing-algorithm-unique-save-money',
			blurb: 'Supergiant autoscales hardware pour Kubernetes. Open-source, il facilite le déploiement, la gestion et la montée en charge des applications haute disponibilité, distribuées et à haute disponibilité. '
		},
		{
			type: 0,
			name: 'Avi Networks',
			logo: 'avinetworks',
			link: 'https://kb.avinetworks.com/avi-vantage-openshift-installation-guide/',
			blurb: "La structure des services applicatifs élastiques d'Avis fournit un réseau L4-7 évolutif, riche en fonctionnalités et intégré pour les environnements K8S."
		},
		{
			type: 1,
			name: 'Codecrux web technologies pvt ltd',
			logo: 'codecrux',
			link: 'http://codecrux.com/kubernetes/',
			blurb: "Chez CodeCrux, nous aidons votre organisation à tirer le meilleur parti de Containers et de Kubernetes, quel que soit le stade où vous vous trouvez"
		},
		{
			type: 0,
			name: 'Greenqloud',
			logo: 'qstack',
			link: 'https://www.qstack.com/application-orchestration/',
			blurb: "Qstack fournit des clusters Kubernetes sur site auto-réparables avec une interface utilisateur intuitive pour la gestion de l'infrastructure et de Kubernetes."
		},
		{
			type: 1,
			name: 'StackOverdrive.io',
			logo: 'stackoverdrive',
			link: 'http://www.stackoverdrive.net/kubernetes-consulting/',
			blurb: "StackOverdrive aide les organisations de toutes tailles à tirer parti de Kubernetes pour l’orchestration et la gestion par conteneur."
		},
		{
			type: 0,
			name: 'StackIQ, Inc.',
			logo: 'stackiq',
			link: 'https://www.stackiq.com/kubernetes/',
			blurb: "Avec Stacki et la palette Stacki pour Kubernetes, vous pouvez passer du métal nu aux conteneurs en un seul passage très rapidement et facilement."
		},
		{
			type: 0,
			name: 'Cobe',
			logo: 'cobe',
			link: 'https://cobe.io/product-page/',
			blurb: 'Gérez les clusters Kubernetes avec un modèle direct et interrogeable qui capture toutes les relations et les données de performance dans un contexte entièrement visualisé.'
		},
		{
			type: 0,
			name: 'Datawire',
			logo: 'datawire',
			link: 'http://www.datawire.io',
			blurb: "Les outils open source de Datawires permettent à vos développeurs de microservices d’être extrêmement productifs sur Kubernetes, tout en laissant les opérateurs dormir la nuit."
		},
		{
			type: 0,
			name: 'Mashape, Inc.',
			logo: 'kong',
			link: 'https://getkong.org/install/kubernetes/',
			blurb: "Kong est une couche d'API open source évolutive qui s'exécute devant toute API RESTful et peut être provisionnée à un cluster Kubernetes."
		},
		{
			type: 0,
			name: 'F5 Networks',
			logo: 'f5networks',
			link: 'http://github.com/f5networks',
			blurb: "Nous avons une intégration de LB dans Kubernetes."
		},
		{
			type: 1,
			name: 'Lovable Tech',
			logo: 'lovable',
			link: 'http://lovable.tech/',
			blurb: "Des ingénieurs, des concepteurs et des consultants stratégiques de classe mondiale vous aident à expédier une technologie Web et mobile attrayante."
		},
		{
			type: 0,
			name: 'StackState',
			logo: 'stackstate',
			link: 'http://stackstate.com/platform/container-monitoring',
			blurb: "Analyse opérationnelle entre les équipes et les outils. Inclut la visualisation de la topologie, l'analyse des causes premières et la détection des anomalies pour Kubernetes."
		},
		{
			type: 1,
			name: 'INEXCCO INC',
			logo: 'inexcco',
			link: 'https://www.inexcco.com/',
			blurb: "Fort talent pour DevOps et Cloud travaillant avec plusieurs clients sur des implémentations de kubernetes et de helm."
		},
		{
			type: 2,
			name: 'Bitnami',
			logo: 'bitnami',
			link: 'http://bitnami.com/kubernetes',
			blurb: "Bitnami propose à Kubernetes un catalogue d'applications et de blocs de construction d'applications fiables, à jour et faciles à utiliser."
		},
		{
			type: 1,
			name: 'Nebulaworks',
			logo: 'nebulaworks',
			link: 'http://www.nebulaworks.com/container-platforms',
			blurb: "Nebulaworks fournit des services destinés à aider l'entreprise à adopter des plates-formes de conteneurs modernes et des processus optimisés pour permettre l'innovation à grande échelle."
		},
		{
			type: 1,
			name: 'EASYNUBE',
			logo: 'easynube',
			link: 'http://easynube.co.uk/devopsnube/',
			blurb: "EasyNube fournit l'architecture, la mise en œuvre et la gestion d'applications évolutives à l'aide de Kubernetes et Openshift."
		},
		{
			type: 1,
			name: 'Opcito Technologies',
			logo: 'opcito',
			link: 'http://www.opcito.com/kubernetes/',
			blurb: "Opcito est une société de conseil en logiciels qui utilise Kubernetes pour aider les organisations à concevoir, concevoir et déployer des applications hautement évolutives."
		},
		{
			type: 0,
			name: 'code by Dell EMC',
			logo: 'codedellemc',
			link: 'https://blog.codedellemc.com',
			blurb: "Respecté en tant que chef de file de la persistance du stockage pour les applications conteneurisées. Contribution importante au K8 et à l'écosystème."
			},
		{
			type: 0,
			name: 'Instana',
			logo: 'instana',
			link: 'https://www.instana.com/supported-technologies/',
			blurb: "Instana surveille les performances des applications, de l'infrastructure, des conteneurs et des services déployés sur un cluster Kubernetes."
			},
		{
			type: 0,
			name: 'Netsil',
			logo: 'netsil',
			link: 'https://netsil.com/kubernetes/',
			blurb: "Générez une carte de topologie d'application découverte automatiquement en temps réel! Surveillez les pods et les espaces de noms Kubernetes sans aucune instrumentation de code."
			},
		{
			type: 2,
			name: 'Treasure Data',
			logo: 'treasuredata',
			link: 'https://fluentd.treasuredata.com/kubernetes-logging/',
			blurb: "Fluentd Enterprise apporte une journalisation intelligente et sécurisée à Kubernetes, ainsi que des intégrations avec des serveurs tels que Splunk, Kafka ou AWS S3."
			},
		{
			type: 2,
			name: 'Kenzan',
			logo: 'Kenzan',
			link: 'http://kenzan.com/?ref=kubernetes',
			blurb: "Nous fournissons des services de conseil personnalisés en nous basant sur Kubernetes. Cela concerne le développement de la plate-forme, les pipelines de distribution et le développement d'applications au sein de Kubernetes."
			},
		{
			type: 2,
			name: 'New Context',
			logo: 'newcontext',
			link: 'https://www.newcontext.com/devsecops-infrastructure-automation-orchestration/',
			blurb: "Nouveau contexte construit et optimise les implémentations et les migrations Kubernetes sécurisées, de la conception initiale à l'automatisation et à la gestion de l'infrastructure."
			},
		{
			type: 2,
			name: 'Banzai',
			logo: 'banzai',
			link: 'https://banzaicloud.com/platform/',
			blurb: "Banzai Cloud apporte le cloud natif à l'entreprise et simplifie la transition vers les microservices sur Kubernetes."
			},
		{
			type: 3,
			name: 'Kublr',
			logo: 'kublr',
			link: 'http://kublr.com',
			blurb: "Kublr - Accélérez et contrôlez le déploiement, la mise à l'échelle, la surveillance et la gestion de vos applications conteneurisées."
			},
		{
			type: 1,
			name: 'ControlPlane',
			logo: 'controlplane',
			link: 'https://control-plane.io',
			blurb: "Nous sommes un cabinet de conseil basé à Londres, spécialisé dans la sécurité et la livraison continue. Nous offrons des services de conseil et de formation."
			},
		{
			type: 3,
			name: 'Nirmata',
			logo: 'nirmata',
			link: 'https://www.nirmata.com/',
			blurb: 'Nirmata - Nirmata Managed Kubernets'
				},
		{
			type: 2,
			name: 'Nirmata',
			logo: 'nirmata',
			link: 'https://www.nirmata.com/',
			blurb: "Nirmata est une plate-forme logicielle qui aide les équipes de DevOps à fournir des solutions de gestion de conteneurs basées sur Kubernetes, de qualité professionnelle et indépendantes des fournisseurs de cloud."
				},
		{
			type: 3,
			name: 'TenxCloud',
			logo: 'tenxcloud',
			link: 'https://tenxcloud.com',
			blurb: 'TenxCloud - Moteur de conteneur TenxCloud (TCE)'
				},
		{
			type: 2,
			name: 'TenxCloud',
			logo: 'tenxcloud',
			link: 'https://www.tenxcloud.com/',
			blurb: "Fondé en octobre 2014, TenxCloud est l'un des principaux fournisseurs de services d'informatique en nuage de conteneurs en Chine, couvrant notamment la plate-forme cloud PaaS pour conteneurs, la gestion de micro-services, DevOps, les tests de développement, AIOps, etc. Fournir des produits et des solutions PaaS de cloud privé aux clients des secteurs de la finance, de l’énergie, des opérateurs, de la fabrication, de l’éducation et autres."
				},
		{
			type: 0,
			name: 'Twistlock',
			logo: 'twistlock',
			link: 'https://www.twistlock.com/',
			blurb: "La sécurité à l'échelle Kubernetes: Twistlock vous permet de déployer sans crainte, en vous assurant que vos images et vos conteneurs sont exempts de vulnérabilités et protégés au moment de l'exécution."
				},
		{
			type: 0,
			name: 'Endocode AG',
			logo: 'endocode',
			link: 'https://endocode.com/kubernetes/',
			blurb: 'Endocode pratique et enseigne la méthode open source. Noyau à cluster - Dev to Ops. Nous proposons des formations, des services et une assistance Kubernetes. '
			},
		{
			type: 2,
			name: 'Accenture',
			logo: 'accenture',
			link: 'https://www.accenture.com/us-en/service-application-containers',
			blurb: 'Architecture, mise en œuvre et exploitation de solutions Kubernetes de classe mondiale pour les clients cloud.'
			},
		{
			type: 1,
			name: 'Biarca',
			logo: 'biarca',
			link: 'http://biarca.io/',
			blurb: "Biarca est un fournisseur de services cloud et des domaines d’intervention clés. Les domaines d’intervention clés de Biarca incluent les services d’adoption en nuage, les services d’infrastructure, les services DevOps et les services d’application. Biarca s'appuie sur Kubernetes pour fournir des solutions conteneurisées."
			},
		{
			type: 2,
			name: 'Claranet',
			logo: 'claranet',
			link: 'http://www.claranet.co.uk/hosting/google-cloud-platform-consulting-managed-services',
			blurb: "Claranet aide les utilisateurs à migrer vers le cloud et à tirer pleinement parti du nouveau monde qu’il offre. Nous consultons, concevons, construisons et gérons de manière proactive l'infrastructure et les outils d'automatisation appropriés pour permettre aux clients d'atteindre cet objectif."
			},
		{
			type: 1,
			name: 'CloudKite',
			logo: 'cloudkite',
			link: 'https://cloudkite.io/',
			blurb: "CloudKite.io aide les entreprises à créer et à maintenir des logiciels hautement automatisés, résilients et extrêmement performants sur Kubernetes."
			},
		{
			type: 2,
			name: 'CloudOps',
			logo: 'CloudOps',
			link: 'https://www.cloudops.com/services/docker-and-kubernetes-workshops/',
			blurb: "CloudOps vous met au contact de l'écosystème K8s via un atelier / laboratoire. Obtenez des K8 prêts à l'emploi dans les nuages ​​de votre choix avec nos services gérés."
			},
		{
			type: 2,
			name: 'Ghostcloud',
			logo: 'ghostcloud',
			link: 'https://www.ghostcloud.cn/ecos-kubernetes',
			blurb: "EcOS est un PaaS / CaaS de niveau entreprise basé sur Docker et Kubernetes, ce qui facilite la configuration, le déploiement et la gestion des applications conteneurisées."
			},
		{
			type: 3,
			name: 'Ghostcloud',
			logo: 'ghostcloud',
			link: 'https://www.ghostcloud.cn/ecos-kubernetes',
			blurb: "EcOS est un PaaS / CaaS de niveau entreprise basé sur Docker et Kubernetes, ce qui facilite la configuration, le déploiement et la gestion des applications conteneurisées."
			},
		{
			type: 2,
			name: 'Contino',
			logo: 'contino',
			link: 'https://www.contino.io/',
			blurb: "Nous aidons les entreprises à adopter DevOps, les conteneurs et le cloud computing. Contino est un cabinet de conseil mondial qui permet aux organisations réglementées d’accélérer l’innovation en adoptant des approches modernes de la fourniture de logiciels."
			},
		{
			type: 2,
			name: 'Booz Allen Hamilton',
			logo: 'boozallenhamilton',
			link: 'https://www.boozallen.com/',
			blurb: "Booz Allen collabore avec des clients des secteurs public et privé pour résoudre leurs problèmes les plus difficiles en combinant conseil, analyse, opérations de mission, technologie, livraison de systèmes, cybersécurité, ingénierie et expertise en innovation."
			},
		{
			type: 1,
			name: 'BigBinary',
			logo: 'bigbinary',
			link: 'http://blog.bigbinary.com/categories/Kubernetes',
			blurb: "Fournisseur de solutions numériques pour les clients fédéraux et commerciaux, comprenant DevSecOps, des plates-formes cloud, une stratégie de transformation, des solutions cognitives et l'UX."
				},
		{
			type: 0,
			name: 'CloudPerceptions',
			logo: 'cloudperceptions',
			link: 'https://www.meetup.com/Triangle-Kubernetes-Meetup/files/',
			blurb: "Solution de sécurité des conteneurs pour les petites et moyennes entreprises qui envisagent d'exécuter Kubernetes sur une infrastructure partagée."
				},
		{
			type: 2,
			name: 'Creationline, Inc.',
			logo: 'creationline',
			link: 'https://www.creationline.com/ci',
			blurb: 'Solution totale pour la gestion des ressources informatiques par conteneur.'
				},
		{
			type: 0,
			name: 'DataCore Software',
			logo: 'datacore',
			link: 'https://www.datacore.com/solutions/virtualization/containerization',
			blurb: "DataCore fournit à Kubernetes un stockage de blocs universel hautement disponible et hautement performant, ce qui améliore radicalement la vitesse de déploiement."
				},
		{
			type: 0,
			name: 'Elastifile',
			logo: 'elastifile',
			link: 'https://www.elastifile.com/stateful-containers',
			blurb: "La structure de données multi-cloud d’Elastifile offre un stockage persistant défini par logiciel et hautement évolutif, conçu pour le logiciel Kubernetes."
				},
		{
			type: 0,
			name: 'GitLab',
			logo: 'gitlab',
			link: 'https://about.gitlab.com/2016/11/14/idea-to-production/',
			blurb: "Avec GitLab et Kubernetes, vous pouvez déployer un pipeline CI / CD complet avec plusieurs environnements, des déploiements automatiques et une surveillance automatique."
				},
		{
			type: 0,
			name: 'Gravitational, Inc.',
			logo: 'gravitational',
			link: 'https://gravitational.com/telekube/',
			blurb: "Telekube associe Kubernetes à Teleport, notre serveur SSH moderne, afin que les opérateurs puissent gérer à distance une multitude de déploiements d'applications K8."
				},
		{
			type: 0,
			name: 'Hitachi Data Systems',
			logo: 'hitachi',
			link: 'https://www.hds.com/en-us/products-solutions/application-solutions/unified-compute-platform-with-kubernetes-orchestration.html',
			blurb: "Créez les applications dont vous avez besoin pour conduire votre entreprise - DÉVELOPPEZ ET DÉPLOYEZ DES APPLICATIONS PLUS RAPIDEMENT ET PLUS FIABLES."
				},
		{
			type: 1,
			name: 'Infosys Technologies',
			logo: 'infosys',
			link: 'https://www.infosys.com',
			blurb: "Monolithique à microservices sur openshift est une offre que nous développons dans le cadre de la pratique open source."
				},
		{
			type: 0,
			name: 'JFrog',
			logo: 'jfrog',
			link: 'https://www.jfrog.com/use-cases/12584/',
			blurb: "Vous pouvez utiliser Artifactory pour stocker et gérer toutes les images de conteneur de votre application, les déployer sur Kubernetes et configurer un pipeline de construction, de test et de déploiement à l'aide de Jenkins et d'Artifactory. Une fois qu'une image est prête à être déployée, Artifactory peut déclencher un déploiement de mise à jour propagée dans un cluster Kubernetes sans interruption - automatiquement!"
				},
		{
			type: 0,
			name: 'Navops by Univa',
			logo: 'navops',
			link: 'https://www.navops.io',
			blurb: "Navops est une suite de produits qui permet aux entreprises de tirer pleinement parti de Kubernetes et permet de gérer rapidement et efficacement des conteneurs à grande échelle."
				},
		{
			type: 0,
			name: 'NeuVector',
			logo: 'neuvector',
			link: 'http://neuvector.com/solutions-for-kubernetes-security/',
			blurb: "NeuVector fournit une solution de sécurité réseau intelligente pour les conteneurs et les applications, intégrée et optimisée pour Kubernetes."
				},
		{
			type: 1,
			name: 'OpsZero',
			logo: 'opszero',
			link: 'https://www.opszero.com/kubernetes.html',
			blurb: 'opsZero fournit DevOps pour les startups. Nous construisons et entretenons votre infrastructure Kubernetes et Cloud pour accélérer votre cycle de publication. '
				},
		{
			type: 1,
			name: 'Shiwaforce.com Ltd.',
			logo: 'shiwaforce',
			link: 'https://www.shiwaforce.com/en/',
			blurb: "Shiwaforce.com est le partenaire agile de la transformation numérique. Nos solutions suivent les changements de l'entreprise rapidement, facilement et à moindre coût."
				},
		{
			type: 1,
			name: 'SoftServe',
			logo: 'softserve',
			link: 'https://www.softserveinc.com/en-us/blogs/kubernetes-travis-ci/',
			blurb: "SoftServe permet à ses clients d’adopter des modèles de conception d’applications modernes et de bénéficier de grappes Kubernetes entièrement intégrées, hautement disponibles et économiques, à n’importe quelle échelle."
				},
		{
			type: 1,
			name: 'Solinea',
			logo: 'solinea',
			link: 'https://www.solinea.com/cloud-consulting-services/container-microservices-offerings',
			blurb: "Solinea est un cabinet de conseil en transformation numérique qui permet aux entreprises de créer des solutions innovantes en adoptant l'informatique en nuage native."
				},
		{
			type: 1,
			name: 'Sphere Software, LLC',
			logo: 'spheresoftware',
			link: 'https://sphereinc.com/kubernetes/',
			blurb: "L'équipe d'experts de Sphere Software permet aux clients de concevoir et de mettre en œuvre des applications évolutives à l'aide de Kubernetes dans Google Cloud, AWS et Azure."
				},
		{
			type: 1,
			name: 'Altoros',
			logo: 'altoros',
			link: 'https://www.altoros.com/container-orchestration-tools-enablement.html',
			blurb: "Déploiement et configuration de Kubernetes, Optimisation de solutions existantes, formation des développeurs à l'utilisation de Kubernetes, assistance."
				},
		{
			type: 0,
			name: 'Cloudbase Solutions',
			logo: 'cloudbase',
			link: 'https://cloudbase.it/kubernetes',
			blurb: "Cloudbase Solutions assure l'interopérabilité multi-cloud de Kubernetes pour les déploiements Windows et Linux basés sur des technologies open source."
				},
		{
			type: 0,
			name: 'Codefresh',
			logo: 'codefresh',
			link: 'https://codefresh.io/kubernetes-deploy/',
			blurb: 'Codefresh est une plate-forme complète DevOps conçue pour les conteneurs et Kubernetes. Avec les pipelines CI / CD, la gestion des images et des intégrations profondes dans Kubernetes et Helm. '
				},
		{
			type: 0,
			name: 'NetApp',
			logo: 'netapp',
			link: 'http://netapp.io/2016/12/23/introducing-trident-dynamic-persistent-volume-provisioner-kubernetes/',
			blurb: "Provisionnement dynamique et prise en charge du stockage persistant."
				},
		{
			type: 0,
			name: 'OpenEBS',
			logo: 'OpenEBS',
			link: 'https://openebs.io/',
			blurb: "OpenEBS est un stockage conteneurisé de conteneurs étroitement intégré à Kubernetes et basé sur le stockage en bloc distribué et la conteneurisation du contrôle du stockage. OpenEBS dérive de l’intention des K8 et d’autres codes YAML ou JSON, tels que les SLA de qualité de service par conteneur, les stratégies de réplication et de hiérarchisation, etc. OpenEBS est conforme à l'API EBS."
				},
		{
			type: 3,
			name: 'Google Kubernetes Engine',
			logo: 'google',
			link: 'https://cloud.google.com/kubernetes-engine/',
			blurb: "Google - Moteur Google Kubernetes"
				},
		{
			type: 1,
			name: 'Superorbital',
			logo: 'superorbital',
			link: 'https://superorbit.al/workshops/kubernetes/',
			blurb: "Aider les entreprises à naviguer dans les eaux Cloud Native grâce au conseil et à la formation Kubernetes."
				},
		{
			type: 3,
			name: 'Apprenda',
			logo: 'apprenda',
			link: 'https://apprenda.com/kismatic/',
			blurb: 'Apprenda - Kismatic Enterprise Toolkit (KET)'
				},
		{
			type: 3,
			name: 'Red Hat',
			logo: 'redhat',
			link: 'https://www.openshift.com',
			blurb: "Red Hat - OpenShift Online et OpenShift Container Platform"
				},
		{
			type: 3,
			name: 'Rancher',
			logo: 'rancher',
			link: 'http://rancher.com/kubernetes/',
			blurb: 'Rancher Inc. - Rancher Kubernetes'
				},
		{
			type: 3,
			name: 'Canonical',
			logo: 'canonical',
			link: 'https://www.ubuntu.com/kubernetes',
			blurb: "La distribution canonique de Kubernetes vous permet d’exploiter à la demande des grappes Kubernetes sur n’importe quel infrastructure de cloud public ou privée majeure."
				},
		{
			type: 2,
			name: 'Canonical',
			logo: 'canonical',
			link: 'https://www.ubuntu.com/kubernetes',
			blurb: 'Canonical Ltd. - Distribution canonique de Kubernetes'
				},
		{
			type: 3,
			name: 'Cisco',
			logo: 'cisco',
			link: 'https://www.cisco.com',
			blurb: 'Cisco Systems - Plateforme de conteneur Cisco'
				},
		{
			type: 3,
			name: 'Cloud Foundry',
			logo: 'cff',
			link: 'https://www.cloudfoundry.org/container-runtime/',
			blurb: "Cloud Foundry - Durée d'exécution du conteneur Cloud Foundry"
				},
		{
			type: 3,
			name: 'IBM',
			logo: 'ibm',
			link: 'https://www.ibm.com/cloud/container-service',
			blurb: 'IBM - Service IBM Cloud Kubernetes'
				},
		{
			type: 2,
			name: 'IBM',
			logo: 'ibm',
			link: 'https://www.ibm.com/cloud/container-service/',
			blurb: "Le service de conteneur IBM Cloud combine Docker et Kubernetes pour fournir des outils puissants, des expériences utilisateur intuitives, ainsi qu'une sécurité et une isolation intégrées pour permettre la livraison rapide d'applications tout en tirant parti des services de cloud computing, notamment des capacités cognitives de Watson."
				},
		{
			type: 3,
			name: 'Samsung',
			logo: 'samsung_sds',
			link: 'https://github.com/samsung-cnct/kraken',
			blurb: "Samsung SDS - Kraken"
				},
		{
			type: 3,
			name: 'IBM',
			logo: 'ibm',
			link: 'https://www.ibm.com/cloud-computing/products/ibm-cloud-private/',
			blurb: 'IBM - IBM Cloud Private'
				},
		{
			type: 3,
			name: 'Kinvolk',
			logo: 'kinvolk',
			link: 'https://github.com/kinvolk/kube-spawn',
			blurb: "Kinvolk - cube-spawn"
				},
		{
			type: 3,
			name: 'Heptio',
			logo: 'heptio',
			link: 'https://aws.amazon.com/quickstart/architecture/heptio-kubernetes',
			blurb: 'Heptio - AWS-Quickstart'
				},
		{
			type: 2,
			name: 'Heptio',
			logo: 'heptio',
			link: 'http://heptio.com',
			blurb: "Heptio aide les entreprises de toutes tailles à se rapprocher de la communauté dynamique de Kubernetes."
				},
		{
			type: 3,
			name: 'StackPointCloud',
			logo: 'stackpoint',
			link: 'https://stackpoint.io',
			blurb: 'StackPointCloud - StackPointCloud'
				},
		{
			type: 2,
			name: 'StackPointCloud',
			logo: 'stackpoint',
			link: 'https://stackpoint.io',
			blurb: 'StackPointCloud propose une large gamme de plans de support pour les clusters Kubernetes gérés construits via son plan de contrôle universel pour Kubernetes Anywhere.'
				},
		{
			type: 3,
			name: 'Caicloud',
			logo: 'caicloud',
			link: 'https://caicloud.io/products/compass',
			blurb: 'Caicloud - Compass'
				},
		{
			type: 2,
			name: 'Caicloud',
			logo: 'caicloud',
			link: 'https://caicloud.io/',
			blurb: "Fondée par d'anciens membres de Googlers et les premiers contributeurs de Kubernetes, Caicloud s'appuie sur Kubernetes pour fournir des produits de conteneur qui ont servi avec succès les entreprises Fortune 500, et utilise également Kubernetes comme véhicule pour offrir une expérience d'apprentissage en profondeur ultra-rapide."
				},
		{
			type: 3,
			name: 'Alibaba',
			logo: 'alibaba',
			link: 'https://www.aliyun.com/product/containerservice?spm=5176.8142029.388261.219.3836dbccRpJ5e9',
			blurb: 'Alibaba Cloud - Alibaba Cloud Container Service'
				},
		{
			type: 3,
			name: 'Tencent',
			logo: 'tencent',
			link: 'https://cloud.tencent.com/product/ccs?lang=en',
			blurb: 'Tencent Cloud - Tencent Cloud Container Service'
				},
		{
			type: 3,
			name: 'Huawei',
			logo: 'huawei',
			link: 'http://www.huaweicloud.com/product/cce.html',
			blurb: 'Huawei - Huawei Cloud Container Engine'
				},
		{
			type: 2,
			name: 'Huawei',
			logo: 'huawei',
			link: 'http://developer.huawei.com/ict/en/site-paas',
			blurb: "FusionStage est un produit Platform as a Service de niveau entreprise, dont le cœur est basé sur la technologie de conteneur open source traditionnelle, notamment Kubernetes et Docker."
				},
		{
			type: 3,
			name: 'Google',
			logo: 'google',
			link: 'https://github.com/kubernetes/kubernetes/tree/master/cluster',
			blurb: "Google - kube-up.sh sur Google Compute Engine"
				},
		{
			type: 3,
			name: 'Poseidon',
			logo: 'poseidon',
			link: 'https://typhoon.psdn.io/',
			blurb: 'Poséidon - Typhon'
				},
		{
			type: 3,
			name: 'Netease',
			logo: 'netease',
			link: 'https://www.163yun.com/product/container-service-dedicated',
			blurb: 'Netease - Netease Container Service Dedicated'
				},
		{
			type: 2,
			name: 'Loodse',
			logo: 'loodse',
			link: 'https://loodse.com',
			blurb: "Loodse propose des formations et des conseils sur Kubernetes, et organise régulièrement des événements liés à l’Europe."
				},
		{
			type: 4,
			name: 'Loodse',
			logo: 'loodse',
			link: 'https://loodse.com',
			blurb: "Loodse propose des formations et des conseils sur Kubernetes, et organise régulièrement des événements liés à l’Europe."
				},
		{
			type: 4,
			name: 'LF Training',
			logo: 'lf-training',
			link: 'https://training.linuxfoundation.org/',
			blurb: "Le programme de formation de la Linux Foundation associe les connaissances de base étendues aux possibilités de mise en réseau dont les participants ont besoin pour réussir dans leur carrière."
				},
		{
			type: 3,
			name: 'Loodse',
			logo: 'loodse',
			link: 'https://loodse.com',
			blurb: 'Pilots - Moteur de conteneur Kubermatic'
				},
		{
			type: 1,
			name: 'LTI',
			logo: 'lti',
			link: 'https://www.lntinfotech.com/',
			blurb: "LTI aide les entreprises à concevoir, développer et prendre en charge des applications natives de cloud évolutives utilisant Docker et Kubernetes pour un cloud privé ou public."
				},
		{
			type: 3,
			name: 'Microsoft',
			logo: 'microsoft',
			link: 'https://github.com/Azure/acs-engine',
			blurb: 'Microsoft - Azure acs-engine'
				},
		{
			type: 3,
			name: 'Microsoft',
			logo: 'microsoft',
			link: 'https://docs.microsoft.com/en-us/azure/aks/',
			blurb: 'Microsoft - Azure Container Service AKS'
			  },
		{
			type: 3,
			name: 'Oracle',
			logo: 'oracle',
			link: 'http://www.wercker.com/product',
			blurb: 'Oracle - Oracle Container Engine'
				},
		{
			type: 3,
			name: 'Oracle',
			logo: 'oracle',
			link: 'https://github.com/oracle/terraform-kubernetes-installer',
			blurb: "Oracle - Programme d'installation Oracle Terraform Kubernetes"
				},
		{
			type: 3,
			name: 'Mesosphere',
			logo: 'mesosphere',
			link: 'https://mesosphere.com/kubernetes/',
			blurb: 'Mésosphère - Kubernetes sur DC / OS'
				},
		{
			type: 3,
			name: 'Appscode',
			logo: 'appscode',
			link: 'https://appscode.com/products/cloud-deployment/',
			blurb: 'Appscode - Pharmer'
				},
		{
			type: 3,
			name: 'SAP',
			logo: 'sap',
			link: 'https://cloudplatform.sap.com/index.html',
			blurb: 'SAP - Cloud Platform - Gardener (pas encore publié)'
				},
		{
			type: 3,
			name: 'Oracle',
			logo: 'oracle',
			link: 'https://www.oracle.com/linux/index.html',
			blurb: 'Oracle - Oracle Linux Container Services à utiliser avec Kubernetes'
				},
		{
			type: 3,
			name: 'CoreOS',
			logo: 'coreos',
			link: 'https://github.com/kubernetes-incubator/bootkube',
			blurb: 'CoreOS - bootkube'
				},
		{
			type: 2,
			name: 'CoreOS',
			logo: 'coreos',
			link: 'https://coreos.com/',
			blurb: 'Tectonic est le produit Kubernetes destiné aux entreprises, conçu par CoreOS. Il ajoute des fonctionnalités clés pour vous permettre de gérer, mettre à jour et contrôler les clusters en production. '
				},
		{
			type: 3,
			name: 'Weaveworks',
			logo: 'weave_works',
			link: '/docs/setup/independent/create-cluster-kubeadm/',
			blurb: Weaveworks - kubeadm
				},
		{
			type: 3,
			name: 'Joyent',
			logo: 'joyent',
			link: 'https://github.com/joyent/triton-kubernetes',
			blurb: 'Joyent - Triton Kubernetes'
				},
		{
			type: 3,
			name: 'Wise2c',
			logo: 'wise2c',
			link: 'http://www.wise2c.com/solution',
			blurb: "Technologie Wise2C - WiseCloud"
				},
		{
			type: 2,
			name: 'Wise2c',
			logo: 'wise2c',
			link: 'http://www.wise2c.com',
			blurb: "Utilisation de Kubernetes pour fournir au secteur financier une solution de diffusion continue informatique et de gestion de conteneur de niveau entreprise."
				},
		{
			type: 3,
			name: 'Docker',
			logo: 'docker',
			link: 'https://www.docker.com/enterprise-edition',
			blurb: 'Docker - Docker Enterprise Edition'
				},
		{
			type: 3,
			name: 'Daocloud',
			logo: 'daocloud',
			link: 'http://www.daocloud.io/dce',
			blurb: 'DaoCloud - DaoCloud Enterprise'
				},
		{
			type: 2,
			name: 'Daocloud',
			logo: 'daocloud',
			link: 'http://www.daocloud.io/dce',
			blurb: "Nous fournissons une plate-forme d’application native en nuage de niveau entreprise prenant en charge Kubernetes et Docker Swarm."
				},
		{
			type: 4,
			name: 'Daocloud',
			logo: 'daocloud',
			link: 'http://www.daocloud.io/dce',
			blurb: "Nous fournissons une plate-forme d’application native en nuage de niveau entreprise prenant en charge Kubernetes et Docker Swarm."
				},
		{
			type: 3,
			name: 'SUSE',
			logo: 'suse',
			link: 'https://www.suse.com/products/caas-platform/',
			blurb: 'SUSE - Plateforme SUSE CaaS (conteneur en tant que service)'
				},
		{
			type: 3,
			name: 'Pivotal',
			logo: 'pivotal',
			link: 'https://cloud.vmware.com/pivotal-container-service',
			blurb: 'Pivotal / VMware - Service de conteneur Pivotal (PKS)'
				},
		{
			type: 3,
			name: 'VMware',
			logo: 'vmware',
			link: 'https://cloud.vmware.com/pivotal-container-service',
			blurb: 'Pivotal / VMware - Service de conteneur Pivotal (PKS)'
				},
		{
			type: 3,
			name: 'Alauda',
			logo: 'alauda',
			link: 'http://www.alauda.cn/product/detail/id/68.html',
			blurb: 'Alauda - Alauda EE'
				},
		{
			type: 4,
			name: 'Alauda',
			logo: 'alauda',
			link: 'http://www.alauda.cn/product/detail/id/68.html',
			blurb: "Alauda fournit aux offres Kubernetes-Centric Enterprise Platform-as-a-Service un objectif précis: fournir des fonctionnalités Cloud Native et les meilleures pratiques DevOps aux clients professionnels de tous les secteurs en Chine."
				},
		{
			type: 2,
			name: 'Alauda',
			logo: 'alauda',
			link: 'www.alauda.io',
			blurb: "Alauda fournit aux offres Kubernetes-Centric Enterprise Platform-as-a-Service un objectif précis: fournir des fonctionnalités Cloud Native et les meilleures pratiques DevOps aux clients professionnels de tous les secteurs en Chine."
				},
		{
			type: 3,
			name: 'EasyStack',
			logo: 'easystack',
			link: 'https://easystack.cn/eks/',
			blurb: 'EasyStack - Service EasyStack Kubernetes (ECS)'
				},
		{
			type: 3,
			name: 'CoreOS',
			logo: 'coreos',
			link: 'https://coreos.com/tectonic/',
			blurb: 'CoreOS - Tectonique'
				},
		{
			type: 0,
			name: 'GoPaddle',
			logo: 'gopaddle',
			link: 'https://gopaddle.io',
			blurb: "goPaddle est une plate-forme DevOps pour les développeurs Kubernetes. Il simplifie la création et la maintenance du service Kubernetes grâce à la conversion de source en image, à la gestion des versions et des versions, à la gestion d'équipe, aux contrôles d'accès et aux journaux d'audit, à la fourniture en un seul clic de grappes Kubernetes sur plusieurs clouds à partir d'une console unique."
				},
		{
			type: 0,
			name: 'Vexxhost',
			logo: 'vexxhost',
			link: 'https://vexxhost.com/public-cloud/container-services/kubernetes/',
			blurb: "VEXXHOST offre un service de gestion de conteneurs haute performance optimisé par Kubernetes et OpenStack Magnum."
				},
		{
			type: 1,
			name: 'Component Soft',
			logo: 'componentsoft',
			link: 'https://www.componentsoft.eu/?p=3925',
			blurb: "Component Soft propose des formations, des conseils et une assistance autour des technologies de cloud ouvert telles que Kubernetes, Docker, Openstack et Ceph."
				},
		{
			type: 0,
			name: 'Datera',
			logo: 'datera',
			link: 'http://www.datera.io/kubernetes/',
			blurb: "Datera fournit un stockage de blocs élastiques autogéré de haute performance avec un provisionnement en libre-service pour déployer Kubernetes à grande échelle."
				},
		{
			type: 0,
			name: 'Containership',
			logo: 'containership',
			link: 'https://containership.io/',
			blurb: "Containership est une offre kubernetes gérée indépendamment du cloud qui prend en charge le provisionnement automatique de plus de 14 fournisseurs de cloud."
				},
		{
			type: 0,
			name: 'Pure Storage',
			logo: 'pure_storage',
			link: 'https://hub.docker.com/r/purestorage/k8s/',
			blurb: "Notre pilote flexvol et notre provisioning dynamique permettent aux périphériques de stockage FlashArray / Flashblade d'être utilisés en tant que stockage persistant de première classe à partir de Kubernetes."
				},
		{
			type: 0,
			name: 'Elastisys',
			logo: 'elastisys',
			link: 'https://elastisys.com/kubernetes/',
			blurb: "Mise à l'échelle automatique prédictive - détecte les variations de charge de travail récurrentes, les pics de trafic irréguliers, etc. Utilise les K8 dans n’importe quel cloud public ou privé."
				},
		{
			type: 0,
			name: 'Portworx',
			logo: 'portworx',
			link: 'https://portworx.com/use-case/kubernetes-storage/',
			blurb: "Avec Portworx, vous pouvez gérer n'importe quelle base de données ou service avec état sur toute infrastructure utilisant Kubernetes. Vous obtenez une couche de gestion de données unique pour tous vos services avec état, quel que soit leur emplacement."
				},
		{
			type: 1,
			name: 'Object Computing, Inc.',
			logo: 'objectcomputing',
			link: 'https://objectcomputing.com/services/software-engineering/devops/kubernetes-services',
			blurb: "Notre gamme de services de conseil DevOps comprend le support, le développement et la formation de Kubernetes."
				},
		{
			type: 1,
			name: 'Isotoma',
			logo: 'isotoma',
			link: 'https://www.isotoma.com/blog/2017/10/24/containerisation-tips-for-using-kubernetes-with-aws/',
			blurb: "Basés dans le nord de l'Angleterre, les partenaires Amazon qui fournissent des solutions Kubernetes sur AWS pour la réplication et le développement natif."
				},
		{
			type: 1,
			name: 'Servian',
			logo: 'servian',
			link: 'https://www.servian.com/cloud-and-technology/',
			blurb: "Basé en Australie, Servian fournit des services de conseil, de conseil et de gestion pour la prise en charge des cas d'utilisation de kubernètes centrés sur les applications et les données."
				},
		{
			type: 1,
			name: 'Redzara',
			logo: 'redzara',
			link: 'http://redzara.com/cloud-service',
			blurb: "Redzara possède une vaste et approfondie expérience dans l'automatisation du Cloud, franchissant à présent une étape gigantesque en fournissant une offre de services de conteneur et des services à ses clients."
				},
		{
			type: 0,
			name: 'Dataspine',
			logo: 'dataspine',
			link: 'http://dataspine.xyz/',
			blurb: "Dataspine est en train de créer une plate-forme de déploiement sécurisée, élastique et sans serveur pour les charges de travail ML / AI de production au-dessus des k8s."
				},
		{
			type: 1,
			name: 'CloudBourne',
			logo: 'cloudbourne',
			link: 'https://cloudbourne.com/kubernetes-enterprise-hybrid-cloud/',
			blurb: "Vous voulez optimiser l'automatisation de la construction, du déploiement et de la surveillance avec Kubernetes? Nous pouvons aider."
				},
		{
			type: 0,
			name: 'CloudBourne',
			logo: 'cloudbourne',
			link: 'https://cloudbourne.com/',
			blurb: "Notre plate-forme cloud hybride AppZ peut vous aider à atteindre vos objectifs de transformation numérique en utilisant les puissants Kubernetes."
				},
		{
			type: 3,
			name: 'BoCloud',
			logo: 'bocloud',
			link: 'http://www.bocloud.com.cn/en/index.html',
			blurb: 'BoCloud - BeyondcentContainer'
				},
		{
			type: 2,
			name: 'Naitways',
			logo: 'naitways',
			link: 'https://www.naitways.com/',
			blurb: "Naitways est un opérateur (AS57119), un intégrateur et un fournisseur de services cloud (le nôtre!). Nous visons à fournir des services à valeur ajoutée grâce à notre maîtrise de l’ensemble de la chaîne de valeur (infrastructure, réseau, compétences humaines). Le cloud privé et public est disponible via Kubernetes, qu'il soit géré ou non."
				},
		{
			type: 2,
			name: 'Kinvolk',
			logo: 'kinvolk',
			link: 'https://kinvolk.io/kubernetes/',
			blurb: 'Kinvolk offre un support technique et opérationnel à Kubernetes, du cluster au noyau. Les entreprises leaders dans le cloud font confiance à Kinvolk pour son expertise approfondie de Linux. '
				},
		{
			type: 1,
			name: 'Cascadeo Corporation',
			logo: 'cascadeo',
			link: 'http://www.cascadeo.com/',
			blurb: "Cascadeo conçoit, implémente et gère des charges de travail conteneurisées avec Kubernetes, tant pour les applications existantes que pour les projets de développement en amont."
				},
		{
			type: 1,
			name: 'Elastisys AB',
			logo: 'elastisys',
			link: 'https://elastisys.com/services/#kubernetes',
			blurb: "Nous concevons, construisons et exploitons des clusters Kubernetes. Nous sommes des experts des infrastructures Kubernetes hautement disponibles et auto-optimisées."
				},
		{
			type: 1,
			name: 'Greenfield Guild',
			logo: 'greenfield',
			link: 'http://greenfieldguild.com/',
			blurb: "La guilde Greenfield construit des solutions open source de qualité et offre une formation et une assistance pour Kubernetes dans tous les environnements."
				},
		{
			type: 1,
			name: 'PolarSeven',
			logo: 'polarseven',
			link: 'https://polarseven.com/what-we-do/kubernetes/',
			blurb: "Pour démarrer avec Kubernetes (K8), nos consultants PolarSeven peuvent vous aider à créer un environnement dockerized entièrement fonctionnel pour exécuter et déployer vos applications."
				},
		{
			type: 1,
			name: 'Kloia',
			logo: 'kloia',
			link: 'https://kloia.com/kubernetes/',
			blurb: 'Kloia est une société de conseil en développement et en microservices qui aide ses clients à faire migrer leur environnement vers des plates-formes cloud afin de créer des environnements plus évolutifs et sécurisés. Nous utilisons Kubernetes pour fournir à nos clients des solutions complètes tout en restant indépendantes du cloud. '
				},
		{
			type: 0,
			name: 'Bluefyre',
			logo: 'bluefyre',
			link: 'https://www.bluefyre.io',
			blurb: "Bluefyre offre une plate-forme de sécurité d'abord destinée aux développeurs, native de Kubernetes. Bluefyre aide votre équipe de développement à envoyer du code sécurisé sur Kubernetes plus rapidement!"
				},
		{
			type: 0,
			name: 'Harness',
			logo: 'harness',
			link: 'https://harness.io/harness-continuous-delivery/secret-sauce/smart-automation/',
			blurb: "Harness propose une livraison continue, car un service assurera une prise en charge complète des applications conteneurisées et des clusters Kubernetes."
				},
		{
			type: 0,
			name: 'VMware - Wavefront',
			logo: 'wavefront',
			link: 'https://www.wavefront.com/solutions/container-monitoring/',
			blurb: "La plate-forme Wavefront fournit des analyses et une surveillance basées sur des mesures pour Kubernetes et des tableaux de bord de conteneurs pour DevOps et des équipes de développeurs, offrant une visibilité sur les services de haut niveau ainsi que sur des mesures de conteneurs granulaires."
				},
		{
			type: 0,
			name: 'Bloombase, Inc.',
			logo: 'bloombase',
			link: 'https://www.bloombase.com/go/kubernetes',
			blurb: "Bloombase fournit un cryptage de données au repos avec une bande passante élevée et une défense en profondeur pour verrouiller les joyaux de la couronne Kubernetes à grande échelle."
				},
		{
			type: 0,
			name: 'Kasten',
			logo: 'kasten',
			link: 'https://kasten.io/product/',
			blurb: "Kasten fournit des solutions d'entreprise spécialement conçues pour gérer la complexité opérationnelle de la gestion des données dans les environnements en nuage."
				},
		{
			type: 0,
			name: 'Humio',
			logo: 'humio',
			link: 'https://humio.com',
			blurb: "Humio est une base de données d'agrégation de journaux. Nous proposons une intégration Kubernetes qui vous donnera un aperçu de vos journaux à travers des applications et des instances."
				},
		{
			type: 0,
			name: 'Outcold Solutions LLC',
			logo: 'outcold',
			link: 'https://www.outcoldsolutions.com/#monitoring-kubernetes',
			blurb: 'Puissantes applications Splunk certifiées pour la surveillance OpenShift, Kubernetes et Docker.'
				},
		{
			type: 0,
			name: 'SysEleven GmbH',
			logo: 'syseleven',
			link: 'http://www.syseleven.de/',
			blurb: "Clients d'entreprise ayant besoin d'opérations à toute épreuve (portails d'entreprise et de commerce électronique à haute performance)"
				},
		{
			type: 0,
			name: 'Landoop',
			logo: 'landoop',
			link: 'http://lenses.stream',
			blurb: 'Lenses for Apache Kafka, to deploy, manage and operate with confidence data streaming pipelines and topologies at scale with confidence and native Kubernetes integration.'
				},
		{
			type: 0,
			name: 'Redis Labs',
			logo: 'redis',
			link: 'https://redislabs.com/blog/getting-started-with-kubernetes-and-redis-using-redis-enterprise/',
			blurb: "Redis Enterprise étend Redis open source et fournit une mise à l'échelle linéaire stable et de haute performance requise pour la création de microservices sur la plateforme Kubernetes."
				},
		{
			type: 3,
			name: 'Diamanti',
			logo: 'diamanti',
			link: 'https://diamanti.com/',
			blurb: 'Diamanti - Diamanti-D10'
				},
		{
			type: 3,
			name: 'Eking',
			logo: 'eking',
			link: 'http://www.eking-tech.com/',
			blurb: 'Hainan eKing Technology Co. - eKing Cloud Container Platform'
				},
		{
			type: 3,
			name: 'Harmony Cloud',
			logo: 'harmony',
			link: 'http://harmonycloud.cn/products/rongqiyun/',
			blurb: 'Harmonycloud - Harmonycloud Container Platform'
				},
		{
			type: 3,
			name: 'Woqutech',
			logo: 'woqutech',
			link: 'http://woqutech.com/product_qfusion.html',
			blurb: 'Woqutech - QFusion'
				},
		{
			type: 3,
			name: 'Baidu',
			logo: 'baidu',
			link: 'https://cloud.baidu.com/product/cce.html',
			blurb: 'Baidu Cloud - Baidu Cloud Container Engine'
				},
		{
			type: 3,
			name: 'ZTE',
			logo: 'zte',
			link: 'https://sdnfv.zte.com.cn/en/home',
			blurb: 'ZTE - TECS OpenPalette'
				},
		{
			type: 1,
			name: 'Automatic Server AG',
			logo: 'asag',
			link: 'http://www.automatic-server.com/paas.html',
			blurb: 'Nous installons et exploitons Kubernetes dans de grandes entreprises, créons des flux de travail de déploiement et aidons à la migration.'
				},
		{
			type: 1,
			name: 'Circulo Siete',
			logo: 'circulo',
			link: 'https://circulosiete.com/consultoria/kubernetes/',
			blurb: 'Notre entreprise basée au Mexique propose des formations, des conseils et une assistance pour la migration de vos charges de travail vers Kubernetes, Cloud Native Microservices & Devops.'
				},
		{
			type: 1,
			name: 'DevOpsGuru',
			logo: 'devopsguru',
			link: 'http://devopsguru.ca/workshop',
			blurb: 'DevOpsGuru travaille avec les petites entreprises pour passer du physique au virtuel en conteneurisé.'
				},
		{
			type: 1,
			name: 'EIN Intelligence Co., Ltd',
			logo: 'ein',
			link: 'https://ein.io',
			blurb: 'Startups et entreprises agiles en Corée du Sud.'
				},
		{
			type: 0,
			name: 'GuardiCore',
			logo: 'guardicore',
			link: 'https://www.guardicore.com/',
			blurb: 'GuardiCore a fourni une visibilité au niveau des processus et une application des stratégies réseau sur les actifs conteneurisés sur la plateforme Kubernetes.'
				},
		{
			type: 0,
			name: 'Hedvig',
			logo: 'hedvig',
			link: 'https://www.hedviginc.com/blog/provisioning-hedvig-storage-with-kubernetes',
			blurb: 'Hedvig est un stockage défini par logiciel qui utilise NFS ou iSCSI pour les volumes persistants afin de provisionner le stockage partagé pour les pods et les conteneurs.'
				},
		{
			type: 0,
			name: 'Hewlett Packard Enterprise',
			logo: 'hpe',
			link: ' https://www.hpe.com/us/en/storage/containers.html',
			blurb: 'Stockage permanent qui rend les données aussi faciles à gérer que les conteneurs: provisioning dynamique, performances et protection basées sur des stratégies, qualité de service, etc.'
				},
		{
			type: 0,
			name: 'JetBrains',
			logo: 'jetbrains',
			link: 'https://blog.jetbrains.com/teamcity/2017/10/teamcity-kubernetes-support-plugin/',
			blurb: "Exécutez des agents de génération de cloud TeamCity dans un cluster Kubernetes. Fournit un support Helm en tant qu'étape de construction."
				},
		{
			type: 2,
			name: 'Opensense',
			logo: 'opensense',
			link: 'http://www.opensense.fr/en/kubernetes-en/',
			blurb: 'Nous fournissons des services Kubernetes (intégration, exploitation, formation) ainsi que le développement de microservices bancaires basés sur notre expérience étendue en matière de cloud de conteneurs, de microservices, de gestion de données et du secteur financier.'
				},
		{
			type: 2,
			name: 'SAP SE',
			logo: 'sap',
			link: 'https://cloudplatform.sap.com',
			blurb: "SAP Cloud Platform fournit des fonctionnalités en mémoire et des services métier uniques pour la création et l'extension d'applications. Avec Open Source Project Project, SAP utilise la puissance de Kubernetes pour offrir une expérience ouverte, robuste et multi-cloud à ses clients. Vous pouvez utiliser des principes de conception natifs en nuage simples et modernes et exploiter les compétences dont votre organisation dispose déjà pour fournir des applications agiles et transformatives, tout en s'intégrant aux dernières fonctionnalités de SAP Leonardo."
				},
		{
			type: 1,
			name: 'Mobilise Cloud Services Limited',
			logo: 'mobilise',
			link: 'https://www.mobilise.cloud/en/services/serverless-application-delivery/',
			blurb: 'Mobilize aide les organisations à adopter Kubernetes et à les intégrer à leurs outils CI / CD.'
				},
		{
			type: 3,
			name: 'AWS',
			logo: 'aws',
			link: 'https://aws.amazon.com/eks/',
			blurb: 'Amazon Elastic Container Service pour Kubernetes (Amazon EKS) est un service géré qui facilite l’exécution de Kubernetes sur AWS sans avoir à installer ni à utiliser vos propres clusters Kubernetes.'
				},
		{
			type: 3,
			name: 'Kontena',
			logo: 'kontena',
			link: 'https://pharos.sh',
			blurb: 'Kontena Pharos - La distribution simple, solide et certifiée Kubernetes qui fonctionne.'
					},
		{
			type: 2,
			name: 'NTTData',
			logo: 'nttdata',
			link: 'http://de.nttdata.com/altemista-cloud',
			blurb: 'NTT DATA, membre du groupe NTT, apporte la puissance du plus important fournisseur d’infrastructures au monde dans la communauté mondiale des K8.'
					},
		{
			type: 2,
			name: 'OCTO',
			logo: 'octo',
			link: 'https://www.octo.academy/fr/formation/275-kubernetes-utiliser-architecturer-et-administrer-une-plateforme-de-conteneurs',
			blurb: "La technologie OCTO fournit des services de formation, d'architecture, de conseil technique et de livraison, notamment des conteneurs et des Kubernetes."
					},
		{
			type: 0,
			name: 'Logdna',
			logo: 'logdna',
			link: 'https://logdna.com/kubernetes',
			blurb: 'Identifiez instantanément les problèmes de production avec LogDNA, la meilleure plate-forme de journalisation que vous utiliserez jamais. Commencez avec seulement 2 commandes kubectl.'
				}
	]

	var kcspContainer = document.getElementById('kcspContainer')
	var distContainer = document.getElementById('distContainer')
	var ktpContainer = document.getElementById('ktpContainer')
	var isvContainer = document.getElementById('isvContainer')
	var servContainer = document.getElementById('servContainer')

	var sorted = partners.sort(function (a, b) {
		if (a.name > b.name) return 1
		if (a.name < b.name) return -1
		return 0
	})

	sorted.forEach(function (obj) {
		var box = document.createElement('div')
		box.className = 'partner-box'

		var img = document.createElement('img')
		img.src = '/images/square-logos/' + obj.logo + '.png'

		var div = document.createElement('div')

		var p = document.createElement('p')
		p.textContent = obj.blurb

		var link = document.createElement('a')
		link.href = obj.link
		link.target = '_blank'
		link.textContent = 'Learn more'

		div.appendChild(p)
		div.appendChild(link)

		box.appendChild(img)
		box.appendChild(div)

		var container;
    if (obj.type === 0) {
      container = isvContainer;
    } else if (obj.type === 1) {
      container = servContainer;
    } else if (obj.type === 2) {
      container = kcspContainer;
		} else if (obj.type === 3) {
			container = distContainer;
		} else if (obj.type === 4) {
			container = ktpContainer;
		}

		container.appendChild(box)
	})
})();

;(function () {
	var partners = [
		{
			type: 0,
			name: 'Sysdig',
			logo: 'sys_dig',
			link: 'https://sysdig.com/blog/monitoring-kubernetes-with-sysdig-cloud/',
			blurb: 'Sysdig is the container intelligence company. Sysdig has created the only unified platform to deliver monitoring, security, and troubleshooting in a microservices-friendly architecture.'
		},
		{
			type: 0,
			name: 'Puppet',
			logo: 'puppet',
			link: 'https://puppet.com/blog/announcing-kream-and-new-kubernetes-helm-and-docker-modules',
			blurb: 'We\'ve developed tools and products to make your adoption of Kubernetes as efficient as possible, covering your full workflow cycle from development to production. And now Puppet Pipelines for Containers is your complete DevOps dashboard for Kubernetes.'
		},
		{
			type: 0,
			name: 'Citrix',
			logo: 'citrix',
			link: 'https://www.citrix.com/networking/microservices.html',
			blurb: 'Netscaler CPX gives app developers all the features they need to load balance their microservices and containerized apps with Kubernetes.'
		},
		{
			type: 0,
			name: 'Cockroach Labs',
			logo: 'cockroach_labs',
			link: 'https://www.cockroachlabs.com/blog/running-cockroachdb-on-kubernetes/',
			blurb: 'CockroachDB is a distributed SQL database whose built-in replication and survivability model pair with Kubernetes to truly make data easy.'
		},
		{
			type: 2,
			name: 'Weaveworks',
			logo: 'weave_works',
			link: ' https://weave.works/kubernetes',
			blurb: 'Weaveworks enables Developers and Dev/Ops teams to easily connect, deploy, secure, manage, and troubleshoot microservices in Kubernetes.'
		},
		{
			type: 0,
			name: 'Intel',
			logo: 'intel',
			link: 'https://tectonic.com/press/intel-coreos-collaborate-on-openstack-with-kubernetes.html',
			blurb: 'Powering the GIFEE (Google’s Infrastructure for Everyone Else), to run OpenStack deployments on Kubernetes.'
		},
		{
			type: 3,
			name: 'Platform9',
			logo: 'platform9',
			link: 'https://platform9.com/products/kubernetes/',
			blurb: 'Platform9 is the open source-as-a-service company that takes all of the goodness of Kubernetes and delivers it as a managed service.'
		},
		{
			type: 0,
			name: 'Datadog',
			logo: 'datadog',
			link: 'http://docs.datadoghq.com/integrations/kubernetes/',
			blurb: 'Full-stack observability for dynamic infrastructure & applications. Includes precision alerting, analytics and deep Kubernetes integrations. '
		},
		{
			type: 0,
			name: 'AppFormix',
			logo: 'appformix',
			link: 'http://www.appformix.com/solutions/appformix-for-kubernetes/',
			blurb: 'AppFormix is a cloud infrastructure performance optimization service helping enterprise operators streamline their cloud operations on any Kubernetes cloud. '
		},
		{
			type: 0,
			name: 'Crunchy',
			logo: 'crunchy',
			link: 'http://info.crunchydata.com/blog/advanced-crunchy-containers-for-postgresql',
			blurb: 'Crunchy PostgreSQL Container Suite is a set of containers for managing PostgreSQL with DBA microservices leveraging Kubernetes and Helm.'
		},
		{
			type: 0,
			name: 'Aqua',
			logo: 'aqua',
			link: 'http://blog.aquasec.com/security-best-practices-for-kubernetes-deployment',
			blurb: 'Deep, automated security for your containers running on Kubernetes.'
		},
		{
			type: 0,
			name: 'Distelli',
			logo: 'distelli',
			link: 'https://www.distelli.com/',
			blurb: 'Pipelines from your source repositories to your Kubernetes Clusters on any cloud.'
		},
		{
			type: 0,
			name: 'Nuage networks',
			logo: 'nuagenetworks',
			link: 'https://github.com/nuagenetworks/nuage-kubernetes',
			blurb: 'The Nuage SDN platform provides policy-based networking between Kubernetes Pods and non-Kubernetes environments with visibility and security monitoring.'
		},
		{
			type: 0,
			name: 'Sematext',
			logo: 'sematext',
			link: 'https://sematext.com/kubernetes/',
			blurb: 'Logging & Monitoring: Automatic collection and processing of Metrics, Events and Logs for auto-discovered pods and Kubernetes nodes.'
		},
		{
			type: 0,
			name: 'Diamanti',
			logo: 'diamanti',
			link: 'https://www.diamanti.com/products/',
			blurb: 'Diamanti deploys containers with guaranteed performance using Kubernetes in the first hyperconverged appliance purpose built for containerized applications.'
				},
		{
			type: 0,
			name: 'Aporeto',
			logo: 'aporeto',
			link: 'https://aporeto.com/trireme',
			blurb: 'Aporeto makes cloud-native applications secure by default without impacting developer velocity and works at any scale, on any cloud.'
				},
		{
  		type: 2,
 			name: 'Giant Swarm',
 			logo: 'giantswarm',
 			link: 'https://giantswarm.io',
 			blurb: 'Giant Swarm enables you to simply and rapidly create and use Kubernetes clusters on-demand either on-premises or in the cloud. Contact Giant Swarm to learn about the best way to run cloud native applications anywhere.'
 				},
		{
		 	type: 3,
		 	name: 'Giant Swarm',
		 	logo: 'giantswarm',
		 	link: 'https://giantswarm.io/product/',
		 	blurb: 'Giant Swarm enables you to simply and rapidly create and use Kubernetes clusters on-demand either on-premises or in the cloud. Contact Giant Swarm to learn about the best way to run cloud native applications anywhere.'
		 		},
		{
		 	type: 3,
			name: 'Hasura',
			logo: 'hasura',
			link: 'https://hasura.io',
			blurb: 'Hasura is a Kubernetes-based PaaS and a Postgres-based BaaS that accelerates app development with ready-to-use components.'
				},
		{
 			type: 3,
 			name: 'Mirantis',
 			logo: 'mirantis',
 			link: 'https://www.mirantis.com/software/kubernetes/',
 			blurb: 'Mirantis - Mirantis Cloud Platform'
 				},
		{
		 	type: 2,
		 	name: 'Mirantis',
		 	logo: 'mirantis',
		 	link: 'https://content.mirantis.com/Containerizing-OpenStack-on-Kubernetes-Video-Landing-Page.html',
		 	blurb: 'Mirantis builds and manages private clouds with open source software such as OpenStack, deployed as containers orchestrated by Kubernetes.'
		 		},
		{
 			type: 0,
 			name: 'Kubernetic',
 			logo: 'kubernetic',
 			link: 'https://kubernetic.com/',
 			blurb: 'Kubernetic is a Kubernetes Desktop client that simplifies and democratizes cluster management for DevOps.'
 				},
		{
			type: 1,
			name: 'Reactive Ops',
			logo: 'reactive_ops',
			link: 'https://www.reactiveops.com/the-kubernetes-experts/',
			blurb: 'ReactiveOps has written automation on best practices for infrastructure as code on GCP & AWS using Kubernetes, helping you build and maintain a world-class infrastructure at a fraction of the price of an internal hire.'
		},
		{
			type: 2,
			name: 'Livewyer',
			logo: 'livewyer',
			link: 'https://livewyer.io/services/kubernetes-experts/',
			blurb: 'Kubernetes experts that on-board applications and empower IT teams to get the most out of containerised technology.'
		},
		{
			type: 2,
			name: 'Samsung SDS',
			logo: 'samsung_sds',
			link: 'http://www.samsungsdsa.com/cloud-infrastructure_kubernetes',
			blurb: 'Samsung SDS’s Cloud Native Computing Team offers expert consulting across the range of technical aspects involved in building services targeted at a Kubernetes cluster.'
		},
		{
			type: 2,
			name: 'Container Solutions',
			logo: 'container_solutions',
			link: 'http://container-solutions.com/resources/kubernetes/',
			blurb: 'Container Solutions is a premium software consultancy that focuses on programmable infrastructure, offering our expertise in software development, strategy and operations to help you innovate at speed and scale.'
		},
		{
			type: 4,
			name: 'Container Solutions',
			logo: 'container_solutions',
			link: 'http://container-solutions.com/resources/kubernetes/',
			blurb: 'Container Solutions is a premium software consultancy that focuses on programmable infrastructure, offering our expertise in software development, strategy and operations to help you innovate at speed and scale.'
		},
		{
			type: 2,
			name: 'Jetstack',
			logo: 'jetstack',
			link: 'https://www.jetstack.io/',
			blurb: 'Jetstack is an organisation focused entirely on Kubernetes. They will help you to get the most out of Kubernetes through expert professional services and open source tooling. Get in touch, and accelerate your project.'
		},
		{
			type: 0,
			name: 'Tigera',
			logo: 'tigera',
			link: 'http://docs.projectcalico.org/latest/getting-started/kubernetes/',
			blurb: 'Tigera builds high performance, policy driven, cloud native networking solutions for Kubernetes.'
		},
		{
 			type: 1,
 			name: 'Harbur',
 			logo: 'harbur',
 			link: 'https://harbur.io/',
 			blurb: 'Based in Barcelona, Harbur is a consulting firm that helps companies deploy self-healing solutions empowered by Container technologies'
  		},
		{
 			type: 0,
 			name: 'Spotinst',
 			logo: 'spotinst',
 			link: 'http://blog.spotinst.com/2016/08/04/elastigroup-kubernetes-minions-steroids/',
 			blurb: 'Your Kubernetes For 80% Less. Run K8s workloads on Spot Instances with 100% availability to save 80% + autoscale your Kubernetes with maximum efficiency in heterogenous environments.'
  		},
		{
 			type: 2,
 			name: 'InwinSTACK',
 			logo: 'inwinstack',
 			link: 'http://www.inwinstack.com/index.php/en/solutions-en/',
 			blurb: 'Our container service leverages OpenStack-based infrastructure and its container orchestration engine Magnum to manage Kubernetes clusters.'
  		},
	{
			type: 4,
			name: 'InwinSTACK',
			logo: 'inwinstack',
			link: 'http://www.inwinstack.com/index.php/en/solutions-en/',
			blurb: 'Our container service leverages OpenStack-based infrastructure and its container orchestration engine Magnum to manage Kubernetes clusters.'
			},
		{
	 		type: 3,
	 		name: 'InwinSTACK',
	 		logo: 'inwinstack',
	 		link: 'https://github.com/inwinstack/kube-ansible',
	 		blurb: 'inwinSTACK - kube-ansible'
	  	},
		{
 			type: 1,
 			name: 'Semantix',
 			logo: 'semantix',
 			link: 'http://www.semantix.com.br/',
 			blurb: 'Semantix is a company that works with data analytics and distributed systems. Kubernetes is used to orchestrate services for our customers.'
  		},
		{
 			type: 0,
 			name: 'ASM Technologies Limited',
 			logo: 'asm',
 			link: 'http://www.asmtech.com/',
 			blurb: 'Our technology supply chain portfolio enables your software products to be accessible, viable and available more effectively.'
  		},
		{
 			type: 1,
 			name: 'InfraCloud Technologies',
 			logo: 'infracloud',
 			link: 'http://blog.infracloud.io/state-of-kubernetes/',
 			blurb: 'InfraCloud Technologies is software consultancy which provides services in Containers, Cloud and DevOps.'
  		},
		{
 			type: 0,
 			name: 'SignalFx',
 			logo: 'signalfx',
 			link: 'https://github.com/signalfx/integrations/tree/master/kubernetes',
 			blurb: 'Gain real-time visibility across metrics & the most intelligent alerts for todays architectures, including deep integration with Kubernetes'
  		},
		{
 			type: 0,
 			name: 'NATS',
 			logo: 'nats',
 			link: 'https://github.com/pires/kubernetes-nats-cluster',
 			blurb: 'NATS is a simple, secure, and scalable cloud native messaging system.'
  		},
		{
 			type: 2,
 			name: 'RX-M',
 			logo: 'rxm',
 			link: 'http://rx-m.com/training/kubernetes-training/',
 			blurb: 'Market neutral Kubernetes Dev, DevOps and Production training and consulting services.'
  		},
		{
	 		type: 4,
	 		name: 'RX-M',
	 		logo: 'rxm',
	 		link: 'http://rx-m.com/training/kubernetes-training/',
	 		blurb: 'Market neutral Kubernetes Dev, DevOps and Production training and consulting services.'
	  	},
		{
 			type: 1,
 			name: 'Emerging Technology Advisors',
 			logo: 'eta',
 			link: 'https://www.emergingtechnologyadvisors.com/services/kubernetes.html',
 			blurb: 'ETA helps companies architect, implement, and manage scalable applications using Kubernetes on public or private cloud.'
  		},
		{
 			type: 0,
 			name: 'CloudPlex.io',
 			logo: 'cloudplex',
 			link: 'http://www.cloudplex.io',
 			blurb: 'CloudPlex enables operations teams to visually deploy, orchestrate, manage, and monitor infrastructure, applications, and services in public or private cloud.'
  		},
		{
 			type: 2,
 			name: 'Kumina',
 			logo: 'kumina',
 			link: 'https://www.kumina.nl/managed_kubernetes',
 			blurb: 'Kumina combines the power of Kubernetes with 10+ years of experience in IT operations. We create, build and support fully managed Kubernetes solutions on your choice of infrastructure. We also provide consulting and training.'
  		},
		{
 			type: 0,
 			name: 'CA Technologies',
 			logo: 'ca',
 			link: 'https://docops.ca.com/ca-continuous-delivery-director/integrations/en/plug-ins/kubernetes-plug-in',
 			blurb: 'The CA Continuous Delivery Director Kubernetes plugin orchestrates deployment of containerized applications within an end-to-end release pipeline.'
  		},
		{
 			type: 0,
 			name: 'CoScale',
 			logo: 'coscale',
 			link: 'http://www.coscale.com/blog/how-to-monitor-your-kubernetes-cluster',
 			blurb: 'Full stack monitoring of containers and microservices orchestrated by Kubernetes. Powered by anomaly detection to find problems faster.'
  		},
		{
 			type: 2,
 			name: 'Supergiant.io',
 			logo: 'supergiant',
 			link: 'https://supergiant.io/blog/supergiant-packing-algorithm-unique-save-money',
 			blurb: 'Supergiant autoscales hardware for Kubernetes. Open-source, it makes HA, distributed, stateful apps easy to deploy, manage, and scale.'
  		},
		{
 			type: 0,
 			name: 'Avi Networks',
 			logo: 'avinetworks',
 			link: 'https://kb.avinetworks.com/avi-vantage-openshift-installation-guide/',
 			blurb: 'Avis elastic application services fabric provides scalable, feature rich & integrated L4-7 networking for K8S environments.'
  		},
		{
 			type: 1,
 			name: 'Codecrux web technologies pvt ltd',
 			logo: 'codecrux',
 			link: 'http://codecrux.com/kubernetes/',
 			blurb: 'At CodeCrux we help your organization get the most out of Containers and Kubernetes, regardless of where you are in your journey'
  		},
		{
 			type: 0,
 			name: 'Greenqloud',
 			logo: 'qstack',
 			link: 'https://www.qstack.com/application-orchestration/',
 			blurb: 'Qstack provides self-serviceable on-site Kubernetes clusters with an intuitive User Interface for Infrastructure and Kubernetes management.'
  		},
		{
 			type: 1,
 			name: 'StackOverdrive.io',
 			logo: 'stackoverdrive',
 			link: 'http://www.stackoverdrive.net/kubernetes-consulting/',
 			blurb: 'StackOverdrive helps organizations of all sizes leverage Kubernetes for container based orchestration and management.'
  		},
		{
 			type: 0,
 			name: 'StackIQ, Inc.',
 			logo: 'stackiq',
 			link: 'https://www.stackiq.com/kubernetes/',
 			blurb: 'With Stacki and the Stacki Pallet for Kubernetes, you can go from bare metal to containers in one step very quickly and easily.'
  		},
		{
 			type: 0,
 			name: 'Cobe',
 			logo: 'cobe',
 			link: 'https://cobe.io/product-page/',
 			blurb: 'Manage Kubernetes clusters with a live, searchable model that captures all relationships and performance data in full visualised context.'
  		},
		{
 			type: 0,
 			name: 'Datawire',
 			logo: 'datawire',
 			link: 'http://www.datawire.io',
 			blurb: 'Datawires open source tools let your microservices developers be awesomely productive on Kubernetes, while letting ops sleep at night.'
  		},
		{
 			type: 0,
 			name: 'Mashape, Inc.',
 			logo: 'kong',
 			link: 'https://getkong.org/install/kubernetes/',
 			blurb: 'Kong is a scalable open source API layer that runs in front of any RESTful API and can be provisioned to a Kubernetes cluster.'
  		},
		{
 			type: 0,
 			name: 'F5 Networks',
 			logo: 'f5networks',
 			link: 'http://github.com/f5networks',
 			blurb: 'We have a LB integration into Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'Lovable Tech',
 			logo: 'lovable',
 			link: 'http://lovable.tech/',
 			blurb: 'World class engineers, designers, and strategic consultants helping you ship Lovable web & mobile technology.'
  		},
		{
 			type: 0,
 			name: 'StackState',
 			logo: 'stackstate',
 			link: 'http://stackstate.com/platform/container-monitoring',
 			blurb: 'Operational Analytics across teams and tools. Includes topology visualization, root cause analysis and anomaly detection for Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'INEXCCO INC',
 			logo: 'inexcco',
 			link: 'https://www.inexcco.com/',
 			blurb: 'Strong DevOps and Cloud talent working with couple clients on kubernetes and helm implementations. '
  		},
		{
 			type: 2,
 			name: 'Bitnami',
 			logo: 'bitnami',
 			link: 'http://bitnami.com/kubernetes',
 			blurb: 'Bitnami brings a catalog of trusted, up to date, and easy to use applications and application building blocks to Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'Nebulaworks',
 			logo: 'nebulaworks',
 			link: 'http://www.nebulaworks.com/container-platforms',
 			blurb: 'Nebulaworks provides services to help the enterprise adopt modern container platforms and optimized processes to enable innovation at scale.'
  		},
		{
 			type: 1,
 			name: 'EASYNUBE',
 			logo: 'easynube',
 			link: 'http://easynube.co.uk/devopsnube/',
 			blurb: 'EasyNube provide architecture, implementation, and manage scalable applications using Kubernetes and Openshift.'
  		},
		{
 			type: 1,
 			name: 'Opcito Technologies',
 			logo: 'opcito',
 			link: 'http://www.opcito.com/kubernetes/',
 			blurb: 'Opcito is a software consultancy that uses Kubernetes to help organisations build, architect & deploy highly scalable applications.'
  		},
		{
 			type: 0,
 			name: 'code by Dell EMC',
 			logo: 'codedellemc',
 			link: 'https://blog.codedellemc.com',
 			blurb: 'Respected as a thought leader in storage persistence for containerized applications. Contributed significant work to K8 and Ecosystem'
			},
		{
	 		type: 0,
		 	name: 'Instana',
		 	logo: 'instana',
		 	link: 'https://www.instana.com/supported-technologies/',
		 	blurb: 'Instana monitors performance of the applications, infrastructure, containers and services deployed on a Kubernetes cluster.'
			},
		{
		 	type: 0,
			name: 'Netsil',
			logo: 'netsil',
			link: 'https://netsil.com/kubernetes/',
			blurb: 'Generate a real-time, auto-discovered application topology map! Monitor Kubernetes pods and namespaces without any code instrumentation.'
			},
		{
			type: 2,
			name: 'Treasure Data',
			logo: 'treasuredata',
			link: 'https://fluentd.treasuredata.com/kubernetes-logging/',
			blurb: 'Fluentd Enterprise brings smart, secure logging to Kubernetes, and brings integrations with backends such as Splunk, Kafka, or AWS S3.'
			},
		{
			type: 2,
			name: 'Kenzan',
			logo: 'Kenzan',
			link: 'http://kenzan.com/?ref=kubernetes',
			blurb: 'We provide custom consulting services leveraging Kubernetes as our foundation. This involves the platform development, delivery pipelines, and the application development within Kubernetes.'
			},
		{
			type: 2,
			name: 'New Context',
			logo: 'newcontext',
			link: 'https://www.newcontext.com/devsecops-infrastructure-automation-orchestration/',
			blurb: 'New Context builds and uplifts secure Kubernetes implementations and migrations, from initial design to infrastructure automation and management.'
			},
		{
			type: 2,
			name: 'Banzai',
			logo: 'banzai',
			link: 'https://banzaicloud.com/platform/',
			blurb: 'Banzai Cloud brings cloud native to the enterprise and simplifies the transition to microservices on Kubernetes.'
			},
		{
			type: 3,
			name: 'Kublr',
			logo: 'kublr',
			link: 'http://kublr.com',
			blurb: 'Kublr - Accelerate and control the deployment, scaling, monitoring and management of your containerized applications.'
			},
		{
			type: 1,
			name: 'ControlPlane',
			logo: 'controlplane',
			link: 'https://control-plane.io',
			blurb: 'We are a London-based Kubernetes consultancy with a focus on security and continuous delivery. We offer consulting & training.'
			},
		{
			type: 3,
			name: 'Nirmata',
			logo: 'nirmata',
			link: 'https://www.nirmata.com/',
			blurb: 'Nirmata - Nirmata Managed Kubernetes'
				},
		{
			type: 2,
			name: 'Nirmata',
			logo: 'nirmata',
			link: 'https://www.nirmata.com/',
			blurb: 'Nirmata is a software platform that helps DevOps teams deliver enterprise-grade and cloud-provider agnostic Kubernetes based container management solutions.'
				},
		{
			type: 3,
			name: 'TenxCloud',
			logo: 'tenxcloud',
			link: 'https://tenxcloud.com',
			blurb: 'TenxCloud - TenxCloud Container Engine (TCE)'
				},
		{
			type: 2,
			name: 'TenxCloud',
			logo: 'tenxcloud',
			link: 'https://www.tenxcloud.com/',
			blurb: 'Founded in October 2014, TenxCloud is a leading enterprise container cloud computing service provider in China, covering the areas such as container PaaS cloud platform, micro-service management, DevOps, development test, AIOps and so on. Provide private cloud PaaS products and solutions for financial, energy, operator, manufacturing, education and other industry customers.'
				},
		{
			type: 0,
			name: 'Twistlock',
			logo: 'twistlock',
			link: 'https://www.twistlock.com/',
			blurb: 'Security at Kubernetes Scale: Twistlock allows you to deploy fearlessly with assurance that your images and containers are free of vulnerabilities and protected at runtime.'
				},
		{
			type: 0,
			name: 'Endocode AG',
			logo: 'endocode',
			link: 'https://endocode.com/kubernetes/',
 			blurb: 'Endocode practices and teaches the open source way. Kernel to cluster - Dev to Ops. We offer Kubernetes trainings, services and support.'
			},
		{
			type: 2,
			name: 'Accenture',
			logo: 'accenture',
			link: 'https://www.accenture.com/us-en/service-application-containers',
	 		blurb: 'Architecture, implementation and operation of world-class Kubernetes solutions for cloud-native clients.'
			},
		{
			type: 1,
			name: 'Biarca',
			logo: 'biarca',
			link: 'http://biarca.io/',
		 	blurb: 'Biarca is a cloud services provider and key focus areas Key areas of focus for Biarca include Cloud Adoption Services, Infrastructure Services, DevOps Services and Application Services. Biarca leverages Kubernetes to deliver containerized solutions.'
			},
		{
			type: 2,
			name: 'Claranet',
			logo: 'claranet',
			link: 'http://www.claranet.co.uk/hosting/google-cloud-platform-consulting-managed-services',
			blurb: 'Claranet helps people migrate to the cloud and take full advantage of the new world it offers. We consult, design, build and proactively manage the right infrastructure and automation tooling for clients to achieve this.'
			},
		{
			type: 1,
			name: 'CloudKite',
			logo: 'cloudkite',
			link: 'https://cloudkite.io/',
			blurb: 'CloudKite.io helps companies build and maintain highly automated, resilient, and impressively performing software on Kubernetes.'
			},
		{
			type: 2,
			name: 'CloudOps',
			logo: 'CloudOps',
			link: 'https://www.cloudops.com/services/docker-and-kubernetes-workshops/',
			blurb: 'CloudOps gets you hands-on with the K8s ecosystem via workshop/lab. Get prod ready K8s in cloud(s) of your choice with our managed services.'
			},
		{
			type: 2,
			name: 'Ghostcloud',
			logo: 'ghostcloud',
			link: 'https://www.ghostcloud.cn/ecos-kubernetes',
			blurb: 'EcOS is an enterprise-grade PaaS / CaaS based on Docker and Kubernetes, which makes it easier to configure, deploy and manage containerized applications.'
			},
		{
			type: 3,
			name: 'Ghostcloud',
			logo: 'ghostcloud',
			link: 'https://www.ghostcloud.cn/ecos-kubernetes',
			blurb: 'EcOS is an enterprise-grade PaaS / CaaS based on Docker and Kubernetes, which makes it easier to configure, deploy and manage containerized applications.'
			},
		{
			type: 2,
			name: 'Contino',
			logo: 'contino',
			link: 'https://www.contino.io/',
			blurb: 'We help enterprise organizations adopt DevOps, containers and cloud computing. Contino is a global consultancy that enables regulated organizations to accelerate innovation through the adoption of modern approaches to software delivery.'
			},
		{
			type: 2,
			name: 'Booz Allen Hamilton',
			logo: 'boozallenhamilton',
			link: 'https://www.boozallen.com/',
			blurb: 'Booz Allen partners with public and private sector clients to solve their most difficult challenges through a combination of consulting, analytics, mission operations, technology, systems delivery, cybersecurity, engineering, and innovation expertise.'
			},
		{
			type: 1,
			name: 'BigBinary',
			logo: 'bigbinary',
			link: 'http://blog.bigbinary.com/categories/Kubernetes',
			blurb: 'Provider of Digital Solutions for federal and commercial clients, to include DevSecOps, cloud platforms, transformation strategy, cognitive solutions, and UX.'
				},
		{
			type: 0,
			name: 'CloudPerceptions',
			logo: 'cloudperceptions',
			link: 'https://www.meetup.com/Triangle-Kubernetes-Meetup/files/',
			blurb: 'Container security solution for small-to-medium size enterprises who plan to run Kubernetes on shared infrastructure.'
				},
		{
			type: 2,
			name: 'Creationline, Inc.',
			logo: 'creationline',
			link: 'https://www.creationline.com/ci',
			blurb: 'Total solution for container based IT resource management.'
				},
		{
			type: 0,
			name: 'DataCore Software',
			logo: 'datacore',
			link: 'https://www.datacore.com/solutions/virtualization/containerization',
			blurb: 'DataCore provides highly-available, high-performance universal block storage for Kubernetes, radically improving the speed of deployment.'
				},
		{
			type: 0,
			name: 'Elastifile',
			logo: 'elastifile',
			link: 'https://www.elastifile.com/stateful-containers',
			blurb: 'Elastifile’s cross-cloud data fabric delivers elastically scalable, high performance, software-defined persistent storage for Kubernetes.'
				},
		{
			type: 0,
			name: 'GitLab',
			logo: 'gitlab',
			link: 'https://about.gitlab.com/2016/11/14/idea-to-production/',
			blurb: 'With GitLab and Kubernetes, you can deploy a complete CI/CD pipeline with multiple environments, automatic deployments, and automatic monitoring.'
				},
		{
			type: 0,
			name: 'Gravitational, Inc.',
			logo: 'gravitational',
			link: 'https://gravitational.com/telekube/',
			blurb: 'Telekube combines Kubernetes with Teleport, our modern SSH server, so operators can remotely manage a multitude of K8s application deployments.'
				},
		{
			type: 0,
			name: 'Hitachi Data Systems',
			logo: 'hitachi',
			link: 'https://www.hds.com/en-us/products-solutions/application-solutions/unified-compute-platform-with-kubernetes-orchestration.html',
			blurb: 'Build the Applications You Need to Drive Your Business - DEVELOP AND DEPLOY APPLICATIONS FASTER AND MORE RELIABLY.'
				},
		{
			type: 1,
			name: 'Infosys Technologies',
			logo: 'infosys',
			link: 'https://www.infosys.com',
			blurb: 'Monolithic to microservices on openshift is a offering that we are building as part of open source practice.'
				},
		{
			type: 0,
			name: 'JFrog',
			logo: 'jfrog',
			link: 'https://www.jfrog.com/use-cases/12584/',
			blurb: 'You can use Artifactory to store and manage all of your application’s container images and deploy to Kubernetes and setup a build, test, deploy pipeline using Jenkins and Artifactory. Once an image is ready to be rolled out, Artifactory can trigger a rolling-update deployment into a Kubernetes cluster without downtime – automatically!'
				},
		{
			type: 0,
			name: 'Navops by Univa',
			logo: 'navops',
			link: 'https://www.navops.io',
			blurb: 'Navops is a suite of products that enables enterprises to take full advantage of Kubernetes and provides the ability to quickly and efficiently run containers at scale.'
				},
		{
			type: 0,
			name: 'NeuVector',
			logo: 'neuvector',
			link: 'http://neuvector.com/solutions-for-kubernetes-security/',
			blurb: 'NeuVector delivers an application and network intelligent container network security solution integrated with and optimized for Kubernetes.'
				},
		{
			type: 1,
			name: 'OpsZero',
			logo: 'opszero',
			link: 'https://www.opszero.com/kubernetes.html',
			blurb: 'opsZero provides DevOps for Startups. We build and service your Kubernetes and Cloud Infrastructure to accelerate your release cycle.'
				},
		{
			type: 1,
			name: 'Shiwaforce.com Ltd.',
			logo: 'shiwaforce',
			link: 'https://www.shiwaforce.com/en/',
			blurb: 'Shiwaforce.com is the Agile Partner in Digital Transformation. Our solutions follow business changes quickly, easily and cost-effectively.'
				},
		{
			type: 1,
			name: 'SoftServe',
			logo: 'softserve',
			link: 'https://www.softserveinc.com/en-us/blogs/kubernetes-travis-ci/',
			blurb: 'SoftServe allows its clients to adopt modern application design patterns and benefit from fully integrated, highly available, cost effective Kubernetes clusters at any scale.'
				},
		{
			type: 1,
			name: 'Solinea',
			logo: 'solinea',
			link: 'https://www.solinea.com/cloud-consulting-services/container-microservices-offerings',
			blurb: 'Solinea is a digital transformation consultancy that enables businesses to build innovative solutions by adopting cloud native computing.'
				},
		{
			type: 1,
			name: 'Sphere Software, LLC',
			logo: 'spheresoftware',
			link: 'https://sphereinc.com/kubernetes/',
			blurb: 'The Sphere Software team of experts allows customers to architect and implement scalable applications using Kubernetes in Google Cloud, AWS, and Azure.'
				},
		{
			type: 1,
			name: 'Altoros',
			logo: 'altoros',
			link: 'https://www.altoros.com/container-orchestration-tools-enablement.html',
			blurb: 'Deployment and configuration of Kubernetes, Optimization of existing solutions, training for developers on using Kubernetes, support.'
				},
		{
			type: 0,
			name: 'Cloudbase Solutions',
			logo: 'cloudbase',
			link: 'https://cloudbase.it/kubernetes',
			blurb: 'Cloudbase Solutions provides Kubernetes cross-cloud interoperability for Windows and Linux deployments based on open source technologies.'
				},
		{
			type: 0,
			name: 'Codefresh',
			logo: 'codefresh',
			link: 'https://codefresh.io/kubernetes-deploy/',
			blurb: 'Codefresh is a complete DevOps platform built for containers and Kubernetes. With CI/CD pipelines, image management, and deep integrations into Kubernetes and Helm.'
				},
		{
			type: 0,
			name: 'NetApp',
			logo: 'netapp',
			link: 'http://netapp.io/2016/12/23/introducing-trident-dynamic-persistent-volume-provisioner-kubernetes/',
			blurb: 'Dynamic provisioning and persistent storage support.'
				},
		{
			type: 0,
			name: 'OpenEBS',
			logo: 'OpenEBS',
			link: 'https://openebs.io/',
 			blurb: 'OpenEBS is containerized storage for containers integrated tightly into Kubernetes and based on distributed block storage and containerization of storage control. OpenEBS derives intent from K8s and other YAML or JSON such as per container QoS SLAs, tiering and replica policies, and more. OpenEBS is EBS API compliant.'
				},
		{
			type: 3,
			name: 'Google Kubernetes Engine',
			logo: 'google',
			link: 'https://cloud.google.com/kubernetes-engine/',
			blurb: 'Google - Google Kubernetes Engine'
				},
		{
			type: 1,
			name: 'Superorbital',
			logo: 'superorbital',
			link: 'https://superorbit.al/workshops/kubernetes/',
			blurb: 'Helping companies navigate the Cloud Native waters through Kubernetes consulting and training.'
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
			blurb: 'Red Hat - OpenShift Online and OpenShift Container Platform'
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
			blurb: 'The Canonical Distribution of Kubernetes enables you to operate Kubernetes clusters on demand on any major public cloud and private infrastructure.'
				},
		{
			type: 2,
			name: 'Canonical',
			logo: 'canonical',
			link: 'https://www.ubuntu.com/kubernetes',
			blurb: 'Canonical Ltd. - Canonical Distribution of Kubernetes'
				},
		{
			type: 3,
			name: 'Cisco',
			logo: 'cisco',
			link: 'https://www.cisco.com',
			blurb: 'Cisco Systems - Cisco Container Platform'
				},
		{
			type: 3,
			name: 'Cloud Foundry',
			logo: 'cff',
			link: 'https://www.cloudfoundry.org/container-runtime/',
			blurb: 'Cloud Foundry - Cloud Foundry Container Runtime'
				},
		{
			type: 3,
			name: 'IBM',
			logo: 'ibm',
			link: 'https://www.ibm.com/cloud/container-service',
			blurb: 'IBM - IBM Cloud Kubernetes Service'
				},
		{
			type: 2,
			name: 'IBM',
			logo: 'ibm',
			link: 'https://www.ibm.com/cloud-computing/bluemix/containers',
			blurb: 'The IBM Bluemix Container Service combines Docker and Kubernetes to deliver powerful tools, an intuitive user experiences, and built-in security and isolation to enable rapid delivery of applications all while leveraging Cloud Services including cognitive capabilities from Watson.'
				},
		{
			type: 3,
			name: 'Samsung',
			logo: 'samsung_sds',
			link: 'https://github.com/samsung-cnct/kraken',
			blurb: 'Samsung SDS - Kraken'
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
			blurb: 'Kinvolk - kube-spawn'
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
			blurb: 'Heptio helps businesses of all sizes get closer to the vibrant Kubernetes community.'
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
			blurb: 'StackPointCloud offers a wide range of support plans for managed Kubernetes clusters built through its universal control plane for Kubernetes Anywhere.'
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
			blurb: 'Founded by ex-Googlers,and early Kubernetes contributors, Caicloud leverages Kubernetes to provide container products which have successfully served Fortune 500 enterprises, and  further utilizes Kubernetes as a vehicle to deliver ultra-speed deep learning experience.'
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
			blurb: 'FusionStage is an enterprise-grade Platform as a Service product, the core of which is based on mainstream open source container technology including Kubernetes and Docker.'
				},
		{
			type: 3,
			name: 'Google',
			logo: 'google',
			link: 'https://github.com/kubernetes/kubernetes/tree/master/cluster',
			blurb: 'Google - kube-up.sh on Google Compute Engine'
				},
		{
			type: 3,
			name: 'Poseidon',
			logo: 'poseidon',
			link: 'https://typhoon.psdn.io/',
			blurb: 'Poseidon - Typhoon'
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
			blurb: 'Loodse provides Kubernetes training & consulting, and host related events regularly across Europe.'
				},
		{
			type: 4,
			name: 'Loodse',
			logo: 'loodse',
			link: 'https://loodse.com',
			blurb: 'Loodse provides Kubernetes training & consulting, and host related events regularly across Europe.'
				},
		{
			type: 4,
			name: 'LF Training',
			logo: 'lf-training',
			link: 'https://training.linuxfoundation.org/',
			blurb: 'The Linux Foundation’s training program combines the broad, foundational knowledge with the networking opportunities that attendees need to thrive in their careers today.'
				},
		{
			type: 3,
			name: 'Loodse',
			logo: 'loodse',
			link: 'https://loodse.com',
			blurb: 'Loodse - Kubermatic Container Engine'
				},
		{
			type: 1,
			name: 'LTI',
			logo: 'lti',
			link: 'https://www.lntinfotech.com/',
			blurb: 'LTI helps enterprises architect, develop and support scalable cloud native apps using Docker and Kubernetes for private or public cloud.'
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
			blurb: 'Oracle -  Oracle Terraform Kubernetes Installer'
				},
		{
			type: 3,
			name: 'Mesosphere',
			logo: 'mesosphere',
			link: 'https://mesosphere.com/kubernetes/',
			blurb: 'Mesosphere -  Kubernetes on DC/OS'
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
			blurb: 'SAP - Cloud Platform - Gardener (not yet released)'
				},
		{
			type: 3,
			name: 'Oracle',
			logo: 'oracle',
			link: 'https://www.oracle.com/linux/index.html',
			blurb: 'Oracle - Oracle Linux Container Services for use with Kubernetes'
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
			blurb: 'Tectonic is the enterprise-ready Kubernetes product, by CoreOS. It adds key features to allow you to manage, update, and control clusters in production.'
				},
		{
			type: 3,
			name: 'Weaveworks',
			logo: 'weave_works',
			link: '/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/',
			blurb: 'Weaveworks - kubeadm'
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
			blurb: 'Wise2C Technology - WiseCloud'
				},
		{
			type: 2,
			name: 'Wise2c',
			logo: 'wise2c',
			link: 'http://www.wise2c.com',
			blurb: 'Using Kubernetes to providing IT continuous delivery and Enterprise grade container management solution to Financial Industry.'
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
			blurb: 'We provide enterprise-level cloud native application platform that supports both Kubernetes and Docker Swarm.'
				},
		{
			type: 4,
			name: 'Daocloud',
			logo: 'daocloud',
			link: 'http://www.daocloud.io/dce',
			blurb: 'We provide enterprise-level cloud native application platform that supports both Kubernetes and Docker Swarm.'
				},
		{
			type: 3,
			name: 'SUSE',
			logo: 'suse',
			link: 'https://www.suse.com/products/caas-platform/',
			blurb: 'SUSE - SUSE CaaS (Container as a Service) Platform'
				},
		{
			type: 3,
			name: 'Pivotal',
			logo: 'pivotal',
			link: 'https://cloud.vmware.com/pivotal-container-service',
			blurb: 'Pivotal/VMware - Pivotal Container Service (PKS)'
				},
		{
			type: 3,
			name: 'VMware',
			logo: 'vmware',
			link: 'https://cloud.vmware.com/pivotal-container-service',
			blurb: 'Pivotal/VMware - Pivotal Container Service (PKS)'
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
			blurb: 'Alauda provides Kubernetes-Centric Enterprise Platform-as-a-Service offerings with a razor focus on delivering Cloud Native capabilities and DevOps best practices to enterprise customers across industries in China.'
				},
		{
			type: 2,
			name: 'Alauda',
			logo: 'alauda',
			link: 'www.alauda.io',
			blurb: 'Alauda provides Kubernetes-Centric Enterprise Platform-as-a-Service offerings with a razor focus on delivering Cloud Native capabilities and DevOps best practices to enterprise customers across industries in China.'
				},
		{
			type: 3,
			name: 'EasyStack',
			logo: 'easystack',
			link: 'https://easystack.cn/eks/',
			blurb: 'EasyStack - EasyStack Kubernetes Service (EKS)'
				},
		{
			type: 3,
			name: 'CoreOS',
			logo: 'coreos',
			link: 'https://coreos.com/tectonic/',
			blurb: 'CoreOS - Tectonic'
				},
		{
			type: 0,
			name: 'GoPaddle',
			logo: 'gopaddle',
			link: 'https://gopaddle.io',
			blurb: 'goPaddle is a DevOps platform for Kubernetes developers. It simplifies the Kubernetes Service creation and maintenance through source to image conversion, build & version management, team management, access controls and audit logs, single click provision of Kubernetes Clusters across multiple clouds from a single console.'
				},
		{
			type: 0,
			name: 'Vexxhost',
			logo: 'vexxhost',
			link: 'https://vexxhost.com/public-cloud/container-services/kubernetes/',
			blurb: 'VEXXHOST offers a high-performance container management service powered by Kubernetes and OpenStack Magnum.'
				},
		{
			type: 1,
			name: 'Component Soft',
			logo: 'componentsoft',
			link: 'https://www.componentsoft.eu/?p=3925',
			blurb: 'Component Soft offers training, consultation and support around open cloud technologies like Kubernetes, Docker, Openstack and Ceph.'
				},
		{
			type: 0,
			name: 'Datera',
			logo: 'datera',
			link: 'http://www.datera.io/kubernetes/',
			blurb: 'Datera delivers high performance, self-managing elastic block storage with self-service provisioning for deploying Kubernetes at scale.'
				},
		{
			type: 0,
			name: 'Containership',
			logo: 'containership',
			link: 'https://containership.io/',
			blurb: 'Containership is a cloud agnostic managed kubernetes offering that supports automatic provisioning on over 14 cloud providers.'
				},
		{
			type: 0,
			name: 'Pure Storage',
			logo: 'pure_storage',
			link: 'https://hub.docker.com/r/purestorage/k8s/',
			blurb: 'Our flexvol driver and dynamic provisioner allow FlashArray/Flashblade storage devices to be consumed as first class persistent storage from within Kubernetes.'
				},
		{
			type: 0,
			name: 'Elastisys',
			logo: 'elastisys',
			link: 'https://elastisys.com/kubernetes/',
			blurb: 'Predictive autoscaling - detects recurring workload variations, irregular traffic spikes, and everything in between. Runs K8s in any public or private cloud.'
				},
		{
			type: 0,
			name: 'Portworx',
			logo: 'portworx',
			link: 'https://portworx.com/use-case/kubernetes-storage/',
			blurb: 'With Portworx, you can manage any database or stateful service on any infrastructure using Kubernetes. You get a single data management layer for all of your stateful services, no matter where they run.'
				},
		{
			type: 1,
			name: 'Object Computing, Inc.',
			logo: 'objectcomputing',
			link: 'https://objectcomputing.com/services/software-engineering/devops/kubernetes-services',
			blurb: 'Our portfolio of DevOps consulting services includes Kubernetes support, development, and training.'
				},
		{
			type: 1,
			name: 'Isotoma',
			logo: 'isotoma',
			link: 'https://www.isotoma.com/blog/2017/10/24/containerisation-tips-for-using-kubernetes-with-aws/',
			blurb: 'Based in the North of England, Amazon partners who are delivering Kubernetes solutions on AWS for replatforming and native development.'
				},
		{
			type: 1,
			name: 'Servian',
			logo: 'servian',
			link: 'https://www.servian.com/cloud-and-technology/',
			blurb: 'Based in Australia, Servian provides advisory, consulting and managed services to support both application and data centric kubernetes use cases.'
				},
		{
			type: 1,
			name: 'Redzara',
			logo: 'redzara',
			link: 'http://redzara.com/cloud-service',
			blurb: 'Redzara has wide and in-depth experience in Cloud automation, now taking one giant step by providing container service offering and services to our customers.'
				},
		{
			type: 0,
			name: 'Dataspine',
			logo: 'dataspine',
			link: 'http://dataspine.xyz/',
			blurb: 'Dataspine is building a secure, elastic and serverless deployment platform for production ML/AI workloads on top of k8s.'
				},
		{
			type: 1,
			name: 'CloudBourne',
			logo: 'cloudbourne',
			link: 'https://cloudbourne.com/kubernetes-enterprise-hybrid-cloud/',
			blurb: 'Want to achieve maximum build, deploy and monitoring automation using Kubernetes? We can help.'
				},
		{
			type: 0,
			name: 'CloudBourne',
			logo: 'cloudbourne',
			link: 'https://cloudbourne.com/',
			blurb: 'Our AppZ Hybrid Cloud Platform can help you achieve your digital transformation goals using the powerful Kubernetes.'
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
			blurb: 'Naitways is an Operator (AS57119), Integrator and Cloud Services Provider (our own !). We aim to provide value-added services through our mastering of the whole value chain (Infrastructure, Network, Human skills). Private and Public Cloud is available through Kubernetes managed or unmanaged.'
				},
		{
			type: 2,
			name: 'Kinvolk',
			logo: 'kinvolk',
			link: 'https://kinvolk.io/kubernetes/',
			blurb: 'Kinvolk offers Kubernetes engineering & operations support from cluster to kernel. Leading cloud-native organizations turn to Kinvolk for deep-stack Linux expertise.'
				},
		{
			type: 1,
			name: 'Cascadeo Corporation',
			logo: 'cascadeo',
			link: 'http://www.cascadeo.com/',
			blurb: 'Cascadeo designs, implements, and manages containerized workloads with Kubernetes, for both existing applications and greenfield development projects.'
				},
		{
			type: 1,
			name: 'Elastisys AB',
			logo: 'elastisys',
			link: 'https://elastisys.com/services/#kubernetes',
			blurb: 'We design, build, and operate Kubernetes clusters. We are experts in highly available and self-optimizing Kubernetes infrastructures'
				},
		{
			type: 1,
			name: 'Greenfield Guild',
			logo: 'greenfield',
			link: 'http://greenfieldguild.com/',
			blurb: 'The Greenfield Guild builds quality open source solutions on, and offers training and support for, Kubernetes in any environment.'
				},
		{
			type: 1,
			name: 'PolarSeven',
			logo: 'polarseven',
			link: 'https://polarseven.com/what-we-do/kubernetes/',
			blurb: 'To get started up and running with Kubernetes (K8s) our PolarSeven consultants can help you with creating a fully functional dockerized environment to run and deploy your applications.'
				},
		{
			type: 1,
			name: 'Kloia',
			logo: 'kloia',
			link: 'https://kloia.com/kubernetes/',
			blurb: 'Kloia is DevOps and Microservices Consultancy company that helps its customers to migrate their environment to cloud platforms for enabling more scalable and secure environments. We use Kubernetes to provide our customers all-in-one solutions in an cloud-agnostic way.'
				},
		{
			type: 0,
			name: 'Bluefyre',
			logo: 'bluefyre',
			link: 'https://www.bluefyre.io',
			blurb: 'Bluefyre offers a developer-first security platform that is native to Kubernetes. Bluefyre helps your development team ship secure code on Kubernetes faster!'
				},
		{
			type: 0,
			name: 'Harness',
			logo: 'harness',
			link: 'https://harness.io/harness-continuous-delivery/secret-sauce/smart-automation/',
			blurb: 'Harness offers Continuous Delivery As-A-Service will full support for containerized apps and Kubernetes clusters.'
				},
		{
			type: 0,
			name: 'VMware - Wavefront',
			logo: 'wavefront',
			link: 'https://www.wavefront.com/solutions/container-monitoring/',
			blurb: 'The Wavefront platform provides metrics-driven analytics and monitoring for  Kubernetes and container dashboards for DevOps and developer teams delivering visibility into high-level services as well as granular container metrics.'
				},
		{
			type: 0,
			name: 'Bloombase, Inc.',
			logo: 'bloombase',
			link: 'https://www.bloombase.com/go/kubernetes',
			blurb: 'Bloombase provides high bandwidth, defense-in-depth data-at-rest encryption to lock down Kubernetes crown-jewels at scale.'
				},
		{
			type: 0,
			name: 'Kasten',
			logo: 'kasten',
			link: 'https://kasten.io/product/',
			blurb: 'Kasten provides enterprise solutions specifically built to address the operational complexity of data management in cloud-native environments.'
				},
		{
			type: 0,
			name: 'Humio',
			logo: 'humio',
			link: 'https://humio.com',
			blurb: 'Humio is a log aggregation database. We offer a Kubernetes integration that will give you insights to your logs across apps and instances.'
				},
		{
			type: 0,
			name: 'Outcold Solutions LLC',
			logo: 'outcold',
			link: 'https://www.outcoldsolutions.com/#monitoring-kubernetes',
			blurb: 'Powerful Certified Splunk applications for Monitoring OpenShift, Kubernetes and Docker.'
				},
		{
			type: 0,
			name: 'SysEleven GmbH',
			logo: 'syseleven',
			link: 'http://www.syseleven.de/',
			blurb: 'Enterprise Customers who are in need of bulletproof operations (High Performance E-Commerce and Enterprise Portals)'
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
			blurb: 'Redis Enterprise extends open source Redis and delivers stable high performance and linear scaling required for building microservices on the Kubernetes platform.'
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
			blurb: 'We install and operate Kubernetes in big enterprises, create deployment workflows and help to migrate.'
				},
		{
			type: 1,
			name: 'Circulo Siete',
			logo: 'circulo',
			link: 'https://circulosiete.com/consultoria/kubernetes/',
			blurb: 'We are a Mexico based company offering training, consulting and support to migrate your workloads to Kubernetes, Cloud Native Microservices & Devops.'
				},
		{
			type: 1,
			name: 'DevOpsGuru',
			logo: 'devopsguru',
			link: 'http://devopsguru.ca/workshop',
			blurb: 'DevOpsGuru work with small business to transform from physical to virtual to containerization.'
				},
		{
			type: 1,
			name: 'EIN Intelligence Co., Ltd',
			logo: 'ein',
			link: 'https://ein.io',
			blurb: 'Startups and agile enterprises in South Korea.'
				},
		{
			type: 0,
			name: 'GuardiCore',
			logo: 'guardicore',
			link: 'https://www.guardicore.com/',
			blurb: 'GuardiCore provided process level visibility and network policy enforcement on containerized assets on the Kubernetes platform.'
				},
		{
			type: 0,
			name: 'Hedvig',
			logo: 'hedvig',
			link: 'https://www.hedviginc.com/blog/provisioning-hedvig-storage-with-kubernetes',
			blurb: 'Hedvig is software-defined storage that uses NFS or iSCSI for persistent volumes for provisioning shared storage for pods and containers.'
				},
		{
			type: 0,
			name: 'Hewlett Packard Enterprise',
			logo: 'hpe',
			link: ' https://www.hpe.com/us/en/storage/containers.html',
			blurb: 'Persistent Storage that makes data as easy to manage as containers: dynamic provisioning, policy-based performance & protection, QoS, & more.'
				},
		{
			type: 0,
			name: 'JetBrains',
			logo: 'jetbrains',
			link: 'https://blog.jetbrains.com/teamcity/2017/10/teamcity-kubernetes-support-plugin/',
			blurb: 'Run TeamCity cloud build agents in a Kubernetes cluster. Provides Helm support as a build step.'
				},
		{
			type: 2,
			name: 'Opensense',
			logo: 'opensense',
			link: 'http://www.opensense.fr/en/kubernetes-en/',
			blurb: 'We provide Kubernetes services (integration, operation, training) as well as development of banking microservices based on our extended experience with cloud of containers, microservices, data management and financial sector.'
				},
		{
			type: 2,
			name: 'SAP SE',
			logo: 'sap',
			link: 'https://cloudplatform.sap.com',
			blurb: 'The SAP Cloud Platform provides in-memory capabilities and unique business services for building and extending applications. With open sourced Project Gardener, SAP utilizes the power of Kubernetes to enable an open, robust, multi-cloud experience for our customers. You can use simple, modern cloud native design principles and leverage skills your organization already has to deliver agile and transformative applications, while integrating with the latest SAP Leonardo business features.'
				},
		{
			type: 1,
			name: 'Mobilise Cloud Services Limited',
			logo: 'mobilise',
			link: 'https://www.mobilise.cloud/en/services/serverless-application-delivery/',
			blurb: 'Mobilise helps organisations adopt Kubernetes and integrate with their CI/CD tooling.'
				},
		{
			type: 3,
			name: 'AWS',
			logo: 'aws',
			link: 'https://aws.amazon.com/eks/',
			blurb: 'Amazon Elastic Container Service for Kubernetes (Amazon EKS) is a managed service that makes it easy for you to run Kubernetes on AWS without needing to install and operate your own Kubernetes clusters.'
				},
		{
			type: 3,
			name: 'Kontena',
			logo: 'kontena',
			link: 'https://pharos.sh',
			blurb: 'Kontena Pharos - The simple, solid, certified Kubernetes distribution that just works.'
					},
		{
			type: 2,
			name: 'NTTData',
			logo: 'nttdata',
			link: 'http://de.nttdata.com/altemista-cloud',
			blurb: 'NTT DATA, a member of the NTT Group, brings the power of the worlds leading infrastructure provider in the global K8s community.'
					},
		{
			type: 2,
			name: 'OCTO',
			logo: 'octo',
			link: 'https://www.octo.academy/fr/formation/275-kubernetes-utiliser-architecturer-et-administrer-une-plateforme-de-conteneurs',
			blurb: 'OCTO technology provides training, architecture, technical consulting and delivery services including containers and Kubernetes.'
					},
		{
			type: 0,
			name: 'Logdna',
			logo: 'logdna',
			link: 'https://logdna.com/kubernetes',
			blurb: 'Pinpoint production issues instantly with LogDNA, the best logging platform you will ever use. Get started with only 2 kubectl commands.'
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

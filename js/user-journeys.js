$( document ).ready(function() {

  var info = {
    users: {
      app_developer: {
        label: "Application Developer",
        foundational: [
          {
            label: "Setup a development environment.",
            url: "/docs/user-journeys/application_developer-foundational.html#1"
          },
          {
            label: "Deploy, scale, and update an application.",
            url: "/docs/user-journeys/application_developer-foundational.html#2"
          },
          {
            label: "Understand Kubernetes basics, such as Containers, Pods, Labels and Annotations.",
            url: "/docs/user-journeys/application_developer-foundational.html#3"
          }
        ],
        intermediate: [
          {
            label: "Setup a full-featured or production environment.",
            url: "/docs/user-journeys/application_developer-intermediate.html#1"
          },
          {
            label: "Work with commonly used features, such as Service Discovery, Networking, and ReplicaSets.",
            url: "/docs/user-journeys/application_developer-intermediate.html#2"
          },
          {
            label: "Understand key concepts, such as the API/Controller pattern, Schedulers, and Node Affinity.",
            url: "/docs/user-journeys/application_developer-intermediate.html#3"
          }
        ],
        advanced: [
          {
            label: "Setup federated clusters.",
            url: "/docs/user-journeys/application_developer-advanced.html#1"
          },
          {
            label: "Deploy an application with advanced features, such as StatefulSets, DaemonSets, and Jobs.",
            url: "/docs/user-journeys/application_developer-advanced.html#2"
          },
          {
            label: "Explore advanced topics, such as Storage Solutions, Custom Resources, and Pod Disruptions.",
            url: "/docs/user-journeys/application_developer-advanced.html#3"
          }
        ]
      },
      app_architect: {
        label: "Application Architect",
        foundational: [
          "b1: foundational stuff",
          "b2: foundational stuff",
          "b3: foundational stuff"
        ],
        intermediate: [
          "b1: intermediate stuff",
          "b2: intermediate stuff",
          "b3: intermediate stuff"
        ],
        advanced: [
          "b1: advanced stuff",
          "b2: advanced stuff",
          "b3: advanced stuff"
        ]
      },
      cluster_operator: {
        label: "Cluster Operator",
        foundational: [
          "c1: foundational stuff",
          "c2: foundational stuff",
          "c3: foundational stuff"
        ],
        intermediate: [
          "c1: intermediate stuff",
          "c2: intermediate stuff",
          "c3: intermediate stuff"
        ],
        advanced: [
          "c1: advanced stuff",
          "c2: advanced stuff",
          "c3: advanced stuff"
        ]
      },
      cluster_architect: {
        label: "Cluster Architect",
        foundational: [
          "d1: foundational stuff",
          "d2: foundational stuff",
          "d3: foundational stuff"
        ],
        intermediate: [
          "d1: intermediate stuff",
          "d2: intermediate stuff",
          "d3: intermediate stuff"
        ],
        advanced: [
          "d1: advanced stuff",
          "d2: advanced stuff",
          "d3: advanced stuff"
        ]
      },
      network_engineer: {
        label: "Network Engineer",
        foundational: [
          "e1: foundational stuff",
          "e2: foundational stuff",
          "e3: foundational stuff"
        ],
        intermediate: [
          "e1: intermediate stuff",
          "e2: intermediate stuff",
          "e3: intermediate stuff"
        ],
        advanced: [
          "e1: advanced stuff",
          "e2: advanced stuff",
          "e3: advanced stuff"
        ]
      },
      platform_developer: {
        label: "Platform Developer",
        foundational: [
          "f1: foundational stuff",
          "f2: foundational stuff",
          "f3: foundational stuff"
        ],
        intermediate: [
          "f1: intermediate stuff",
          "f2: intermediate stuff",
          "f3: intermediate stuff"
        ],
        advanced: [
          "f1: advanced stuff",
          "f2: advanced stuff",
          "f3: advanced stuff"
        ]
      }
    },
    contributors: {
      code_contributor: {
        label: "Code Contributor",
        foundational: [
          "a1: foundational stuff",
          "a2: foundational stuff",
          "a3: foundational stuff"
        ],
        intermediate: [
          "a1: intermediate stuff",
          "a2: intermediate stuff",
          "a3: intermediate stuff"
        ],
        advanced: [
          "a1: advanced stuff",
          "a2: advanced stuff",
          "a3: advanced stuff"
        ]
      },
      ecosystem_contributor: {
        label: "Ecosystem Contributor",
        foundational: [
          "b1: foundational stuff",
          "b2: foundational stuff",
          "b3: foundational stuff"
        ],
        intermediate: [
          "b1: intermediate stuff",
          "b2: intermediate stuff",
          "b3: intermediate stuff"
        ],
        advanced: [
          "b1: advanced stuff",
          "b2: advanced stuff",
          "b3: advanced stuff"
        ]
      },
      docs_contributor: {
        label: "Docs Contributor",
        foundational: [
          "c1: foundational stuff",
          "c2: foundational stuff",
          "c3: foundational stuff"
        ],
        intermediate: [
          "c1: intermediate stuff",
          "c2: intermediate stuff",
          "c3: intermediate stuff"
        ],
        advanced: [
          "c1: advanced stuff",
          "c2: advanced stuff",
          "c3: advanced stuff"
        ]
      },
      community_contributor: {
        label: "Community Contributor",
        foundational: [
          "d1: foundational stuff",
          "d2: foundational stuff",
          "d3: foundational stuff"
        ],
        intermediate: [
          "d1: intermediate stuff",
          "d2: intermediate stuff",
          "d3: intermediate stuff"
        ],
        advanced: [
          "d1: advanced stuff",
          "d2: advanced stuff",
          "d3: advanced stuff"
        ]
      }
    },
    migrators: {
      vmware_openstack: {
        label: "Migrating from VMWare and/or OpenStack",
        foundational: [
          "a1: foundational stuff",
          "a2: foundational stuff",
          "a3: foundational stuff"
        ],
        intermediate: [
          "a1: intermediate stuff",
          "a2: intermediate stuff",
          "a3: intermediate stuff"
        ],
        advanced: [
          "a1: advanced stuff",
          "a2: advanced stuff",
          "a3: advanced stuff"
        ]
      },
      docker_compose_swarm: {
        label: "Migrating from Docker Compose and Swarm",
        foundational: [
          "b1: foundational stuff",
          "b2: foundational stuff",
          "b3: foundational stuff"
        ],
        intermediate: [
          "b1: intermediate stuff",
          "b2: intermediate stuff",
          "b3: intermediate stuff"
        ],
        advanced: [
          "b1: advanced stuff",
          "b2: advanced stuff",
          "b3: advanced stuff"
        ]
      },
      heroku: {
        label: "Migrating from Heroku (PaaS)",
        foundational: [
          "c1: foundational stuff",
          "c2: foundational stuff",
          "c3: foundational stuff"
        ],
        intermediate: [
          "c1: intermediate stuff",
          "c2: intermediate stuff",
          "c3: intermediate stuff"
        ],
        advanced: [
          "c1: advanced stuff",
          "c2: advanced stuff",
          "c3: advanced stuff"
        ]
      },
      mesos: {
        label: "Migrating from Apache Mesos",
        foundational: [
          "d1: foundational stuff",
          "d2: foundational stuff",
          "d3: foundational stuff"
        ],
        intermediate: [
          "d1: intermediate stuff",
          "d2: intermediate stuff",
          "d3: intermediate stuff"
        ],
        advanced: [
          "d1: advanced stuff",
          "d2: advanced stuff",
          "d3: advanced stuff"
        ]
      }
    }
  };
  var selected = {
      type:'users',
      button: 'app_developer',
      level: 'foundational'
  };

  $(document).ready(function() {
    buildCards();
    $('.bar1 .navButton').on('click', function(e) {
        $('.navButton').removeClass("keepShow");
        $(this).addClass("keepShow");
        var type = '';

        $('.cards > div').hide();
        if (/users/.test(e.currentTarget.className)) {
          $('.card_users').show();
          type = 'users';
        }
        else if (/contributors/.test(e.currentTarget.className)) {
          $('.card_contributors').show();
          type = 'contributors';
        }
        else if (/migrators/.test(e.currentTarget.className)) {
          $('.card_migrators').show();
          type = 'migrators';
        }
        selected.type = type;
    });

    function buildCards () {
      for (var c in info) {
        var card = document.createElement('div');
        card.className += "card_" + c;

        for (var i in info[c]) {
          var button = document.createElement('div');
          button.className += 'buttons';
          button.setAttribute('data-button', i);
          button.innerText = info[c][i]["label"];
          card.appendChild(button);
        }
        $('.cards').append(card);
      }
    }

    $('.bar1 .users').click();
    setTimeout(function() {
      var el = {'currentTarget' : $('div[data-button="app_developer"')[0]};
      handleCardClick(el, true);
    },200);
    $('.cards .buttons').on('click', handleCardClick);
    $('.tab1').on('click', function(e) {
        $('.tab1').removeClass('selected');
        $(this).addClass('selected');
        var level = e.currentTarget.className.match(/(?:tab1 )(.+)(?:selected)$/)[1].trim();
        selected.level = level;
        setInfoData(level);
    });
  });

  function setInfoData(level) {
      var contentArray = info[selected.type][selected.button][selected.level];
      for(i = 1; i<=contentArray.length; i++) {
          var content = contentArray[i-1];
          if( typeof content === 'object') {
            $('#info'+i).text(content.label);
            $('#infolink'+i).attr('href',content.url);
          } else {
            $('#info'+i).text(content);
            $('#infolink'+i).attr('href',"docs.html");
          }
      }
      $('.infobarWrapper').css('visibility', 'visible');
  }

  function handleCardClick(e, stopScroll) {
      $('.buttons').removeClass('selected');
      $(this).addClass('selected');
      if(!stopScroll){
        $('html,body').animate({scrollTop: $("#subTitle").offset().top},'slow');
      }
      $(e.currentTarget).addClass('selected');
      selected.button = e.currentTarget.getAttribute('data-button');
      var cardText = e.currentTarget.innerText;
      $('#subTitle').text(cardText);
      $('.tab1.foundational').click();
  }
  

    setTimeout(function() {

   $("#beginner").trigger('click');
      
    } ,500); 
});
function showOnlyDocs(flag){
  if(flag){
    jQuery('.applicationDeveloperContainer').hide();
    jQuery('.infobarWrapper').hide();
    jQuery('#cardWrapper').hide()
  }else{
    jQuery('.applicationDeveloperContainer').show();
    jQuery('.infobarWrapper').show();
    jQuery('#cardWrapper').show()
  }
}

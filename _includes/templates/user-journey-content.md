<div class="track">{{ page.track }}</div>
<div class="topheader">
   Introduction
</div>
<div class="sections">sections in this doc</div>
<div id="user-journeys-toc" class="tablebar">
<!-- This TOC section is populated with Javascript, see js/user-journeys-toc.js -->
</div>

<div class="docsection1">

{% if overview %}
{{ overview | liquify | markdownify }}
{% else %}
{% include templates/_errorthrower.md missing_block='overview' purpose='provides an introduction of this level.' %}
{% endif %}

{% if body %}
{{ body | liquify | markdownify | replace: '<h2', '</div><h2' | replace: '</h2>', '</h2><div class="docsection1">'}}
{% else %}
{% include templates/_errorthrower.md missing_block='body' purpose='contains content for this level.' %}
{% endif %}

</div>

<script src="/js/user-journeys/toc.js"></script>

<div class="track">{{ page.track }}</div>
<div class="topheader">
   Introduction
</div>
<div class="sections">sections in this doc</div>
<div class="tablebar">
<a href="#1"><div class="docButton">1.&nbsp;Setup&nbsp;a&nbsp;development&nbsp;environment</div></a>
<a href="#2"><div class="docButton">2.&nbsp;Deploy,&nbsp;scale,&nbsp;and&nbsp;update&nbsp;an&nbsp;application</div></a>
<a href="#3"><div class="docButton">3.&nbsp;Understand&nbsp;Kubernetes&nbsp;basics</div></a>
<a href="#4"><div class="docButton">4.&nbsp;Additional&nbsp;resources</div></a>
</div>

{% if intro %}
<div class="docsection1">
{{ intro | liquify | markdownify }}
</div>
{% else %}

{% include templates/_errorthrower.md missing_block='intro' purpose='provides an introduction of this level.' %}

{% endif %}


{% if one %}
<div class="docsection1">
<div class="docssectionheaders" id="1"><span class="numberCircle"><span><br><br>1</span></span>&nbsp;&nbsp;One</div>

{{ one | liquify | markdownify }}
</div>

{% else %}

{% include templates/_errorthrower.md missing_block='one' purpose='first section of this level.' %}

{% endif %}

{% if two %}
<div class="docsection1">
<div class="docssectionheaders" id="2"><span class="numberCircle"><span><br><br>2</span></span>&nbsp;&nbsp;Two</div>

{{ two | liquify | markdownify }}
</div>

{% else %}

{% include templates/_errorthrower.md missing_block='two' purpose='second section of this level.' %}

{% endif %}

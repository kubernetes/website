---
---
<script language="JavaScript">
var dropDownsPopulated = false;
$( document ).ready(function() {
  // When the document loads, get the metadata JSON, and kick off tbl render
  $.get("/metadata.txt", function(data, status) {
    metadata = $.parseJSON(data);
    metadata.pages.sort(dynamicSort("t"));
    mainLogic()
    $(window).bind( 'hashchange', function(e) {
      mainLogic();
    });
  });
});
function mainLogic()
{
  // If there's a tag filter, change the table/drop down output
  if (!dropDownsPopulated) populateDropdowns();
  var tag=window.location.hash.replace("#","");
  if(tag) {
    tag = $.trim(tag);
    for (i=0;i<tagName.length;i++) {
      querystringTag = tagName[i] + "=";
      if (tag.indexOf(querystringTag) > -1)
      {
        console.log("in mainLog: querystringTag of " + querystringTag + " matches tag of " + tag);
        tag = tag.replace(querystringTag,"");
        selectDropDown(tagName[i],tag);
        topicsFilter(tagName[i],tag,"output");
      }
    }
  } else {
    currentTopics = metadata.pages;
  }
  renderTable(currentTopics,"output");

}
function populateDropdowns()
{
  // Keeping mainLogic() brief by functionalizing the initialization of the
  // drop-down filter boxes

  for(i=0;i<metadata.pages.length;i++)
  {
    var metadataArrays = [metadata.pages[i].cr,metadata.pages[i].or,metadata.pages[i].mr];
    for(j=0;j<metadataArrays.length;j++)
    {
      if (metadataArrays[j]) {
        for (k=0;k<metadataArrays[j].length;k++) {
          if (typeof storedTagsArrays[j] == 'undefined') storedTagsArrays[j] = new Array();
          storedTagsArrays[j][metadataArrays[j][k][tagName[j]]] = true;
          // ^ conceptList[metadata.pages[i].cr[k].concept] = true; (if rolling through concepts)
          // ^ conceptList['container'] = true; (ultimate result)
          // ^ objectList[metadata.pages[i].or[k].object] = true; (if rolling through objects)
          // ^ objectList['restartPolicy'] = true; (ultimate result)
        }
      }
    }
  }
  var output = new Array();
  for(i=0;i<tagName.length;i++)
  {
    // Phew! All tags in conceptList, objectList, and commandList!
    // Loop through them and populate those drop-downs through html() injection
    output = [];
    output.push("<select id='" + tagName[i] + "' onchange='dropFilter(this)'>");
    output.push("<option>---</option>");
    Object.keys(storedTagsArrays[i]).sort().forEach(function (key) {
      output.push("<option>" + key + "</option>");
    });
    output.push("</select>")
    $(dropDowns[i]).html(output.join(""));
  }
  dropDownsPopulated = true;
}
function dropFilter(srcobj)
{
  // process the change of a drop-down value
  // the ID of the drop down is either command, object, or concept
  // these exact values are what topicsFilter() expects, plus a filter val
  // which we get from .text() of :selected
  console.log("dropFilter:" + $(srcobj).attr('id') + ":" + $(srcobj).find(":selected").text());
  topicsFilter($(srcobj).attr('id').replace("#",""),$(srcobj).find(":selected").text(),"output");
  for(i=0;i<tagName.length;i++)
  {
    if($(srcobj).attr('id')!=tagName[i]) selectDropDown(tagName[i],"---");
  }
}
function selectDropDown(type,tag)
{
  // change drop-down selection w/o filtering
  $("#" + type).val(tag);
}
</script>
<style>
#filters select{
  font-size: 14px;
  border: 1px #000 solid;
}
#filters {
  padding-top: 20px;
}
</style>

Klicken Sie auf Tags oder verwenden Sie die Dropdown-Liste zum Filtern. Klicken Sie auf Tabellenköpfe, um die Ergebnisse zu sortieren oder umzukehren.

<p id="filters">
Nach Konzept filtern: <span id="conceptFilter" /><br/>
Nach Objekt filtern: <span id="objectFilter" /><br/>
Nach Befehl filtern: <span id="commandFilter" />
</p>

<div id="output" />

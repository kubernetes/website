

-----------
# Event versioned



Group        | Version     | Kind
------------ | ---------- | -----------
Core | versioned | Event




<aside class="notice">Other api versions of this object exist: <a href="#event-v1">v1</a> </aside>


Event represents a single event to a watched resource.



Field        | Description
------------ | -----------
object <br /> *[RawExtension](#rawextension-runtime)*  | Object is:  * If Type is Added or Modified: the new state of the object.  * If Type is Deleted: the state of the object immediately before deletion.  * If Type is Error: *api.Status is recommended; other types may make sense    depending on context.
type <br /> *string*  | 







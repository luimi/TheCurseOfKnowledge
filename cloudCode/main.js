Parse.Cloud.define("addView",async (request,result) => {
    let tool = await new Parse.Query("Tool").get(request.params.id);
    let nextCount = tool.get("views")?tool.get("views")+1:1;
    tool.set("views", nextCount);
    await tool.save(null,{useMasterKey: true});
    result.success();
  });
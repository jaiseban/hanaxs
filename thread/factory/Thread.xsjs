$.import("thread.factory", "ThreadHelper");
//Define some aliases
var helper = $.thread.factory.ThreadHelper;

function execute(input)
{
	var id= input.threadId
	//Get the thread meta data info
	var meta = helper.getThreadMetaData(id);
	
	//Import and execute the lib
	$.import(meta.PKG,meta.LIB);
	var remotefn = eval("$." + meta.PKG + "." + meta.LIB + "." + meta.FUNCTION);
	var result = remotefn(meta.PARAMS);
	
	var scheduleId= helper.getScheduleId(id);
	helper.deleteSchedule(scheduleId);
}


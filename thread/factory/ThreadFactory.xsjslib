$.import("thread.factory", "ThreadHelper");
//Define some aliases
var helper = $.thread.factory.ThreadHelper;

/**
 * Thread Create API
 * 
 * @param name 		- thread name
 * @param pkg 		- package name of the xsjs lib which needs to be executed eg : thread.test
 * @param lib		- name of the xsjslib file 
 * @param func		- name of the function to be executed
 * @param params	- params if any in JSON object format
 * 
 * @returns thread id
 */

function create(name, pkg, lib, func, params)
{
	var paramsObj = {};
	if(params !== null && params !== undefined )
	{
		paramsObj = params;
	}
	//Add the meta data info
	var threadId = helper.addMetaData(name, pkg, lib, func, paramsObj);
	
	//Create a schedule
	var scheduleId= helper.addSchedule(threadId);

	// Update the schedule id in the THREAD table
	helper.updateScheduleId(threadId,scheduleId);
	
	return threadId;
}


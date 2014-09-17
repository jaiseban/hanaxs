
function addSchedule(threadId){
	var id = null;
	var xsCronInstantaneous = "* * * * * * *\/1";
	var thread = new $.jobs.Job({uri:"/thread/factory/THREAD_SCHEDULE.xsjob"});
	id = thread.schedules.add({ description: "adding schedule  for thread Id : "+threadId, 
		xscron: xsCronInstantaneous,
		parameter:
		{ 
			"threadId": threadId
		}
	});
	return id;
}

/*
 * @desc deletes schedule for given scheduleId
 * 
 * @param scheduleId - Schedule Id of the schedule to be deleted.
 */
function deleteSchedule(scheduleId){
	var thread = new $.jobs.Job({uri:"/thread/factory/THREAD_SCHEDULE.xsjob"});
	thread.schedules.delete({id: scheduleId});

}


function getScheduleId(threadId)
{
	var conn = $.db.getConnection();
	var sql = "select SCHEDULE_ID from \"XS_THREAD\".\"thread.factory::THREADS\"   WHERE ID = ?";
	var pstmt = conn.prepareStatement(sql);
	pstmt.setBigInt(1, threadId);
	var rs = pstmt.executeQuery();
	var scheduleId= -1;
	while (rs.next()) {
		scheduleId =rs.getInteger(1);
	}
	pstmt.close();
	conn.commit();
	conn.close();
	return scheduleId;

}

function getThreadMetaData(id)
{

	var conn = $.db.getConnection();
	var sql = "select ID,SCHEDULE_ID,NAME,CREATED_BY,PKG,LIB,FUNCTION,PARAMS from \"XS_THREAD\".\"thread.factory::THREADS\"   WHERE ID = ?";
	var pstmt = conn.prepareStatement(sql);
	pstmt.setBigInt(1, id);
	var rs = pstmt.executeQuery();
	var result = {};
	while (rs.next()) {
		result.ID =rs.getInteger(1);
		result.SCHEDULE_ID =rs.getInteger(2);
		result.NAME = rs.getString(3);
		result.CREATED_BY = rs.getString(4);
		result.PKG = rs.getString(5);
		result.LIB = rs.getString(6);
		result.FUNCTION = rs.getString(7);
		result.PARAMS =JSON.parse( rs.getString(8));
	}
	pstmt.close();
	conn.commit();
	conn.close();
	return result;

}

function getNextNumber(sequence) {
	var number = -1;
	var q = "select " + sequence + ".NEXTVAL from \"SYS\".\"DUMMY\"";
	var dbcon = $.db.getConnection();
	var selectPstmt = dbcon.prepareStatement(q);
	var rs = selectPstmt.executeQuery();
	if (rs.next()) {
		number = rs.getInteger(1);
	}
	rs.close();
	selectPstmt.close();
	dbcon.close();
	return number;
}

function updateScheduleId(threadId,scheduleId)
{
	var dbcon = $.db.getConnection();
	var pstmt =null;
	try {
		var statementString = "update \"XS_THREAD\".\"thread.factory::THREADS\" set SCHEDULE_ID=? where ID=?";
		pstmt =  dbcon.prepareStatement(statementString);
		pstmt.setBigInt(1, scheduleId);
		pstmt.setBigInt(2, threadId);
		pstmt.executeUpdate();
	} catch (error) {
		throw new Error(error.message);
	}finally{
		pstmt.close();
		dbcon.commit();
		dbcon.close();
	}

}

function addMetaData(name, pkg, lib, func, params)
{
	
	var threadId = getNextNumber("\"XS_THREAD\".\"thread.factory::SEQ_THREAD\"");
	var dbcon = $.db.getConnection();
	var pstmt =null;
	try {
		var statementString = "insert into \"XS_THREAD\".\"thread.factory::THREADS\" (ID,NAME,CREATED_BY,PKG,LIB,FUNCTION,PARAMS) values (?,?,?,?,?,?,?)";
		pstmt =  dbcon.prepareStatement(statementString);
		pstmt.setBigInt(1, threadId);
		pstmt.setString(2, name);
		pstmt.setString(3, $.session.getUsername() );
		pstmt.setString(4, pkg);
		pstmt.setString(5, lib);
		pstmt.setString(6, func);
		pstmt.setString(7, JSON.stringify(params) );
		pstmt.executeUpdate();
	} catch (error) {
		throw new Error(error.message);
	}finally{
		pstmt.close();
		dbcon.commit();
		dbcon.close();
	}
	return threadId;

}

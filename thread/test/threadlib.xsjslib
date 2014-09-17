function execute(params)
{
	
	var spCall = "call \"XS_THREAD\".\"thread.test::sample\" (?)";
	var conn = $.db.getConnection();
	var pstmt = conn.prepareCall(spCall);
	pstmt.setString(1,params.name);
	pstmt.execute();
	conn.commit();
	conn.close();
	return 1;
}
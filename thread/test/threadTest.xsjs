try {
	$.import("thread.factory", "ThreadFactory");
	// Define some aliases
	var factory = $.thread.factory.ThreadFactory;

	factory.create("thread 1 ", "thread.test", "threadlib", "execute", {
		name : 'I am thread 1'
	});
	factory.create("thread 2 ", "thread.test", "threadlib", "execute", {
		name : 'I am thread 2'
	});

} catch (e) {
	$.response.setBody(e.message);
}

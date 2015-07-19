var fs = require('fs');
var _und = require('underscore')._;
var moment = require('moment');

var parser = {
	
	Event: function(disk_event) {
		_und.extend(this, disk_event);
		this.start_date = moment(disk_event.start_date, "YYYY-MM-DD h:mm a");
		this.end_date = moment(disk_event.end_date, "YYYY-MM-DD h:mm a");
	},
	
	parseDiskEvent: function(disk_event) {
		return new this.Event(disk_event);
	},
	
	parseDiskEvents: function(disk_events) {
		var that = this;
		return _und.map(disk_events, function(disk_event) { return that.parseDiskEvent(disk_event) });
	},
	
	parseDiskEventsFileContent: function(disk_events_file) {
		return this.parseDiskEvents(JSON.parse(disk_events_file).events);
	},
	
	parseDiskEventsFile: function(disk_events_file_path, callback) {
		var that = this;
		fs.readFile(disk_events_file_path, 'utf8', function(err, file_content) {
			var parsed_content = that.parseDiskEventsFileContent(file_content)
			callback(parsed_content);
		})
	}
};

module.exports = parser;
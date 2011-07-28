//*****************************************************************************
// function returns the current time and date as a formatted string
//*****************************************************************************
function getDate(currentTime)
{
	var minutes = currentTime.getMinutes();
	var hours = currentTime.getHours();
	var timeOfDay = '';
	var secs = currentTime.getSeconds() + ":" + currentTime.getMilliseconds();
	
	if(hours > 12){
		hours -= 12;
	}
		 
	if (minutes < 10){
		minutes = "0" + minutes;
		} 
	
	if(currentTime.getHours() > 11){	
		timeOfDay = "PM";
	}
	else{ 
		timeOfDay = "AM";
	}
		
	return "" + (currentTime.getMonth() + 1) + "/" + currentTime.getDate() + "/" + currentTime.getFullYear() + " " + 
				hours + ":" + minutes + " " + secs + " " + timeOfDay;
}

var db = false; //global representation of database "HelloPhoneGap
//*****************************************************************************
// Loads date list and stores it in "contentlist"
//*****************************************************************************
function loadDateListPage()//necessary for proper behavior using physical back button
{
	document.addEventListener("deviceready", onDateListLoad, false);
}

function onDateListLoad()
{
	$("#contentlist").empty();
	try
	{ 
		if (!window.openDatabase)//try file I/O here
		{ 
			alert('not supported'); 
		} 
		else //database is supported 
		{ 
			db = window.openDatabase("HelloPhoneGap", "1.0", "PhoneGap dateList", 200000);
			db.transaction(startListPopuate, errorCB, nullDataHandler);
		}
	} 
	catch(e) 
	{ 
		if (e == INVALID_STATE_ERR) 
		{ 
			console.log("Invalid database version."); 
        } 
		else 
		{ 
			console.log("Unknown error "+e+"."); 
		} 
        return; 
	}    	
}

function startListPopuate(tx)
{
	tx.executeSql('CREATE TABLE IF NOT EXISTS dateList(id INTEGER NOT NULL PRIMARY KEY, milliSecs INTEGER NOT NULL DEFAULT 0);',
			[], nullDataHandler, errorCB);
	tx.executeSql('SELECT * FROM dateList ORDER BY milliSecs', [], populateDateList, errorCB);	
}

function populateDateList(tx, results)
{
	var len = results.rows.length;
	for (var i=0; i<len; i++)
	{
		$("#contentlist").append("<li>" + getDate(new Date(results.rows.item(i).milliSecs)) + "</li>");
	}
	$("#contentlist").listview('refresh');
}

function backToMain()
{
	document.addEventListener("deviceready", nullEventHandler, false);
}

//*****************************************************************************
// Wait for PhoneGap to load   and call "onDeviceReady" once it has
//*****************************************************************************
function init() 
{
    document.addEventListener("deviceready", onDeviceReady, false);
}

//*****************************************************************************
// Called asynchronously once phoneGap is loaded.  Opens the database 
// "HelloPhoneGap" if it exists and creates it otherwise, then makes a call to
// populateDB.  Any error is recorded to the program console
//*****************************************************************************
function onDeviceReady() 
{       
	try
	{ 
		if (!window.openDatabase)//try file I/O here
		{ 
			console.log('not supported'); 
		} 
		else //database is supported 
		{ 
			db = window.openDatabase("HelloPhoneGap", "1.0", "PhoneGap dateList", 200000);
			db.transaction(populateDB, errorCB, nullDataHandler);
		}
	} 
	catch(e) 
	{ 
		if (e == INVALID_STATE_ERR) 
		{ 
			console.log("Invalid database version."); 
        } 
		else 
		{ 
			console.log("Unknown error "+e+"."); 
		} 
        return; 
	}    
}

//*****************************************************************************
// Creates the table "dateList" if it does not already exist and makes a call
// to dateCountHandler.  Propagates all errors back to caller.
//*****************************************************************************    
function populateDB(tx) 
{   
	//tx.executeSql('DROP TABLE IF EXISTS dateList');
	tx.executeSql('CREATE TABLE IF NOT EXISTS dateList(id INTEGER NOT NULL PRIMARY KEY, milliSecs INTEGER NOT NULL DEFAULT 0);',
					[], nullDataHandler, errorCB);
	tx.executeSql('insert into dateList (id, milliSecs) VALUES (null,' + new Date().getTime() + ');', [], nullDataHandler, errorCB);
	tx.executeSql('SELECT * FROM dateList', [], testHandler, errorCB);
}    

//Strictly for test purposes
function testHandler(tx, results) 
{
	var len = results.rows.length; 
	console.log("DEMO table: " + len + " rows found.");
	for (var i=0; i<len; i++)
	{
		console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + 
				getDate(new Date(results.rows.item(i).milliSecs)));
	}
}

// Transaction error callback ---- return true in order to rollback transaction 
function errorCB(tx, err) { console.log("Error processing SQL: "+err); return true; }    
//null db data handler
function nullDataHandler(tx, results) { } 
//for return to main
function nullEventHandler(){ }


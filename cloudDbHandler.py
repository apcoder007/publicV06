import os
from google.appengine.api import memcache
# from oauth2client.appengine import AppAssertionCredentials

from google.appengine.api import rdbms
from datetime import datetime
import time

import MySQLdb


_INSTANCE_NAME = 'cafe-indica-163107:us-central1:apidata' 
CLOUDSQL_USER ='indica'
CLOUDSQL_PASSWORD='tech@123'
_INSTANCE_NAME = 'cafe-indica-163107:us-central1:apidata' 


def connect_to_cloudsql():
	dbname='indica'
	# When deployed to App Engine, the `SERVER_SOFTWARE` environment variable will be set to 'Google App Engine/version'.
	if os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/'):
		# Connect using the unix socket located at
		# /cloudsql/cloudsql-connection-name.
		cloudsql_unix_socket = os.path.join('/cloudsql', _INSTANCE_NAME)

		db = MySQLdb.connect( unix_socket=cloudsql_unix_socket, user=CLOUDSQL_USER, passwd=CLOUDSQL_PASSWORD, db=dbname)

	# If the unix socket is unavailable, then try to connect using TCP. This will work if you're running a local MySQL server or using the Cloud SQL proxy, for example: cloud_sql_proxy -instances=your-connection-name=tcp:3306
	else:
		db = MySQLdb.connect(
			host='146.148.110.200',  user=CLOUDSQL_USER, passwd=CLOUDSQL_PASSWORD, db=dbname)

	return db



			   
class GetData():

	def getMapDetails(self):
		try:
			dbname='indica'
			conn = rdbms.connect(instance=_INSTANCE_NAME, database=dbname)
			cursor = conn.cursor()
			sqlcmd = "select projects_markers.id, lat, lng, projects.id, name, society, address, mobile, contact_person, project_status.status from projects left join project_markers on project_markers.id = projects.id left join projects.status on projects.id = project_status.project_id orderBy(project_markers.id)"
			cursor.execute(sqlcmd)
			dbDetails=[]
			for row in cursor.fetchall():
				dbDetails.append(row)
			conn.commit()
			conn.close()
			return dbDetails 
		except Exception,e:
			print str(e)


	
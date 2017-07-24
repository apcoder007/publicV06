from flask import Flask, redirect, url_for, session
from flask_oauth import OAuth
 
 
# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = '218003132719-k3f3fl0kpsfcb313ejh654aj14hb9144.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'mBjhDUwTlx4EwK-85qtWC_08'
REDIRECT_URI = '/oauth2callback'  # one of the Redirect URIs from Google APIs console
 
SECRET_KEY = 'development key'
DEBUG = True
 
app = Flask(__name__)
app.debug = DEBUG
app.secret_key = SECRET_KEY
oauth = OAuth()
 
google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code'},
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={'grant_type': 'authorization_code'},
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET)
 
@app.route('/')
def index():
    access_token = session.get('access_token')
    if access_token is None:
        return redirect(url_for('login'))
 
    access_token = access_token[0]
    from urllib2 import Request, urlopen, URLError
 
    headers = {'Authorization': 'OAuth '+access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('login'))
        return res.read()
 
    return res.read()
 
 
@app.route('/login')
def login():
    callback=url_for('authorized', _external=True)
    return google.authorize(callback=callback)
 
 
 
@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))
 
 
@google.tokengetter
def get_access_token():
    return session.get('access_token')
 
 
def main():
    app.run()
 
 
if __name__ == '__main__':
    main()









































# from flask import  Flask, request, jsonify,session, redirect, url_for,g,abort, Response

# import json
# import cloudDbHandler as dbhelper


# #API_KEY = ['NkHb13BxRBiZ0JSyxLbAU','Hx1XU63ZThyFGsqfLeGu7']


# app = Flask(__name__)




# ############################Normal Function To calculate the Detaisl ###################################################

# @app.after_request
# def after_request(response):
# 	response.headers['Access-Control-Allow-Origin']='*'
# 	response.headers['Access-Control-Allow-Headers']='Content-Type, Authorization'
# 	response.headers['Access-Control-Allow-Methods']= 'GET, PUT, POST, DELETE'
# 	return response


# ##########################################Login and Signup Api Calls   ######################################


# @app.route('/api/rest/session/',methods=['GET','POST'])
# def sessionCreate():
# 	if request.method == 'POST':
# 		logindata=json.loads(request.data)
# 		username=logindata['username']
# 		userid=logindata['userid']
# 		session['username']=username
# 		session['userid']=userid
# 		session['loged_in']=True
# 		sessionData={'status': 1, 'userid':userid}

# 		resp = Response(json.dumps(sessionData))
# 		return after_request(resp)

# @app.route('/api/logout/session/',methods=['GET','POST'])
# def sessionLogout():
# 	if request.method == 'GET':
		
# 		session['username']=None
# 		session['userid']=0
# 		session['loged_in']=None
# 		sessionData={'logout': 1 }

# 		return redirect('/')

# @app.route('/api/rest/check/status/',methods=['GET','POST'])
# def sessionCheck():
# 	if request.method == 'GET':
# 		if 'loged_in' in session:
# 			userid= session['userid']
# 			sessionData={'status': 1, 'userid':userid}
				
# 		else:
# 			sessionData={'status': 0, 'userid':0}

# 		resp = Response(json.dumps(sessionData))
# 		return after_request(resp)

# @app.route('/api/getlogin/', methods=['GET', 'POST'])
# def postAdminUser_estimation():
# 	if request.method == 'POST':
# 		userdata = json.loads(request.data)
# 		username = userdata['username']
# 		password = userdata['password']

		
# 		result=dbhelper.GetData().getLoginData(username, password)[0]
# 		json_results = []
# 		if len(result)!=0:
# 			user_id = result[0]
# 			username= result[1]
# 			session['username']=username
# 			session['userid']=user_id
# 			session['loged_in']=True

# 			sessionData={'status': 1, 'userid':user_id, 'username':username }
		   
# 			json_results.append(sessionData)
	  
	
# 		resp = Response(json.dumps({"success":1, "datasets":json_results}))
# 		return after_request(resp)


		

# app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
		  
# if __name__ == "__main__":
# 	app.run()
# 	
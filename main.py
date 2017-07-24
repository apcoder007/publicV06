# Copyright 2013 Google, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#             http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json

import webapp2
import model

import webapp2
import jinja2
import os
import json
from sets import  Set
import session_handler 
import urllib
import jinja2
import os
import json
from google.appengine.api import urlfetch
import cloudDbHandler as dbhelper
from collections import Counter
import csv
from google.appengine.ext import blobstore

import StringIO
import time


jinja_environment = jinja2.Environment(autoescape=True, loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))


def AsDict(guest):
    return {'id': guest.key.id(), 'first': guest.first, 'last': guest.last}


class RestHandler(webapp2.RequestHandler):

    def dispatch(self):
        # time.sleep(1)
        super(RestHandler, self).dispatch()

    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))


class QueryHandler(RestHandler):

    def get(self):
        guests = model.AllGuests()
        r = [AsDict(guest) for guest in guests]
        self.SendJson(r)


class UpdateHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        guest = model.UpdateGuest(r['id'], r['first'], r['last'])
        r = AsDict(guest)
        self.SendJson(r)


class InsertHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        guest = model.InsertGuest(r['first'], r['last'])
        r = AsDict(guest)
        self.SendJson(r)


class DeleteHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        model.DeleteGuest(r['id'])

    

class LoginHandler(session_handler.BaseSessionHandler):
    def get(self):
        if self.session.get('name'):
            self.redirect('/dashboard')

        else:
            home = jinja_environment.get_template('Admin_console.html')
            self.response.write(home.render())
        

    def post(self):
        username=self.request.get('username')
        password=self.request.get('password')
        
        try:
            data=dbhelper.GetData().getAdminLogDetails(username)
        except:
            data=[]
            self.redirect("/")
        if len(data)>0:

            if password==data[0][2]:
                self.session['username']=data[0][1]
                self.session['name']=data[0][3]
                self.session['adminType']=data[0][5]
                self.session['imageUrl']=data[0][4]
                self.redirect("/dashboard")
            else:
                self.redirect("/?message=failure")
        else:
            self.redirect("/")


APP = webapp2.WSGIApplication([
    ('/rest/query', QueryHandler),
    ('/rest/insert', InsertHandler),
    ('/rest/delete', DeleteHandler),
    ('/rest/update', UpdateHandler),
    ('/rest/login', LoginHandler),
], debug=True)
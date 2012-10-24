Node.JS User Registration 
=========================

PROJECT GOALS :
---------------
Main goals are to provide the following features :

- Sign up
- Activation link send thru Mandrill (Mailchimp service)
- Sign in
- Logout
- Password management :
  . Change Password
  . Forgot Password (not implemented yet)
 - User profile informations (not implemented yet)

DISCLAIMER / WARNING :
----------------------
This code is NOT STABLE, do NOT use it for production uses

DEMO SITE :
-----------
A demo site is available at : http://likbe.jit.su

USAGE :
-------
Use make to generate code coverage


PROJECT DEPENDENCIES :
----------------------

Core :
------
- Async
- Express

User Interface :
----------------
- Jade (views / templates)
- Stylus
- connect-flash

Communication / Network :
-------------------------
- Node Mandrill (mail sender)

Log :
-----
- Winston (logger)

Security :
----------
- Passport.JS (authentication)
- Passport.JS local (link between Passport.JS and MongoDB)
- BCrypt (hash password)

Test / Quality : 
-----------------
- Mocha (integration/unit tests)
- should (assertions framework) 
- jscoverage (code coverage)

Database :
----------
- Redis (Session Store)
- MongoDB (Datas)
- Mongoose (ODM)
- Connect-redis (Redis client)

Utilities :
-----------
- UUID js
- String js
- Moment js (Date and time formatting)


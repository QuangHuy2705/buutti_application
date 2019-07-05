# buutti_application
webpack-nodejs-docker

# API Endpoints:
- create new event: POST /api/events 
  required fields: name(string), length(number), schedule(datetime)
  
- get events: GET /api/events?name=&year=?month=&day=&time=
  at least one query field is required
  
- get ongoing events: GET /api/events/ongoing

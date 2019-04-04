// TODO: express ramp up

// TODO: mysql ramp up

/* Routes

- GET /form/:slug send form 
- POST /form/:slug check captcha and write json to table
- GET /form/:slug/thankyou/:id send thankyou page with data by ID res.render (view, {data: datafrommysqlbyid})

PASSPORT!
- GET /admin/
- GET /admin/:slug (View)
- GET /admin/:slug/:id (DetailView) -> queryparm ?print
- PUT /admin/:slug update form state
- PUT /admin/:slug/:id update data (json)

OPEN:
- GET /winners get winner table
- GET /winners/:year get winners for year
*/

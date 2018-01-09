#4.0.0

## Non-breaking Changes

- Restructured application, connectors and models out of db.js and into their own modules


## Breaking Changes

### Terms

- Changed `getCategory` query to get category by term id OR name. Previously it was just by term id. 
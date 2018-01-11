# 4.1.0

- Added posts to User schema
- Changed post_type argument for `Posts` queries from `String` to `[String]` to allow for querying posts by multiple post types
- Query User by id and name, instead of just id

# 4.0.0

## Non-breaking Changes

- Restructured application, connectors and models out of db.js and into their own modules


## Breaking Changes

### Terms

- Changed `getCategory` query to get category by term id OR name. Previously it was just by term id. 
# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum

### User Stories

1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

This solution uses an array nested sub-documents instead of a seperate collection of exercises for logging the exercises.

I personally like this solution but can easily see some flaws. While it is super easy to create a user, add exercises to a user, and get a full list of every exercise for a user with this method if any filters are desired when returning the log of a user the sorting and filtering of the log has to be done after the initial query instead of as part of the initial query.  
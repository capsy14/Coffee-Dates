const { index } = require('../app/http/controllers/menuController')()
const { getUsers,saveUsers,login } = require('../app/http/controllers/userController')()

const initRoutes = (app) => {

    //to get all menu items
    app.get(`${process.env.BASE_URL}/menu`, index)

    //to get all users
    app.get(`${process.env.BASE_URL}/users`, getUsers)

    //to save users to database
    app.post(`${process.env.BASE_URL}/form`, saveUsers)

    //login route
    app.post(`${process.env.BASE_URL}/login`, login)

}                                          

module.exports = initRoutes;
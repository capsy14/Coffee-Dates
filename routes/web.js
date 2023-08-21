const { index } = require('../app/http/controllers/menuController')()
const { getUsers,saveUsers,login } = require('../app/http/controllers/userController')()

const initRoutes = (app) => {

    //to get all menu items
    app.get('/menu', index)

    //to get all users
    app.get('/users', getUsers)

    //to save users to database
    app.post('/form', saveUsers)

    //login route
    app.post('/login', login)

}                                          

module.exports = initRoutes;
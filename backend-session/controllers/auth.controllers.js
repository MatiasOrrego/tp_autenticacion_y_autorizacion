import database from '../database.js';

export const controllers = {
    register: (req, res) => {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        const userExists = database.user.find(u => u.username === username);

        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const newUser = {  
            "username": username,
            "password": password 
        };
        database.user.push(newUser);

        return res.json({ message: 'Usuario creado exitosamente', user: { id: newUser.id, username: newUser.username } });
    },

    login: (req, res) => {
        const { username, password } = req.body;

    // Buscar usuario
    const user = database.user.find(u => u.username === username && u.password === password);

    if (user) {
        // Guardar información del usuario en la sesión
        req.session.userId = user.id;
        req.session.username = user.username;

        return res.json({ 
            message: 'Inicio de sesión exitoso', 
            user: { id: user.id, username: user.username } });
    } else {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
},
    session:(req, res) => {
        if (req.session.userId) {
            return res.json({ 
                loggedIn: true, 
                user: { id: req.session.userId, username: req.session.username } });
        } else {
            return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
        }
},
    logout:(req, res) => {
            console.log(req.session)
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Error al cerrar la sesión' });
                }
                res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
                return res.json({ message: 'Sesión cerrada exitosamente' });
        });;    
    }
}
import database from '../db/database.js';

export const controllers = {
    register: async (req, res) => {
        const { username, password } = req.body;
    
        try {
            // Verificar si el usuario ya existe
            const [rows] = await database.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length > 0) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }
    
            // Crear nuevo usuario
            await database.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error del servidor' });
        }
<<<<<<< HEAD

        // Crear nuevo usuario
        const newUser = {  
            "username": username,
            "password": password 
        };
        database.user.push(newUser);

        return res.json({ message: 'Usuario creado exitosamente', user: { id: newUser.id, username: newUser.username } });
=======
>>>>>>> f4b5f01288a1b8e5ff58991fe960f25328f4e608
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
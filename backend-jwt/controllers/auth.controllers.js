import express from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';
import pool from '../db/database.js';
import { generarJwt } from '../utils/jwt.js';
import validarJwt from '../middlewares/validar-jwt.js';

const app = express();

app.use(express.json());

export const controller = {

    // Endpoint de registro
    register: async (req, res) => {

        const { username, password } = req.body;

        try {
            // Verificar si el usuario ya existe
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            if (user) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Crear un nuevo usuario
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

            return res.json({ message: 'Usuario registrado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error Inesperado' });
        }
    },

    // Endpoint de inicio de sesión (login)
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Buscar al usuario en la base de datos
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

            // Generar token JWT
            const token = await generarJwt(user.id);

            // Almacenar el token en la sesión del servidor
            req.session.token = token;

            // Almacenar el token en una cookie segura
            res.cookie('authToken', token, {
                httpOnly: true, // La cookie no es accesible desde JavaScript
                secure: false, // Cambiar a true en producción con HTTPS
                maxAge: 3600000 // Expiración en milisegundos (1 hora)
            });

            return res.json({ message: 'Inicio de sesión exitoso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error Inesperado' });
        }
    },

    // Endpoint para validar la sesión
    session: [validarJwt, (req, res) => {
        console.log(req.user);
        return res.json({ message: 'Acceso permitido a área protegida', user: req.user });
    }],

    // Endpoint de cierre de sesión (logout)
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    }
};

export default controller;
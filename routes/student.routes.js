import express from 'express';
const studentRouter = express.Router();

import {studentController} from '../controllers/student.controller.js';

studentRouter.get('/', studentController.home);
studentRouter.post('/login', studentController.login);
studentRouter.post('/register', studentController.register);
studentRouter.post('/logout', studentController.logout);

export default studentRouter;
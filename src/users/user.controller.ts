import type { Request, Response, NextFunction } from 'express'; 
import { Router } from 'express'; 
import Joi from 'joi'; 
import { Role } from '../_helpers/role'; 
import { validateRequest } from '../middleware/validateRequest'; 
import { userServices } from './user.service';   

const router = Router(); 

router.get('/', getAll); 
router.get('/:id', getById); 
router.post('/', createSchema, create);     
router.put('/:id', updateSchema, update); 
router.delete('/:id', _delete); 

export default router; 

function getAll(req: Request, res: Response, next: NextFunction): void { 
    userServices.getAll() 
    .then((users) => res.json(users)) 
    .catch(next); 
}

function getById(req: Request, res: Response, next: NextFunction): void { 
     userServices.getById(Number(req.params.id))
     .then((user) => res.json(user)) 
     .catch(next);     
}

function create(req: Request, res: Response, next: NextFunction): void { 
    userServices.create(req.body) 
    .then(() => res.json({ message: 'User Created'}))
    .catch(next); 
}

function update(req: Request, res: Response, next: NextFunction): void { 
    userServices.update(Number(req.params.id), req.body) 
    .then(() => res.json({ message: 'User Updated'})) 
    .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void { 
    userServices.delete(Number(req.params.id)) 
    .then(() => res.json({ message: 'User Deleted' }))
    .catch(next); 
}

function createSchema(req: Request, res: Response, next: NextFunction): void { 
    const schema = Joi.object({ 
        title: Joi.string().optional(), 
        firstName: Joi.string().optional(), 
        lastName: Joi.string().optional(), 
        role: Joi.string().valid(Role.Admin, Role.User).default(Role.User),  
        email: Joi.string().email().required(),  
        password: Joi.string().min(6).required(), 
        confirmPassword: Joi.string().valid(Joi.ref('password')).optional(), 
    }); 
    validateRequest(req, next, schema); 
}

function updateSchema(req: Request, res: Response, next: NextFunction): void { 
    const schema = Joi.object({ 
        title: Joi.string().empty(''), 
        firstName: Joi.string().empty(''), 
        lastName: Joi.string().empty(''), 
        role: Joi.string().valid(Role.Admin, Role.User).empty(''), 
        email: Joi.string().email().empty(''), 
        password: Joi.string().min(6).empty(''), 
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(), 
    }).with('password', 'confirmPassword'); 
    validateRequest(req, next, schema); 
}
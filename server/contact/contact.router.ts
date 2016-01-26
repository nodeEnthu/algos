import * as express from 'express';
import * as db from '../db/db';
import {sendError} from '../core/web.util';
import {contactService} from './contact.service';
import {Contact} from '../../client/core/dto';

const router = express.Router();
router.post('/', (req, res) => {
  contactService.createOne(req.body)
    .then((contact: Contact) => res.send(contact), (err: any) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  contactService.updateOne(req.body)
    .then((contact: Contact) => res.send(contact), (err: any) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  contactService.removeOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err: any) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  contactService.find()
    .then((contacts: Contact[]) => res.send(contacts), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  contactService.findOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err: any) => sendError(res, err));
});


export = router;

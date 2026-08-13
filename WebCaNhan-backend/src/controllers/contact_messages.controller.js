'use strict';
const ContactMessagesService = require('../services/contact_messages.service');
const { SuccessResponse, OK, CREATED } = require('../core/success.response');

class ContactMessagesController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get contact_messages list success',
            metadata: await ContactMessagesService.getAll()
        }).send(res);
    }
    
    getById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get contact_messages details success',
            metadata: await ContactMessagesService.getById(req.params.id)
        }).send(res);
    }
    
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create contact_messages success',
            metadata: await ContactMessagesService.create(req.body)
        }).send(res);
    }
    
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update contact_messages success',
            metadata: await ContactMessagesService.update(req.params.id, req.body)
        }).send(res);
    }
    
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete contact_messages success',
            metadata: await ContactMessagesService.delete(req.params.id)
        }).send(res);
    }
}
module.exports = new ContactMessagesController();

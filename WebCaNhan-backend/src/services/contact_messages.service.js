'use strict';
const ContactMessagesModel = require('../models/contact_messages.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class ContactMessagesService {
    static async getAll() {
        return await ContactMessagesModel.getAll();
    }
    
    static async getById(id) {
        const result = await ContactMessagesModel.getById(id);
        if(!result) throw new NotFoundError('contact_messages not found');
        return result;
    }
    
    static async create(payload) {
        const result = await ContactMessagesModel.create(payload);
        if (!result) throw new BadRequestError('Failed to create contact_messages');
        return result;
    }
    
    static async update(id, payload) {
        // Check if exists
        const found = await ContactMessagesModel.getById(id);
        if(!found) throw new NotFoundError('contact_messages not found');
        
        const result = await ContactMessagesModel.update(id, payload);
        if (!result) throw new BadRequestError('Failed to update contact_messages');
        return result;
    }
    
    static async delete(id) {
        const found = await ContactMessagesModel.getById(id);
        if(!found) throw new NotFoundError('contact_messages not found');
        return await ContactMessagesModel.delete(id);
    }
}
module.exports = ContactMessagesService;

import {Contact} from '../../client/core/dto';
import {ObjectUtil} from '../../client/core/object.util';
import {contacts, buildContact} from '../../client/components/contact/contact.mock';

export class ContactService {

  createOne(data: Contact): Promise<Contact> {
    const contact = buildContact(data);
    contacts.push(contact);
    return Promise.resolve(contact);
  }

  updateOne(data: Contact): Promise<Contact> {
    return this.findOneById(data._id).then((contact: Contact) => {
      ObjectUtil.merge(contact, data);
      return contact;
    });
  }

  removeOneById(id: string): Promise<Contact> {
    return this.findOneById(id).then((contact: Contact) => {
      const index = this._findIndex(id);
      contacts.splice(index, 1);
      return contact;
    });
  }

  find(): Promise<Contact[]> {
    return Promise.resolve(contacts);
  }

  findOneById(id: string): Promise<Contact> {
    const index = this._findIndex(id);
    const contact = contacts[index];
    return Promise.resolve(contact);
  }

  private _findIndex(id: string): number {
    const n = contacts.length;
    for (let i = 0; i < n; i++) {
      const it = contacts[i];
      if (it._id === id) {
        return i;
      }
    }
    return -1;
  }

}


export const contactService = new ContactService();

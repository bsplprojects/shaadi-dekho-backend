import contactModel from "./contact.model.js";

export class ContactServices {
  static async createContact(userId,data) {
    
    const contact = await contactModel.create({
      ...data,
      user: userId,
    });
    return contact;
  }
}

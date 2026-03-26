import { ApiResponse } from "../../utils/apiResponse.js";
import { ContactServices } from "./contact.services.js";

export class ContactController {
  static async createContact(req, res) {
    const data=req.body;
    const contact = await ContactServices.createContact(req.userId,data);
    return res.json(new ApiResponse(201, "Message submitted", contact));
  }
}

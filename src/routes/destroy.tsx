import { redirect, type ActionFunction } from "react-router-dom";
import { deleteContact } from "../lib/contacts";

export const action: ActionFunction = async ({ params }) => {
    await deleteContact(params.contactId!);
    return redirect("/");
};

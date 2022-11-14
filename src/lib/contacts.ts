import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type Contact = {
    id: string;
    last: string;
    first: string;
    favorite: boolean;
    createdAt: number;
    avatar: string;
    twitter: string;
    notes: string;
};

export async function getContacts(query = "") {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem<Contact[]>("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact(
    contactDTO = {
        last: "surname",
        first: "name",
        favorite: true,
        avatar: "",
        twitter: "",
        notes: "",
    }
) {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now(), ...contactDTO };
    let contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id = "") {
    await fakeNetwork(`contact:${id}`);
    let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
    let contact = contacts.find((contact) => contact.id === id);
    return contact ?? null;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
    await fakeNetwork();
    let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
    let contact = contacts.find((contact) => contact.id === id);
    if (!contact) throw new Error("No contact found for " + id);
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

export async function deleteContact(id: string) {
    let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
    let index = contacts.findIndex((contact) => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts: Contact[]) {
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, string | boolean> = {};

async function fakeNetwork(key = "") {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise((res) => {
        setTimeout(res, Math.random() * 800);
    });
}

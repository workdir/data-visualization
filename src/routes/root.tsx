import {
    Outlet,
    NavLink,
    useLoaderData,
    Form,
    redirect,
    ActionFunction,
    useNavigation,
    useSubmit,
    type LoaderFunction,
} from "react-router-dom";
import { getContacts, createContact, type Contact } from "../lib/contacts";

import { Link } from "@mui/material";

type LoaderData = {
    contacts: Contact[];
    q: string;
};

export const action: ActionFunction = async () => {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q!);
    return {
        contacts,
        q,
    };
};

export default function Root() {
    const { contacts, q } = useLoaderData() as LoaderData;
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        >
                            spinner
                        </div>
                        <div className="sr-only" aria-live="polite"></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        className={({
                                            isActive,
                                            isPending,
                                        }) => {
                                            return isPending
                                                ? "pending"
                                                : isActive
                                                ? "active"
                                                : "default";
                                        }}
                                        to={`contacts/${contact.id}`}
                                    >
                                        {({ isActive, isPending }) => (
                                            <div>
                                                {isPending
                                                    ? "pending"
                                                    : isActive
                                                    ? "active"
                                                    : "default"}
                                                {contact.first ||
                                                contact.last ? (
                                                    <>
                                                        {contact.first}{" "}
                                                        {contact.last}
                                                    </>
                                                ) : (
                                                    <i>No Name</i>
                                                )}{" "}
                                                {contact.favorite && (
                                                    <span>★</span>
                                                )}
                                            </div>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                className={navigation.state === "loading" ? "loading" : ""}
                id="detail"
            >
                {navigation.state === "loading" ? (
                    <div>loading</div>
                ) : (
                    <Outlet />
                )}
            </div>
        </>
    );
}

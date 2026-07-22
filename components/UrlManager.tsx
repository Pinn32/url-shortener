"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ManagedUrl = {
    id: string;
    longUrl: string;
    slug: string;
    description: string;
    createTime: string;
    updatedTime: string | null;
};

export default function UrlManager({ initialName, email, urls }: {
    initialName: string;
    email: string;
    urls: ManagedUrl[];
}) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [savedName, setSavedName] = useState(initialName);
    const [editingName, setEditingName] = useState(false);
    const [message, setMessage] = useState("");
    const [deleting, setDeleting] = useState<ManagedUrl | null>(null);

    async function saveProfile() {
        const response = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const body = await response.json();
        setMessage(response.ok ? "Username saved." : body.error);
        if (response.ok) {
            setSavedName(body.name);
            setName(body.name);
            setEditingName(false);
            router.refresh();
        }
    }

    async function saveUrl(url: ManagedUrl, slug: string, description: string): Promise<boolean> {
        const response = await fetch(`/api/urls/${url.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, description }),
        });
        const body = await response.json();
        setMessage(response.ok ? "URL updated." : body.error);
        if (response.ok) router.refresh();
        return response.ok;
    }

    async function deleteUrl() {
        if (!deleting) return;
        const response = await fetch(`/api/urls/${deleting.id}`, { method: "DELETE" });
        setMessage(response.ok ? "URL deleted." : "Unable to delete this URL.");
        setDeleting(null);
        if (response.ok) router.refresh();
    }

    return (
        <section className="manager" aria-labelledby="saved-urls-title">
            <div className="profile-row">
                <div className="profile-identity">
                    <h2>Your account</h2>
                    <p className="displayed-name">{savedName}</p>
                    <p>{email}</p>
                </div>
                {editingName ? (
                    <div className="username-field">
                        <label htmlFor="username">Displayed username</label>
                        <div>
                            <input
                                id="username"
                                maxLength={40}
                                placeholder="Displayed name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                onKeyDown={(event) => event.key === "Enter" && saveProfile()}
                                autoFocus
                            />
                            <button className="secondary-button" onClick={() => {
                                setName(savedName);
                                setEditingName(false);
                            }}>Cancel</button>
                            <button onClick={saveProfile}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-actions">
                        <button onClick={() => setEditingName(true)}>Edit username</button>
                    </div>
                )}
            </div>
            <div className="manager-heading">
                <h2 id="saved-urls-title">Your shortened URLs</h2>
                <span>{urls.length} saved</span>
            </div>
            {message && <p className="status-message" role="status">{message}</p>}
            {urls.length === 0 ? (
                <p className="empty-state">Your saved URLs will appear here after you compact one.</p>
            ) : (
                <div className="url-list">
                    {urls.map((url) => <UrlEditor key={url.id} url={url} onSave={saveUrl} onDelete={() => setDeleting(url)} />)}
                </div>
            )}
            {deleting && (
                <div className="modal-backdrop" role="presentation">
                    <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
                        <h2 id="delete-title">Delete shortened URL?</h2>
                        <p>This permanently removes <strong>/{deleting.slug}</strong>. Existing links will stop working.</p>
                        <div className="dialog-actions">
                            <button className="secondary-button" onClick={() => setDeleting(null)}>Cancel</button>
                            <button className="danger-button" onClick={deleteUrl}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function UrlEditor({ url, onSave, onDelete }: {
    url: ManagedUrl;
    onSave: (url: ManagedUrl, slug: string, description: string) => Promise<boolean>;
    onDelete: () => void;
}) {
    const [slug, setSlug] = useState(url.slug);
    const [description, setDescription] = useState(url.description);
    const [editing, setEditing] = useState(false);

    const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

    async function handleSave() {
        if (wordCount > 10) return;
        if (await onSave(url, slug, description)) setEditing(false);
    }

    return (
        <article className={`url-item${editing ? " is-editing" : ""}`}>
            <div className="url-summary">
                <a href={`/${url.slug}`} target="_blank" rel="noreferrer">
                    /{url.slug}{url.description ? ` (${url.description})` : ""}
                </a>
                {!editing && <button onClick={() => setEditing(true)}>Edit</button>}
            </div>
            {editing && (
                <>
                    <p className="destination">{url.longUrl}</p>
                    <div className="edit-grid">
                        <label>
                            Slug
                            <input maxLength={100} value={slug} onChange={(event) => setSlug(event.target.value)} />
                        </label>
                        <label>
                            Description <span className={wordCount > 10 ? "limit-error" : ""}>{wordCount}/10 words</span>
                            <input
                                maxLength={160}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Add a short description"
                            />
                        </label>
                    </div>
                    <div className="edit-metadata">
                        <span>Created <time dateTime={url.createTime}>{new Date(url.createTime).toLocaleDateString()}</time></span>
                        <span>Last edited {url.updatedTime
                            ? <time dateTime={url.updatedTime}>{new Date(url.updatedTime).toLocaleDateString()}</time>
                            : "Never"}</span>
                    </div>
                    <div className="item-actions">
                        <button className="secondary-button" onClick={() => {
                            setSlug(url.slug);
                            setDescription(url.description);
                            setEditing(false);
                        }}>Cancel</button>
                        <button disabled={wordCount > 10} onClick={handleSave}>Save changes</button>
                        <button className="danger-button" onClick={onDelete}>Delete</button>
                    </div>
                </>
            )}
        </article>
    );
}

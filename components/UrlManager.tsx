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
    const [profileMessage, setProfileMessage] = useState("");
    const [urlMessage, setUrlMessage] = useState("");
    const [deleting, setDeleting] = useState<ManagedUrl | null>(null);
    const [deleteDialogClosing, setDeleteDialogClosing] = useState(false);

    async function saveProfile() {
        const response = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const body = await response.json();
        setProfileMessage(response.ok ? "Username saved." : body.error);
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
        setUrlMessage(response.ok ? "URL updated." : body.error);
        if (response.ok) router.refresh();
        return response.ok;
    }

    async function deleteUrl() {
        if (!deleting) return;
        const response = await fetch(`/api/urls/${deleting.id}`, { method: "DELETE" });
        setUrlMessage(response.ok ? "URL deleted." : "Unable to delete this URL.");
        closeDeleteDialog();
        if (response.ok) router.refresh();
    }

    function closeDeleteDialog() {
        if (deleteDialogClosing) return;

        setDeleteDialogClosing(true);
        window.setTimeout(() => {
            setDeleting(null);
            setDeleteDialogClosing(false);
        }, 180);
    }

    function serializedUrls() {
        const origin = window.location.origin;
        return JSON.stringify(urls.map((url) => ({
            slug: url.slug,
            shortUrl: `${origin}/${url.slug}`,
            destinationUrl: url.longUrl,
            description: url.description || null,
            createdAt: url.createTime,
            updatedAt: url.updatedTime,
        })), null, 2);
    }

    function downloadUrls() {
        const blob = new Blob([serializedUrls()], { type: "application/json" });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "saved-shortened-urls.json";
        link.click();
        URL.revokeObjectURL(objectUrl);
        setUrlMessage("JSON file downloaded.");
    }

    async function copyUrls() {
        try {
            await navigator.clipboard.writeText(serializedUrls());
            setUrlMessage("JSON copied to clipboard.");
        } catch {
            setUrlMessage("Unable to copy JSON. Check your browser permissions.");
        }
    }

    return (
        <section className="manager" aria-labelledby="saved-urls-title">
            <div className={`profile-row${editingName ? " is-editing-profile" : ""}`}>
                <div className="profile-identity">
                    <h2>Your account</h2>
                    <div className="profile-details">
                        <p className="displayed-name">{savedName}</p>
                        <p>{email}</p>
                    </div>
                    {profileMessage && <p className="profile-status status-message" role="status">{profileMessage}</p>}
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
                <div>
                    <h2 id="saved-urls-title">Your shortened URLs</h2>
                    <span>{urls.length} saved</span>
                </div>
                <div className="export-actions" aria-label="Export saved URLs">
                    <button disabled={urls.length === 0} onClick={downloadUrls}>Download JSON</button>
                    <button disabled={urls.length === 0} onClick={copyUrls}>Copy JSON</button>
                </div>
            </div>
            {urlMessage && <p className="status-message" role="status">{urlMessage}</p>}
            {urls.length === 0 ? (
                <p className="empty-state">Your saved URLs will appear here after you compact one.</p>
            ) : (
                <div className="url-list">
                    {urls.map((url) => <UrlEditor
                        key={url.id}
                        url={url}
                        onSave={saveUrl}
                        onDelete={() => {
                            setDeleteDialogClosing(false);
                            setDeleting(url);
                        }}
                    />)}
                </div>
            )}
            {deleting && (
                <div className={`modal-backdrop${deleteDialogClosing ? " is-closing" : ""}`} role="presentation">
                    <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
                        <h2 id="delete-title">Delete shortened URL?</h2>
                        <p>This permanently removes <strong>/{deleting.slug}</strong>. Existing links will stop working.</p>
                        <div className="dialog-actions">
                            <button className="secondary-button" onClick={closeDeleteDialog}>Cancel</button>
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
    const [copied, setCopied] = useState(false);

    const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

    async function handleSave() {
        if (wordCount > 10) return;
        if (await onSave(url, slug, description)) setEditing(false);
    }

    async function handleCopy() {
        const shortUrl = new URL(`/${url.slug}`, window.location.origin).href;

        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    return (
        <article className={`url-item${editing ? " is-editing" : ""}`}>
            <div className="url-summary">
                <a href={`/${url.slug}`} target="_blank" rel="noreferrer">
                    {url.description
                        ? `${url.description} (slug: /${url.slug})`
                        : `slug: /${url.slug}`}
                </a>
                {!editing && <button className="row-edit-button" onClick={() => setEditing(true)}>Edit</button>}
                <button className="row-copy-button" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div
                className={`url-edit-panel${editing ? " is-open" : ""}`}
                aria-hidden={!editing}
            >
                <form className="url-edit-panel-inner" onSubmit={(event) => {
                    event.preventDefault();
                    handleSave();
                }}>
                    <p className="destination">{url.longUrl}</p>
                    <div className="edit-grid">
                        <label>
                            <span className="edit-label-row">Slug</span>
                            <input
                                maxLength={100}
                                value={slug}
                                onChange={(event) => setSlug(event.target.value)}
                            />
                        </label>
                        <label>
                            <span className="edit-label-row">
                                <span>Description</span>
                                <span className={wordCount > 10 ? "limit-error" : ""}>{wordCount}/10 words</span>
                            </span>
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
                        <button type="button" className="danger-button" onClick={onDelete}>Delete</button>
                        <button type="button" className="secondary-button" onClick={() => {
                            setSlug(url.slug);
                            setDescription(url.description);
                            setEditing(false);
                        }}>Cancel</button>
                        <button type="submit" disabled={wordCount > 10}>Save changes</button>
                    </div>
                </form>
            </div>
        </article>
    );
}

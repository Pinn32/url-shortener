import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <section className={styles.notFound} aria-labelledby="not-found-title">
            <p className={styles.code}>404</p>
            <div className={styles.message}>
                <h1 id="not-found-title">Short link, long gone.</h1>
                <p>
                    The page or shortened URL you requested does not exist.
                </p>
            </div>
            <Link className={styles.homeLink} href="/">
                Back to URL Shortener
            </Link>
        </section>
    );
}
